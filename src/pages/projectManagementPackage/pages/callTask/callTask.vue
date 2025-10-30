<template>
	<div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<van-overlay :show="overlayShow" />
		<van-loading size="24px" vertical v-if="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
			<div class="nav">
				<NavBar title="任务呼叫" path="/home" leftText="首页" />
			</div>
		</div>
		<van-dialog v-model="sureCancelShow" title="确定删除此图片?" :close-on-click-overlay="true"  @close="deleteInfoDialogShow = false"
		  show-cancel-button @confirm="sureCancel" @cancel="cancelSure" confirm-button-color="#3890EE">
		</van-dialog>
		<!-- 目的科室 -->
		<div class="transport-rice-box" v-if="showGoalDepartment">
			<ScrollSelection v-model="showGoalDepartment" :pickerValues="goalDepartmentDefaultIndex" :columns="goalDepartmentOption" title="目的科室" @sure="goalDepartmentSureEvent" @cancel="goalDepartmentCancelEvent" @close="goalDepartmentCloseEvent" :isShowSearch="true" />
		</div>
		<!-- 目的房间 -->
		<div class="transport-rice-box" v-if="showGoalSpaces">
			<ScrollSelection v-model="showGoalSpaces" :pickerValues="goalSpacesDefaultIndex" :columns="goalSpacesOption" title="目的房间" :currentSelectData="currentGoalSpaces" @sure="goalSpacesSureEvent" @cancel="goalSpacesCancelEvent" @close="goalSpacesCloseEvent" :isShowSearch="true" />
		</div>
		<!-- 任务类型 -->
		<div class="transport-rice-box" v-if="showTaskType">
			<ScrollSelection v-model="showTaskType" :pickerValues="taskTypeDefaultIndex" :isShowSearch="true" :columns="taskTypeOption" title="任务类型" @sure="taskTypeSureEvent" @cancel="taskTypeCancelEvent" @close="taskTypeCloseEvent" />
		</div>
		<div class="content-box-inner">
			<div class="message-box">
				<div class="message-one">
					<div class="message-one-left">
						优先级
					</div>
					<div class="message-one-right">
						<van-radio-group v-model="priorityRadioValue" direction="horizontal">
							<van-radio name="1" checked-color="#289E8E">正常</van-radio>
							<van-radio name="2" checked-color="#F2A15F">重要</van-radio>
							<van-radio name="3" checked-color="#E8CB51">紧急</van-radio>
							<van-radio name="4" checked-color="#E86F50">紧急重要</van-radio>
						</van-radio-group>
					</div>
				</div>
				<div class="select-box end-select-box">
					<div class="select-box-left">
						<span>科室选择</span>
					</div>
					<div class="select-box-right" @click="goalDepartmentClickEvent">
						<span>{{ currentGoalDepartment }}</span>
						<van-icon name="arrow" color="#989999" size="20" />
					</div>
				</div>
				<div class="select-box end-select-box">
					<div class="select-box-left">
						<span>目的房间</span>
					</div>
					<div class="select-box-right" @click="goalSpacesClickEvent">
						<span>{{ currentGoalSpaces }}</span>
						<van-icon name="arrow" color="#989999" size="20" />
					</div>
				</div>
				<div class="select-box">
					<div class="select-box-left">
						<span>*</span>
						<span>任务类型</span>
					</div>
					<div class="select-box-right" @click="showTaskType = true">
						<span>{{ currentTaskType }}</span>
						<van-icon name="arrow" color="#989999" size="20" />
					</div>
				</div>
				<div class="div-photoList">
					<div>
						<span>问题拍照</span>
					</div>
					<div>
						<div v-for="(item, index) in imgArr" :key='index'>
							<img :src="item" />
							<van-icon name="cross" size="20" color="#000000" @click="photoDelete(item,index)" />
						</div>
						<div>
							<img class="" src="@/common/img/plus.png"  @click="getImg" />
						</div>
					</div>
				</div>
				<div class="task-describe transport-type">
					<div class="transport-type-left">
						<span>任务描述</span>
					</div>
					<div class="transport-type-right">
						<van-field
							v-model="taskDescribe"
							rows="3"
							autosize
							show-word-limit
							maxlength="500" 
							placeholder="请输入任务描述"
							type="textarea"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="btn-box">
			<span class="operate-one" @click="resetEvent">重置</span>
			<span class="operate-two" @click="sureEvent">提交</span>
		</div>
		<div class="tab-bar">
			<van-tabbar v-model="valueName" @change="tabBarEvent" active-color="#1684FC" inactive-color="#666666">
				<van-tabbar-item>
					<span>呼叫</span>
					<template #icon="props">
						<img :src="props.active ? require('@/common/img/call-active-icon.png') : require('@/common/img/call-inactive-icon.png')" />
					</template>
				</van-tabbar-item>
				<van-tabbar-item>
					<span>实时任务</span>
					<template #icon="props">
						<img :src="props.active ? require('@/common/img/real-timetask-active-icon.png') : require('@/common/img/real-timetask-inactive-icon.png')" />
					</template>
				</van-tabbar-item>
				<van-tabbar-item>
					<span>历史任务</span>
					<template #icon="props">
						<img :src="props.active ? require('@/common/img/historical-task-active-icon.png') : require('@/common/img/historical-task-inactive-icon.png')" />
					</template>
				</van-tabbar-item>
			</van-tabbar>
		</div>
		<transition name="van-slide-up">
			<div class="choose-photo-box" v-if="photoBox">
			<div class="choose-photo">
				<van-icon name="photo" />
				<input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>从图库中选择
			</div>
			<div class="photo-graph">
				<van-icon name="photograph" />
				<input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
			</div>
			<div class="photo-cancel" @click="photoCancel">取消</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		queryTaskType,
		queryAllDestination,
		departmentRoom,
		reportProblem,
		getRemarks,
		querySpace
	} from '@/api/project.js'
	import { compress } from '@/common/js/utils'
	import NavBar from "@/components/NavBar";
	import _ from 'lodash'
	import ScrollSelection from "@/components/ScrollSelection";
	export default {
		components: {
			NavBar,
			ScrollSelection
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				valueName: 0,
				overlayShow: false,
				photoBox: false,
				materialShow: false,
				deleteInfoPng: require('@/common/img/delete-info.png'),
				materialDeleteShow: false,
				deleteMaterialIndex: '',
				loadingShow: false,
				deleteMaterial: '',
				searchValue: '',
				problemOverview: '',
				taskDescribe: '',
				transportNumberValue: '',
				imgArr: [],
				imgIndex: '',
				sureCancelShow: false,
				
				goalDepartmentOption: [],
				goalDepartmentDefaultIndex: 0,
				showGoalDepartment: false,
				currentGoalDepartment: '请选择',
	
				goalSpacesOption: [],
				showGoalSpaces: false,
				goalSpacesDefaultIndex: 0,
				currentGoalSpaces: '请选择',
	
				taskTypeOption: [],
				taskTypeDefaultIndex: 0,
				showTaskType: false,
				currentTaskType: '请选择',
	
				priorityRadioValue: '1'
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				"templateType",
				'chooseHospitalArea',
				'isMedicalMan'
			]),
			userName() {
			return this.userInfo['worker']['name']
			},
			workerId() {
				return this.userInfo['worker']['id']
			},
			proName () {
				return this.chooseHospitalArea['text']
			},
			proId() {
				return this.chooseHospitalArea['value']
			},
			depId() {
				return this.userInfo['worker']['departments'].length == 0 ? '' : this.userInfo['worker']['departments'][0]['id']
			},
			depName() {
				return this.userInfo['worker']['departments'].length == 0 ? '' : this.userInfo['worker']['departments'][0]['name']
			},
			userAccount() {
				return this.userInfo['worker']['account']
			}
		},
		mounted () {
			// 控制设备物理返回按键
			if (!IsPC()) {
				pushHistory();
				this.gotoURL(() => {
					pushHistory();
					this.$router.push({
						path: '/home',
					})
				})
			};
			this.parallelFunction();
			if (this.isMedicalMan) {
				this.currentGoalDepartment = this.depName == '' ? '请选择' :  this.depName;
				if (this.depName) {
					this.goalDepartmentDefaultIndex = this.goalDepartmentOption.findIndex((item) => { return item.text == this.depName });
				};
				// 登陆人员为医务人员时，根据默认科室id查询目的房间列表
				if (this.depId) {
					this.getSpacesByDepartmentId(this.depId)
				}
			}
		},
		methods: {
			...mapMutations([
				'storeCurrentIndex'
			]),
			
			// 顶部导航返回事件
			backTo () {
				this.$router.push({ path: "/home"})
			},
			
			// 弹框确定按钮
			sureCancel() {
				this.sureCancelShow = false;
				this.imgArr.splice(this.imgIndex, 1)
			},
			// 弹框取消按钮
			cancelSure() {
				this.sureCancelShow = false;
			},
			
			// 图片删除事件
			photoDelete(item, index) {
				this.sureCancelShow = true;
				this.imgIndex = index
			},

			// 拍照问题照片点击
			getImg () {
				this.photoBox = true;
				this.overlayShow = true
			},

			// 图片上传预览
			previewFileOne() {
				let Orientation;
				let file = document.getElementById("demo1").files[0];
				let _this = this;
				let reader = new FileReader();
				let index = file['name'].lastIndexOf(".");
				//获取后缀
				let jpgUrl = file['name'].substr(index + 1);
				if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
					that.$dialog.alert({
						message: '只可上传jpg或png格式的图片!',
						closeOnPopstate: true
					}).then(() => {
					});
					return
				};
				let isLt2M = file.size/1024/1024 < 10;
				if (!isLt2M) {
					this.$dialog.alert({
						message: '上传图片大小不能超过10MB!',
						closeOnPopstate: true
					}).then(() => {
					});
					return
				};  
				reader.addEventListener("load", function () {
					_this.photoCancel();
					// 压缩图片
					let result = reader.result;
					let img = new Image();
					img.src = result;
					img.onload = function () {
						let src = compress(img,Orientation);
						_this.imgArr.push(src)
					}
				}, false);
				if (file) {
					reader.readAsDataURL(file);
				};
			},

			//拍照预览
			previewFileTwo() {
				let Orientation;
				let file = document.getElementById("demo2").files[0];
				let _this = this;
				let reader = new FileReader();
				let index = file['name'].lastIndexOf(".");
				//获取后缀
				let jpgUrl = file['name'].substr(index + 1);
				if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
					that.$dialog.alert({
						message: '只可上传jpg或png格式的图片!',
						closeOnPopstate: true
					}).then(() => {
					});
					return
				};
				let isLt2M = file.size/1024/1024 < 10;
				if (!isLt2M) {
					_this.$dialog.alert({
						message: '上传图片大小不能超过10MB!',
						closeOnPopstate: true
					}).then(() => {
					});
					return
				};  
				reader.addEventListener("load", function () {
					_this.photoCancel();
					// 压缩图片
					let result = reader.result;
					let img = new Image();
					img.src = result;
					img.onload = function () {
						let src = compress(img,Orientation);
						_this.imgArr.push(src)
					}
				}, false);
				if (file) {
					reader.readAsDataURL(file);
				};
			},

			// 拍照取消
			photoCancel () {
				this.photoBox = false;
				this.overlayShow = false
			},
			
			// 查询科室
			getAllDestination() {
				return new Promise((resolve, reject) => {
					queryAllDestination(this.proId).then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							} else {
								this.$dialog.alert({
									message: res.data.msg,
									closeOnPopstate: true
								}).then(() => {
								})
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},
			
			// 查询运送类型
			getTaskType(data) {
				return new Promise((resolve, reject) => {
					queryTaskType(data)
						.then((res) => {
							if (res && res.data.code == 200) {
								resolve(res.data.data)
							} else {
								this.$dialog.alert({
									message: res.data.msg,
									closeOnPopstate: true
								}).then(() => {
								})
							}
						})
						.catch((err) => {
							reject(err.message)
						})
				})
			},
			
				// 格式化时间
				getNowFormatDate(currentDate) {
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hour + seperator2 + minutes
				return currentdate
				},
				
				// 处理维修任务参与者
				disposeTaskPresent (item) {
					if (!item) { return '请选择'};
					if (item.length == 0) { return '请选择'};
					let temporaryArray = [];
					for (let innerItem of item) {
						temporaryArray.push(innerItem.text)
					};
					return temporaryArray.join('、')
				},

				// 根据科室查询房间信息
				getSpacesByDepartmentId (depId,flag) {
					this.showLoadingHint = true;
					this.goalSpacesOption = [];
					querySpace(this.proId,depId)
					.then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								for (let i = 0, len = res.data.data.length; i < len; i++) {
									this.goalSpacesOption.push({
										text: res.data.data[i].spaceName,
										value: res.data.data[i].id,
										id: i
									})
								}
							};
							if (flag) {this.showGoalSpaces = true}
						} else {
							this.$dialog.alert({
								message: res.data.msg,
								closeOnPopstate: true
							}).then(() => {
							})
						}
					})
					.catch((err) => {
						this.showLoadingHint = false;
						this.$dialog.alert({
							message: err,
							closeOnPopstate: true
						}).then(() => {
						})
					})
				},

				// 并行查询科室、任务类型
				parallelFunction () {
					this.showLoadingHint = true;
					Promise.all([this.getAllDestination(),this.getTaskType(
					{
							proId: this.proId,
							state: 0,
							parentId: ''
						}
					)
					])
					.then((res) => {
						this.showLoadingHint = false;
						if (res && res.length > 0) {
							this.taskTypeOption = [];
							this.goalDepartmentOption = [];
							let [item1,item2] = res;
							if (item1) {
								// 科室
								Object.keys(item1).forEach((item,index) => {
									this.goalDepartmentOption.push({
										text: item1[item],
										value: item,
										id: index
									})
								})
							};
							if (item2) {
								// 任务类型
								for (let i = 0, len = item2.length; i < len; i++) {
									this.taskTypeOption.push({
										text: item2[i].typeName,
										value: item2[i].id,
										id: i
									})
								}
							}
						}
					})
					.catch((err) => {
						this.showLoadingHint = false;
						this.$dialog.alert({
							message: err.message,
							closeOnPopstate: true
						}).then(() => {
						})
					})
				},

				// 任务类型下拉选择框确认事件
				taskTypeSureEvent (val,value,id) {
				if (val) {
					this.taskTypeDefaultIndex = id;
					this.currentTaskType =  val
				} else {
					this.currentTaskType = '请选择'
				};
				this.showTaskType = false
				},

				// 任务类型下拉选择框取消事件
				taskTypeCancelEvent () {
				this.showTaskType = false
				},

				// 任务类型下拉选择框关闭事件
				taskTypeCloseEvent () {
				this.showTaskType = false
				},

				// 目的科室下拉选择框确认事件
				goalDepartmentSureEvent (val,value,id) {
				if (val) {
					this.currentGoalDepartment =  val;
					this.currentGoalSpaces = '请选择';
					this.goalDepartmentDefaultIndex = id;
					this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],false)
				} else {
					this.currentGoalDepartment = '请选择'
				};
				this.showGoalDepartment = false
				},

				// 目的科室列点击事件
				goalDepartmentClickEvent () {
				 this.showGoalDepartment = true
				},

				// 目的科室下拉选择框取消事件
				goalDepartmentCancelEvent () {
				 this.showGoalDepartment = false
				},

				// 目的科室下拉选择框关闭事件
				 goalDepartmentCloseEvent () {
				this.showGoalDepartment = false
				},

				// 目的房间下拉选择框关闭事件
				goalSpacesCloseEvent () {
				 this.showGoalSpaces = false
				},

				// 目的房间列点击事件
				goalSpacesClickEvent () {
				if (this.currentGoalDepartment == '请选择') {
					this.$toast({message: '请选择科室'});
					} else {
						this.getSpacesByDepartmentId(this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'],true)
					}
				},

				// 目的房间下拉选择框确认事件
				goalSpacesSureEvent (val,value,id) {
				if (val.length > 0) {
					this.goalSpacesDefaultIndex = id;
					this.currentGoalSpaces =  val;
				} else {
					this.currentGoalSpaces = '请选择'
				};
				this.showGoalSpaces = false
				},

				// 目的房间下拉选择框取消事件
				goalSpacesCancelEvent () {
					this.showGoalSpaces = false
				},
				
				// 确认事件
				sureEvent () {
				// 任务类型不能为空
				if (this.currentTaskType == '请选择') {
					this.$toast({message: '任务类型不能为空'});
					return
				};
				// 创建工程维保任务
				let temporaryMessage = {
					typeId: this.taskTypeOption.filter((item) => { return item['text'] == this.currentTaskType})[0]['value'], // 任务类型id
					typeName: this.currentTaskType, // 任务类型名称
					depName: this.currentGoalDepartment == '请选择' ? '' : this.currentGoalDepartment, //科室名称
					depId: this.currentGoalDepartment == '请选择' ? '' : this.goalDepartmentOption.filter((item) => { return item['text'] == this.currentGoalDepartment})[0]['value'], // 目的科室id
					spaceId: this.currentGoalSpaces == '请选择' ? '' : this.goalSpacesOption.filter((item) => { return item['text'] == this.currentGoalSpaces})[0]['value'], //目的房间id
					space: this.currentGoalSpaces == '请选择' ? '' : this.currentGoalSpaces, //目的房间名称
					priority: this.priorityRadioValue,
					taskDesc: this.taskDescribe, //任务描述
					proId: this.proId,
					workerId: this.workerId,
					workerName: this.userAccount,
					images: this.imgArr, // 问题图片信息 非必输
					flag: this.isMedicalMan ? 1 : 0 // 上报人类型，0-维修人员，1-医护人员
				};
				this.postGenerateRepairsTask(temporaryMessage)
				},

				// 生成工程任务
				postGenerateRepairsTask (data) {
				this.infoText = '提交中···';
				this.showLoadingHint = true;
				reportProblem(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$Alert({message:"提交成功!",type:'success'});
						setTimeout(() => {
							this.backTo();
						},2000);
						this.resetEvent();
					} else {
						this.$Alert({message: res.data.msg, type:'success'});
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.$Alert({message: err, type:'error'});
				})
				},
				
				// 重置事件
				resetEvent () {
					this.priorityRadioValue = '1';
					this.goalDepartmentDefaultIndex = 0;
					this.currentGoalDepartment = '请选择';
					this.currentGoalSpaces = '请选择';
					this.taskTypeDefaultIndex = 0;
					this.currentTaskType = '请选择';
					this.imgArr = [];
					this.taskDescribe = []
				},
				
				// tabBar点击事件
				tabBarEvent (index) {
					this.valueName = index;
					if (this.valueName == 0) {
						this.$router.push({ path: "/projectCallTask" })
					} else if (this.valueName == 1) {
						this.$router.push({ path: "/projectRealtimeTask" })
					} else if (this.valueName == 2) {
						this.$router.push({ path: "/projectHistoricalTask" })
					}
			} 
		}
	}
</script>

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";	
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content-box {
		.content-wrapper();
		height: 100vh !important;
		box-sizing: border-box;
		background: #fff;
		/deep/ .van-overlay {
			z-index: 100 !important
		};
		.top-background-area {
			width: 100%;
			background: #3890EE;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10
		};
		.nav {
			width: 100%;
			/deep/ .tabBar-box {
				.van-nav-bar {
					.van-nav-bar__left {
						.van-icon {
							color: #fff !important;
							font-size: 20px !important;
						};
						.van-nav-bar__text {
							color: #fff !important;
							font-size: 14px !important;
							margin-left: 10px;
						}
					};
					.van-nav-bar__title {
						color: #fff !important;
						font-size: 14px !important;
					}
				}	
			}
		};
		.tab-bar {
			height: 51px;
			border: 1px solid #f1f1f1;
			/deep/ .van-tabbar {
				background: #F8F8F8;
				.van-tabbar-item--active {
					background: #F8F8F8;
				}
			}
		};
		.content-box-inner {
				width: 100%;
				height: 0;
				background: #f7f7f7;
				z-index: 10;
				flex: 1;
				overflow: auto;
				padding: 0 0 10px 0;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				::v-deep .u-empty {
					position: absolute;
					top: 50%;
					left: 50%;
					transform: translate(-50%,-50%)
				};
				.message-box {
					height: 100%;
					width: 100%;
					overflow: scroll;
					.message-one {
						width: 100%;
						padding: 10px 6px 10px 10px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.message-one-left {
							width: 20%;
							color: #9E9E9A;
						};
						.message-one-right {
								flex: 1;
							height: 20px;
							float: right;
							position: relative;
							/deep/ .van-radio-group {
								justify-content: space-between;
								.van-radio--horizontal {
								margin-right: 0 !important;
								&:nth-child(1) {
									.van-radio__label {
									color: #289E8E !important
									}
								};
								&:nth-child(2) {
									.van-radio__label {
									color: #E8CB51 !important
									}
								};
								&:nth-child(3) {
									.van-radio__label {
									color: #F2A15F !important
									}
								};
								&:nth-child(4) {
									.van-radio__label {
									color: #E86F50 !important
									}
								}
								}
							}
						}
					};
					.select-box {
						width: 100%;
						padding: 8px 6px 8px 10px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.select-box-left {
							padding-right: 10px;
							box-sizing: border-box;
							>span {
								&:nth-child(1) {
									color: red
								};
								&:nth-child(2) {
									color: #9E9E9A;
									padding-right: 6px;
									box-sizing: border-box
								};
							}
						};
						.select-box-right {
							flex: 1;
							justify-content: flex-end;
							align-items: center;
							display: flex;
							width: 0;
							>span {
								color: #101010;
								text-align: right;
								flex: 1;
								.no-wrap();
							}
						}
					};
					.end-select-box {
						.select-box-left {
							>span {
								&:nth-child(1) {
									color: #9E9E9A;
									padding-right: 6px;
									box-sizing: border-box
								};
							}
						};
					};
					.div-photoList {
						background: #fff;
						box-sizing: border-box;
						padding: 10px 6px 10px 10px;
						margin-top: 6px;
						display: flex;
						flex-wrap: wrap;
						>div {
							&:first-child {
								font-size: 14px;
								color: #9E9E9A;
								padding-right: 10px;
								box-sizing: border-box;
								vertical-align: top;
								height: 100px;
								line-height: 100px;
							};
							&:nth-child(2) {
								flex: 1;
								display: flex;
								font-size: 34px;
								flex-wrap: wrap;
								>div {
									width: 32%;
									height: 100px;
									vertical-align: top;
									margin-right: 2%;
									margin-top: 2%;
									position: relative;
									&:nth-child(1) {
										margin-top: 0;
									};
									&:nth-child(2) {
										margin-top: 0;
									};
									&:nth-child(3) {
										margin-top: 0;
									};
									&:nth-child(3n+3) {
										margin-right: 0;
									};
									/deep/ .van-icon {
										position: absolute;
										top: -12px;
										right: 0
									};
									img {
										width: 100%;
										height: 100px;
									}
								}
							}
						}
					};
					.transport-type {
						width: 100%;
						padding: 10px 6px 10px 10px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						justify-content: space-between;
						margin-top: 6px;
						font-size: 14px;
						margin-top: 6px;
						.transport-type-left {
							padding: 10px 10px 0 0;
							box-sizing: border-box;
							>span {
								&:nth-child(1) {
									color: #9E9E9A
								}
							}
						};
						.transport-type-right {
							flex: 1;
							width: 0;
							display: flex;
							flex-wrap: wrap;
							/deep/ .van-cell {
								flex: 1;
								padding:10px 0 10px 4px;
								color: #7d7d7d;
								background: #f9f9f9;
							}
						}
					}
				}
		};
		.btn-box {
			width: 100%;
			background: #F8F8F8;
			height: 100px;
			display: flex;
			align-items: center;
			justify-content: center;
			>span {
				width: 35%;
				display: inline-block;
				height: 45px;
				font-size: 14px;
				line-height: 45px;
				background: #fff;
				text-align: center;
				border-radius: 4px;
				&:nth-child(1) {
					color: #2B98FE;
					border: 1px solid #2B98FE;
					box-sizing: border-box;
					margin-right: 30px;
					box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
				};
				&:nth-child(2) {
					color: #fff;
					background: #2B98FE;
					box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
				}
			}
		};
				 .choose-photo-box {
        position: fixed;
        margin: auto;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1000;
        font-size: 0;
        > div {
          width: 100%;
          text-align: center;
          font-size: 16px;
          background: #f6f6f6
        }
        .choose-photo {
          padding: 8px 10px;
          height: 30px;
          .bottom-border-1px(#cbcbcb);
          line-height: 30px;
          position: relative;
          cursor: pointer;
          color: @color-theme;
          overflow: hidden;
          display: inline-block;
          *display: inline;
          *zoom: 1;
          /deep/ .van-icon {
            vertical-align: top;
            font-size: 20px;
            display: inline-block;
            line-height: 30px
          };
          input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            height: 100%;
            opacity: 0;
            filter: alpha(opacity=0);
            cursor: pointer
          }
        };
        .photo-graph {
          position: relative;
          display: inline-block;
          height: 50px;
          overflow: hidden;
         .bottom-border-1px(#cbcbcb);
          color: @color-theme;
          text-decoration: none;
          text-indent: 0;
          line-height: 50px;
          /deep/ .van-icon {
            vertical-align: top;
            font-size: 20px;
            display: inline-block;
            line-height: 50px
          };
          input {
            position: absolute;
            font-size: 100px;
            right: 0;
            height: 100%;
            top: 0;
            opacity: 0;
          }
        };
        .photo-cancel {
          position: relative;
          display: inline-block;
          padding: 8px 12px;
          overflow: hidden;
          color: @color-theme;
          text-decoration: none;
          text-indent: 0;
          line-height: 30px;
          font-weight: bold
        }
      }
	}
</style>
