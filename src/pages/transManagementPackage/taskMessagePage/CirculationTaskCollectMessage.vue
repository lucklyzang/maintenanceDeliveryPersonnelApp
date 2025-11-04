<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
     <div class="basic-message">
       <p class="basic-message-title">
          <span>
            <img :src="collectMessagePng" alt="">
          </span>
         科室信息采集
       </p>
       <div class="wait-handle-message">
         <div class="wait-handle-message-top">
           <div class="handle-message-line-wrapper">
             <p>
               <span class="message-tit">床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span>
               <span class="message-tit-real">
                 <van-field v-model="bedNumber" placeholder="请输入"/>
               </span>
             </p>
           </div>
           <div class="handle-message-line-wrapper">
             <p>
               <span class="message-tit">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
               <span class="message-tit-real">
                 <van-field v-model="patientName" placeholder="请输入"/>
               </span>
             </p>
           </div>
           <div class="handle-message-line-wrapper">
             <p>
               <span class="message-tit">标本总数</span>
               <span class="message-tit-real">
                 <van-field v-model="sampleAmount" disabled type="number"/>
               </span>
             </p>
           </div>
         </div>
       </div>
     </div>
     <div class="wait-handle-message-middle" ref="waitHandleMessageMiddle">
       <div class="circulation-area-title">
         <span>标本名称</span>
         <span>数量</span>
       </div>
       <div class="circulation-area" v-for="(item,index) in sampleMessageList" :key="`${item}-${index}`">
         <p v-for="(innerItem, innerIndex) in item.sampleTypeList" :key="`${innerItem}-${innerIndex}`">
           <span>{{innerItem.text}}</span>
           <span>
                  <van-stepper @change="stepperEvent" theme="round" button-size="22px" v-model="innerItem.sampleNumber" min="0"/>
                </span>
         </p>
       </div>
     </div>
    <div class="btn-area" v-show="hideShow">
      <p class="circultion-task-btn-top">
        <span @click="collectMessageSure">确 认</span>
        <span @click="collectMessageCancel">取 消</span>
      </p>
    </div>
     <van-dialog
        v-model="collectMessaheSureShow"
        title="是否收集该科室其它床位标本"
        show-cancel-button
        confirmButtonText="确定"
        cancelButtonText="取消"
        :close-on-popstate="false"
        :close-on-click-overlay="true"
        @confirm="collectSure"
        @cancel="collectCancel"
      >
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import { querySampleMessage} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore, removeStore, IsPC, checkEmptyArray, deepClone, repeArray } from '@/common/js/utils'
export default {
  name: 'circulationTaskCollectMessage',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      bedNumber: '',
      patientName: '',
      sampleAmount: 0,
      collectMessaheSureShow: false,
      isDialogShow: false,
      isNoSampleDialogShow: false,
      isNoBedInfoShow: false,
      sampleMessageList: [
        {
          sampleTypeList: []
        }
      ],
      temporaryInfo: [],
      temporarySampleTypeList: [],
      collectMessagePng: require('@/common/images/home/collect-message.png'),
      taskIncreasePng: require('@/components/images/task-increase.png'),
      taskDeletePng: require('@/components/images/task-delete.png'),
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png'),
      hideShow: true
    }
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom
  },

  watch: {
  },

  mounted () {
    this.keyboardEventDispose();
    this.parallelFunction();
    // 回显收集过的科室信息
    this.echoCollectedMessage();
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (!this.isDialogShow) {
          this.loseDataInfo();
          return
        };
        if (!this.isNoSampleDialogShow) {
          this.noSampleInfo();
          return
        };
        if (!this.isNoBedInfoShow) {
          this.noBedInfo();
          return
        };
        if (this.collectMessaheSureShow)  {
          this.collectMessaheSureShow = true
        }
      })
    }
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'completeDeparnmentInfo',
      'circulationTaskMessage',
      'circulationCollectMessageList',
      'isDeleteEcho',
      'isDeleteCancel',
      'isClickSure',
      'circulationDetails',
      'verifyCirculationOfficeId',
      'chooseHospitalArea',
      'userInfo'
    ]),
    sex () {
      return this.userInfo['worker']['extendData']['sex']
    },
    userTypeId () {
      return this.isMedicalMan
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
    },
    circulationTaskId () {
      return this.circulationDetails.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationCollectMessageList',
      'changeIsrefreshCirculationConnectPage',
      'changeCompleteDeparnmentInfo',
      'changeIsDeleteCancel',
      'changeIsDeleteEcho',
      'changeIsClickSure'
    ]),

    beforeDestroy() {
      window.removeEventListener('resize');
    },

    // 键盘事件处理
    keyboardEventDispose () {
      const originalHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const waitHandleMessageMiddleHeight = this.$refs['waitHandleMessageMiddle'].offsetHeight;
      window.onresize = () => {
        return (() => {
          //键盘弹起与隐藏都会引起窗口的高度发生变化
          const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight;
            if (resizeHeight - 0 < originalHeight - 0) {
              document.querySelector("body").setAttribute("style","height:" + originalHeight + "px !important;");
              document.querySelector(".content-wrapper").setAttribute("style","height:" + originalHeight + "px !important;");
              document.querySelector(".wait-handle-message-middle").setAttribute("style","height:" + waitHandleMessageMiddleHeight + "px !important;flex:none !important");
              this.hideShow = false;
            } else {
              document.querySelector("body").setAttribute("style", "height:100vh !important");
              document.querySelector(".content-wrapper").setAttribute("style", "height:100vh !important");
              document.querySelector(".wait-handle-message-middle").style.removeProperty('height');
              document.querySelector(".wait-handle-message-middle").setAttribute("style","flex:1 !important");
              this.hideShow = true;
            }
        })()
      }
    },

     // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },

      // 计数器变化回调
      stepperEvent (value) {
        let emptyArr = [];
        for (let item of this.sampleMessageList[0].sampleTypeList) {
          for (let val in item) {
            if (val == 'sampleNumber') {
              emptyArr.push(item[val])
            }
          }
        };
        if (emptyArr.length>0) {
            this.sampleAmount = emptyArr.reduce((prev, curr) => {
            return Number(prev) + Number(curr);
          },0)
        };
      },

      // 丢失数据提示
      loseDataInfo () {
        this.isDialogShow = false;
        this.isNoBedInfoShow = true;
        this.isNoSampleDialogShow = true;
        this.$dialog.alert({
          message: '返回上页后,将丢失本科室采集数据!',
          closeOnPopstate: false,
          showCancelButton: true
        }).then(() => {
          this.temporaryInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryInfo});
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryInfo});
          this.isDialogShow = true;
          this.isNoSampleDialogShow = true;
          this.isNoBedInfoShow = true;
          this.collectMessaheSureShow = false
          this.skipSweepCode();
        })
        .catch((err) => {
          this.isDialogShow = false;
          this.isNoBedInfoShow = true;
          this.isNoSampleDialogShow = true;
          this.collectMessaheSureShow = false
        })
      },

      // 没有标本采集提示
      noSampleInfo () {
        this.isDialogShow = true;
        this.isNoBedInfoShow = true;
        this.isNoSampleDialogShow = false;
        this.$dialog.alert({
          message: '该科室没有需要采集的标本?',
          closeOnPopstate: false,
          showCancelButton: true
        }).then(() => {
          // 存储完成采集任务的科信息
          let temporaryDepartmentId = [];
          let temporaryCompleteInfo = [];
          temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
          let temporaryIndex = this.completeDeparnmentInfo.indexOf(this.completeDeparnmentInfo.filter((item) => { return item.taskId == this.circulationTaskId})[0]);
          if (this.completeDeparnmentInfo.length > 0) {
            if (temporaryIndex != -1) {
              temporaryDepartmentId = temporaryCompleteInfo[temporaryIndex]['departmentIdList'];
              temporaryDepartmentId.push(this.verifyCirculationOfficeId);
              temporaryCompleteInfo[temporaryIndex]['departmentIdList'] = temporaryDepartmentId
            } else {
              temporaryDepartmentId.push(this.verifyCirculationOfficeId);
              temporaryCompleteInfo.push(
                {
                  departmentIdList: temporaryDepartmentId,
                  taskId: this.circulationTaskId
                }
              )
            }
          } else {
            temporaryDepartmentId.push(this.verifyCirculationOfficeId);
            temporaryCompleteInfo.push(
              {
                departmentIdList: temporaryDepartmentId,
                taskId: this.circulationTaskId
              }
            )
          };
          this.changeCompleteDeparnmentInfo({DtMsg: temporaryCompleteInfo});
          setStore('completeDepartmentMessage',{"sureInfo": temporaryCompleteInfo});
          this.isNoSampleDialogShow = true;
          this.isDialogShow = true;
          this.isNoBedInfoShow = true;
          this.collectMessaheSureShow = false;
          this.$router.push({'path':'/circulationDetails'});
          this.changeTitleTxt({tit:'任务详情'});
          setStore('currentTitle','任务详情')
        })
        .catch(() => {
          this.isNoSampleDialogShow = true;
          this.isNoBedInfoShow = true;
          this.isDialogShow = false;
          this.collectMessaheSureShow = false
        });
      },

      // 床位信息不能为空提示
      noBedInfo () {
        this.isNoBedInfoShow = false;
        this.isDialogShow = true;
        this.isNoSampleDialogShow = true;
        this.$dialog.alert({
          message: '标本信息不能为空',
          closeOnPopstate: false
        })
        .then(() => {
          this.isNoSampleDialogShow = true;
          this.isDialogShow = false;
          this.isNoBedInfoShow = true;
          this.collectMessaheSureShow = false
        })
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

    echoCollectedMessage () {
      if (this.circulationCollectMessageList.length == 0) { return };
      let echoIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
      if (echoIndex == -1) { return };
      // 回显上次科室采集最后一个床位信息
      let temporaryEchoList = [];
      temporaryEchoList.push(deepClone(this.circulationCollectMessageList[echoIndex]['collectDepartmentList'][this.circulationCollectMessageList[echoIndex]['collectDepartmentList'].length-1]));
      this.bedNumber = temporaryEchoList[0]['bedNumber'];
      this.patientName = temporaryEchoList[0]['patientName'];
      this.sampleAmount = temporaryEchoList[0]['sampleAmount'];
      this.sampleMessageList[0].sampleTypeList = temporaryEchoList[0]['sampleMessageList'];
      this.changeIsDeleteEcho(true);
      setStore('isDeleteEcho',true);
    },

      // 并行查询标本信息和检查项信息
      parallelFunction () {
        Promise.all([this.getSampleMessage()])
        .then((res) => {
          if (res && res.length > 0) {
            let [item1] = res;
            if (item1) {
              for (let item of item1) {
                this.sampleMessageList[0].sampleTypeList.push({
                  text: item.specimenName,
                  value: item.id,
                  sampleNumber:0
                })
              };
              // 标本信息存入locaStorage
              setStore('sampleInfo',{sampleKey:this.sampleMessageList[0].sampleTypeList});
              this.temporarySampleTypeList = this.sampleMessageList[0].sampleTypeList
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

    // 查询标本信息
    getSampleMessage () {
      return new Promise((resolve,reject) => {
        querySampleMessage(
          { proId: this.proId, // 项目ID 必输
            state: 0  //查询状态，0-启用，1-禁用，固定传 0
          })
          .then((res) => {
            this.sampleMessageList[0].sampleTypeList = [];
            if (res && res.data.code == 200) {
              if (res.data.data.length > 0) {
                resolve(res.data.data)
              }
            }
          })
          .catch((err) => {
            reject(err.message)
          })
      })
    },


    // 返回上一页
    backTo () {
      this.loseDataInfo()
    },

    // 重复赋值封装
    repeatAssignment () {
      this.isDialogShow = true;
      this.isNoBedInfoShow = true;
      this.isNoSampleDialogShow = true;
      this.collectMessaheSureShow = true
    },

    // 采集信息确认事件
    collectMessageSure () {
      // 如果当前任务当前科室没有采集信息，则不签名和提交采集信息确认
      if (this.circulationCollectMessageList.length == 0) {
        if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
          this.noSampleInfo();
        } else {
          this.repeatAssignment()
        }
      } else {
        let echoIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => { return item.taskId == this.circulationTaskId})[0]);
        if (echoIndex == -1 ) {
          if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
            this.noSampleInfo()
          } else {
            this.repeatAssignment()
          }
        } else {
          let currentList = this.circulationCollectMessageList[echoIndex]['collectDepartmentList'];
          if (currentList.length == 0) {
            if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
              this.noSampleInfo()
            } else {
              this.repeatAssignment()
            }
          } else {
            if (this.bedNumber == '' && this.patientName == '' && this.sampleAmount == 0) {
              this.noBedInfo()
            } else {
              this.repeatAssignment()
            }
          }
        }
      }
    },

    // 收集是否完成弹框确定事件
    collectSure () {
      this.changeIsClickSure(true);
      setStore('isClickSure',true);
      // store和localStorage同时存储采集的信息
      let temporaryDepartmentList = [];
      let currentCollectAllMessageSure = [];
      currentCollectAllMessageSure = deepClone(this.circulationCollectMessageList);
      if (this.circulationCollectMessageList.length > 0) {
        let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        if (temporaryIndex != -1) {
          // 过滤数量为0的标本
          let temporarySanpleList = this.sampleMessageList[0]['sampleTypeList'].filter((item) => {return item.sampleNumber !== 0});
          if (this.isDeleteCancel || this.isDeleteEcho) {
            // 防止最后一条信息重复存入
            let spliceInfo = [];
            let temporaryCollectInfo = deepClone(currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList']);
            spliceInfo = temporaryCollectInfo.splice(temporaryCollectInfo.length-1,1);
            currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'] = temporaryCollectInfo;
            this.changeIsDeleteCancel(false);
            this.changeIsDeleteEcho(false);
            setStore('isDeleteCancel',false);
            setStore('isDeleteEcho',false);
            temporaryDepartmentList = currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentList.push({
              sampleMessageList: temporarySanpleList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          } else {
            temporaryDepartmentList = currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentList.push({
              sampleMessageList: temporarySanpleList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          }
          currentCollectAllMessageSure[temporaryIndex]['collectDepartmentList'] = repeArray(temporaryDepartmentList)
        } else {
          // 过滤数量为0的标本
          let temporarySanpleList = this.sampleMessageList[0]['sampleTypeList'].filter((item) => {return item.sampleNumber !== 0});
          temporaryDepartmentList.push({
            sampleMessageList: temporarySanpleList,
            bedNumber: this.bedNumber,
            patientName: this.patientName,
            sampleAmount: this.sampleAmount
          });
          currentCollectAllMessageSure.push({
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentList
          })
        }
      } else {
        // 过滤数量为0的标本
        let temporarySanpleList = this.sampleMessageList[0]['sampleTypeList'].filter((item) => {return item.sampleNumber !== 0});
        temporaryDepartmentList.push({
          sampleMessageList: temporarySanpleList,
          bedNumber: this.bedNumber,
          patientName: this.patientName,
          sampleAmount: this.sampleAmount
        });
        currentCollectAllMessageSure.push(
          {
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentList
          }
        )
      };
      this.changeCirculationCollectMessageList({DtMsg:currentCollectAllMessageSure});
      setStore('currentCirculationCollectMessage',{innerMessage:currentCollectAllMessageSure});
      // 清空上个床位的页面数据信息
      this.bedNumber = '';
      this.patientName = '';
      this.sampleAmount = 0;
      this.sampleMessageList = [
        {
          sampleTypeList: []
        }
      ];
      this.isDialogShow = false;
      this.isNoSampleDialogShow = true;
      this.isNoBedInfoShow = true;
      this.collectMessaheSureShow = false;
      this.parallelFunction();
    },

    // 收集是否完成弹框取消事件
    collectCancel () {
      // store和localStorage同时存储采集的信息
      let temporaryDepartmentListTwo = [];
      let currentCollectAllMessageCancel = [];
      currentCollectAllMessageCancel = deepClone(this.circulationCollectMessageList);
      if (this.circulationCollectMessageList.length > 0) {
        let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        if (temporaryIndex != -1) {
          // 过滤数量为0的标本
          let temporarySanpleList = this.sampleMessageList[0]['sampleTypeList'].filter((item) => {return item.sampleNumber !== 0});
          if (this.isDeleteCancel || this.isDeleteEcho) {
            // 防止最后一条信息重复存入
            let spliceInfo = [];
            let temporaryCollectInfo = deepClone(currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList']);
            spliceInfo = temporaryCollectInfo.splice(temporaryCollectInfo.length-1,1);
            currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'] = temporaryCollectInfo;
            this.changeIsDeleteCancel(false);
            this.changeIsDeleteEcho(false);
            setStore('isDeleteCancel',false);
            setStore('isDeleteEcho',false);
            temporaryDepartmentListTwo = currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentListTwo.push({
              sampleMessageList: temporarySanpleList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          } else {
            temporaryDepartmentListTwo = currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'];
            temporaryDepartmentListTwo.push({
              sampleMessageList: temporarySanpleList,
              bedNumber: this.bedNumber,
              patientName: this.patientName,
              sampleAmount: this.sampleAmount
            });
          }
          currentCollectAllMessageCancel[temporaryIndex]['collectDepartmentList'] = repeArray(temporaryDepartmentListTwo)
        } else {
          // 过滤数量为0的标本
          let temporarySanpleList = this.sampleMessageList[0]['sampleTypeList'].filter((item) => {return item.sampleNumber !== 0});
          temporaryDepartmentListTwo.push({
            sampleMessageList: temporarySanpleList,
            bedNumber: this.bedNumber,
            patientName: this.patientName,
            sampleAmount: this.sampleAmount
          });
          currentCollectAllMessageCancel.push({
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentListTwo
          })
        }
      } else {
        // 过滤数量为0的标本
        let temporarySanpleList = this.sampleMessageList[0]['sampleTypeList'].filter((item) => {return item.sampleNumber !== 0});
        temporaryDepartmentListTwo.push({
          sampleMessageList: temporarySanpleList,
          bedNumber: this.bedNumber,
          patientName: this.patientName,
          sampleAmount: this.sampleAmount
        });
        currentCollectAllMessageCancel.push(
          {
            taskId: this.circulationTaskId,
            collectDepartmentList: temporaryDepartmentListTwo
          }
        )
      };
      this.changeCirculationCollectMessageList({DtMsg:currentCollectAllMessageCancel});
      setStore('currentCirculationCollectMessage',{innerMessage:currentCollectAllMessageCancel});
      this.isDialogShow = true;
      this.isNoSampleDialogShow = true;
      this.isNoBedInfoShow = true;
      this.collectMessaheSureShow = false;
      this.$router.push({path:'/circulationTaskCollectMessageSure'});
      this.changeTitleTxt({tit:'采集信息确认'});
      setStore('currentTitle','采集信息确认');
      console.log('收集信息',this.circulationCollectMessageList)
    },

    // 采集信息取消事件
    collectMessageCancel () {
      // 当前没有收集到任何数据时跳到扫码页面
      if (this.circulationCollectMessageList.length == 0) {
        this.changeCirculationCollectMessageList({DtMsg:[]});
        removeStore('currentCirculationCollectMessage');
        this.skipSweepCode()
      } else {
        // 有数据则回显该科室上个床位收集页面
        let temporaryBedCollectMsg = [];
        let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        // 判断有没有点击弹框确定按钮
        if (temporaryIndex != -1) {
          if (this.isClickSure) {
            // 点过确定按钮
            this.changeIsClickSure(false);
            setStore('isClickSure',false);
            temporaryBedCollectMsg.push(deepClone(this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'][this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length-1]));
            this.bedNumber = temporaryBedCollectMsg[0]['bedNumber'];
            this.patientName = temporaryBedCollectMsg[0]['patientName'];
            this.sampleAmount = temporaryBedCollectMsg[0]['sampleAmount'];
            this.sampleMessageList[0]['sampleTypeList'] =  temporaryBedCollectMsg[0]['sampleMessageList'];
            console.log('取消', this.circulationCollectMessageList[temporaryIndex]);
          } else {
            if (this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length == 1) {
              this.bedNumber = '';
              this.patientName = '';
              this.sampleAmount = 0;
              this.sampleMessageList = [
                {
                  sampleTypeList: []
                }
              ];
              this.parallelFunction();
              let temporaryInnerInfo = deepClone(this.circulationCollectMessageList);
              temporaryInnerInfo = temporaryInnerInfo.filter((item) => {return item.taskId != this.circulationTaskId});
              this.changeCirculationCollectMessageList({DtMsg:temporaryInnerInfo});
              setStore('currentCirculationCollectMessage',{innerMessage:temporaryInnerInfo})
            } else {
              if (this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length == 0) {
                // 该科室没有任何床位信息时则删除该科室上的循环任务存储信息
                let temporaryInnerInfo = deepClone(this.circulationCollectMessageList);
                temporaryInnerInfo = temporaryInnerInfo.filter((item) => {return item.taskId != this.circulationTaskId});
                this.changeCirculationCollectMessageList({DtMsg:temporaryInnerInfo});
                setStore('currentCirculationCollectMessage',{innerMessage:temporaryInnerInfo});
                this.skipSweepCode()
              } else {
                // 没点过则删除当前采集页的数据
                let currentCollectList = deepClone(this.circulationCollectMessageList);
                let temporaryCollectInfo = deepClone(currentCollectList[temporaryIndex]['collectDepartmentList']);
                temporaryCollectInfo.splice(temporaryCollectInfo.length-1,1);
                currentCollectList[temporaryIndex]['collectDepartmentList'] = temporaryCollectInfo;
                this.changeCirculationCollectMessageList({DtMsg:currentCollectList});
                setStore('currentCirculationCollectMessage',{innerMessage:currentCollectList});
                temporaryBedCollectMsg.push(deepClone(this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'][this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList'].length-1]));
                this.bedNumber = temporaryBedCollectMsg[0]['bedNumber'];
                this.patientName = temporaryBedCollectMsg[0]['patientName'];
                this.sampleAmount = temporaryBedCollectMsg[0]['sampleAmount'];
                this.sampleMessageList[0]['sampleTypeList'] =  temporaryBedCollectMsg[0]['sampleMessageList']
              }
            }
          };
          this.changeIsDeleteCancel(true);
          setStore('isDeleteCancel',true);
        } else {
          this.temporaryInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryInfo});
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryCollectInfo});
          this.skipSweepCode()
        }
      }
    },

    // 跳转到扫码页
    skipSweepCode () {
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情')
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
    background: #f6f6f6;
    min-height: 0;
    height: 100vh;
    font-size: 14px;
      .left-dropDown {
      .rightDropDown
    };
    .basic-message {
      width: 93%;
      margin: 0 auto;
      margin-top: 14px;
      height: auto;
      display: flex;
      flex-flow: column;
      position: relative;
      background: #fff;
      padding: 20px;
      box-sizing: border-box;
      .basic-message-title {
        font-size: 18px;
        color: #1a89fd;
        margin-top: 8px;
        margin-bottom: 16px;
        span {
          display: inline-block;
          height: 14px;
          width: 14px;
          vertical-align: top;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
      .wait-handle-message {
        width: 100%;
        display: flex;
        flex: 1;
        flex-flow: column wrap;
        .wait-handle-message-top {
        };
        .handle-message-line-wrapper {
          height: 50px;
          p {
            display: flex;
            height: 50px;
            line-height: 50px;
            flex-flow: row nowrap;
            color: #a0a0a0;
            span {
              height: 36px;
              line-height: 36px;
              display: inline-block;
              margin-top: 7px;
            };
            span:first-child {
              width: 25%
            };
            span:last-child {
              flex: 1;
              color: black;
              /deep/ .van-cell {
                background: #f9f9f9;
                line-height: 36px;
                height: 36px;
                padding: 0 8px;
              }
            }
          }
        };
      }
    };
    .wait-handle-message-middle {
      width: 93%;
      margin: 0 auto;
      margin-top: 14px;
      padding: 20px;
      box-sizing: border-box;
      background: #fff;
      flex: 1;
      overflow: auto;
      display: flex;
      flex-flow: column;
      .circulation-area {
          flex: 1;
          overflow: auto;
          font-size: 15px;
          color: #656565;
          > p {
            position: relative;
            height: 40px;
            margin-bottom:4px;
            &:last-child {
              margin-bottom:0
            }
            span {
              height: 40px;
              line-height: 40px;
              position: absolute;
              display: inline-block;
              text-align: center;
              width: 50%;
              overflow: auto;
              &:first-child {
                top: 0;
                left:0;
              }
              &:last-child {
                top: 0;
                right:0;
                /deep/ .van-stepper {
                  .van-stepper__minus {
                    background: #505050;
                    color: #fff;
                    border: none
                  };
                  .van-stepper__plus {
                    background: #505050;
                    color: #fff;
                    border: none
                  }
                }
              }
            }
          }
        };
        .circulation-area-title {
          font-size: 15px;
          height: 36px;
          line-height: 36px;
          color: black;
          margin-bottom: 10px;
          background: #ececec;
          position: relative;
          span {
            display: inline-block;
            width: 50%;
            position: absolute;
            text-align: center;
            &:first-child {
              top: 0;
              left:0;
              text-align: center;
            }
            &:last-child {
              top: 0;
              right:0;
              text-align: center
            }
          }
        }
    };
    .btn-area {
      width: 93%;
      margin: 0 auto;
      height: 60px;
      span {
        vertical-align: top;
        display: inline-block;
        line-height: 40px;
        height: 40px;
        background: #2895ea;
        color: #fff;
        text-align: center
      }
      .circultion-task-btn-top {
        margin-top: 10px;
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        span {
          border-radius: 4px;
          &:first-child {
            width: 50%;
            margin-right: 10px;
            background-image: linear-gradient(to right, #37d4fd , #429bff);
          }
          &:last-child {
            width: 50%;
            height: 38px;
            line-height: 38px;
            background: #fff;
            color: #1b88ff;
            border: 1px solid #1b88ff;
          }
        }
      }
    }
  }
</style>
