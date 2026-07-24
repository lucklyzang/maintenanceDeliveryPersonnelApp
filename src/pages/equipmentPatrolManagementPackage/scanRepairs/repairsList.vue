<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <div class="nav">
      <van-nav-bar title="报修列表" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="scanCodeEvent" :border="false">
        <template #right>
            <van-icon name="scan" size="24" color="#fff" />
        </template>
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
          <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
            <div class="order-list-box" ref="scrollBacklogTask">
				<div class="order-list" v-for="(item,index) in repairsList" :key="index">
					<div class="order-list-top">
						<div class="order-type">
							<span>工单号</span>
							<span>343434</span>
						</div>
						<div class="order-status"
						:class="{
							'staySureStyle ' : item.status == 20, 
							'stayDeliveryStyle' : item.status == 30,
                            'hasDeliveryStyle' : item.status == 40
							}"
						>
							<span>{{ taskStatusTransition(item.state,item.eventType) }}</span>
						</div>
					</div>
					<div class="order-list-center">
						<div class="create-delivery-date">
							<div class="create-delivery-date-left">
								<span>任务类型:</span>
								<span>维修</span>
							</div>
							<div class="create-delivery-date-left">
								<span>设备名称:</span>
								<span>就看到啦</span>
							</div>
						</div>
						<div class="create-delivery-date delivery-address">
                            <div class="create-delivery-date-left">
								<span>所属科室:</span>
								<span>体检科</span>
							</div>
							<div class="create-delivery-date-left">
								<span>所属空间:</span>
								<span>更衣室</span>
							</div>
						</div>
                        	<div class="create-delivery-date">
							<div class="create-delivery-date-left">
								<span>严重程度:</span>
								<span>中等</span>
							</div>
							<div class="create-delivery-date-left">
								<span>设备状态:</span>
								<span>维修</span>
							</div>
						</div>
						<div class="remark-box">
							<span>问题描述:</span>
							<span>很多纱卡纱卡里的哈伦裤等哈看了等哈看的</span>
						</div>
					</div>
					<div class="order-list-bottom">
						<div class="order-list-btn">
							<div class="delete-left" @click.stop="cancelOrderEvent(item,index)">
								<span>取消</span>
							</div>
						</div>
					</div>
				</div>
                <van-empty description="报修列表为空" v-show="isShowNoData" />
                <div v-show="bottomLoadingShow" class="bottom-loading-show">
                    加载中...
                </div>
                <div class="no-more-data" v-show="isShowNoMoreData && !loadingShow && !isShowNoData && !bottomLoadingShow">没有更多数据了!</div>
			</div>
        </div>
    </div>
     <!-- 取消原因弹框 -->
    <div class="deliver-goods-modal">
        <van-dialog v-model="cancelReasonShow" :showConfirmButton="false">
            <div class="evaluate-model-content">
                <div class="evaluate-modal-top">
                    <span>取消原因</span>
                    <van-icon name="cross" color="#101010" size="20" @click="cancelReasonShow = false" />
                </div>
                <div class="evaluate-modal-center">
                    <div class="evaluate-box delivery-person">
                        <div class="evaluate-span">
                            <span>*</span>
                            <span>取消原因:</span>
                        </div>
                        <div class="evaluate-content" @click="cancelReasonListShow = !cancelReasonListShow">
                            <div>
                                <span class="delivery-person-content">{{ currentCancelReason }}</span>
						        <van-icon :name="cancelReasonListShow ? 'arrow-down' : 'arrow-up'" color="#101010" size="16" />
                            </div>
                           <div class="delivery-person-list-box" v-if="cancelReasonListShow">
                                <div class="delivery-person-list" v-for="(item,index) in cancelReasonList" @click.stop="cancelReasonListEvent(item,index)" :key="index">
                                    <span :class="{'deliveryPersonspanStyle': index === currentCancelReasonIndex }">{{ item.name }}</span>
                                </div>
					        </div>
                        </div>
                    </div>
                    <div class="evaluate-box remark-box">
                        <div class="evaluate-span">
                            <span>备注:</span>
                        </div>
                        <div class="evaluate-content">
                            <van-field
                                v-model="remarkValue"
                                type="textarea"
                                placeholder="请输入"
                            />
                        </div>
                    </div>
                </div>
                <div class="evaluate-modal-bottom">
                    <div class="evaluate-modal-btn">
                        <div class="cancel-left" @click.stop="cancelReasonModalCancelEvent">
                            <span>取消</span>
                        </div>
                        <div class="submit-right" @click.stop="cancelReasonModalSubmitEvent(item,index)">
                            <span>提交</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-dialog>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { throttle } from '@/common/js/utils'
import { getEventList, eventRegisterCancel } from '@/api/securityPatrol/escortManagement.js'
import { queryRepairsTaskCancelReason } from '@/api/project/taskScheduling.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
export default {
  name: "EquipmentList",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      repairsList: [],
      fullRepairsList: [],
      loadingShow: false,
      isShowNoData: false,
      bottomLoadingShow: false,
      isShowNoMoreData: false,
      loadText: '加载中···',
      cancelReasonShow: false,
      cancelReasonListShow: false,
      currentCancelReason: '请选择',
      currentOrderId: '',
      currentOrderIndex: '',
      currentCancelReasonIndex: '',
      currentCancelReasonalue: '',
      cancelReasonList: [],
      remarkValue: '',
      eventTime: 0,
      scrollTop: 0,
      totalCount: '',
      currentPage: 1,
      pageSize: 10,
      continueQuest: true,
      throttledScrollHandler: null,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/equipmentPatrolHome");
    this.$nextTick(()=> {
      this.initScrollChange()
    });
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    };
    // 查询取消原因列表
    this.getCancelReason();
    // 查询报修列表
    this.queryEventList({
        proId: this.proId, system: 6, 
        workerId: this.workerId,page: this.currentPage, limit: this.pageSize, name: this.userName,
        startDate: '',endDate: '',eventType: [1],registerType: [1]
    },true)
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
	  });
    next() 
  },

  beforeRouteLeave(to,from,next) {
    // 移除滚动监听器
    this.removeScrollListener();
    next()
  },


  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea"]),
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

  methods: {
    ...mapMutations(["changePatrolTaskListMessage","changeScanRepairsMessage"]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/equipmentPatrolHome'})
    },

    // 任务状态转换
    taskStatusTransition (num,eventType) {
      if (eventType == 1) {
        switch(num) {
          case -1 :
              return '已暂存'
              break;
          case 0 :
              return '已报修'
              break;
          case 3 :
              return '已完成'
              break;
          case 6 :
              return '已取消'
              break
        }
      } else if (eventType == 2) {
        switch(num) {
          case -1 :
              return '已暂存'
              break;
          case 0 :
              return '已登记'
              break;
          case 1 :
              return '已交接'
              break;
          case 2 :
            return '已联系'
            break;
          case 3 :
              return '已领取'
              break
        }
      } else if (eventType == 3) {
        switch(num) {
          case -1 :
              return '已暂存'
              break;
          case 0 :
              return '已登记'
              break
        }
      }
    },

     /**
     * 滚动事件的原始处理逻辑
     * 检查是否滚动到底部并决定是否加载更多
     */
    _rawEventListLoadMore() {
      const boxBackScroll = this.$refs.scrollBacklogTask;
      if (!boxBackScroll) {
        return;
      };
      // 更新滚动位置
      this.scrollTop = boxBackScroll.scrollTop;
      // 判断是否滚动到底部
      const isAtBottom = Math.ceil(boxBackScroll.scrollTop) + boxBackScroll.offsetHeight >= boxBackScroll.scrollHeight;
      if (isAtBottom) {
        // 检查是否允许继续请求
        if (!this.continueQuest) {
            return;
        };
        // 检查是否还有更多页可以加载
        const totalPage = Math.ceil(this.totalCount / this.pageSize);
        if (this.currentPageNum >= totalPage) {
            // 已经是最后一页
            this.isShowNoMoreData = true;
        } else {
            // 还有更多页，加载下一页
            this.isShowNoMoreData = false;
            this.currentPageNum++;
            this.queryEventList({
                proId: this.proId, system: 6, 
                workerId: this.workerId,page: this.currentPage, limit: this.pageSize, name: this.userName,
                startDate: '',endDate: '',eventType: [1],registerType: [1]
            },false)
        }
      }
    },

    /**
     * 初始化滚动事件监听器
     * 使用节流函数优化性能
     */
    initScrollChange() {
        const boxBackScroll = this.$refs.scrollBacklogTask;
        if (!boxBackScroll) {
            return;
        };
        // 创建一个节流后的事件处理函数
        // 将滚动检查逻辑限制在 200ms 内最多执行一次
        this.throttledScrollHandler = throttle(this._rawEventListLoadMore, 200);
        // 添加事件监听器
        boxBackScroll.addEventListener('scroll', this.throttledScrollHandler, true);
    },

    /**
     * 移除滚动事件监听器
     * 在组件销毁前必须执行，防止内存泄漏
    */
    removeScrollListener() {
      const boxBackScroll = this.$refs.scrollBacklogTask;
      if (boxBackScroll && this.throttledScrollHandler) {
        boxBackScroll.removeEventListener('scroll', this.throttledScrollHandler, true)
        this.throttledScrollHandler = null;
      }
    },

    // 获取取消原因列表
    getCancelReason () {
        this.loadingShow = true;
        this.infoText = '查询中···';
        this.cancelReasonList = [{
            name: '请选择取消原因',
            value: null
        }];
        queryRepairsTaskCancelReason({proId: this.proId,state: 0,reason: ''})
        .then((res) => {
          this.loadingShow = false;
          this.infoText = '';
          if (res && res.data.code == 200) {
            for (let i = 0, len = res.data.data.length; i < len; i++) {
                this.cancelReasonList.push({
                  name: res.data.data[i]['cancelName'],
                  value: res.data.data[i]['id']
                })
            }
          } else {
            this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
            }).then(() => {})
          }
        })
        .catch((err) => {
            this.loadingShow = false;
            this.infoText = '';
            this.$dialog.alert({
                message: `${err}`,
                closeOnPopstate: true
            }).then(() => {})
        })
    },

    // 查询事件列表
    queryEventList(data,flag) {
        this.repairsList = [];
        this.isShowNoData = false;
        if (flag) {
            this.fullRepairsList = [];
            this.loadingShow = true;
            this.infoText = '加载中···';
            this.bottomLoadingShow = false;
        } else {
            this.loadingShow = false;
            this.infoText = '';
            this.bottomLoadingShow = true;
        };
        getEventList(data).then((res) => {
            this.continueQuest = true;
            if ( res && res.data.code == 200) {
                this.repairsList = res.data.data.list;
                this.totalCount = res.data.data.total;
                this.fullRepairsList = this.fullRepairsList.concat(this.repairsList);
                if (this.fullRepairsList.length == 0) {
                    this.isShowNoData = true
                } else {
                    this.isShowNoData = false
                }
            } else {
                this.$dialog.alert({
                    message: `${res.data.msg}`,
                    closeOnPopstate: true
                }).then(() => {})
            };
            if (flag) {
                this.loadingShow = false;
                this.isShowNoMoreData = true;
                this.infoText = '';
            } else {
                this.bottomLoadingShow = false;
                let totalPage = Math.ceil(this.totalCount/this.pageSize);
                if (this.currentPageNum >= totalPage) {
                    this.isShowNoMoreData = true;
                } else {
                    this.isShowNoMoreData = false;
                }
            }
        })
        .catch((err) => {
            this.continueQuest = true;
            if (flag) {
                this.loadingShow = false;
                this.isShowNoMoreData = false;
                this.infoText = '';
            } else {
                this.bottomLoadingShow = false;
            };
            this.$dialog.alert({
                message: `${err}`,
                closeOnPopstate: true
            }).then(() => {})
        })
    },

    // 取消登记事件
    eventRegisterCancelEvent(data) {
        this.loadingShow = true;
        this.infoText = '取消中···';
        eventRegisterCancel(data)
        .then((res) => {
          this.loadingShow = false;
          this.infoText = '';
          if (res && res.data.code == 200) {
            this.$toast({
                message: '取消成功',
                type: 'success'
            });
            this.fullRepairsList.splice(this.currentOrderIndex,1)
          } else {
            this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
            }).then(() => {})
          }
        })
        .catch((err) => {
            this.loadingShow = false;
            this.infoText = '';
            this.$dialog.alert({
                message: `${err}`,
                closeOnPopstate: true
            }).then(() => {})
        })
    },

    // 扫码图标点击事件
    scanCodeEvent () {
        // this.scanQRCode();
        this.$router.push({path: '/equipmentPatrolSacnRepairsOrder'})
    },

    // 扫描二维码方法
    scanQRCode () {
      try {
        window.android.scanQRcode()
      } catch (err) {
        this.$dialog.alert({
          message: err
        }).then(() => {
        })
      }
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code; 
        try {
            this.changeScanRepairsMessage({deviceId: codeData});
            this.$router.push({path: '/equipmentPatrolSacnRepairsOrder'})
        } catch (err) {
          this.$toast({
            message: `${err}`,
            type: 'fail'
          })
        }  
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.scanQRCode()
        })
      }
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
    },


     //任务状态转换
    stateTransfer (num) {
        switch(num) {
            case 10:
                return '待审核'
                break;
            case 20:
                    return '待确认'
                    break;
            case 21:
                    return '未通过'
                    break;
            case 30:
                    return '待送货'
                    break;
            case 31:
                    return '已拒绝'
                    break;
            case 40:
                    return '送货中'
                    break;
            case 41:
                    return '售后中'
                    break;
            case 50:
                    return '已完成'
                    break;
        } 
    },

    // 格式化时间
    getNowFormatDate(currentDate) {
      let currentdate;
      let strDate = currentDate.getDate();
      let seperator1 = "/";
      let seperator2 = ":";
      let seperator3 = " ";
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
      currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes
      return currentdate
    },

    // 报修列表订单取消事件
    cancelOrderEvent (item,index) {
        this.currentOrderId = item.id;
        this.currentOrderIndex = index;
        this.currentCancelReason = '请选择';
        this.currentCancelReasonIndex = '';
        this.currentCancelReasonalue = '';
        this.remarkValue = '';
        this.cancelReasonShow = true;
    },

    // 取消原因列表点击事件
    cancelReasonListEvent(item,index) {
        this.currentCancelReason = item.name;
        this.currentCancelReasonalue = item.value;
        this.currentCancelReasonIndex = index;
        this.cancelReasonListShow = false;
    },

    // 取消弹框取消事件
    cancelReasonModalCancelEvent () {
        this.cancelReasonShow = false
    },
    
    // 取消弹框提交事件
    cancelReasonModalSubmitEvent (item) {
        if (this.currentCancelReason === '请选择') {
             this.$toast({
                type: 'fail',
                message: '请选择取消原因!'
            });
            return
        };
        this.currentOrderId = item.id;
        this.cancelReasonShow = false;
        this.eventRegisterCancelEvent({
            id: this.currentOrderId,
            reason: this.currentCancelReason,
            remark: this.remarkValue
        })
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  position: relative;
  .content-wrapper();
   .deliver-goods-modal {
        /deep/ .van-dialog {
            border-top-left-radius: 4px !important;
            border-top-right-radius: 4px !important;
            border-bottom-left-radius: 4px !important;
            border-bottom-right-radius: 4px !important;
            .van-dialog__content {
                .evaluate-model-content {
                    width: 100%;
                    .evaluate-modal-top {
                        height: 37px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 10px;
                        box-sizing: border-box;
                        background: #F6F9FB;
                        >span {
                            font-size: 14px;
                            color: #101010;
                        }
                    };
                    .evaluate-modal-center {
                        padding: 20px 30px 10px 30px;
                        box-sizing: border-box;
                        .delivery-person {
                            .evaluate-span {
                                >span {
                                    &:nth-child(1) {
                                        color: red
                                    }
                                }
                            };
                            .evaluate-content {
                                height: 30px;
                                border: 1px solid #BBBBBB;
                                border-radius: 3px;
                                padding: 0 4px;
                                position: relative;
                                >div {
                                    width: 100%;
                                    &:nth-child(1) {
                                        height: 30px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: space-between;
                                         >span {
                                            margin-right: 4px;
                                            font-size: 14px;
                                            color: #BBBBBB;
                                        }
                                    }
                                };
                                .delivery-person-list-box {
                                    width: 100%;
                                    background: #fff;
                                    position: absolute;
                                    left: 0;
                                    top: 34px;
                                    max-height: 160px;
                                    overflow: auto;
                                    z-index: 100;
                                    .delivery-person-list {
                                        height: 20px;
                                        width: 100%;
                                        display: flex;
                                        align-items: center;
                                        >span {
                                            display: inline-block;
                                            width: 100%;
                                            font-size: 12px;
                                            color: #101010
                                        };
                                        .deliveryPersonspanStyle {
                                            color: #3B9DF9 !important;
                                        }
                                    }
                                }
                            }
                        };
                        .evaluate-box {
                            display: flex;
                            .evaluate-span {
                               width: 70px;
                               text-align: right;
                               margin-right: 4px;
                               display: flex;
                               justify-content: flex-end;
                               align-items: center;
                                >span {
                                   font-size: 14px;
                                   color: #101010;
                                }
                            };
                            .evaluate-content {
                                flex: 1;
                                border: 1px solid #888888;
                                .van-cell {
                                    padding: 6px !important;
                                }
                            }
                        };
                        .remark-box {
                            margin-top: 20px;
                            .evaluate-span {
                                align-items: flex-start !important;
                            }
                        }
                    };
                    .evaluate-modal-bottom {
                        padding: 15px 70px;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;
                        .evaluate-modal-btn {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            .cancel-left {
                                width: 74px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid #BBBBBB;
                                box-sizing: border-box;
                                border-radius: 5px;
                                >span {
                                    font-size: 12px;
                                    color: #BBBBBB;
                                }
                            };
                            .submit-right {
                                width: 74px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: #3B9DF9;
                                border-radius: 5px;
                                >span {
                                    font-size: 12px;
                                    color: #fff
                                }
                            }
                        }
                    }
                }
            }
        }
    };
  /deep/ .van-overlay {
    z-index: 1000 !important
  };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        };
        .van-nav-bar__right {
          .van-nav-bar__text {
            color: #fff
          }
        };
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 1000000
  };
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      > img {
        width: 100%;
        height: 100%
      }
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        background: #F7F7F7;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0px 6px 10px 6px;
         .order-list-box {
            flex: 1;
            overflow-y: auto;
            min-height: 0;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 10px;
            padding-left: 1px;
            padding-right: 1px;
            box-sizing: border-box;
            position: relative;
            .order-list {
                padding: 0 6px 16px 6px;
                box-sizing: border-box;
                background-color: rgba(255,255,255,1);
                box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.23);
                border-radius: 7px;
                margin-bottom: 10px;
                &:nth-child(1) {
                    margin-top: 10px;
                };
                .order-list-top {
                    display: flex;
                    height: 50px;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 6px;
                    box-sizing: border-box;
                    border-bottom: 1px solid rgba(0,0,0,0.23);
                    .order-type {
                        flex: 1;
                        margin-right: 10px;
                        .no-wrap();
                        >span {
                            font-size: 16px;
                            color: #3B9DF9;
                        }
                    };
                    .order-status {
                        display: flex;
                        height: 40px;
                        align-items: center;
                        justify-content: center;
                        width: 67px;
                        height: 25px;
                        border-radius: 4px;
                        color: #101010;
                        >span {
                            font-size: 14px;
                        }
                    };
                    .spanNoStartStyle {
                        color: #174E97;
                    };
                    .spanCompletedStyle {
                        color: #101010;
                    }
                };
                .order-list-center {
                    margin: 10px 0;
                    padding: 0 6px;
                    box-sizing: border-box;
                    .product-list {
                        display: flex;
                        >span {
                            display: inline-block;
                            font-size: 12px;
                            &:nth-child(1) {
                                color: #9E9E9A;
                                margin-right: 6px;
                            };
                            &:nth-child(2) {
                                .no-wrap();
                                flex: 1;
                                color: #101010;
                            }
                        }
                    };
                    .create-delivery-date {
                        display: flex;
                        margin-top: 10px;
                        .create-delivery-date-left {
                            flex: 1;
                            width: 0;
                            display: flex;
                            margin-right: 4px;
                            >span {
                                display: inline-block;
                                font-size: 12px;
                                &:nth-child(1) {
                                    color: #9E9E9A;
                                    margin-right: 6px;
                                };
                                &:nth-child(2) {
                                    word-break: break-all;
                                    flex: 1;
                                    color: #101010;
                                }
                            }
                        };
                        .create-delivery-date-right {
                            flex: 1;
                            width: 0;
                            display: flex;
                            align-items: center;
                            >span {
                                display: inline-block;
                                font-size: 12px;
                                &:nth-child(1) {
                                    color: #9E9E9A;
                                    margin-right: 6px;
                                };
                                &:nth-child(2) {
                                    .no-wrap();
                                    flex: 1;
                                    color: #101010;
                                }
                            }
                        }
                    };
                    .delivery-address {
                        margin-top: 10px;
                    };
                    .remark-box {
                        display: flex;
                        margin-top: 10px;
                        >span {
                            display: inline-block;
                            font-size: 12px;
                            &:nth-child(1) {
                                color: #9E9E9A;
                                margin-right: 6px;
                            };
                            &:nth-child(2) {
                                flex: 1;
                                word-break: break-all;
                                color: #9E9E9A;
                            }
                        }
                    }
                };
                .order-list-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .order-list-btn {
                        display: flex;
                        align-items: center;
                        .delete-left {
                            width: 66px;
                            height: 25px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: #E86F50;
                            border-radius: 4px;
                            >span {
                                font-size: 12px;
                                color: #fff
                            }
                        }
                    }
                }
            };
            .bottom-loading-show {
              font-size: 12px;
              color: #BEC7D1;
              width: 100%;
              text-align: center;
              line-height: 30px
            };
            .no-more-data {
              font-size: 12px;
              color: #BEC7D1;
              width: 100%;
              text-align: center;
              line-height: 30px
          };
            /deep/ .van-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 100%;
            }
        }
    }    
  }
}
</style>