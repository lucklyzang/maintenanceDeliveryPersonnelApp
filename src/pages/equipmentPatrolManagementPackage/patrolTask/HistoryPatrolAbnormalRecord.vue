<template>
  <div class="page-box" ref="wrapper">
    <div class="img-dislog-box">
        <van-dialog v-model="videoBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
          <video controls
            width="100%"
            :src="currentVideoUrl"
            poster="">
          </video>
        </van-dialog> 
    </div>    
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
         <!-- <div class="select-box event-type">
            <div class="select-box-left">
              <span>*</span>
              <span>编号</span>
            </div>
            <div class="select-box-right event-type-right">
              <span>{{ number }}</span>
            </div>
        </div> -->
        <div class="select-box event-type">
          <div class="select-box-left">
            <span>*</span>
            <span>检查项类型</span>
          </div>
          <div class="select-box-right">
            <span>{{ typeName }}</span>
          </div>
        </div>
        <div class="select-box event-type">
          <div class="select-box-left">
            <span>*</span>
            <span>检查项</span>
          </div>
          <div class="select-box-right">
            <span>{{ itemName }}</span>
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>记录时间</span>
          </div>
          <div class="select-box-right" @click="showFindTime = true">
            {{ recordTime }}
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>异常类型</span>
          </div>
          <div class="select-box-right">
            <span>{{ registerType }}</span>
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>严重程度</span>
          </div>
          <div class="select-box-right">
            <span>{{ registerSeverity }}</span>
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>设备状态</span>
          </div>
          <div class="select-box-right">
            <span>{{ registerState }}</span>
          </div>
        </div>
        <div class="transport-type problem-overview">
            <div class="transport-type-left">
              <span>异常情况说明</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="problemOverview"
                rows="2"
                maxlength="500"
                disabled
                type="textarea"
              />
            </div>
          </div>
          <div class="result-picture">
            <div class="title-picture">图片</div>
            <div class="image-list">
                <div v-for="(item, index) in problemPicturesList" :key='index'>
                  <img :src="item" @click="enlareEvent(item)" />
                </div>
            </div>
         </div>
         <div class="result-picture">
            <div class="title-picture">视频</div>
            <div class="image-list">
               <div v-for="(item, index) in problemVideosList" :key='index' @click="enlareVideoEvent(item)">
                  <video
                    width="100%"
                    height="70px"
                    :src="item"
                    poster="">
                  </video>
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
                rows="2"
                maxlength="500"
                type="textarea"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="backEvent">返回</span>
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
  name: "HistoryPatrolAbnormalRecord",
  components: {
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      quitInfoShow: false,
      checkItem: '',
      number: '',
      typeName: '',
      itemName: '',
      recordTime: '',
      showFindTime: false,
      videoBoxShow: false,
      currentVideoUrl: '',
      registerSeverity: '',
      registerState: '',
      registerType: '',
      problemPicturesList: [],
      problemVideosList: [],
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
    console.log('异常记录性情',this.historyPatrolTaskAbnormalRecordDetails);
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.$router.push({path: '/historyPatrolAbnormalCheckItemEventList'})
      })
    };
    this.echoAbnormalRecoedMessage()
  },

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","historyPatrolTaskAbnormalRecordDetails","historyPatrolTaskAbnormalCheckItemEventList"]),
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
      this.$router.push({path: '/historyPatrolAbnormalCheckItemEventList'})
    },

    // 返回事件
    backEvent () {
      this.$router.push({path: '/historyPatrolAbnormalCheckItemEventList'})
    },

    // 视频放大播放事件
    enlareVideoEvent (item) {
      this.currentVideoUrl = item;
      this.videoBoxShow = true
    },

    // 异常类型转换
    abnormalTypeTransition (num) {
      let temoraryNum = num.toString();
      switch(temoraryNum) {
          case '3' :
              return '其他'
              break;
          case '4' :
              return '设备损坏'
              break;
          case '5' :
              return '隐患排查'
              break;
      }
    },

    // 严重程度转换
    registerSeverityTransition (num) {
      let temoraryNum = num.toString();
      switch(temoraryNum) {
          case '0' :
              return '普通'
              break;
          case '1' :
              return '严重'
              break
      }
    },

    // 设备状态转换
    registerStateTransition (num) {
      let temoraryNum = num.toString();
      switch(temoraryNum) {
          case '0' :
              return '正常使用'
              break;
          case '1' :
              return '停机待修'
              break;
          case '2' :
              return '停用'
              break;
          case '3' :
              return '报废'
              break;
      }
    },

    // 回显异常记录信息
    echoAbnormalRecoedMessage () {
      this.number = this.historyPatrolTaskAbnormalRecordDetails.number;
      this.typeName = this.historyPatrolTaskAbnormalCheckItemEventList.typeName;
      this.itemName = this.historyPatrolTaskAbnormalCheckItemEventList.itemName;
      this.recordTime = this.historyPatrolTaskAbnormalRecordDetails.findTime;
      this.registerSeverity = this.registerSeverityTransition(this.historyPatrolTaskAbnormalRecordDetails.registerSeverity);;
      this.registerState = this.registerStateTransition(this.historyPatrolTaskAbnormalRecordDetails.registerState);
      this.registerType = this.abnormalTypeTransition(this.historyPatrolTaskAbnormalRecordDetails.eventType);;
      this.problemOverview = this.historyPatrolTaskAbnormalRecordDetails.description;
      this.problemPicturesList = this.historyPatrolTaskAbnormalRecordDetails.images.filter((item) => { return item.indexOf('.mp4') == -1 });
      this.problemVideosList = !this.historyPatrolTaskAbnormalRecordDetails.videos ? this.historyPatrolTaskAbnormalRecordDetails.images.filter((item) => { return item.indexOf('.mp4') != -1 }) : this.historyPatrolTaskAbnormalRecordDetails.videos;
      this.taskDescribe = this.historyPatrolTaskAbnormalRecordDetails.remark
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
    /deep/ .van-dialog {
      top: 50% !important;
      max-height: 98vh;
      display: flex;
      flex-direction: column;
      .van-dialog__content {
        flex: 1;
        overflow: auto;
        >img {
          width: 100%;
        }
      };
      .van-dialog__footer {
        .van-dialog__confirm {
          background: #f2f2f2
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
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  font-size: 14px;
                  color: #9E9E9A !important;
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
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  font-size: 14px;
                  color: #9E9E9A !important;
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
                font-size: 14px;
                color: #101010;
                text-align: right;
                flex: 1;
                .no-wrap()
              }
            }
          };
          .end-select-box {
              .select-box-right {
                font-size: 14px;
                color: #101010;
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
            padding: 0 8px 14px 8px;
            margin-top: 6px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            background: #fff;
            justify-content: space-between;
            .title-picture {
              font-size: 14px;
              height: 30px;
              line-height: 30px;
              color: #9E9E9A
            };
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
            color: #fff;
            background: linear-gradient(to right, #6cd2f8, #2390fe);
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
          }
        }
    }
  }
}
</style>