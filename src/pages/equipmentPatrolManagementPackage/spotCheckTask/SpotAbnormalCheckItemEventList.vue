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
            <span>当前检查设备: 风机箱抽机组</span>
          </div>
          <div class="patrol-item-box">
            <div class="patrol-item-list">
              <div class="patrol-item-list-left">
                  <span>检查项:</span>
                  <span>2#</span>
              </div>
              <div class="patrol-item-list-right">
                  <van-radio-group v-model="checkResultValue" direction="horizontal" disabled>
                      <van-radio name="1">
                          <template #icon="props">
                              <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                          </template>
                      </van-radio>
                      <van-radio name="3">
                          <template #icon="props">
                              <img class="img-icon" :src="props.checked ? checkCloseCirclePng : closeCirclePng" />
                          </template>
                      </van-radio>
                  </van-radio-group>
              </div>
            </div>
          </div>
          <div class="backlog-task-list-box" ref="scrollBacklogTask">
              <div class="backlog-task-list">
                  <div class="backlog-task-top">
                      <div class="backlog-task-top-left">
                          <span>编号:</span>
                          <span>q2121</span>
                      </div>
                  </div>
                  <div class="backlog-task-content" >
                      <div class="taskset-create-time-type taskset-create-time-other-type">
                          <span>记录时间:</span>
                          <span>2023年6月12日 11:00</span>
                      </div>
                  </div>
                  <div class="backlog-task-content">
                      <div class="taskset-create-time-type">
                          <span>情况说明:</span>
                          <span>sdasas</span>
                      </div>
                  </div>
                  <div class="right-arrow-box" @click="taskDetailsEvent()">
                    <van-icon name="arrow" color="#1684FC" size="24" />
                  </div>
              </div>
              <van-empty description="暂无数据" v-show="backlogEmptyShow" />
              <div class="no-more-data" v-show="isShowBacklogTaskNoMoreData">没有更多数据了</div>
          </div> 
        </div>
    </div>
    <div class="task-operation-box">
      <div class="new-increase-btn" @click="newAddRecordEvent">新增</div>
      <div class="back-btn" @click="backEvent">返回</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { mixinsDeviceReturn } from '@/mixins/deviceReturnFunction';
import { getEventList } from '@/api/equipmentPatrol/escortManagement.js'
export default {
  name: "SpotAbnormalCheckItemEventList",
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
      eventTypeList: ['工程报修','拾金不昧','其他'],
      loadingShow: false,
      backlogTaskList: [],
      fullBacklogTaskList: [],
      temporaryStorageCurrentCheckItemEventList: [],
      loadText: '加载中',
      existOnlineImgPath: [],
      checkCheckboxPng: require("@/common/images/home/check-checkbox-circle.png"),
      checkboxPng: require("@/common/images/home/checkbox-circle.png"),
      closeCirclePng: require("@/common/images/home/close-circle.png"),
      checkCloseCirclePng: require("@/common/images/home/check-close-circle.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/equipmentSpotCheckTaskDetails');
    // this.queryEventList(this.currentPage,this.pageSize,this.userName,1);
    this.$nextTick(()=> {
        try {
            this.initScrollChange()
        } catch (error) {
            this.$toast({
                type: 'fail',
                message: error
            })
        }
    })
  },

   beforeDestroy () {
    if (this.timeOne) {
      clearTimeout(this.timeOne)
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","patrolTaskListMessage","chooseHospitalArea"]),
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
    ...mapMutations([]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/equipmentSpotCheckTaskDetails'})
    },

    // 新增事件
    newAddRecordEvent () {
      this.$router.push({path: '/spotAbnormalRecord'})
    },

    // 底部返回事件
    backEvent () {
      this.$router.push({path: '/equipmentSpotCheckTaskDetails'})
    },

    // 获取事件列表
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

    // 进入事件详情事件
    taskDetailsEvent () {
      
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  height: 0;
  .content-wrapper();
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
         .patrol-item-box {
            width: 100%;
            height: 60px;
            position: relative;
            .patrol-item-list {
                padding: 16px 10px;
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
          .backlog-task-list {
              padding: 0 8px 4px 8px;
              box-sizing: border-box;
              border-radius: 6px;
              position: relative;
              background: #fff;
              box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
              margin-bottom: 10px;
              .backlog-task-top {
                  height: 35px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 14px;
                  color: #1684FC;
                  .backlog-task-top-left {
                      flex: 1;
                      .no-wrap()
                  }
              };
              .backlog-task-content {
                  >div {
                  line-height: 28px;
                  word-break: break-all;
                  font-size: 14px;
                  color: #8E9397  
                  };
                  .taskset-create-time-type {
                    display: flex;
                    flex-direction: column
                  };
                  .taskset-create-time-other-type {
                    flex-direction: row;
                    >span {
                      &:first-child {
                        margin-right: 6px
                      }
                    }
                  };
                  .complete-patrol-area {
                      >span {
                          &:nth-child(2) {
                              color: #1684FC
                          }
                      }
                  };
                  .unfinished-patrol-area {
                      >span {
                          &:nth-child(2) {
                              color: #1684FC
                          }
                      }
                  }
              };
              .right-arrow-box {
                position: absolute;
                display: flex;
                justify-content: center;
                align-items: center;
                right: 8px;
                top: 55%;
                transform: translateY(-50%)
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