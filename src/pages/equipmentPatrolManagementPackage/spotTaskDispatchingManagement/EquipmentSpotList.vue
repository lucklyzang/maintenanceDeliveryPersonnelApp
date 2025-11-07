<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadingText }}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 取消原因弹框 -->
    <div class="allocation-box">
      <van-dialog v-model="cancelReasonShow" width="80%" show-cancel-button 
        confirm-button-color="#2390fe"
        :before-close="beforeCloseCancelReasonDialogEvent"
        @confirm="cancelReasonDialogSure"
        @cancel="cancelReasonDialogCancel"
        confirm-button-text="确定"
        cancel-button-text="取消"
      >
        <div class="dialog-top">
          请选择取消原因
        </div>
        <div class="dialog-center">
          <SelectSearch :itemData="cancelReasonOption" ref="cancelOption" :isNeedSearch="false" :curData="cancelReasonValue" @change="cancelReasonOptionChange" />
        </div>
      </van-dialog>
    </div>
    <div class="nav">
       <van-nav-bar
        title="设备点检"
        left-text="返回"
        right-text="历史任务"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <div class="task-message-top">
            <div class="message-left">
                <span>当前任务数:</span>
                <span>4</span>
            </div>
            <div class="message-right">
                <span @click="createTask()">创建任务</span>
            </div>
            </div>
            <van-empty description="暂无数据" v-show="dispatchEmptyShow" />
            <div class="backlog-task-list-box" ref="scrollBacklogTask" v-show="!dispatchEmptyShow">
                <div class="backlog-task-list" @click="enterTaskEvent()">
                <div class="list-top">
                    <div class="list-top-left">
                    <img :src="anxiousSignPng" alt="急" v-show="true">
                    <span>2023-2-4 13:01</span>
                    <span>飒飒飒飒是</span>
                    </div>
                    <div class="list-top-right" :class="{'noLookupStyle':true}">
                        已完成
                    </div>
                </div>
                <div class="list-center">
                    <div class="list-center-left">
                        <div>
                            <span>打的的</span>
                            <span>杀僵尸</span>
                        </div>
                    </div>
                    <div class="list-center-right">
                    <van-icon name="arrow" color="#101010" size="22" />
                    </div>
                </div>
                <div class="list-bottom">
                    <div class="list-bottom-left">
                        <span class="delay-btn">李四</span>
                    </div>
                    <div class="list-bottom-right">
                        <span class="operate-four" @click.stop="cancelReasonEvent()">取消</span>
                    </div>
                </div>
                </div>
                <div class="no-more-data" v-show="isShowDispatchTaskNoMoreData">没有更多数据了</div>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import { IsPC } from '@/common/js/utils'
import SelectSearch from "@/components/SelectSearch";
export default {
  name: "EquipmentSpotList",
  components: {
    SelectSearch
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      loadingText: '加载中...',
      questionListTimer: null,
      totalCount: '',
      currentPage: 1,
      pageSize: 10,
      isLoadingRepairsTask: false,
      cancelReasonShow: false,
      overlayShow: false,
      dispatchEmptyShow: false,
      isShowDispatchTaskNoMoreData: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      anxiousSignPng: require("@/common/images/home/anxious-sign.png"),
      selectDelayReason: {},
      cancelReasonValue: null,
      cancelReasonOption: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.resetBtnClickStatus();
        that.$router.push({path: '/home'})
      })
    };
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
    if (this.loadFreshTimer) {clearTimeout(this.loadFreshTimer)}
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
    ...mapMutations(["changeOverDueWay"]),

    onClickLeft () {
      this.$router.push({ path: "/home"})
    },

    onClickRight () {
      this.$router.push({path: '/historyEquipmSpotTaskList'})
    },

    // 获取取消原因列表
    getCancelReason (type) {
       return new Promise((resolve,reject) => {
        queryDispatchTaskCancelReason({proId: this.proId, state: 0,type})
        .then((res) => {
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          }
        })
        .catch((err) => {
          reject(err.message)
        })
      })
    },

    // 取消点击事件
    cancelReasonEvent(item,index,text) {
      this.cancelReasonShow = true;
      this.taskId = item.id
    },

    // 取消原因弹框下拉框选值变化事件
    cancelReasonOptionChange (item) {
      this.selectCancelReason = item
    },

    // 取消原因弹框关闭前事件
    beforeCloseCancelReasonDialogEvent (action, done) {
      if (action == 'confirm') {
        if (this.selectCancelReason.value == null) {
          this.$toast('请选择取消原因');
          done(false)
        } else {
          done()
        }
      } else {
        done()
      }
    },

    // 取消原因弹框确定事件
    cancelReasonDialogSure () {
      if (this.selectCancelReason.value == null) { return };
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '取消中...';
    },

    // 取消原因弹框取消事件
    cancelReasonDialogCancel () {
      this.$refs['cancelOption'].clearSelectValue()
    },


    // 进入任务编辑页面事件
    enterTaskEvent () {
      this.$router.push({path: '/editSpotTask'})
    },

    // 创建任务
    createTask () {
      this.$router.push({path: '/createSpotTask'})
    },

    // 任务状态转换
    taskStatusTransition (state) {
      switch(state) {
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
          break
      }
    },

    // 设备点检列表绑定滚动事件
    initScrollChange () {
        let boxBackScroll = this.$refs['scrollBacklogTask'];
        boxBackScroll.addEventListener('scroll',this.questionListLoad,true)
    },

    // 设备点检列表加载方法
    questionListLoad () {
      let boxBackScroll = this.$refs['scrollBacklogTask'];
      if (Math.ceil(boxBackScroll.scrollTop) + boxBackScroll.offsetHeight >= boxBackScroll.scrollHeight) {
        if (this.questionListTimer) {return};
        this.questionListTimer = 1;
        this.timeOne = setTimeout(()=> {
          this.questionListTimer = 0;
           let totalPage = Math.ceil(this.totalCount/this.pageSize);
          if (this.currentPage >= totalPage) {
            this.isShowDispatchTaskNoMoreData = true
          } else {
            this.isShowDispatchTaskNoMoreData = false;
            this.currentPage = this.currentPage + 1;
            this.queryEventList(this.currentPage,this.pageSize,this.userName,1)
          };
          this.questionListTimer = 0
        },300)
      }  
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
  .allocation-box {
    /deep/ .van-dialog {
      border-radius: 10px !important;
      overflow: inherit !important;
      .van-dialog__content {
          padding: 0 !important;
          box-sizing: border-box;
          .dialog-top {
            border-top-left-radius: 10px !important;
            border-top-right-radius: 10px !important;
            height: 40px;
            padding-left: 10px;
            position: relative;
            display: flex;
            align-items: center;
            font-size: 14px;
            color: #fff;
            background: #3B9DF9;
            text-align: left
          };
          .dialog-center {
            width: 80%;
            height: 20vh;
            margin: 0 auto;
            margin-top: 20px
          }
      };
      .van-dialog__footer {
          padding: 20px !important;
          box-sizing: border-box;
          justify-content: center;
          ::after {
            content: none
          };
        .van-dialog__cancel {
            color: #3B9DF9;
            width: 40%;
            height: 40px;
            line-height: 40px;
            background: #fff;
            flex: none !important;
            border-radius: 10px;
            border: 1px solid #3B9DF9;
            margin-right: 30px
        };
        .van-dialog__confirm {
            color: #fff !important;
            height: 40px;
            line-height: 40px;
            flex: none !important;
            width: 40%;
            background: #3B9DF9;
            border-radius: 10px;
        }
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
    background: #f7f7f7;
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
        padding-bottom: 50px;
        .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
        };
        .task-message-top {
        width: 100%;
        padding: 0 8px;
        height: 42px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        box-sizing: border-box;
        .message-left {
            >span {
            font-size: 14px;
            &:nth-child(1) {
                color: #4B4B4B
            };
            &:nth-child(2) {
                color: #3B9DF9
            }
            }
        };
        .message-right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            >span {
            display: inline-block;
            width: 76px;
            height: 26px;
            border-radius: 6px;
            text-align: center;
            line-height: 26px;
            font-size: 14px;
            &:nth-child(1) {
                color: #fff;
                background: #3B9DF9;
                margin-right: 8px;
            };
            &:nth-child(2) {
                color: #3B9DF9;
                background: #fff;
                box-sizing: border-box;
                border: 1px solid #3B9DF9
            }
            }
        }
        };
        .backlog-task-list-box {
            overflow: scroll;
            flex: 1;
            height: 100%;
            .backlog-task-list {
                padding: 2px 8px 4px 8px;
                box-sizing: border-box;
                border-radius: 6px;
                background: #fff;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                margin-bottom: 10px;
                .list-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 40px;
                .list-top-left {
                    flex: 1;
                    width: 0;
                    font-size: 14px;
                    color: #101010;
                    display: flex;
                    align-items: center;
                    img {
                    width: 40px;
                    height: 40px;
                    margin-right: 2px;
                    margin-left: -6px;
                    };
                    >span {
                    display: inline-block;
                    &:nth-child(2) {
                        width: 120px
                    };
                    &:nth-child(3) {
                        flex: 1;
                        .no-wrap();
                        height: 20px;
                        padding-left: 8px;
                        padding-right: 4px;
                        line-height: 20px
                    }
                    }  
                };
                .list-top-right {
                    font-size: 16px;
                    color: #E86F50
                };
                .noLookupStyle {
                    color: #E8CB51 !important
                };
                .noStartStyle {
                    color: #174E97 !important
                };
                .underwayStyle {
                    color: #289E8E !important
                };
                .noEndStyle {
                    color: #F2A15F !important
                };
                };
                .list-center {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin: 8px 0;
                .list-center-left {
                    flex: 1;
                    font-size: 14px;
                    color: #101010;
                    display: flex;
                    align-items: center;
                    margin-right: 6px;
                    width: 0;
                    >div {
                    width: 0;
                    display: flex;
                    flex: 1;
                    align-items: center;
                    >span {
                        font-weight: bold;
                        display: inline-block;
                        &:nth-child(1) {
                        margin-right: 8px
                        };
                        &:nth-child(2) {
                        flex: 1;
                        .no-wrap();
                        height: 20px;
                        padding-left: 8px;
                        line-height: 20px;
                        border-left: 1px solid #BBBBBB
                        }
                    }
                    }    
                };
                .list-center-right {
                    
                }
                };
                .list-bottom {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 40px;
                .list-bottom-left {
                    flex: 1;
                    font-size: 14px;
                    color: #101010;
                    display: flex;
                    align-items: center;
                    >span {
                    font-weight: bold;
                    display: inline-block;
                    color: #fff;
                    border-radius: 16px;
                    font-size: 12px;
                    width: 54px;
                    height: 25px;
                    text-align: center;
                    line-height: 25px;
                    &:nth-child(1) {
                        margin-right: 4px;
                        background: #F2A15F
                    };
                    };
                    .delay-btn {
                    margin-right: 4px;
                    background: #174E97
                    };
                    .allocation-btn {
                    background: #ffb77d
                    };
                    .listBottomLeftStyle {
                    color: #F2A15F !important;
                    border: 1px solid #F2A15F;
                    background: #fff !important;
                    box-sizing: border-box
                    }  
                };
                .list-bottom-right {
                    >span {
                    font-weight: bold;
                    display: inline-block;
                    color: #fff;
                    border-radius: 10px;
                    font-size: 14px;
                    width: 48px;
                    height: 26px;
                    text-align: center;
                    line-height: 26px;
                    box-sizing: border-box;
                    border-radius: 2px;
                    margin-right: 4px
                    };
                    .operate-one {
                    color: #F2A15F;
                    border: 1px solid #F2A15F
                    };
                    .operate-two {
                    color: #174E97;
                    border: 1px solid #174E97
                    };
                    .operate-three {
                    color: #254550;
                    border: 1px solid #254550
                    };
                    .operate-four {
                    color: #E86F50;
                    border: 1px solid #E86F50;
                    margin-right: 0
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