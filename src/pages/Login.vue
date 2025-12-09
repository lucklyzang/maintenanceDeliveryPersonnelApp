<template>
	<div class="container">
    	<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<van-dialog v-model="modalShow" :title="modalContent"
		 show-cancel-button @confirm="sureCancel" @cancel="cancelSure">
		</van-dialog>
		<!-- 院区 -->
		<div class="transport-rice-box" v-show="showHospitalCampus">
			<ScrollSelection buttonLocation='top' v-model="showHospitalCampus" :pickerValues="hospitalCampusDefaultIndex" :isShowSearch="false" :columns="hospitalCampusOption" @sure="hospitalCampusSureEvent" @cancel="hospitalCampusCancelEvent" @close="hospitalCampusCloseEvent" />
		</div>
		<div class="top-background-area">
			<img src="@/common/images/home/login-background-image.png" />
			<div class="title-area">
				<img src="@/common/images/home/login-icon.png" />
				<span>智 慧 后 勤 服 务 平 台</span>
			</div>
		</div>
		<div class="container-content">
			<div class="form-box">
				<van-field
					left-icon="contact"
          			:border="false"
					placeholder="请输入账号"
					v-model="form.username"
					type="text"
					clearable
				>
				</van-field>
				<van-field
					left-icon="lock"
          			:border="false"
					placeholder="请输入密码"
					v-model="form.password"
					type="password"
					clearable
				>
				</van-field>
			</div>
      <div class="remember-password">
        <div class="remember-password-content">
          <van-checkbox v-model="checked" checked-color="#1864FF">记住账户密码</van-checkbox>
         </div>
      </div>
	<div class="form-btn">
        <div v-preventReClick @click="sure">登 录</div>
	</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { logIn, getTemplateType, getdepartmentList, getdepartmentListNo,registerChannel, getAppPermission } from '@/api/login.js'
	import { getProjectdepartmentListNo, registerProjectChannel } from '@/api/project/login.js'
	import { setStore, getStore, removeStore,IsPC } from '@/common/js/utils'
	import ScrollSelection from "@/components/ScrollSelection";
  	import Qs from 'qs'
	export default {
	components: {
		ScrollSelection,
	},
		data() {
			return {
				showLoadingHint: false,
				infoText: '登录中···',
				form: {
					username: '',
					password: ''
				},
                checked: false,
				hospitalCampusDefaultIndex: 0,
				hospitalCampusOption: [],
				showHospitalCampus: false,
				currentHospitalCampusSpaces: '请选择',
				
				rememberAccountMessage: false,
				modalShow: false,
				modalContent: '',
				temporaryUsername: '',
				proId: '',
				deviceNumber: ''
			}
		},
		computed: {
			...mapGetters([
				'chooseHospitalArea',
				'userInfo',
				'baseURL'
			])
		},
		mounted () {
			this.form.username = getStore('userName') ? getStore('userName') : '';
			this.form.password = getStore('userPassword') ? getStore('userPassword') : '';
			// 监控键盘弹起
			// let originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
			// window.onresize = ()=> {
			// 	let resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
			// 	if (resizeHeight < originalHeight) {
			// 		return (()=>{
			// 		this.$refs['bgIconWrapper'].style.cssText='flex:none;height:220px'
			// 		})()
			// 	} else {
			// 		this.$refs['bgIconWrapper'].style.cssText='flex:1;height:0'
			// 	}
			// };
			let me = this;
			window['setDeviceInfo'] = (val) => {
				me.setDeviceInfo(val);
			};
		},
		methods: {
			...mapMutations([
				'storeUserInfo',
				'changeOverDueWay',
				'changeTemplateType',
				'changeToken',
				'changeIsLogin',
				'storeChooseHospitalArea',
				'changeIsMedicalMan',
				'storeAppPermission',
				'changeUserType',
				'changeIsNewCircle',
				'changeRoleNameList'
			]),
      
			// 院区下拉选择框确认事件
			hospitalCampusSureEvent (val,value,id) {
				if (val) {
					this.hospitalCampusDefaultIndex = id;
					this.currentHospitalCampusSpaces =  val;
					this.storeChooseHospitalArea({
						text: val,
						value,
						id
					});
					this.loginHandle();
				} else {
					this.hospitalCampusDefaultIndex = '';
					this.currentGoalSpaces = '请选择'
				};
				this.showHospitalCampus = false
			},
			
			// 院区下拉选择框取消事件
			hospitalCampusCancelEvent () {
				this.showHospitalCampus = false
			},
			
			// 院区下拉选择框关闭事件
			hospitalCampusCloseEvent () {
				this.showHospitalCampus = false
			},

			// 获取科室字典id(中央运送)
			queryDepartmentList () {
				return new Promise((resolve,reject) => {
					this.showLoadingHint = true;
					this.infoText = '查询中···';
					getdepartmentList(this.chooseHospitalArea['value']).then((res) => {
						this.showLoadingHint = false;
						this.infoText = '';
						if (res && res.data.code == 200) {
							resolve(res.data.data);
							setStore('departmentInfo', res.data.data);
						} else {
							this.$dialog.alert({
								message: `${res.data.msg}`,
								closeOnPopstate: true
							}).then(() => {})
						};
						this.showLoadingHint = false;
						reject(res.data.msg);
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					})
				})
			},

			// 获取科室字典编号(中央运送)
			queryDepartmentListNo () {
				return new Promise((resolve,reject) => {
					this.showLoadingHint = true;
					this.infoText = '查询中···';
					getdepartmentListNo(this.chooseHospitalArea['value']).then((res) => {
					this.showLoadingHint = false;
					this.infoText = '';
					if (res && res.data.code == 200) {
							resolve(res.data.data);
							setStore('departmentInfoNo', res.data.data);
						} else {
							reject(res.data.msg);
							this.$dialog.alert({
								message: `${res.data.msg}`,
								closeOnPopstate: true
							}).then(() => {})
						}
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					})
				})
			},

			// 注册channel(中央运送)
			getChannel (data) {
				return new Promise((resolve,reject) => {
					this.showLoadingHint = true;
					this.infoText = '注册中···';
					registerChannel(data)
					.then((res) => {
						this.showLoadingHint = false;
						this.infoText = '';
						resolve()
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					})
				})
			},

			// 向客户端发送信标服务器地址(中央运送)
			postUrl (workerId) {
				return new Promise((resolve,reject) => {
					let xinbiaoTimer = setTimeout(window.android.setPostUrl(`${this.baseURL}/trans/workerPositionLog/save/${workerId}`),100);
					if (window.android.setPostUrl(`${this.baseURL}/trans/workerPositionLog/save/${workerId}`) == 'success') {
						resolve(window.android.setPostUrl(`${this.baseURL}/trans/workerPositionLog/save/${workerId}`));
						clearTimeout(xinbiaoTimer)
					} else {
						this.$toast({
							type: 'fail',
							message: '设置失败'
						});
						reject()
					}
				})
			},

			// 调取安卓方法发送地址(设备巡检巡检任务信标打卡需要)
			equipmentPatrolPostUrl (workerId) {
				return new Promise((resolve,reject) => {
					let setUrl = `${this.baseURL}/nblink/hospital/beaconRecord/save/${workerId}?proId=${this.chooseHospitalArea['value']}&system=6`;
					let quipmentPatrolXinbiaoTimer = setTimeout(window.android.setPostUrl(setUrl),100);
					if (window.android.setPostUrl(setUrl) == 'success') {
						resolve(window.android.setPostUrl(setUrl));
						clearTimeout(quipmentPatrolXinbiaoTimer)
					} else {
						this.$toast({
							type: 'fail',
							message: '设置失败'
						});
						reject()
					}
				})
			},

			// 获取用户权限
			getappPermissionEvent () {
				return new Promise((resolve,reject) => {
					this.showLoadingHint = true;
					this.infoText = '查询中···';
					getAppPermission(this.userInfo['worker']['account'])
					.then((res) => {
						this.showLoadingHint = false;
						this.infoText = '';
						if (res && res.data.code == 200) {
							resolve();
							this.storeAppPermission(res.data.data);
							// 保存是否为新循环任务
							if (res.data.data.circle == 1) {
								this.changeIsNewCircle(true);
								setStore('isNewCircle',{isNewCircle: true})
							} else {
								this.changeIsNewCircle(false);
								setStore('isNewCircle',{isNewCircle: false})
							}
						} else {
							reject(res.data.msg);
							this.$dialog.alert({
								message: `${res.data.msg}`,
								closeOnPopstate: true
							}).then(() => {})
						}
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					})
				})
			},
				
			// 账号密码事件
			sure () {
				if (this.form.username === '' || this.form.password === '') {
					this.$toast({
						message: '账号或密码不能为空'
					});
					return;
				};
				return new Promise((resolve,reject)=> {
					let loginMessage = Qs.stringify({
						username: this.form.username,
						password: this.form.password,
						logType: 0
					});
					this.temporaryUsername = getStore('userName') ? getStore('userName') : '无';
					this.showLoadingHint = true;
					this.infoText = '登录中···';
					logIn(loginMessage).then((res) => {
						this.showLoadingHint = false;
						this.infoText = '';
						if (res) {
							if (res.data.code == 200) {
								resolve(res.data.data)
								this.changeOverDueWay(false);
								setStore('storeOverDueWay',false); 
								// 登录用户名密码及用户信息存入Locastorage
								// 判断是否勾选记住用户名密码
								if (this.checked) {
									setStore('userName', this.form.username);
									setStore('userPassword', this.form.password);
								} else {
									removeStore('userName');
									removeStore('userPassword');
								};
								// 登录用户信息存入store
								this.changeIsLogin(true);
								this.storeUserInfo(res.data.data);
								// 存入用户角色列表
								this.changeRoleNameList(res.data.data.roleNameList);
								this.hospitalCampusOption = [];
								this.changeIsMedicalMan(false);
								if (this.userInfo['worker']['hospitalList'].length > 1) {
									for (let i = 0;i<this.userInfo['worker']['hospitalList'].length;i++) {
										this.hospitalCampusOption.push({
											value: this.userInfo['worker']['hospitalList'][i]['id'],
											text: this.userInfo['worker']['hospitalList'][i]['name'],
											id: i
										})
									};
									this.showHospitalCampus = true;
									this.hospitalCampusDefaultIndex = 0;
								} else {
									this.storeChooseHospitalArea({
										value: this.userInfo['worker']['hospitalList'][0]['id'],
										text: this.userInfo['worker']['hospitalList'][0]['name'],
										id: 0
									});
									this.loginHandle()
								}
							} else {
								reject(res.data.msg);
								this.modalShow = true;
								this.modalContent = `${res.data.msg}`
							}
						}
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.modalShow = true;
						this.modalContent = err;
					})
				})	
			},
			
			// 查询模板类型
			queryTemplateType (data) {
			  	this.showLoadingHint = true;
				this.infoText = '查询中···';
			  	getTemplateType(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						// 保存模板类型
						if (res.data.data) {
							this.changeTemplateType(res.data.data);
						}
					   this.$router.push({ path: "/home" })
					} else {
						this.modalShow = true;
						this.modalContent = `${res.data.msg}`
					}
			  })
			  .catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = err.message;
			  })
			},

			// 获取科室信息字典值(工程维修)
			queryProjectDepartmentMsg (proId) {
				this.showLoadingHint = true;
				this.infoText = '查询中···';
				return new Promise((resolve,reject) => {
					getProjectdepartmentListNo(proId).then((res) => {
						this.showLoadingHint = false;
						this.infoText = '';
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						} else {
							reject(res.data.msg);
							this.$dialog.alert({
								message: `${res.data.msg}`,
								closeOnPopstate: true
							}).then(() => {})
						}
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					})
				})
			},

			//获取设备编号(工程维修)
			getDeviceNumber () {
				window.android.getDeviceInfo()
			},

			//获取设备编号回调(工程维修)
			setDeviceInfo (val) {
				this.deviceNumber = val.IMEI
			},

			// 注册channel(工程维修)
			getProjectChannel (data) {
				this.showLoadingHint = true;
				this.infoText = '注册中···';
				return new Promise((resolve,reject) => {
					registerProjectChannel(data)
					.then((res) => {
						this.showLoadingHint = false;
						this.infoText = '';
						resolve()
					})
					.catch((err) => {
						reject(err);
						this.showLoadingHint = false;
						this.infoText = '';
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					})
				})
			},

			// 登录事件
			async loginHandle () {
				// 用户身份类别存入store和Locastorage
				this.changeUserType(0);
				setStore('userType', 0);
				if (!IsPC()) {
					// 注册channel(中央运送)
					if (window.android.getChannelId()) {
						try {
							await this.getChannel({
								proId: this.chooseHospitalArea['value'],
								workerId: this.userInfo['worker'].id,
								type: 0,
								channelId: window.android.getChannelId()
							})
						} catch (err) {
							this.$dialog.alert({
								message: `${err.message}`,
								closeOnPopstate: true
							}).then(() => {
							})
						}
					} else {
						this.$toast('未获取到channelId')
					};
					// 向客户端发送信标服务器地址(中央运送)
					try {
						let xinbiaoInfo = await this.postUrl(this.userInfo['worker'].id);
					} catch (err) {
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					};
					// 调取安卓方法发送地址(设备巡检巡检任务信标打卡需要)
					try {
						let equipmentPatrolXinbiaoInfo = await this.equipmentPatrolPostUrl(this.userInfo['worker'].id);
					} catch (err) {
						this.$dialog.alert({
							message: `${err}`,
							closeOnPopstate: true
						}).then(() => {})
					};
					// 注册channel(工程维修)
					if (window.android.getChannelId()) {
						try {
							await this.getProjectChannel({
								proId: this.chooseHospitalArea['value'],
								workerId: this.userInfo['worker'].id,
								type: 2,
								channelId: window.android.getChannelId()
							});
						} catch (err) {
							this.$dialog.alert({
								message: `${err.message}`,
								closeOnPopstate: true
							}).then(() => {})
						}
					} else {
						this.$toast('未获取到channelId')
					}
				};
				try {
					// 获取用户权限
					await this.getappPermissionEvent();
					// 获取科室字典id
					await this.queryDepartmentList();
					// 获取科室字典编号
					await this.queryDepartmentListNo();
					// 如果当前登录用户和上次登录用户不一致，则清除循环任务完成标本采集的科室信息
					if (this.temporaryUsername != this.username) {
						removeStore('completeDepartmentMessage')
					};
					// 工程维修
					const resultTwo = await this.queryProjectDepartmentMsg(this.chooseHospitalArea['value']);
					setStore('departmentMessage', resultTwo);
					// 查询模板类型
					this.queryTemplateType(this.chooseHospitalArea['value']);
				} catch (err) {
					this.$dialog.alert({
						message: `${err}`,
						closeOnPopstate: true
					}).then(() => {})
				}
			},
			
			// 弹框确定事件
			sureCancel () {
				this.modalShow = false;
			},
			
			// 弹框取消事件
			cancelSure () {
				this.modalShow = false;
			}
		}
	}
</script>

<style lang="less" scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
	.container {
		.content-wrapper();
		font-size: 14px;
		padding-top: 50vh;
		box-sizing: border-box;
		.top-background-area {
			width: 100%;
			height: 50vh;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10;
			>img {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
        height: 100%;
			};
			.title-area {
				width: 100%;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%,-50%);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				>img {
					width: 64px;
				};
				>span {
					margin-top: 22px;
					font-size: 20px;
					color: #fff
				}
			}
		};
		.container-content {
			height: 50vh;
			background: #fff;
			position: relative;
			padding-top: 40px;
			box-sizing: border-box;
			.form-box {
        width: 80%;
        margin: 0 auto;
				/deep/ .van-cell {
          height: 40px;
          padding: 0 10px;
          box-sizing: border-box;
          border-bottom: 1px solid #B6B6B6;
          .van-field__left-icon {
            margin-right: 10px;
            .van-icon {
              font-size: 22px;
              color: #B6B6B6;
            }
          };
          .van-cell__value {
            font-size: 16px;
            color: #B6B6B6;
            .van-field__control {
              color: #B6B6B6 !important;
            }
          };
          &:first-child {
            margin-bottom: 20px;
          }
        }
			};
      .remember-password {
        width: 80%;
        margin: 0 auto;
        height: 20px;
				margin-top: 20px;
        position: relative;
        .remember-password-content {
          position: absolute;
          top: 0;
          right: 0;
          /deep/ .van-checkbox {
            .van-checkbox__label {
              font-size: 14px;
              color: #565656;
            }
          }
        }
      };
			.form-btn {
        width: 75%;
        margin: 0 auto;
        margin-top: 50px;
				>div {
					height: 48px;
					line-height: 48px;
          text-align: center;
					font-size: 16px;
          color: #fff;
          background: linear-gradient(to right, #6ED3F7,#218FFF);
          border-radius: 26px;
					box-shadow: 0pt 2pt 6pt 0pt rgba(36,149,213,1);
				}
			}
		}
	}
</style>
