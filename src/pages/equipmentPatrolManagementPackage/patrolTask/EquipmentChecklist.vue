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
                      <van-radio-group v-model="innerItem.checkResult" direction="horizontal">
                          <van-radio name="1" @click.stop.native="()=>{}" @click="(event) => passEvent(event,item,innerItem,innerIndex)">
                              <template #icon="props">
                                <img class="img-icon" :src="props.checked ? checkCheckboxPng : checkboxPng" />
                              </template>
                          </van-radio>
                          <van-radio name="3" @click.stop.native="()=>{}" @click="(event) => noPassEvent(event,item,innerItem,innerIndex)">
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
          <div class="remark-box">
            <span>备注</span>
              <van-field
                v-model="remarkContent"
                rows="2"
                maxlength="500"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </div>
        </div>
    </div>
    <div class="task-operation-box">
      <div class="task-complete" @click="btnClickEvent">{{ isAllCheck ? '提 交' : '保 存'}}</div>
    </div>
    <!-- 退出提示框   -->
    <div class="quit-info-box">
      <van-dialog v-model="quitInfoShow"  show-cancel-button width="85%"
          @confirm="quitSure" @cancel="quitCancel" confirm-button-text="是"
          cancel-button-text="否"
        >
          <div class="dialog-title">
            该检查单未填写完毕,是否要退出?
          </div>
          <div class="dialog-center">
            退出后您还可以再次进入进行填写，本次填写的内容将被保留，但未将检查项全部勾选之前您将无法完成该巡检任务 
          </div>
      </van-dialog>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { checkItemPass, checkItemNoPass, getIsHaveEventRegister, submitCheckItem} from '@/api/equipmentPatrol/escortManagement.js'
import _ from 'lodash';
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
export default {
  name: "EquipmentChecklist",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      loadingShow: false,
      isAllCheck: false,
      quitInfoShow: false,
      currentPatrolTaskDeviceChecklist: {},
      remarkContent: '',
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
    this.deviceReturn("/equipmentPatrolDetails");
    this.getCurrentDeviceCheckData();
    this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach(el => {
      el.checkItemClassifyContent.forEach((innerEl) => {
        innerEl.unfold = false
      })
    });
    this.judgeIsAllCheck()
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","patrolTaskDeviceChecklist","patrolTaskListMessage","devicePatrolDetailsSelectMessage","patrolTaskAbnormalRecordList","patrolTaskAbnormalCheckItemEventList"]),
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
    ...mapMutations(['changeEnterPatrolAbnormalRecordPageSource','changePatrolTaskListMessage','changePatrolTaskDeviceChecklist','changePatrolTaskAbnormalCheckItemEventList']),

    // 顶部导航左边点击事件
    onClickLeft () {
      if (this.judgeIsHasCheck()) {
        this.quitInfoShow = true
      } else {
        this.$router.push({path: '/equipmentPatrolDetails'})
      }
    },

    // 获取当前机器下的检查项数据
    getCurrentDeviceCheckData () {
      this.currentPatrolTaskDeviceChecklist =  _.cloneDeep(this.patrolTaskDeviceChecklist);
      this.remarkContent = this.currentPatrolTaskDeviceChecklist['remark'];
      let temporaryCheckItemListGroupByCheckType = this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'];
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'] = [];
      Object.keys(temporaryCheckItemListGroupByCheckType).forEach((item) => {
        this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].push({
          checkItemClassifyName: item,
          checkItemClassifyContent: temporaryCheckItemListGroupByCheckType[item]
        })
      });
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach((item) => {
        item['checkItemClassifyContent'].forEach((innerItem) => {
          innerItem['checkResult'] = innerItem['checkResult'].toString()
        })
      })
    },

    // 确定退出
    quitSure () {
      // 保存备注数据事件
      this.storeRemarkDataEvent();
      this.$router.push({path: '/equipmentPatrolDetails'})
    },

    // 取消退出
    quitCancel () {

    },

    // 判断检查项是否全部勾选完毕
    judgeIsAllCheck () {
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach((item) => {
        this.isAllCheck = !item['checkItemClassifyContent'].some((innerItem) => { return innerItem.checkResult == 0})
      })
    },

    // 判断检查项是否有勾选
    judgeIsHasCheck () {
      let flag = false;
      this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'].forEach((item) => {
        flag = item['checkItemClassifyContent'].some((innerItem) => { return innerItem.checkResult != 0})
      });
      return flag
    },

    // 检查项名称行点击事件
    checkItemNameRowCkickEvent (index,innerItem,innerIndex) {
      this.$nextTick(() => {
        this.$set(this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][index]['checkItemClassifyContent'][innerIndex], 'unfold',!this.currentPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][index]['checkItemClassifyContent'][innerIndex]['unfold'])
      });
      this.$forceUpdate()
    },

    // 判断该巡查项下是否有异常记录
    queryIsHaveEventRegister (event,item,innerItem,innerIndex) {
      // 有异常记录
      if (this.getData(innerItem)) {
        // 将检查结果保存到当前设备数据里(patrolTaskDeviceChecklist)
        let temporaryPatrolTaskDeviceChecklist = _.cloneDeep(this.patrolTaskDeviceChecklist);
        let temporaryIndexFour = temporaryPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][item['checkItemClassifyName']].findIndex((itemOther) => {
          return itemOther.resultId == innerItem['resultId']
        });
        // 将改检查项检查结果变为×(3)
        temporaryPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][item['checkItemClassifyName']][temporaryIndexFour]['checkResult'] = '3';
        this.changePatrolTaskDeviceChecklist(temporaryPatrolTaskDeviceChecklist);
        this.currentPatrolTaskDeviceChecklist =  _.cloneDeep(this.patrolTaskDeviceChecklist);
        this.getCurrentDeviceCheckData();
        this.$toast({
          type: 'fail',
          message: '该检查项下面有异常记录,把该检查项下登记的异常记录全部删除后,方能通过'
        })
      } else {
        if (!this.patrolTaskDeviceChecklist['isTaskComplete']) {
          this.storeExamineData(item,innerItem)
          this.changePatrolTaskAbnormalCheckItemEventList(innerItem)
        }
      }
    },

    // 获取该检查项下面的异常记录列表
    getData (innerItem) {
      let casuallyTemporaryStoragePatrolTaskAbnormalRecordList = this.patrolTaskAbnormalRecordList;
      let temporaryEventList = casuallyTemporaryStoragePatrolTaskAbnormalRecordList.filter((item) => { return item.showDate == this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
      item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == innerItem.typeId && 
      item.extendData.checkItemId == innerItem.itemId && item.checkResultId == innerItem.resultId
      });
      if (temporaryEventList.length > 0) {
        return true
      } else {
        return false
      }
    },

    // 保存选择的数据(选√还是×)
    storeExamineData (itemArguments,data) {
      let temporaryPatrolTaskListMessage =  _.cloneDeep(this.patrolTaskListMessage);
      let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate})[0]['content'];
      let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet})[0];
      let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite];
      let temporaryDataFour = temporaryDataShree.filter((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId})[0];
      let temporaryDataFive = temporaryDataFour['checkItemListGroupByCheckType'][itemArguments['checkItemClassifyName']];
      // 存储选中数据
      let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet});
      let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId});
      let temporaryIndexThree = temporaryDataFive.findIndex((item) => { return item['resultId'] == data['resultId']});
      temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['checkItemListGroupByCheckType'][itemArguments['checkItemClassifyName']][temporaryIndexThree]['checkResult'] = data['checkResult'].toString();
      let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate});
      temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
      // 将检查结果保存到整体数据(patrolTaskListMessage)
      this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage);
      // 将检查结果保存到当前设备数据里(patrolTaskDeviceChecklist)
      let temporaryPatrolTaskDeviceChecklist = _.cloneDeep(this.patrolTaskDeviceChecklist);
      let temporaryIndexFour = temporaryPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][itemArguments['checkItemClassifyName']].findIndex((item) => {
        return item.resultId == data['resultId']
      });
      temporaryPatrolTaskDeviceChecklist['checkItemListGroupByCheckType'][itemArguments['checkItemClassifyName']][temporaryIndexFour]['checkResult'] = data['checkResult'].toString();
      this.changePatrolTaskDeviceChecklist(temporaryPatrolTaskDeviceChecklist);
      this.judgeIsAllCheck()
    },

    // 通过事件
    passEvent (event,item,innerItem,innerIndex) {
      // 判断该巡查项下是否有登记事件
      this.queryIsHaveEventRegister(event,item,innerItem,innerIndex)
    },

    // 不通过事件
    noPassEvent (event,itemArguments,innerItem,innerIndex) {
      let temporaryPatrolTaskListMessage =  _.cloneDeep(this.patrolTaskListMessage);
      let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate})[0]['content'];
      let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet})[0];
      let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite];
      let temporaryDataFour = temporaryDataShree.filter((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId})[0];
      let temporaryDataFive = temporaryDataFour['checkItemListGroupByCheckType'][itemArguments['checkItemClassifyName']];
      // 存储选中数据
      let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet});
      let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId});
      let temporaryIndexThree = temporaryDataFive.findIndex((item) => { return item['resultId'] == innerItem['resultId']});
      let temporaryCheckResult = temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['checkItemListGroupByCheckType'][itemArguments['checkItemClassifyName']][temporaryIndexThree]['checkResult'];
      // 第一次点击X，直接进入异常记录表单填写页
      if (temporaryCheckResult == 0 || temporaryCheckResult == 1) {
        this.$router.push({path: '/patrolAbnormalRecord'})
      } else {
        // 第二次及以上再点击X，进入异常记录列表页
        this.$router.push({path: '/patrolAbnormalCheckItemEventList'})
      };
      if (!this.patrolTaskDeviceChecklist['isTaskComplete']) {
        this.storeExamineData(itemArguments,innerItem)
        this.changePatrolTaskAbnormalCheckItemEventList(innerItem)
      };
      this.changeEnterPatrolAbnormalRecordPageSource('/equipmentChecklist')
    },

    // 保存备注数据事件
    storeRemarkDataEvent () {
      let temporaryPatrolTaskListMessage =  _.cloneDeep(this.patrolTaskListMessage);
      let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate})[0]['content'];
      let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet})[0];
      let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite];
      // 存储选中数据
      let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet});
      let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId});
      temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['remark'] = this.remarkContent;
      let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate});
      temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
      this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage)
    },

    // 保存该设备下的检查数据
     storeCheckResultDataEvent (checkResultDtoList) {
      let temporaryPatrolTaskListMessage =  _.cloneDeep(this.patrolTaskListMessage);
      let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate})[0]['content'];
      let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet})[0];
      let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite];
      // 存储选中数据
      let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet});
      let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId});
      temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['checkResultDtoList'] = checkResultDtoList;
      // 为该设备添加是否全部勾选的字段,方便设备详情页判断该设备下的检查单是否可以提交
      temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['isAllCheck'] = true;
      // 为该设备添加是否修改字段,方便设备详情页判断该设备下的检查单是否可以再次提交
      temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['isHaveChanged'] = true;
      let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate});
      temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
      this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage);
      this.storeCheckAbnormalRecordDataEvent()
    },

    // 为每个检查项下的registerList字段添加该检查项下保存的异常记录
    storeCheckAbnormalRecordDataEvent () {
      let temporaryPatrolTaskListMessage =  _.cloneDeep(this.patrolTaskListMessage);
      let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate})[0]['content'];
      let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet})[0];
      let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite];
      // 存储选中数据
      let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.devicePatrolDetailsSelectMessage.selectTaskSet});
      let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == this.devicePatrolDetailsSelectMessage.deviceId});
      temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.devicePatrolDetailsSelectMessage.selectTime][this.devicePatrolDetailsSelectMessage.taskSite][temporaryIndexTwo]['checkResultDtoList'].forEach((item) => {
        item['registerList'] = this.getAbnormalListByCheckResultId(item.typeId,item.itemId,item.resultId)
      });
      let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == this.devicePatrolDetailsSelectMessage.showDate});
      temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
      this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage)
    },

    // 根据检查项Id查询该检查项下保存的异常记录
    getAbnormalListByCheckResultId (typeId,itemId,checkResultId) {
      let eventList = [];
      let casuallyTemporaryStoragePatrolTaskAbnormalRecordList = _.cloneDeep(this.patrolTaskAbnormalRecordList);
      let temporaryEventList = casuallyTemporaryStoragePatrolTaskAbnormalRecordList.filter((item) => { return item.showDate == this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
      item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == typeId && 
      item.extendData.checkItemId == itemId && item.checkResultId == checkResultId
      });
      if (temporaryEventList.length > 0) {
        eventList = temporaryEventList
      } else {
        eventList = []
      };
      return eventList
    },

    // 批量提交检查项事件
    batchSubmitCheckItemEvent () {
      // this.loadingShow = true;
      // this.overlayShow = true;
      // this.loadText = '提交中';
      let submitData = {
        taskId: this.patrolTaskDeviceChecklist.checkTaskId,
        deviceId: this.patrolTaskDeviceChecklist.deviceId,
        deviceName: this.patrolTaskDeviceChecklist.deviceName,
        norms: this.patrolTaskDeviceChecklist.norms,
        structId: this.patrolTaskDeviceChecklist.structId,
        structName: this.patrolTaskDeviceChecklist.structName,
        depId: this.patrolTaskDeviceChecklist.depId,
        depName: this.patrolTaskDeviceChecklist.depName,
        remark: this.remarkContent,
        collectId: this.devicePatrolDetailsSelectMessage.selectTaskSetId,
        proId: this.proId,
        system: 9,
        workerName: this.userName,
        deviceChecklistRemarkId: this.patrolTaskDeviceChecklist.deviceChecklistRemarkId,
        checkResultDtoList: []
      };
      // 拼接检查结果数据
      let mergeCheckData = [];
      this.currentPatrolTaskDeviceChecklist.checkItemListGroupByCheckType.forEach((item) => {
        item.checkItemClassifyContent.forEach((innerItem) => {
          mergeCheckData.push(innerItem)
        })
      });
      mergeCheckData.forEach((el) => {
        submitData['checkResultDtoList'].push({
          resultId: el.resultId,
          typeId: el.typeId,
          itemId: el.itemId,
          taskId: el.taskId,
          taskNumber: el.taskNumber,
          checkResult: el.checkResult,
          workerName: this.userName,
          registerList: []
        })
      });
      // 把检查结果数据和备注挂载到整体数据(patrolTaskListMessage)上,方便在设备巡检详情页面上传该设备下的巡检数据
      this.storeCheckResultDataEvent(submitData['checkResultDtoList'])
      // 拼接每个检查项下面保存的异常记录
      // submitCheckItem({resultId:innerItem.resultId,workerName: this.userName}).then((res) => {
      //   this.loadingShow = false;
      //   this.overlayShow = false;
      //   this.loadText = '';
      //   if (res && res.data.code == 200) {
      //     this.$toast({
      //       type: 'success',
      //       message: '反馈成功'
      //     })
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

    // 保存或提交事件
    btnClickEvent () {
      // 该设备所属的任务没有完成时才允许提交
      if (!this.patrolTaskDeviceChecklist['isTaskComplete']) {
        if (this.isAllCheck) {
          this.batchSubmitCheckItemEvent();
          this.storeRemarkDataEvent()
        } else {
          this.storeRemarkDataEvent()
        };
        this.$router.push({path: '/equipmentPatrolDetails'})
      } else {
        this.$toast({
          type: 'fail',
          message: '该设备所属任务已完成,不允许提交!'
        })
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
              border-bottom: 4px solid #f7f7f7;
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
                border-bottom: 4px solid #f7f7f7;
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
                    color: #101010;
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
                    color: #101010;
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
      };
      .remark-box {
        display: flex;
        background: #fff;
        padding: 8px;
        box-sizing: border-box;
        margin-top: 4px;
        > span {
          width: 40px;
          font-size: 14px;
          color: #101010
        };
        /deep/ .van-cell {
          flex: 1;
          background: #f5f5f5
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