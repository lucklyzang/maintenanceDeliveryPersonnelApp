<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="content">
      <div class="basic-message">
        <p class="basic-mesage-state">
          <img :src="stateTransferImg(circulationDetails.state)" alt="">
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
               <P>
                 <span class="message-tit">任&nbsp;&nbsp;务&nbsp;&nbsp;名&nbsp;&nbsp;&nbsp;称 :&nbsp;</span>
                 <span class="message-tit-real">{{circulationDetails.taskTypeName}}</span>
               </P>
             </div>
             <div class="handle-message-line-wrapper">
               <P>
                 <span class="message-tit">预计开始时间 :&nbsp;</span>
                 <span class="message-tit-real">{{circulationDetails.startTime}}</span>
               </P>
             </div>
             <div class="handle-message-line-wrapper">
               <P>
                 <span class="message-tit">实际开始时间 :&nbsp;</span>
                 <span class="message-tit-real">{{circulationDetails.startUpTime}}</span>
               </P>
             </div>
             <div class="handle-message-line-wrapper" v-show="this.isNewCircle">
               <P>
                 <span class="message-tit">已收集标本包数 :&nbsp;</span>
                 <span class="message-tit-real">{{circulationDetails.packages}}</span>
               </P>
             </div>
             <div class="handle-message-line-wrapper" v-show="this.isNewCircle">
               <P>
                 <span class="message-tit">未送达标本包数 :&nbsp;</span>
                 <span class="message-tit-real">{{circulationDetails.notArrive}}</span>
               </P>
             </div>
           </div>
        </div>
      </div>
      <div class="office-list">
        <div class="office-list-inner-wrapper">
          <p :class="{officeCheckStyle: drawCompleteTaskIdList.indexOf(circulationDetails.id) != -1 && item.check == true}" v-for="(item,index) in circulationDetails.spaces" :key="`${item}-${index}`">
            {{item.text}}
          </p>
        </div>
      </div>
    </div>
    <div class="circultion-task-btn">
      <p class="circultion-task-btn-top" v-show="circulationDetails.state != 7">
        <span @click="joinSweepCode">扫描二维码</span>
        <span @click="circulationTaskArrived">送达</span>
      </p>
      <p class="circultion-task-btn-middle" v-show="circulationDetails.state == 7">
        <span @click="backTo">返回</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="circulationDetails.state != 7 && isNewCircle">
        <span @click="skipCurrentSample">当前标本信息</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {} from '@/api/trans/medicalPort.js'
import {getCirculationTaskMessageById} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import {  setStore,  IsPC, removeBlock } from '@/common/js/utils'
export default {
  name: 'circulationDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      circulationTaskList: [],
      drawCompleteTaskIdList: [],
      taskArrivedPng: require('@/components/images/task-arrived.png'),
      taskSweepCodePng: require('@/components/images/task-sweep-code.png'),
      taskInfoPng: require('@/common/images/home/basic-message.png'),
      noEndPng: require('@/common/images/home/no-end.png'),
      noReferPng: require('@/common/images/home/no-refer.png'),
      noStartPng: require('@/common/images/home/no-start.png'),
      taskFinshedPng: require('@/common/images/home/task-finshed.png'),
      taskGoingPng: require('@/common/images/home/task-going.png'),
      waitSurePng: require('@/common/images/home/wait-sure.png')
    }
  },

  components: {
    HeaderTop,
    NoData,
    FooterBottom
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'circulationDetails',
      'completeDeparnmentInfo',
      'circulationTaskId',
      'isNewCircle'
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
    }
  },

  mounted () {
    console.log('详细信息',this.circulationDetails);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.circulationDetails.state == 7) {
          this.changeIsFreshCirculationTaskPage(false)
        } else {
          this.changeIsFreshCirculationTaskPage(true)
        };
        this.$router.push({path:'/circulationTask'});
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      })
    };
    this.getTaskMessage();
    this.drawTaskId()
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeArriveDepartmentId',
      'changeIsCollectEnterSweepCodePage',
      'changeIsFreshCirculationTaskPage',
      'changeCirculationDetails'
    ]),

    // 返回上一页
    backTo () {
      if (this.circulationDetails.state == 7) {
        this.changeIsFreshCirculationTaskPage(false)
      } else {
        this.changeIsFreshCirculationTaskPage(true)
      };
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
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

    // 获取任务详情
    getTaskMessage () {
      getCirculationTaskMessageById(this.circulationTaskId)
      .then((res) => {
        this.circulationTaskList = [];
        let temporaryTaskListFirst = [];
        if (res && res.data.code == 200) {
          if (JSON.stringify(res.data.data) !== "{}") {
            temporaryTaskListFirst.push(
              {
                createTime: res.data.data.createTime,
                startTime: res.data.data.startTime,
                proName: res.data.data.proName,
                officeName: res.data.data.proName,
                taskTypeName: res.data.data.taskTypeName,
                workerName: res.data.data.workerName,
                state: res.data.data.state,
                packages: this.circulationDetails ? res.data.data.packages : '',
                notArrive: this.circulationDetails ? res.data.data.notArrive : '',
                priority: res.data.data.priority,
                taskNumber: res.data.data.taskNumber,
                finishTime: res.data.data.finishTime,
                spaces: res.data.data.spaces,
                id: res.data.data.id,
                show: false,
                check: false,
                startUpTime: res.data.data.startUpTime
              }
            );
            this.circulationTaskList = temporaryTaskListFirst;
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
            };
            // 改变调度具体某一任务的信息状态
            this.changeCirculationDetails(this.circulationTaskList[0])
          }
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
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

    // 循环任务送达
    circulationTaskArrived () {
      if (this.circulationDetails.state == 7) {
        this.$dialog.alert({
          message: '该条循环任务已完成,不能进行送达',
          closeOnPopstate: true
        }).then(() => {
        });
      } else {
        this.changeArriveDepartmentId(true);
        if (this.circulationDetails['spaces'].filter((item) => item.check == true).length >= 1) {
          this.changeIsCollectEnterSweepCodePage(false);
          this.$router.push({path: 'circulationTaskSweepCode'});
          this.changeTitleTxt({tit: '扫码'});
          setStore('currentTitle', '扫码')
        } else {
          this.$dialog.alert({
            message: '请至少采集完一个科室,才能进行送达',
            closeOnPopstate: true
          }).then(() => {
          });
        }
      }
    },

    // 跳转到当前标本信息页面
    skipCurrentSample () {
      this.$router.push({path:'/currentCirculationTaskSampleMessage'});
      this.changeTitleTxt({tit:'全部标本信息'});
      setStore('currentTitle','全部标本信息')
    },

    // 进入扫码页
    joinSweepCode () {
      if (this.circulationDetails.state == 7) {
        this.$dialog.alert({
          message: '该条循环任务已完成,不能进行扫码',
          closeOnPopstate: true
        }).then(() => {
        })
      } else {
        this.changeArriveDepartmentId(false);
        this.changeIsCollectEnterSweepCodePage(true);
        this.$router.push({'path': '/circulationTaskSweepCode'});
        this.changeTitleTxt({tit: '扫码'});
        setStore('currentTitle', '扫码')
      }
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
      font-size: 16px;
      background: #f6f6f6;
    .content {
      flex: 1;
      width: 100%;
      overflow: auto;
    };
    .basic-message {
      width: 93%;
      margin: 0 auto;
      margin-top: 14px;
      height: auto;
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
          margin-top: 1px;
          vertical-align: top;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
      .wait-handle-message {
        width: 100%;
        margin-top: 5px;
        overflow: auto;
        .wait-handle-message-middle {
          margin: 10px 0
        };
        .wait-handle-message-bottom {
          margin-top: 10px
        };
        .handle-message-line-wrapper {
          p {
            display: flex;
            overflow: auto;
            height: 30px;
            line-height: 30px;
            flex-flow: row nowrap;
            color: #a0a0a0;
            span {
              display: inline-block;
            };
            span:first-child {
              width: 40%
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
        .transport-type-wrapper {
          display: flex;
          flex-flow: row nowrap;
          .transport-type-title {
            color: #a0a0a0;
            width: 35%
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
          p {
            width: 100%;
          }
        }
      }
    }
    .office-list {
      width: 93%;
      background: #fff;
      margin: 0 auto;
      margin-top: 14px;
      .office-list-inner-wrapper {
        padding: 10px;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        p {
          font-size: 14px;
          display: inline-block;
          width: 48%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          margin-right: 4%;
          border-radius: 16px;
          background: #f9f9f9;
          color: #666666;
          margin-bottom: 4%;
          overflow: auto;
          &:nth-child(even) {
            margin-right: 0
          }
        }
        .officeCheckStyle {
          background: #1b88ff;
          color: #fff
        }
      }
    }
    .circultion-task-btn {
      width: 93%;
      margin: 0 auto;
      padding: 10px;
      height: auto;
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
        height: 40px;
        span {
          border-radius: 4px;
          &:first-child {
            width: 60%;
            margin-right: 10px;
            background-image: linear-gradient(to right, #37d4fd , #429bff);
          }
          &:last-child {
            width: 40%;
            height: 38px;
            line-height: 38px;
            background: #fff;
            color: #1b88ff;
            border: 1px solid #1b88ff;
          }
        }
      };
      .circultion-task-btn-middle {
        height: 40px;
        line-height: 40px;
        text-align: center;
        span {
          border-radius: 4px;
          width: 100%;
          background-image: linear-gradient(to right, #37d4fd, #429bff);
        }
      };
      .circultion-task-btn-bottom {
        height: 40px;
        line-height: 40px;
        margin-top: 8px;
        text-align: center;
        span {
          border-radius: 4px;
          width: 100%;
          background-image: linear-gradient(to right, #37d4fd, #429bff);
        }
      }
    }
  }
</style>
