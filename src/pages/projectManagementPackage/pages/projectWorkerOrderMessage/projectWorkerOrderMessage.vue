<template>
  <div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
	<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
	<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
		<div class="nav">
			<NavBar title="任务详情" :path="fromPath" />
		</div>
	</div>
    <!-- 图片放大弹框  -->
    <div class="image-dislog-box">
		 <van-dialog v-model="imageBoxShow"  @close="deleteInfoDialogShow = false"
		    @confirm="confirmEvent" @cancel="deleteInfoDialogShow" confirmButtonColor="#3890EE" confirmButtonText="关闭">
        	<img :src="currentimageUrl" style="width:100%"/>
		</van-dialog>
    </div>
    <div class="content">
			<div class="message-box">
					<div class="message-one">
							<div class="message-one-left">
									<span>编号:</span>
									<span>{{ projectTaskMessage.taskNumber }}</span>
							</div>
							<div class="message-one-right"
								:class="{
									'noAllocation':projectTaskMessage.state == 0,
									'waitSureStyle':projectTaskMessage.state == 1,
									'waitFinishStyle': projectTaskMessage.state == 2,
									'underwayStyle':projectTaskMessage.state == 3,
									'waitSignatureStyle':projectTaskMessage.state == 4,
									'completeStyle':projectTaskMessage.state == 5,
									'cancelStyle':projectTaskMessage.state == 6,
									'delayStyle':projectTaskMessage.state == 7,
									'waitCheckStyle':projectTaskMessage.state == 8
								}"
							>
									{{ projectTaskStatusTransition(projectTaskMessage.state) }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>创建时间</span>
							</div>
							<div class="message-two-right">
									{{ projectTaskMessage.createTime }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>已经历时间</span>
							</div>
							<div class="message-two-right">
									{{ elapsedTime(projectTaskMessage.planStartTime) }}
							</div>
					</div>
					 <div class="message-one message-two">
							<div class="message-two-left">
									<span>响应时间</span>
							</div>
							<div class="message-two-right">
									{{ projectTaskMessage.responseTime == null ? '无' : projectTaskMessage.responseTime }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>开始时间</span>
							</div>
							<div class="message-two-right">
									{{ projectTaskMessage.planStartTime }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>位置</span>
							</div>
							<div class="message-two-right">
									{{ projectTaskMessage.depName == '/' ? '' : projectTaskMessage.depName }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>房间</span>
							</div>
							<div class="message-two-right">
								 {{ disposeCheckType(projectTaskMessage.spaces) }}
							</div>
					</div>
					<div class="message-one message-two message-six">
							<div class="message-two-left">
									<span>优先级</span>
							</div>
							<div class="message-two-right" 
							:class="{
									'priorityNormalStyle' : projectTaskMessage.priority == 1,
									'priorityUrgencyStyle' : projectTaskMessage.priority == 2,
									'priorityImportanceStyle' : projectTaskMessage.priority == 3,
									'priorityUrgentImportanceStyle' : projectTaskMessage.priority == 4,
							 
							 }">
									{{ taskPriotityTransition(projectTaskMessage.priority) }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>维修员</span>
							</div>
							<div class="message-two-right">
									{{ projectTaskMessage.workerName ? projectTaskMessage.workerName : '无' }}
							</div>
					</div>
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>参与人</span>
							</div>
							<div class="message-two-right">
									{{ disposeTaskPresent(projectTaskMessage.present) }}
							</div>
					</div>
					<div class="issue-image">
							<div class="issue-image-left">
								<span>问题图片</span>
							</div>
							<div class="issue-image-list" v-if="issueImage.length > 0">
								<img alt="" v-for="(innerItem,innerIndex) in issueImage" :key="innerIndex" :src="innerItem.path" @click="enlareEvent(innerItem.path)" />
							</div>
					</div>   
					<div class="message-one message-two">
							<div class="message-two-left">
									<span>问题描述</span>
							</div>
							<div class="message-two-right task-remark">
									{{ projectTaskMessage.taskDesc }}
							</div>
					</div>
			</div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { repairsDetails, repairsImage } from "@/api/project.js";
import NavBar from "@/components/NavBar";
export default {
  components: {
		NavBar
  },
  data() {
    return {
		infoText: '加载中···',
		showLoadingHint: false,
      	currentimageUrl: '',
		deleteInfoDialogShow: true,
      	imageBoxShow: false,
		issueImage: [],
		fromPath: ''
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fromPath = from['path']
    })
  },
	
	mounted () {
		this.parallelFunction()
	},
	
  watch: {},

  computed: {
    ...mapGetters(["userInfo","projectTaskMessage",'statusBarHeight','navigationBarHeight','chooseHospitalArea']),
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

  methods: {
    ...mapMutations([
			'storeCurrentIndex',
			'changeProjectTaskMessage'
		]),
		 
		 // 并行查询任务详情、任务图片
		 parallelFunction () {
			this.infoText = '查询中···';
		 	this.showLoadingHint = true;
		 	Promise.all([this.getRepairsDetails(this.projectTaskMessage['id']),this.getRepairsImage()])
		 	.then((res) => {
		 		this.showLoadingHint = false;
		 		if (res && res.length > 0) {
		 			this.taskTypeOption = [];
		 			this.goalDepartmentOption = [];
		 			let [item1,item2] = res;
					// 任务详情
		 			if (item1) {
		 				this.changeProjectTaskMessage(item1)
		 			};
		 			if (item2) {
		 				// 任务图片
		 				if (item2.length > 0) {
		 					this.issueImage = item2.filter((item) => { return item.imgType == 1 })
		 				}
		 			}
		 		}
		 	})
		 	.catch((err) => {
		 		this.showLoadingHint = false;
		 		this.$refs.uToast.show({
		 			message: `${err.message}`,
		 			type: 'error'
		 		})
		 	})
		 },
		 
		 
		 // 查询工程任务图片
		 getRepairsImage () {
			 return new Promise((resolve, reject) => {
				repairsImage({taskId:this.projectTaskMessage['id']})
				.then((res) => {
					if (res && res.data.code == 200) {
						resolve(res.data.data)
					} else {
						this.showLoadingHint = false;
						reject();
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
		 
		 // 查询工程任务详情
			getRepairsDetails (id) {
				return new Promise((resolve, reject) => {
					repairsDetails(id).then((res) => {
						if (res && res.data.code == 200) {
							resolve(res.data.data)
						} else {
							this.showLoadingHint = false;
							reject();
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

    // 处理维修任务空间信息
    disposeCheckType (item) {
      if (!item) { return };
      if (item.length == 0) { return '无' };
      let temporaryArray = [];
      for (let innerItem of item) {
				innerItem.hasOwnProperty('value') ? temporaryArray.push(innerItem.value) : temporaryArray.push(innerItem.name);
      };
      return temporaryArray.join('、')
    },
		
    // 计算已经历时间
    elapsedTime (planStartTme) {
      let currentTime = new Date().getTime();
      let transferPlanStartTme = new Date(planStartTme).getTime();
      if (transferPlanStartTme > currentTime) {
        return ''
      } else {
        return `${this.$moment(currentTime).diff(transferPlanStartTme, 'minutes')}分钟`
      }
    },

    // 图片放大事件
    enlareEvent (item) {
      this.currentimageUrl = item;
      this.imageBoxShow = true
    },
		
	// 图片放大弹框关闭事件
	confirmEvent () {
		this.imageBoxShow = false
	},
		
	// 处理维修任务参与者
	disposeTaskPresent (item) {
		if (!item) { return };
		if (item.length == 0) { return '无' };
		let temporaryArray = [];
		for (let innerItem of item) {
			temporaryArray.push(innerItem.name)
		};
		return temporaryArray.join('、')
	},


    // 优先级转换
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
		
    // 任务状态转换
    projectTaskStatusTransition (state) {
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
		}
  }
};
</script>
<style lang='less' scoped>
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
  /deep/ .van-popup--right {
    padding: 20px 0 80px 0;
    box-sizing: border-box;
    .top-icon {
        padding-left: 10px;
        box-sizing: border-box
    };
    .center-content {
        margin-top: 20px;
        .function-list {
            width: 153px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            margin: 0 auto;
            border: 1px solid #3B9DF9;
            box-sizing: border-box;
            font-size: 16px;
            color: #3B9DF9;
            border-radius: 8px;
            margin-bottom: 20px
        };
        .functionListStyle {
            color: #fff !important;
            border: none !important;
            background: #3B9DF9 !important
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
  .content {
		 flex: 1;
		 overflow: auto;
		 padding: 0 0 10px 0;
		 box-sizing: border-box;
		.message-box {
				.message-one {
						width: 100%;
						padding: 4px 6px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						justify-content: space-between;
						font-size: 14px;
						margin-top: 6px;
						.message-one-left {
								color: #289E8E
						};
						.message-one-right {
							width: 61px;
							height: 27px;
							text-align: center;
							line-height: 27px;
							color: #fff;
							background: #E86F50;
							border-radius: 4px
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
				};
				.message-two {
						align-items: flex-start !important;
						padding: 11px 6px;
						.message-two-left {
								color: #9E9E9A
						};
						.message-two-right {
								flex: 1;
								color: #101010;
								line-height: 20px;
								word-break: break-all;
								padding-left: 10px;
								box-align: border-box;
								text-align: right
						};
						.task-remark {
								text-align: left !important
						}
				};
				.message-six {
						align-items: flex-start !important;
						.priorityNormalStyle { 
								color: #289E8E !important
						};
						.priorityUrgencyStyle { 
								color: #E8CB51 !important
						};
						.priorityImportanceStyle { 
								color: #F2A15F !important
						};
						.priorityUrgentImportanceStyle { 
								color: #E86F50 !important
						}
				};
				.issue-image {
						width: 100%;
						padding: 4px 6px;
						box-sizing: border-box;
						background: #fff;
						display: flex;
						align-items: center;
						font-size: 14px;
						margin-top: 6px;
						align-items: center;
						.issue-image-left {
								color: #9E9E9A
						};
						.issue-image-list {
								flex: 1;
								display: flex;
								margin-left: 6px;
								flex-flow: row wrap;
								> img {
									width: 22%;
									margin-right: 4%;
									margin-bottom: 10px;
									&:nth-child(4n) {
										margin-right: 0
									}
								}
						}
				}
		}
  }
}
</style>