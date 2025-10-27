<template>
	<div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<!-- 日期选择弹框 -->
		<div class="datetime-picker">
			<van-datetime-picker type="date" v-if="dateStartShow" v-model="dateStartValue" @cancel="dateStartShow = false" @confirm="startDateSure" />
		</div>
		<div class="datetime-picker">
			<van-datetime-picker type="date" v-if="dateEndShow" v-model="dateEndValue" @cancel="dateEndShow = false" @confirm="endDateSure" />
		</div>
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
			<div class="nav">
				<NavBar title="保洁管理" leftText="首页" path="/home" />
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
					<van-tab title="已完成"></van-tab>
					<van-tab title="已取消"></van-tab>
				</van-tabs>
				<div class="tab-line" :class="{'tab-left':current == 0,'tab-right':current == 1}"></div>
			</div>
			<div class="filtrate-area">
				<div class="calendar-box">
					<van-icon name="notes-o" color="#101010" size="26" />
				</div>
				<div class="date-input-box">
					<div @click="dateStartShow = true">
						<van-field
							:readonly="true"
							type="text"
							v-model="dateStart"
						/>
					</div>
					<div>至</div>
					<div @click="dateEndShow = true">
						<van-field
							:readonly="true"
							type="text"
							v-model="dateEnd"
						/>
					</div>
				</div>
				<div class="filtrate-btn" @click="filtrateEvent">
					<span>筛选</span>
				</div>
			</div>
			<div class="empty-info" v-if="noDataShow">
				<van-empty description="数据为空" />
			</div>
			<div class="task-tail-content" v-if="current == 0">
				<div class="task-tail-content-item" @click="enterTaskMessage(item)"  v-for="(item,index) in stateCompleteList" :key="index">
					<div class="item-title">
						<div class="item-top-one">
							<div class="number">
								<span>编号: {{item.number}}</span>
								<span>{{item.createTime}}</span>
							</div>
						  <div class="priority"
						  :class="{
						  	'noStartStyle ' : item.state == 1 || item.state == 2, 
						  	'underwayStyle' : item.state == 3,
						  	'waitReviewStyle' : item.state == 4,
						  	'completeStyle' : item.state == 5,
						  	'haveReviewStyle' : item.state == 6,
						  	'cancelStyle' : item.state == 7,
						  	'reviewStyle' : item.state == 8
						  	}"
						  >
						  	<span>{{stateTransfer(item.state)}}</span>
						  </div>
						</div>
					</div>
					<div class="item-top">
						<div class="item-top-two">
						 <span>优先级:</span>
						 <span>{{priorityTransfer(item.priority)}}</span>
						</div>
						<div class="item-top-three">
						 <span>位置:</span>
						 <span>{{!item.taskDesc ? '无' : item.taskDesc}}</span>
						</div>
						<div class="item-top-four">
						 <span>问题描述:</span>
						 <span>{{!item.taskDesc ? '无' : item.taskDesc}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="task-tail-content task-tail-content-going" v-if="current == 1">
				<div class="task-tail-content-item" @click="enterTaskMessage(item)" v-for="(item,index) in stateCompleteList" :key="index">
					<div class="item-title">
						<div class="item-top-one">
							<div class="number">
								<span>编号: {{item.number}}</span>
								<span>{{item.createTime}}</span>
							</div>
						  <div class="priority"
						  :class="{
						  	'noStartStyle ' : item.state == 1 || item.state == 2, 
						  	'underwayStyle' : item.state == 3,
						  	'waitReviewStyle' : item.state == 4,
						  	'completeStyle' : item.state == 5,
						  	'haveReviewStyle' : item.state == 6,
						  	'cancelStyle' : item.state == 7,
						  	'reviewStyle' : item.state == 8
						  	}"
						  >
						  	<span>{{stateTransfer(item.state)}}</span>
						  </div>
						</div>
					</div>
					<div class="item-top">
						<div class="item-top-two">
						 <span>优先级:</span>
						 <span>{{priorityTransfer(item.priority)}}</span>
						</div>
						<div class="item-top-three">
						 <span>位置:</span>
						 <span>{{!item.taskDesc ? '无' : item.taskDesc}}</span>
						</div>
						<div class="item-top-four">
						 <span>问题描述:</span>
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
	import _ from 'lodash'
	import {
		getDate
	} from '@/common/js/utils'
	import { queryCleaningManageTaskListHistory } from "@/api/environment.js";
	import NavBar from "@/components/NavBar";	
	import SOtime from '@/common/js/utils/SOtime.js'
	export default {
		name: 'cleanHistoricalTask',
		components: {
			NavBar
		},
		data() {
			return {
				infoText: '加载中···',
				showLoadingHint: false,
				valueName: 2,
				noDataShow: false,
				list: [{name: '已完成'}, {name: '已取消'}],
				current: 0,
				dateStart: getDate(),
				dateEnd: getDate(),
				dateStartValue: new Date(),
				dateEndValue: new Date(),
				dateEndShow: false,
				dateStartShow: false,
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
			if (this.fromPath == '/cleanWorkerOrderMessage') { return };
			this.current = 0;
			this.valueName = 2;
			this.dateStart = getDate();
			this.dateEnd = getDate();
			this.dateStartValue = new Date();
			this.dateEndValue = new Date();
			this.queryCompleteDispatchTask(
				{
				    state:5,
					proId : this.proId, // 所属项目id
					createId: this.workerId,// 保洁主管id 
					taskType: 0, // 0-即时，1-专项
					beginTime: this.dateStart,
					endTime: this.dateEnd
				}
			)
		},
		methods: {
			...mapMutations([
				'changeEnvironmentTaskMessage'
			]),
			
			// 开始日期弹框显示事件
			showActionStart () {
				this.dateStartShow = true
			},
			
			// 耗时
			consueTime (t1,t2) {
			  if (t1 && t2) {
			    return SOtime.time5(t1,t2)
			  }
			},
			
			// 进入订单详情事件
			enterTaskMessage (item) {
				this.changeEnvironmentTaskMessage(item);
				this.$router.push({path: '/cleanWorkerOrderMessage'})
			},
			
			// 将时间戳转换为当天的 00:00:00
			normalizeTimestamp () {
			  const date = new Date();
			  date.setHours(0, 0, 0, 0);
			  return Number(date)
			},
			
			// tab切换改变事件
			tabChange (index) {
				if (new Date(this.dateEndValue).getTime() < new Date(this.dateStartValue).getTime()){
					this.$toast('结束日期不能小于开始日期')
					return
				};
				this.current = index;
				if (this.current == 0) {
				  this.queryCompleteDispatchTask(
						{
							 state:5,
							 proId : this.proId, // 所属项目id
							 createId: this.workerId,// 保洁主管id 
							 taskType: 0, // 0-即时，1-专项
							 beginTime: this.dateStart,
							 endTime: this.dateEnd
						}
				  )
				} else {
				  this.queryCompleteDispatchTask(
					{
					  state:7,
					  proId : this.proId, // 所属项目id
					  createId: this.workerId,// 保洁主管id 
					  taskType: 0, // 0-即时，1-专项
					  beginTime: this.dateStart,
					  endTime: this.dateEnd
					}
				  )
				}
			},
			
			// 开始时间确定
			startDateSure(e) {
				this.dateStartShow = false;
				this.dateStart = SOtime.time8(new Date(e).getTime());
				if (new Date(this.dateEndValue).getTime() < new Date(this.dateStartValue).getTime()){
					this.$toast('结束日期不能小于开始日期')
					return
				}
			},
			
			// 结束日期确定
			endDateSure(e) {
				this.dateEndShow = false;
				this.dateEnd = SOtime.time8(new Date(e).getTime());
				if (new Date(this.dateEndValue).getTime() < new Date(this.dateStartValue).getTime()) {
					this.$toast('结束日期不能小于开始日期');
					return
				}
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
			
			//任务状态转换
			stateTransfer (num) {
				switch(num) {
						case 0:
							return '未分配'
							break;
						case 1:
								return '未查阅'
								break;
						case 2:
								return '未开始'
								break;
						case 3:
								return '进行中'
								break;
						case 4:
								return '待复核'
								break;
						case 5:
								return '已完成'
								break;
						case 6:
								return '已复核'
								break;
						case 7:
								return '已取消'
								break
						case 8:
								return '复核中'
								break
				} 
			},
			
			
			// 筛选事件
			filtrateEvent () {
				if (new Date(this.dateEndValue).getTime() < new Date(this.dateStartValue).getTime()){
					this.$toast('结束日期不能小于开始日期')
					return
				};
				if (this.current == 0) {
				  this.queryCompleteDispatchTask(
						{
							state:5,
							proId : this.proId, // 所属项目id
							createId: this.workerId,// 保洁主管id 
							taskType: 0, // 0-即时，1-专项
							beginTime: this.dateStart,
							endTime: this.dateEnd
						}
				  )
				} else {
				  this.queryCompleteDispatchTask(
						{
							state:7,
							proId : this.proId, // 所属项目id
							createId: this.workerId,// 保洁主管id 
							taskType: 0, // 0-即时，1-专项
							beginTime: this.dateStart,
							endTime: this.dateEnd
						}
				  )
				}
			},
			
			// 查询保洁任务
			queryCompleteDispatchTask (data) {
				this.noDataShow = false;
				this.showLoadingHint = true;
				this.infoText = '查询中···';
				this.stateCompleteList = [];
				let temporaryDataList = [];
			  queryCleaningManageTaskListHistory(data).then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
				  if (res.data.data.length > 0) {
						temporaryDataList = res.data.data;
						if (temporaryDataList.length > 0) {
							this.noDataShow = false;
						} else {
							this.noDataShow = true;
						};
						for (let item of temporaryDataList) {
							this.stateCompleteList.push({
								createTime: item.createTime,
								startTime: item.startTime,
								planStartTime: item.planStartTime,
								finalFinishTime: item.finalFinishTime,
								finishTime: item.finishTime,
								state: item.state,
								destinationName: item.depName,
								taskTypeName: item.typeName,
								priority: item.priority,
								number: item.taskNumber,
								id: item.id,
								taskDesc: item.taskRemark,
								workerName: item.workerName
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
			
			// tabBar点击事件
			tabBarEvent (index) {
			 	this.valueName = index;
				this.valueName = index;
				if (this.valueName == 0) {
					this.$router.push({ path: "/cleanCallTask" })
				} else if (this.valueName == 1) {
					this.$router.push({ path: "/cleanRealtimeTask" })
				} else if (this.valueName == 2) {
					this.$router.push({ path: "/cleanHistoricalTask" })
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
		.datetime-picker {
			position: fixed;
			width: 100%;
			left: 0;
			bottom: 0;
			z-index: 10;
			/deep/ .van-datetime-picker {
				.van-picker__toolbar {
					.van-picker__confirm {
						color: #3c9cff !important;
					}
				}
			}
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
			 .filtrate-area {
				 display: flex;
				 align-items: center;
				 width: 85%;
				 margin: 10px 0;
				 margin-left: 6%;
				 .calendar-box {
					 margin-right: 4px;
				 };
				 .date-input-box {
				  display: flex;
				  align-items: center;
					/deep/ .van-cell {
						padding: 0 9px !important;
						font-size: 12px !important;
						color: #101010 !important;
						width: 100px;
						height: 22px;
						border-radius: 0 !important;
						border: 1px solid #bbbbbb;
						background: transparent !important;
					};
				  >div {
				   &:nth-child(2) {
				  	margin: 0 8px;
				  	color: #101010;
				  	font-size: 12px;
				   }
				  }
				 };
				 .filtrate-btn {
					 margin-left: 10px;
					 width: 54px;
					 height: 22px;
					 display: flex;
					 align-items: center;
					 justify-content: center;
					 border-radius: 6px;
					 background: linear-gradient(to right, #6ED3F7, #218FFF);
					 >span {
						 color: #fff;
						 font-size: 12px;
					 }
				 }
			 };
			 .task-tail-content {
			 	flex: 1;
			 	overflow: auto;
			 	-webkit-overflow-scrolling: touch;
			 	background: #f7f7f7;
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
							.noStartStyle {
								background: #BBBBBB !important
							};
							.underwayStyle {
								background: #289E8E !important
							};
							.completeStyle {
								background: #242424 !important
							};
							.reviewStyle {
								background: #F2A15F !important
							};
							.haveReviewStyle {
								background: #9B7D31 !important
							};
							.waitReviewStyle {
								background: orange !important
							};
							.cancelStyle {
								background: #E8CB51 !important
							};
							.completeStyle {
								background: #101010 !important
							}
						}
					};
			 		.item-top {
			 			width: 100%;
			 		  box-sizing: border-box;
			 		  padding: 10px 12px;
			 		  > div {
			 		  	display: flex;
			 				align-items: center;
			 				>span {
			 					display: inline-block;
			 					font-size: 12px;
			 					color: #101010;
			 					&:first-child {
			 						margin-right: 4px;
			 					};
			 					&:last-child {
			 						flex: 1;
			 						word-break: break-all;
			 					}
			 				}
			 		  };
			 			.item-top-two {
			 			};
			 		  .item-top-three {
			 				margin: 10px 0;
			 		  };
			 		  .item-top-four {
			 		  }
			 		}
			 	}
			 }
		}
	}
</style>
