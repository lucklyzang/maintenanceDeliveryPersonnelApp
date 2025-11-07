<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <van-nav-bar title="任务详情" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
          <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
          <div class="current-area">
            <van-icon name="location" color="#1684FC" size="25" />
            <span>当前检查设备: 空调外机</span>
          </div>
          <div class="equipment-list-box">
             <div class="equipment-list">
                  <div class="equipment-operation-box">
                    <div class="operation-left">
                      <span>1号水管与水泵连接处</span>
                    </div>
                    <div class="operation-right">
                      <van-radio-group v-model="checkResultValue" direction="horizontal">
                          <van-radio name="1">
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                              </template>
                          </van-radio>
                          <van-radio name="3" @click="(event) => noPassEvent(event)">
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCloseCirclePng : closeCirclePng" />
                              </template>
                          </van-radio>
                      </van-radio-group>
                    </div>
                  </div>
                </div>
          </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-quit" @click="quitEvent">退 出</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {} from '@/api/equipmentPatrol/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
export default {
  name: "HistoryEquipmentSpotCheckTaskDetails",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      quitInfoShow: false,
      checkResultValue: '1',
      loadText: '加载中',
      checkCheckboxPng: require("@/common/images/home/check-checkbox-circle.png"),
      checkboxPng: require("@/common/images/home/checkbox-circle.png"),
      closeCirclePng: require("@/common/images/home/close-circle.png"),
      checkCloseCirclePng: require("@/common/images/home/check-close-circle.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/historyEquipmSpotTaskList")
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","patrolTaskListMessage","chooseHospitalArea"]),
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
      this.$router.push({path: '/historyEquipmSpotTaskList'})
    },

    // 退出事件
    quitEvent () {
      this.$router.push({path: '/historyEquipmSpotTaskList'})
    },

    // 通过事件
    passEvent (event) {
      // 已完成的任务不可操作
      // if (this.patrolTaskListMessage.state == 4) {
      //   return
      // };
      // 判断该巡查项下是否有登记事件
      // this.queryIsHaveEventRegister(event,item,index)
    },

    // 不通过事件
    noPassEvent (event) {
      this.$router.push({path: '/historySpotAbnormalRecord'});
    //   this.$router.push({path: '/historySpotAbnormalCheckItemEventList'});
      // 已完成的任务
      // if (this.patrolTaskListMessage.state == 4) {
      //   // 该检查项最终结果选为×,点击后直接进入异常检查项事件列表页
      //   if (this.departmentCheckList['checkItemList'][index]['checkResult'] == 3) {
      //     //保存进入问题记录页的相关信息
      //     let temporaryInfo = this.enterProblemRecordMessage;
      //     temporaryInfo['isAllowOperation'] = true;
      //     temporaryInfo['enterProblemRecordPageSource'] = '/areaPatrolDetails';
      //     temporaryInfo['issueInfo'] = item;
      //     temporaryInfo['index'] = index; 
      //     this.changeEnterProblemRecordMessage(temporaryInfo);
      //     this.$router.push({path: '/problemRecord'})
      //   } else {
      //     // 该检查项最终结果选为√,点击后不做处理
      //     // 重置该检查项选中状态
      //     item['checkResult'] = '1';
      //     return
      //   }
      // } else {
      //   // 未完成的任务
      //   this.loadingShow = true;
      //   this.overlayShow = true;
      //   this.loadText = '反馈中';
      //   checkItemNoPass({resultId:item.resultId,workerName: this.userName}).then((res) => {
      //     this.loadingShow = false;
      //     this.overlayShow = false;
      //     this.loadText = '';
      //     if (res && res.data.code == 200) {
      //       this.$toast({
      //         type: 'success',
      //         message: '反馈成功'
      //       });
      //       this.resultId = item['resultId'];
      //       //保存进入问题记录页的相关信息
      //       let temporaryInfo = this.enterProblemRecordMessage;
      //       temporaryInfo['isAllowOperation'] = true;
      //       temporaryInfo['enterProblemRecordPageSource'] = '/areaPatrolDetails';
      //       temporaryInfo['issueInfo'] = item;
      //       temporaryInfo['id'] = res.data.data ? res.data.data.id : null;
      //       temporaryInfo['index'] = index; 
      //       this.changeEnterProblemRecordMessage(temporaryInfo);
      //       // 第一次点击X，直接选择事件类型进行登记
      //       if (this.departmentCheckList['checkItemList'][index]['checkResult'] == 0 || this.departmentCheckList['checkItemList'][index]['checkResult'] == 1) {
      //         this.patrolItem = this.enterProblemRecordMessage['issueInfo']['name'];
      //         this.eventTypeShow = true
      //       } else {
      //         // 第二次及以上再点击X，进入异常巡查项事件列表页
      //         this.$router.push({path: '/problemRecord'})
      //       };
      //       // 更改该检查项选中状态
      //       let tempraryMessage = deepClone(this.departmentCheckList);
      //       tempraryMessage['checkItemList'][index]['checkResult'] = '3';
      //       this.changeDepartmentCheckList(tempraryMessage)
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
      // }
    },

    // 获取任务详情
    queryTaskDetails () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.queryDataSuccess = false;
      this.loadText = '加载中';
      getTaskDetails(
        this.patrolTaskListMessage.id
      ).then((res) => {
        if (res && res.data.code == 200) {
          this.isShowOperateBtn = true;
          this.loadingShow = false;
          this.overlayShow = false;
          this.loadText = '';
          this.queryDataSuccess = true;
          this.changePatrolTaskListMessage(res.data.data);
          // 选择打卡地点弹框的数据
          this.clockingPlaceOption = [];
          for (let i = 0,len = this.patrolTaskListMessage['needSpaces'].length; i < len; i++) {
            this.clockingPlaceOption.push({
              id: i,
              text: this.patrolTaskListMessage['needSpaces'][i]['name'],
              value: this.patrolTaskListMessage['needSpaces'][i]['id']
            })
          }
        } else {
          this.$toast({
            type: 'fail',
            message: res.data.msg
          })
        }
      })
      .catch((err) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadText = '';
        this.$toast({
          type: 'fail',
          message: err
        })
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
  height: 0;
  position: relative;
  .content-wrapper();
   .quit-info-box {
    /deep/ .van-dialog {
      .van-dialog__content {
          padding: 20px 16px 0 16px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .dialog-title {
            padding: 10px 0;
            box-sizing: border-box;
            text-align: center;
            color: #101010;
            font-size: 16px;
          };
          .dialog-center {
            line-height: 20px;
            padding: 20px 0;
            box-sizing: border-box;
            color: #101010;
            font-size: 12px
          }
        };
        .van-dialog__footer {
          padding: 10px 40px 20px 40px !important;
          box-sizing: border-box;
          justify-content: space-between;
          ::after {
            content: none
          };
        .van-dialog__cancel {
          height: 40px;
          background: #3B9DF9;
          color: #fff !important;
          border-radius: 8px;
          margin-right: 20px
        };
        .van-dialog__confirm {
           height: 40px;
            color: #3B9DF9;
            border: 1px solid #3B9DF9;
            border-radius: 8px
        }
        };
        .van-hairline--top::after {
          border-top-width: 0 !important
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
      padding-bottom: 50px;
      .current-area {
        height: 54px;
        line-height: 54px;
        width: 100%;
        padding-left: 10px;
        box-sizing: border-box;
        font-size: 14px;
        color: #3B9DF9;
        /deep/ .van-icon {
          vertical-align: middle
        };
        >span {
          vertical-align: middle
        }
      };
      .equipment-list-box {
        flex: 1;
        overflow: auto;
        .equipment-list {
            background: #fff;
            .equipment-operation-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 44px;
            padding: 0 6px 0 10px;
            box-sizing: border-box;
            .bottom-border-1px(#BEC7D1);
            .operation-left {
                span {
                    color: #101010;
                    font-size: 12px;
                    vertical-align: middle
                }
            };
            .operation-right {
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
        }
      }
    }    
  };
  .task-operation-box {
    height: 80px;
    display: flex;
    background: #F7F7F7;
    width: 100%;
    z-index: 100;
    align-items: center;
    justify-content: center;
    .task-quit {
        width: 35%;
        height: 42px;
        line-height: 42px;
        background: #fff;
        font-size: 18px;
        text-align: center;
        border-radius: 30px;
        color: #E86F50;
        border: 1px solid #E86F50;
        margin-right: 20px
    }
  }
}
</style>