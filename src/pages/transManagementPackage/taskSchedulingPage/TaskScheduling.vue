<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadingText }}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 筛选弹窗 -->
    <div class="screen-box">
      <van-dialog v-model="screenDialogShow" width="100%" show-cancel-button 
        confirm-button-color="#2390fe"
        :before-close="beforeCloseDialogEvent"
        @confirm="screenDialogSure"
        @cancel="screenDialogCancel"
        confirm-button-text="确认"
        cancel-button-text="重置"
      >
        <div class="dialog-top">
          <div class="select-title">全部筛选</div>
          <van-icon name="cross" size="24" @click="closeScreenDialogEvent" />
        </div>
        <div class="dialog-center">
          <div class="dialog-center-one-line">
            <span>起点科室选择</span>
            <SelectSearch ref="departmentOption" :itemData="startPointDepartmentOption" :curData="startPointDepartmentValue" @change="startPointDepartmentOptionChange" />
            <span @click="startPointDepartmentClear">清除</span>
          </div>
          <div class="dialog-center-one-line">
            <span>运送员</span>
            <SelectSearch ref="transporterOption" :itemData="transporterOption" :curData="transporterValue" @change="transporterOptionChange" />
            <span  @click="transporterValueClear">清除</span>
          </div>
          <div class="priority-box">
            <div class="priority-title">
              优先级
            </div>
            <van-checkbox-group v-model="priorityResult" direction="horizontal">
              <van-checkbox name="1" shape="square">正常</van-checkbox>
              <van-checkbox name="2" shape="square">重要</van-checkbox>
              <van-checkbox name="3" shape="square">紧急</van-checkbox>
              <van-checkbox name="4" shape="square">紧急重要</van-checkbox>
            </van-checkbox-group>
          </div>
        </div>
      </van-dialog>
    </div>
    <!-- 分配弹框   -->
    <div class="allocation-box allocation-box-one">
      <van-dialog v-model="allocationShow" width="80%" show-cancel-button 
        confirm-button-color="#2390fe"
        :before-close="beforeCloseAllocationDialogEvent"
        @confirm="allocationDialogSure"
        @cancel="allocationDialogCancel"
        confirm-button-text="确定"
        cancel-button-text="取消"
      >
        <div class="dialog-top">
          请选择分配至
        </div>
        <div class="dialog-center">
          <SelectSearch :isShowTaskCompleteMessage="true" :itemData="allocationOption" ref="allocationOption" :curData="allocationValue" @change="allocationOptionChange" />
        </div>
      </van-dialog>
    </div>
    <!-- 延迟原因弹框 -->
    <div class="allocation-box">
      <van-dialog v-model="delayReasonShow" width="80%" show-cancel-button 
        confirm-button-color="#2390fe"
        :before-close="beforeCloseDelayReasonDialogEvent"
        @confirm="delayReasonDialogSure"
        @cancel="delayReasonDialogCancel"
        confirm-button-text="确定"
        cancel-button-text="取消"
      >
        <div class="dialog-top">
          请选择延迟原因
        </div>
        <div class="dialog-center">
          <SelectSearch :itemData="delayReasonOption" ref="delayOption" :isNeedSearch="false" :curData="delayReasonValue" @change="delayReasonOptionChange" />
        </div>
      </van-dialog>
    </div>
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
    <!-- 右侧菜单 -->
    <van-popup v-model="rightMenuShow" position="right" ref="vanPopup" :style="{ width: '60%', height: '100%' }">
        <div class="top-icon">
            <img :src="switchHiddenPng" alt="切换隐藏" @click="switchHiddenEvent">
        </div>
        <div class="center-content">
            <div class="function-list" :class="{'functionListStyle': functionListIndex == index}" v-for="(item, index) in taskList" :key="index" @click="taskRouterSkip(item.tit,index)">
                {{ item.tit }}
            </div>
        </div>
        <div class="signout-box" @click="signOutEvent">
            下班签退
        </div>
    </van-popup>
    <div class="nav">
       <van-nav-bar
        title="中央运送任务管理"
        left-text=""
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
        <template #right>
            <img :src="switchShowPng" alt="切换显示" @click="onClickRight">
        </template>
    </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
      <!-- 下拉刷新 -->
      <van-pull-refresh v-model="isLoadingRepairsTask" :disabled="isDiabledPullRefresh" loading-text="刷新中..." @refresh="onRefreshRepairsTaskEvent">
        <div class="content-box">
          <van-tabs v-model="activeName" type="card" color="#fff" title-inactive-color="#9E9E9A" title-active-color="#174E97" @change="vanTabsChangeEvent">
              <van-tab title="调度任务" name="dispatchTask" v-if="isShowDispathModule">
                  <div class="task-message-top">
                    <div class="message-left">
                      <span>当前任务数:</span>
                      <span>{{ dispatchTaskList.length }}</span>
                    </div>
                    <div class="message-right">
                      <span @click="createTask('调度任务')">创建任务</span>
                      <span @click="screenEvent">筛选</span>
                    </div>
                  </div>
                  <van-empty description="暂无数据" v-show="dispatchEmptyShow" />
                  <div class="backlog-task-list-box" ref="scrollDispatchTask" v-show="!dispatchEmptyShow">
                      <div class="backlog-task-list" v-for="(item,index) in dispatchTaskList" :key="index" @click="enterDispathTaskEvent(item,index,'调度任务')">
                        <div class="list-top">
                          <div class="list-top-left">
                            <img :src="anxiousSignPng" alt="急" v-show="item.priority == 2 || item.priority == 3 || item.priority == 4">
                            <span>{{ extractionDate(item.createTime) }}</span>
                            <span v-show="item.workerName">{{ item.workerName }}</span>
                            <div class="list-top-left-center" v-if="templateType == 'template_one' && item.quarantine == 1">
                              <img :src="contactIsolationPng">
                            </div>
                            <div class="list-top-left-center" v-if="templateType == 'template_two' && item['patientInfoList'].some((el) => { return el.quarantine == 1})">
                              <img :src="contactIsolationPng">
                            </div>
                          </div>
                          <div class="list-top-right" :class="{'noLookupStyle':item.state == 1,'noStartStyle':item.state == 2,'underwayStyle':item.state == 3,'noEndStyle':item.state == 4}">
                            {{ taskStatusTransition(item.state) }}
                          </div>
                        </div>
                        <div class="list-center">
                          <div class="list-center-left">
                            <div v-if="templateType == 'template_one'">
                              <span>{{ item['parentTypeName'] }}</span>
                              <span>{{ `${item.setOutPlaceName}${!item.destinationName ? '' : '-'}${item.destinationName ? item.destinationName : ''}` }}</span>
                            </div>
                            <div v-else>
                              <span>{{ item['parentTypeName'] }}</span>
                              <span>{{ `${item.setOutPlaceName}${item.destinations.length == 0 ? '' : '-'}${disposeDestinations(item.destinations)}` }}</span>
                            </div>
                          </div>
                          <div class="list-center-right">
                            <van-icon name="arrow" color="#101010" size="22" />
                          </div>
                        </div>
                        <div class="list-bottom">
                          <div class="list-bottom-left">
                            <span class="reminder-btn" :class="{'listBottomLeftStyle': item.reminder == 0 }" @click.stop="reminderTask(item)">{{ item.reminder == 0 ? '催单' : '已催单'}}</span>
                            <span @click.stop="() => { return }" class="delay-btn" v-if="item.hasDelay == 1">已延迟</span>
                            <!-- <span @click.stop="() => { return }" class="allocation-btn" v-if="item.state != 0">已分配</span> -->
                          </div>
                          <div class="list-bottom-right">
                            <span class="operate-one" v-if="item.state == 0" @click.stop="allocationEvent(item,index,'调度任务')">分配</span>
                            <span class="operate-two" @click.stop="editEvent(item,index,'调度任务')">编辑</span>
                            <span v-if="item.hasDelay == 0" class="operate-three" @click.stop="delayReasonEvent(item,index,'调度任务')">延迟</span>
                            <span class="operate-four" @click.stop="cancelReasonEvent(item,index,'调度任务')">取消</span>
                          </div>
                        </div>
                      </div>
                      <div class="no-more-data" v-show="isShowDispatchTaskNoMoreData">没有更多数据了</div>
                  </div>    
              </van-tab>
              <van-tab title="预约任务" name="appointTask" v-if="isShowAppointModule">
                  <div class="task-message-top">
                    <div class="message-left">
                      <span>当前任务数:</span>
                      <span>{{ appointTaskList.length }}</span>
                    </div>
                    <div class="message-right">
                      <span @click="createTask('预约任务')">创建任务</span>
                      <span @click="screenEvent">筛选</span>
                    </div>
                  </div>
                  <van-empty description="暂无数据" v-show="appointTaskEmptyShow" />
                  <div class="backlog-task-list-box" ref="scrollAppointTask" v-show="!appointTaskEmptyShow">
                    <div class="backlog-task-list" v-for="(item,index) in appointTaskList" :key="index" @click="enterDispathTaskEvent(item,index,'预约任务')">
                        <div class="list-top appoint-list-top">
                          <div class="list-top-left">
                            <img :src="anxiousSignPng" alt="急" v-show="item.priority == 2 || item.priority == 3 || item.priority == 4">
                            <span>{{ item.setOutPlaceName }}</span>
                            <div class="list-top-left-center" v-if="item.quarantine == 1">
                              <img :src="contactIsolationPng">
                            </div>
                          </div>
                          <div class="list-top-right" :class="{'noLookupStyle':item.state == 1,'noStartStyle':item.state == 2,'underwayStyle':item.state == 3,'noEndStyle':item.state == 4}">
                            {{ taskStatusTransition(item.state) }}
                          </div>
                        </div>
                        <div class="list-center appoint-list-center">
                          <div class="center-one-line">
                            <div class="center-one-line-left">
                              <span>病人姓名:</span>
                              <span>{{ item.patientName }}</span>
                            </div>
                              <div class="center-one-line-right">
                              <span>床号:</span>
                              <span>{{ item.badNumber }}</span>
                            </div>
                          </div>
                          <div class="center-one-line">
                              <div class="center-one-line-left">
                                <span>运送工具:</span>
                                <span >{{ item.toolName }}</span>
                              </div>
                              <div class="center-one-line-right">
                              <span>预计开始时间:</span>
                              <span>{{ cutOutYear(item.planStartTime) }}</span>
                            </div>
                          </div>
                          <div class="center-one-line">
                            <div class="center-one-line-left">
                              <span>已经历时间:</span>
                              <span>{{ elapsedTime(item.planStartTime) }}</span>
                            </div>
                              <div class="center-one-line-right">
                              <span>运送员:</span>
                              <span>{{ item.workerName }}</span>
                            </div>
                          </div>
                          <div class="center-one-line">
                            <div class="center-one-line-left center-one-line-checkItem">
                              <span>检查:</span>
                              <span>{{ disposeCheckType(item.checkItems) }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="list-bottom appoint-list-bottom">
                          <div class="list-bottom-left">
                            <span @click.stop="() => { return }" class="delay-btn" v-if="item.hasDelay == 1">已延迟</span>
                            <!-- <span @click.stop="() => { return }" class="allocation-btn" v-if="item.state != 0">已分配</span> -->
                          </div>
                          <div class="list-bottom-right">
                            <span  v-if="item.state == 0" class="operate-one" @click.stop="allocationEvent(item,index,'预约任务')">分配</span>
                            <span class="operate-two" @click.stop="editEvent(item,index,'预约任务')">编辑</span>
                            <span v-if="item.hasDelay == 0" class="operate-three" @click.stop="delayReasonEvent(item,index,'预约任务')">延迟</span>
                            <span class="operate-four" @click.stop="cancelReasonEvent(item,index,'预约任务')">取消</span>
                          </div>
                        </div>
                      </div>
                    <div class="no-more-data" v-show="isShowAppointTaskNoMoreData">没有更多数据了</div>
                  </div>    
              </van-tab>
          </van-tabs>
        </div>
      </van-pull-refresh>  
    </div> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { userSignOut,queryDispatchTaskCancelReason,queryTaskDelayReason } from '@/api/trans/workerPort.js'
import { queryAllDestination, taskReminder,getTransporter } from '@/api/trans/medicalPort.js'
import { dispathSinglePatientList, dispathManyPatientList, appointList, assignDispathTask, delayDispathTask, cancelDispathTask, assignAppointTask, delayAppointTask, cancelAppointTask } from '@/api/trans/taskScheduling.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import { IsPC,setStore,removeAllLocalStorage } from '@/common/js/utils'
import SelectSearch from "@/components/SelectSearch";
export default {
  name: "TaskScheduling",
  components: {
    SelectSearch
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      isDiabledPullRefresh: false,
      isShowDispathModule: true,
      isShowAppointModule: true,
      loadingText: '加载中...',
      isLoadingRepairsTask: false,
      loadFreshTimer: null,
      screenDialogShow: false,
      allocationShow: false,
      delayReasonShow: false,
      cancelReasonShow: false,
      moveInfo: {
        startX: ''
      },
      functionListIndex: 0,
      taskId: '',
      overlayShow: false,
      rightMenuShow: false,
      dispatchEmptyShow: false,
      appointTaskEmptyShow: false,
      isShowDispatchTaskNoMoreData: false,
      isShowAppointTaskNoMoreData: false,
      activeName: 'dispatchTask',
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      switchShowPng: require("@/common/images/home/switch-show.png"),
      switchHiddenPng: require("@/common/images/home/switch-hidden.png"),
      anxiousSignPng: require("@/common/images/home/anxious-sign.png"),
      contactIsolationPng: require("@/common/images/home/contact-isolation.png"),
      taskList: [
        {tit:'调度管理'},
        {tit:'调度任务'},
        {tit:'预约任务'},
        {tit:'循环任务'}
      ],
      priorityResult: ['1','2','3','4'],
      startPointDepartmentValue: null,
      startPointDepartmentOption: [],
      transporterValue: null,
      transporterOption: [],
      selectAllocation: {},
      allocationValue: null,
      allocationOption:  [],
      selectDelayReason: {},
      delayReasonValue: null,
      delayReasonOption: [],
      dispathDelayReasonOption: [],
      appointDelayReasonOption: [],
      selectCancelReason: {},
      cancelReasonValue: null,
      cancelReasonOption: [],
      dispathCancelReasonOption: [],
      appointCancelReasonOption: [],
      echoDispatchTaskList: [],
      echoAppointTaskList: [],
      dispatchTaskList: [],
      appointTaskList: []
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
        this.initScrollChange();
        this.registerSlideEvent()
      } catch (error) {
        // this.$toast({
        //   type: 'fail',
        //   message: error
        // })
      }
    });
    this.controlModuleShow();
    this.parallelFunction()
  },

  beforeDestroy () {
    if (this.loadFreshTimer) {clearTimeout(this.loadFreshTimer)}
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/home') {
        // 查询单病人调度任务列表(模板一)
        if (vm.templateType === 'template_one') {
          vm.getDispathSinglePatientList (false)
        } else if (vm.templateType === 'template_two') {
          vm.getDispathManyPatientList (false)
        }
      } else {
        // 回显调度页面点击的任务类型
        if (vm.schedulingTaskType.taskTypeName) {
          vm.activeName = vm.schedulingTaskType.taskTypeName;
          vm.taskId = vm.schedulingTaskDetails.id
        };
        // // 根据任务详情页面点击的按钮,显示对应的弹框
        // if (vm.operateBtnClickRecord) {
        //   if (vm.operateBtnClickRecord['allocationBtnClick']) {
        //     vm.allocationShow = true
        //   } else if (vm.operateBtnClickRecord['delayBtnClick']) {
        //     vm.delayReasonShow = true
        //   } else if (vm.operateBtnClickRecord['cancelBtnClick']) {
        //     vm.cancelReasonShow = true
        //   }
        // };
        if (vm.schedulingTaskType.taskTypeName) {
          if (vm.schedulingTaskType.taskTypeName == 'dispatchTask') {
            if (vm.templateType === 'template_one') {
              vm.getDispathSinglePatientList (false)
            } else if (vm.templateType === 'template_two') {
              vm.getDispathManyPatientList (false)
            }
          } else {
            vm.getAppointList(false)
          }
        } else {
          if (vm.templateType === 'template_one') {
            vm.getDispathSinglePatientList (false)
          } else if (vm.templateType === 'template_two') {
            vm.getDispathManyPatientList (false)
          }
        }
      }
	});
    next() 
  },

   beforeRouteLeave(to, from, next) {
   if (to.path == '/home') {
      this.resetBtnClickStatus()
   };
   next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","schedulingTaskType","operateBtnClickRecord","templateType","schedulingTaskDetails"]),
      userTypeId () {
        return this.isMedicalMan
      },
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
    ...mapMutations(["changeSchedulingTaskType","changeTitleTxt","changeCatchComponent","changeOverDueWay","changeSchedulingTaskDetails","changeOperateBtnClickRecord"]),

     onClickLeft() {
      this.$router.push({ path: "/home"})
    },

    // 控制模块显示
    controlModuleShow () {
      if (this.userInfo['extendData']) {
        if (!this.userInfo['extendData']['dispAssgin']) {
          this.isShowDispathModule = false
        };
        if (!this.userInfo['extendData']['bookAssgin']) {
          this.isShowAppointModule = false
        }
      }  
    },

    // 提取时间(不显示秒)
    extractionDate (dateMsg) {
      if (!dateMsg) { return };
      let currentIndex = dateMsg.lastIndexOf(':');
      return dateMsg.substring(0,currentIndex)
    },

    // 处理预约任务检查项
    disposeCheckType (item) {
      if (!item) { return };
      if (item.length == 0) { return };
      let temporaryArray = [];
      for (let innerItem of item) {
        temporaryArray.push(innerItem.checkTypeName)
      };
      return temporaryArray.join('、')
    },

    // 处理调度任务目的地(模板二)
    disposeDestinations (item) {
      if (!item) { return ''};
      if (item.length == 0) { return ''};
      if (Object.prototype.toString.call(item) === '[object Array]') {
        let temporaryArray = [];
        for (let innerItem of item) {
          temporaryArray.push(innerItem.destinationName)
        };
        return temporaryArray.join('、')
      } else {
        return ''
      }
    },

    // 下拉刷新事件
    onRefreshRepairsTaskEvent () {
      if (this.activeName == 'dispatchTask') {
        if (this.templateType === 'template_one') {
          this.getDispathSinglePatientList(true)
        } else if (this.templateType === 'template_two') {
          this.getDispathManyPatientList (true)
        }
      } else if (this.activeName == 'appointTask') {
        this.getAppointList(true)
      };
      // 刷新时间大于3秒,则关闭刷新动画
      this.loadFreshTimer = setTimeout(() => {
        this.isLoadingRepairsTask = false;
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false;
        this.$toast('刷新失败,请检查网络');
        if (this.loadFreshTimer) {clearTimeout(this.loadFreshTimer)}
      }, 3100)
    },

    // 调度任务列表(单病人)
    getDispathSinglePatientList (flag) {
      this.dispatchTaskList = [];
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = flag ? '刷新中' : '加载中...';
      this.dispatchEmptyShow = false;
      dispathSinglePatientList(-1,this.proId)
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = '';
        if (res && res.data.code == 200) {
          // 是否开启下拉刷新
          if (flag) {
            this.isLoadingRepairsTask = false;
            this.$toast('刷新成功');
            if (this.loadFreshTimer) {
              clearTimeout(this.loadFreshTimer)
            }
          };
          this.dispatchTaskList = res.data.data;
          // 只显示未分配、未查阅、未开始、进行中、未结束五种任务的状态
          this.dispatchTaskList = this.dispatchTaskList.filter(( item ) => { return item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3 || item.state == 4});
          this.echoDispatchTaskList = this.dispatchTaskList;
          if (this.dispatchTaskList.length == 0) {
            this.dispatchEmptyShow = true
          }
        } else {
          this.$toast({
            type: 'fail',
            message: res.data.msg
          })
        }
      })
      .catch((err) => {
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false;
        if (flag) {
          this.isLoadingRepairsTask = false;
          this.$toast('刷新失败,请检查网络');
          if (this.loadFreshTimer) {
            clearTimeout(this.loadFreshTimer)
          };
          return
        };
        this.$toast({
          type: 'fail',
          message: err.message
        })
      })
    },

    // 调度任务列表(多病人)
    getDispathManyPatientList (flag) {
      this.dispatchTaskList = [];
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = flag ? '刷新中' : '加载中...';
      this.dispatchEmptyShow = false;
      dispathManyPatientList(-1,this.proId)
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = '';
        if (res && res.data.code == 200) {
          // 是否开启下拉刷新
          if (flag) {
            this.isLoadingRepairsTask = false;
            this.$toast('刷新成功');
            if (this.loadFreshTimer) {
              clearTimeout(this.loadFreshTimer)
            }
          };
          this.dispatchTaskList = res.data.data;
          // 只显示未分配、未查阅、未开始、进行中、未结束五种任务的状态
          this.dispatchTaskList = this.dispatchTaskList.filter(( item ) => { return item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3 || item.state == 4});
          this.echoDispatchTaskList = this.dispatchTaskList;
          if (this.dispatchTaskList.length == 0) {
            this.dispatchEmptyShow = true
          }
        } else {
          this.$toast({
            type: 'fail',
            message: res.data.msg
          })
        }
      })
      .catch((err) => {
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false;
        if (flag) {
          this.isLoadingRepairsTask = false;
          this.$toast('刷新失败,请检查网络');
          if (this.loadFreshTimer) {
            clearTimeout(this.loadFreshTimer)
          };
          return
        };
        this.$toast({
          type: 'fail',
          message: err.message
        })
      })
    },

    // 预约任务列表
    getAppointList (flag) {
      this.appointTaskList = [];
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = flag ? '刷新中' : '加载中...';
      this.appointTaskEmptyShow = false;
      appointList(-1,this.proId)
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = '';
        if (res && res.data.code == 200) {
          // 是否开启下拉刷新
          if (flag) {
            this.isLoadingRepairsTask = false;
            this.$toast('刷新成功');
            if (this.loadFreshTimer) {
              clearTimeout(this.loadFreshTimer)
            }
          };
          this.appointTaskList = res.data.data;
          // 只显示未分配、未查阅、未开始、进行中、未结束五种任务的状态
          this.appointTaskList = this.appointTaskList.filter(( item ) => { return item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3 || item.state == 4});
          this.echoAppointTaskList = this.appointTaskList;
          if (this.appointTaskList.length == 0) {
            this.appointTaskEmptyShow = true
          }
        } else {
          this.$toast({
            type: 'fail',
            message: res.data.msg
          })
        }
      })
      .catch((err) => {
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false;
        if (flag) {
          this.isLoadingRepairsTask = false;
          this.$toast('刷新失败,请检查网络');
          if (this.loadFreshTimer) {
            clearTimeout(this.loadFreshTimer)
          };
          return
        };
        this.$toast({
          type: 'fail',
          message: err.message
        })
      })
    },

    // 计算已经历时间
    elapsedTime (planStartTme) {
      let currentTime = new Date().getTime();
      let transferPlanStartTme = new Date(planStartTme).getTime();
      if (transferPlanStartTme > currentTime) {
        return ''
      } else {
        return `${this.$moment(currentTime).diff(transferPlanStartTme, 'minutes')}分钟`
      }
    },

    // 去掉预计开始时间的年份
    cutOutYear (planStartTme) {
      if (!planStartTme) {
        return ''
      } else {
        let currentIndex = planStartTme.indexOf('-');
        let temporaryTime = planStartTme;
        if (currentIndex != -1) {
          temporaryTime = temporaryTime.substring(currentIndex+1);
          return temporaryTime
        }
      }
    },

    // 并行查询目的地、运送员、调度任务取消原因、预约任务取消原因、调度任务延迟原因、预约任务延迟原因
    parallelFunction () {
        this.loadingText = '加载中...';
        this.loadingShow = true;
        this.overlayShow = true;
        Promise.all([this.getAllDestination(),this.queryTransporter(),this.getCancelReason(1),this.getCancelReason(2),this.getDelayReason(1),this.getDelayReason(2)])
        .then((res) => {
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          if (res && res.length > 0) {
            this.startPointDepartmentOption = [{
              text: '请选择',
              value: null
            }];
            this.transporterOption = [{
              text: '请选择',
              value: null
            }];
            this.allocationOption = [{
              text: '请选择',
              value: null
            }];
            this.dispathCancelReasonOption = [{
              text: '请选择取消原因',
              value: null
            }];
            this.appointCancelReasonOption = [{
              text: '请选择取消原因',
              value: null
            }];
            this.dispathDelayReasonOption = [{
              text: '请选择延迟原因',
              value: null
            }];
            this.appointDelayReasonOption = [{
              text: '请选择延迟原因',
              value: null
            }];
            let [item1,item2,item3,item4,item5,item6] = res;
            if (item1) {
              Object.keys(item1).forEach((item,index) => {
                // 起点科室
                this.startPointDepartmentOption.push({
                  text: item1[item],
                  value: item
                });
              })
            };
            if (item2) {
              for (let i = 0, len = item2.length; i < len; i++) {
                this.transporterOption.push({
                  text: item2[i].name,
                  value: item2[i]['workerId'],
                  complete: item2[i].complete, // 完成数量
                  ongoing: item2[i].ongoing, // 进行中数量
                  id: i
                });
                this.allocationOption.push({
                  text: item2[i].name,
                  value: item2[i]['workerId'],
                  complete: item2[i].complete, // 完成数量
                  ongoing: item2[i].ongoing, // 进行中数量
                  id: i
                })
              }
            };
            if (item3) {
              for (let i = 0, len = item3.length; i < len; i++) {
                this.dispathCancelReasonOption.push({
                  text: item3[i]['cancelName'],
                  value: item3[i]['id']
                })
              }
            };
            if (item4) {
              for (let i = 0, len = item4.length; i < len; i++) {
                this.appointCancelReasonOption.push({
                  text: item4[i]['cancelName'],
                  value: item4[i]['id']
                })
              }
            };
            if (item5) {
              for (let i = 0, len = item5.length; i < len; i++) {
                this.dispathDelayReasonOption.push({
                  text: item5[i]['delayName'],
                  value: item5[i]['id']
                })
              }
            };
            if (item6) {
              for (let i = 0, len = item6.length; i < len; i++) {
                this.appointDelayReasonOption.push({
                  text: item6[i]['delayName'],
                  value: item6[i]['id']
                })
              }
            }
          };
          // 根据任务详情页面点击的按钮,显示对应的弹框及为对应的弹框列表数据赋值
          if (this.operateBtnClickRecord) {
            if (this.operateBtnClickRecord['allocationBtnClick']) {
              this.allocationShow = true
            } else if (this.operateBtnClickRecord['delayBtnClick']) {
              if (this.activeName == 'dispatchTask') {
                this.delayReasonOption = this.dispathDelayReasonOption
              } else {
                this.delayReasonOption = this.appointDelayReasonOption
              };
              this.delayReasonShow = true
            } else if (this.operateBtnClickRecord['cancelBtnClick']) {
              if (this.activeName == 'dispatchTask') {
                this.cancelReasonOption = this.dispathCancelReasonOption
              } else {
                this.cancelReasonOption = this.appointCancelReasonOption
              };
              this.cancelReasonShow = true
            }
          };
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
    
     // 查询目的地
    getAllDestination () {
      return new Promise((resolve,reject) => {
        queryAllDestination(this.proId).then((res) => {
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          }
        })
        .catch((err) => {
          reject(err.message)
        })
      })
    },

    // 查询运送员
    queryTransporter () {
      return new Promise((resolve,reject) => {
        getTransporter(this.proId, this.workerId)
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

    // 获取延迟原因列表
    getDelayReason (type) {
       return new Promise((resolve,reject) => {
        queryTaskDelayReason({proId: this.proId, state: 0,type})
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

    // 注册滑动事件  
    registerSlideEvent () {
      this.$refs.wrapper.addEventListener('touchstart',this.touchstartHandle,false);
      this.$refs.wrapper.addEventListener('touchmove',this.touchmoveHandle,false)
    },

    // 滑动开始
    touchstartHandle() {
        //判断是否在滑动区域内滑动
        let e = e || window.event;
        if (e.targetTouches.length == 1) {
            this.moveInfo.startX = parseInt(e.targetTouches[0].clientX)
        }    
    },

    // 滑动中
    touchmoveHandle() {
        let e = e || window.event;
        if (e.targetTouches.length == 1) {
        // 滑动距离
        let moveX = parseInt((e.targetTouches[0].clientX - this.moveInfo.startX));
        //左滑(根据左右滑动来控制右侧菜单的显示与隐藏)
        if (moveX < -50) {
          if(this.rightMenuShow) {return};
          this.rightMenuShow = true
        } else if (moveX > 50) {
          if(!this.rightMenuShow) {return};
          this.rightMenuShow = false
        }
        }        
    },

    // 筛选事件
    screenEvent () {
      this.screenDialogShow = true
    },

    // 筛选弹框起点科室下拉框值清除事件
    startPointDepartmentClear () {
      this.$refs['departmentOption'].clearSelectValue()
    },

    // 筛选弹框运送员下拉框值清除事件
    transporterValueClear () {
      this.$refs['transporterOption'].clearSelectValue()
    },

    // 筛选弹框起点科室下拉框选值变化事件
    startPointDepartmentOptionChange (item) {
      this.startPointDepartmentValue = item.value
    },

    // 筛选弹框运送员下拉框选值变化事件
    transporterOptionChange (item) {
      this.transporterValue = item.value
    },

    // 筛选弹框关闭前事件
    beforeCloseDialogEvent (action, done) {
      if (action == 'cancel') {
        this.$refs['departmentOption'].clearSelectValue();
        this.$refs['transporterOption'].clearSelectValue();
        this.priorityResult = ['1','2','3','4'];
        done(false);
        return
      } else {
        done()
      }
    },

    // 筛选弹框确定事件
    screenDialogSure () {
      try {
        if (this.activeName == 'dispatchTask') {
          if (!this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length == 0) {
            this.dispatchTaskList = this.echoDispatchTaskList;
            if (this.dispatchTaskList.length == 0) {
              this.dispatchEmptyShow = true
            } else {
              this.dispatchEmptyShow = false
            }
          } else {
            this.dispatchTaskList = this.echoDispatchTaskList.filter((item) => {
              if (this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length > 0) {
                  return item['setOutPlaceId'] == this.startPointDepartmentValue &&
                  item['workerId'] == this.transporterValue &&
                  this.priorityResult.indexOf(item.priority.toString()) != -1
                } else {
                  if (this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length == 0) {
                    return item['setOutPlaceId'] == this.startPointDepartmentValue
                  };
                  if (!this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length == 0) {
                    return item['workerId'] == this.transporterValue
                  };
                  if (!this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length > 0) {
                    return this.priorityResult.indexOf(item.priority.toString()) != -1
                  };
                  if (this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length == 0) {
                    return item['setOutPlaceId'] == this.startPointDepartmentValue && item['workerId'] == this.transporterValue
                  };
                  if (this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length > 0) {
                    return item['setOutPlaceId'] == this.startPointDepartmentValue && this.priorityResult.indexOf(item.priority.toString()) != -1
                  };
                  if (!this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length > 0) {
                    return item['workerId'] == this.transporterValue && this.priorityResult.indexOf(item.priority.toString()) != -1
                  };
                }
            });
            if (this.dispatchTaskList.length == 0) {
              this.dispatchEmptyShow = true
            } else {
              this.dispatchEmptyShow = false
            }
          }
        } else if (this.activeName == 'appointTask') {
          if (!this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length == 0) {
            this.appointTaskList = this.echoAppointTaskList;
            if (this.appointTaskList.length == 0) {
              this.appointTaskEmptyShow = true
            } else {
              this.appointTaskEmptyShow = false
            }
          } else {
            this.appointTaskList = this.echoAppointTaskList.filter((item) => {
              if (this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length > 0) {
                  return item['setOutPlaceId'] == this.startPointDepartmentValue &&
                  item['workerId'] == this.transporterValue &&
                  this.priorityResult.indexOf(item.priority.toString()) != -1
                } else {
                  if (this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length == 0) {
                    return item['setOutPlaceId'] == this.startPointDepartmentValue
                  };
                  if (!this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length == 0) {
                    return item['workerId'] == this.transporterValue
                  };
                  if (!this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length > 0) {
                    return this.priorityResult.indexOf(item.priority.toString()) != -1
                  };
                  if (this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length == 0) {
                    return item['setOutPlaceId'] == this.startPointDepartmentValue && item['workerId'] == this.transporterValue
                  };
                  if (this.startPointDepartmentValue && !this.transporterValue && this.priorityResult.length > 0) {
                    return item['setOutPlaceId'] == this.startPointDepartmentValue && this.priorityResult.indexOf(item.priority.toString()) != -1
                  };
                  if (!this.startPointDepartmentValue && this.transporterValue && this.priorityResult.length > 0) {
                    return item['workerId'] == this.transporterValue && this.priorityResult.indexOf(item.priority.toString()) != -1
                  };
                }
            });
            if (this.appointTaskList.length == 0) {
              this.appointTaskEmptyShow = true
            } else {
              this.appointTaskEmptyShow = false
            }
          }
        }
      } catch (err) {
        this.$toast(`${err}`)
      }    
    },

    // 筛选弹框取消事件
    screenDialogCancel () {

    },

    // 关闭筛选弹框
    closeScreenDialogEvent () {
      this.screenDialogShow = false
    },

    // 催单事件
    reminderTask(item) {
      if (item.reminder == 1) { return };
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '催单中...';
      taskReminder(this.proId,item.id).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = '';
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.data}`);
          // 更新任务信息
          if (this.templateType === 'template_one') {
            this.getDispathSinglePatientList (false)
          } else if (this.templateType === 'template_two') {
            this.getDispathManyPatientList (false)
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
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = '';
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },

    // 分配点击事件
    allocationEvent (item,index,text) {
      this.allocationShow = true;
      this.taskId = item.id
    },

    // 分配弹框运送员下拉框选值变化事件
    allocationOptionChange (item) {
      this.selectAllocation = item
    },

    // 分配弹框关闭前事件
    beforeCloseAllocationDialogEvent (action, done) {
      if (action == 'confirm') {
        if (this.selectAllocation.value == null) {
          this.$toast('请选择运送员');
          done(false)
        } else {
          done()
        }
      } else {
        done()
      }
    },

    // 分配弹框确定事件
    allocationDialogSure () {
      if (this.selectAllocation.value == null) { return };
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '分配中...';
      // 调度任务分配
      if (this.activeName == 'dispatchTask') {
          assignDispathTask({
            assignId: this.workerId, //分配者id(当前登录用户id)
            assignName: this.userName, //分配者姓名(当前登录用户姓名)
            id: this.taskId, //任务id
            proId: this.proId, // 医院id
            tempFlag: this.templateType === 'template_one' ? 1 : 2, //模板(1:旧模板,2:新模板)
            workerId: this.selectAllocation['value'], //运送员id
            workerName: this.selectAllocation['text'] //运送员姓名
          })
          .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.loadingText = '';
            this.$refs['allocationOption'].clearSelectValue();
            if (res && res.data.code == 200) {
              this.$toast('分配成功');
              // 更新任务信息
              if (this.templateType === 'template_one') {
                this.getDispathSinglePatientList (false)
              } else if (this.templateType === 'template_two') {
                this.getDispathManyPatientList (false)
              }
            } else {
              this.$toast({
                type: 'fail',
                message: res.data.msg
              })
            }
          })
          .catch((err) => {
            this.$refs['allocationOption'].clearSelectValue();
            this.loadingText = '';
            this.loadingShow = false;
            this.overlayShow = false;
            this.$toast({
              type: 'fail',
              message: err
            })
        })
        // 预约任务分配
      } else if (this.activeName == 'appointTask') {
        assignAppointTask({
            assignerId: this.workerId, //分配者id(当前登录用户id)
            assignerName: this.userName, //分配者姓名(当前登录用户姓名)
            id: this.taskId, //任务id
            tempFlag: this.templateType === 'template_one' ? 1 : 2, //模板(1:旧模板,2:新模板)
            workerId: this.selectAllocation['value'], //运送员id
            workerName: this.selectAllocation['text'] //运送员姓名
          })
          .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.loadingText = '';
            this.$refs['allocationOption'].clearSelectValue();
            if (res && res.data.code == 200) {
              this.$toast('分配成功');
              // 更新任务信息
              this.getAppointList(false)
            } else {
              this.$toast({
                type: 'fail',
                message: res.data.msg
              })
            }
          })
          .catch((err) => {
            this.$refs['allocationOption'].clearSelectValue();
            this.loadingText = '';
            this.loadingShow = false;
            this.overlayShow = false;
            this.$toast({
              type: 'fail',
              message: err
            })
        })
      }
    },

    // 分配弹框取消事件
    allocationDialogCancel () {
      this.$refs['allocationOption'].clearSelectValue()
    },

    // 编辑点击事件
    editEvent (item,index,text) {
      let temporaryTaskType = this.schedulingTaskType;
      if (text == '调度任务') {
        temporaryTaskType['taskTypeName'] = 'dispatchTask';
        this.$router.push({path: '/editDispathTask'})
      } else if (text == '预约任务') {
        temporaryTaskType['taskTypeName'] = 'appointTask';
        this.$router.push({path: '/editAppintTask'})
      };
      // 保存调度页面任务详情
      this.changeSchedulingTaskDetails(item);
      // 保存调度页面任务点击的类型
      this.changeSchedulingTaskType(temporaryTaskType)
      this.resetBtnClickStatus()
    },

    // 延迟点击事件
    delayReasonEvent(item,index,text) {
      this.delayReasonShow = true;
      this.taskId = item.id;
      if (this.activeName == 'dispatchTask') {
        this.delayReasonOption = this.dispathDelayReasonOption
      } else {
        this.delayReasonOption = this.appointDelayReasonOption
      }
    },

    // 延迟原因弹框下拉框选值变化事件
    delayReasonOptionChange (item) {
      this.selectDelayReason = item
    },

    // 延迟原因弹框关闭前事件
    beforeCloseDelayReasonDialogEvent (action, done) {
      if (action == 'confirm') {
        if (this.selectDelayReason.value == null) {
          this.$toast('请选择延迟原因');
          done(false)
        } else {
          done()
        }
      } else {
        done()
      }
    },

    // 延迟原因弹框确定事件
    delayReasonDialogSure () {
      if (this.selectDelayReason.value == null) { return };
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '延迟中...';
      // 调度任务延迟
      if (this.activeName == 'dispatchTask') {
        delayDispathTask({
            id: this.taskId, //任务id
            proId: this.proId, // 医院id
            tempFlag: this.templateType === 'template_one' ? 1 : 2, //模板(1:旧模板,2:新模板)
            delayReason: this.selectDelayReason['text'] //延迟原因
          })
        .then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
          this.loadingText = '';
          this.$refs['delayOption'].clearSelectValue();
          if (res && res.data.code == 200) {
            this.$toast('延迟成功');
            // 更新任务信息
            if (this.templateType === 'template_one') {
              this.getDispathSinglePatientList (false)
            } else if (this.templateType === 'template_two') {
              this.getDispathManyPatientList (false)
            }
          } else {
            this.$toast({
              type: 'fail',
              message: res.data.msg
            })
          }
        })
        .catch((err) => {
          this.$refs['delayOption'].clearSelectValue();
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          this.$toast({
            type: 'fail',
            message: err
          })
        })
        // 预约任务延迟
      } else if (this.activeName == 'appointTask') {
        delayAppointTask({
            taskId: this.taskId, //任务id
            proId: this.proId, // 医院id
            reason: this.selectDelayReason['text'], //延迟原因
            workerId: this.workerId, //操作人id
            endUser: this.userName, //操作人姓名
            endType: 1, //终止类型(0-web,1-安卓APP，2-微信小程序)
          })
          .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.loadingText = '';
            this.$refs['delayOption'].clearSelectValue();
            if (res && res.data.code == 200) {
              this.$toast('延迟成功');
              // 更新任务信息
              this.getAppointList(false)
            } else {
              this.$toast({
                type: 'fail',
                message: res.data.msg
              })
            }
          })
          .catch((err) => {
            this.$refs['delayOption'].clearSelectValue();
            this.loadingText = '';
            this.loadingShow = false;
            this.overlayShow = false;
            this.$toast({
              type: 'fail',
              message: err
            })
        })
      }
    },

    // 延迟原因弹框取消事件
    delayReasonDialogCancel () {
      this.$refs['delayOption'].clearSelectValue()
    },

    // 取消点击事件
    cancelReasonEvent(item,index,text) {
      this.cancelReasonShow = true;
      this.taskId = item.id;
      if (this.activeName == 'dispatchTask') {
        this.cancelReasonOption = this.dispathCancelReasonOption
      } else {
        this.cancelReasonOption = this.appointCancelReasonOption
      }
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
      // 调度任务取消
      if (this.activeName == 'dispatchTask') {
        cancelDispathTask({
            id: this.taskId, //任务id
            state: 6, //固定值6
            proId: this.proId, // 医院id
            tempFlag: this.templateType === 'template_one' ? 1 : 2, //模板(1:旧模板,2:新模板)
            endType: 1, //终止类型(0-web,1-安卓APP，2-微信小程序)
            endUser: this.userName, // 取消者(当前登录用户名)
            cancelReason: this.selectCancelReason['text'] //延迟原因
          })
        .then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
          this.loadingText = '';
          this.$refs['cancelOption'].clearSelectValue();
          if (res && res.data.code == 200) {
            this.$toast('取消成功');
            // 更新任务信息
            if (this.templateType === 'template_one') {
              this.getDispathSinglePatientList (false)
            } else if (this.templateType === 'template_two') {
              this.getDispathManyPatientList (false)
            }
          } else {
            this.$toast({
              type: 'fail',
              message: res.data.msg
            })
          }
        })
        .catch((err) => {
          this.$refs['cancelOption'].clearSelectValue();
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          this.$toast({
            type: 'fail',
            message: err
          })
        })
        // 预约任务取消
      } else if (this.activeName == 'appointTask') {
        cancelAppointTask({
            taskId: this.taskId, //任务id
            state: 6,
            proId: this.proId, // 医院id
            reason: this.selectCancelReason['text'], //取消原因
            workerId: this.workerId, //操作人id
            endUser: this.userName, //操作人姓名
            endType: 1 //终止类型(0-web,1-安卓APP，2-微信小程序)
          })
          .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            this.loadingText = '';
            this.$refs['cancelOption'].clearSelectValue();
            if (res && res.data.code == 200) {
              this.$toast('取消成功');
              // 更新任务信息
              this.getAppointList(false)
            } else {
              this.$toast({
                type: 'fail',
                message: res.data.msg
              })
            }
          })
          .catch((err) => {
            this.$refs['cancelOption'].clearSelectValue();
            this.loadingText = '';
            this.loadingShow = false;
            this.overlayShow = false;
            this.$toast({
              type: 'fail',
              message: err
            })
        })
      }
    },

    // 取消原因弹框取消事件
    cancelReasonDialogCancel () {
      this.$refs['cancelOption'].clearSelectValue()
    },


    // 切换显示右侧菜单事件
    onClickRight () {
      this.rightMenuShow = true
    },

    // 切换隐藏右侧菜单事件
    switchHiddenEvent () {
      this.rightMenuShow = false
    },

    // 进入任务详情事件
    enterDispathTaskEvent (item,index,text) {
      let temporaryTaskType = this.schedulingTaskType;
      if (text == '调度任务') {
        temporaryTaskType['taskTypeName'] = 'dispatchTask';
        this.$router.push({path:'/schedulingDispathTaskDetails'})
      } else if (text == '预约任务') {
        temporaryTaskType['taskTypeName'] = 'appointTask';
        this.$router.push({path:'/schedulingAppointTaskDetails'})
      };
      // 保存调度页面任务详情
      this.changeSchedulingTaskDetails(item);
      // 保存调度页面任务点击的类型
      this.changeSchedulingTaskType(temporaryTaskType);
      this.resetBtnClickStatus()
    },

    // 重置按钮点击状态
    resetBtnClickStatus () {
      let temporaryOperateBtnClickRecord = this.operateBtnClickRecord;
      temporaryOperateBtnClickRecord['delayBtnClick'] = false;
      temporaryOperateBtnClickRecord['allocationBtnClick'] = false;
      temporaryOperateBtnClickRecord['cancelBtnClick'] = false;
      this.changeOperateBtnClickRecord(temporaryOperateBtnClickRecord)
    },

    // 创建任务
    createTask (text) {
      let temporaryTaskType = this.schedulingTaskType;
      if (text == '调度任务') {
        temporaryTaskType['taskTypeName'] = 'dispatchTask'
        this.$router.push({path: '/createDispathTask'})
      } else if (text == '预约任务') {
        temporaryTaskType['taskTypeName'] = 'appointTask';
        this.$router.push({path: '/createAppointTask'})
      };
      // 保存调度页面任务点击的类型
      this.changeSchedulingTaskType(temporaryTaskType)
      this.resetBtnClickStatus()
    },

    // 右侧菜单任务列表点击事件
    taskRouterSkip (name, index) {
        this.functionListIndex = index;
        if (name === '调度任务') {
          this.resetBtnClickStatus();
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        } else if (name === '循环任务') {
          this.resetBtnClickStatus();
          this.$router.push({path:'/circulationTask'})
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务')
        } else if (name === '预约任务') {
          this.resetBtnClickStatus();
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else if (name === '调度管理') {
        }
      },

      // 下班签退事件
      signOutEvent () {
          this.$dialog.alert({
            message: '确定签退?',
            closeOnPopstate: true,
            showCancelButton: true
          }).then(() => {
            this.userLoginOut(this.proId, this.userInfo.userName)
          })
          .catch(() => {
          })
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            removeAllLocalStorage();
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
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
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

    // 元素滚动事件
    initScrollChange () {
        // 待办任务列表下拉
        if (this.activeName == 'dispatchTask') {
          let boxBackScroll = this.$refs['scrollDispatchTask'];
          boxBackScroll.addEventListener('scroll',(e)=> {
            // 列表滚动到最顶部时才能下拉刷新
            if (e.srcElement.scrollTop <= 0) {
              this.isDiabledPullRefresh = false
            } else {
              this.isDiabledPullRefresh = true
            };
            if (Math.ceil(e.srcElement.scrollTop) + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
            }
          },true)  
        };

        // 预约任务列表下拉
        if (this.activeName == 'appointTask') {
          let boxCompleteteScroll = this.$refs['scrollAppointTask']
          boxCompleteteScroll.addEventListener('scroll',(e)=> {
            // 列表滚动到最顶部时才能下拉刷新
            if (e.srcElement.scrollTop <= 0) {
              this.isDiabledPullRefresh = false
            } else {
              this.isDiabledPullRefresh = true
            };
            if (Math.ceil(e.srcElement.scrollTop) + e.srcElement.offsetHeight >= e.srcElement.scrollHeight) {
            }
          },true)    
        }    
    },

    // tab切换值变化事件
    vanTabsChangeEvent (value) {
      if (value == 'dispatchTask') {
        if (this.templateType === 'template_one') {
          this.getDispathSinglePatientList(false)
        } else if (this.templateType === 'template_two') {
          this.getDispathManyPatientList (false)
        }
      } else if (value == 'appointTask') {
        this.getAppointList(false)
      };
      this.$nextTick(()=> {
          this.initScrollChange()
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
  .content-wrapper();
  .screen-box {
    /deep/ .van-dialog {
      top: auto !important;
      left: 0 !important;
      border-right: 1px solid #fff;
      bottom: 0 !important;
      border-top-left-radius: 20px !important;
      border-top-right-radius: 20px !important;
      border-bottom-left-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      transform: translate3d(0,0,0) !important;
      .van-dialog__content {
        padding: 0 20px 10px 20px !important;
        box-sizing: border-box;
        height: 30vh;
        .dialog-top {
          height: 60px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          .select-title {
            font-size: 18px;
            color: #101010;
            text-align: center
          };
          .van-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 0
          }
        };
        .dialog-center {
          .dialog-center-one-line {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
            >span {
              display: inline-block;
              &:nth-child(1) {
                width: 30%;
                font-size: 14px;
                color: #101010;
                font-weight: bold
              };
              &:nth-child(3) {
                color: #fff;
                font-size: 12px;
                padding: 4px;
                box-sizing: border-box;
                background: #E86F50
              }
            };
            .vue-dropdown {
              width: 55%
            }
          };
          .priority-box {
            .priority-title {
              font-size: 14px;
              color: #101010;
              font-weight: bold;
              padding-top: 10px;
              margin-bottom: 20px
            }
          }
        }
      };
      .van-dialog__footer {
          padding: 20px !important;
          box-sizing: border-box;
          justify-content: space-between;
          ::after {
            content: none
          };
        .van-dialog__cancel {
            color: #1864FF;
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            background: #fff;
            border-radius: 30px;
            margin-right: 20px
        };
        .van-dialog__confirm {
            background: linear-gradient(to right, #6cd2f8, #2390fe);
            box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            color: #fff !important;
            border-radius: 30px;
        }
      };
      .van-hairline--top::after {
        border-top-width: 0 !important
      }
    }
  };
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
  .allocation-box-one {
    /deep/ .dialog-center {
      .list-module {
        max-height: 260px !important
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
    /deep/ .van-pull-refresh {
      .van-pull-refresh__head {
        color: #fff !important;
      };
      .van-loading {
        color: #fff !important;
        .van-loading__text {
          color: #fff !important;
        }
      };
      flex: 1;
      margin-top: 50px;
      padding-bottom: 50px;
      box-sizing: border-box;
      .content-box {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          width: 100%;
          height: 100%;
          .van-tabs {
              flex: 1;
              display: flex;
              flex-direction: column;
              height: 0;
              background: #f7f7f7;
              .van-tabs__wrap {
                  width: 100%;
                  height: 0.8rem;
                  padding: 10px 0;
                  .van-tabs__nav {
                      border: none !important;
                      background: #f7f7f7 !important;
                      .van-tab {
                          width: 50%;
                          flex: none;
                          border-radius: 4px
                      }
                  }
              };
              .van-tabs__content {
                  flex: 1;
                  padding: 0 4px 0px 4px;
                  box-sizing: border-box;
                  background: #f7f7f7;
                  height: 0;
                  display: flex;
                  .van-tab__pane {
                      height: 100%;
                      position: relative;
                      .van-empty {
                          position: absolute;
                          top: 50%;
                          left: 50%;
                          transform: translate(-50%,-50%)
                      };
                      .task-message-top {
                        width: 100%;
                        padding: 0 8px;
                        margin-bottom: 10px;
                        height: 42px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-sizing: border-box;
                        background: #fff;
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
                                    };
                                    &:nth-child(3) {
                                      max-width: 92px;
                                      .no-wrap();
                                      height: 20px;
                                      padding-left: 8px;
                                      line-height: 20px;
                                      border-left: 1px solid #BBBBBB;
                                      box-sizing: border-box;
                                      margin-left: 8px
                                    }
                                  };
                                  .list-top-left-center {
                                    margin: 0 10px;
                                    >img {
                                      width: 26px;
                                      height: 26px;
                                      vertical-align: bottom
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
                              };
                              .appoint-list-top {
                                padding: 4px 0;
                                .bottom-border-1px(#afafaf);
                                .list-top-left {
                                  >span {
                                    display: inline-block;
                                    font-weight: bold;
                                    &:nth-child(2) {
                                      max-width: 260px;
                                      box-sizing: border-box;
                                      .no-wrap()
                                    }
                                  };
                                  .list-top-left-center {
                                    margin: 0 10px;
                                    >img {
                                      width: 26px;
                                      height: 26px;
                                      vertical-align: bottom
                                    }
                                  }  
                                }
                              };
                              .appoint-list-center {
                                margin-top: 0;
                                flex-direction: column;
                                .center-one-line {
                                  display: flex;
                                  width: 100%;
                                  line-height: 20px;
                                  margin-top: 10px;
                                  .center-one-line-left {
                                    flex: 1;
                                    word-break: break-all;
                                    margin-right: 6px
                                  };
                                  .center-one-line-checkItem {

                                  };
                                  .center-one-line-right {
                                    flex: 1;
                                    word-break: break-all
                                  }
                                }
                              };
                              .appoint-list-bottom {
                                .list-bottom-left {
                                  .delay-btn {
                                    background: #254550 !important
                                  };
                                  .allocation-btn {
                                    background: #ffb77d !important
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
      }
    }  
  }
}
</style>