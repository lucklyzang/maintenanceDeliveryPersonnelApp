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
			<img src="@/common/img/login-background-image.png" />
			<div class="title-area">
				<img src="@/common/img/login-icon.png" />
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
        <div @click="sure">登 录</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import { logIn, getTemplateType } from '@/api/login.js'
	import { setCache, getCache, removeCache } from '@/common/js/utils'
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
				hospitalCampusDefaultIndex: [0],
				hospitalCampusOption: [],
				showHospitalCampus: false,
				currentHospitalCampusSpaces: '请选择',
				
				rememberAccountMessage: false,
				modalShow: false,
				modalContent: ''
			}
		},
		onReady () {
		},
		computed: {
			...mapGetters([
				'chooseHospitalArea',
				'userInfo',
			])
		},
		onShow () {
			 this.form.username = getCache('userName') ? getCache('userName') : '';
			 this.form.password = getCache('userPassword') ? getCache('userPassword') : '';
		},
		methods: {
			...mapMutations([
				'storeUserInfo',
				'changeOverDueWay',
				'changeTemplateType',
				'changeToken',
				'changeIsLogin',
				'storeChooseHospitalArea',
				'changeIsMedicalMan'
			]),
      
			// 院区下拉选择框确认事件
			hospitalCampusSureEvent (val,value,id) {
				if (val) {
					this.hospitalCampusDefaultIndex = [id]
					this.currentHospitalCampusSpaces =  val;
					this.storeChooseHospitalArea({
						text: val,
						value,
						id
					});
					this.queryTemplateType(this.chooseHospitalArea['value'])
				} else {
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
          
			// 账号密码事件
			sure () {
				if (this.form.username === '' || this.form.password === '') {
					this.$toast({
						message: '账号或密码不能为空'
					});
					return;
				};
				let loginMessage = Qs.stringify({
				  username: this.form.username,
				  password: this.form.password,
				  logType: 1
				});
				this.showLoadingHint = true;
				logIn(loginMessage).then((res) => {
					this.showLoadingHint = false;
					if (res) {
					  if (res.data.code == 200) {
						   this.changeOverDueWay(false);
						   setCache('storeOverDueWay',false); 
							// 登录用户名密码及用户信息存入Locastorage
							// 判断是否勾选记住用户名密码
							if (this.checked) {
								setCache('userName', this.form.username);
								setCache('userPassword', this.form.password);
							} else {
								removeCache('userName', this.form.username);
								removeCache('userPassword', this.form.password);
							};
							// 登录用户信息存入store
							this.changeIsLogin(true);
							this.storeUserInfo(res.data.data);
							if (this.userInfo['worker']['hospitalList'].length > 1) {
								for (let i = 0;i<this.userInfo['worker']['hospitalList'].length;i++) {
									this.hospitalCampusOption.push({
										value: this.userInfo['worker']['hospitalList'][i]['hospitalId'],
										text: this.userInfo['worker']['hospitalList'][i]['hospitalName'],
										id: i
									})
								};
								this.showHospitalCampus = true;
							} else {
								this.storeChooseHospitalArea({
									text: this.userInfo['worker']['hospitalList'][0]['hospitalName'],
									value: this.userInfo['worker']['hospitalList'][0]['hospitalId'],
									id: 0
								});
								this.queryTemplateType(this.chooseHospitalArea['value'])
							};	
							this.changeIsMedicalMan(false)
					  } else {
						this.modalShow = true;
						this.modalContent = `${res.data.msg}`
					  }
					};
				  })
				  .catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = err;
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
						};
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
