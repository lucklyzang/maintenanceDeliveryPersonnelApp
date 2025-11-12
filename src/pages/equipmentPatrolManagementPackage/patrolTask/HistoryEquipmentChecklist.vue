<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <van-nav-bar title="设备检查单" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
          <img :src="statusBackgroundPng" />
        </div>
        <div class="content-box">
          <div class="current-area">
            <van-icon name="location" color="#1684FC" size="25" />
            <span>当前检查设备: {{ `${currentPatrolTaskDeviceChecklist.deviceName} ${currentPatrolTaskDeviceChecklist.norms}` }}</span>
          </div>
          <div class="equipment-list-box">
            <div class="equipment-classification-box">
               <div class="equipment-classification-list" v-for="(item,index) in currentPatrolTaskDeviceChecklist.checkItemListGroupByCheckType" :key="index">
                <div class="equipment-classification-name">{{ `#${item.checkItemClassifyName}` }}</div>
                <div class="equipment-list" v-for="(innerItem,innerIndex) in item.checkItemClassifyContent" :key="innerIndex">
                  <div class="equipment-operation-box" @click="checkItemNameRowCkickEvent(index,innerItem,innerIndex)">
                    <div class="operation-left">
                      <img :src="innerItem.unfold ? arrowGreenBottomPng : arrowGreenRightPng" alt="">
                      <span>{{ innerItem.itemName }}</span>
                    </div>
                    <div class="operation-right">
                      <van-radio-group v-model="innerItem.checkResult" direction="horizontal" disabled>
                          <van-radio name="1" v-if="innerItem.checkResult == 1"  @click.stop.native="()=>{}">
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                              </template>
                          </van-radio>
                          <van-radio name="3" v-if="innerItem.checkResult == 3"  @click.stop.native="()=>{}" @click="(event) => noPassEvent(event,innerItem,innerIndex)" disabled>
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCloseCirclePng : closeCirclePng" />
                              </template>
                          </van-radio>
                      </van-radio-group>
                    </div>
                  </div>
                  <div class="examine-standard-box" v-show="innerItem.unfold">
                    <div class="examine-standard-top">
                      <p>标准与要求:</p>
                      <p>{{ innerItem.itemStandard }}</p>
                    </div>
                    <div class="examine-standard-bottom">
                      <p>检查方法及工具:</p>
                      <p>{{ innerItem.method }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-complete" @click="backEvent">返 回</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
import _ from 'lodash';
export default {
  name: "HistoryEquipmentChecklist",
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
      currentPatrolTaskDeviceChecklist: {},
      loadText: '加载中',
      arrowGreenBottomPng: require("@/common/images/home/arrow-green-bottom.png"),
      arrowGreenRightPng: require("@/common/images/home/arrow-green-right.png"),
      checkCheckboxPng: require("@/common/images/home/check-checkbox-circle.png"),
      checkboxPng: require("@/common/images/home/checkbox-circle.png"),
      closeCirclePng: require("@/common/images/home/close-circle.png"),
      checkCloseCirclePng: require("@/common/images/home/check-close-circle.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/historyEquipmentPatrolDetails");
    this.initTaskDeviceChecklistData();
    this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach(el => {
      console.log('遍历数据',el);
      el.checkItemClassifyContent.forEach((innerEl) => {
        innerEl.checkResult =  innerEl.checkResult.toString();
        innerEl.unfold = false
      })
    })
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","patrolTaskListMessage","historyPatrolTaskDeviceChecklist"]),
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
    ...mapMutations(['changeHistoryPatrolTaskAbnormalCheckItemEventList']),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/historyEquipmentPatrolDetails'})
    },

    // 底部返回事件
    backEvent() {
      this.onClickLeft()
    },

    initTaskDeviceChecklistData () {
      this.currentPatrolTaskDeviceChecklist = _.cloneDeep(this.historyPatrolTaskDeviceChecklist);
      let temporaryCheckItemListGroupByCheckType = this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'];
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'] = [];
      Object.keys(temporaryCheckItemListGroupByCheckType).forEach((item) => {
        this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].push({
          checkItemClassifyName: item,
          checkItemClassifyContent: temporaryCheckItemListGroupByCheckType[item]
        })
      });
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach(el => {
        el.checkItemClassifyContent.forEach((innerEl) => {
          innerEl.unfold = false
        })
      })
    },

    // 检查项名称行点击事件
    checkItemNameRowCkickEvent (index,innerItem,innerIndex) {
      this.$nextTick(() => {
        this.$set(this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][index]['checkItemClassifyContent'][innerIndex], 'unfold',!this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][index]['checkItemClassifyContent'][innerIndex]['unfold'])
      });
      this.$forceUpdate()
    },

    // 不通过事件
    noPassEvent (event,innerItem,innerIndex) {
      this.changeHistoryPatrolTaskAbnormalCheckItemEventList(innerItem);
      this.$router.push({path: '/historyPatrolAbnormalCheckItemEventList'})
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
    height: 0;
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
      z-index: 10;
      height: 0;
      .current-area {
        height: 54px;
        line-height: 54px;
        width: 94%;
        margin: 0 auto;
        font-size: 14px;
        color: #101010;
        /deep/ .van-icon {
          vertical-align: middle
        };
        >span {
          vertical-align: middle
        }
      };
      .equipment-list-box {
        background: #fff;
        flex: 1;
        overflow: auto;
        .equipment-classification-box {
          .equipment-classification-list {
            .equipment-classification-name {
              .bottom-border-1px(#BEC7D1);
              font-size: 12px;
              color: #848484;
              padding: 6px 4px;
              box-sizing: border-box
            };
            .equipment-list {
              .equipment-operation-box {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px;
                box-sizing: border-box;
                .bottom-border-1px(#BEC7D1);
                .operation-left {
                  flex: 1;
                  word-break: break-all;
                  img {
                    width: 22px;
                    margin-right: 4px;
                    vertical-align: middle
                  };
                  span {
                    color: #494D51;
                    font-size: 14px;
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
              };
              .examine-standard-box {
                background: #f5f5f5;
                padding: 6px;
                box-sizing: border-box;
                .examine-standard-top {
                  p {
                    color: #000000;
                    font-size: 12px;
                    margin-bottom: 4px;
                    &:last-child {
                      word-break: break-all
                    }
                  }
                };
                .examine-standard-bottom {
                  margin-top: 10px;
                  p {
                    color: #000000;
                    font-size: 12px;
                    margin-bottom: 4px;
                    &:last-child {
                      word-break: break-all
                    }
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
    .task-complete {
      width: 60%;
      height: 42px;
      line-height: 42px;
      background: #fff;
      font-size: 16px;
      text-align: center;
      border-radius: 30px;
      color: #fff;
      background: linear-gradient(to right, #6cd2f8, #2390fe);
      box-shadow: 0px 2px 6px 0px rgba(36, 149, 213, 1)
    }
  }
}
</style>