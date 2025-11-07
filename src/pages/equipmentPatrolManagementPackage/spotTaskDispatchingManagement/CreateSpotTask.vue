<template>
  <div class="page-box" ref="wrapper">
    <!-- 开始时间 -->
    <div class="find-time-box">
      <van-popup v-model="showFindTime" position="bottom">
        <van-datetime-picker
          v-model="currentFindTime"
          type="datetime"
          :min-date="minDate"
          :max-date="maxDate"
        >
          <template #default>
            <h3>开始时间</h3>
            <van-icon name="cross" size="25" @click="showFindTime = false" />
          </template>
          <template #columns-bottom>
            <div class="button-box">
              <span @click="showFindTime = false">取消</span>
              <span @click="onConDayFirm">确认</span>
            </div>
          </template>
        </van-datetime-picker>
      </van-popup>
    </div>
    <!-- 退出提示框   -->
    <div class="quit-info-box">
       <van-dialog v-model="quitInfoShow"  show-cancel-button width="85%"
          @confirm="quitSure" @cancel="quitCancel" confirm-button-text="是"
          cancel-button-text="否"
        >
          <div class="delete-icon">
            <van-icon name="cross" size="24" @click="quitInfoShow = false" />
          </div>
          <div class="dialog-title">
            退出前是否保存?
          </div>
          <div class="dialog-center">
            保存的记录可再次点击×进行查看
          </div>
      </van-dialog>
    </div>
    <div class="img-dislog-box">
        <van-dialog v-model="imgBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
            <img :src="currentImgUrl" />
        </van-dialog> 
    </div>  
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{loadingText}}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 规格型号 -->
    <div class="transport-rice-box" v-if="showSpecification">
      <ScrollSelection :columns="specificationOption" title="规格型号" @sure="specificationSureEvent" @cancel="specificationCancelEvent" @close="specificationCloseEvent" />
    </div>
    <!-- 点检员 -->
    <div class="transport-rice-box" v-if="showSpotCheckPerson">
      <ScrollSelection :columns="spotCheckPersonOption" title="点检员" @sure="spotCheckPersonSureEvent" @cancel="spotCheckPersonCancelEvent" @close="spotCheckPersonCloseEvent" />
    </div>
    <!-- 设备名称 -->
    <div class="transport-rice-box" v-if="showEquipmentName">
      <ScrollSelection :columns="equipmentNameOption" title="设备名称" @sure="equipmentNameSureEvent" @cancel="equipmentNameCancelEvent" @close="equipmentNameCloseEvent" />
    </div>
    <div class="nav">
       <van-nav-bar
        title="创建任务"
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
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>紧急程度</span>
          </div>
          <div class="select-box-right">
            <van-radio-group v-model="emergencyDegreeValue" direction="horizontal">
              <van-radio name="1" checked-color="#289E8E">正常</van-radio>
              <van-radio name="2" checked-color="#E86F50">紧急</van-radio>
            </van-radio-group>
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>设备名称</span>
          </div>
          <div class="select-box-right" @click="equipmentNameClickEvent">
            <span>{{ currentEquipmentName }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>规格型号</span>
          </div>
          <div class="select-box-right" @click="specificationClickEvent">
            <span>{{ currentSpecification  }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>开始时间</span>
          </div>
          <div class="select-box-right" @click="showFindTime = true">
            <span>{{ getNowFormatDate(currentFindTime) }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>点检员</span>
          </div>
          <div class="select-box-right" @click="spotCheckPersonClickEvent">
            <span>{{ currentSpotCheckPerson  }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="check-item-box">
          <div class="check-item-top">
            <span>*</span>
            <span>检查项</span>
          </div>
          <div class="check-item-bottom">
             <van-field
                v-model="checkItemContent"
                rows="2"
                autosize
                maxlength="100"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
              <van-icon name="add" size="26" color="#0A7AF5" @click="addCheckItemEvent" />
          </div>
        </div>
        <div class="dashed-line"></div>
        <div class="check-item-list-box">
          <div class="check-item-list" v-for="(item,index) in checkItemList" :key="index">
            <img :src="minusPng" alt="" @click="deleteCheckItemEvent(index)">
            <p>{{ item }}</p>
          </div>
        </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="quitEvent">退出</span>
          <span class="operate-two" @click="temporaryStorageEvent">保存</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import ScrollSelection from "@/components/ScrollSelection";
import BottomSelect from "@/components/BottomSelect";
export default {
  name: "CreateSpotTask",
  components: {
    ScrollSelection,
    BottomSelect
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      quitInfoShow: false,
      showFindTime: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentFindTime: new Date(),
      emergencyDegreeValue: '1',
      currentImgUrl: '',
      photoBox: false,
      checkItemList: [],
      checkItemContent: '',
      imgBoxShow: false,
      imgIndex: '',
      checkResultId: '',
      deleteInfoDialogShow: false,
      loadingText: '加载中...',
      problemOverview: '',
      taskDescribe: '',
      transportNumberValue: '',

      specificationOption: [],
      showSpecification: false,
      currentSpecification: '请选择',

      spotCheckPersonOption: [],
      showSpotCheckPerson: false,
      currentSpotCheckPerson: '请选择',

      equipmentNameOption: [],
      showEquipmentName: false,
      currentEquipmentName: '请选择',

      overlayShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      minusPng: require("@/common/images/home/minus.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.$router.push({path: '/equipmentSpotList'})
      })
    };
    this.parallelFunction()
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
	  });
    next() 
  },

  watch: {
  },

  computed: {
    ...mapGetters(["userInfo","ossMessage","timeMessage","chooseHospitalArea"]),
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
    ...mapMutations(["changeOverDueWay","changeTimeMessage","changeOssMessage"]),

    onClickLeft() {
      this.$router.push({path: '/equipmentSpotList'})
    },

    // 任务开始事件弹框确认事件
     onConDayFirm() {
      this.showFindTime = false
    },


    // 回显暂存的信息
    echoTemporaryStorageMessage (temporaryIndex) {
      let casuallyTemporaryStorageOtherRegisterMessage = this.temporaryStorageOtherRegisterMessage;
      this.currentFindTime = new Date(casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['createTime']);
      this.currentAbnormalType = casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['roomName']  == '' ? '请选择' : casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['abnormalType'];
      this.problemOverview = casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['description'];
      this.taskDescribe = casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['remark'];
      this.problemPicturesList = casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['images'];
      this.checkResultId = casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['resultId'] ? casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['resultId'] : ''
    },

    // 格式化时间
    getNowFormatDate(currentDate) {
      let currentdate;
      let strDate = currentDate.getDate();
      let seperator1 = "-";
      let seperator2 = ":";
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
      currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hour + seperator2 + minutes
      return currentdate
    },

    // 添加检查项事件
    addCheckItemEvent () {
      if (!this.checkItemContent) { return };
      this.checkItemList.push(this.checkItemContent)
    },

    // 删除检查项事件
    deleteCheckItemEvent (index) {
      this.checkItemList.splice(index,1)
    },

    // 并行查询目的建筑
    parallelFunction () {
        this.loadingText = '加载中...';
        this.loadingShow = true;
        this.overlayShow = true;
        Promise.all([this.getStructure()])
        .then((res) => {
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          if (res && res.length > 0) {
            this.structureOption = [];
            let [item1] = res;
            if (item1) {
            }
          }
        })
        .catch((err) => {
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },


      // 查询目的建筑
      getStructure () {
        return new Promise((resolve,reject) => {
          queryStructure(this.proId).then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

    // 异常类型列点击事件
    specificationClickEvent () {
      this.showSpecification = true
    },

    // 异常类型下拉选择框确认事件
    specificationSureEvent (val) {
      if (val.length > 0) {
        this.currentSpecification =  val;
      } else {
        this.currentSpecification = '请选择'
      };
      this.showSpecification = false
    },

    // 异常类型下拉选择框取消事件
    specificationCancelEvent () {
      this.showSpecification = false
    },

    // 异常类型下拉选择框关闭事件
    specificationCloseEvent () {
      this.showSpecification = false
    },

    // 严重程度列点击事件
    spotCheckPersonClickEvent () {
      this.showSpotCheckPerson = true
    },

    // 严重程度下拉选择框确认事件
    spotCheckPersonSureEvent (val) {
      if (val.length > 0) {
        this.currentSpotCheckPerson =  val;
      } else {
        this.currentSpotCheckPerson = '请选择'
      };
      this.showSpotCheckPerson = false
    },

    // 严重程度下拉选择框取消事件
    spotCheckPersonCancelEvent () {
      this.showSpotCheckPerson = false
    },

    // 严重程度下拉选择框关闭事件
    spotCheckPersonCloseEvent () {
      this.showSpotCheckPerson = false
    },

    // 设备状态列点击事件
    equipmentNameClickEvent () {
      this.showEquipmentName = true
    },

    // 设备状态下拉选择框确认事件
    equipmentNameSureEvent (val) {
      if (val.length > 0) {
        this.currentEquipmentName =  val;
      } else {
        this.currentEquipmentName = '请选择'
      };
      this.showEquipmentName = false
    },

    // 设备状态下拉选择框取消事件
    equipmentNameCancelEvent () {
      this.showEquipmentName = false
    },

    // 设备状态下拉选择框关闭事件
    equipmentNameCloseEvent () {
      this.showEquipmentName = false
    },

    // 退出事件
    quitEvent () {
      this.quitInfoShow = true
    },

    // 创建点检任务
    async repairsEvent () {
      // 创建其他任务
      let temporaryMessage = {
      };
      this.postGenerateRepairsTask(temporaryMessage)
    },

    // 确定退出
    quitSure () {
      this.$router.push({path: '/equipmentSpotList'})
    },

    // 取消退出(暂存)
    quitCancel () {
      this.temporaryStorageEvent()
    },

    // 暂存事件
    temporaryStorageEvent () {
      let casuallyTemporaryStorageOtherRegisterMessage = this.temporaryStorageOtherRegisterMessage;
      if (this.temporaryStorageOtherRegisterMessage.length > 0 ) {
          let temporaryIndex = this.temporaryStorageOtherRegisterMessage.findIndex((item) => { return item.id == this.$route.query.eventId});
          if (temporaryIndex != -1) {
            casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['createTime'] = this.getNowFormatDate(this.currentFindTime);
            casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['roomName'] = this.currentGoalSpaces == '请选择' ? '' : this.currentGoalSpaces;
            casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['description'] = this.problemOverview;
            casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['remark'] = this.taskDescribe;
            casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['images'] = this.problemPicturesList;
            casuallyTemporaryStorageOtherRegisterMessage[temporaryIndex]['roomName'] = this.currentGoalSpaces == '请选择' ? '' : this.currentGoalSpaces
          } else {
            casuallyTemporaryStorageOtherRegisterMessage.push({
              id: uuidv4(),
              checkItemId: this.enterEventRegisterPageMessage['checkItemId'],
              resultId: this.enterEventRegisterPageMessage['resultId'],
              taskId: this.enterEventRegisterPageMessage['taskId'],
              depId: this.enterEventRegisterPageMessage['depId'],
              createTime: this.getNowFormatDate(this.currentFindTime),
              createName: this.userName,
              roomName: this.currentGoalSpaces == '请选择' ? '' : this.currentGoalSpaces,
              description: this.problemOverview,
              remark: this.taskDescribe,
              images: this.problemPicturesList,
              state: -1
            })
          }
        } else {
          casuallyTemporaryStorageOtherRegisterMessage.push({
            id: uuidv4(),
            checkItemId: this.enterEventRegisterPageMessage['checkItemId'],
            resultId: this.enterEventRegisterPageMessage['resultId'],
            taskId: this.enterEventRegisterPageMessage['taskId'],
            depId: this.enterEventRegisterPageMessage['depId'],
            createTime: this.getNowFormatDate(this.currentFindTime),
            createName: this.userName,
            roomName: this.currentGoalSpaces == '请选择' ? '' : this.currentGoalSpaces,
            description: this.problemOverview,
            remark: this.taskDescribe,
            images: this.problemPicturesList,
            state: -1
          })
      };
      this.changeTemporaryStorageOtherRegisterMessage(casuallyTemporaryStorageOtherRegisterMessage);
      this.$Alert({message:"暂存成功",duration:3000,type:'success'});
      if (this.enterEventRegisterPageMessage['enterRegisterEventPageSource']) {
        this.$router.push({path: this.enterEventRegisterPageMessage['enterRegisterEventPageSource']})
      } else {
        this.$router.push({path: '/eventList'})
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
  .quit-info-box {
    /deep/ .van-dialog {
      .van-dialog__content {
          padding: 20px 16px 0 16px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .delete-icon {
            text-align: right
          };
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
            text-align: center;
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
  .find-time-box {
    /deep/ .van-popup {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      .van-picker {
        padding: 20px 10px;
        box-sizing: border-box;
        .van-picker__toolbar {
          h3 {
            display: flex;
            justify-content: space-around;
            font-size: 18px;
            width: 100%;
            line-height: 40px;
            color: #101010;
            height: 40px;
            position: relative;
            /deep/ .van-icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0
            }
          }
        };
        .button-box {
          height: 60px;
          display: flex;
          width: 100%;
          margin: 0 auto;
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
              &:nth-child(1) {
                  color: #1864FF;
                  box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                  margin-right: 40px
              };
              &:last-child {
                  color: #fff;
                  background: linear-gradient(to right, #6cd2f8, #2390fe);
                  box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              }
          }
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
    };
    .signout-box {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 153px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #E86F50;
        font-size: 16px;
        color: #fff;
        border-radius: 8px
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
                font-size: 14px;
                text-align: right;
                flex: 1;
                .no-wrap()
              };
              /deep/ .van-radio-group {
                .van-radio--horizontal {
                  &:nth-child(1) {
                    .van-radio__label {
                      color: #289E8E !important
                    }
                  };
                  &:last-child {
                    margin-right: 4px !important;
                    .van-radio__label {
                      color: #E86F50 !important
                    }
                  }
                }
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
          .check-item-box {
            width: 100%;
            padding: 8px 6px;
            box-sizing: border-box;
            background: #fff;
            font-size: 14px;
            margin-top: 6px;
            .check-item-top {
              margin-bottom: 8px;
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
            .check-item-bottom {
              display: flex;
              /deep/ .van-cell {
                background: #f5f5f5;
                flex: 1;
                margin-right: 2px;
              }
            }
          };
          .dashed-line {
            width: 96%;
            margin: 0 auto;
            border-top: 1px dashed #c8c8c8;
          }
          .check-item-list-box {
            width: 100%;
            padding: 6px;
            box-sizing: border-box;
            background: #fff;
            .check-item-list {
              display: flex;
              margin-bottom: 6px;
              align-items: center;
              img {
                width: 20px;
                margin-right: 4px;
                vertical-align: middle
              };
              p {
                font-size: 14px;
                vertical-align: middle;
                flex: 1;
                word-break: break-all;
                color: #101010
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
          justify-content: space-between;
          >span {
            width: 40%;
            display: inline-block;
            height: 45px;
            font-size: 18px;
            line-height: 45px;
            background: #fff;
            text-align: center;
            border-radius: 30px;
            &:nth-child(1) {
              color: #E86F50;
              border: 1px solid #E86F50;
              margin-right: 30px
            };
            &:nth-child(2) {
              color: #3B9DF9;
              border: 1px solid #3B9DF9;
              margin-right: 30px
            };
            &:last-child {
              color: #fff;
              background: linear-gradient(to right, #6cd2f8, #2390fe);
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            }
          }
        }
    }
  }
}
</style>