<template>
	<div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
			<div class="nav">
				<NavBar title="任务详情" :path="fromPath" />
			</div>
		</div>
		<div class="content">
			<div class="basic-message" ref="basicMessage">
			<div class="basic-mesage-state">
				<img :src="stateTransferimage(transTaskMessage.state)" />
			</div>
			<div class="basic-message-title">
				<img src="@/common/img/basic-message.png" alt="">
				<span>
					基本信息
				</span>
			</div>
			 <div class="wait-handle-message">
				 <div class="wait-handle-message-top">
					<div class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
						<div>
							<span class="message-tit">任务类型 :&nbsp;</span>
							<span class="message-tit-real">{{transTaskMessage.taskTypeName}}</span>
						</div>
					</div>
					 <div class="handle-message-line-wrapper">
						 <div>
							 <span class="message-tit" :class="{'priorityTwoStyle' : transTaskMessage.priority != 1}">优&nbsp;&nbsp;先&nbsp;级 :&nbsp;</span>
							 <span class="message-tit-real" :class="[transTaskMessage.priority==1 ? 'priorityOneStyle' : 'priorityTwoStyle']">{{taskPriotityTransition(transTaskMessage.priority)}}</span>
						 </div>
					 </div>
					<div class="handle-message-line-wrapper handle-message-line-wrapper-other">
						<div>
							<span class="message-tit">任务起点 :&nbsp;</span>
							<span class="message-tit-real">{{transTaskMessage.setOutPlaceName}}</span>
						</div>
					</div>
					<div class="handle-message-line-wrapper handle-message-line-wrapper-other" v-if="templateType === 'template_one'">
						<div>
							<span class="message-tit">任务终点 :&nbsp;</span>
							<span class="message-tit-real">{{transTaskMessage.destinationName}}</span>
						</div>
					</div>
				 <div class="handle-message-line-wrapper-other-two" v-else-if="templateType === 'template_two'">
					 <div>
						 <span class="message-tit">任务终点 :&nbsp;</span>
					 </div>
					 <div>
						 <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in transTaskMessage.destinations" :key="innerindex">{{innerItem.destinationName}}</span>
					 </div>
				 </div>
					<div class="handle-message-line-wrapper handle-message-line-wrapper-other">
						<div>
							<span class="message-tit">任务时间 :&nbsp;</span>
							<span class="message-tit-real">{{transTaskMessage.planStartTime}}</span>
						</div>
					</div>
				 </div>
				 <div class="wait-handle-message-middle">
						<div class="handle-message-line-wrapper message-name" v-if="templateType === 'template_one'">
							<div>
								<span class="message-tit" :class="{'textStyle' : transTaskMessage.quarantine == 1}">病人姓名 :&nbsp;</span>
								<span class="message-tit-real" :class="{'textStyle' : transTaskMessage.quarantine == 1}">{{transTaskMessage.patientName == "" ? '无' : transTaskMessage.patientName}}</span>
								<img :src="contactIsolationPng" v-if="transTaskMessage.quarantine == 1" />
							</div>
						</div>
					 <div class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
						 <div>
							 <span class="message-tit" :class="{'textStyle' : transTaskMessage.quarantine == 1}">床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 :&nbsp;</span>
							 <span class="message-tit-real" :class="{'textStyle' : transTaskMessage.quarantine == 1}">{{transTaskMessage.bedNumber == "" ? '无' : transTaskMessage.bedNumber}}</span>
						 </div>
					 </div>
					 <div class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
						 <div>
							 <span class="message-tit">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄 :&nbsp;</span>
							 <span class="message-tit-real">{{transTaskMessage.age == "" ? '无' : transTaskMessage.age}}</span>
						 </div>
					 </div>
					<div class="handle-message-line-wrapper">
							<div>
								<span class="message-tit">数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量 :&nbsp;</span>
								<span class="message-tit-real">{{transTaskMessage.actualCount == "" ? "无" : transTaskMessage.actualCount}}</span>
							</div>
						</div>
					 <div class="handle-message-line-wrapper">
						 <div>
							 <span class="message-tit">转运工具 :&nbsp;</span>
							 <span class="message-tit-real">{{transTaskMessage.toolName == "" ? '无' : transTaskMessage.toolName}}</span>
						 </div>
					 </div>
						<div class="handle-message-line-wrapper">
							<div class="describe-line-wrapper">
								<div class="message-tit">语音备注 :&nbsp;</div>
								<div class="message-tit-real-audio" v-if="showChildrenComponent">
									<MyAudio v-if="!transTaskMessage.recordTime != true" :src="`http://show.blinktech.cn/trans/${transTaskMessage.taskNumber}.mp3`"></MyAudio>
								</div>
								<div class="message-tit-real" v-show="!transTaskMessage.recordTime">
									无语音信息
								</div>
							</div>
						</div>
				 </div>
				 <div class="wait-handle-message-content">
					 <div class="transport-type-wrapper" v-if="templateType === 'template_two'">
						 <div class="transport-type-title">
							 运送类型 :&nbsp;
						 </div>
						 <div class="transport-type-content">
							 <div class="transport-type-list-wrapper" v-for="(item,index) in transportList" :key="index">
									<div class="transport-type-list">
										<div class="transport-type-list-title">{{item.parentTypeName == '' ? '无': item.parentTypeName}}</div>
										<div class="transport-type-list-content" v-for="(itemInner,indexInner) in item.typeList" :key="indexInner">
											<span class="serial"  style="vertical-align: middle;">{{indexInner+1}}、</span>
											<span :class="{'textStyle' : itemInner.quarantine == 1}"  style="vertical-align: middle;">
												床号 : {{itemInner.bedNumber}},{{itemInner.patientName}},{{genderTransfer(itemInner.sex)}};
											</span>
											<span v-for="(targetItem, targetIndex) in itemInner.typeChildList" :key="targetIndex" style="vertical-align: middle;">
												{{targetItem.taskTypeName}}×{{targetItem.quantity}};
											</span>
											<img :src="contactIsolationPng" v-if="itemInner.quarantine == 1">
										</div>
									</div>
								</div>
						 </div>
						</div>
				 </div>
				 <div class="wait-handle-message-bottom">
						<div class="handle-message-line-wrapper">
						 <div class="describe-line-wrapper">
							 <div class="message-tit">任务描述 :&nbsp;</div>
							 <div class="message-tit-real">{{transTaskMessage.taskRemark ? transTaskMessage.taskRemark : '无'}}</div>
						 </div>
						</div>
				 </div>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		mergeMethods
	} from '@/common/js/utils'
	import { getDispatchTaskMessageById } from '@/api/transport.js'
	import NavBar from "@/components/NavBar";	
	import MyAudio from '@/components/myAudio';
	export default {
		components: {
			NavBar,
			MyAudio
		},
		data() {
			return {
				showLoadingHint: false,
				infoText: '加载中···',
				transportList: [],
				taskId: '',
				tierNum: 0,
				showChildrenComponent: false,
				fromPath: '',
				noAllotPng: require('@/common/img/no-allot.png'),
				taskDelayPng: require('@/common/img/task-delay.png'),
				noEndPng: require('@/common/img/no-end.png'),
				noReferPng: require('@/common/img/no-refer.png'),
				noStartPng: require('@/common/img/no-start.png'),
				taskFinshedPng: require('@/common/img/task-finshed.png'),
				taskGoingPng: require('@/common/img/task-going.png'),
				taskCancelPng: require('@/common/img/task-cancel.png'),
				contactIsolationPng: require("@/common/img/contact-isolation.png")
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'templateType',
				'statusBarHeight',
				'navigationBarHeight',
				'transTaskMessage',
				'chooseHospitalArea'
			]),
			userName() {
				return this.userInfo['worker']['name']
			},
			workerId() {
				return this.userInfo['worker']['id']
			},
			proName () {
				return this.chooseHospitalArea['span']
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
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.fromPath = from['path']
			})
		},
		mounted() {
			// 控制设备物理返回按键
			if (!IsPC()) {
				pushHistory();
				this.gotoURL(() => {
					pushHistory();
					this.$router.push({
						path: this.fromPath,
					})
				})
			};
			this.taskId = this.transTaskMessage.id;
			this.getTaskMessage();
		},
		methods: {
			...mapMutations([
				'changeTransTaskMessage',
				'storeCurrentIndex'
			]),
			
			// 转换性别
			genderTransfer (index) {
				if (index.toString() === '1') {
					return '男'
				} else if (index.toString() === '2') {
					return '女'
				} else if (index.toString() === '0'){
					return '未知'
				}
			},
			
			// 优先级装换
			taskPriotityTransition (state) {
				switch(state) {
					case 1 :
						return '正常'
						break;
					case 2 :
						return '重要'
						break;
					case 3 :
						return '紧急'
						break;
					case 4 :
						return '紧急重要'
						break
				}
			},
			
			// 任务状态转换图片
			stateTransferimage (index) {
				switch(index) {
					case 0 :
						return this.noAllotPng
						break;
					case 1 :
						return this.noReferPng
						break;
					case 2 :
						return  this.noStartPng
						break;
					case 3 :
						return  this.taskGoingPng
						break;
					case 4 :
						return  this.noEndPng
						break;
					case 5 :
						return  this.taskDelayPng
						break;
					case 6 :
						return this.taskCancelPng
						break;
					case 7 :
						return  this.taskFinshedPng
						break;
				}
			},
			
			// 获取任务详情
			getTaskMessage () {
				this.showLoadingHint = true;
				this.infoText = '查询中···'
				getDispatchTaskMessageById(this.taskId,this.transTaskMessage.tempFlag)
				.then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.showChildrenComponent = true;
						this.changeTransTaskMessage(res.data.data);
						this.transportList = mergeMethods(this.transTaskMessage['patientInfoList']);
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
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";	
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content-box {
		.content-wrapper();;
		height: 100vh !important;
		background: #f6f6f6;
		box-sizing: border-box;
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
		.content {
			flex: 1;
			overflow: auto;
			padding: 0 0 10px 0;
			box-sizing: border-box;
		};
		.basic-message {
			width: 93%;
			margin: 0 auto;
			margin-top: 14px;
			position: relative;
			background: #fff;
			padding: 10px;
			box-sizing: border-box;
			.basic-mesage-state {
				width: 80px;
				height: 30px;
				position: absolute;
				text-align: center;
				line-height: 30px;
				top: 8px;
				right: -12px;
				img {
					width: 100%;
					height: 100%
				}
			};
			.basic-message-title {
				font-size: 18px;
				color: #1a89fd;
				height: 40px;
				line-height: 40px;
				>img {
					height: 18px;
					width: 18px;
					margin-right: 2px;
					vertical-align: middle;
				};
				>span {
					vertical-align: middle;
				}
			}
			.wait-handle-message {
				width: 100%;
				margin-top: 5px;
				.wait-handle-message-middle {
					margin: 10px 0
				};
				.wait-handle-message-bottom {
					margin-top: 10px
				};
				.handle-message-line-wrapper {
					>div {
						display: flex;
						overflow: auto;
						height: 30px;
						line-height: 30px;
						flex-flow: row nowrap;
						color: #a0a0a0;
						.textStyle {
							color: #E8CB51 !important;
							font-weight: bold
						};
						.priorityOneStyle {
							color: #b1d676 !important
						};
						.priorityTwoStyle {
							color: red !important;
							font-weight: bold
						};
						span {
							display: inline-block;
						};
						span:first-child {
							width: 25%
						};
						.message-tit-real-style {
							color: #2895ea;
						}
						span:last-child {
							flex: 1;
							color: black
						}
					};
					.describe-line-wrapper {
						width: 100%;
						display: flex;
						height: 40px;
						align-items: center;
						>div {
							&:first-child {
								width: 25%;
								color: #a0a0a0;
							};
							&:last-child {
								flex: 1;
								color: black;
							}
						};
						.message-tit-real-audio {
							margin-left: 4px
						}
					}
				};
				.message-name {
					>div {
						display: flex;
						>span {
							&:nth-child(2) {
								padding: 0 5px 0 0;
								box-sizing: border-box;
								flex: 1;
								color: black;
								word-break: break-all
							}
						};
						img {
							width: 27px;
							height: 27px;
							vertical-align: bottom
						}
					}
				};
				.transport-type-wrapper {
					display: flex;
					flex-flow: row nowrap;
					.transport-type-title {
						color: #a0a0a0;
						width: 25%
					};
					.transport-type-content {
						color: black;
						flex: 1;
						> div:not(:first-child) {
							.transport-type-list-title {
								margin-top: 6px
							}
						};
						.transport-type-list-wrapper {
							.transport-type-list {
								> p {
								};
								.transport-type-list-title {
									font-weight: bold;
									color: black
								};
								.transport-type-list-content {
									line-height: 30px;
									img {
										width: 24px;
										height: 24px;
										vertical-align: middle;
										margin-left: 2px
									};
									.textStyle {
										color: #E8CB51 !important;
										font-weight: bold
									}
								}
							}
						}
					}
				};
				.handle-message-line-wrapper-other {
					>div {
						width: 100%;
					}
				};
				.handle-message-line-wrapper-other-two {
					display: flex;
					flex-flow: row now;
					line-height: 35px;
					>div:first-child {
						width: 25%;
						span {
							color: #a0a0a0;
						}
					};
					>div:last-child {
						flex: 1;
						span {
							color: black
						};
						.message-tit-real-destinationList {
							margin-right: 4px
						}
					}
				}
			}
		}
}
</style>
