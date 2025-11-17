<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow" z-index="100000" />
    <van-loading size="35px" vertical color="#e6e6e6" v-show="showLoadingHint">{{loadingContent}}</van-loading>
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon> -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="circultion-task-title">
      <div class="task-line-one-wrapper">
        <ul class="task-line-one">
          <li :class="{'taskLineOneStyle':taskLlineOneIndex == index}" :key="index" v-for="(item,index) in taskOneList" @click="taskLineOneEvent(item, index)">{{item}}</li>
        </ul>
      </div>
      <div class="status-box" v-show="taskQueryShow == false">
        <p class="task-line-two">
          <span class="state-filter-span">
            状态筛选
          </span>
         </p>
         <p class="status-name-box">
           <van-field v-model="stateScreenVal" readonly  :right-icon="stateListShow == true ? 'arrow-up' : 'arrow-down'" @click="stateListShow = true"/>
           <van-popup v-model="stateListShow" position="bottom">
             <van-picker
               show-toolbar
               :columns="stateList"
               @cancel="stateListShow = false"
               @confirm="onConfirm"
             />
           </van-popup>
        </p>
      </div>
    </div>
    <van-pull-refresh class="circulation-task-list-box"  v-model="isRefresh" @refresh="onRefresh" success-text="刷新成功">
      <div class="circulation-task-list" v-show="stateIndex == -1 && circulationTaskListShow">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="`${indexWrapper}-${item}`">
          <p class="list-status">
            <img :src="stateTransferImg(item.state)" alt="">
          </p>
          <div class="wait-handle-message">
            <div class="wait-handle-message-one">
              <span>任务名称 : </span>
              <span>{{item.taskTypeName}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span>开始时间 : </span>
              <span>{{item.startTime}}</span>
            </div>
          </div>
          <p class="get-wait-task">
            <span @click.stop="startTask(item)">
                进入任务
            </span>
          </p>
        </div>
      </div>
      <div class="circulation-task-list" v-show="stateIndex == 2 && circulationTaskListShow">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="`${indexWrapper}-${item}`">
          <p class="list-status">
            <img :src="stateTransferImg(item.state)" alt="">
          </p>
          <div class="wait-handle-message">
            <div class="wait-handle-message-one">
              <span>任务名称 : </span>
              <span>{{item.taskTypeName}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span>开始时间 : </span>
              <span>{{item.startTime}}</span>
            </div>
          </div>
          <p class="get-wait-task">
            <span @click.stop="startTask(item)">
                进入任务
            </span>
          </p>
        </div>
      </div>
      <div class="circulation-task-list" v-show="stateIndex == 3 && circulationTaskListShow">
        <div class="wait-handle-list" v-for="(item,indexWrapper) in circulationTaskList" :key="`${indexWrapper}-${item}`">
          <p class="list-status">
            <img :src="stateTransferImg(item.state)" alt="">
          </p>
          <div class="wait-handle-message">
            <div class="wait-handle-message-one">
              <span>任务名称 : </span>
              <span>{{item.taskTypeName}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span>开始时间 : </span>
              <span>{{item.startTime}}</span>
            </div>
          </div>
          <p class="get-wait-task">
            <span @click.stop="startTask(item)">
                进入任务
            </span>
          </p>
        </div>
      </div>
      <div class="circulation-task-list" style="margin-top:10px">
        <div class="wait-handle-list"  v-show="taskQueryShow && circulationTaskListShow" v-for="(item,indexWrapper) in circulationTaskList" :key="`${indexWrapper}-${item}`">
          <p class="list-status">
            <img :src="stateTransferImg(item.state)" alt="">
          </p>
          <div class="wait-handle-message">
            <div class="wait-handle-message-one">
              <span>任务名称 : </span>
              <span>{{item.taskTypeName}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span>开始时间 : </span>
              <span>{{item.startTime}}</span>
            </div>
          </div>
          <p class="get-wait-task">
            <span @click.stop="startTask(item)">
                进入任务
            </span>
          </p>
        </div>
      </div>
    </van-pull-refresh>
    <div class="circultion-task-btn">
      <p class="circultion-task-btn-bottom">
        <span @click="circulationConditionEvent">循环情况</span>
      </p>
    </div>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {userSignOut} from '@/api/login.js'
  import store from '@/store'
  import {queryCirculationTask} from '@/api/trans/workerPort.js'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import { mapGetters, mapMutations } from 'vuex'
  import { setStore, getStore, IsPC, removeBlock,  compareDateTime, removeAllLocalStorage } from '@/common/js/utils'
  let windowTimer
  export default {
    name: 'circulationTask',
    data () {
      return {
        showLoadingHint: false,
        loadingContent: '加载中,请稍候···',
        overlayShow: false,
        statusScreen: false,
        taskQueryShow: false,
        noDataShow: false,
        stateIndex: -1,
        stateListShow: false,
        taskListBoxShow: true,
        isRefresh: false,
        stateScreenVal: '全部',
        taskLlineOneIndex: '0',
        activeNames: [],
        taskOneList: ['待办任务', '历史任务'],
        stateList: ['全部','未开始','进行中'],
        circulationTaskListShow: false,
        leftDropdownDataList: ['退出登录'],
        leftDownShow: false,
        liIndex: null,
        circulationTaskList: [],
        drawCompleteTaskIdList: [],
        currentOfficeName: '',
        taskConditionPng: require('@/components/images/task-condition.png'),
        taskArrivedPng: require('@/components/images/task-arrived.png'),
        noEndPng: require('@/common/images/home/no-end.png'),
        noReferPng: require('@/common/images/home/no-refer.png'),
        noStartPng: require('@/common/images/home/no-start.png'),
        taskFinshedPng: require('@/common/images/home/task-finshed.png'),
        taskGoingPng: require('@/common/images/home/task-going.png'),
        waitSurePng: require('@/common/images/home/wait-sure.png')
      };
    },

    components: {
      HeaderTop,
      NoData,
      Loading,
      FooterBottom
    },

    computed: {
      ...mapGetters([
        'navTopTitle',
        'completeDeparnmentInfo',
        'globalTimer',
        'isFreshCirculationTaskPage',
        'userInfo',
        'catch_components',
        'circulationDetails',
        'isNewCircle',
        'chooseHospitalArea',
        'projectGlobalTimer',
        'globalTimer',
        'equipmentPatrolGlobalTimer',
        'securityPatrolGlobalTimer'
      ]),
      sex () {
        return this.userInfo['worker']['extendData']['sex']
      },
      workerName() {
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

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'transHome'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送')
        })
      };
      // document.addEventListener('click', (e) => {
      //   if(e.target.className!='status-name'){
      //     this.stateListShow = false;
      //   };
      //   if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
      //     this.leftDownShow = false;
      //   }
      // });
      // 轮询是否有新任务
      windowTimer = window.setInterval(() => {
        setTimeout(
        this.getCirculationTask({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        }, this.stateIndex), 0)
        }, 600000);
        this.getCirculationTask({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        }, this.stateIndex);
        this.drawTaskId();
    },

    activated () {
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
           this.$router.push({path: 'transHome'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送')
        })
      };
      // document.addEventListener('click', (e) => {
      //   if(e.target.className!='status-name'){
      //     this.stateListShow = false;
      //   };
      //   if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
      //     this.leftDownShow = false;
      //   }
      // });
      // 轮询是否有新任务
      windowTimer = window.setInterval(() => {
        setTimeout(
        this.getCirculationTask({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        }, this.stateIndex), 0)
      }, 600000);
      if (this.isFreshCirculationTaskPage) {
        this.getCirculationTask({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        },this.stateIndex);
      };
      this.drawTaskId();
    },

    beforeDestroy() {
      if(windowTimer) {window.clearInterval(windowTimer)}
    },

    beforeRouteEnter (to, from, next){
      let catch_components = store.state.catchComponent.catch_components;
      let i = catch_components.indexOf('circulationTask');
      i === -1 && catch_components.push('circulationTask');
      next();
    },

    beforeRouteLeave(to, from, next) {
      let catch_components = this.catch_components;
      if (to.name !== 'circulationDetails'){
        let i = catch_components.indexOf('circulationTask');
        i > -1 && this.changeCatchComponent([]);
      }
      next()
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeIsCollectEnterSweepCodePage',
        'changeStipulateOfficeList',
        'changeArriveDepartmentId',
        'changeTaskDetailsMessage',
        'changeTaskType',
        'changeCirculationDetails',
        'changeOverDueWay',
        'changeCirculationTaskId',
        'changeCatchComponent'
      ]),

      // 用户签退
      userLoginOut (proId,workerId) {
        this.showLoadingHint = true;
        this.loadingContent = '签退中,请稍候···';
        this.overlayShow = true;
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            if(this.globalTimer) {window.clearInterval(this.globalTimer)};
            // 退出信标服务器连接
            // try {
            //   window.android.logOut()
            // } catch (err) {
            //   this.$dialog.alert({
            //     message: `${err}`,
            //     closeOnPopstate: true
            //   }).then(() => {
            //   })
            // };
            if(this.projectGlobalTimer) {window.clearInterval(this.projectGlobalTimer)};
						if(this.globalTimer) {window.clearInterval(this.globalTimer)};
						if(this.equipmentPatrolGlobalTimer) {window.clearInterval(this.equipmentPatrolGlobalTimer)};
						if(this.securityPatrolGlobalTimer) {window.clearInterval(this.securityPatrolGlobalTimer)};
						removeAllLocalStorage();
						store.dispatch('resetAutoRepairTaskStore');
						store.dispatch('resetLoginState');
						store.dispatch('resetCleanManagementStore');
						store.dispatch('resetEquipmentPatroLoginStateEvent');
						store.dispatch('resetPatrolTaskStore');
						store.dispatch('resetSpotCheckTaskStore');
						store.dispatch('resetSpotTaskDispatchingManagementStore');
						store.dispatch('resetDepartmentServiceStateEvent');
						store.dispatch('resetDeviceServiceStateEvent');
						store.dispatch('resetRepairsWorkOrderStateEvent');
						store.dispatch('resetTaskSchedulingStateEvent');
						store.dispatch('resetTransAppointTaskStateEvent');
						store.dispatch('resetTransCatchComponentsStateEvent');
						store.dispatch('resetTransCirculationTaskStateEvent');
						store.dispatch('resetTransDispatchTaskStateEvent');
						store.dispatch('resetTransMedicalTaskStateEvent');
						store.dispatch('resetTransTaskSchedulingStateEvent');
						store.dispatch('resetTransTransLoginStateEvent');
						store.dispatch('resetRegisterStore');
						store.dispatch('resetGuestbookStore');
						store.dispatch('resetSecurityPatrolLoginState');
						store.dispatch('resetSecurityPatrolTaskStore');
            this.changeCatchComponent([]);
            this.$router.push({path:'/'})
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.changeOverDueWay(false);
            setStore('storeOverDueWay',false);
          }
        }).
        catch((err) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        this.userLoginOut(this.proId, this.workerName)
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
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
      stateTransfernumber (item) {
        switch(item) {
          case '全部' :
            return -1
            break;
          case '未开始' :
            return 2
            break;
          case '进行中' :
            return 3
            break;
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
          case 7 :
            return  this.taskFinshedPng
            break;
        }
      },

      // 历史任务点击事件
      itemClick (item) {
        this.$router.push({'path':'/taskDetailsMessage'});
        this.changeTitleTxt({tit:'历史任务详情'});
        setStore('currentTitle','历史任务详情');
        this.changeTaskDetailsMessage(item);
        this.changeTaskType('循环任务')
      },

      // 循环任务第一行按钮点击
      taskLineOneEvent (item,index) {
        this.statusScreen = false;
        this.taskLlineOneIndex = index;
        this.noDataShow = false;
        if (index == '0') {
          this.stateIndex = -1;
          this.taskQueryShow = false;
          this.stateScreenVal = '全部';
          this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            states: [], //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          }, this.stateIndex);
        } else if (index == '1') {
            this.stateIndex = null;
            this.taskQueryShow = true;
            this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            state: 7, //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          },7)
        }
      },

      // 状态筛选列表点击
      stateListEvent (index) {
        this.stateIndex = index;
        this.getCirculationTask ({
          proId: this.proId,  //医院ID，必输
          workerId: this.workerId,   //运送员ID
          states: [], //查询状态
          startDate: '',  //起始日期  YYYY-MM-dd
          endDate: ''  //终止日期  格式 YYYY-MM-dd
        }, index)
      },

      // 状态框确定事件
      onConfirm(value) {
        this.stateScreenVal = value;
        this.stateListShow = false;
        this.stateIndex = this.stateTransfernumber(value);
        this.stateListEvent(this.stateIndex)
      },

      // 开始任务
      startTask (item) {
        if (item.state == 7 && this.isNewCircle) {
          this.changeCirculationTaskId(item.id);
          this.changeCirculationDetails(item);
          this.$router.push({path:'/newCirculationTaskHistoryDetails'});
          this.changeTitleTxt({tit:'任务详情'});
          setStore('currentTitle','任务详情');
          return
        };
        // 判断上个任务是否完成或超时
        let currentItemIndex = this.circulationTaskList.indexOf(item);
        if (currentItemIndex != 0) {
          let innerIndex = currentItemIndex - 1,
              conditionOne = !this.circulationTaskList[innerIndex]['spaces'].every((item) => {return item.check == true}),
              conditionTwo = compareDateTime(`${new Date().getHours()}:${new Date().getMinutes()}`,item.startTime),
              conditionFour = compareDateTime(this.circulationTaskList[innerIndex]['startTime'],item.startTime);
              let timeOne = new Date(item.createTime).getTime(),
                  timeTwo = new Date(this.circulationTaskList[innerIndex]['createTime']).getTime(),
                  conditionThree = timeOne == timeTwo;
          if (conditionThree) {
            if (conditionOne) {
              if (conditionTwo) {
                if (item.state !== 7) {
                  this.$dialog.alert({
                    message: '请先完成该循环任务上一时间段的任务',
                    closeOnPopstate: true
                  }).then(() => {
                  });
                  return
                }
              }
            }
          } else {
            if (conditionOne) {
              if (conditionFour) {
                if (item.state !== 7) {
                  this.$dialog.alert({
                    message: '请先完成该循环任务上一时间段的任务',
                    closeOnPopstate: true
                  }).then(() => {
                  });
                  return
                }
              }
            }
          }
        };
        this.changeCirculationTaskId(item.id);
        this.$router.push({'path':'/circulationDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情');
        this.changeCirculationDetails(item)
      },

      // 提取存储已完成采集任务科室所属任务id
      drawTaskId () {
        this.drawCompleteTaskIdList = [];
        if (this.completeDeparnmentInfo.length > 0) {
          for (let item of this.completeDeparnmentInfo) {
            for (let innerItem in item) {
              if (innerItem == 'taskId') {
                this.drawCompleteTaskIdList.push(item[innerItem])
              }
            }
          }
        }
      },

      // 查询循环任务
      getCirculationTask (data,index) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        this.loadingContent = '加载中,请稍候···';
        this.overlayShow = true;
        queryCirculationTask(data).then((res) => {
          if (!res['headers']['token']) {
            if(windowTimer) {window.clearInterval(windowTimer)}
          };
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false;
          this.circulationTaskList = [];
          let temporaryTaskListFirst = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.circulationTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
                temporaryTaskListFirst.push({
                  createTime: item.createTime,
                  startTime: item.startTime,
                  proName: item.proName,
                  officeName: item.proName,
                  taskTypeName: item.taskTypeName,
                  workerName: item.workerName,
                  state: item.state,
                  priority: item.priority,
                  taskNumber: item.taskNumber,
                  finishTime: item.finishTime,
                  spaces: item.spaces,
                  id: item.id,
                  show: false,
                  check: false,
                  startUpTime: item.startUpTime
                })
              };
              if (this.stateIndex !== null) {
                if (index == -1) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state !== 7});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  };
                } else if (index == 2) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state == 2});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  }
                } else if (index == 3) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state == 3});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  }
                }
              } else if (this.taskQueryShow) {
                 if (index == 7) {
                  this.circulationTaskList = temporaryTaskListFirst.filter((item) => { return item.state == 7});
                  if (this.circulationTaskList.length == 0) {
                    this.noDataShow = true;
                    return
                  }
                }
              }
              // 改变科室列表数据结构
              for (let item = 0, len = this.circulationTaskList.length; item < len; item++) {
                let temporaryArrayTwo = [];
                for (let innerItem in this.circulationTaskList[item]) {
                  if (innerItem == 'spaces') {
                    let temporaryArrayTwo = [];
                    let temporaryItem = removeBlock(this.circulationTaskList[item][innerItem]).split(",");
                    let temporaryArrayOne = [];
                    for (let kip of temporaryItem) {
                      temporaryArrayOne = [];
                      temporaryArrayOne = kip.replace(/\"/g, "").split(':');
                      temporaryArrayTwo.push({text: temporaryArrayOne[1], value: temporaryArrayOne[0]});
                    }
                    this.circulationTaskList[item]['spaces'] = temporaryArrayTwo;
                  };
                }
              };
              // 科室列表增加字段
              for (let item of this.circulationTaskList) {
                for (let innerItem in item) {
                  if (innerItem == 'spaces') {
                    for (let medicalItem of item[innerItem]) {
                      medicalItem['check'] = false
                    }
                  }
                }
              };
              // 为完成采集的科室增加标记
              if (this.completeDeparnmentInfo.length > 0) {
                for (let w = 0, wLen = this.completeDeparnmentInfo.length; w < wLen; w++) {
                  if (this.circulationTaskList.length > 0) {
                     for (let n = 0, nLen = this.circulationTaskList.length; n < nLen; n++) {
                      if (this.circulationTaskList[n]['id'] == this.completeDeparnmentInfo[w]['taskId']) {
                        if (this.completeDeparnmentInfo[w]['departmentIdList'].length > 0) {
                          for (let i = 0, len1 = this.completeDeparnmentInfo[w]['departmentIdList'].length; i < len1; i++) {
                            if (this.circulationTaskList[n]['spaces'].length > 0) {
                              for (let j = 0, len2 = this.circulationTaskList[n]['spaces'].length; j < len2; j++) {
                                if (this.circulationTaskList[n]['spaces'][j]['value'] == this.completeDeparnmentInfo[w]['departmentIdList'][i]) {
                                  this.circulationTaskList[n]['spaces'][j]['check'] = true
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            } else {
              this.circulationTaskListShow = false;
              this.noDataShow = true
            }
          } else {
            if (!res) {return};
            if (res.headers.hasOwnProperty('offline')) {return};
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.circulationTaskListShow = false;
            this.noDataShow = true;
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.circulationTaskListShow = false;
          this.noDataShow = true;
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false
        });
      },

      // 下拉刷新
      onRefresh () {
        if (!this.taskQueryShow) {
          this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            states: [], //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          }, this.stateIndex)
        } else {
           this.getCirculationTask({
            proId: this.proId,  //医院ID，必输
            workerId: this.workerId,   //运送员ID
            state: 7, //查询状态
            startDate: '',  //起始日期  YYYY-MM-dd
            endDate: ''  //终止日期  格式 YYYY-MM-dd
          }, 7)
        }
      },

      // 返回上一页
      backTo () {
         this.$router.push({path: 'transHome'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 循环情况事件
      circulationConditionEvent () {
        this.$router.push({path: 'circulationTaskCondition'});
        this.changeTitleTxt({tit:'循环情况'});
        setStore('currentTitle','循环情况')
      }
    }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    /deep/ .van-loading {
      z-index: 200000
    };
    .content-wrapper();
    position: relative;
    font-size: 14px;
    .left-dropDown {
      .rightDropDown
    }
    .no-data {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2000;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2000;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .circultion-task-title {
      .task-line-one-wrapper {
        font-size: 17px;
        height: 38px;
        .task-line-one {
          width: 80%;
          margin: 0 auto;
          .taskLineOneStyle {
            color: black;
            border-bottom: 2px solid #2895ea
          }
          li {
            display: inline-block;
            color: #999999;
            width: 46%;
            height: 36px;
            line-height: 36px;
            text-align: center
          }
        };
      }
      .status-box {
        display: flex;
        box-sizing: border-box;
        padding: 0 10px;
        width: 100%;
        flex-flow: row nowrap;
        margin-top: 6px;
        height: 60px;
        justify-content: space-between;
        align-items: center;
        background: #f6f6f6;
        .task-line-two {
          height: 40px;
          width: 80px;
          font-size: 0;
          box-sizing: border-box;
          color: black;
          span {
            font-size: 15px;
            height: 40px;
            display: inline-block;
            text-align: center;
            line-height: 40px;
            border-right: 1px solid #dedada;
            &:last-child {
              border-right: none
            }
          }
        }
        .status-name-box {
          font-size: 18px;
          flex: 1;
          /deep/ .van-cell {
            border-radius: 8px;
            color: black
          }
        }
      }
      .task-operate-box {
        height: 40px;
        line-height: 30px;
        padding-left: 10px;
        span {
          font-size: 13px;
          display: inline-block;
          margin-top: 5px;
          width: 70px;
          height: 30px;
          color: #fff;
          background: #2895ea;
          text-align: center;
          border-radius: 2px
        }
      }
    };
    .circulation-task-list {
      /deep/ .van-tabs {
        .right-sign {
          .status-sign
        }
      }
    };
    .circulation-task-list-box {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      overflow-x: hidden;
      background: #f6f6f6;
      .circulation-task-list {
        .wait-handle-list {
          box-sizing: border-box;
          position: relative;
          width: 94%;
          margin:0 auto;
          background: #fff;
          padding: 10px;
          margin-bottom: 10px;
          box-sizing: border-box;
          .list-status {
            width: 80px;
            height: 30px;
            position: absolute;
            text-align: center;
            line-height: 30px;
            top: 8px;
            right: -12px;
            img {
              width: 100%;
              height: 100%
            }
          }
          .listStatusStyleOne {
            color: red
          }
          .listStyleStatusTwo {
            color: #85dc85
          }
          .wait-handle-message {
            font-size: 16px;
            padding: 14px 0;
            box-sizing: border-box;
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
            .wait-handle-message-top-two {
              height: 54px;
              border-left: 6px solid #2895ea;
              p {
                display: inline-block;
                width: 75%;
                height: 20px;
                overflow: auto;
                padding-left: 5px;
                box-sizing: border-box;
                &:first-child {
                  margin-bottom: 15px
                }
              }
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
          .get-wait-task {
            margin-top: 4px;
            width: 100%;
            text-align: center;
            span {
              vertical-align: top;
              display: inline-block;
              width: 120px;
              background: #1b88ff;
              line-height: 35px;
              height: 35px;
              font-size: 15px;
              color: #fff;
              margin-right: 20px;
              border-radius: 20px;
            }
          }
        }
      }
    };
    .circulation-task-list-two {
      height: 100%;
      overflow: auto;
      width: 100%;
      padding: 0;
      padding-top: 8px;
      border-bottom: 1px solid #d3d3d3;
      box-sizing: border-box;
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        width: 94%;
        margin:0 auto;
        background: #fff;
        padding: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
        .list-status {
          width: 80px;
          height: 30px;
          position: absolute;
          text-align: center;
          line-height: 30px;
          top: 8px;
          right: -12px;
          img {
            width: 100%;
            height: 100%
          }
        }
        .listStatusStyleOne {
          color: red
        }
        .listStyleStatusTwo {
          color: #85dc85
        }
        .wait-handle-message {
          font-size: 16px;
          padding: 14px 0;
          box-sizing: border-box;
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
          .wait-handle-message-top-two {
            height: 54px;
            border-left: 6px solid #2895ea;
            p {
              display: inline-block;
              width: 75%;
              height: 20px;
              overflow: auto;
              padding-left: 5px;
              box-sizing: border-box;
              &:first-child {
                margin-bottom: 15px
              }
            }
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
        .get-wait-task {
          margin-top: 4px;
          width: 100%;
          text-align: center;
          span {
            vertical-align: top;
            display: inline-block;
            width: 120px;
            background: #1b88ff;
            line-height: 35px;
            height: 35px;
            font-size: 15px;
            color: #fff;
            margin-right: 20px;
            border-radius: 20px;
          }
        }
      }
    };
    .circultion-task-btn {
      width: 95%;
      margin: 0 auto;
      padding: 10px;
      height: auto;
      background: #f6f6f6;
      span {
        vertical-align: top;
        display: inline-block;
        line-height: 40px;
        height: 40px;
        background-image: linear-gradient(to right, #37d4fd , #429bff);
        color: #fff;
        text-align: center
      }
      .circultion-task-btn-top {
        position: relative;
        height: 40px;
        span {
          width: 47%;
          border-radius: 4px;
          &:first-child {
            position: absolute;
            top: 0;
            left: 0
          }
          &:last-child {
            position: absolute;
            top: 0;
            right: 0
          }
        }
      };
      .circultion-task-btn-bottom {
        position: relative;
        height: 40px;
        margin-top: 10px;
        span {
          width: 100%;
          border-radius: 4px
        }
      }
    }
  }
</style>
