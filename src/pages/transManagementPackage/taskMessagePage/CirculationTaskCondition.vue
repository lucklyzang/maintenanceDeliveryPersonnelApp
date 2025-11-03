<template>
 <div class="content-wrapper">
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="circulation-task-condition-title">
      <div class="content-middle-top-content">
        <div class="create-date">创建日期</div>
        <div class="date-wrapper">
          <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true" right-icon="newspaper-o"/>
        </div>
      </div>
      <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true">
        <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
          @cancel="startTimePop = false"  @confirm="confirmEvent"  @change="startTimeChange"/>
        </van-popup>
    </div>
    <div class="content-middle-content">
      <van-tabs v-model="activeName" @click="onClickTab" line-width="20px" :ellipsis="false">
        <van-tab name="0">
          <div slot="title">
            <span class="title">已完成</span>
            <span class="right-sign sign-not-in" v-show="currentIndex == 0">{{`(${taskCount})`}}</span>
          </div>
          <div class="wait-handle-list" :key="`${item}-${index}`" v-for="(item,index) in completedTasksList">
            <p class="wait-handle-message-createTime">
              创建时间 : {{item.createTime}}
            </p>
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span class="message-tit">开始时间 :</span>
                <span class="message-tit-real">{{item.startTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span>完成时间 : </span>
                <span>{{item.finishTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院 :</span>
                <span>{{item.proName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 :</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">任务名称 :</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">工作人员 :</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </div>
              <div class="handle-message-line-wrapper-other-two" :class="[item.show && item.spaces.length > 0 ? 'departmentWrapperOne': 'departmentWrapperTwo']" ref="departmentList">
                <p class="department-tit">
                  <span class="message-tit">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室 :</span>
                </p>
                <p class="department-list-omit" v-show="!item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem.name}}</span>
                </p>
                <p class="department-list-all" v-show="item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem.name}}</span>
                </p>
                <p class="department-drop" @click="viewOfficeHandle(item)" v-show="item.hasDepartments">{{!item.show ? '...[展开全部]' : '[收起]'}}</p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab name="1">
          <div slot="title">
            <span class="title">未完成</span>
            <span class="right-sign sign-in" v-show="currentIndex == 1">{{`(${taskCount})`}}</span>
          </div>
          <div class="wait-handle-list" :key="`${item}-${index}`" v-for="(item,index) in unfinishedTasksList">
            <p class="wait-handle-message-createTime">
              创建时间 : {{item.createTime}}
            </p>
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span class="message-tit">开始时间:</span>
                <span class="message-tit-real">{{item.startTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院 :</span>
                <span>{{item.proName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 :</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">任务名称 :</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">工作人员 :</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </div>
              <div class="handle-message-line-wrapper-other-two" :class="[item.show && item.spaces.length > 0 ? 'departmentWrapperOne': 'departmentWrapperTwo']" ref="departmentList">
                <p class="department-tit">
                  <span class="message-tit">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室 :</span>
                </p>
                <p class="department-list-omit" v-show="!item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-list-all" v-show="item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-drop" @click="viewOfficeHandle(item)" v-show="item.hasDepartments">{{!item.show ? '...[展开全部]' : '[收起]'}}</p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab  name="2">
          <div slot="title">
            <span class="title">已过期</span>
            <span class="right-sign sign-out" v-show="currentIndex == 2">{{`(${taskCount})`}}</span>
          </div>
          <div class="wait-handle-list" :key="`${item}-${index}`" v-for="(item,index) in expiredTasksList">
            <p class="wait-handle-message-createTime">
              创建时间 : {{item.createTime}}
            </p>
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span class="message-tit">开始时间 :</span>
                <span class="message-tit-real">{{item.startTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院 :</span>
                <span>{{item.proName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 :</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">任务名称 :</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">工作人员 :</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </div>
              <div class="handle-message-line-wrapper-other-two" :class="[item.show ? 'departmentWrapperOne': 'departmentWrapperTwo']" ref="departmentList">
                <p class="department-tit">
                  <span class="message-tit">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室 :</span>
                </p>
                <p class="department-list-omit" v-show="!item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-list-all" v-show="item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-drop" @click="viewOfficeHandle(item)" v-show="item.hasDepartments">{{!item.show ? '...[展开全部]' : '[收起]'}}</p>
              </div>
            </div>
          </div>
        </van-tab>
        <van-tab  name="3">
          <div slot="title">
            <span class="title">进行中</span>
            <span class="right-sign sign-finish" v-show="currentIndex == 3">{{`(${taskCount})`}}</span>
          </div>
          <div class="wait-handle-list" :key="`${item}-${index}`" v-for="(item,index) in inServiceTasksList">
            <p class="wait-handle-message-createTime">
              创建时间 : {{item.createTime}}
            </p>
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span class="message-tit">开始时间 :</span>
                <span class="message-tit-real">{{item.startTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院 :</span>
                <span>{{item.proName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 :</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">任务名称 :</span>
                <span class="message-tit-real">{{item.taskTypeName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">工作人员 :</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </div>
              <div class="handle-message-line-wrapper-other-two" :class="[item.show && item.spaces.length > 0 ? 'departmentWrapperOne': 'departmentWrapperTwo']" ref="departmentList">
                <p class="department-tit">
                  <span class="message-tit">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室 :</span>
                </p>
                <p class="department-list-omit" v-show="!item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-list-all" v-show="item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-drop" @click="viewOfficeHandle(item)" v-show="item.hasDepartments">{{!item.show ? '...[展开全部]' : '[收起]'}}</p>
              </div>
            </div>
          </div>
        </van-tab>
<!--        <span class="message-tit">循环频率:</span>-->
<!--        <span class="message-tit-real">{{item.circleRate}}</span>-->
        <van-tab  name="4" title-style="flex-basis: 35% !important">
          <div slot="title">
            <span class="title">循环配置</span>
            <span class="right-sign sign-finish" v-show="currentIndex == 4">{{`(${taskCount})`}}</span>
          </div>
          <div class="wait-handle-list" :key="`${item}-${index}`" v-for="(item,index) in circleSettingList">
            <p class="wait-handle-message-createTime">
              创建日期: {{item.modifyTime}}
            </p>
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message wait-handle-message-config">
              <div class="wait-handle-message-one">
                <span class="message-tit">开始时间 :</span>
                <span class="message-tit-real">{{item.circleStartTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">医&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;院 :</span>
                <span>{{item.proName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">循环频率 :</span>
                <span>{{item.circleRate}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 :</span>
                <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">任务名称 :</span>
                <span class="message-tit-real">{{item.circleName}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span class="message-tit">工作人员 :</span>
                <span class="message-tit-real">{{item.workerName}}</span>
              </div>
              <div class="handle-message-line-wrapper-other-two" :class="[item.show ? 'departmentWrapperOne': 'departmentWrapperTwo']" ref="departmentList">
                <p class="department-tit">
                  <span class="message-tit">科&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;室 :</span>
                </p>
                <p class="department-list-omit" v-show="!item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-list-all" v-show="item.show">
                  <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in JSON.parse(item.spaces)" :key="`${innerItem}-${innerindex}`">{{innerItem}}</span>
                </p>
                <p class="department-drop" @click="viewOfficeHandle(item)" v-show="item.hasDepartments">{{!item.show ? '...[展开全部]' : '[收起]'}}</p>
              </div>
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {getCirculationCondition} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { formatTime, setStore, getStore, IsPC  } from '@/common/js/utils'
export default {
  name: 'circulationTaskCondition',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      startTime: '',
      currentDateStart: new Date(),
      minDateStart: new Date(2020, 0, 1),
      startTimePop: false,
      leftDownShow: false,
      noDataShow: false,
      showLoadingHint: false,
      liIndex: null,
      taskCount: '',
      activeName: 0,
      currentIndex: 0,
      completedTasksList: [],
      unfinishedTasksList: [],
      expiredTasksList: [],
      inServiceTasksList: [],
      circleSettingList: [],
      noEndPng: require('@/common/images/home/no-end.png'),
      noReferPng: require('@/common/images/home/no-refer.png'),
      noStartPng: require('@/common/images/home/no-start.png'),
      taskFinshedPng: require('@/common/images/home/task-finshed.png'),
      taskGoingPng: require('@/common/images/home/task-going.png'),
      waitSurePng: require('@/common/images/home/wait-sure.png'),
      noAllotPng: require('@/common/images/home/no-allot.png'),
      taskDelayPng: require('@/common/images/home/task-delay.png')
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    Loading,
    FooterBottom
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.changeIsrefreshCirculationConnectPage(true);
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.initDate();
    this.queryCirculationTaskCondition({
      proId: this.proId,  //医院ID，必输
      workerId: this.workerId,   //运送员ID
      createTime: this.startTime
    },0)
  },

  computed:{
    ...mapGetters([
      'navTopTitle'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    workerId () {
      return JSON.parse(getStore('userInfo')).extendData.userId
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsrefreshCirculationConnectPage',
      'changeCatchComponent'
    ]),

     // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },

       // 任务优先级转换
      priorityTransfer (index) {
        switch(index) {
          case 1 :
            return '正常'
            break;
          case 2 :
            return '重要'
            break;
          case 3 :
            return '紧急'
            break;
          case 4 :
            return '紧急重要'
            break;
          default:
            return '无'
        }
      },

      // 任务状态转换
      stateTransfer (index) {
        switch(index) {
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
            break;
          case 5 :
            return '已延迟'
            break;
          case 6 :
            return '已取消'
            break;
          case 7 :
            return '已完成'
            break;
        }
      },

    // 任务状态转换图片
    stateTransferImg (index) {
      switch(index) {
        case 0 :
          return this.noAllotPng
          break
        case 1 :
          return this.noReferPng
          break;
        case 2 :
          return  this.noStartPng
          break;
        case 3 :
          return  this.taskGoingPng
          break;
        case 4 :
          return  this.noEndPng
          break;
        case 5 :
          return  this.taskDelayPng
          break;
        case 7 :
          return  this.taskFinshedPng
          break;
      }
    },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      startTimeChange(e) {
        let startTimeArr = e.getValues();//["2019", "03", "22", "17", "28"]
        this.startTime = `${startTimeArr[0]}-${startTimeArr[1]}-${startTimeArr[2]}`
      },

      // 初始化时间显示框
      initDate () {
        let currentDateList = formatTime('YYYY-MM-DD').split('-');
        this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
      },

      // 开始时间确定事件
      confirmEvent () {
        this.startTimePop = false;
        this.searchTask()
      },

      initData () {
        this.completedTasksList = [];
        this.unfinishedTasksList = [];
        this.expiredTasksList = [];
        this.inServiceTasksList = [];
        this.circleSettingList = [];
      },

      // 搜索任务
      searchTask () {
        this.activeName = 0;
        this.currentIndex = 0;
        this.queryCirculationTaskCondition ({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          createTime: this.startTime
        },0)
      },

      // 点击标签按钮事件
      onClickTab (name, title) {
        this.currentIndex = name;
        this.queryCirculationTaskCondition ({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          createTime: this.startTime
        },name)
      },

      // 查看科室事件
      viewOfficeHandle (item) {
        item.show = !item.show;
      },

      // 查询循环情况
      queryCirculationTaskCondition (data,index) {
        this.showLoadingHint = true;
        this.taskCount = 0;
        getCirculationCondition(data).then((res) => {
          this.initData();
          this.showLoadingHint = false;
          if (res && res.data.code == 200) {
            if (index == 0) {
              if (res.data.data.completedTasks != null && JSON.stringify(res.data.data.completedTasks) != "[]" ) {
                this.noDataShow = false;
                for (let item of res.data.data.completedTasks) {
                  if (item.hasAccess == "{}") {
                    item.hasAccess = '{"无":"无"}'
                    item.hasDepartments = false
                  } else {
                    item.hasDepartments = true
                  };
                  this.completedTasksList.push({
                    createTime: item.createTime,
                    startTime: item.startTime,
                    finishTime: item.finishTime,
                    proName: item.proName,
                    taskTypeName: item.taskTypeName,
                    workerName: item.workerName,
                    state: item.state,
                    priority: item.priority,
                    taskNumber: item.taskNumber,
                    spaces: item.hasAccess,
                    hasDepartments: item.hasDepartments,
                    id: item.id,
                    show: false
                  })
                };
                this.taskCount = this.completedTasksList.length;
                console.log('21212',this.completedTasksList);
              } else {
                this.taskCount = 0;
                this.noDataShow = true
              }
            } else if (index == 1 ) {
              if (res.data.data.unfinishedTasks != null && JSON.stringify(res.data.data.unfinishedTasks) != "[]") {
                this.noDataShow = false;
                for (let item of res.data.data.unfinishedTasks) {
                  if (item.hasAccess == "{}") {
                    item.hasAccess = '{"无":"无"}'
                    item.hasDepartments = false
                  } else {
                    item.hasDepartments = true
                  };
                  this.unfinishedTasksList.push({
                    createTime: item.createTime,
                    startTime: item.startTime,
                    finishTime: item.finishTime,
                    proName: item.proName,
                    taskTypeName: item.taskTypeName,
                    workerName: item.workerName,
                    state: item.state,
                    priority: item.priority,
                    taskNumber: item.taskNumber,
                    spaces: item.hasAccess,
                    hasDepartments: item.hasDepartments,
                    id: item.id,
                    show: false
                  })
                };
                this.taskCount = this.unfinishedTasksList.length
              } else {
                this.taskCount = 0;
                this.noDataShow = true
              }
            } else if (index == 2 ) {
              if (res.data.data.expiredTasks != null && JSON.stringify(res.data.data.expiredTasks) != "[]") {
                this.noDataShow = false;
                for (let item of res.data.data.expiredTasks) {
                  if (item.hasAccess == "{}") {
                    item.hasAccess = '{"无":"无"}'
                    item.hasDepartments = false
                  } else {
                    item.hasDepartments = true
                  };
                  this.expiredTasksList.push({
                    createTime: item.createTime,
                    startTime: item.startTime,
                    finishTime: item.finishTime,
                    proName: item.proName,
                    taskTypeName: item.taskTypeName,
                    workerName: item.workerName,
                    state: item.state,
                    priority: item.priority,
                    taskNumber: item.taskNumber,
                    spaces: item.hasAccess,
                    hasDepartments: item.hasDepartments,
                    id: item.id,
                    show: false
                  })
                };
                this.taskCount = this.expiredTasksList.length;
                console.log('配置',this.expiredTasksList);
              } else {
                this.taskCount = 0;
                this.noDataShow = true
              }
            } else if (index == 3 ) {
              if (res.data.data.inServiceTasks != null && JSON.stringify(res.data.data.inServiceTasks) != "[]") {
                this.noDataShow = false;
                for (let item of res.data.data.inServiceTasks) {
                  if (item.hasAccess == "{}") {
                    item.hasAccess = '{"无":"无"}'
                    item.hasDepartments = false
                  } else {
                    item.hasDepartments = true
                  };
                  this.inServiceTasksList.push({
                    createTime: item.createTime,
                    startTime: item.startTime,
                    finishTime: item.finishTime,
                    proName: item.proName,
                    taskTypeName: item.taskTypeName,
                    workerName: item.workerName,
                    state: item.state,
                    priority: item.priority,
                    taskNumber: item.taskNumber,
                    spaces: item.hasAccess,
                    hasDepartments: item.hasDepartments,
                    id: item.id,
                    show: false
                  })
                };
                this.taskCount = this.inServiceTasksList.length;
              } else {
                this.taskCount = 0;
                this.noDataShow = true
              }
            } else if (index == 4 ) {
              if (res.data.data.circleSettingList != null && JSON.stringify(res.data.data.circleSettingList) != "[]") {
                this.noDataShow = false;
                for (let item of res.data.data.circleSettingList) {
                  if (item.hasAccess == "{}") {
                    item.hasAccess = '{"无":"无"}'
                    item.hasDepartments = false
                  } else {
                    item.hasDepartments = true
                  };
                  this.circleSettingList.push({
                    modifyTime: item.modifyTime,
                    circleRate: item.circleRate,
                    circleStartTime: item.circleStartTime,
                    proName: item.proName,
                    circleRate: item.circleRate,
                    workerName: item.workerName,
                    state: item.state,
                    priority: item.priority,
                    circleName: item.circleName,
                    spaces: item.spaces,
                    hasDepartments: item.hasDepartments,
                    id: item.id,
                    show: false
                  });
                };
                this.taskCount = this.circleSettingList.length;
              } else {
                this.taskCount = 0;
                this.noDataShow = true
              }
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        })
        .catch((err) => {
          this.showLoadingHint = false;
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
            this.circulationTaskListShow = false;
            this.noDataShow = true;
          });
        })
      },

      // 返回上一页
      backTo () {
        this.changeIsrefreshCirculationConnectPage(true);
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      }
    }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    background: #f6f6f6;
    .content-wrapper();
    font-size: 14px;
    position: relative;
    .no-data {
      position: absolute;
      top: 200px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 260px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
    };
    .left-dropDown {
      .rightDropDown
    };
    .circulation-task-condition-title {
      background: #fff;
      padding: 10px 0;
      box-sizing: border-box;
      height: 60px;
      position: relative;
      /deep/ .van-cell {
        width: 100%;
        display: inline-block;
        padding: 10px 24px;
        border: 1px solid #d8d5d5;
        border-radius: 4px;
        line-height: 0;
      }
      .content-middle-top-content {
        position: absolute;
        left: 3.5%;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        width: 93%;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: space-between;
        .create-date {
          width: 90px;
          color: black;
          font-size: 16px
        }
        .date-wrapper {
          flex: 1;
         /deep/ .van-field {
           border: none;
           background: #f6f6f6
         }
        }
      }
    };
    .content-middle-content {
      flex:1;
      overflow: auto;
      /deep/ .van-tabs--line {
        .van-tabs__line {
          background-color: @color-theme;
        }
      };
      /deep/ .van-tabs {
        .title {
          margin-right: 4px;
        }
        .right-sign {
          .circulation-status-sign('','',0,'')
        };
        .van-tabs__nav {
          .van-tab {
            font-size: 18px;
            color: #b0b0b0 !important;
            flex-basis: 30% !important;
            &:last-child {
              flex-basis: 35% !important;
            }
          };
          .van-tab--active {
            color: black !important;
            font-weight: bold !important;
          }
        }
      };
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        box-sizing: border-box;
        width: 93%;
        margin:0 auto;
        .list-status {
          width: 80px;
          height: 30px;
          position: absolute;
          text-align: center;
          line-height: 30px;
          top: 60px;
          right: -12px;
          img {
            width: 100%;
            height: 100%
          }
        };
        .wait-handle-message-createTime {
          padding-left: 14px;
          background: #f6f6f6;
          height: 50px;
          line-height: 50px;
          font-size: 13px;
          color: #c7c7c7
        };
        .wait-handle-message-config {
          padding-top: 30px !important;
        };
        .wait-handle-message {
          font-size: 16px;
          padding: 14px;
          box-sizing: border-box;
          background: #fff;
          .wait-handle-message-top {
            height: 60px;
            border-left: 6px solid #2895ea;
            span {
              display: inline-block;
              width: 75%;
              padding-left: 5px;
              height: 28px;
              box-sizing: border-box;
              &:first-child {
                margin-bottom: 10px;
                overflow: auto
              }
            }
          };
          .departmentWrapperOne {
            height: auto;
            line-height: 35px;
          };
          .departmentWrapperTwo {
            height: 35px;
            line-height: 35px;
          }
          .handle-message-line-wrapper-other-two {
            display: flex;
            flex-flow: row now;
            > p {
              &:nth-child(2) {
                padding-left: 5px;
              }
            };
            .department-tit {
              width: 25%;
              span {
                color: #a0a0a0;
              }
            };
            .department-list-omit {
              flex: 1;
              overflow: hidden;
              span {
                color: black
              };
              .message-tit-real-destinationList {
                margin-right: 6px
              }
            };
            .department-list-all {
              flex: 1;
              span {
                color: black
              };
              .message-tit-real-destinationList {
                margin-right: 4px
              }
            };
            .department-drop {
              width: 30%;
              color: #3764a5;
            };
          };
          .wait-handle-message-one {
            height: 35px;
            line-height: 35px;
            overflow: auto;
            margin-left: -4px;
            span {
              display: inline-block;
              padding-left: 5px;
              box-sizing: border-box;
              color: #a0a0a0;
              &:first-child {
                vertical-align: top;
              };
              &:last-child {
                width: 70%;
                color: black;
              }
            };
            p {
              display: inline-block;
              span {
                color: black !important
              }
            }
          };
          .wait-handle-message-two {
            height: 35px;
            line-height: 35px;
            overflow: auto;
            margin-left: -4px;
            p {
              display: inline-block;
              padding-left: 5px;
              box-sizing: border-box;
              color: #a0a0a0;
              &:first-child {
                vertical-align: top;
              };
              &:last-child {
                width: 70%;
                color: black;
              }
            }
          }
        };
         .view-office {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 8px 6px;
          line-height: 14px;
          background: #2895ea;
          font-size: 14px;
          color: #fff;
          border-radius: 3px;
          box-sizing: border-box
        }
        .wait-handle-office-list {
          position: absolute;
          top: 54px;
          left: 0;
          width: 100%;
          max-height: 160px;
          overflow: auto;
          z-index: 100;
          ul {
            li {
              line-height: 30px;
              font-size: 18px;
              text-align: center;
              background: #fafafa;
              border-bottom: 1px solid #e9e9e9;
              color: #9b9b9b
            }
          }
        }
      }
    }
  }
</style>
