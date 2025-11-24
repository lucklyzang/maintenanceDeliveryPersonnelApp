<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="sample-list-box">
      <van-empty description="待采集" v-show="sampleList.length == 0" />
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
            <van-notice-bar speed="100" scrollable color="#000" background="#ececec" :text="`${item.sampleNumber}个标本送往 --> ${item.targetDepartment}`" />
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
      <p class="btn-top">
        <span @click="sweepAstoffice">扫码</span>
      </p>
      <p class="btn-bottom">
        <span @click="completeEvent">完成</span>
      </p>
    </div>
    <!--科室标本未送达提示弹框-->
    <van-dialog v-model="isCompleteDelivery" show-cancel-button confirm-button-text="确定" title="当前科室标本收集完成"
      cancel-button-text="取消"
      @confirm="sureEvent"
      @cancel="cancelEvent"
    >
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import { mapGetters, mapMutations } from 'vuex'
import {collectNewCircleSampleMessage} from '@/api/trans/workerPort.js'
import { setStore, getStore, IsPC, deepClone,uniqueArray } from '@/common/js/utils'
export default {
  name: 'newCirculationTaskCollectMessage',
  data () {
    return {
      isCompleteDelivery: false,
      sampleList: []
    }
  },

  components:{
    HeaderTop
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
      'chooseHospitalArea'
    ]),
    proId() {
      return this.chooseHospitalArea['value']
    },
    workerId() {
      return this.userInfo['worker']['id']
    },
    circulationTaskId () {
      return this.circulationDetails.id
    },
    departmentName () {
      return JSON.parse(getStore('departmentInfo'))[this.verifyNewCirculationOfficeId]
    }
  },

  mounted () {
    this.echoSampleData();
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.backTo()
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    }
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeCurrentElectronicSignature',
      'changeCatchComponent',
      'changeCompleteSweepcodeDepartureInfo',
      'changeIsCompleteSampleList',
      'changeCompleteDeparnmentInfo'
    ]),

    // 回显当前科室收集的标本数据
    echoSampleData () {
      let temporarySampleList = [];
      let temporaryDepartmentId = [];
      let temporaryCurrentSampleList = [];
      temporarySampleList = deepClone(this.isCompleteSampleList);
      // 提取缓存的数据
      if (temporarySampleList.length > 0) {
        // 获取该条任务下对应科室的缓存数据
        let temporaryTaskIdIndex = temporarySampleList.indexOf(temporarySampleList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        if (temporaryTaskIdIndex != -1) {
          temporaryDepartmentId = uniqueArray(temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage']);
          let temporaryDepartmentIndex = temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage'].indexOf(temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage'].filter((item) => {return item.departmentId == this.verifyNewCirculationOfficeId})[0]);
          if (temporaryDepartmentIndex != -1) {
            temporaryCurrentSampleList = uniqueArray(temporaryDepartmentId[temporaryDepartmentIndex]['departmentMessage']);
            this.getData(temporaryCurrentSampleList)
          }
        }
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

    // 提交搜集的标本信息
    gatherSampleMessage (data) {
      collectNewCircleSampleMessage(data).then((res) => {
        if (res && res.data.data && res.data.code == 200) {
          if (res.data.data.length > 0) {
            // 获取的标本数据进行处理
            this.getData(res.data.data);
            // 缓存收集的标本信息
            this.storeCollectSampleMessage(this.verifyNewCirculationOfficeId, res.data.data)
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

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        this.gatherSampleMessage({
          code, // 标本箱编码，必输，扫描条码所得
          proId: this.proId,
          spaceId: this.verifyNewCirculationOfficeId,  // 收集科室 ID 必输
          spaceName: this.departmentName, // 收集科室名称  必输
          taskId: this.circulationTaskId // 任务ID 必输
        })
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
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

    // 存储已经收集的标本信息
    storeCollectSampleMessage (departmentId,data) {
      let temporarySampleList = [];
      let temporaryDepartmentId = [];
      let temporaryCurrentSampleList = [];
      temporarySampleList = deepClone(this.isCompleteSampleList);
      if (temporarySampleList.length > 0 ) {
        // 判断该条任务是否缓存过
        let temporaryTaskIdIndex = temporarySampleList.indexOf(temporarySampleList.filter((item) => {return item.taskId == this.circulationTaskId})[0]);
        if (temporaryTaskIdIndex != -1) {
          // 判断该条任务下,某个科室是否缓存过
          let temporaryDepartmentIndex = temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage'].indexOf(temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage'].filter((item) => {return item.departmentId == departmentId})[0]);
          temporaryDepartmentId = uniqueArray(temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage']);
          if (temporaryDepartmentIndex != -1) {
            temporaryCurrentSampleList = uniqueArray(temporaryDepartmentId[temporaryDepartmentIndex]['departmentMessage']);
            let temporaryArray = [];
            temporaryArray = temporaryCurrentSampleList.concat(data);
            temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage'][temporaryDepartmentIndex]['departmentMessage'] = data
          } else {
            temporaryDepartmentId.push({
              departmentId: departmentId,
              departmentMessage: data
            });
            temporarySampleList[temporaryTaskIdIndex]['departmentSampleMessage'] = uniqueArray(temporaryDepartmentId)
          }
        } else {
          temporaryDepartmentId.push({
            departmentId: departmentId,
            departmentMessage: data
          });
          temporarySampleList.push(
            {
              departmentSampleMessage: uniqueArray(temporaryDepartmentId),
              taskId: this.circulationTaskId
            }
          )
        }
      } else {
        temporaryDepartmentId.push({
          departmentId: departmentId,
          departmentMessage: data
        });
        temporarySampleList.push(
          {
            departmentSampleMessage: uniqueArray(temporaryDepartmentId),
            taskId: this.circulationTaskId
          }
        )
      };
      this.changeIsCompleteSampleList(temporarySampleList);
      setStore('completeCollectSample', {"sampleInfo": temporarySampleList})
    },

    // 存储完成采集任务的科室信息
    storeCompleteDeparnmentInfo () {
      let temporaryDepartmentId = [];
      let temporaryCompleteInfo = [];
      temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
      let temporaryIndex = this.completeDeparnmentInfo.indexOf(this.completeDeparnmentInfo.filter((item) => {
        return item.taskId == this.circulationTaskId
      })[0]);
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
      setStore('completeDepartmentMessage', {"sureInfo": temporaryCompleteInfo})
    },

    // 返回上一页
    backTo () {
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情')
    },

    // 弹框确认事件
    sureEvent() {
      this.storeCompleteDeparnmentInfo();
      this.backTo()
    },

    // 弹框取消事件
    cancelEvent() {
    },

    //完成事件
    completeEvent () {
      this.isCompleteDelivery = true
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
  font-size: 14px;
  /deep/ .van-dialog {
    .van-dialog__header--isolated {
      padding: 24px !important
    }
  };
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
            vertical-align: top
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
    .btn-top {
      height: 40px;
      line-height: 40px;
      text-align: center;
      span {
        border-radius: 4px;
        width: 100%;
        background-image: linear-gradient(to right, #37d4fd, #429bff);
      }
    };
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
