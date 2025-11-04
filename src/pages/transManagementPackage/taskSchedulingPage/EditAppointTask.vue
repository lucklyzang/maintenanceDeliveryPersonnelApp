<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{loadingText}}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 任务开始时间 -->
    <div class="task-start-time-box">
      <van-popup v-model="showTaskStart" position="bottom">
        <van-datetime-picker
          v-model="currentTaskStartTime"
          type="datetime"
          :min-date="minDate"
          :max-date="maxDate"
        >
          <template #default>
            <h3>任务开始时间</h3>
            <van-icon name="cross" size="25" @click="showTaskStart = false" />
          </template>
          <template #columns-bottom>
            <div class="button-box">
              <span @click="showTaskStart = false">取消</span>
              <span @click="onConDayFirm">确认</span>
            </div>
          </template>
        </van-datetime-picker>
      </van-popup>
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
    <!-- 起点科室 -->
    <div class="transport-rice-box" v-if="showStartDepartment">
      <ScrollSelection :columns="startDepartmentList" title="起点科室" @sure="startDepartmentSureEvent" @cancel="startDepartmentCancelEvent" @close="startDepartmentCloseEvent" :isShowSearch="true" />
    </div>
    <!-- 运送员 -->
    <div class="transport-rice-box" v-if="showTransporter">
      <ScrollSelection :columns="transporterList" title="运送员" @sure="transporterSureEvent" @cancel="transporterCancelEvent" @close="transporterCloseEvent" />
    </div>
    <!-- 转运工具 -->
    <div class="transport-rice-box" v-if="showTransportTool">
      <ScrollSelection :columns="transportToolList" title="转运工具" @sure="transportToolSureEvent" @cancel="transportToolCancelEvent" @close="transportToolCloseEvent" />
    </div>
     <!-- 性别 -->
    <div class="transport-rice-box" v-if="showGender">
      <ScrollSelection :columns="genderList" title="性别" @sure="genderSureEvent" @cancel="genderCancelEvent" @close="genderCloseEvent" />
    </div>
    <div class="nav">
       <van-nav-bar
        title="编辑预约任务"
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
      <div class="content-box">
        <div class="message-box">
          <div class="message-one">
            <div class="message-one-left">
              优先级
            </div>
            <div class="message-one-right">
              <van-radio-group v-model="priorityRadioValue" direction="horizontal">
                <van-radio name="1" checked-color="#289E8E">正常</van-radio>
                <van-radio name="2" checked-color="#E8CB51">紧急</van-radio>
                <van-radio name="3" checked-color="#F2A15F">重要</van-radio>
                <van-radio name="4" checked-color="#E86F50">紧急重要</van-radio>
              </van-radio-group>
            </div>
          </div>
          <div class="select-box">
            <div class="select-box-left">
              <span>*</span>
              <span>起点科室</span>
            </div>
            <div class="select-box-right" @click="showStartDepartment = true">
              <span>{{ currentStartDepartment }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="transport-type">
            <div class="transport-type-left check-type-left">
              <span>*</span>
              <span>检查类型</span>
            </div>
            <div class="transport-type-right">
              <span class="transport-type-list" :class="{'transportTypeListStyle':item.selected}" 
                v-for="(item,index) in transportTypeList"
                @click="transportTypeEvent(item,index)" 
                :key="index"
                >
                {{ item.text }}
              </span>
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>任务开始时间</span>
            </div>
            <div class="select-box-right" @click="taskStartTimeClickEvent">
              <span>{{ getNowFormatDate(currentTaskStartTime) }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>运送员</span>
            </div>
            <div class="select-box-right" @click="showTransporter = true">
              <span>{{ currentTransporter }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>转运工具</span>
            </div>
            <div class="select-box-right" @click="showTransportTool = true">
              <span>{{ currentTransportTool }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="patient-message-box">
            <div class="patient-message-top">
              <div class="patient-message-top-left">
                <van-field v-model="patientNumberValue" label="床号" placeholder="请输入" />
              </div>
              <div class="patient-message-top-right">
                <van-field v-model="patientNameValue" label="姓名" placeholder="请输入" />
              </div>
            </div>
            <div class="patient-message-bottom">
              <div class="patient-message-bottom-left">
                <van-field v-model="admissionNumberValue" label="住院号" placeholder="请输入" />
              </div>
              <div class="patient-message-bottom-right">
                <van-field v-model="patientAgeValue" label="年龄" placeholder="请输入" />
              </div>
            </div>
            <div class="patient-message-bottom patient-message-bottom-age">
              <div class="patient-message-bottom-right">
                <van-field v-model="transportNumberValue" label="运送数量" type="digit" placeholder="请输入" />
              </div>
              <div class="contact-isolation-box">
                <p>接触隔离</p>
                <p>
                  <van-radio-group v-model="isContactisolationValue" direction="horizontal" checked-color="#3B9DF9">
                    <van-radio icon-size="14px" name="1">是</van-radio>
                    <van-radio icon-size="14px" name="0">否</van-radio>
                  </van-radio-group>
                </p>
              </div>
            </div>
          </div>
          <div class="select-box end-select-box">
            <div class="select-box-left">
              <span>性别</span>
            </div>
            <div class="select-box-right" @click="showGender = true">
              <span>{{ currentGender }}</span>
              <van-icon name="arrow" color="#989999" size="20" />
            </div>
          </div>
          <div class="task-describe transport-type">
            <div class="transport-type-left">
              <span>任务描述</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="taskDescribe"
                rows="3"
                autosize
                type="textarea"
                placeholder="请输入任务描述"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="getTransConfig">确认</span>
          <span class="operate-three" @click="cancelEvent">取消</span>
        </div>
      </div>
    </div> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { userSignOut } from '@/api/trans/workerPort.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import Ldselect from '@/components/Ldselect'
import { editAppoint, getAppointCheckType, queryTransConfig } from '@/api/trans/taskScheduling.js'
import {queryAllDestination, queryTransportTools, getTransporter, queryTransportType } from '@/api/trans/medicalPort.js'
import Vselect from '@/components/Vselect'
import { setStore,removeAllLocalStorage } from '@/common/js/utils'
import _ from 'lodash'
import ScrollSelection from "@/components/ScrollSelection";
export default {
  name: "EditAppointTask",
  components: {
    ScrollSelection,
    Ldselect,
    Vselect
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      loadingText: '加载中...',
      taskDescribe: '',
      patientNumberValue: '',
      patientAgeValue: '',
      patientNameValue: '',
      showTaskStart: false,
      isContactisolationValue: null,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentTaskStartTime: new Date(),
      admissionNumberValue: '',
      transportNumberValue: '',
      showStartDepartment: false,
      currentStartDepartment: '请选择',
      startDepartmentList: [],
      showTransporter: false,
      currentTransporter: '请选择',
      currentTransporterValue: '',
      transporterList: [],
      showTransportTool: false,
      currentTransportTool: '无工具',
      transportToolList: [],
      showGender: false,
      currentGender: '未选择',
      genderList: [
        { 
          id: '2',
          text: '女'
        },
        { 
          id: '1',
          text: '男'
        },
        {
          id: '0',
          text: '未知'
        }
      ],
      transportTypeList: [],
      moveInfo: {
        startX: ''
      },
      priorityRadioValue: '1',
      functionListIndex: 0,
      overlayShow: false,
      rightMenuShow: false,
      transportParentControlListShow: false,
      transportTypeParent: [],
      transportTypeChild: [],
      xflSelectShow: false,
      isPressEdit: false,
      updateIndex: 0,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      switchShowPng: require("@/common/images/home/switch-show.png"),
      switchHiddenPng: require("@/common/images/home/switch-hidden.png"),
      anxiousSignPng: require("@/common/images/home/anxious-sign.png"),
      taskList: [
        {tit:'调度管理'},
        {tit:'调度任务'},
        {tit:'预约任务'},
        {tit:'循环任务'}
      ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.$router.push({path: '/taskScheduling'})
      })
    };
    this.registerSlideEvent();
    this.parallelFunction();
    this.echoTemporaryStorageMessage()
  },

  watch: {
  },

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","schedulingTaskDetails","operateBtnClickRecord","transportantTaskMessage","templateType","temporaryStorageCreateAppointTaskMessage"]),
      sex () {
        return this.userInfo['worker']['extendData']['sex']
      },
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
    ...mapMutations(["changeTitleTxt","changeCatchComponent","changeOverDueWay","changeOperateBtnClickRecord","changetransportTypeMessage","changeTemporaryStorageCreateAppointTaskMessage"]),

    onClickLeft() {
      this.$router.push({ path: "/taskScheduling"})
    },

    // 回显编辑的信息
    echoTemporaryStorageMessage () {
      let casuallyTemporaryStorageCreateDispathTaskMessage = this.schedulingTaskDetails;
      this.priorityRadioValue = casuallyTemporaryStorageCreateDispathTaskMessage['priority'].toString();
      this.transportNumberValue = casuallyTemporaryStorageCreateDispathTaskMessage['actualCount'],
      this.currentStartDepartment = casuallyTemporaryStorageCreateDispathTaskMessage['setOutPlaceName'];
      this.currentTransporter = casuallyTemporaryStorageCreateDispathTaskMessage['workerName'];
      this.currentTransporterValue = casuallyTemporaryStorageCreateDispathTaskMessage['workerId'];
      this.currentTransportTool = casuallyTemporaryStorageCreateDispathTaskMessage['toolName'];
      this.patientNumberValue = casuallyTemporaryStorageCreateDispathTaskMessage['badNumber'];
      this.patientAgeValue = casuallyTemporaryStorageCreateDispathTaskMessage['age'];
      this.isContactisolationValue = casuallyTemporaryStorageCreateDispathTaskMessage['quarantine'] === null ? casuallyTemporaryStorageCreateDispathTaskMessage['quarantine'] : casuallyTemporaryStorageCreateDispathTaskMessage['quarantine'].toString();
      this.patientNameValue = casuallyTemporaryStorageCreateDispathTaskMessage['patientName'];
      this.admissionNumberValue = casuallyTemporaryStorageCreateDispathTaskMessage['hospitalNo'];
      this.currentGender = casuallyTemporaryStorageCreateDispathTaskMessage['sex'] == 0 ? '未知' : casuallyTemporaryStorageCreateDispathTaskMessage['sex'] == 1 ? '男' : '女';
      this.currentTaskStartTime = new Date(casuallyTemporaryStorageCreateDispathTaskMessage['planStartTime']);
      this.taskDescribe = casuallyTemporaryStorageCreateDispathTaskMessage['taskRemark']
    },

    // 任务开始事件弹框确认事件
    onConDayFirm() {
      this.showTaskStart = false
    },

    // 任务开始时间点击事件
    taskStartTimeClickEvent () {
      this.showTaskStart = true
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
    
    // 查询运送类型小类
    getTransPorttype (data) {
      return new Promise((resolve,reject) => {
        queryTransportType(data)
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

    // 并行查询目的地、转运工具、运送员、检查类型
    parallelFunction (type) {
        this.loadingText = '加载中...';
        this.loadingShow = true;
        this.overlayShow = true;
        Promise.all([this.getAllDestination(),this.getTransportTools(),this.queryTransporter(),this.queryAppointCheckType()])
        .then((res) => {
          this.loadingText = '';
          this.loadingShow = false;
          this.overlayShow = false;
          if (res && res.length > 0) {
            this.transportToolList = [];
            this.startDepartmentList = [];
            this.transporterList = [];
            this.transportTypeList = [];
            let [item1,item2,item3,item4] = res;
            if (item1) {
              Object.keys(item1).forEach((item,index) => {
                // 起点科室
                this.startDepartmentList.push({
                  text: item1[item],
                  value: item,
                  id: index
                })
              })
            };
            if (item2) {
              // 转运工具
              for (let i = 0, len = item2.length; i < len; i++) {
                this.transportToolList.push({
                  text: item2[i].toolName,
                  value: item2[i].id,
                  id: i
                })
              }
            };
            if (item3) {
              for (let i = 0, len = item3.length; i < len; i++) {
                this.transporterList.push({
                  text: item3[i].name,
                  value: item3[i]['workerId'],
                  complete: item3[i].complete, // 完成数量
                  ongoing: item3[i].ongoing, // 进行中数量
                  id: i
                })
              }
            };
            if (item4) {
              //检查类型
              for (let item of item4) {
                this.transportTypeList.push({
                  text: item['typeName'],
                  value: item['id'],
                  selected: false
                })
              };
              //标记出该任务选中的检查类型
              for (let itemCheckType of this.transportTypeList) {
                for (let innerItem of this.schedulingTaskDetails['checkItems']) {
                  if (itemCheckType['value'] == innerItem['checkTypeId']) {
                    itemCheckType['selected'] = true
                  }
                }
              }
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

    // 查询转运工具
    getTransportTools () {
      return new Promise((resolve,reject) => {
        queryTransportTools({proId: this.proId, state: 0})
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

    // 查询检查类型
    queryAppointCheckType () {
      return new Promise((resolve,reject) => {
        getAppointCheckType(0,this.proId,'检查')
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
        //左滑(根据左右滑动来控制右侧菜单的显示与隐藏,滑动距离大于10才判定为滑动)
        if (moveX < -50) {
          if(this.rightMenuShow) {return};
          this.rightMenuShow = true
        } else if (moveX > 50) {
          if(!this.rightMenuShow) {return};
          this.rightMenuShow = false
        }
        }        
    },

    // 起点科室下拉选择框确认事件
    startDepartmentSureEvent (val) {
      if (val) {
        this.currentStartDepartment =  val
      } else {
        this.currentStartDepartment = '请选择'
      };
      this.showStartDepartment = false
    },

    // 起点科室下拉选择框取消事件
    startDepartmentCancelEvent () {
      this.showStartDepartment = false
    },

    // 起点科室下拉选择框关闭事件
    startDepartmentCloseEvent () {
      this.showStartDepartment = false
    },

    // 运送员下拉选择框确认事件
    transporterSureEvent (val,value) {
      if (val) {
        this.currentTransporter =  val;
        this.currentTransporterValue = value
      } else {
        this.currentTransporter = '请选择';
        this.currentTransporterValue = ''
      };
      this.showTransporter = false
    },

    // 运送员下拉选择框取消事件
    transporterCancelEvent () {
      this.showTransporter = false
    },

    // 运送员下拉选择框关闭事件
    transporterCloseEvent () {
      this.showTransporter = false
    },

    // 转运工具下拉选择框确认事件
    transportToolSureEvent (val) {
      if (val) {
        this.currentTransportTool =  val
      } else {
        this.currentTransportTool = '无工具'
      };
      this.showTransportTool = false
    },

    // 转运工具下拉选择框取消事件
    transportToolCancelEvent () {
      this.showTransportTool = false
    },

    // 转运工具下拉选择框关闭事件
    transportToolCloseEvent () {
      this.showTransportTool = false
    },

    // 性别下拉选择框确认事件
    genderSureEvent (val) {
      if (val) {
        this.currentGender =  val
      } else {
        this.currentGender = '请选择'
      };
      this.showGender = false
    },

    // 性别下拉选择框取消事件
    genderCancelEvent () {
      this.showGender = false
    },

    // 性别下拉选择框关闭事件
    genderCloseEvent () {
      this.showGender = false
    },

    // 运送类型点击事件(可以选择多个运送类型)
    transportTypeEvent (item,index) {
      this.transportTypeList[index]['selected'] = !this.transportTypeList[index]['selected']
    },

    // 切换显示右侧菜单事件
    onClickRight () {
      this.rightMenuShow = true
    },

    // 切换隐藏右侧菜单事件
    switchHiddenEvent () {
      this.rightMenuShow = false
    },

    // 右侧菜单任务列表点击事件
    taskRouterSkip (name, index) {
        this.functionListIndex = index;
        if (name === '调度任务') {
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        } else if (name === '循环任务') {
          this.$router.push({path:'/circulationTask'})
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务')
        } else if (name === '预约任务') {
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else if (name === '调度管理') {
          this.$router.push({path:'/taskScheduling'});
          this.changeTitleTxt({tit:'中央运送任务管理'});
          setStore('currentTitle','中央运送任务管理')
        }
      },

      // 根据科室名称获取科室id
      getDepartmentIdByName(text) {
        if (this.startDepartmentList.filter((item) => {return item['text'] == text }).length == 0) {
          return 0
        } else {
          return this.startDepartmentList.filter((item) => {return item['text'] == text })[0]['value']
        }
      },

      // 根据运送员名称获取运送员id
      getCurrentTransporterIdByName(text) {
        return this.transporterList.filter((item) => {return item['text'] == text })[0]['value']
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

    // 查询是否配置接触隔离选项0-没配置1-配置
    getTransConfig () {
      if (this.currentStartDepartment == '请选择' || !this.currentStartDepartment) {
        this.$toast({message: '请选择起点科室',type: 'fail'});
        return
      };
      if (this.transportTypeList.every((item) => { return item.selected == false})) {
        this.$toast({message: '检查类型不能为空',type: 'fail'});
        return
      };
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '查询中...';
      queryTransConfig(this.proId,'BOOK_QUARANTINE').then((res) => {
        if (res && res.data.code == 200) {
          if (JSON.parse(res.data.data)[0]['value'] == 1) {
            if (this.isContactisolationValue === null || this.isContactisolationValue == -1) {
              this.$toast('请确认病人是否需要接触隔离!')
            } else {
              this.sureEvent(true)
            }
          } else {
            this.sureEvent(false)
          }
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        };
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = ''
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
        this.loadingShow = false;
        this.overlayShow = false;
        this.loadingText = ''
      })
    },

    // 确认事件(编辑预约任务)
    sureEvent (flag) {
      let taskMessage;
      try {
        taskMessage = {
          depId: this.currentStartDepartment == '请选择' || !this.currentStartDepartment ? '' : this.getDepartmentIdByName(this.currentStartDepartment), //出发地ID
          department: this.currentStartDepartment == '请选择' || !this.currentStartDepartment ? '' : this.currentStartDepartment,//出发地名称
          items: [], //检查项
          priority: this.priorityRadioValue,   //优先级   1-正常, 2-重要,3-紧急, 4-紧急重要
          toolId: this.currentTransportTool == '无工具' || this.currentTransportTool == '无' || !this.currentTransportTool ? 0 : this.transportToolList.filter((item) => { return item.text == this.currentTransportTool })[0]['value'], //运送工具ID
          transTool: this.currentTransportTool, //运送工具名称
          name: this.patientNameValue,  //病人姓名
          planStartTime: this.getNowFormatDate(this.currentTaskStartTime), //计划开始时间
          sex: this.currentGender == '未选择' || this.currentGender == '未知' ? 0 : this.currentGender == '男' ? 1 : 2,    //病人性别  0-未指定,1-男, 2-女
          age: this.patientAgeValue,   //年龄
          hospitalNo: this.admissionNumberValue,   //住院号
          id: this.schedulingTaskDetails.id, // 任务id
          isBack: 0,
          quarantine: this.isContactisolationValue === null ? -1 : this.isContactisolationValue, // 接触隔离
          badNumber: this.patientNumberValue,  //床号
          taskRemark: this.taskDescribe,   //备注
          startUser: this.userName,   //创建者名称  当前登陆者
          workerId: this.currentTransporter == '请选择' || !this.currentTransporter ? '' : this.currentTransporterValue, // 运送员ID
          workerName: this.currentTransporter == '请选择' || !this.currentTransporter ? '' : this.currentTransporter, // 运送员姓名
          proId: this.proId,   //项目ID
          proName: this.proName,   //项目名称
          assignerId: this.workerId, //分配人id
          assignerName: this.userName, // 分配人
          modifyId: this.workerId, //修改人ID
          modifyName: this.userName, // 修改人
          createType: this.schedulingTaskDetails['createType'],   //创建类型 0-接入，1-调度员
          isApp: 1 // 发起客户端类型 1-安卓APP，2-微信小程序 
        };
        // 处理选中的检查类型
        let temporaryDateTime = this.getNowFormatDate(this.currentTaskStartTime).split(" ");
        for (let item of this.transportTypeList) {
          if (item['selected']) {
            taskMessage['items'].push({
              checkTypeId: item['value'],
              checkType: item['text'],
              bookTime: temporaryDateTime[1],
              bookDate: temporaryDateTime[0]
            })
          }
        };
        // 编辑预约任务
        this.editAppointTask(taskMessage)
      } catch (err) {
        this.$dialog.alert({
          message: `${err}`,
          closeOnPopstate: true
        }).then(() => {
        })
      }
    },

    // 编辑预约任务
    editAppointTask (data) {
      this.loadingText = '编辑中...';
      this.loadingShow = true;
      this.overlayShow = true;
      editAppoint(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.$router.push({path:'/taskScheduling'});
          this.changeTitleTxt({tit:'中央运送任务管理'});
          setStore('currentTitle','中央运送任务管理');
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
        };
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false
      })
    },

    // 取消事件
    cancelEvent () {
      this.$router.push({ path: "/taskScheduling"})
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
  .task-start-time-box {
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
          .message-one {
            width: 100%;
            padding: 10px 6px 10px 16px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .message-one-left {
              width: 20%;
              color: #101010
            };
            .message-one-right {
              flex: 1;
              /deep/ .van-radio-group {
                justify-content: space-between;
                .van-radio--horizontal {
                  margin-right: 0 !important;
                  &:nth-child(1) {
                    .van-radio__label {
                      color: #289E8E !important
                    }
                  };
                  &:nth-child(2) {
                    .van-radio__label {
                      color: #E8CB51 !important
                    }
                  };
                  &:nth-child(3) {
                    .van-radio__label {
                      color: #F2A15F !important
                    }
                  };
                  &:nth-child(4) {
                    .van-radio__label {
                      color: #E86F50 !important
                    }
                  }
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
                };
              }
            };
            .select-box-right {
              flex: 1;
              justify-content: flex-end;
              align-items: center;
              display: flex;
              width: 0;
              >span {
                color: #101010;
                text-align: right;
                flex: 1;
                .no-wrap()
              }
            }
          };
          .end-select-box {
            .select-box-left {
              padding: 0 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
          };
          .transport-type {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              padding: 0 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A
                }
              }
            };
            .check-type-left {
              padding-left: 0;
               >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  padding-right: 6px !important;
                  color: #9E9E9A
                }
              }
            };
            .transport-type-right {
              flex: 1;
              width: 0;
              display: flex;
              flex-wrap: wrap;
              .transport-type-list {
                display: inline-block;
                font-size: 13px;
                color: #9E9E9A;
                background: #F9F9F9;
                text-align: center;
                border-radius: 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                line-height: 20px;
                padding: 6px 10px;
                box-sizing: border-box
              };
              .transportTypeListStyle {
                color: #fff !important;
                background: #3B9DF9 !important
              }
            }
          };
          .patient-message-box {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            font-size: 14px;
            margin-top: 6px;
            .patient-message-top {
              display: flex;
              .patient-message-top-left {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              };
              .patient-message-top-right {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              }
            };
            .patient-message-bottom {
              display: flex;
              .patient-message-bottom-left {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              };
              .patient-message-bottom-right {
                flex: 1;
                /deep/ .van-cell {
                  padding: 10px !important;
                  .van-field__label {
                    width: 60px !important;
                    color: #9E9E9A !important
                  };
                  .van-cell__value {
                    background: #F9F9F9 !important;
                    color: #101010 !important;
                    font-size: 14px !important;
                    padding-left: 4px !important
                  }
                }
              }
            };
            .patient-message-bottom-age {
              .patient-message-bottom-right {
                width: 50%;
                flex: none
              };
               .contact-isolation-box {
                width: 50%;
                line-height: 20px;
                display: flex;
                >p {
                  font-size: 14px;
                  display: inline-block;
                  height: 100%;
                  &:first-child {
                    color: #9E9E9A;
                    margin-right: 14px;
                    padding-left: 10px;
                    box-sizing: border-box;
                    line-height: 44px;
                    vertical-align: top;
                  };
                  &:last-child {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    /deep/ .van-radio-group {
                      .van-radio--horizontal {
                        &:nth-child(1) {
                          margin-right: 14px !important
                        }
                      }
                    }
                  }
                }
              }  
            }
          };
          .task-total {
            padding: 6px !important;
            .message-one-left {
              padding-left: 10px;
              box-sizing: border-box
            };
            .message-one-right {
              width: 20%;
              flex: none !important;
              /deep/ .van-cell {
                padding: 2px 6px !important;
                background: #F9F9F9;
                .van-cell__value {
                  .van-field__control {
                    text-align: center !important
                  }
                }
              }
            }
          };
          .transport-type {
            .transport-type-right {
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
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
              color: #fff;
              background: linear-gradient(to right, #6cd2f8, #2390fe);
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              margin-right: 30px
            };
            &:nth-child(2) {
              color: #1864FF;
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              margin-right: 30px
            };
            &:last-child {
              color: #1864FF;
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1)
            }
          }
        }
    }
  }
}
</style>