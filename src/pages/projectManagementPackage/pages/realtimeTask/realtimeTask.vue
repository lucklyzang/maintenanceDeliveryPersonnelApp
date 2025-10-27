<template>
	<div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<!-- 取消订单原因弹框 -->
		<div class="transport-rice-box" v-if="showCancelReason">
			<ScrollSelection buttonLocation='top' v-model="showCancelReason" :pickerValues="canCelReasonDefaultIndex" :isShowSearch="false" :columns="cancelReasonOption" @sure="cancelReasonSureEvent" @cancel="cancelReasonCancelEvent" @close="cancelReasonCloseEvent" />
		</div>
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
			<div class="nav">
				<NavBar title="工程维修" leftText="首页" path="/home" />
			</div>
		</div>
		<div class="content">
			<div class="task-tail-title">
				<van-tabs v-model="current"
					title-active-color="#2c9af1"
					title-inactive-color="#606060"
					line-width="0" 
					line-height="0"
					@change="tabChange"
				>
					<van-tab title="待办任务"></van-tab>
					<van-tab title="进行中"></van-tab>
				</van-tabs>
				<div class="tab-line" :class="{'tab-left':current == 0,'tab-right':current == 1}"></div>
			</div>
			<div class="empty-info" v-if="noDataShow">
				<van-empty description="数据为空" />
			</div>
			<div class="task-tail-content" v-if="current == 0">
				<div class="task-tail-content-item" v-for="(item,index) in stateCompleteList" @click="enterTaskMessage(item)" :key="index">
					<div class="item-title">
						<div class="item-top-one">
							<div class="number">
								<span>编号: {{item.number}}</span>
								<span>{{item.createTime}}</span>
							</div>
						  <div class="priority"
								:class="{
									'noAllocation':item.state == 0,
									'waitSureStyle':item.state == 1,
									'waitFinishStyle': item.state == 2,
									'underwayStyle':item.state == 3,
									'waitSignatureStyle':item.state == 4,
									'completeStyle':item.state == 5,
									'cancelStyle':item.state == 6,
									'delayStyle':item.state == 7,
									'waitCheckStyle':item.state == 8
								}"
							>
						  	<span>{{stateTransfer(item.state)}}</span>
						  </div>
						</div>
					</div>
					<div class="item-top">
						<div class="item-top-two">
						  <div class="start-point">
								<span>优先级:</span>
						  	<span>{{priorityTransfer(item.priority)}}</span>
						  </div>
							<div class="destination-point">
								<span>任务类型:</span>
								<span>{{item.taskTypeName}}</span>
							</div>
						</div>
						<div class="item-top-three">
							<div class="transport-type">
								<span>目的地:</span>
								<span>{{!item.destinationName ? '无' : item.destinationName}}</span>
							</div>
						  <div class="transport-people">
								<span>维修员:</span>
						  	<span>{{!item.workerName ? '无' : item.workerName}}</span>
						  </div>
						</div>
						<div class="item-top-four">
						 <span>任务描述:</span>
						 <span>{{!item.taskDesc ? '无' : item.taskDesc}}</span>
						</div>
					</div>
					<div class="item-bottom">
						<div class="item-bottom-right">
							<div class="left" @click.stop="reminder(item)" :class="{'reminderStyle':item.reminder == 1 }">
								<span>催单</span>
							</div>
							<div class="right" @click.stop="cancel(item)" v-if="item.state !== 3">
								<span>取消订单</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="task-tail-content task-tail-content-going" v-if="current == 1">
				<div class="task-tail-content-item" v-for="(item,index) in stateCompleteList" @click="enterTaskMessage(item)" :key="index">
					<div class="item-title">
						<div class="item-top-one">
							<div class="number">
								<span>编号: {{item.number}}</span>
								<span>{{item.createTime}}</span>
							</div>
						  <div class="priority"
								:class="{
									'noAllocation':item.state == 0,
									'waitSureStyle':item.state == 1,
									'waitFinishStyle': item.state == 2,
									'underwayStyle':item.state == 3,
									'waitSignatureStyle':item.state == 4,
									'completeStyle':item.state == 5,
									'cancelStyle':item.state == 6,
									'delayStyle':item.state == 7,
									'waitCheckStyle':item.state == 8
								}"
							>
						  	<span>{{stateTransfer(item.state)}}</span>
						  </div>
						</div>
					</div>
					<div class="item-top">
						<div class="item-top-two">
						  <div class="start-point">
								<span>优先级:</span>
						  	<span>{{priorityTransfer(item.priority)}}</span>
						  </div>
							<div class="destination-point">
								<span>任务类型:</span>
								<span>{{item.taskTypeName}}</span>
							</div>
						</div>
						<div class="item-top-three">
							<div class="transport-type">
								<span>目的地:</span>
								<span>{{!item.destinationName ? '无' : item.destinationName}}</span>
							</div>
						  <div class="transport-people">
								<span>维修员:</span>
						  	<span>{{!item.workerName ? '无' : item.workerName}}</span>
						  </div>
						</div>
						<div class="item-top-four">
						 <span>任务描述:</span>
						 <span>{{!item.taskDesc ? '无' : item.taskDesc}}</span>
						</div>
					</div>
				</div>
			</div>
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
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { projectTaskCancel, projectTaskCancelReason, getMaintainTask, projectTaskReminder} from '@/api/project.js'
	import NavBar from "@/components/NavBar";	
	import ScrollSelection from "@/components/ScrollSelection";
	export default {
		name: 'projectRealtimeTask',
		components: {
			NavBar,
			ScrollSelection
		},
		data() {
			return {
				infoText: '加载中···',
				showLoadingHint: false,
				valueName: 1,
				list: [{name: '待办任务'}, {name: '进行中'}],
				current: 0,
				noDataShow: false,
				canCelReasonDefaultIndex: [0],
				cancelReasonOption: [],
				showCancelReason: false,
				currentCancelReason: '请选择',
				stateCompleteList: [],
				fromPath: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				'templateType',
				'chooseHospitalArea'
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
		beforeRouteEnter(to, from, next) {
			next(vm => {
				vm.fromPath = from['path']
			})
		},
		activated() {
			if (this.fromPath == '/projectWorkerOrderMessage') { return };
			this.valueName = 1;
			this.current = 0;
			this.getDispatchTaskCancelReason({proId: this.proId,state: 0,reason: ''});
			this.queryCompleteDispatchTask(
				{
				   proId:this.proId, createId:this.workerId,state: -5,
						 startDate: '', endDate: ''
				},'待办任务'
			)
		},
		methods: {
			...mapMutations([
				'changeProjectTaskMessage'
			]),
			
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index;
				if (this.current == 0) {
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, createId:this.workerId,state: -5,
					   startDate: '', endDate: ''
					},'待办任务'
				  )
				} else {
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, createId:this.workerId,state: -6,
					   startDate: '', endDate: ''
					},'进行中'
				  )
				}
			},
			
			// 取消原因下拉选择框确认事件
			cancelReasonSureEvent (val,value,id) {
				if (val) {
					this.cancelReasonDefaultIndex = [id]
					this.currentCancelReason=  val;
					this.cancelProjectTask({
						proId: this.proId,	//当前项目ID
						taskId: this.taskId, //当前任务ID
						reason: this.currentCancelReason //取消原因
					})
				} else {
					this.currentCancelReason = '请选择'
				};
				this.showCancelReason = false
			},
			
			// 取消原因下拉选择框取消事件
			cancelReasonCancelEvent () {
				this.showCancelReason = false
			},
			
			// 取消原因下拉选择框关闭事件
			cancelReasonCloseEvent () {
				this.showCancelReason = false
			},
			
			// 进入订单详情事件
			enterTaskMessage (item) {
				this.changeProjectTaskMessage(item);
				this.$router.push({path: '/projectWorkerOrderMessage'})
			},
			
			// 任务优先级转换
			  priorityTransfer (index) {
					switch(index) {
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
						break;
					}
			  },
				
			// 任务状态转换
			stateTransfer (state) {
				switch(state) {
					case 0 :
						return '未分配'
						break;
					case 1 :
						return '待确认'
						break;
					case 2 :
						return '待完成'
						break;
					case 3 :
						return '进行中'
						break;
					case 4 :
						return '待签字'
						break;
					case 5 :
						return '已完成'
						break;
					case 6 :
						return '已取消'
						break;
					case 7 :
						return '已延迟'
						break;
					 case 8 :
						return '待审核'
						break;
				}	
			},	
			
			// 提取床号
			extractBedNumber (patientInfoList) {
				if (patientInfoList.length == 0) { return "无"};
				let temporaryArr = [];
				for (let item of patientInfoList) {
					temporaryArr.push(item.bedNumber)
				};
				return temporaryArr.join("、")
			},
			
			// 查询工程任务
			queryCompleteDispatchTask (data,text) {
			  this.noDataShow = false;
				this.infoText = '查询中···';
			  this.showLoadingHint = true;
				this.stateCompleteList = [];
				let temporaryDataList = [];
			  getMaintainTask(data).then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
				  if (res.data.data.length > 0) {
						if (text == '待办任务') {
							temporaryDataList = res.data.data.filter((item) => { return item.state == 0 || item.state == 1 || item.state == 2});
						} else {
							temporaryDataList = res.data.data
						};
						if (temporaryDataList.length > 0) {
							this.noDataShow = false;
						} else {
							this.noDataShow = true;
						};
						for (let item of temporaryDataList) {
							this.stateCompleteList.push({
								createTime: item.createTime,
								startTime: item.startTime,
								finalFinishTime: item.finalFinishTime,
								finishTime: item.finishTime,
								state: item.state,
								destinationName: item.depName,
								taskTypeName: item.typeName,
								priority: item.priority,
								number: item.taskNumber,
								id: item.id,
								taskDesc: item.taskDesc,
								workerName: item.workerName,
								reminder: item.reminder
							})
						}
				  } else {
						this.noDataShow = true
				  }
				} else {
					this.$dialog.alert({
						message: res.data.msg,
						closeOnPopstate: true
					}).then(() => {
					})
				}
			  })
			  .catch((err) => {
					this.$dialog.alert({
						message: err.message,
						closeOnPopstate: true
					}).then(() => {
					})
					this.showLoadingHint = false;
					this.noDataShow = true;
			  })
			},
			
			// 获取取消原因列表
			getDispatchTaskCancelReason (data) {
				this.infoText = '查询中···';
				this.showLoadingHint = true;
				projectTaskCancelReason(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.cancelReasonLlist = [];
						for (let item of res.data.data) {
						   this.cancelReasonOption.push({text: item.cancelName, value: item.id})
						}
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
						message:  `${err}`,
						closeOnPopstate: true
					}).then(() => {
					})
				})
			},
			
			// 取消事件
			cancel (item) {
				this.showCancelReason = true;
				this.taskId = item.id
			},
			
			// 工程任务取消
			cancelProjectTask (data) {
				this.showLoadingHint = true;
				this.infoText = '取消中···';
			  projectTaskCancel(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
					this.$Alert({message:"取消成功!",type:'success'});
					this.queryCompleteDispatchTask(
						{
							 proId:this.proId, createId:this.workerId,state: -5,
							 startDate: '', endDate: ''
						},'待办任务'
					 )
					} else {
						this.$Alert({message: `${res.data.msg}!`,type:'error'});
					}
			  })
			  .catch((err) => {
					this.showLoadingHint = false;
					this.$Alert({message: err.message,type:'error'});
			  })
			},
			  
			// 工程任务催单
			reminder(item) {
				if (item.reminder == 1) {
					return
				};
				this.showLoadingHint = true;
				this.infoText = '催单中···';
			  	projectTaskReminder(this.proId,item.id).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$Alert({message:"催单成功!",type:'success'});
						this.queryCompleteDispatchTask(
							{
									proId:this.proId, createId:this.workerId,state: -5,
									startDate: '', endDate: ''
							},'待办任务'
						)
					} else {
						this.$Alert({message: `${res.data.msg}!`,type:'error'});
					}
			  })
			  .catch((err) => {
					this.showLoadingHint = false;
					this.$Alert({message: `${err.message}!`,type:'error'});
			  })
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
		background: #f6f6f6;
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
		.content {
			 flex: 1;
			 overflow: auto;
			 padding: 6px 4px;
			 box-sizing: border-box;
			 position: relative;
			 background: #F8F8F8;
			 display: flex;
			 flex-direction: column;
			 .empty-info {
				width: 200px;
				height: 200px;
				position: absolute;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				margin: auto;
				z-index: 100;
			 };
			 .task-tail-title {
				 width: 85%;
				 margin: 0 auto;
				 position: relative;
				 .tab-line {
					 width: 96px;
					 height: 2px;
					 background: #2c9af1;
					 position: absolute;
					 bottom: -1px;
				 };
				 .tab-left {
						left: 0
				 };
				 .tab-right {
					 right: 0
				 };
				 border-bottom: 1px solid #bbbbbb;
				 /deep/ .van-tabs {
					 .van-tabs__wrap {
						.van-tabs__nav {
							background: transparent !important;
							.van-tab {
								padding: 0 20px;
								box-sizing: border-box;
								&:nth-child(1) {
									justify-content: flex-start !important;
								};
								&:nth-child(2) {
									justify-content: flex-end !important;
								}
							};
							.van-tabs__line {
								padding-bottom: 0 !important;
								margin-bottom: -3px;
							}
						 }
					 }
				 }
			 };
			 .task-tail-content {
			 	flex: 1;
			 	overflow: auto;
			 	-webkit-overflow-scrolling: touch;
			 	background: #f7f7f7;
				margin-top: 10px;
			 	.task-tail-content-item {
			 		width: 98%;
			 		margin: 0 auto;
			 		margin-bottom: 6px;
			 		border-radius: 4px;
			 		background: #FFFFFF;
					.item-title {
						box-sizing: border-box;
						padding: 0 12px;
						.item-top-one {
							height: 40px;
							display: flex;
							align-items: center;
							border-bottom: 1px solid #BBBBBB;
						  > div {
						    word-break: break-all;
						    font-size: 12px;
						    span {
						      color: #ACADAF;
						    };
						   &:first-child {
						     flex: 1;
						     display: flex;
						     align-items: center;
						     >span {
						     	display: inline-block;
						   		&:first-child {
						   			width: 160px;
						   			height: 16px;
						   			overflow: auto;
						   		};
						     	&:last-child {
						     		margin: 0 4px;
						     		flex: 1
						     	}
						     }
						   };
								&:nth-child(2) {
									width: 60px;
									display: flex;
									align-items: center;
									justify-content: center;
									>img {
										width: 22px;
										height: 22px
									}
								};
						    &:last-child {
						      padding: 0 6px;
									box-sizing: border-box;
						      display: flex;
						      justify-content: flex-end;
						      align-items: center;
									height: 21px;
									background: #E86F50;
									border-radius: 3px;
									>span {
										color: #fff;
										font-size: 14px;
									}
						    }
						  };
							.noAllocation {
								background: #E86F50 !important;
							};
							.waitSureStyle {
								background: #FF0000 !important;
							};
							.underwayStyle {
								background: #289E8E !important;
							};
							.waitFinishStyle {
								background: #298CF8 !important;
							};
							.waitSignatureStyle {
								background: #06e606 !important;
							};
							.waitCheckStyle {
								background: #F2A15F !important;
							};
							.delayStyle {
								background: #be4330 !important;
							};
							.cancelStyle {
								background: #E8CB51 !important;
							};
							.completeStyle {
								background: #101010 !important
							}
						}
					};
			 		.item-top {
			 			width: 100%;
			 			font-size: 16px;
			 			display: inline-block;
			 			color: black;
			 		  > div {
			 		    padding: 6px 0;
			 		    display: flex;
			 		    box-sizing: border-box;
			 		    flex-flow: row nowrap;
			 		    > div {
			 		      width: 50%;
			 		      > span {
			 		        &:last-child {
			 		          padding-left: 0;
			 		        }
			 		      }
			 		    }
			 		  };
			 			.item-top-two {
							box-sizing: border-box;
							padding: 10px 12px;
			 				> div {
								display: flex;
								word-break: break-all;
			 				  &:first-child {
			 				    width: 60%;
									padding-right: 6px;
									box-sizing: border-box;
			 						span {
										font-size: 12px;
										color: #101010;
			 							&:first-child {
			 								margin-right: 4px
			 							};
										&:last-child {
											flex: 1;
										}
			 						}
			 				  };
			 				  &:last-child {
			 						width: 40%;
			 						span {
										font-size: 12px;
										color: #101010;
										&:first-child {
											margin-right: 4px
										};
										&:last-child {
											flex: 1;
										}
									}
			 					}
			 				}
			 			};
			 		  .item-top-three {
							 box-sizing: border-box;
							 padding: 10px 12px;
			 		    > div {
								display: flex;
								word-break: break-all;
			 		      &:first-child {
			 		        width: 60%;
									padding-right: 6px;
									box-sizing: border-box;
									display: flex;
									span {
										font-size: 12px;
										color: #101010;
										&:first-child {
											margin-right: 4px
										};
										&:last-child {
											flex: 1;
										}
									}
			 		      };
			 		      &:last-child {
			 						width: 40%;
			 		    		span {
			 		    			font-size: 12px;
			 		    			color: #101010;
			 		    			&:first-child {
			 		    				margin-right: 4px
			 		    			};
										&:last-child {
											flex: 1;
										}
			 		    		}
			 		    	}
			 		    }
			 		  };
			 		  .item-top-four {
							 box-sizing: border-box;
			 				 padding: 10px 12px;
			 				 font-size: 12px;
			 				 > div {
								display: flex;
			 					width: 100%;
								word-break: break-all;
			 					.destina-list {
			 						color: #101010;
			 						margin-right: 4px;
			 					};
			 					span {
			 						display: inline-block;
			 						&:first-child {
			 							color: #101010;
			 							margin-right: 4px
			 						};
									&:last-child {
										flex: 1;
									}
			 					}
			 				}
			 		  }
			 		};
			 		.item-bottom {
			 			width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-end;
			 			.item-bottom-right {
			 				width: 55%;
			 				height: 60px;
			 				display: flex;
			 				align-items: center;
			 				justify-content: flex-end;
			 				> div {
								width: 45%;
								height: 30px;
								border-radius: 4px;
								text-align: center;
								line-height: 30px;
								>span {
									font-size: 14px;
								}
			 				};
							.reminderStyle {
								opacity: .4;
							};
			 				.left  {
			 					background: #E8CB51;
								color: #fff;
			 				};
			 				.right  {
								color: #E86F50;
								background: #fff;
								margin-left: 14px;
								border: 1px solid #E86F50;
								box-sizing: border-box;
			 				}
			 			}
			 		}
			 	}
			 }
		}
	}
</style>
