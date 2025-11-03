<template>
  <div class="content-wrapper" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <!-- 检查详情弹框 -->
    <div class="check-details">
      <van-dialog v-model="checkDetailsShow"  show-cancel-button width="92%"
        title="检查详情"
        @confirm="checkDetailsSure" @cancel="checkDetailsCancel"
      >
        <div class="tool-name-list">
          <div class="tool-name-list-content">
            <p class="circulation-area-title">
              <span>检查科室</span>
              <span>检查类型</span>
              <span>检查诊室</span>
              <span>签到号</span>
            </p>
            <p v-for="(item,index) in checkItemList" :key="`${item}-${index}`" class="circulation-area-content">
              <span>
                {{item.checkDepartment}}
              </span>
              <span>
                {{item.checkType}}
              </span>
              <span>
                {{item.checkRoom}}
              </span>
              <span>
                {{item.signNumber}}
              </span>
            </p>
          </div>
        </div>
      </van-dialog>
    </div>
     <!-- 完成任务弹框 -->
    <div class="completet-details">
      <van-dialog v-model="completeTaskShow"  show-cancel-button width="92%"
        title="完成任务"
        :before-close="beforeCloseEvent"
        confirm-button-text="提交"
        @confirm="completetTaskSure" @cancel="completetTaskCancel"
      >
        <div class="task-content">
          <div class="select-reason-box">
            <div class="select-title">
              选择结束原因<span>*</span>
            </div>
            <div class="select-content">
              <van-dropdown-menu 
                active-color="#2895ea"
              >
                <van-dropdown-item v-model="reasonValue" :options="reasonOption" @change="selectReasonChane"/>
              </van-dropdown-menu>
            </div>
          </div>
          <div class="detail-describe-box">
            <div class="detail-describe-title">
              详细描述
            </div>
            <div class="detail-describe-content">
              <van-field
                v-model="detailDescribeContent"
                rows="2"
                autosize
                type="textarea"
                maxlength="2000"
                show-word-limit
              />
            </div>
          </div>
          <div class="signature-box">
            <div class="signature-title">
              点击签字<span>*</span>
            </div>
            <div class="signature-content" @click="signatureEvent">
            </div>
          </div>
        </div>
      </van-dialog>
    </div>    
    <div class="content" v-if="detailsBox">
      <div class="basic-message">
          <p class="basic-mesage-state">
            <img :src="stateTransferImg(appointDetailsMessage.state)" alt="">
          </p>
          <p class="basic-message-title">
            <span>
              <img :src="taskInfoPng" alt="">
            </span>
            基本信息
          </p>
         <div class="wait-handle-message">
           <div class="wait-handle-message-top">
             <div class="handle-message-line-wrapper">
               <p>
                 <span :class="{'natureImportantStyle': appointDetailsMessage.priority != 1}" class="message-tit">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                 <span class="message-tit-real message-tit-real-style" :class="{'natureNormalStyle' : appointDetailsMessage.priority == 1, 'natureImportantStyle': appointDetailsMessage.priority != 1}">{{priorityTransfer(appointDetailsMessage.priority)}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">任务编号 : </span>
                 <span class="message-tit-real">
                   {{appointDetailsMessage.serial ? appointDetailsMessage.serial : '无'}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
               <p>
                 <span class="message-tit">预计开始时间 : </span>
                 <span class="message-tit-real">
                   {{appointDetailsMessage.planStartTime}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper message-name">
               <p>
                 <span class="message-tit" :class="{'spanStyle' : appointDetailsMessage.quarantine == 1}">姓名 : </span>
                 <span class="message-tit-real" :class="{'spanStyle' : appointDetailsMessage.quarantine == 1}">{{appointDetailsMessage.patientName ? appointDetailsMessage.patientName : '无'}}</span>
                 <img :src="contactIsolationPng" v-if="appointDetailsMessage.quarantine == 1">
               </p>
             </div>
             <div class="handle-message-line-wrapper">
              <p>
                 <span class="message-tit" :class="{'spanStyle' : appointDetailsMessage.quarantine == 1}">床号 : </span>
                 <span class="message-tit-real" :class="{'spanStyle' : appointDetailsMessage.quarantine == 1}">{{appointDetailsMessage.badNumber ? appointDetailsMessage.badNumber : '无'}}</span>
               </p>
              <!-- <p>
                 <span class="message-tit">接触隔离 : </span>
                 <span class="message-tit-real">是</span>
               </p> -->
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit" :class="{'spanStyle' : appointDetailsMessage.quarantine == 1}">住院号 : </span>
                 <span class="message-tit-real" :class="{'spanStyle' : appointDetailsMessage.quarantine == 1}">{{appointDetailsMessage.hospitalNo  ? appointDetailsMessage.hospitalNo  : '无'}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">任务起点 : </span>
                 <span class="message-tit-real message-tit-real-style">
                   {{appointDetailsMessage.setOutPlaceName}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">转运工具 : </span>
                 <span class="message-tit-real message-tit-real-style">
                   {{appointDetailsMessage.toolName ? appointDetailsMessage.toolName : '无'}}
                 </span>
               </p>
             </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">预约号 : </span>
                 <span class="message-tit-real message-tit-real-style">
                   {{appointDetailsMessage.bespokeCount ? appointDetailsMessage.bespokeCount : '无'}}
                 </span>
               </p>
             </div>
           </div>
           <div class="wait-handle-message-bottom">
              <div class="handle-message-line-wrapper task-describe">
                <p>
                  <span class="message-tit">任务描述 : </span>
                  <span class="message-tit-real">{{appointDetailsMessage.taskRemark}}</span>
                </p>
              </div>
           </div>
        </div>
      </div>
      <div class="office-list-item-start-point" :class="{listItemStyle: appointDetailsMessage.scanPatient == 1 || appointDetailsMessage.scanDepartment == 1 || appointDetailsMessage.scanDepartment == 2}">
        <div class="office-list-left">
          <p>{{appointDetailsMessage.planStartTime}}</p>
          <p>{{appointDetailsMessage.setOutPlaceName}}</p>
        </div>
        <div class="office-list-right">
          <p :class="{listRightStyle: appointDetailsMessage.scanPatient == 1 }" @click="joinSweepCode(0,appointDetailsMessage)">
            <span>{{appointDetailsMessage.scanPatient == 1 ? '已' : '病人'}}</span>
            <span>扫码</span>
          </p>
          <p :class="{listRightTwoStyle: appointDetailsMessage.scanDepartment == 1 || appointDetailsMessage.scanDepartment == 2}" @click="joinSweepCode(1,appointDetailsMessage)">
            <span>{{appointDetailsMessage.scanDepartment == 1 || appointDetailsMessage.scanDepartment == 2 ? '已' : '科室'}}</span>
            <span>扫码</span>
          </p>
        </div>
      </div>
      <div class="office-list">
        <div class="office-list-inner-wrapper">
          <div :class="{listItemStyle: item['itemList'][0]['state'] == 2}" v-for="(item,index) in appointDetailsMessage.depCheckItems" :key="`${item}-${index}`" class="office-list-item">
            <span class="quadrant">
              {{index + 1}}
            </span>
            <div class="office-list-left">
              <div class="office-list-left-top">
                <p>
                  {{`${item.depName}`}}
                  <span @click="viewCheckItemDetails(appointDetailsMessage.checkItems)">详情</span>
                </p>
              </div>
               <div class="office-list-left-bottom">
                 <p v-for="(innerItem, innerIndex) in item.itemList" :key="innerIndex">
                  <span>
                    {{`${innerItem.checkTypeName}(${innerItem.bookTime})`}}
                  </span>
                 </p>
              </div>
            </div>
            <div class="office-list-right">
              <p :class="{listRightStyle: item['itemList'][0]['state'] == 1 || item['itemList'][0]['state'] == 2}" @click="joinSweepCode(2,item)">
                <span>{{item['itemList'][0]['state'] == 1 || item['itemList'][0]['state'] == 2 ? '检查' : '科室'}}</span>
                <span>{{item['itemList'][0]['state'] == 1 || item['itemList'][0]['state'] == 2 ? '已开始' : '扫码'}}</span>
              </p>
              <p :class="{listRightTwoStyle: item['itemList'][0]['state'] == 2}" @click="checkCompleted(item)">
                <span>检查</span>
                <span>{{item['itemList'][0]['state'] == 2 ? '已完成' : '完成'}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="office-list-item-end-point" :class="{listItemStyle: appointDetailsMessage.scanDepartment == 2}">
        <div class="office-list-left">
          <p>{{appointDetailsMessage.setOutPlaceName}}</p>
        </div>
        <div class="office-list-right">
          <p :class="{listRightStyle: appointDetailsMessage.scanDepartment == 2}" @click="joinSweepCode(3,appointDetailsMessage)">
            <span>{{appointDetailsMessage.scanDepartment == 2 ? '已' : '科室'}}</span>
            <span>扫码</span>
          </p>
        </div>
      </div>
    </div>
    <div class="circultion-task-btn" v-if="detailsBox">
      <p class="circultion-task-btn-bottom" v-show="appointTaskMessage.state != 7">
        <span @click="endTask">完成任务</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="appointTaskMessage.state == 7">
        <span @click="backTo">返回</span>
      </p>
    </div>
    <!-- 签字区域 -->
    <div class="signature-area" v-if="signatureBoxShow">
      <div class="signature-content-box">
        <ElectronicSignature ref="mychild"></ElectronicSignature>
      </div>
      <div class="btn-area">
        <div class="sure-box">
          <span @click="signatureSure">确 定</span>
        </div>
        <div class="rewrite-box">
          <span @click="rewrite">重 置</span>
        </div>
      </div>  
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import ElectronicSignature from '@/components/ElectronicSignature'
import {queryAppointTaskDetailsMessage, appointTaskCompleted, appointTaskSignCompleted, checkItemsCompleted, getAppointTaskEndReason} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, IsPC,  repeArray, deepClone } from '@/common/js/utils'
export default {
  name: 'appointDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      detailsBox: true,
      overlayShow: false,
      loadingShow: false,
      moveInfo: {
        startX: ''
      },
      signatureBoxShow: false,
      leftDownShow: false,
      detailDescribeContent: '',
      reasonValue: 0,
      reasonOption: [],
      checkItemList: [],
      completeTaskReason: '',
      checkDetailsShow: false,
      completeTaskShow: false,
      liIndex: null,
      isPatienVerified: false,
      isStartPonitVerified: false,
      isBackStartPonitVerified: false,
      drawCompleteTaskIdList: [],
      appointDetailsMessage: '',
      taskSweepCodePng: require('@/components/images/task-sweep-code.png'),
      taskInfoPng: require('@/common/images/home/basic-message.png'),
      noEndPng: require('@/common/images/home/no-end.png'),
      noReferPng: require('@/common/images/home/no-refer.png'),
      noStartPng: require('@/common/images/home/no-start.png'),
      taskFinshedPng: require('@/common/images/home/task-finshed.png'),
      taskGoingPng: require('@/common/images/home/task-going.png'),
      taskCancelPng: require('@/common/images/home/task-cancel.png'),
      waitSurePng: require('@/common/images/home/wait-sure.png'),
      contactIsolationPng: require("@/common/images/home/contact-isolation.png")
    }
  },

  components: {
    HeaderTop,
    NoData,
    FooterBottom,
    ElectronicSignature
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'currentElectronicSignature',
      'originalSignature',
      'userInfo',
      'appointTaskMessage',
      'completeCheckedItemInfo',
      'completeSweepcodeDepartureInfo',
      'completeSweepcodeDestinationInfo'
    ]),

    proId () {
      return this.userInfo.extendData.proId
    },
    userName () {
      return this.userInfo.userName
    },
    proName () {
      return this.userInfo.extendData.proName
    },
    workerId () {
      return this.userInfo.extendData.userId
    },
    taskId () {
      return this.appointTaskMessage.id
    }
  },

  mounted () {
    this.queryAppointTaskCompleteReason({proId: this.proId, state: 0});
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
          this.changeIsFreshAppointTaskPage(false)
        } else {
          this.changeIsFreshAppointTaskPage(true)
        };
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      })
    };
    this.$nextTick(()=> {
      try {
        this.registerSlideEvent()
      } catch (error) {
        // this.$toast({
        //   type: 'fail',
        //   message: error
        // })
      }
    });
    this.changeDepartureState();
    this.getAppointTaskMessage(this.appointTaskMessage.id)
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeOriginalSignature',
      'changeCurrentElectronicSignature',
      'changeIsFreshAppointTaskPage',
      'changeCompleteCheckedItemInfo',
      'changeCompleteSweepcodeDestinationInfo',
      'changeCompleteSweepcodeDepartureInfo'
    ]),

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
        //右滑
        if (moveX > 0) {
          if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
            this.changeIsFreshAppointTaskPage(false)
          } else {
            this.changeIsFreshAppointTaskPage(true)
          }
        }
      }        
    },

    // 返回上一页
    backTo () {
      if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.changeIsFreshAppointTaskPage(false)
      } else {
        this.changeIsFreshAppointTaskPage(true)
      };
      this.$router.push({path:'/appointTask'});
      this.changeTitleTxt({tit:'预约任务'});
      setStore('currentTitle','预约任务')
    },

    //检查详情弹框确定事件
    checkDetailsSure () {

    },

    //检查详情弹框取消事件
    checkDetailsCancel () {
    },

    // 弹框关闭前的事件
    beforeCloseEvent (action, done) {
      if (action == 'confirm') {
        if (!this.completeTaskReason) {
          this.$toast('请选择结束原因');
          done(false);
          return
        };
        if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
          this.$toast('签名不能为空');
          done(false);
          return
        };
        this.completeTaskSign()
      } else {
        done()
      }
    },

    //完成任务弹框确定
    completetTaskSure () {
    },

    //完成任务弹框取消
    completetTaskCancel () {
    },

    //原因下拉选项选中值改变事件
    selectReasonChane (value) {
      this.completeTaskReason = this.reasonOption.filter((item) => { return item.value == value})[0]['text'];
    },

    // 任务完成原因
    queryAppointTaskCompleteReason (data) {
      this.reasonOption = [];
      getAppointTaskEndReason(data).then((res) => {
        if (res && res.data.code == 200) {
          if (res.data.data.length > 0) {
            for (let item of res.data.data) {
              this.reasonOption.push({
                text: item.completeName,
                value: item.id
              })
            }
          }
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 点击签字事件
    signatureEvent () {
      setTimeout(() => {
        this.changeCurrentElectronicSignature({DtMsg :null});
        this.signatureBoxShow = true;
        this.detailsBox = false;
        this.completeTaskShow = false
      },500)
    },

    // 签名确定
    signatureSure () {
      this.$refs.mychild.commitSure();
      if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
        return
      };
      this.detailsBox = true;
      this.completeTaskShow = true;
      this.signatureBoxShow = false
    },

    // 签名重写
    rewrite () {
      try {
        this.$refs.mychild.overwrite()
      } catch (err) {
        
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
        case 6 :
          return this.taskCancelPng
          break;
        case 7 :
          return  this.taskFinshedPng
          break;
      }
    },

    // 查看任务下检查项详情
    viewCheckItemDetails (data) {
      this.checkItemList = [];
      for (let item of data) {
        this.checkItemList.push({
          checkDepartment: item.depName,
          checkType: item.checkTypeName,
          checkRoom: this.appointDetailsMessage.room ? this.appointDetailsMessage.room : '无',
          signNumber: this.appointDetailsMessage.registerNo ? this.appointDetailsMessage.registerNo : '无'
        })
      };
      this.checkDetailsShow = true
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
      }
    },

    // 改变病人和起始科室扫码状态
    changeDepartureState () {
      let temporaryOfficeList = deepClone(this.completeSweepcodeDepartureInfo);
      if (this.completeSweepcodeDepartureInfo.length > 0 ) {
        let temporaryIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex != -1) {
          if (temporaryOfficeList[temporaryIndex]['patienVerified'] && temporaryOfficeList[temporaryIndex]['patienVerified'] == true) {
            this.isPatienVerified = true
          };
          if (temporaryOfficeList[temporaryIndex]['startPonitVerified'] && temporaryOfficeList[temporaryIndex]['startPonitVerified'] == true) {
            this.isStartPonitVerified = true
          };
          if (temporaryOfficeList[temporaryIndex]['backStartPonitVerified'] && temporaryOfficeList[temporaryIndex]['backStartPonitVerified'] == true) {
            this.isBackStartPonitVerified = true
          }
        }
      }
    },

    // 查询预约任务详情
    getAppointTaskMessage (taskId) {
      this.overlayShow = true;
      this.loadingShow = true;
      queryAppointTaskDetailsMessage(taskId).then((res) => {
       this.overlayShow = false;
       this.loadingShow = false;
        if (res && res.data.code == 200) {
          this.appointDetailsMessage = res.data.data;
          // for (let item in this.appointDetailsMessage) {
          //   if (item == 'depCheckItems') {
          //     for (let innerItem of this.appointDetailsMessage[item]) {
          //       innerItem['isChecked'] = false;
          //       innerItem['isCompleted'] = false;
          //       // this.appointDetailsMessage.extendData1 ? innerItem['checkDepName'] = this.appointDetailsMessage.extendData1.checkDepName : innerItem['checkDepName'] = null;
          //       // this.appointDetailsMessage.extendData1 ? innerItem['room'] = this.appointDetailsMessage.extendData1.room : innerItem['room'] = null;
          //     };
          //   }
          // };
          // 为完成二维码校验的科室增加标记
          // if (this.completeSweepcodeDestinationInfo.length > 0) {
          //   for (let w = 0, wLen = this.completeSweepcodeDestinationInfo.length; w < wLen; w++) {
          //     if (this.appointDetailsMessage['id'] == this.completeSweepcodeDestinationInfo[w]['taskId']) {
          //       if (this.completeSweepcodeDestinationInfo[w]['officeList'].length > 0) {
          //         for (let i = 0, len1 = this.completeSweepcodeDestinationInfo[w]['officeList'].length; i < len1; i++) {
          //           if (this.appointDetailsMessage['depCheckItems'].length > 0) {
          //             for (let j = 0, len2 = this.appointDetailsMessage['depCheckItems'].length; j < len2; j++) {
          //               if (this.appointDetailsMessage['depCheckItems'][j]['itemList'][0]['id'] == this.completeSweepcodeDestinationInfo[w]['officeList'][i]) {
          //                 this.appointDetailsMessage['depCheckItems'][j]['isChecked'] = true;
          //                 // 为完成检查的科室增加标记
          //                 if (this.completeCheckedItemInfo.length > 0) {
          //                   let temporaryIndex = this.completeCheckedItemInfo.indexOf(this.completeCheckedItemInfo.filter((item) => {return item.taskId == this.taskId})[0]);
          //                   if (temporaryIndex != -1) {
          //                     let targetDepartmentList = this.completeCheckedItemInfo[temporaryIndex]['officeList'];
          //                     if (targetDepartmentList.length > 0) {
          //                       for (let targetItem of targetDepartmentList) {
          //                         if (this.appointDetailsMessage['depCheckItems'][j]['itemList'][0]['id'] == targetItem) {
          //                           this.appointDetailsMessage['depCheckItems'][j]['isCompleted'] = true
          //                         }
          //                       }
          //                     }
          //                   }
          //                 }
          //               }
          //             }
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        } else {
          this.$toast(`${res.data.msg}`)
        }
      })
      .catch((err) => {
        this.overlayShow = false;
        this.loadingShow = false;
         this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 检查科室完成
    checkCompleted (item) {
       if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.$toast('该任务已完成或取消，不能执行此操作');
        return
      };
      if (!item['itemList'][0]['state']) {
        this.$toast('请先完成该检查科室二维码校验');
        return
      } else {
        if (item['itemList'][0]['state'] == 2) {
          this.$toast('该科室已经完成过检查');
          return
        }
      };
      let checkedItemsInfo = {
        proId: this.proId, //项目ID
        workerId: this.workerId, //运送员ID即当前登录人
        itemId: item['itemList'][0]['id'],   //检查项ID
        endUser: this.userInfo.name //结束用户名
      };
      checkItemsCompleted(checkedItemsInfo).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.storeCheckedDepartment(item['itemList'][0]['id']);
          this.getAppointTaskMessage(this.appointTaskMessage.id)
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 替换字符串中某个位置的字符为指定字符
    replaceStr (str, index, char) {
      const strAry = str.split('');
      strAry[index] = char;
      return strAry.join('');
    },

    // 判断检查科室是否全部检查完成
    isCheckDepartmentAllCompleted (data) {
      let allCompleted = true;
      for (let item of data) {
        let flag = item['itemList'].every((innerItem) => { return innerItem.state == 2});
        if (!flag) {
          allCompleted = false;
          break
        }
      };
      return allCompleted
    },

    // 存储完成检查的科室
    storeCheckedDepartment (depId) {
      if (depId == null) {return};
      let temporaryOfficeList = [];
      let temporaryDepartmentId = [];
      temporaryOfficeList = deepClone(this.completeCheckedItemInfo);
      if (this.completeCheckedItemInfo.length > 0 ) {
        let temporaryIndex = this.completeCheckedItemInfo.indexOf(this.completeCheckedItemInfo.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex != -1) {
          temporaryDepartmentId = temporaryOfficeList[temporaryIndex]['officeList'];
          temporaryDepartmentId.push(depId);
          temporaryOfficeList[temporaryIndex]['officeList'] = repeArray(temporaryDepartmentId)
        } else {
          temporaryDepartmentId.push(depId);
          temporaryOfficeList.push(
            {
              officeList: repeArray(temporaryDepartmentId),
              taskId: this.taskId
            }
          )
        }
      } else {
        temporaryDepartmentId.push(depId);
        temporaryOfficeList.push(
          {
            officeList: repeArray(temporaryDepartmentId),
            taskId: this.taskId
          }
        )
      };
      this.changeCompleteCheckedItemInfo(temporaryOfficeList);
      setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": temporaryOfficeList});
    },

    // 结束任务
    endTask () {
      if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.$toast('该任务已完成或取消，不能执行此操作');
        return
      };
      if (!this.appointDetailsMessage['scanDepartment'] && !this.appointDetailsMessage['scanPatient']) {
        this.$toast('请至少完成出发地科室二维码或病人二维码校验才能完成任务')
      } else {
        // 判断检查科室是否全部检查完成
        let isCheckDepartmentAllCompleted = this.isCheckDepartmentAllCompleted(this.appointDetailsMessage['depCheckItems']);
        // 判断所有科室是否全部扫码完成
        if (isCheckDepartmentAllCompleted && this.appointDetailsMessage['scanDepartment'] == 2) {
          // 所有科室都扫码成功直接完成任务
          this.$dialog.alert({
            message: '是否确认完成任务',
            closeOnPopstate: true,
            showCancelButton: true
          }).then(() => {
            this.completeTask()
          }).catch((err) => {})
        } else {
          // 不是所有科室都扫码成功需要签名完成任务
          this.completeTaskShow = true
        }
      }
    },

    // 完成任务(没有签名)
    completeTask () {
      let completeInfo = {
        proId: this.proId, //项目ID
        workerId: this.workerId, //运送员ID即当前登录人
        taskId: this.taskId,   //任务ID
        endType: 1, //1-安卓APP，2-微信小程序
        endUser: this.userInfo.name //结束用户名
      };
      appointTaskCompleted(completeInfo).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.emptyCompleteCheckedItem();
          this.emptyCompleteDestinationDepartment();
          this.emptyCompleteDepartureDepartment();
          if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
            this.changeIsFreshAppointTaskPage(false)
          } else {
            this.changeIsFreshAppointTaskPage(true)
          };
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 完成任务(有签名)
    completeTaskSign () {
      let completeInfo = {
        taskId: this.taskId, //完成任务的id
        sign: this.currentElectronicSignature, //签名信息bese64编码
        signPath: '', //签名信息上传OSS后地址
        completeReason: this.completeTaskReason, //任务完成原因
        operationRemark: this.detailDescribeContent, //任务完成备注信息
        endType: 1, //1-安卓APP，2-微信小程序
        endUser: this.userInfo.name //结束用户名
      };
      appointTaskSignCompleted(completeInfo).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.emptyCompleteCheckedItem();
          this.changeCurrentElectronicSignature({DtMsg :null});
          this.emptyCompleteDestinationDepartment();
          this.emptyCompleteDepartureDepartment();
          if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
            this.changeIsFreshAppointTaskPage(false)
          } else {
            this.changeIsFreshAppointTaskPage(true)
          };
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 进入扫码页
    joinSweepCode (type,item) {
      if (this.appointTaskMessage.state == 7 || this.appointTaskMessage.state == 6) {
        this.$toast('该任务已完成或取消，不能执行此操作');
        return
      };
      if (type == 2) {
        if (!this.appointDetailsMessage['scanDepartment'] && !this.appointDetailsMessage['scanPatient']) {
          this.$toast('请先进行出发地科室二维码或病人二维码校验')
        } else {
          if (item['itemList'][0]['state'] == 1 || item['itemList'][0]['state'] == 2) {
            this.$toast('该检查科室已经校验并通过')
          } else {
            this.$router.push(
              {
                'path':'/appointTaskSweepCode',
                query: {checkType: type, id: item['itemList'][0]['id']}
              }
            );
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码')
          }
        }
      } else {
        if (type == 0) {
          if (this.appointDetailsMessage.scanPatient == 1) {
            this.$toast('该病人二维码已经校验并通过,请进行起始科室二维码的校验')
          } else {
            this.$router.push(
              {
                'path':'/appointTaskSweepCode',
                query: {checkType: type}
              }
            );
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码')
          }
        };
        if (type == 1) {
          if (this.appointDetailsMessage.scanDepartment == 1 || this.appointDetailsMessage.scanDepartment == 2) {
            this.$toast('该出发地科室二维码已经校验并通过,请进行检查科室二维码的校验')
          } else {
            this.$router.push(
              {
                'path':'/appointTaskSweepCode',
                query: {checkType: type}
              }
            );
            this.changeTitleTxt({tit:'扫码'});
            setStore('currentTitle','扫码')
          }
        };
        if (type == 3) {
          if (!this.appointDetailsMessage['scanDepartment'] && !this.appointDetailsMessage['scanPatient']) {
            this.$toast('请至少完成出发地科室二维码或病人二维码的校验才能再次扫描出发地科室二维码')
          } else {
            if (this.appointDetailsMessage['scanPatient'] == 2) {
              this.$toast('返回科室出发地扫码已经校验过')
            } else {
              this.$router.push(
                {
                  'path':'/appointTaskSweepCode',
                  query: {checkType: type}
                }
              );
              this.changeTitleTxt({tit:'扫码'});
              setStore('currentTitle','扫码')
            }
          }
        }
      }
    },

    // 清空该完成任务存储的已完成检查的信息
    emptyCompleteCheckedItem () {
      let temporarySweepCodeOficeList = deepClone(this.completeCheckedItemInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
      this.changeCompleteCheckedItemInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": temporarySweepCodeOficeList})
    },

    // 清空该完成任务存储的已扫过目的地科室信息
    emptyCompleteDestinationDepartment () {
      let temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDestinationInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
      this.changeCompleteSweepcodeDestinationInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
    },

    // 清空该完成任务存储的已扫过起始地科室信息
    emptyCompleteDepartureDepartment () {
      let temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDepartureInfo);
      temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
      this.changeCompleteSweepcodeDepartureInfo(temporarySweepCodeOficeList);
      setStore('completAppointTaskSweepCodeDepartureInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
    }
  }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    .content-wrapper();
    /deep/ .van-loading {
      z-index: 200000
    };
      font-size: 16px;
      background: #f6f6f6;
      .check-details {
      /deep/ .van-dialog {
        top: 50%;
        .van-dialog__header {
          background: #2895ea;
          padding-top: 0;
          color: #fff;
          height: 60px;
          line-height: 60px
        };
        .van-dialog__content {
          .tool-name-list {
            width: 100%;
            display: flex;
            flex-flow: column;
            overflow: auto;
            margin: 0 auto;
            padding: 0;
            max-height: 80vh;
            .tool-name-list-content {
              flex: 1;
              padding: 6px 0;
              overflow: auto;
              box-sizing: border-box;
              border: 1px solid transparent;
              .circulation-area-content {
                position: relative;
                background: #eaeaea;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                margin-bottom: 4px;
                > span {
                  line-height: 35px;
                  font-size: 15px;
                  flex: 1;
                  color: #525252;
                  word-break: break-all;
                  text-align: center;
                  display: inline-block;
                  &:first-child {
                  };
                  &:nth-child(2) {
                  }
                  &:nth-child(3) {
                  }
                  &:last-child {
                  }
                }
              }
              .circulation-area-title {
                position: relative;
                font-size: 0;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                span {
                  line-height: 30px;
                  text-align: center;
                  display: inline-block;
                  font-size: 16px;
                  flex: 1;
                  &:first-child {
                  };
                  &:nth-child(2) {
                  }
                  &:nth-child(3) {
                  }
                  &:last-child {
                  }
                }
              }
            }
          }
        }
      }
    };
    .completet-details {
       /deep/ .van-dialog {
        top: 50%;
        .van-dialog__header {
          height: 40px;
          padding: 0;
          background:#efefef;
          line-height: 40px
        };
        .van-dialog__content {
          .task-content {
            max-height: 85vh;
            padding: 0 6px 6px 6px;
            box-sizing: border-box;
            overflow: auto;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            .select-reason-box {
              .select-title {
                height: 40px;
                display: flex;
                align-items: center;
                > span {
                  color: red
                }
              };
              .select-content {
                /deep/ .van-dropdown-menu {
                  border: 1px solid #c7c7c7;
                  border-radius: 10px;
                  .van-dropdown-menu__bar {
                    box-shadow: none;
                    background: none;
                    height: 35px;
                    .van-dropdown-menu__item {
                      justify-content: flex-start;
                      .van-dropdown-menu__title {
                        position: relative;
                        padding: 0 6px;
                        font-size: 14px;
                        box-sizing: border-box;
                        width: 100%;
                        display: inline-block
                      };
                      .van-dropdown-menu__title::after {
                        right: 10px
                      }
                    }
                  };
                  .van-dropdown-item {
                    top: 32vw !important
                  }
                }
              }
            };
            .detail-describe-box {
              .detail-describe-title {
                height: 40px;
                display: flex;
                align-items: center;
              };
              .detail-describe-content {
                border: 1px solid #c7c7c7;
                border-radius: 4px;
                /deep/ .van-cell {
                  background: none;
                  padding: 6px;
                  box-sizing: border-box
                }
              }
            };
            .signature-box {
              height: 100px;
              display: flex;
              flex-direction: column;
              .signature-title {
                height: 40px;
                display: flex;
                align-items: center;
                > span {
                  color: red
                }
              };
              .signature-content {
                height: 60px;
                background: #dedede
              }
            }
          }
        }
      }  
    };  
    .content {
      flex: 1;
      width: 100%;
      overflow: auto;
    };
    .basic-message {
      width: 93%;
      margin: 0 auto;
      margin-top: 14px;
      flex-direction: column;
      position: relative;
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
      .basic-mesage-state {
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
      };
      .basic-message-title {
        font-size: 18px;
        color: #1a89fd;
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          height: 15px;
          width: 15px;
          vertical-align: top;
          margin-top: 1px;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
      .wait-handle-message {
        width: 100%;
        margin-top: 5px;
        .wait-handle-message-middle {
          margin: 10px 0
        };
        .wait-handle-message-bottom {
          margin-top: 10px
        };
        .task-describe {
          p {
            height: auto !important;
            line-height: 20px !important
          }
        }
        .handle-message-line-wrapper {
          p {
            display: flex;
            overflow: auto;
            min-height: 30px;
            line-height: 30px;
            flex-flow: row nowrap;
            color: #a0a0a0;
            .natureNormalStyle {
              color: #b1d676 !important
            };
            .natureImportantStyle {
              color: red !important;
              font-weight: bold
            };
            .spanStyle {
              color: #E8CB51 !important;
              font-weight: bold
            };
            span {
              display: inline-block;
            };
            span:first-child {
              width: 25%
            };
            .message-tit-real {
              word-break: break-all
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              flex: 1;
              color: black
            }
          };
          .describe-line-wrapper {
            width: 100%;
            .message-tit-real-audio {
              margin-left: 4px
            }
          }
        };
        .message-name {
          p {
            display: flex;
            >span {
              &:nth-child(2) {
                padding: 0 5px 0 0;
                box-sizing: border-box;
                flex: 1;
                color: black;
                word-break: break-all
              }
            };
            img {
              width: 27px;
              height: 27px;
              vertical-align: bottom
            }
          }
        };
        .transport-type-wrapper {
          display: flex;
          flex-flow: row nowrap;
          .transport-type-title {
            color: #a0a0a0;
            width: 25%
          };
          .transport-type-content {
            color: black;
            flex: 1;
            > div:not(:first-child) {
              .transport-type-list-title {
                margin-top: 6px
              }
            };
            .transport-type-list-wrapper {
              .transport-type-list {
                > p {
                };
                .transport-type-list-title {
                  font-weight: bold;
                  color: black
                };
                .transport-type-list-content {
                  line-height: 30px
                }
              }
            }
          }
        };
        .handle-message-line-wrapper-other {
          > p {
            span {
              &:first-child {
                width: 35%
              }
            }
          }
        };
        .handle-message-line-wrapper-other-two {
          display: flex;
          flex-flow: row now;
          height: 35px;
          line-height: 35px;
          overflow: auto;
          >p:first-child {
            width: 25%;
            span {
              color: #a0a0a0;
            }
          };
          > p:last-child {
            flex: 1;
            span {
              color: black
            };
            .message-tit-real-destinationList {
              margin-right: 4px
            }
          }
        }
      }
    }
    .office-list-item-start-point {
      width: 93%;
      margin: 0 auto;
      font-size: 15px;
      background: #fff;
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-top: 14px;
      box-sizing: border-box;
      .office-list-left {
        width: 60%;
        margin-right: 4px;
        p {
          width: 100%;
          line-height: 25px;
          &:first-child {
            height: 25px;
            overflow: auto;
            font-size: 13px
          };
          &:last-child {
            word-break: break-all
          }
        }
      };
      .office-list-right {
        height: 78px;
        width: 40%;
        display: flex;
        font-size: 14px;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        p {
          height: 55px;
          width: 55px;
          border-radius: 50%;
          text-align: center;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          background: #88d354;
          > span {
            &:first-child {
              margin-bottom: 2px
            }
          }
          &:last-child {
            background: #217dfc
          }
        };
        .listRightStyle {
          background: #0ee883 !important
        };
        .listRightTwoStyle {
          background: #2aeb53 !important
        }
      }
    };
    .listItemStyle {
      background: #a8ccf8;
      border: none
    };
    .office-list {
      width: 93%;
      margin: 0 auto;
      .office-list-inner-wrapper {
        box-sizing: border-box;
        width: 100%;
        font-size: 0;
        box-sizing: border-box;
        .office-list-item {
          font-size: 16px;
          min-height: 90px;
          padding: 22px 10px;
          display: flex;
          flex-flow: row nowrap;
          background: #fff;
          align-items: center;
          box-sizing: border-box;
          margin-top: 14px;
          position: relative;
          &:last-child {
            margin-bottom: 14px
          }
          .quadrant{
            position: absolute;
            top: 0;
            left: 0;
            width: 22px;
            height: 22px;
            text-align: center;
            line-height: 22px;
            color: #fff;
            font-size: 13px;
            background-color: #bcd8ff;
            -webkit-border-radius: 0 0 20px 0;
          }
          .office-list-left {
            width: 60%;
            margin-right: 4px;
            .office-list-left-top {
              width: 100%;
              line-height: 20px;
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              margin-bottom: 4px;
              >p {
                  font-weight: bolder;
                  overflow: auto;
                  word-break: break-all;
                  flex: 1;
                  font-size: 16px;
                  margin-right: 2px;
                  >span {
                    width: 30px;
                    font-size: 12px;
                    color: #217dfc
                  }
              }  
            };
            .office-list-left-bottom {
              >p {
                span {
                  display: inline-block;
                  width: 100%;
                  overflow: auto;
                  line-height: 20px;
                  word-break: break-all;
                  font-size: 12px
                }
              }
            }
          };
          .office-list-right {
            width: 40%;
            height: 78px;
            display: flex;
            font-size: 14px;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            p {
              height: 55px;
              width: 55px;
              border-radius: 50%;
              text-align: center;
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              color: #fff;
              background: #88d354;
              > span {
                &:first-child {
                  margin-bottom: 2px
                }
              }
              &:last-child {
                background: #217dfc
              }
            };
            .listRightStyle {
              background: #0ee883 !important
            };
            .listRightTwoStyle {
              background: #2aeb53 !important
            }
          }
        };
        .listItemStyle {
          background: #a8ccf8;
          border: none
        }
      }
    }
    .office-list-item-end-point {
      width: 93%;
      margin: 0 auto;
      font-size: 15px;
      background: #fff;
      padding: 10px;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      margin-top: 14px;
      box-sizing: border-box;
      .office-list-left {
        width: 60%;
        margin-right: 4px;
        p {
          width: 100%;
          overflow: auto;
          line-height: 25px;
          word-break: break-all
        }
      };
      .office-list-right {
        height: 78px;
        width: 40%;
        display: flex;
        font-size: 14px;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        p {
          height: 55px;
          width: 55px;
          border-radius: 50%;
          text-align: center;
          display: flex;
          flex-flow: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          background: #88d354;
          > span {
            &:first-child {
              margin-bottom: 2px
            }
          }
          &:last-child {
            background: #217dfc
          }
        };
        .listRightStyle {
          background: #0ee883 !important
        };
        .listRightTwoStyle {
          background: #2aeb53 !important
        }
      }
    };
    .listItemStyle {
      background: #a8ccf8;
      border: none
    };
     .circultion-task-btn {
      width: 95%;
      margin: 0 auto;
      padding: 10px;
      height: auto;
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
    };
    .signature-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      .signature-content-box {
        width: 100%;
        flex: 1;
        display: flex;
        .signature {
          width: 100%;
          /deep/ .signatureBox {
            width: 100% !important
          }
        }
      };
      .btn-area {
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-around;
        align-items: center;
        width: 80%;
        margin: 0 auto;
        .rewrite-box {
          height: 40px;
          margin: 10px 0;
          width: 100px;
          text-align: center;
          span {
            display: inline-block;
            width: 120px;
            height: 40px;
            line-height: 40px;
            background: #fff;
            border-radius: 4px;
            color: black
          }
        };
        .sure-box {
          height: 40px;
          margin: 10px 0;
          width: 100px;
          text-align: center;
          span {
            display: inline-block;
            width: 120px;
            height: 40px;
            line-height: 40px;
            border-radius: 4px;
            color: #fff;
            background: #2895ea
          }
        }
      }  
    }
  }
</style>
