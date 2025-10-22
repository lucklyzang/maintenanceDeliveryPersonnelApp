<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<light-hint ref="alertToast"></light-hint>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<!-- 取消订单原因弹框 -->
		<view class="transport-rice-box" v-if="showCancelReason">
			<ScrollSelection buttonLocation='top' v-model="showCancelReason" :pickerValues="canCelReasonDefaultIndex" :isShowSearch="false" :columns="cancelReasonOption" @sure="cancelReasonSureEvent" @cancel="cancelReasonCancelEvent" @close="cancelReasonCloseEvent" />
		</view>
		<view class="nav">
			<nav-bar :home="false" :isShowBackText="true" :isHomeText="true" backState='3000' fontColor="#FFF" bgColor="none" title="运送" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="content">
			<view class="task-tail-title">
				<u-tabs 
				  :list="list"
					:scrollable="false" 
					lineColor="#fff"
					:activeStyle="{
						color: '#2c9af1',
						fontSize: '14px'
					}"
				 :inactiveStyle="{
						color: '#606060',
						fontSize: '14px'
				 }"
					lineWidth="0" 
					lineHeight="0"
					:current="current" 
					@change="tabChange"
				>
				</u-tabs>
				<view class="tab-line" :class="{'tab-left':current == 0,'tab-right':current == 1}"></view>
			</view>
			<view class="empty-info" v-if="noDataShow">
				<u-empty text="数据为空" mode="list"></u-empty>
			</view>
			<view class="task-tail-content" v-if="current == 0">
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" @click="enterTaskMessage(item)" :key="index">
					<view class="item-title">
						<view class="item-top-one">
							<view class="number">
								<text>编号: {{item.number}}</text>
								<text>{{item.createTime}}</text>
							</view>
							<view class="contact-isolation">
								<image :src="contactIsolationPng" v-if="templateType == 'template_one' && item.quarantine == 1"></image>
								<image :src="contactIsolationPng" v-if="templateType == 'template_two' && item['patientInfoList'].some((el) => { return el.quarantine == 1})"></image>
							</view>
						  <view class="priority"
								:class="{
										'noAllocation' : item.state == 0,
										'noLookupStyle' : item.state == 1,
										'noStartStyle' : item.state == 2,
										'underwayStyle' : item.state == 3,
										'noEndStyle' : item.state == 4,
										'delayStyle' : item.state == 5,
										'cancelStyle' : item.state == 6,
										'completeStyle' : item.state == 7
									}"
							>
						  	<text>{{stateTransfer(item.state)}}</text>
						  </view>
						</view>
					</view>
					<view class="item-top">
						<view class="item-top-two">
						  <view class="start-point">
								<text>优先级:</text>
						  	<text>{{priorityTransfer(item.priority)}}</text>
						  </view>
							<view class="destination-point" v-if="templateType == 'template_one'">
								<text>运送类型:</text>
								<text>{{item.taskTypeName}}</text>
							</view>
							<view class="destination-point" v-else-if="templateType === 'template_two'">
								<text>运送类型:</text>
								<text>{{item.patientInfoList[0].typeList.length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</text>
							</view>
						</view>
						<view class="item-top-three">
							<view class="transport-type">
								<text>转运工具:</text>
								<text>{{!item.toolName ? '无' : item.toolName}}</text>
							</view>
						  <view class="transport-people">
								<text>运送员:</text>
						  	<text>{{!item.workerName ? '无' : item.workerName}}</text>
						  </view>
						</view>
						<view class="item-top-three">
							<view class="start-point">
								<text>出发地:</text>
								<text>{{item.setOutPlaceName}}</text>
							</view>
							<view class="bed-number" v-if="templateType === 'template_one'">
								<text>床号:</text>
								<text>{{item.bedNumber}}</text>
							</view>
							<view class="bed-number" v-else-if="templateType === 'template_two'">
								<text>床号:</text>
								<text>{{ extractBedNumber(item.patientInfoList) }}</text>
							</view>
						</view>
						<view class="item-top-four">
						  <view class="bed-number" v-if="templateType === 'template_one'">
						  	<view>目的地: </view>
								<view>
									<text class="destina-list">{{ !item.destinationName  ? '无' : item.destinationName }}</text>
								</view>
						  </view>
						  <view class="bed-number" v-if="templateType === 'template_two'">
						  	<view>目的地: </view>
								<view>
									<text class="destina-list" v-for="(innerItem,innerIndex) in item.destinations" :key="innerIndex">{{ item.destinations.length > 0 ? innerItem.destinationName : '无' }}</text>
									</view>
						  </view>
						</view>
					</view>
					<view class="item-bottom">
						<view class="item-bottom-right">
							<view class="left"  @click.stop="reminder(item)" :class="{'reminderStyle':item.reminder == 1 }">
								<text>催单</text>
							</view>
							<view class="right" @click.stop="cancel(item)" v-if="item.state !== 3">
								<text>取消订单</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="task-tail-content task-tail-content-going" v-if="current == 1">
				<view class="task-tail-content-item" v-for="(item,index) in stateCompleteList" @click="enterTaskMessage(item)" :key="index">
					<view class="item-title">
						<view class="item-top-one">
							<view class="number">
								<text>编号: {{item.number}}</text>
								<text>{{item.createTime}}</text>
							</view>
							<view class="contact-isolation">
								<image :src="contactIsolationPng" v-if="templateType == 'template_one' && item.quarantine == 1"></image>
								<image :src="contactIsolationPng" v-if="templateType == 'template_two' && item['patientInfoList'].some((el) => { return el.quarantine == 1})"></image>
							</view>
						  <view class="priority"
								:class="{
										'noAllocation' : item.state == 0,
										'noLookupStyle' : item.state == 1,
										'noStartStyle' : item.state == 2,
										'underwayStyle' : item.state == 3,
										'noEndStyle' : item.state == 4,
										'delayStyle' : item.state == 5,
										'cancelStyle' : item.state == 6,
										'completeStyle' : item.state == 7
									}"
							>
						  	<text>{{stateTransfer(item.state)}}</text>
						  </view>
						</view>
					</view>
					<view class="item-top">
						<view class="item-top-two">
						  <view class="start-point">
								<text>优先级:</text>
						  	<text>{{priorityTransfer(item.priority)}}</text>
						  </view>
							<view class="destination-point" v-if="templateType == 'template_one'">
								<text>运送类型:</text>
								<text>{{item.taskTypeName}}</text>
							</view>
							<view class="destination-point" v-else-if="templateType === 'template_two'">
								<text>运送类型:</text>
								<text>{{item.patientInfoList[0].typeList.length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</text>
							</view>
						</view>
						<view class="item-top-three">
							<view class="transport-type">
								<text>转运工具:</text>
								<text>{{!item.toolName ? '无' : item.toolName}}</text>
							</view>
						  <view class="transport-people">
								<text>运送员:</text>
						  	<text>{{!item.workerName ? '无' : item.workerName}}</text>
						  </view>
						</view>
						<view class="item-top-three">
							<view class="start-point">
								<text>出发地:</text>
								<text>{{item.setOutPlaceName}}</text>
							</view>
							<view class="bed-number" v-if="templateType === 'template_one'">
								<text>床号: </text>
								<text>{{item.bedNumber}}</text>
							</view>
							<view class="bed-number" v-else-if="templateType === 'template_two'">
								<text>床号:</text>
								<text>{{ extractBedNumber(item.patientInfoList) }}</text>
							</view>
						</view>
						<view class="item-top-four">
						  <view class="bed-number" v-if="templateType === 'template_one'">
						  	<view>目的地: </view>
						  	<view>
						  		<text class="destina-list">{{ !item.destinationName  ? '无' : item.destinationName }}</text>
						  	</view>
						  </view>
						  <view class="bed-number" v-if="templateType === 'template_two'">
						  	<view>目的地: </view>
						  	<view>
						  		<text class="destina-list" v-for="(innerItem,innerIndex) in item.destinations" :key="innerIndex">{{ item.destinations.length > 0 ? innerItem.destinationName : '无' }}</text>
						  	</view>
						  </view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="tab-bar">
			<u-tabbar
			  :value="valueName"
			  @change="tabBarEvent"
				activeColor="#3890EE"
				:fixed="true"
			  :safeAreaInsetBottom="true"
			>
			  <u-tabbar-item text="呼叫">
			    <image
					  class="u-page__item__slot-icon"
						style="width:19px;height:18px"
			      slot="active-icon"
			      src="/static/img/call-active-icon.png"
			    ></image>
			    <image
					  class="u-page__item__slot-icon"
			      slot="inactive-icon"
						style="width:19px;height:18px"
			      src="/static/img/call-inactive-icon.png"
			    ></image>
			  </u-tabbar-item>
				<u-tabbar-item text="实时任务">
				  <image
					  class="u-page__item__slot-icon"
						style="width:19px;height:18px"
				    slot="active-icon"
				    src="/static/img/real-timetask-active-icon.png"
				  ></image>
				  <image
					  class="u-page__item__slot-icon"
						style="width:19px;height:18px"
				    slot="inactive-icon"
				    src="/static/img/real-timetask-inactive-icon.png"
				  ></image>
				</u-tabbar-item>
				<u-tabbar-item text="历史任务">
				  <image
					  class="u-page__item__slot-icon"
						style="width:19px;height:18px"
				    slot="active-icon"
				    src="/static/img/historical-task-active-icon.png"
				  ></image>
				  <image
					  class="u-page__item__slot-icon"
						style="width:19px;height:18px"
				    slot="inactive-icon"
				    src="/static/img/historical-task-inactive-icon.png"
				  ></image>
				</u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {getDispatchTaskComplete, taskReminder, queryDispatchTaskCancelReason,updateDispatchTask} from '@/api/transport.js'
	import navBar from "@/components/zhouWei-navBar"
	import ScrollSelection from "@/components/scrollSelection/scrollSelection";
	import LightHint from "@/components/light-hint/light-hint.vue";
	export default {
		components: {
			navBar,
			ScrollSelection,
			LightHint
		},
		data() {
			return {
				infoText: '加载中···',
				showLoadingHint: false,
				valueName: 1,
				list: [{name: '待办任务'}, {name: '进行中'}],
				current: 0,
				noDataShow: false,
				contactIsolationPng: require("@/static/img/contact-isolation.png"),
				cancelReasonDefaultIndex: [0],
				cancelReasonOption: [],
				showCancelReason: false,
				currentCancelReason: '请选择',
				stateCompleteList: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				'templateType',
				'chooseHospitalArea',
			]),
			userName() {
				return this.userInfo['name']
			},
			proName () {
			  return this.userInfo['proName']
			},
			proId() {
				return this.userInfo['proId']
			},
			workerId() {
				return this.userInfo['user']['id']
			},
			depId() {
				return this.userInfo['depId'] === null ? '' : this.userInfo['depId']
			},
			depName() {
				return this.userInfo['depName'] === null ? '' : this.userInfo['depName']
			},
			userAccount() {
				return this.userInfo['userName']
			}
		},
		onLoad() {
			this.getDispatchTaskCancelReason();
			this.queryCompleteDispatchTask(
				{
				   proId:this.proId, workerId:'',state: -1,
				   departmentId: this.userInfo.depId
				},'待办任务'
			)
		},
		methods: {
			...mapMutations([
				'changeTransTaskMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			
			// 进入订单详情事件
			enterTaskMessage (item) {
				this.changeTransTaskMessage(item);
				uni.navigateTo({
					url: '/transManagementPackage/pages/transportWorkerOrderMessage/transportWorkerOrderMessage'
				})
			},
			
			// tab切换改变事件
			tabChange (index) {
				this.current = index['index'];
				if (this.current == 0) {
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, workerId:'',state: -1,
					   departmentId: this.userInfo.depId
					},'待办任务'
				  )
				} else {
				  this.queryCompleteDispatchTask(
					{
					   proId:this.proId, workerId:'',state: 3,
					   departmentId: this.userInfo.depId
					},'进行中'
				  )
				}
			},
			
			// 取消原因下拉选择框确认事件
			cancelReasonSureEvent (val,value,id) {
				if (val) {
					this.cancelReasonDefaultIndex = [id]
					this.currentCancelReason=  val;
					this.cancelDispatchTask({
						proId: this.proId,	//当前项目ID
						id: this.taskId, //当前任务ID
						reason: this.currentCancelReason, //取消原因
						state: 6
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
			stateTransfer (index) {
				switch(index) {
				  case 0 :
					return '未分配'
					break;
				  case 1 :
					return '未查阅'
					break;
				  case 2 :
					return '未开始'
					break;
				  case 3 :
					return '进行中'
					break;
				  case 4 :
					return '未结束'
					break;
				  case 5 :
					return '已延迟'
					break;
				  case 6 :
					return '已取消'
					break;
				  case 7 :
					return '已完成'
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
			
			// 查询运送任务
			queryCompleteDispatchTask (data,text) {
			  this.noDataShow = false;
			  this.showLoadingHint = true;
				this.infoText = '查询中···';
				this.stateCompleteList = [];
				let temporaryDataList = [];
			  getDispatchTaskComplete(data).then((res) => {
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
								planUseTime: item.planUseTime,
								planStartTime: item.planStartTime,
								patientInfoList: item.patientInfoList,
								state: item.state,
								setOutPlaceName: item.setOutPlaceName,
								destinationName: item.destinationName,
								taskTypeName: item.taskTypeName,
								toolName: item.toolName,
								priority: item.priority,
								number: item.taskNumber,
								id: item.id,
								quarantine: item.quarantine,
								distName: item.distName,
								destinations: item.destinations,
								patientName: item.patientName,
								bedNumber: item.bedNumber,
								startPhoto: item.startPhoto,
								endPhoto: item.endPhoto,
								isBack: item.isBack,
								isSign: item.isSign,
								tempFlag: item.tempFlag,
								workerName: item.workerName,
								reminder: item.reminder
							})
						}
				  } else {
						this.noDataShow = true
				  }
				} else {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'error'
						})
					}
			  })
			  .catch((err) => {
					this.$refs.uToast.show({
						title: `${err.message}`,
						type: 'error'
					});
					this.showLoadingHint = false;
					this.noDataShow = true;
			  })
			},
			
			// 获取取消原因列表
			getDispatchTaskCancelReason (data) {
				this.showLoadingHint = true;
				this.infoText = '查询中···';
				queryDispatchTaskCancelReason(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.cancelReasonOption = [];
						for (let item of res.data.data) {
							let temporaryWorkerMessageArray = [];
							for (let innerItem in item) {
							if (innerItem == 'id') {
								temporaryWorkerMessageArray.push(item[innerItem])
							};
							if (innerItem == 'cancelName') {
								temporaryWorkerMessageArray.push(item[innerItem])
							}
							};
							this.cancelReasonOption.push({text: temporaryWorkerMessageArray[1], value: temporaryWorkerMessageArray[1]})
						}
					} else {
						this.$refs.uToast.show({
							message: `${res.data.msg}`,
							type: 'error'
						})
					}
				})
				.catch((err) => {
					this.$refs.uToast.show({
						title: `${err.message}`,
						type: 'error'
					});
					this.showLoadingHint = false;
				})
			},
			
			// 取消事件
			cancel (item) {
				this.showCancelReason = true;
				this.taskId = item.id
			},
			
			// 运送任务取消
			cancelDispatchTask (data) {
				this.showLoadingHint = true;
				this.infoText = '取消中···';
			  updateDispatchTask(data).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						this.$refs.alertToast.show({
							type: 'success',
							message: '取消成功!',
							isShow: true
						});
						this.queryCompleteDispatchTask(
							{
								 proId:this.proId, workerId:'',state: -1,
								 departmentId: this.userInfo.depId
							},'待办任务'
						)
					} else {
						this.$refs.alertToast.show({
							type: 'error',
							message: '取消失败!',
							isShow: true
						})
					}
			  })
			  .catch((err) => {
					this.showLoadingHint = false;
					this.$refs.alertToast.show({
						type: 'error',
						message: `${err.message}`,
						isShow: true
					})
			  })
			},
			  
			// 运送任务催单
			reminder(item) {
				if (item.reminder == 1) {
					return
				};
				this.showLoadingHint = true;
				this.infoText = '催单中···';
			  taskReminder(this.proId,item.id).then((res) => {
					this.showLoadingHint = false;
			    if (res && res.data.code == 200) {
						this.$refs.alertToast.show({
							type: 'success',
							message: '催单成功!',
							isShow: true
						});
						this.queryCompleteDispatchTask(
							{
								 proId:this.proId, workerId:'',state: -1,
								 departmentId: this.userInfo.depId
							},'待办任务'
						)
			    } else {
			      this.$refs.alertToast.show({
			      	type: 'error',
			      	message: '催单失败!',
			      	isShow: true
			      })
			    }
			  })
			  .catch((err) => {
					this.showLoadingHint = false;
					this.$refs.alertToast.show({
						type: 'error',
						message: `${err.message}!`,
						isShow: true
					})
			  })
			},
			
			// tabBar点击事件
			tabBarEvent (index) {
			 this.valueName = index;
			 if (this.valueName == 0) {
				 uni.redirectTo({
					url: '/transManagementPackage/pages/index/index'
				 })
			 } else if (this.valueName == 1) {
				 uni.redirectTo({
					url: '/transManagementPackage/pages/realtimeTask/realtimeTask'
				 })
			 } else if (this.valueName == 2) {
				 uni.redirectTo({
					url: '/transManagementPackage/pages/historicalTask/historicalTask'
				 })
			 }
			} 
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	.content-box {
		@include content-wrapper;
		height: 100vh !important;
		box-sizing: border-box;
		background: #f6f6f6;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 200000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
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
		};
		.tab-bar {
			height: 85px;
			::v-deep {
				.u-tabbar {
					height: 100%;
					.u-tabbar__content {
						background: #F8F8F8;
					}
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
					width: 100px;
					height: 120px;
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
				 ::v-deep .u-tabs {
					 .u-tabs__wrapper {
						 .u-tabs__wrapper__nav {
								.u-tabs__wrapper__nav__item {
									padding: 0 20px;
									box-sizing: border-box;
								 &:nth-child(1) {
										justify-content: flex-start !important;
								 };
								 &:nth-child(2) {
										justify-content: flex-end !important;
								 }
								};
								.u-tabs__wrapper__nav__line {
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
						  > view {
						    font-size: 12px;
						    text {
						      color: #ACADAF;
						    };
						    &:first-child {
						      flex: 1;
						      display: flex;
						      align-items: center;
						      >text {
						      	display: inline-block;
										word-break: break-all;
										&:first-child {
											width: 110px;
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
									width: 40px;
									display: flex;
									align-items: center;
									justify-content: center;
									>image {
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
									>text {
										color: #fff;
										font-size: 14px;
									}
						    }
						  };
							.noAllocation {
								background: #E86F50 !important;
							};
							.noLookupStyle {
								background: #E8CB51 !important
							};
							.noStartStyle {
								background: #174E97 !important
							};
							.underwayStyle {
								background: #289E8E !important
							};
							.noEndStyle {
								background: #F2A15F !important
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
			 		  > view {
			 		    padding: 6px 0;
			 		    display: flex;
			 		    box-sizing: border-box;
			 		    flex-flow: row nowrap;
			 		    > view {
			 		      width: 50%;
			 		      > text {
			 		        &:last-child {
			 		          padding-left: 0;
			 		        }
			 		      }
			 		    }
			 		  };
			 			.item-top-two {
							box-sizing: border-box;
							padding: 10px 12px;
			 				> view {
								display: flex;
								word-break: break-all;
			 				  &:first-child {
			 				    width: 60%;
									padding-right: 6px;
									box-sizing: border-box;
			 						text {
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
			 						text {
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
			 		    > view {
								display: flex;
								word-break: break-all;
			 		      &:first-child {
			 		        width: 60%;
									padding-right: 6px;
									box-sizing: border-box;
									display: flex;
									text {
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
			 		    		text {
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
							 .bed-number {
								 display: flex;
								 width: 100%;
								 > view {
								 	>text {
								 		font-size: 12px;
								 		color: #101010;
								 	};
								   &:first-child {
								 		margin-right: 4px;
								 	};
								 	&:last-child {
								 		flex: 1;
								 		word-break: break-all;
								 		>text {
								 			margin-right: 4px;
								 		}
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
			 				> view {
								width: 45%;
								height: 30px;
								border-radius: 4px;
								text-align: center;
								line-height: 30px;
								>text {
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
