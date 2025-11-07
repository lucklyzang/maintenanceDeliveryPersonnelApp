<template>
  <div class="page-box" ref="wrapper">
    <div class="img-dislog-box">
        <van-dialog v-model="imgBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
            <img :src="currentImgUrl" />
        </van-dialog> 
    </div>  
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{loadingText}}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
       <van-nav-bar
        title="异常记录"
        left-text="返回"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
    </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
      <div class="content-box">
        <div class="message-box">
         <div class="select-box event-type">
            <div class="select-box-left">
              <span>*</span>
              <span>编号</span>
            </div>
            <div class="select-box-right event-type-right">
              <span>{{ number }}</span>
            </div>
        </div>
        <div class="select-box event-type">
          <div class="select-box-left">
            <span>*</span>
            <span>检查项</span>
          </div>
          <div class="select-box-right">
            <span>{{ checkItem }}</span>
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>记录时间</span>
          </div>
          <div class="select-box-right" @click="showFindTime = true">
            2023-06-12 11:00
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>异常类型</span>
          </div>
          <div class="select-box-right">
            <span>设备损坏</span>
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>严重程度</span>
          </div>
          <div class="select-box-right">
            <span>普通</span>
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>设备状态</span>
          </div>
          <div class="select-box-right">
            <span>停机待修</span>
          </div>
        </div>
        <div class="transport-type problem-overview">
            <div class="transport-type-left">
              <span>异常情况说明</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="problemOverview"
                rows="1"
                autosize
                maxlength="200"
                disabled
                type="textarea"
              />
            </div>
          </div>
          <div class="result-picture">
            <div class="image-list">
                <div v-for="(item, index) in problemPicturesList" :key='index'>
                    <img :src="item" @click="enlareEvent(item)" />
                    <div class="icon-box" @click="issueDelete(index,item)">
                        <van-icon
                        name="delete"
                        color="#d70000"
                        />
                    </div>
                </div>
            </div>
         </div>
          <div class="transport-type">
            <div class="transport-type-left">
              <span>意见或建议</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="taskDescribe"
                disabled
                rows="3"
                autosize
                type="textarea"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="backEvent">退出</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import _ from 'lodash'
export default {
  name: "HistorySpotAbnormalRecord",
  components: {
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      quitInfoShow: false,
      checkItem: '2#',
      number: 'q12',
      showFindTime: false,
      problemPicturesList: [],
      currentImgUrl: '',
      photoBox: false,
      imgBoxShow: false,
      imgIndex: '',
      imgDeleteUrl: '',
      deleteInfoDialogShow: false,
      loadingText: '加载中...',
      problemOverview: '',
      taskDescribe: '',
      overlayShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.$router.push({path: '/historyEquipmentSpotCheckTaskDetails'})
      })
    }
  },

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
    ...mapMutations([]),

    onClickLeft() {
      this.$router.push({path: '/historyEquipmentSpotCheckTaskDetails'})
    },

    // 返回事件
    backEvent () {
        this.$router.push({path: '/historyEquipmentSpotCheckTaskDetails'})
    },

    // 图片放大事件
    enlareEvent (item) {
      this.currentImgUrl = item;
      this.imgBoxShow = true
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
  .img-dislog-box {
    .van-dialog {
        .van-dialog__content {
            >img {
                width: 100%
            }
        }
    }
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
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent;
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: #fff !important;
                margin-left: 8px !important;
            }
        };
        .van-nav-bar__right {
            .van-nav-bar__text {
                font-weight: bold !important
            }
        }
        .van-icon {
            color: #fff !important;
            font-size: 22px !important;
        }
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
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 0;
        background: #f7f7f7;
        z-index: 10;
        .message-box {
          flex: 1;
          width: 100%;
          overflow: scroll;
          .event-type {
            .select-box-left {
              padding-right: 10px;
              box-sizing: border-box;
              font-size: 14px;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            }
          };
          .select-box {
            width: 100%;
            padding: 8px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .select-box-left {
              padding-right: 10px;
              font-size: 14px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            };
            .select-box-right {
              flex: 1;
              justify-content: flex-end;
              align-items: center;
              display: flex;
              padding-right: 6px;
              box-sizing: border-box;
              width: 0;
              .spanStyle {
                color: #bfbfbf !important
              };
              >span {
                color: #101010;
                text-align: right;
                font-size: 14px;
                flex: 1;
                .no-wrap()
              }
            }
          };
          .end-select-box {
              .select-box-right {
                padding-right: 0 !important;
                .spanStyle {
                  color: #bfbfbf !important
                };
              }
          };
          .end-select-box-room {
            .select-box-left {
              >span {
                &:nth-child(1) {
                  font-size: 14px;
                  color: #9E9E9A !important;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            }
          };
          .problem-overview {
            align-items: center
          };
          .details-site {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              padding-right: 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
            .transport-type-right {
              width: 0;
              flex: 1;
              display: flex;
              flex-wrap: wrap;
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            }
          };
          .transport-type {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              width: 100%;
              margin-bottom: 8px;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
            .transport-type-right {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            }
          };
          .result-picture {
            padding: 14px 8px;
            margin-top: 6px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            background: #fff;
            justify-content: space-between;
            .image-list {
              width: 100%;
              flex-wrap: wrap;
              display: flex;
              >div {
                  width: 23.5%;
                  height: 70px;
                  vertical-align: top;
                  margin-right: 2%;
                  margin-top: 2%;
                  position: relative;
                  &:nth-child(1) {
                      margin-top: 0;
                  };
                  &:nth-child(2) {
                      margin-top: 0;
                  };
                  &:nth-child(3) {
                      margin-top: 0;
                  };
                  &:nth-child(4) {
                      margin-top: 0;
                  };
                  &:nth-child(4n+4) {
                      margin-right: 0;
                  };
                  .icon-box {
                      position: absolute;
                      bottom: 0;
                      right: 0;
                      display: flex;
                      width: 100%;
                      padding: 2px 0;
                      box-sizing: border-box;
                      justify-content: center;
                      align-items: center;
                      background: #616161;
                      /deep/ .van-icon {
                      }  
                  };
                  img {
                      width: 100%;
                      height: 100%
                  };
                  &:last-child {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      background: #f2f2f2;
                      /deep/ .van-icon{
                          position: relative;
                          top: 0;
                          right: 0;
                      }
                  }
              }
            }
          }
        };
        .btn-box {
          width: 90%;
          margin: 0 auto;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          >span {
            width: 40%;
            display: inline-block;
            height: 45px;
            font-size: 18px;
            line-height: 45px;
            background: #fff;
            text-align: center;
            border-radius: 30px;
            color: #E86F50;
            border: 1px solid #E86F50;
          }
        }
    }
  }
}
</style>