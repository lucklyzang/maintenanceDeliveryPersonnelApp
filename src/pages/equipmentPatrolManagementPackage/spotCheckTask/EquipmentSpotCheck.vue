<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
        <van-nav-bar title="设备点检" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight" right-text="历史任务" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
            <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
          <div class="backlog-task-list-box" ref="scrollBacklogTask">
              <div class="backlog-task-list">
                    <div class="backlog-task-top">
                        <div class="backlog-task-top-left">
                            <span>任务编号:</span>
                            <span>q2121</span>
                        </div>
                        <div class="backlog-task-top-right">
                            <span>未查阅</span>
                        </div>
                        <!-- <div class="backlog-task-top-right-other">
                            <img :src="uploadingPng" alt="">
                            <span>上传中</span>
                        </div> -->
                    </div>
                    <div class="backlog-task-content-box">
                        <div class="backlog-task-content-box-left">
                            <div class="backlog-task-content">
                                <div class="taskset-create-time-type">
                                    <span>点检设备:</span>
                                    <span>sdasas</span>
                                </div>
                            </div>
                            <div class="backlog-task-content" >
                                <div class="taskset-create-time-type taskset-create-time-other-type">
                                    <span>检查时间:</span>
                                    <span>2023年6月12日 11:00</span>
                                </div>
                            </div>
                        </div>
                        <div class="right-arrow-box" @click="taskDetailsEvent()">
                            <van-icon name="arrow" color="#1684FC" size="24" />
                        </div>
                    </div>
                    <div class="bottom-btn">
                        <span>获取</span>
                        <span>退回</span>
                    </div>
              </div>
              <van-empty description="暂无数据" v-show="backlogEmptyShow" />
              <div class="no-more-data" v-show="isShowBacklogTaskNoMoreData">没有更多数据了</div>
          </div> 
        </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { mixinsDeviceReturn } from '@/mixins/deviceReturnFunction';
export default {
  name: "EquipmentSpotCheck",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      backlogEmptyShow: false,
      isShowBacklogTaskNoMoreData: false,
      totalCount: '',
      currentPage: 1,
      pageSize: 10,
      loadingShow: false,
      backlogTaskList: [],
      loadText: '加载中',
      uploadingSuccessPng: require("@/common/images/home/uploading-success.png"),
      uploadingGif: require("@/common/images/home/uploading.gif"),
      uploadingFailPng: require("@/common/images/home/uploading-fail.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/equipmentChecklist');
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
    });
  },

   beforeDestroy () {
    if (this.timeOne) {
      clearTimeout(this.timeOne)
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","patrolTaskListMessage"]),
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
      this.$router.push({path: '/home'})
    },

    // 顶部导航右边点击事件
    onClickRight () {
        this.$router.push({path: '/historyEquipmSpotTaskList'})
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

    // 列表绑定滚动事件
    initScrollChange () {
        let boxBackScroll = this.$refs['scrollBacklogTask'];
        boxBackScroll.addEventListener('scroll',this.questionListLoad,true)
    },

    // 列表加载方法
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

    // 进入任务详情事件
    taskDetailsEvent () {
      this.$router.push({path: '/equipmentSpotCheckTaskDetails'})
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
                  color: rgba(16, 16, 16, 0.53);
                  .bottom-border-1px(rgba(0, 0, 0, 0.23));
                  .backlog-task-top-left {
                      padding-right: 4px;
                      box-sizing: border-box;
                      flex: 1;
                      .no-wrap()
                  };
                  .backlog-task-top-right {
                    >span {
                        display: inline-block;
                        border-radius: 4px;
                        padding: 4px 6px;
                        color: #fff;
                        background: #E8CB51
                    };
                    .taskStatusStyle {
                        background: #174E97
                    }
                  };
                  .backlog-task-top-right-other {
                      >img {
                        width: 24px;
                        vertical-align: middle
                      };
                      > span {
                        font-size: 12px;
                        color: #101010;
                        vertical-align: middle
                      }
                  }
              };
              .backlog-task-content-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .backlog-task-content-box-left {
                    flex: 1;
                    .backlog-task-content {
                        >div {
                            line-height: 28px;
                            word-break: break-all;
                            font-size: 14px;
                            color: #101010;
                            padding-right: 4px;
                            box-sizing: border-box;  
                        };
                        .taskset-create-time-type {
                            color: #0A7AF5
                        };
                        .taskset-create-time-other-type {
                            flex-direction: row;
                            >span {
                                color: #101010;
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
                    }
                };
                .right-arrow-box {
                   
                }
              };
            .bottom-btn {
                height: 44px;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                >span {
                    display: inline-block;
                    padding: 7px 24px;
                    box-sizing: border-box;
                    color: #fff;
                    font-size: 14px;
                    border-radius: 8px;
                    &:first-child {
                        background: #298CF8;
                        margin-right: 6px;
                    };
                    &:last-child {
                        background: #D5D5D5
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
  }
}
</style>