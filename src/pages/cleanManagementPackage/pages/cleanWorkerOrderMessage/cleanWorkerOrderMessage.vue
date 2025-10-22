<template>
  <view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast" />
		<view class="nav">
			<nav-bar :home="false" :isShowBackText="true" backState='3000' fontColor="#FFF" bgColor="none" title="任务详情" @backClick="backTo">
			</nav-bar> 
		</view>
		<!-- 图片放大弹框  -->
		<view class="image-dislog-box">
			 <u-modal :show="imageBoxShow" :closeOnClickOverlay="true" confirmText="关闭" @confirm="confirmEvent">
				 <template v-slot:default>
					<image :src="currentimageUrl" mode="widthFix" style="width:100%"/>
				 </template>
			 </u-modal> 
		</view>
    <view class="content">
      <view class="forthwith-task-number">
        <text>状态</text>
        <text :class="{
            'noStartStyle ' : environmentTaskMessage.state == 1 || environmentTaskMessage.state == 2,
            'underwayStyle' : environmentTaskMessage.state == 3,
            'waitReviewStyle' : environmentTaskMessage.state == 4,
            'completeStyle' : environmentTaskMessage.state == 5,
            'haveReviewStyle' : environmentTaskMessage.state == 6,
            'cancelStyle' : environmentTaskMessage.state == 7,
            'reviewStyle' : environmentTaskMessage.state == 8
          }">
            {{stausTransfer(environmentTaskMessage.state)}}
        </text>
      </view>
			<view class="location">
			  <text>创建时间</text>
			  <text>{{environmentTaskMessage.createTime }}</text>
			</view>
      <view class="location">
        <text>位置</text>
        <text>{{ `${environmentTaskMessage.structureName}-${environmentTaskMessage.depName}-${environmentTaskMessage.areaImmediateName}-${extractSpaceMessage(environmentTaskMessage.spaces)}` }}</text>
      </view>
			<view class="location">
			  <text>优先级</text>
			  <text>{{environmentTaskMessage.priority }}</text>
			</view>
			<view class="issue-picture">
			  <view>图片</view>
			  <view class="image-list">
			    <image :src="item.path" mode="widthFix" alt="" v-for="(item,index) in problemPicturesEchoList" :key="index" @click="enlareEvent(item)">
			  </view>
			</view>
			<view class="location problem-description">
			  <text>问题描述</text>
			  <text>{{ environmentTaskMessage.taskRemark}}</text>
			</view>
			<view class="location" v-if="environmentTaskMessage.state == 7">
			  <text>取消原因</text>
			  <text>{{environmentTaskMessage.cancelReason }}</text>
			</view>
			<view class="location" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
			  <text>开始时间</text>
			  <text>{{environmentTaskMessage.startTime }}</text>
			</view>
      <view class="location" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
        <text>保洁主管</text>
        <text>{{ !environmentTaskMessage.managerName ? '未选择' : environmentTaskMessage.managerName }}</text>
      </view>
      <view class="location-other" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
        <view class="location-other-left">
          <text class="cleaner">保洁员</text>
        </view>
				<view class="location-other-right" >
					{{ !environmentTaskMessage.workerName ? '未选择' : environmentTaskMessage.workerName }}
				</view>
      </view>
      <view class="issue-picture" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
        <view>结果图片</view>
        <view class="image-list">
          <image :src="item.path" mode="widthFix" alt="" v-for="(item,index) in problemPicturesEchoList" :key="index" @click="enlareEvent(item)">
        </view>
      </view>
			<view class="location problem-description" v-if="environmentTaskMessage.state == 3 || environmentTaskMessage.state == 4 || environmentTaskMessage.state == 5 || environmentTaskMessage.state == 8">
			  <text>备注</text>
			  <text>{{ environmentTaskMessage.taskRemark}}</text>
			</view>
    </view>
  </view>
</template>
<script>
import { cancelTask, getForthwithCleanTaskDetails } from "@/api/environment.js";
import { mapGetters, mapMutations } from "vuex";
import navBar from "@/components/zhouWei-navBar"
import { setCache, removeAllLocalStorage } from "@/common/js/utils";
import _ from 'lodash'
export default {
  components: {
    navBar
  },
  data() {
    return {
			showLoadingHint: false,
			infoText: '加载中···',
			taskId: '',
			tierNum: 0,
			currentimageUrl: '',
			imageBoxShow: false,
      environmentSelectCancelReason: {},
      environmentCancelReasonShow: false,
      environmentCancelReasonValue: null,
      environmentCancelReasonOption: [{text: "请选择取消原因",value: null}],
			problemPicturesEchoList: []
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
		const pages = getCurrentPages(); //获取当前页面栈的实例数组
		if (pages.length == 1) {
			this.tierNum = 1
		} else {
			this.tierNum = pages.length;
		};
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

		// 顶部导航返回事件
		backTo () {
			uni.navigateBack()
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
				 this.$refs.uToast.show({
					message: `${res.data.msg}`,
					type: 'error'
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
      return this.cleanerOption.filter((item) => { return item.value == val})[0]['text']
    }
  }
};
</script>
<style lang='scss' scoped>
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
 /*图片放大弹框 */
 .image-dislog-box {
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
      >text {
        font-size: 14px;
        display: inline-block;
        &:first-child {
          flex: 1;
          color: #9C9C9C;
          padding-right: 4px;
          box-sizing: border-box;
          @include no-wrap();
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
       >text {
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
        >text {
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
            >text {
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
      >text {
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
      >view {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {
        };
        &:last-child {
          >image {
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
      >view {
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
  		>text {
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