<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="sample-list-box">
      <van-empty description="待送达标本为空" v-show="sampleList.length == 0" />
      <div class="sample-list" v-for="(item,index) in sampleList" :key="index" v-show="sampleList.length > 0">
        <div class="sample-list-title" @click="sampleListEvent(item,index)">
          <div class="icon">
            <van-icon name="arrow" v-show="!item.isDown" />
            <van-icon name="arrow-down" v-show="item.isDown" />
          </div>
          <div class="serial-number">
            {{ index+1 }}
          </div>
          <div class="sample">
            <van-notice-bar speed="100" scrollable color="#000" background="#ececec" :text="`${item.depName} --> ${item.sampleNumber}个标本送往 --> ${item.targetDepartment}`" />
<!--            <span>{{`${item.depName}`}}</span>-->
<!--            <span><van-icon name="share"/></span>-->
<!--            <span>{{`${item.sampleNumber}个标本送往`}}</span>-->
<!--            <span><van-icon name="share"/></span>-->
<!--            <span>{{item.targetDepartment}}</span>-->
          </div>
          <div class="time">{{item.generateTime}}</div>
        </div>
        <div class="sample-list-content" v-show="item.isShow" v-for="(itemInner,indexInner) in item.sampleMessage" :key="indexInner">
          <div class="generate-time">
            {{itemInner.generateTime}}
          </div>
          <div class="site-flow">
            <span>{{itemInner.generateDepartment}}</span>
            <span><van-icon name="share"/></span>
            <span>{{itemInner.targetDepartment}}</span>
          </div>
          <div class="handle-message-line-wrapper">
            <P>
              <span class="message-tit">病人住院号&nbsp;: </span>
              <span class="message-tit-real">{{itemInner.admissionNumber}}</span>
            </P>
          </div>
          <div class="handle-message-line-wrapper">
            <P>
              <span class="message-tit">标&nbsp;本&nbsp;名&nbsp;称&nbsp;: </span>
              <span class="message-tit-real">{{itemInner.sampleName}}</span>
            </P>
          </div>
          <div class="handle-message-line-wrapper">
            <P>
              <span class="message-tit">标&nbsp;本&nbsp;类&nbsp;型&nbsp;: </span>
              <span class="message-tit-real">{{itemInner.sampleType}}</span>
            </P>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <p class="btn-bottom">
        <span @click="completeEvent">完成</span>
      </p>
    </div>
    <!--科室标本未送达提示弹框-->
    <van-dialog v-model="isCompleteDelivery" show-cancel-button
                title="当前科室还有标本包未送达，是否开始下一个科室的配送"
                cancel-button-text="返回"
                @confirm="sureEvent"
                @cancel="cancelEvent"
    >
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import {queryNewCircleSampleMessage, updateCirculationTask, queryNewCircleTaskComplete} from '@/api/trans/workerPort.js'
import { setStore, getStore, IsPC, deepClone } from '@/common/js/utils'
export default {
  name: 'newCirculationTaskConnectMessage',
  data () {
    return {
      sampleList: [],
      isTimeoutContinue: true,
      isCompleteDelivery: false,
      windowCircleTimer: null
    }
  },

  components:{
    HeaderTop,
    NoData
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'circulationDetails',
      'verifyCirculationOfficeId',
      'verifyNewCirculationOfficeId',
      'isCompleteSampleList',
      'completeDeparnmentInfo',
      'globalCircleTimer'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    circulationTaskId () {
      return this.circulationDetails.id
    },
    departmentName () {
      return JSON.parse(getStore('departmentInfo'))[this.verifyNewCirculationOfficeId]
    }
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.backTo()
      })
    };
    // 轮询标本信息送达情况
    if (!this.globalCircleTimer) {
      this.windowCircleTimer = window.setInterval(() => {
        if (this.isTimeoutContinue) {
          setTimeout(this.querySampleMessage({
            taskId: this.circulationTaskId,
            depId: "",
            state: 2,
          }), 0)
        }
      }, 2000);
      this.changeGlobalCircleTimer(this.windowCircleTimer)
    };
    this.querySampleMessage({
      taskId: this.circulationTaskId,
      depId: "",
      state: 2,  // 0-未收集，1-已采集，2-已收集 | 未送达，3-已送达
    });
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    }
  },

  beforeDestroy () {
    if (this.globalCircleTimer) {
      window.clearInterval(this.windowCircleTimer);
      this.changeGlobalCircleTimer(null)
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeCurrentElectronicSignature',
      'changeCatchComponent',
      'changeCompleteSweepcodeDepartureInfo',
      'changeGlobalCircleTimer',
      'changeIsFreshCirculationTaskPage',
      'changeCompleteDeparnmentInfo',
      'changeIsCompleteSampleList'
    ]),

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 提取后台返回的标本信息数据
    getData(data) {
      this.sampleList = [];
      for (var i = 0, len = data.length; i < len; i++) {
        this.sampleList.push({
          sampleNumber: data[i]['quantity'],
          targetDepartment: data[i]['distName'],
          generateTime: data[i]['collectTime'],
          depName: data[i]['depName'],
          isShow: false,
          isDown: false,
          sampleMessage: []
        });
        for (var j = 0, lenInner = data[i]['specimens'].length; j < lenInner; j++) {
          this.sampleList[this.sampleList.length - 1]['sampleMessage'].push({
            admissionNumber: data[i]['specimens'][j]['bedNumber'],
            sampleName: data[i]['specimens'][j]['specimenName'],
            sampleType: data[i]['specimens'][j]['specimenType'],
            generateTime: data[i]['specimens'][j]['createTime'],
            generateDepartment: data[i]['specimens'][j]['depName'],
            targetDepartment: data[i]['specimens'][j]['distName']
          })
        }
      }
    },

    // 查询搜集的标本信息
    querySampleMessage (data) {
      this.isTimeoutContinue = false;
      queryNewCircleSampleMessage(data).then((res) => {
        // token过期,清楚定时器
        if (!res['headers']['token']) {
          if(this.windowCircleTimer) {window.clearInterval(this.windowCircleTimer)}
        };
        if (res && res.data.data && res.data.code == 200) {
          this.isTimeoutContinue = true;
          if (res.data.data.length > 0) {
            // 获取的标本数据进行处理
            this.getData(res.data.data)
          }
        } else {
          this.$toast(`${res.data.msg}`)
        }
      })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: false
          }).then(() => {
          })
        })
    },

    // 更新循环任务状态
    // this.updateCirculationtaskState({
    //   proId: this.proId,		 //当前项目ID
    //   id: this.circulationTaskId, //当前任务ID
    //   state: 7 //更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'}
    // });
    updateCirculationtaskState (data) {
      updateCirculationTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast('该条任务已完成');
          // 清空store已完成科室信息
          let temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
          temporaryCompleteInfo = temporaryCompleteInfo.filter((item) => { return item.taskId != this.circulationTaskId});
          this.changeCompleteDeparnmentInfo({DtMsg: temporaryCompleteInfo});
          // 清空Localstorage的已完成科室信息
          setStore('completeDepartmentMessage', {"sureInfo": temporaryCompleteInfo});

          // 清空store存储的每条任务下的每个科室存储的收集标本信息
          let temporaryCollectSampleInfo = deepClone(this.isCompleteSampleList);
          temporaryCollectSampleInfo = temporaryCollectSampleInfo.filter((item) => { return item.taskId != this.circulationTaskId});
          this.changeIsCompleteSampleList(temporaryCollectSampleInfo);
          setStore('completeCollectSample', {"sampleInfo": changeIsCompleteSampleList});

          this.$router.push({path:'/circulationTask'});
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务');
          this.changeIsFreshCirculationTaskPage(true)
        } else {
          this.$dialog.alert({
            message: `${res.data.data}`,
            closeOnPopstate: false
          }).then(() => {
          })
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: false
        }).then(() => {
        })
      })
    },

    // 任务完成时清空相关的数据缓存
    clearDataCache () {
      this.$toast('该条任务已完成');
      // 清空store已完成科室信息
      let temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
      temporaryCompleteInfo = temporaryCompleteInfo.filter((item) => { return item.taskId != this.circulationTaskId});
      this.changeCompleteDeparnmentInfo({DtMsg: temporaryCompleteInfo});
      // 清空Localstorage的已完成科室信息
      setStore('completeDepartmentMessage', {"sureInfo": temporaryCompleteInfo});
      // 清空store存储的每条任务下的每个科室存储的收集标本信息
      let temporaryCollectSampleInfo = deepClone(this.isCompleteSampleList);
      temporaryCollectSampleInfo = temporaryCollectSampleInfo.filter((item) => { return item.taskId != this.circulationTaskId});
      this.changeIsCompleteSampleList(temporaryCollectSampleInfo);
      setStore('completeCollectSample', {"sampleInfo": temporaryCollectSampleInfo});
      this.changeIsFreshCirculationTaskPage(true);
      this.$router.push({path:'/circulationTask'})
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    },

    // 查询任务是否完成
    juddgeNewCircleTaskComplete (data) {
      queryNewCircleTaskComplete(data).then((res) => {
        if (res && res.data.code == 200) {
          // 0-存在当前送达科室的标本，1-不存在送达科室的标本，2-当前任务未完成，3-当前任务完成
          if (res.data.data == 0) {
            this.isCompleteDelivery = true
          } else if (res.data.data == 1) {
            this.backTo ()
          } else if (res.data.data == 2) {
            this.backTo ()
          } else if (res.data.data == 3) {
            this.clearDataCache()
          }
        } else {
          this.$toast(`${res.data.msg}`)
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
        }).then(() => {
        })
      })
    },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 标题列表点击事件
    sampleListEvent (item,index) {
      this.sampleList[index]['isDown'] = !this.sampleList[index]['isDown'];
      this.sampleList[index]['isShow'] = !this.sampleList[index]['isShow']
    },

    // 弹框确认事件
    sureEvent() {
      this.backTo()
    },

    // 弹框取消事件
    cancelEvent() {
    },

    // 返回上一页
    backTo () {
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情')
    },

    //完成事件
    completeEvent () {
      this.juddgeNewCircleTaskComplete({
        taskId: this.circulationTaskId, // 任务ID必填
        depId: this.verifyNewCirculationOfficeId  // 送达科室ID 必输
      });
      // 判断当前送达科室标本是否已经送达完毕
      let flag = this.sampleList.some((item) => { return item.distName == this.departmentName})
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
  background: #f5f5f5;
  /deep/ .van-dialog {
    .van-dialog__header--isolated {
      padding: 24px !important
    }
  };
  font-size: 14px;
  .sample-list-box {
    flex: 1;
    overflow: auto;
    /deep/ .van-empty {
      height: 100%;
    };
    .sample-list {
      .sample-list-title {
        position: relative;
        height: 50px;
        font-size: 16px;
        background: #fff;
        .bottom-border-1px(#bcbcbc);
        >div {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
        };
        .icon {
          left: 4px;
          .van-icon {
            font-weight: bolder;
            font-size: 20px
          }
        };
        .serial-number {
          font-weight: bold;
          left: 26px;
          width: 5%;
          overflow-x: auto;
          display: inline-block;
          white-space: nowrap;
          font-weight: bold
        };
        .sample {
          left: 50px;
          width: 45%;
          overflow-x: auto;
          display: inline-block;
          white-space: nowrap;
          //background: #ececec;
          padding: 6px 0;
          box-sizing: border-box;
          border-radius: 2px;
          /deep/ .van-notice-bar {
            padding: 0 !important
          };
          > span {
            vertical-align: top;
          }
        };
        .time {
          right: 4px;
          font-size: 14px
        }
      };
      .sample-list-content {
        width: 98%;
        margin: 0 auto;
        background: #fff;
        margin-top: 4px;
        padding: 20px 4px 30px 4px;
        box-sizing: border-box;
        border-radius: 4px;
        position: relative;
        .generate-time {
          color: #a0a0a0;
          position: absolute;
          top: 10px;
          right: 20px
        };
        .site-flow {
          font-size: 16px;
          text-align: center;
          width: 250px;
          overflow-x: auto;
          position: absolute;
          bottom: 10px;
          white-space: nowrap;
          left: 50%;
          transform: translateX(-50%);
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
              width: 25%
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              flex: 1;
              color: black
            }
          }
        };
        &:last-child {
          margin-bottom: 4px;
        }
      };
      &:last-child:after {
        display: none;
        margin-bottom: 0
      }
    }
  };
  .btn-box {
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
    .btn-bottom {
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

