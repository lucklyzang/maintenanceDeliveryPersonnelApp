<template>
  <div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
			<div class="nav">
				<NavBar title="任务详情" :path="fromPath" />
			</div>
		</div>
		<!-- 图片放大弹框  -->
		<div class="img-dislog-box">
      <van-dialog v-model="imageBoxShow"  @close="deleteInfoDialogShow = false"
		    @confirm="confirmEvent" @cancel="deleteInfoDialogShow" confirmButtonColor="#3890EE" confirmButtonText="关闭">
        <img :src="currentimageUrl" style="width:100%"/>
		  </van-dialog>
		</div>
    <div class="content">
      <div class="forthwith-task-number">
        <span>状态</span>
        <span :class="{
            'noStartStyle ' : environmentTaskMessage.state == 1 || environmentTaskMessage.state == 2,
            'underwayStyle' : environmentTaskMessage.state == 3,
            'waitReviewStyle' : environmentTaskMessage.state == 4,
            'completeStyle' : environmentTaskMessage.state == 5,
            'haveReviewStyle' : environmentTaskMessage.state == 6,
            'cancelStyle' : environmentTaskMessage.state == 7,
            'reviewStyle' : environmentTaskMessage.state == 8
          }">
            {{stausTransfer(environmentTaskMessage.state)}}
        </span>
      </div>
			<div class="location">
			  <span>创建时间</span>
			  <span>{{environmentTaskMessage.createTime }}</span>
			</div>
      <div class="location">
        <span>位置</span>
        <span>{{ `${environmentTaskMessage.structureName}-${environmentTaskMessage.depName}-${environmentTaskMessage.areaImmediateName}-${extractSpaceMessage(environmentTaskMessage.spaces)}` }}</span>
      </div>
			<div class="location">
			  <span>优先级</span>
			  <span>{{environmentTaskMessage.priority }}</span>
			</div>
			<div class="issue-picture">
			  <div>图片</div>
			  <div class="img-list">
			    <img :src="item.path" mode="widthFix" alt="" v-for="(item,index) in problemPicturesEchoList" :key="index" @click="enlareEvent(item)">
			  </div>
			</div>
			<div class="location problem-description">
			  <span>问题描述</span>
			  <span>{{ environmentTaskMessage.taskRemark}}</span>
			</div>
			<div class="location" v-if="environmentTaskMessage.state == 7">
			  <span>取消原因</span>
			  <span>{{environmentTaskMessage.cancelReason }}</span>
			</div>
			<div class="location" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
			  <span>开始时间</span>
			  <span>{{environmentTaskMessage.startTime }}</span>
			</div>
      <div class="location" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
        <span>保洁主管</span>
        <span>{{ !environmentTaskMessage.managerName ? '未选择' : environmentTaskMessage.managerName }}</span>
      </div>
      <div class="location-other" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
        <div class="location-other-left">
          <span class="cleaner">保洁员</span>
        </div>
				<div class="location-other-right" >
					{{ !environmentTaskMessage.workerName ? '未选择' : environmentTaskMessage.workerName }}
				</div>
      </div>
      <div class="issue-picture" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
        <div>结果图片</div>
        <div class="img-list">
          <img :src="item.path" mode="widthFix" alt="" v-for="(item,index) in problemPicturesEchoList" :key="index" @click="enlareEvent(item)">
        </div>
      </div>
			<div class="location problem-description" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
			  <span>备注</span>
			  <span>{{ environmentTaskMessage.taskRemark}}</span>
			</div>
    </div>
  </div>
</template>
<script>
import { getForthwithCleanTaskDetails } from "@/api/environment.js";
import { mapGetters, mapMutations } from "vuex";
import NavBar from "@/components/NavBar";
import _ from 'lodash'
export default {
  components: {
    NavBar
  },
  data() {
    return {
			showLoadingHint: false,
			infoText: '加载中···',
			taskId: '',
			tierNum: 0,
			currentimageUrl: '',
      deleteInfoDialogShow: false,
			imageBoxShow: false,
      environmentSelectCancelReason: {},
      environmentCancelReasonShow: false,
      environmentCancelReasonValue: null,
			problemPicturesEchoList: [],
      fromPath: ''
    }
  },

  watch: {},

  computed: {
    ...mapGetters([
			"userInfo",
			"environmentTaskMessage",
			'statusBarHeight',
			'navigationBarHeight',
			'allOrderCancelReason',
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
		this.taskId = this.environmentTaskMessage.id;
		this.getForthwithCleanTaskDetailsEvent(this.taskId);
	},
  methods: {
    ...mapMutations([
			'storeCurrentIndex',
			'changeEnvironmentTaskMessage'
		]),
		
		// 图片放大弹框关闭事件
		confirmEvent () {
			this.imageBoxShow = false
		},
		
		// 提取图片事件
		getResultimageList () {
			this.problemPicturesEchoList = [];
			if (this.environmentTaskMessage.hasOwnProperty('images')) {
				if (this.environmentTaskMessage['images'].length > 0) {
					this.problemPicturesEchoList = this.environmentTaskMessage['images'].filter((item) => { return item.imgType == 0});
				}
			}	
		},
		
		// 图片放大事件
		enlareEvent (item) {
		  this.currentimageUrl = item.path;
		  this.imageBoxShow = true;
		},
		
		// 查询环境管理任务详情
		getForthwithCleanTaskDetailsEvent (id) {
			this.showLoadingHint = true;
			this.infoText = '加载中···'
			getForthwithCleanTaskDetails(id).then((res) => {
				this.showLoadingHint = false;
				if (res && res.data.code == 200) {
					this.changeEnvironmentTaskMessage(res.data.data);
					this.getResultimageList();
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
				this.$refs.uToast.show({
					message: `${err}`,
					type: 'error'
				})
			})
		},

    // 提取即时保洁功能区信息
    extractSpaceMessage (spaces) {
      if (spaces.length == 0) {
          return ''
      };
      let temporaryArray = [];
      for (let item of spaces) {
          temporaryArray.push(item.name);
      };
      return temporaryArray.join("、")
    },

    // 任务状态转换
    stausTransfer (num) {
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

    // 格式化时间
    getNowFormatDate(currentDate) {   
      let seperator1 = "-";
      let seperator2 = ":";
      let month = currentDate.getMonth() + 1;
      let strDate = currentDate.getDate();
      let hours = currentDate.getHours();
      let strMinutes = currentDate.getMinutes();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      if (strMinutes >= 0 && strMinutes <= 9) {
          strMinutes = "0" + strMinutes;
      }
      if (hours >= 0 && hours <= 9) {
        hours = "0" + hours;
      }
      let currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
              + " " + hours + seperator2 + strMinutes
      return currentdate;
    },

    // 提取保洁员姓名
    extractCleanerName (val) {
      return this.cleanerOption.filter((item) => { return item.value == val})[0]['span']
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
 /*图片放大弹框 */
 .img-dislog-box {
 	/deep/ .u-popup__content {
 		border-radius: 10px !important;
 		.u-modal {
 		  border-radius: 10px !important;
 		  overflow: inherit !important;
 		  .u-modal__content {
 				padding: 10 !important;
 				box-sizing: border-box;
				max-height: 85vh;
				overflow: auto;
 			}
 		}
 	}		
 };
  .content {
    flex: 1;
    overflow: auto;
    padding: 0 0 10px 0;
    box-sizing: border-box;
    .forthwith-task-number {
      padding: 0 8px;
      margin-bottom: 6px;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      >span {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          flex: 1;
          color: #9C9C9C;
          padding-right: 4px;
          box-sizing: border-box;
          .no-wrap();
        };
        &:last-child {
          color: #a1a0a0;
          width: 60px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          justify-content: center;
          border-radius: 4px;
          background: #f3f3f3;
        }
      };
       .noStartStyle {
					background: #BBBBBB !important;
					color: #fff !important;
       };
       .underwayStyle {
					background: #289E8E !important;
					color: #fff !important;
       };
       .completeStyle {
					background: #242424 !important;
					color: #fff !important;
       };
       .reviewStyle {
					background: #F2A15F !important;
					color: #fff !important;
       };
       .haveReviewStyle {
					background: #9B7D31 !important;
					color: #fff !important;
       };
       .waitReviewStyle {
					background: orange !important;
					color: #fff !important;
       };
       .cancelStyle {
					background: #E8CB51 !important;
					color: #fff !important;
       };
       .completeStyle {
					background: #101010 !important;
					color: #fff !important;
       }
    };
    .location {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
       >span {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          color: #9C9C9C;
        };
        &:last-child {
          color: #000000;
          flex: 1;
          text-align: right;
          line-height: 24px;
          padding-left: 8px;
          box-sizing: border-box;
          word-break: break-all
        }
      }
    };
    .location-other {
      padding: 10px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      .location-other-left {
        >span {
          font-size: 14px;
          display: inline-block
        };
        .sign {
          color: red
        };
        .cleaner {
          color: #a1a0a0
        }
      };
      .location-other-right {
        color: #101010;
        flex: 1;
        text-align: right;
        line-height: 24px;
        padding-left: 8px;
        box-sizing: border-box;
        word-break: break-all;
        /deep/ .vue-dropdown {
          border: none !important;
          .cur-name {
            >span {
              font-size: 14px;
              padding-right: 10px;
              box-sizing: border-box;
              color: #101010 !important
            };
            .van-icon {
              font-size: 18px !important;
              color: #101010 !important
            }
          };
          .list-and-search {
            font-size: 14px;
            border: none !important
          }
        }
      }
    };
    .problem-description {
			flex-direction: column;
      >span {
        width: 100%;
				display: inline-block;
				&:last-child {
					text-align: left;
					padding-left: 0 !important;
				}
      }
    };
    .issue-picture {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
			flex-direction: column;
      background: #fff;
      >div {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {
        };
        &:last-child {
          >img {
            width: 31%;
            margin-right: 2%;
            margin-bottom: 6px;
            &:nth-child(3n+3) {
              margin-right: 0
            }
          }
        }
      }
    };
    .remark {
      padding: 12px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      >div {
        font-size: 14px;
        color: #a1a0a0;
        line-height: 20px;
        &:first-child {

        };
        &:last-child {
          flex: 1;
          margin-left: 8px;
          color: #101010
        }
      }  
    }
  };
  .btn-box {
  		height: 80px;
  		display: flex;
  		align-items: center;
  		justify-content: center;
  		padding-bottom: 20px;
  		box-sizing: border-box;
  		>span {
  			font-weight: bold;
  			display: inline-block;
  			font-size: 14px;
  			width: 108px;
  			height: 40px;
  			text-align: center;
  			line-height: 40px;
  			box-sizing: border-box;
  			border-radius: 4px;
  			color: #fff;
  		};
  		.operate-one {
  			margin-right: 20px;
  			background: #E8CB51
  		};
  		.operate-two {
  			background: #ffffff;
  			color: #101010 !important;
  			border: 1px solid #BBBBBB;
  		}
  }
}
</style>