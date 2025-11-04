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
    <div class="sweep-code-title">
        <span>
          <img :src="collectMessagePng" alt="">
        </span>
     科室信息采集确认
    </div>
    <div class="bed-number-list-outer">
      <div class="wait-handle-message" v-for="(outerItem,index) in allcirculationCollectMessageList" :key="`${outerItem}-${index}`">
        <div class="wait-handle-message-top">
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号</span>
              <span class="message-tit-real">
                 <van-field v-model="outerItem.bedNumber" disabled/>
               </span>
            </p>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名</span>
              <span class="message-tit-real">
                 <van-field v-model="outerItem.patientName" disabled />
               </span>
            </p>
          </div>
          <div class="handle-message-line-wrapper">
            <p>
              <span class="message-tit">标本总数</span>
              <span class="message-tit-real">
                 <van-field v-model="outerItem.sampleAmount" disabled  type="number"/>
               </span>
            </p>
          </div>
        </div>
        <div class="wait-handle-message-middle">
          <div class="circulation-area-title">
            <span>标本名称</span>
            <span>数量</span>
          </div>
          <div class="circulation-area">
            <p v-for="(innerItem,innerIndex) in outerItem.sampleMessageList" :key="`${innerItem}-${innerIndex}`">
              <span>{{innerItem.text}}</span>
              <span>
              <van-stepper v-model="innerItem.sampleNumber" theme="round" button-size="22px" min="0" disabled />
            </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="electronic-signature"  v-if="showSignature">
      <ElectronicSignature ref="mychild"></ElectronicSignature>
    </div>
    <div class="rewrite-box" v-if="showSignature">
      <span @click="rewrite">重写</span>
    </div>
    <div class="btn-area">
      <p class="circultion-task-btn-top">
        <span @click="collectMessageSure">确 认</span>
        <span @click="collectMessageCancel">取 消</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import ElectronicSignature from '@/components/ElectronicSignature'
import FooterBottom from '@/components/FooterBottom'
import {collectSampleInfo, updateCirculationTask} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import {  setStore, getStore, IsPC,  deepClone } from '@/common/js/utils'
export default {
  name: 'circulationTaskCollectMessageSure',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      showSignatureBox: false,
      isClickCancelBtn: false,
      liIndex: null,
      isDialogShow: false,
      showSignature: false,
      allcirculationCollectMessageList: [],
      bedNumber: '',
      patientName: '',
      sampleAmount: '',
      sampleMessageList: [
        {
          sampleType: '',
          innerSampleAmount: '',
          sampleTypeList: [],
          entryList: [],
          checkEntryList: []
        }
      ],
      temporaryCollectInfo: [],
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png'),
      collectMessagePng: require('@/common/images/home/collect-message.png')
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom,
    ElectronicSignature
  },

  mounted () {
    console.log('id',this.circulationTaskId);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (!this.isDialogShow) {
          this.loseDataInfo();
          return
        };
      })
    };
    this.echoCollectMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'originalSignature',
      'currentElectronicSignature',
      'circulationCollectMessageList',
      'circulationTaskMessage',
      'completeDeparnmentInfo',
      'verifyCirculationOfficeId',
      'circulationDetails',
      'chooseHospitalArea',
      'userInfo'
    ]),
    proId() {
      return this.chooseHospitalArea['value']
    },
    circulationTaskId () {
      return this.circulationDetails.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationCollectMessageList',
      'changeCompleteDeparnmentInfo',
      'changeCurrentElectronicSignature'
    ]),

    // 我的页面
    skipMyInfo () {
    },

    // 丢失数据提示
    loseDataInfo () {
      this.isDialogShow = false;
      this.showSignatureBox = true;
      this.$dialog.alert({
        message: '返回上级后,将丢失本页及本科室的数据',
        closeOnPopstate: false,
        showCancelButton: true
        }).then(() => {
          this.temporaryCollectInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          // 清空本次签名信息
          this.changeCurrentElectronicSignature({DtMsg: null});
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryCollectInfo});
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryCollectInfo});
          this.$router.push({path:'/circulationTaskCollectMessage'});
          this.changeTitleTxt({tit:'循环信息采集'});
          setStore('currentTitle','循环信息采集');
          this.isDialogShow = true;
          this.showSignatureBox = true;
        })
        .catch(() => {
          this.isDialogShow = false;
          this.showSignatureBox = true
        })
    },


    // 更新循环任务状态
    updateCirculationtaskState (data) {
      updateCirculationTask(data).then((res) => {
        if (res && res.data.code == 200) {

        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: false
        }).then(() => {
        });
      })
    },

    // 重写
    rewrite () {
      try {
        this.$refs.mychild.overwrite()
      } catch (err) {
        
      }
    },

    // 回显已经采集信息
    echoCollectMessage () {
      this.allcirculationCollectMessageList = [];
      let temporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
      this.allcirculationCollectMessageList = deepClone(this.circulationCollectMessageList[temporaryIndex]['collectDepartmentList']);
      console.log('wq',this.allcirculationCollectMessageList);
    },

     // 收集标本信息
    getSampleMessage (data) {
      collectSampleInfo(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
          });
          // 清空当前页面回显数据
          this.allcirculationCollectMessageList = [];
          this.temporaryCollectInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          // 清空本次签名信息
          this.changeCurrentElectronicSignature({DtMsg: null});
          // 清空上一页面store科室采集数据
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryCollectInfo});
          // 清空上一页面Localstorage的科室采集数据
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryCollectInfo});
          // 存储完成采集任务的科室信息
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
          this.$router.push({'path':'/circulationDetails'});
          this.changeTitleTxt({tit:'任务详情'});
          setStore('currentTitle','任务详情');
        } else {
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: false
          }).then(() => {
          });
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: false
        }).then(() => {
        });
      })
    },

    // 返回上一页
    backTo () {
      this.loseDataInfo()
    },

    // 采集信息确认事件
    collectMessageSure () {
      // this.$refs.mychild.commitSure();
      // if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
      //   return
      // };
      let submitCollectMsg = {
        proId: this.proId,   //项目ID
        taskId: this.circulationTaskId,   //任务ID
        departmentId: this.verifyCirculationOfficeId, //科室ID
        singImg: '', //签名照片this.currentElectronicSignature
        specList: []
      };
      let currentTemporaryIndex = this.circulationCollectMessageList.indexOf(this.circulationCollectMessageList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
      let temporaryCollectInfoList = deepClone(this.circulationCollectMessageList[currentTemporaryIndex]['collectDepartmentList']);
      if (temporaryCollectInfoList.length > 0) {
        for (let i = 0, len = temporaryCollectInfoList.length; i < len; i++) {
          submitCollectMsg['specList'].push(
            {
              patientName: temporaryCollectInfoList[i].patientName,  //病人姓名
              bedNumber: temporaryCollectInfoList[i].bedNumber,  //病人床号
              totalNum: temporaryCollectInfoList[i].sampleAmount, //总数量
              specimen: [] //标本list
            }
          );
          if (temporaryCollectInfoList[i].sampleMessageList.length > 0) {
            for (let j = 0, len = temporaryCollectInfoList[i].sampleMessageList.length; j < len; j++) {
              submitCollectMsg['specList'][i]['specimen'].push(
                {
                  specimenId: temporaryCollectInfoList[i].sampleMessageList[j].value,    //标本ID
                  specimenName: temporaryCollectInfoList[i].sampleMessageList[j].text, //标本名称
                  quantity: temporaryCollectInfoList[i].sampleMessageList[j].sampleNumber,  //标本数量
                  checkItems: {} //检查项
                }
              )
            }
          }
        };
        console.log('最终标本信息',submitCollectMsg);
      }
      this.getSampleMessage(submitCollectMsg)
    },

    // 采集信息确认取消事件
    collectMessageCancel () {
      this.$dialog.alert({
        message: '取消确认后,将丢失本页及本科室的采集数据',
        closeOnPopstate: false,
        showCancelButton: true
        })
        .then(() => {
          // 当前页面回显数据
          this.allcirculationCollectMessageList = [];
          this.temporaryCollectInfo = deepClone(this.circulationCollectMessageList.filter((item) => {return item['taskId'] != this.circulationTaskId}));
          this.changeCurrentElectronicSignature({DtMsg: null});
          // 上一页面store采集数据
          this.changeCirculationCollectMessageList({DtMsg: this.temporaryCollectInfo});
          // 上一页面Localstorage采集数据
          setStore('currentCirculationCollectMessage',{innerMessage: this.temporaryCollectInfo});
          this.$router.push({path:'/circulationTaskCollectMessage'});
          this.changeTitleTxt({tit:'信息采集'});
          setStore('currentTitle','信息采集')})
      .catch(() => {})
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
    font-size: 14px;
      .left-dropDown {
      .rightDropDown
    }
    .sweep-code-title {
      font-size: 18px;
      color: #1a89fd;
      width: 93%;
      margin: 0 auto;
      margin-top: 10px;
      background: #fff;
      padding: 14px;
      box-sizing: border-box;
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
    };
    .bed-number-list-outer {
      flex:1;
      overflow: auto;
      padding: 14px;
      box-sizing: border-box;
      width: 93%;
      margin-top: 10px;
      margin-left: 3.5%;
      background: #fff;
      .wait-handle-message {
        width: 100%;
        display: flex;
        flex: 1;
        flex-flow: column wrap;
        border-bottom: 1px solid #dddddd;
        &:last-child {
          border: none;
        };
        .wait-handle-message-top {
        };
        .wait-handle-message-middle {
          width: 100%;
          margin: 0 auto;
          margin-top: 14px;
          background: #fff;
          overflow: auto;
          flex: 1;
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
                overflow: auto;
                width: 50%;
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
              };
              &:last-child {
                top: 0;
                right:0;
                text-align: center
              }
            }
          }
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
    }
    .electronic-signature {
      height: 250px
    }
    .rewrite-box {
      height: 40px;
      margin: 10px 0;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        background: #fff;
        border-radius: 3px;
        color: #888888;
        border: 1px solid #ebebeb
      }
    };
    .btn-area {
      width: 93%;
      margin: 0 auto;
      padding: 10px 0;
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
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
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
