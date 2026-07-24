<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
        <van-nav-bar title="异常检查项事件列表" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
            <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
          <div class="current-area">
            <van-icon name="location" color="#1684FC" size="22" />
            <span>当前检查设备: {{ `${currentPatrolTaskDeviceChecklist.deviceName} ${currentPatrolTaskDeviceChecklist.norms}` }}</span>
          </div>
          <div class="classification-box">
            {{ `#${patrolTaskAbnormalCheckItemEventList.typeName}`}}
          </div>
          <div class="patrol-item-box">
            <div class="patrol-item-list">
              <div class="patrol-item-list-left">
                  <span>检查项:</span>
                  <span>{{ patrolTaskAbnormalCheckItemEventList.itemName }}</span>
              </div>
              <div class="patrol-item-list-right">
                  <van-radio-group v-model="patrolTaskAbnormalCheckItemEventList.checkResult" direction="horizontal" disabled>
                      <van-radio name="1" v-show="patrolTaskAbnormalCheckItemEventList.checkResult == 1">
                          <template #icon="props">
                              <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                          </template>
                      </van-radio>
                      <van-radio name="3" v-show="patrolTaskAbnormalCheckItemEventList.checkResult == 3">
                          <template #icon="props">
                              <img class="img-icon" :src="props.checked ? checkCloseCirclePng : closeCirclePng" />
                          </template>
                      </van-radio>
                  </van-radio-group>
              </div>
            </div>
          </div>
          <div class="backlog-task-list-box" ref="scrollBacklogTask">
              <div class="order-list" v-for="(item,index) in eventList" :key="index">
                <div class="order-list-top">
                  <div class="order-type">
                    <span></span>
                    <span></span>
                  </div>
                  <div class="order-status"
                  :class="{
                    'staySureStyle ' : item.status == 20, 
                    'stayDeliveryStyle' : item.status == 30,
                    'hasDeliveryStyle' : item.status == 40
                    }"
                  >
                    <span>待分配</span>
                  </div>
                </div>
                <div class="order-list-center">
                  <div class="create-delivery-date">
                    <div class="create-delivery-date-left">
                      <span>任务类型:</span>
                      <span>{{ item.taskType }}</span>
                    </div>
                    <div class="create-delivery-date-left">
                      <span>设备名称:</span>
                      <span>{{ item['extendData']['deviceName'] }}</span>
                    </div>
                  </div>
                  <div class="create-delivery-date delivery-address">
                    <div class="create-delivery-date-left">
                      <span>所属科室:</span>
                      <span>{{ item.depName }}</span>
                    </div>
                    <div class="create-delivery-date-left">
                      <span>所属空间:</span>
                      <span>{{ item.spaceName }}</span>
                    </div>
                  </div>
                  <div class="create-delivery-date">
                    <div class="create-delivery-date-left">
                      <span>严重程度:</span>
                      <span>{{ item.registerSeverityName }}</span>
                    </div>
                    <div class="create-delivery-date-left">
                      <span>设备状态:</span>
                      <span>{{ item.registerStateName }}</span>
                    </div>
                  </div>
                  <div class="remark-box">
                    <span>问题描述:</span>
                    <span>{{ item.description }}</span>
                  </div>
                </div>
                <div class="order-list-bottom">
                  <div class="order-list-btn">
                    <div class="delete-left" @click.stop="deleteEventListEvent(item)">
                      <span>删除</span>
                    </div>
                  </div>
                </div>
              </div>
              <van-empty description="暂无异常记录数据" v-show="eventList == 0" />
              <div class="no-more-data" v-show="isShowBacklogTaskNoMoreData">没有更多数据了</div>
          </div> 
        </div>
    </div>
    <div class="task-operation-box">
      <div class="new-increase-btn" @click="newAddRecordEvent">新增</div>
      <div class="back-btn" @click="backEvent">返回</div>
    </div>
    <!-- 删除异常事件列表弹框	 -->
    <div class="revocation-delivery-order-modal">
        <van-dialog v-model="deleteOrderModalShow" :showConfirmButton="false">
            <div class="evaluate-model-content">
                <div class="evaluate-modal-top">
                    <span>确定删除</span>
                    <van-icon name="cross" color="#101010" size="20" @click="deleteOrderModalShow = false" />
                </div>
                <div class="evaluate-modal-center">
                  <img :src="revocationInfoImage"  />
                  <div class="modal-center-content">请再次确认是否要删除？</div>
                </div>
                <div class="evaluate-modal-bottom">
                    <div class="evaluate-modal-btn">
                        <div class="cancel-left" @click.stop="deleteOrderModalShowCancelEvent">
                            <span>取消</span>
                        </div>
                        <div class="submit-right" @click.stop="deleteOrderModalShowSureEvent">
                            <span>确认</span>
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
import { mixinsDeviceReturn } from '@/mixins/deviceReturnFunction';
import _ from 'lodash';
import { getEventList, deleteDeviceAbnormalRecord } from '@/api/equipmentPatrol/escortManagement.js'
export default {
  name: "PatrolAbnormalCheckItemEventList",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      backlogEmptyShow: false,
      isShowBacklogTaskNoMoreData: false,
      questionListTimer: 0,
      timeOne: null,
      totalCount: '',
      currentPage: 1,
      pageSize: 10,
      checkResultValue: '1',
      eventList: [],
      eventTypeList: ['工程报修','拾金不昧','其他'],
      loadingShow: false,
      backlogTaskList: [],
      currentPatrolTaskDeviceChecklist: {},
      fullBacklogTaskList: [],
      temporaryStorageCurrentCheckItemEventList: [],
      loadText: '加载中',
      existOnlineImgPath: [],
      deleteOrderModalShow: false,
      storeId: '',
      revocationInfoImage: require('@/common/images/home/revocation-info-icon.png'),
      checkCheckboxPng: require("@/common/images/home/check-checkbox-circle.png"),
      checkboxPng: require("@/common/images/home/checkbox-circle.png"),
      closeCirclePng: require("@/common/images/home/close-circle.png"),
      deletePng: require("@/common/images/home/delete.png"),
      checkCloseCirclePng: require("@/common/images/home/check-close-circle.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/equipmentChecklist');
    this.$nextTick(()=> {
        try {
            this.initScrollChange()
        } catch (error) {
            this.$toast({
                type: 'fail',
                message: error
            })
        }
    });
    this.getData()
  },

   beforeDestroy () {
    if (this.timeOne) {
      clearTimeout(this.timeOne)
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","ossMessage","timeMessage","patrolTaskAbnormalRecordList","enterPatrolAbnormalRecordPageSource","patrolTaskAbnormalCheckItemEventList","patrolTaskDeviceChecklist","patrolTaskListMessage","devicePatrolDetailsSelectMessage"]),
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
    ...mapMutations(['changeEnterPatrolAbnormalRecordPageSource','changePatrolTaskAbnormalRecordList']),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/equipmentChecklist'})
    },

    // 获取该检查项下面的异常记录列表
    getData () {
      this.currentPatrolTaskDeviceChecklist =  _.cloneDeep(this.patrolTaskDeviceChecklist);
      let casuallyTemporaryStoragePatrolTaskAbnormalRecordList = _.cloneDeep(this.patrolTaskAbnormalRecordList);
      let temporaryEventList = casuallyTemporaryStoragePatrolTaskAbnormalRecordList.filter((item) => { return item.showDate == this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
      item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == this.patrolTaskAbnormalCheckItemEventList.typeId && 
      item.extendData.checkItemId == this.patrolTaskAbnormalCheckItemEventList.itemId && item.checkResultId == this.patrolTaskAbnormalCheckItemEventList.resultId
      });
      if (temporaryEventList.length > 0) {
        this.eventList = temporaryEventList
      } else {
        this.eventList = []
      }
    },

    // 删除异常记录列表事件
    deleteEventListEvent (itemValue) {
      this.storeId = itemValue.storeId;
      this.deleteOrderModalShow = true;
      // let temporaryPatrolTaskAbnormalRecordList = this.patrolTaskAbnormalRecordList;
      // temporaryPatrolTaskAbnormalRecordList = temporaryPatrolTaskAbnormalRecordList.filter((item) => {
      //   return item.storeId != itemValue.storeId
      //   // return item.storeId != itemValue.storeId &&
      //   // item.showDate ==  this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
      //   // item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == this.patrolTaskAbnormalCheckItemEventList.typeId && 
      //   // item.extendData.checkItemId == this.patrolTaskAbnormalCheckItemEventList.itemId && item.checkResultId == this.patrolTaskAbnormalCheckItemEventList.resultId
      // });
      // this.changePatrolTaskAbnormalRecordList(temporaryPatrolTaskAbnormalRecordList);
      // this.getData()
      // this.loadingShow = true;
      // this.overlayShow = true;
      // this.loadText = '删除中';
      // deleteDeviceAbnormalRecord()
      // .then((res) => {
      //   this.loadingShow = false;
      //   this.overlayShow = false;
      //   this.loadText = '';
      //   if (res && res.data.code == 200) {
      //   } else {
      //     this.$toast({
      //       type: 'fail',
      //       message: res.data.msg
      //     })
      //   }
      // })
      // .catch((err) => {
      //   this.loadingShow = false;
      //   this.overlayShow = false;
      //   this.loadText = '';
      //   this.$toast({
      //     type: 'fail',
      //     message: err
      //   })
      // })
    },

    // 底部返回事件
    backEvent () {
      this.$router.push({path: '/equipmentChecklist'})
    },

    // 进入记录详情事件
    enterRecordDetailsEvent (item) {
      this.changeEnterPatrolAbnormalRecordPageSource('/patrolAbnormalCheckItemEventList');
      this.$router.push({
        path:'/patrolAbnormalRecord',
        query: {
          eventId : item.storeId
        }
      })
    },

    // // 获取事件列表
    // queryEventList (page,pageSize,name,registerType) {
    //   this.loadingShow = true;
    //   this.overlayShow = true;
    //   this.loadText = '加载中';
    //   this.backlogEmptyShow = false;
    //   this.isShowBacklogTaskNoMoreData = false;
    //   getEventList({proId:this.proId, system: 6, page,
    //     name,limit:pageSize,registerType,checkResultId:this.enterProblemRecordMessage['issueInfo']['resultId']
    //   })
    //   .then((res) => {
    //     this.loadingShow = false;
    //     this.overlayShow = false;
    //     this.loadText = '';
    //     if (res && res.data.code == 200) {
    //       this.backlogTaskList = res.data.data.list;
    //       this.totalCount = res.data.data.total;
    //       // 加载第一页时,合并该巡查项下暂存的事件列表
    //       if (page == 1) {
    //         this.fullBacklogTaskList = [].concat();
    //         this.fullBacklogTaskList = this.fullBacklogTaskList.filter((item) => { return item['checkItemId'] == this.enterProblemRecordMessage['issueInfo']['id'] && item['registerType'] == 1 
    //         && item['depId'] == this.departmentCheckList['depId'] && item['taskId'] == this.patrolTaskListMessage['id']
    //         });
    //         this.fullBacklogTaskList = this.fullBacklogTaskList.concat(this.backlogTaskList)
    //       } else {
    //         this.fullBacklogTaskList = this.fullBacklogTaskList.concat(this.backlogTaskList)
    //       };
    //       if (this.fullBacklogTaskList.length == 0) {
    //         this.backlogEmptyShow = true
    //       }
    //     } else {
    //       this.$toast({
    //         type: 'fail',
    //         message: res.data.msg
    //       })
    //     }
    //   })
    //   .catch((err) => {
    //     this.loadingShow = false;
    //     this.overlayShow = false;
    //     this.loadText = '';
    //     this.$toast({
    //       type: 'fail',
    //       message: err
    //     })
    //   })
    // },

    // 异常检查项列表绑定滚动事件
    initScrollChange () {
        let boxBackScroll = this.$refs['scrollBacklogTask'];
        boxBackScroll.addEventListener('scroll',this.questionListLoad,true)
    },

    // 异常检查查项列表加载方法
    // questionListLoad () {
    //   let boxBackScroll = this.$refs['scrollBacklogTask'];
    //   if (Math.ceil(boxBackScroll.scrollTop) + boxBackScroll.offsetHeight >= boxBackScroll.scrollHeight) {
    //     if (this.questionListTimer) {return};
    //     this.questionListTimer = 1;
    //     this.timeOne = setTimeout(()=> {
    //       this.questionListTimer = 0;
    //        let totalPage = Math.ceil(this.totalCount/this.pageSize);
    //       if (this.currentPage >= totalPage) {
    //         this.isShowBacklogTaskNoMoreData = true
    //       } else {
    //         this.isShowBacklogTaskNoMoreData = false;
    //         this.currentPage = this.currentPage + 1;
    //         this.queryEventList(this.currentPage,this.pageSize,this.userName,1)
    //       };
    //       this.questionListTimer = 0
    //     },300)
    //   }  
    // },

    // 进入异常记录详情事件
    taskDetailsEvent () {
      this.$router.push({path:'/editPatrolAbnormalRecord'})
    },

    // 新增记录事件
    newAddRecordEvent () {
      this.changeEnterPatrolAbnormalRecordPageSource('/patrolAbnormalCheckItemEventList');
      this.$router.push({path: '/patrolAbnormalRecord'})
    },

    // 确定删除弹框取消事件
    deleteOrderModalShowCancelEvent () {
      this.deleteOrderModalShow = false;
    },

    // 确定删除弹框确认事件
    deleteOrderModalShowSureEvent () {
      this.deleteOrderModalShow = false;
      let temporaryPatrolTaskAbnormalRecordList = this.patrolTaskAbnormalRecordList;
      temporaryPatrolTaskAbnormalRecordList = temporaryPatrolTaskAbnormalRecordList.filter((item) => {
        return item.storeId != this.storeId
        // return item.storeId != itemValue.storeId &&
        // item.showDate ==  this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
        // item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == this.patrolTaskAbnormalCheckItemEventList.typeId && 
        // item.extendData.checkItemId == this.patrolTaskAbnormalCheckItemEventList.itemId && item.checkResultId == this.patrolTaskAbnormalCheckItemEventList.resultId
      });
      this.changePatrolTaskAbnormalRecordList(temporaryPatrolTaskAbnormalRecordList);
      this.getData()
      // this.loadingShow = true;
      // this.overlayShow = true;
      // this.loadText = '删除中';
      // deleteDeviceAbnormalRecord()
      // .then((res) => {
      //   this.loadingShow = false;
      //   this.overlayShow = false;
      //   this.loadText = '';
      //   if (res && res.data.code == 200) {
      //   } else {
      //     this.$toast({
      //       type: 'fail',
      //       message: res.data.msg
      //     })
      //   }
      // })
      // .catch((err) => {
      //   this.loadingShow = false;
      //   this.overlayShow = false;
      //   this.loadText = '';
      //   this.$toast({
      //     type: 'fail',
      //     message: err
      //   })
      // })
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
  .revocation-delivery-order-modal {
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
                      padding: 20px 40px;
                      box-sizing: border-box;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                      >img {
                        width: 70px;
                        height: 70px;
                      };
                     .modal-center-content {
                       margin-top: 20px;
                       font-size: 14px;
                       color: #101010;
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
  .event-type-box {
    /deep/ .van-dialog {
      top: auto !important;
      left: 0 !important;
      border-right: 1px solid #fff;
      bottom: 0 !important;
      border-top-left-radius: 20px !important;
      border-top-right-radius: 20px !important;
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      transform: translate3d(0,0,0) !important;
      .van-dialog__content {
        padding: 0 20px 10px 20px !important;
        box-sizing: border-box;
        height: 50vh;
        .dialog-top {
          height: 60px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .select-title {
            font-size: 18px;
            color: #101010;
            text-align: center
          };
          .van-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0
          }
        };
        .inspection-item {
          text-align: center;
          padding: 10px 0;
          box-sizing: border-box;
          >span {
            font-size: 14px;
            color: #3B9DF9
          }
        };
        .dialog-center {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding-top: 30px;
          box-sizing: border-box;
          >p {
            width: 121px;
            height: 43px;
            border: 1px solid #3B9DF9;
            border-radius: 10px;
            font-size: 14px;
            color: #3B9DF9;
            text-align: center;
            line-height: 43px;
            margin-bottom: 30px
          }
        }
      };
      .van-dialog__footer {
        display: none
      };
      .van-hairline--top::after {
        border-top-width: 0 !important
      }
    }
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
        }
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 10000 !important
  };
  /deep/.van-overlay {
    z-index: 1000 !important
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
        margin-top: 50px;
        box-sizing: border-box;
        background: #F7F7F7;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding-bottom: 50px;
        .current-area {
            height: 50px;
            line-height: 50px;
            width: 96%;
            margin: 0 auto;
            font-size: 14px;
            color: #3B9DF9;
            /deep/ .van-icon {
                vertical-align: middle
            };
            >span {
                vertical-align: middle
            }
        };
        .classification-box {
          .bottom-border-1px(#BEC7D1);
          height: 24px;
          line-height: 24px;
          font-size: 12px;
          padding-left: 10px;
          box-sizing: border-box;
          background: #fff;
          color: #848484
        };
         .patrol-item-box {
            width: 100%;
            position: relative;
            .patrol-item-list {
                padding: 10px;
                box-sizing: border-box;
                background: #fff;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .patrol-item-list-left {
                    font-size: 14px;
                    color: #101010;
                    padding-right: 6px;
                    flex: 1;
                    word-break: break-all;
                    box-sizing: border-box;
                    >span {
                        &:first-child {
                            color: #8E9397;
                            margin-right: 6px;
                        };
                        &:last-child {
                            color: #494D51
                        }
                    }
                };
                .patrol-item-list-right {
                    /deep/ .van-radio-group {
                        .van-radio {
                            .van-radio__icon {
                                height: auto !important
                            };
                            img {
                                width: 30px
                            }
                        };
                        >div {
                            margin-right: 20px;
                            &:last-child {
                                margin-right: 0
                            }
                        }
                    }
                }
            }
        };
        .backlog-task-list-box {
          overflow: scroll;
          flex: 1;
          height: 100%;
          padding: 10px 10px 0 10px;
          box-sizing: border-box;
          position: relative;
          /deep/ .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
          };
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
                        >span {
                            font-size: 14px;
                        }
                    };
                    .staySureStyle {
                        background: rgba(232,203,81,0.16) !important;
                        color: #E8CB51 !important;
                    };
                    .stayDeliveryStyle {
                        background: #E7F3FE !important;
                        color: #3B9DF9 !important;
                    };
                    .hasDeliveryStyle {
                        background: #E6E9FA !important;
                        color: #8D97E7 !important;
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
          .no-more-data {
              font-size: 12px;
              color: #BEC7D1;
              width: 100%;
              text-align: center;
              line-height: 30px
          }
      }
    }    
  };
  .task-operation-box {
    background: #F8F8F8;
    height: 80px;
    display: flex;
    width: 100%;
    z-index: 100;
    margin: 0 auto;
    align-items: center;
    justify-content: center;
    >div {
        width: 40%;
        height: 48px;
        font-size: 18px;
        line-height: 48px;
        background: #fff;
        text-align: center;
        border-radius: 30px;
        &:first-child {
            color: #fff;
            margin-right: 20px;
            background: linear-gradient(to right, #6cd2f8, #2390fe);
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
        };
        &:last-child {
            color: #1684FC;
            border: 1px solid #1684FC
        }
    }
  }
}
</style>