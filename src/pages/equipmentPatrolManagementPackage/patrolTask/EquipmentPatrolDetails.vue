<template>
  <div class="page-box" ref="wrapper">
    <div class="calendar-box" v-show="calendarShow">
        <div class="calendar-title">
            <span>请选择日期</span>
            <img :src="dateOtherIconPng" alt="">
        </div>
        <VueCalendar
            v-on:choseDay="clickDay"
            v-on:changeMonth="changeDate"
            v-on:isToday="clickToday"
            :disableClickDate="hasTaskDate"
            :showDate="showDate"
            :isDisabledSomeDayClick="true"
            :markDate="noCompleteTaskDateList"
        ></VueCalendar>
    </div>
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="设备巡检详情" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight" right-text="历史任务" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <div class="content-top">
                <div class="task-set-box">
                    <div class="task-set-name" :class="{'taskSetNameStyle': taskSetNameIndex == index }" v-for="(item,index) in allPatrolTaskDetailsData" :key="item.configId" @click="taskSetNameClickEvent(item,index)">
                        {{ item.configName }}
                    </div>
                </div>
                <div class="time-tab-box">
                    <div class="time-list-box">
                        <div class="time-list" :class="{'timetabStyle': timeTabIndex == index}" v-for="(item, index) in timeList" :key="item" @click="timeTabClickEvent(item,index)">{{ item }}</div>
                    </div>
                    <div class="calendar-icon">
                        <img :src="calendarPng" alt="" @click="dateClickEvent">
                    </div>
                </div>
            </div>
            <div class="task-content-box">
                <van-empty description="无巡检任务" v-if="isShowNoMoreData || allPatrolTaskDetailsData.length == 0" />
                <div class="backlog-task-list-box">
                    <div class="backlog-task-list" v-for="(item,index) in currentTaskList" :key="index">
                        <div class="backlog-task-top">
                            <div class="backlog-task-top-left">
                                <span>{{ item.taskSite }}</span>
                            </div>
                            <div class="backlog-task-top-right" @click="clockInEvent(item,index)">
                                <span :class="{'spanNoStartStyle': item.isClockIn == 0 }">{{ item.isClockIn == 0 ? '打卡' : '已打卡' }}</span>
                            </div>
                        </div>
                        <div class="backlog-task-content">
                            <div class="equipment-name-list" @click="equipmentChecklistEvent(item,innerItem,innerIndex)" v-for="(innerItem,innerIndex) in item.taskContentList" :key="innerIndex">
                                <div class="equipment-name" :class="{'equipmentNoCompleteStyle' : item.isClockIn == 1 && !innerItem.isAllCheck,'equipmentCompletedStyle':item.isClockIn == 1 && innerItem.isAllCheck}">
                                    {{ `${innerItem.deviceName} ${innerItem.norms}` }}
                                </div>
                                <div class="operation-icon-box">
                                    <img :src="innerItem.deviceUploadState == 1 ? uploadingGif : innerItem.deviceUploadState == 2 ? uploadingFailPng : innerItem.deviceUploadState == 3 ? uploadingSuccessPng : '' " @click.stop="againUploadEvent(item,innerItem,innerIndex)" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
            </div>
            <div class="complete-btn-box" v-if="!isShowNoMoreData && allPatrolTaskDetailsData.length > 0">
                <div class="complete-btn" :class="{'completeBtnStyle': isAllUpload}" @click="completeTaskEvent">完成任务</div>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {getPatrolTaskDetailsList, resetPatrolTaskCalendarData,patrolTaskPunchCard,submitCheckItem} from '@/api/equipmentPatrol/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
import _ from 'lodash';
import VueCalendar from '@/components/calendar/VueCalendar'
import { arrDateTimeSort, formatTime } from "@/common/js/utils";
export default {
  name: "EquipmentPatrolDetails",
  components: {
    NavBar,
    VueCalendar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      calendarShow: false,
      overlayShow: false,
      isAllUpload: true,
      showDate: this.getNowFormatDate(new Date(),'month'),
      currentTaskItemMessage: '',
      currentTaskSetId: '',
      timeTabIndex: 0,
      taskSetTime: '',
      taskSetName: '',
      taskSetNameIndex: 0,
      allPatrolTaskDetailsData: [],
      timeList: [],
      noCompleteTaskDateList: [],
      hasTaskDate: [],
      completeTaskDateList: [],
      currentTaskList: [],
      calendarPng: require("@/common/images/home/calendar-other.png"),
      totalCount: '',
      backlogTaskTimer: 0,
      isShowNoMoreData: false,
      completetedTaskTimer: 0,
      timeOne: null,
      timeTwo: null,
      activeName: '14:00',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      uploadingSuccessPng: require("@/common/images/home/uploading-success.png"),
      uploadingGif: require("@/common/images/home/uploading.gif"),
      dateOtherIconPng: require("@/common/images/home/date-other-icon.png"),
      uploadingFailPng: require("@/common/images/home/uploading-fail.png")
    }
  },

  mounted() {
    console.log('整体数据',formatTime('YYYY-MM-DD HH:mm:ss'));
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.changeDevicePatrolDetailsSelectMessage({});
        that.$router.push({path: '/home'})
      })
    };
    document.addEventListener('click',function(e){
        if(e.target.className == 'van-overlay'){
            me.calendarShow = false;
            me.overlayShow = false
        }
    });
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
        me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
        me.scanQRcodeCallbackCanceled();
    }
  },

  beforeDestroy () {
    if (this.timeOne) {
        clearTimeout(this.timeOne)
    };
    if (this.timeTwo) {
        clearTimeout(this.timeTwo)
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
        if (from.path == '/equipmentChecklist' || from.path == '/patrolTaskElectronicSignaturePage') {
            // 从设备检查单界面进来时,则判断是否有检查完需要上传的检查单
            if (from.path == '/patrolTaskElectronicSignaturePage') {
                let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(vm.patrolTaskListMessage);
                let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(vm.devicePatrolDetailsSelectMessage) == '{}' ? vm.getNowFormatDate(new Date(),'day') : vm.devicePatrolDetailsSelectMessage.showDate)});
                if (temporaryIndex != -1) {
                    // 处理初始展示数据
                    vm.disposeInitialData();
                    vm.judgeIsHaveNeedUploadCheckList();
                    vm.judgeCurrentTaskAllCheckIsUpload()
                }
            } else {
                // 处理初始展示数据
                vm.disposeInitialData();
                vm.judgeIsHaveNeedUploadCheckList();
                vm.judgeCurrentTaskAllCheckIsUpload()
            }
        } else {
            // 处理初始展示数据
            vm.disposeInitialData();
            if (vm.patrolTaskListMessage.length > 0) {
                vm.judgeIsHaveNeedUploadCheckList();
                vm.judgeCurrentTaskAllCheckIsUpload()
            }
        }
	});
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","devicePatrolDetailsSelectMessage","patrolTaskListMessage","patrolTaskDeviceChecklist"]),
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
    ...mapMutations(["changePatrolTaskListMessage","changePatrolTaskDeviceChecklist","changeDevicePatrolDetailsSelectMessage"]),

    clickDay(data) {
        let temporaryDevicePatrolDetailsSelectMessage =  _.cloneDeep(this.devicePatrolDetailsSelectMessage);
        temporaryDevicePatrolDetailsSelectMessage['showDate'] = this.getNowFormatDate(new Date(data),'day');
        this.changeDevicePatrolDetailsSelectMessage(temporaryDevicePatrolDetailsSelectMessage);
        this.queryPatrolTaskDetailsList(this.getNowFormatDate(new Date(data),'day'),true)
    },
    changeDate(data) {
       this.initCalendarData(this.getNowFormatDate(new Date(data),'month'))
    },
    clickToday(data) {
    },

    onClickLeft () {
        this.changeDevicePatrolDetailsSelectMessage({});
        this.$router.push({path: '/equipmentPatrolHome'})
    },
    // 上传视频
    previewFileOne() {
      let file = document.getElementById("demo1").files[0];
      this.temporaryFile = file;
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        console.log('视频',result)
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    onClickRight () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 处理初始展示数据
    disposeInitialData () {
        // 判断之前有无存过当前查询日期的任务，有存过就不再查询
        let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
        let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
        if (temporaryIndex == -1) {
            // 查询巡检任务详情
            if (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}') {
                this.queryPatrolTaskDetailsList(this.getNowFormatDate(new Date(),'day'),false)
            } else {
                this.queryPatrolTaskDetailsList(this.devicePatrolDetailsSelectMessage.showDate,false)
            }
        }  else {
            // 从store中取存储过的当前巡检任务信息
            this.allPatrolTaskDetailsData = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
            // 获取当前任务集的时间点集合,做升序处理
            this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
            this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
            this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
            this.echoSelectMessage();
            this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
            this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
            this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
            // 判断之前有没有存储选中的时间信息
            this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
            this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
            let currentTimeData = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime'][this.devicePatrolDetailsSelectMessage['selectTime'] ? this.devicePatrolDetailsSelectMessage['selectTime'] : this.disposeTime(this.timeList)];
            this.currentTaskList = [];
            Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
                taskSite: item,
                isClockIn: currentTimeData[item][0]['isClockIn'],
                taskContentList: currentTimeData[item]
            })})
        }  
    },

    // 判断当前任务集下的任务的检查单是否全部上传成功
    judgeCurrentTaskAllCheckIsUpload () {
        this.isAllUpload = true;
        for (let i = 0,len = this.currentTaskList.length;i<len;i++) {
            for (let innerI = 0,innerLen = this.currentTaskList[i]['taskContentList'].length;innerI<innerLen;innerI++) {
                if (!this.currentTaskList[i]['taskContentList'][innerI]['deviceUploadState'] || this.currentTaskList[i]['taskContentList'][innerI]['deviceUploadState'] == 1 || this.currentTaskList[i]['taskContentList'][innerI]['deviceUploadState'] == 2) {
                    this.isAllUpload = false
                    break
                }
            }
        }
    },

    // 判断是否有需要上传的检查单
    judgeIsHaveNeedUploadCheckList () {
        let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
        let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
        if (temporaryIndex == -1) { return };
        // 从store中取存储过的当前巡检任务信息
        this.allPatrolTaskDetailsData = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
        // 获取当前任务集的时间点集合,做升序处理
        this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
        this.echoSelectMessage();
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
        this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
        // 判断之前有没有存储选中的时间信息
        this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
        this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
        let currentTimeData = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime'][this.devicePatrolDetailsSelectMessage['selectTime'] ? this.devicePatrolDetailsSelectMessage['selectTime'] : this.disposeTime(this.timeList)];
        Object.keys(currentTimeData).forEach((item,index) => { 
            currentTimeData[item].forEach((innerItem,innerIndex) => {
                // 拼接上传的数据
                let submitData = {
                    taskId: this.patrolTaskDeviceChecklist.checkTaskId,
                    deviceId: innerItem.deviceId,
                    startTime: innerItem.startTime,
                    deviceName: innerItem.deviceName,
                    norms: innerItem.norms,
                    structId: innerItem.structId,
                    structName: innerItem.structName,
                    depId: innerItem.depId,
                    depName: innerItem.depName,
                    remark: innerItem.remark,
                    collectId: this.currentTaskSetId,
                    proId: this.proId,
                    system: 9,
                    workerName: this.userName,
                    deviceChecklistRemarkId: innerItem.deviceChecklistRemarkId,
                    checkResultDtoList: [],
                    allDevicesByCurrent: []
                };
                // 检查单都检查完毕、并且有修改、该设备所属的任务没有完成时才允许上传
                if (innerItem['isAllCheck'] && innerItem['isHaveChanged'] && !innerItem['isTaskComplete']) {
                    submitData['checkResultDtoList'] = innerItem['checkResultDtoList'];
                    submitData['allDevicesByCurrent'].push({
                        id: innerItem['deviceId'],
                        name: innerItem['deviceName'],
                        norms: innerItem['norms'],
                        depId: innerItem['depId'],
                        depName: innerItem['depName'],
                        structId: innerItem['structId'],
                        structName: innerItem['structName']
                    });
                    this.batchSubmitCheckItem(item,innerItem,submitData)  
                }
            })
        })
    },

    // 点击失败图标重新上传事件
    againUploadEvent (itemA,innerItemB,innerIndex) {
        if (innerItemB.deviceUploadState == 2) {
            let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
            let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
            // 获取当前任务集的时间点集合,做升序处理
            this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
            this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
            this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
            this.echoSelectMessage();
            this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
            this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
            this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
            // 判断之前有没有存储选中的时间信息
            this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
            this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
            let currentTimeData = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime'][this.devicePatrolDetailsSelectMessage['selectTime'] ? this.devicePatrolDetailsSelectMessage['selectTime'] : this.disposeTime(this.timeList)];
            currentTimeData[itemA['taskSite']].forEach((item) => {
                if (item.deviceId == innerItemB['deviceId']) {
                    // 拼接上传的数据
                    let submitData = {
                        taskId: innerItemB.checkTaskId,
                        deviceId: innerItemB.deviceId,
                        startTime: innerItemB.startTime,
                        deviceName: innerItemB.deviceName,
                        norms: innerItemB.norms,
                        structId: innerItemB.structId,
                        structName: innerItemB.structName,
                        depId: innerItemB.depId,
                        depName: innerItemB.depName,
                        remark: innerItemB.remark,
                        collectId: this.currentTaskSetId,
                        proId: this.proId,
                        system: 9,
                        workerName: this.userName,
                        deviceChecklistRemarkId: innerItemB.deviceChecklistRemarkId,
                        checkResultDtoList: [],
                        allDevicesByCurrent: []
                    };
                    submitData['checkResultDtoList'] = innerItemB['checkResultDtoList'];
                    submitData['allDevicesByCurrent'].push({
                        id: innerItemB['deviceId'],
                        name: innerItemB['deviceName'],
                        norms: innerItemB['norms'],
                        depId: innerItemB['depId'],
                        depName: innerItemB['depName'],
                        structId: innerItemB['structId'],
                        structName: innerItemB['structName']
                    });
                    this.batchSubmitCheckItem(itemA['taskSite'],innerItemB,submitData)  
                }
            })
        }
    },

    // 批量提交检查项
    batchSubmitCheckItem(item,innerItem,paramsData) {
        // 为当前设备设置上传状态deviceUploadState: 1-上传中 2-上传失败 3-上传成功
        // 获取当前任务集的时间点集合,做升序处理
        this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
        this.echoSelectMessage();
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
        this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
        // 判断之前有没有存储选中的时间信息
        this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
        this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
        let temporaryPatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
        let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
        let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)})[0]['content'];
        let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.taskSetName})[0];
        let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.taskSetTime][item];
        let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.taskSetName});
        let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == innerItem.deviceId});
        temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.taskSetTime][item][temporaryIndexTwo]['deviceUploadState'] = 1;
        temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
        this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage);
        this.getNeedTaskSetData();
		submitCheckItem(paramsData)
        .then((res) => {
            if (res && res.data.code == 200) {
                // 上传成功的设备，将其下的是否修改字段isHaveChanged改为false，防止下次没有修改修改检查结果或备注时，回到该界面或点击任务集和时间点切换后重复上传此设备检查单
                let temporaryPatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
                let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
                let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)})[0]['content'];
                let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.taskSetName})[0];
                let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.taskSetTime][item];
                let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.taskSetName});
                let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == innerItem.deviceId});
                temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.taskSetTime][item][temporaryIndexTwo]['deviceUploadState'] = 3;
                temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.taskSetTime][item][temporaryIndexTwo]['isHaveChanged'] = false;
                temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
                this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage);
                this.getNeedTaskSetData();
                this.judgeCurrentTaskAllCheckIsUpload();
             } else {
                this.$toast({
                    type: 'fail',
                    message: res.data.msg
                });
                let temporaryPatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
                let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
                let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)})[0]['content'];
                let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.taskSetName})[0];
                let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.taskSetTime][item];
                let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.taskSetName});
                let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == innerItem.deviceId});
                temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.taskSetTime][item][temporaryIndexTwo]['deviceUploadState'] = 2;
                temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
                this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage);
                this.getNeedTaskSetData()
             }
         })
        .catch((err) => {
            this.$toast({
                type: 'fail',
                message: err
            });
            let temporaryPatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
            let storeIndex = temporaryPatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
            let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)})[0]['content'];
            let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.taskSetName})[0];
            let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.taskSetTime][item];
            let temporaryIndexOne = temporaryDataOne.findIndex((item) => { return item['configName'] == this.taskSetName});
            let temporaryIndexTwo = temporaryDataShree.findIndex((item) => { return item['deviceId'] == innerItem.deviceId});
            temporaryDataOne[temporaryIndexOne]['deviceListByTime'][this.taskSetTime][item][temporaryIndexTwo]['deviceUploadState'] = 2;
            temporaryPatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
            this.changePatrolTaskListMessage(temporaryPatrolTaskListMessage);
            this.getNeedTaskSetData()
        })
    },

    // 任务集名称点击事件
    taskSetNameClickEvent (item,index) {
        this.taskSetNameIndex = index;
        this.taskSetName = item.configName;
        this.currentTaskList = [];
        this.currentTaskSetId = item.configId;
        // 获取当前任务集的时间点集合,做升序处理
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData.filter((innerItem) => { return innerItem.configId == item.configId })[0]['deviceListByTime']));
        // 显示离任务时间最近的时间点
        this.timeTabIndex = this.timeList.indexOf(this.disposeTime(this.timeList));
        this.taskSetTime = this.disposeTime(this.timeList);
        // 拼装当前时间段任务列表数据
        let currentTimeData = this.allPatrolTaskDetailsData.filter((innerItem) => { return innerItem.configId == item.configId })[0]['deviceListByTime'][this.disposeTime(this.timeList)];
        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
            taskSite: item,
            isClockIn: currentTimeData[item][0]['isClockIn'],
            taskContentList: currentTimeData[item]
        })});
        let temporaryDevicePatrolDetailsSelectMessage =  _.cloneDeep(this.devicePatrolDetailsSelectMessage);
        temporaryDevicePatrolDetailsSelectMessage['selectTaskSet'] = this.taskSetName;
        temporaryDevicePatrolDetailsSelectMessage['selectTaskSetId'] = this.currentTaskSetId;
        temporaryDevicePatrolDetailsSelectMessage['selectTime'] = this.taskSetTime;
        temporaryDevicePatrolDetailsSelectMessage['showDate'] = JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate;
        this.changeDevicePatrolDetailsSelectMessage(temporaryDevicePatrolDetailsSelectMessage);
        this.judgeCurrentTaskAllCheckIsUpload();
        this.judgeIsHaveNeedUploadCheckList()
    },

    // 时间tab切换事件
    timeTabClickEvent (item,index) {
        this.timeTabIndex = index;
        this.taskSetTime = item;
        this.currentTaskList = [];
        // 拼装当前时间段任务列表数据
        let currentTimeData = this.allPatrolTaskDetailsData.filter((innerItem) => { return innerItem.configId == this.currentTaskSetId })[0]['deviceListByTime'][item];
        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
            taskSite: item,
            isClockIn: currentTimeData[item][0]['isClockIn'],
            taskContentList: currentTimeData[item]
        })});
        let temporaryDevicePatrolDetailsSelectMessage =  _.cloneDeep(this.devicePatrolDetailsSelectMessage);
        temporaryDevicePatrolDetailsSelectMessage['selectTaskSet'] = this.taskSetName;
        temporaryDevicePatrolDetailsSelectMessage['selectTaskSetId'] = this.currentTaskSetId;
        temporaryDevicePatrolDetailsSelectMessage['selectTime'] = this.taskSetTime;
        temporaryDevicePatrolDetailsSelectMessage['showDate'] = JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate;
        this.changeDevicePatrolDetailsSelectMessage(temporaryDevicePatrolDetailsSelectMessage);
        this.judgeCurrentTaskAllCheckIsUpload();
        this.judgeIsHaveNeedUploadCheckList()
    },

    // 日期图标点击事件
    dateClickEvent () {
        let temporaryDate = JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate;
        this.showDate = this.getNowFormatDate(new Date(temporaryDate),'month');
        this.initCalendarData(this.getNowFormatDate(new Date(temporaryDate),'month'))
    },

    // 任务状态转换
    taskStatusTransition (num) {
        switch(num) {
            case 1 :
                return '未开始'
                break;
            case 2 :
                return '进行中'
                break;
            case 3 :
                return '待签字'
                break;
            case 4 :
                return '已完成'
                break;
        }
    },

    // 任务集类型转换
    taskSetTransition (num) {
        switch(num) {
            case '1' :
                return '每天'
                break;
            case '2' :
                return '每周'
                break;
            case '3' :
                return '工作日'
                break;
            case '4' :
                return '节假日和周末'
                break;
        }
    },

    echoSelectMessage () {
        this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
        this.timeTabIndex = this.timeList.indexOf(this.devicePatrolDetailsSelectMessage['selectTime']);
        this.showDate = this.devicePatrolDetailsSelectMessage['showDate']
    },

    // 存储后台查询的巡检任务
    storePatrolTaskMessage (messageContent) {
      let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
      if (casuallyTemporaryStoragePatrolTaskListMessage.length > 0 ) {
          let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
          if (temporaryIndex != -1) {
            casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['date'] = JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate;
            casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'] = messageContent
          } else {
            casuallyTemporaryStoragePatrolTaskListMessage.push({
               date: JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate,
               content: messageContent
            })
          }
        } else {
            casuallyTemporaryStoragePatrolTaskListMessage.push({
                date: JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate,
                content: messageContent
            })
      };
      this.changePatrolTaskListMessage(casuallyTemporaryStoragePatrolTaskListMessage)
    },

    // 获取巡检任务详情
    queryPatrolTaskDetailsList (queryDate,isClickDay) {
        this.loadingShow = true;
        this.overlayShow = true;
        this.calendarShow = false;
        this.isShowNoMoreData = false;
        this.currentTaskList = [];
        this.taskSetNameIndex = 0;
		getPatrolTaskDetailsList({ proId : this.proId, workerId: this.workerId,state:-1,system:9,queryDate })
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
                if (res.data.data.length > 0) {
                    // 存储查询的巡检任务
                    this.storePatrolTaskMessage(res.data.data);
                    console.log('巡检任务详情',this.patrolTaskListMessage);
                    let casuallyTemporaryStoragePatrolTaskListMessage = this.patrolTaskListMessage;
                    let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
                    this.allPatrolTaskDetailsData = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
                    // 获取初始任务集id
                    this.currentTaskSetId = this.allPatrolTaskDetailsData[0]['configId'];
                    this.taskSetName = this.allPatrolTaskDetailsData[0]['configName'];
                    // 判断之前是否保存有选中的信息
                    if ( JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}') {
                        // 获取当前任务集的时间点集合,做升序处理
                        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[0]['deviceListByTime']));
                        // 显示离任务时间最近的时间点
                        this.timeTabIndex = this.timeList.indexOf(this.disposeTime(this.timeList));
                        this.taskSetTime = this.disposeTime(this.timeList);
                        // 拼装当前时间段任务列表数据
                        let currentTimeData = this.allPatrolTaskDetailsData[0]['deviceListByTime'][this.disposeTime(this.timeList)];
                        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
                            taskSite: item,
                            isClockIn: currentTimeData[item][0]['isClockIn'],
                            taskContentList: currentTimeData[item]
                        })});
                        this.judgeIsHaveNeedUploadCheckList();
                        this.judgeCurrentTaskAllCheckIsUpload()
                    } else {
                        // 获取当前任务集的时间点集合,做升序处理
                        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
                        if (isClickDay) {
                            this.timeTabIndex = this.timeList.indexOf(this.disposeTime(this.timeList));
                            this.taskSetTime = this.disposeTime(this.timeList);
                            this.showDate = this.devicePatrolDetailsSelectMessage['showDate'];
                            let temporaryDevicePatrolDetailsSelectMessage =  _.cloneDeep(this.devicePatrolDetailsSelectMessage);
                            temporaryDevicePatrolDetailsSelectMessage['selectTaskSet'] = this.taskSetName;
                            temporaryDevicePatrolDetailsSelectMessage['selectTaskSetId'] = this.currentTaskSetId;
                            temporaryDevicePatrolDetailsSelectMessage['selectTime'] = this.disposeTime(this.timeList);
                            this.changeDevicePatrolDetailsSelectMessage(temporaryDevicePatrolDetailsSelectMessage);
                        } else {
                            this.echoSelectMessage();
                            // 回显存储之前选中的时间点
                            this.taskSetTime = this.timeList[this.timeTabIndex]
                        };
                        this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
                        this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
                        let currentTimeData = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime'][isClickDay ? this.taskSetTime : this.devicePatrolDetailsSelectMessage['selectTime']];
                        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
                            taskSite: item,
                            isClockIn: currentTimeData[item][0]['isClockIn'],
                            taskContentList: currentTimeData[item]
                        })});
                        this.judgeIsHaveNeedUploadCheckList();
                        this.judgeCurrentTaskAllCheckIsUpload()
                    }
                } else {
                    this.isShowNoMoreData = true
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
        this.isShowNoMoreData = false;
        this.overlayShow = false;
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    },

    // 点击日历时对每天数据进行初始化
    initCalendarData (queryTime) {
        this.loadingShow = true;
        this.overlayShow = true;
		resetPatrolTaskCalendarData({proId : this.proId, workerId: this.workerId,system:9,queryTime})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.noCompleteTaskDateList = [];
            this.completeTaskDateList = [];
            if (res && res.data.code == 200) {
                // 获取有未完成任务的日期
                Object.keys(res.data.data).forEach((item) => { if (res.data.data[item] == 1) { this.noCompleteTaskDateList.push(item)}});
                // 获取完成任务的日期
                Object.keys(res.data.data).forEach((item) => { if (res.data.data[item] == 0) { this.completeTaskDateList.push(item)}});
                this.hasTaskDate =  this.noCompleteTaskDateList.concat(this.completeTaskDateList);
                let temporaryHasTaskDate = [];
                for (let item of this.hasTaskDate) {
                    temporaryHasTaskDate.push(this.getNowFormatDateOther(new Date(item)))
                };
                this.hasTaskDate = temporaryHasTaskDate;
                this.calendarShow = true;
                this.overlayShow = true
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
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    },

    // 打卡事件
    clockInEvent (item,index) {
        // 0-未打卡 1-已打卡
        if (item.isClockIn == 1) { return };
        this.currentTaskItemMessage = item;
        this.scanQRCode()
    },

    // 扫描二维码方法
    scanQRCode () {
        window.android.scanQRcode()
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
        if (code) {
            let codeData = code.split('|');
            if (codeData.length > 0) {
                try {
                    // 判断当前扫码科室是否为任务科室
                    if (codeData[0] == this.currentTaskItemMessage['taskContentList'][0]['depId']) {
                        let temporaryData = {
                            taskId: this.currentTaskItemMessage['taskContentList'][0]['checkTaskId'],
                            workerId: this.workerId,
                            workerName: this.userName,
                            startTime: formatTime('YYYY-MM-DD HH:mm:ss'),
                            taskSite: this.currentTaskItemMessage['taskSite'],
                            deviceList: []
                        };
                        for (let item of this.currentTaskItemMessage['taskContentList']) {
                            temporaryData['deviceList'].push({
                                id: item.deviceId,
                                name: item.deviceName,
                                depId: item.depId,
                                depName: item.depName,
                                structId: item.structId,
                                structName: item.structName,
                                norms: item.norms
                            })
                        };
                        this.patrolTaskPunchCardEvent(temporaryData)
                    } else {
                        this.$dialog.alert({
                            message: '巡检区域与打卡区域不一致!'
                        }).then(() => {
                            this.scanQRCode()
                        })
                    }
                } catch (err) {
                    this.$toast({
                        message: `${err}`,
                        type: 'fail'
                    })
                }  
            } else {
                this.$dialog.alert({
                    message: '当前二维码数据格式不正确,请重新扫描!'
                }).then(() => {
                    this.scanQRCode()
                })
            }
        } else {
            this.$dialog.alert({
                message: '当前没有扫描到任何信息,请重新扫描!'
            }).then(() => {
                this.scanQRCode()
            })
        }
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
    },

    // 巡检任务打卡
    patrolTaskPunchCardEvent (data) {
    //     this.loadingShow = true;
    //     this.overlayShow = true;
	// 	patrolTaskPunchCard(data)
    //     .then((res) => {
    //         this.loadingShow = false;
    //         this.overlayShow = false;
    //         if (res && res.data.code == 200) {
               
    //         } else {
    //             this.$toast({
    //                 type: 'fail',
    //                 message: res.data.msg
    //             })
    //         }
    //   })
    //   .catch((err) => {
    //     this.loadingShow = false;
    //     this.overlayShow = false;
    //     this.$toast({
    //       type: 'fail',
    //       message: err
    //     })
    //   })
        // 此时为没网环境，直接在本地将该任务变更为已打卡
        this.alterationTaskClockStatus(data)
    },

    // 本地变更任务打卡状态
    alterationTaskClockStatus(data) {
        // 获取存储的任务整体数据
        let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
        let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
        this.allPatrolTaskDetailsData = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
        // 获取当前任务集的时间点集合,做升序处理
        this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
        this.echoSelectMessage();
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
        this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
        // 判断之前有没有存储选中的时间信息
        this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
        this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
        // 变更当前任务打卡状态为已打卡;
        let temporaryDataOne = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
        let temporaryDataTwo = temporaryDataOne[this.taskSetNameIndex]['deviceListByTime'][this.taskSetTime][data.taskSite];
        let temporaryDataThree = temporaryDataOne[this.taskSetNameIndex]['deviceListByTime'][this.taskSetTime];
        // 记录任务第一次打卡时间
        Object.keys(temporaryDataThree).forEach((item) => {
            temporaryDataThree[item].forEach((innerItem) => {
                if (!innerItem.startTime) {
                    innerItem.startTime = data.startTime
                }
            })
        });
        temporaryDataTwo.forEach((item) => {
            item.isClockIn = 1;
        });
        // 将变更任务打卡状态保存到本地
        let storeIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
        casuallyTemporaryStoragePatrolTaskListMessage[storeIndex]['content'] = temporaryDataOne;
        this.changePatrolTaskListMessage(casuallyTemporaryStoragePatrolTaskListMessage);
        this.getNeedTaskSetData()
    },

    // 获取任务集下需要展示的数据
    getNeedTaskSetData () {
        // 获取存储的任务整体数据
        let casuallyTemporaryStoragePatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
        let temporaryIndex = casuallyTemporaryStoragePatrolTaskListMessage.findIndex((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)});
        this.allPatrolTaskDetailsData = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
        // 获取当前任务集的时间点集合,做升序处理
        this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
        this.echoSelectMessage();
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
        this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
        // 判断之前有没有存储选中的时间信息
        this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
        this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
        // 处理当前展示的任务数据结构
        this.allPatrolTaskDetailsData = casuallyTemporaryStoragePatrolTaskListMessage[temporaryIndex]['content'];
        let currentTimeData = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime'][this.devicePatrolDetailsSelectMessage['selectTime'] ? this.devicePatrolDetailsSelectMessage['selectTime'] : this.disposeTime(this.timeList)];
        this.currentTaskList = [];
        Object.keys(currentTimeData).forEach((item) => { this.currentTaskList.push({
            taskSite: item,
            isClockIn: currentTimeData[item][0]['isClockIn'],
            taskContentList: currentTimeData[item]
        })})
    },

    // 获取当前日期(-)
    getNowFormatDate(currentDate,type) {
        let currentdate;
        let strDate;
        let seperator1 = "-";
        let month = currentDate.getMonth() + 1;
        strDate = currentDate.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        };
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        };
        if ( type == 'month') {
            currentdate = currentDate.getFullYear() + seperator1 + month
        } else {
            currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
        };
        return currentdate
    },

    // 获取当前日期(/)
    getNowFormatDateOther(currentDate) {
        let currentdate;
        let strDate;
        let seperator1 = "/";
        let month = currentDate.getMonth() + 1;
        strDate = currentDate.getDate();
        currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate
    },

    // 拼接完整时间
    getFullDate(hourTime) {
      let currentdate;
      let strDate;
      let seperator1 = "-";
      let month = new Date().getMonth() + 1;
      strDate = new Date().getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      };
      currentdate = new Date().getFullYear() + seperator1 + month + seperator1 + strDate
      return currentdate + ' ' + hourTime
    },

    // 获取当前离任务开始时间最近的时间点
    disposeTime (item) {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        if (item.length > 0) {
          let temporaryArr = [];
          if (item.length == 1) { temporaryArr.push(item[item.length-1]);return temporaryArr.join(',') };
          // 当当前时间大于或等于开始时间集合里最大的时间(时间集合的最后一位)时,就显示开始时间集合里最大的时间
          if (new Date().getTime() >= new Date(this.getFullDate(item[item.length-1])).getTime()) {
            temporaryArr.push(item[item.length-1])
          } else {        
            for (let i=0, len = item.length; i<len; i++) {
              if (i > 0) {
                if (new Date().getTime() < new Date(this.getFullDate(item[i])).getTime()) {
                  temporaryArr.push(item[i-1])
                  break
                }
              }    
            }
          };
          return temporaryArr.join(',')
        }
      }
    },

    // 点击进入设备检查单事件
    equipmentChecklistEvent (item,innerItem,innerIndex) {
        if (item.isClockIn == 0) { return };
        let temporaryDevicePatrolDetailsSelectMessage =  _.cloneDeep(this.devicePatrolDetailsSelectMessage);
        temporaryDevicePatrolDetailsSelectMessage['selectTaskSet'] = this.taskSetName;
        temporaryDevicePatrolDetailsSelectMessage['selectTaskSetId'] = this.currentTaskSetId;
        temporaryDevicePatrolDetailsSelectMessage['selectTime'] = this.taskSetTime;
        temporaryDevicePatrolDetailsSelectMessage['taskSite'] = item.taskSite;
        temporaryDevicePatrolDetailsSelectMessage['deviceId'] = innerItem['deviceId'];
        temporaryDevicePatrolDetailsSelectMessage['showDate'] = JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate;
        this.changeDevicePatrolDetailsSelectMessage(temporaryDevicePatrolDetailsSelectMessage);
        this.changePatrolTaskDeviceChecklist(innerItem);
        this.$router.push('/equipmentChecklist')
    },

    // 完成任务事件
    completeTaskEvent () {
        // 已经完成的任务不允许在次完成
        let isCanSubmit = true;
        this.taskSetNameIndex = this.allPatrolTaskDetailsData.indexOf(this.allPatrolTaskDetailsData.filter((item) => { return item.configName == this.devicePatrolDetailsSelectMessage['selectTaskSet']})[0]);
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.timeList = arrDateTimeSort(Object.keys(this.allPatrolTaskDetailsData[this.taskSetNameIndex]['deviceListByTime']));
        this.echoSelectMessage();
        this.taskSetNameIndex =  this.taskSetNameIndex == -1 ? 0 : this.taskSetNameIndex;
        this.currentTaskSetId = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configId'];
        this.taskSetName = this.allPatrolTaskDetailsData[this.taskSetNameIndex]['configName'];
        // 判断之前有没有存储选中的时间信息
        this.taskSetTime = this.timeTabIndex == -1 ? this.disposeTime(this.timeList) : this.timeList[this.timeTabIndex];
        this.timeTabIndex = this.timeList.indexOf(this.taskSetTime);
        let temporaryPatrolTaskListMessage = _.cloneDeep(this.patrolTaskListMessage);
        let temporaryDataOne = temporaryPatrolTaskListMessage.filter((item) => { return item.date == (JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate)})[0]['content'];
        let temporaryDataTwo = temporaryDataOne.filter((item) => { return item['configName'] == this.taskSetName})[0];
        let temporaryDataShree = temporaryDataTwo['deviceListByTime'][this.taskSetTime];
        Object.keys(temporaryDataShree).forEach((item) => { 
            for (let i = 0, len = temporaryDataShree[item].length; i<len; i++) {
                if (!temporaryDataShree[item][i]['isTaskComplete']) {
                    isCanSubmit = false;
                    break
                }
            }
        });
        if (isCanSubmit) {
            return  this.$toast({
                type: 'fail',
                message: '该任务集下当前时间点的任务已完成,不允许在次完成!'
            })
        };
        if (this.isAllUpload) {
            this.$router.push({
                path:'/patrolTaskElectronicSignaturePage',
                query: {
                    taskId : this.currentTaskList[0]['taskContentList'][0]['checkTaskId'],
                    date: JSON.stringify(this.devicePatrolDetailsSelectMessage) == '{}' ? this.getNowFormatDate(new Date(),'day') : this.devicePatrolDetailsSelectMessage.showDate
                }
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
  .calendar-box {
      position: absolute;
      z-index: 1000000;
      top: 20%;
      width: 90%;
      left: 50%;
      transform: translateX(-50%);
      .calendar-title {
        height: 35px;
        padding: 0 20px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        >span {
            font-size: 14px;
            color: #b3b3b3
        };
        >img {
            width: 16px
        }
      };
      /deep/ .wh_container {
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
        .content-top {
            .task-set-box {
                background: #fff;
                padding: 10px 14px 0 14px;
                box-sizing: border-box;
                align-items: flex-start;
                flex-wrap: nowrap;
                display: flex;
                overflow-x: auto;
                white-space: nowrap;
                &::-webkit-scrollbar {
                    height: 0;
                    display: none
                };
                .task-set-name {
                    font-size: 14px;
                    color: #9C9FA3;
                    flex: none;
                    padding: 6px 12px;
                    border: 1px solid #9C9FA3;
                    box-sizing: border-box;
                    margin-right: 10px;
                    border-radius: 4px
                }
            };
            .time-tab-box {
                display: flex;
                height: 45px;
                background: #fff;
                align-items: center;
                border-right: 1px solid #333;
                border-left: 1px solid #333;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                .bottom-border-1px(#BEC7D1);
                .time-list-box  {
                    flex: 1;
                    display: flex;
                    flex-wrap: nowrap;
                    height: 45px;
                    padding-left: 14px;
                    box-sizing: border-box;
                    align-items: center;
                    overflow-x: auto;
                    white-space: nowrap;
                    &::-webkit-scrollbar {
                        height: 0;
                        display: none
                    };
                    .time-list {
                        height: 45px;
                        padding: 0 6px;
                        box-sizing: border-box;
                        line-height: 45px;
                        margin-right: 20px;
                        font-size: 14px;
                        color: #101010;
                        flex-shrink: 0
                    };
                    .timetabStyle {
                        color: #0379FF;
                        border-bottom: 4px solid #0379FF
                    }
                };
                .calendar-icon {
                    width: 24px;
                    margin-right: 4px;
                    >img {
                        width: 100%
                    }
                }
            };
            .taskSetNameStyle {
                color: #0379FF !important;
                border: 1px solid #0379FF !important
            }
        };    
        .task-content-box {
            flex: 1;
            overflow: auto;
            padding: 12px 4px 0px 4px;
            box-sizing: border-box;
            background: #f7f7f7;
            position: relative;
            /deep/ .van-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 100%;
                transform: translate(-50%,-50%)
            };
            .backlog-task-list-box {
                .backlog-task-list {
                    padding: 0 0 4px 0;
                    box-sizing: border-box;
                    border-radius: 6px;
                    background: #fff;
                    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                    margin-bottom: 10px;
                    .backlog-task-top {
                        height: 40px;
                        padding: 0 14px;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        font-size: 16px;
                        color: #101010;
                        .bottom-border-1px(#a9a9a9);
                        .backlog-task-top-left {
                            flex: 1;
                            .no-wrap()
                        };
                        .backlog-task-top-right {
                            width: 70px;
                            font-size: 14px;
                            text-align: right;
                            span {
                                display: inline-block;
                                width: 62px;
                                height: 22px;
                                text-align: right;
                                line-height: 22px;
                                color: #289E8E;
                                border-radius: 6px
                            };
                            .spanNoStartStyle {
                                background: #0A7AF5 !important;
                                border-radius: 4px;
                                text-align: center !important;
                                color: #fff !important
                            }
                        }
                    };
                    .backlog-task-content {
                        position: relative;
                        padding: 10px 14px 8px 14px;
                        box-sizing: border-box;
                        .equipment-name-list {
                            display: flex;
                            align-items: center;
                            height: 30px;
                            margin-bottom: 10px;
                            .equipment-name {
                                height: 30px;
                                line-height: 30px;
                                padding: 0 8px;
                                box-sizing: border-box;
                                background: #DCDCDC;
                                border-radius: 6px;
                                font-size: 12px;
                                color: #101010;
                                flex: 1;
                                margin-right: 6px;
                            };
                            .equipmentNoCompleteStyle {
                                background: #F8CFAD
                            };
                            .equipmentCompletedStyle {
                                background: #C5E5E0
                            };
                            .operation-icon-box {
                                width: 70px;
                                text-align: left;
                                img {
                                    width: 21px
                                }
                            };
                            &:last-child {
                                margin-bottom: 0
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
        };
        .complete-btn-box {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            .complete-btn {
                width: 60%;
                height: 45px;
                text-align: center;
                line-height: 45px;
                font-size: 12px;
                color: #333;
                background: #DCDCDC;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                border-radius: 20px
            };
            .completeBtnStyle {
                background: linear-gradient(to right, #6cd2f8, #2390fe) !important;
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1) !important;
                color: #fff !important
            }
        }
    }
  }
}
</style>