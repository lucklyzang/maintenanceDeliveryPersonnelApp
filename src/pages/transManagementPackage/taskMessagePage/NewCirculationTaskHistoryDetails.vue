<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow" />
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="content">
      <div class="basic-message" ref="basicMessage">
        <p class="basic-mesage-state">
          <img :src="stateTransferImg(2)" alt="">
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
                <span class="message-tit">任务名称 :&nbsp;</span>
                <span class="message-tit-real">{{taskDetailsMessage.taskName}}</span>
              </P>
            </div>
            <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
              <P>
                <span class="message-tit">开始时间 :&nbsp;</span>
                <span class="message-tit-real">{{taskDetailsMessage.startTime}}</span>
              </P>
            </div>
            <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
              <p>
                <span class="message-tit">完成时间 :&nbsp;</span>
                <span class="message-tit-real">{{taskDetailsMessage.finishTime}}</span>
              </p>
            </div>
          </div>
          <div class="wait-handle-message-middle">
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">耗时 :&nbsp;</span>
                <span class="message-tit-real">{{taskDetailsMessage.useTime}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">标本包 :&nbsp;</span>
                <span class="message-tit-real">{{taskDetailsMessage.packageSize}}</span>
              </p>
            </div>
            <div class="handle-message-line-wrapper">
              <p>
                <span class="message-tit">标本 :&nbsp;</span>
                <span class="message-tit-real">{{taskDetailsMessage.specimens}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="sample-list-box">
        <div class="sample-list" v-for="(item,index) in taskDetailsMessage.specimenPackages" :key="index">
          <div class="sample-list-title" @click="sampleListEvent(item,index)">
            <div class="icon">
              <van-icon name="arrow" v-show="!item.isDown" />
              <van-icon name="arrow-down" v-show="item.isDown" />
            </div>
            <div class="sample">
              <van-notice-bar speed="100" scrollable color="#000" background="#ececec" :text="`${item.depName}  标本包${item.packageSize}个 标本${item.specimens}个`" />
<!--              <span>{{`${item.depName}`}}</span>-->
<!--              <span>{{`标本${item.sampleNumber}个`}}</span>-->
<!--              <span>{{item.targetDepartment}}</span>-->
            </div>
            <div class="time">{{`运送时间:${item.generateTime}`}}</div>
          </div>
          <div class="sample-list-content-wrapper" v-show="item.isShow" v-for="(itemInner,indexInner) in item.packages" :key="indexInner">
            <div class="sample-list-inner-title">
              <div class="serial-number">
                {{ indexInner+1 }}
              </div>
              <div class="sample">
                <van-notice-bar speed="100" scrollable color="#000" background="#ececec" :text="`${itemInner.depName} --> ${itemInner.quantity}个标本送往 --> ${itemInner.distName}`" />
              </div>
              <div class="time">{{itemInner.arriveTime}}</div>
            </div>
            <div class="sample-list-content" v-for="(innermost,indexMost) in itemInner.specimens" :key="indexMost">
              <div class="generate-time">
                {{innermost.generateTime}}
              </div>
              <div class="site-flow">
                <span>{{innermost.generateDepartment}}</span>
                <span><van-icon name="share"/></span>
                <span>{{innermost.targetDepartment}}</span>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">病人住院号&nbsp;: </span>
                  <span class="message-tit-real">{{innermost.admissionNumber}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">标&nbsp;本&nbsp;名&nbsp;称&nbsp;: </span>
                  <span class="message-tit-real">{{innermost.sampleName}}</span>
                </P>
              </div>
              <div class="handle-message-line-wrapper">
                <P>
                  <span class="message-tit">标&nbsp;本&nbsp;类&nbsp;型&nbsp;: </span>
                  <span class="message-tit-real">{{innermost.sampleType}}</span>
                </P>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="circulation-task-btn">
      <p class="circulation-task-btn-bottom">
        <span @click="backTo">返回</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import {queryNewCircleTaskDetails} from '@/api/trans/workerPort.js'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, IsPC } from '@/common/js/utils'
export default {
  name: 'NewCirculationTaskHistoryDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      taskDetailsMessage: {},
      sampleList: [],
      overlayShow: false,
      taskInfoPng: require('@/common/images/home/basic-message.png'),
      siteTractPng: require('@/common/images/home/site-tract.png'),
      nextStepPng: require('@/common/images/home/next-step.png'),
      noEndPng: require('@/common/images/home/no-end.png'),
      noReferPng: require('@/common/images/home/no-refer.png'),
      noStartPng: require('@/common/images/home/no-start.png'),
      taskFinshedPng: require('@/common/images/home/task-finshed.png'),
      taskGoingPng: require('@/common/images/home/task-going.png'),
      taskCancelPng: require('@/common/images/home/task-cancel.png'),
      waitSurePng: require('@/common/images/home/wait-sure.png')
    }
  },

  components: {
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
    this.querySampleMessageDetails(this.circulationTaskId);
    // 控制设备物理按键返回
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
        this.backTo()
      })
    };
    document.addEventListener('click', (e) => {
      if(e.target.className !='van-icon van-icon-plus' && e.target.className != 'quit-account'){
        this.overlayShow = false
      }
    })
  },


  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeCatchComponent',
      'changeIsFreshCirculationTaskPage'
    ]),

    // 返回上一页
    backTo () {
      this.$router.push({path:'/circulationTask'});
      this.changeTitleTxt({tit:'循环任务'});
      setStore('currentTitle','循环任务')
    },

    // 标题列表点击事件
    sampleListEvent (item,index) {
      this.sampleList[index]['isDown'] = !this.sampleList[index]['isDown'];
      this.sampleList[index]['isShow'] = !this.sampleList[index]['isShow']
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
        case 6 :
          return this.taskCancelPng
          break;
        case 7 :
          return  this.taskFinshedPng
          break;
      }
    },

    // 性别转换
    genderTransfer (index) {
      switch(index) {
        case 1 :
          return '男'
          break;
        case 2 :
          return '女'
          break;
        default:
          return '未输入'
      }
    },

    // 提取后台返回的标本信息数据
    getData(data) {
      for (var i = 0, len = data.length; i < len; i++) {
        this.sampleList.push({
          packageSize: data[i]['packageSize'],
          specimens: data[i]['specimens'],
          generateTime: data[i]['time'],
          depName: data[i]['name'],
          isShow: false,
          isDown: false,
          packages: []
        });
        for (var j = 0, lenInner = data[i]['packages'].length; j < lenInner; j++) {
          this.sampleList[i]['packages'].push({
            depName: data[i]['packages'][j]['depName'],
            distName: data[i]['packages'][j]['distName'],
            quantity: data[i]['packages'][j]['quantity'],
            collectTime: data[i]['packages'][j]['collectTime'],
            arriveTime: data[i]['packages'][j]['arriveTime'],
            specimens: []
          });
          for (var k = 0, lenK = data[i]['packages'][k]['specimens'].length; k < lenK; k++) {
            this.sampleList[i]['packages'][j]['specimens'].push({
              admissionNumber: data[i]['packages'][j]['specimens'][k]['bedNumber'],
              sampleName: data[i]['packages'][j]['specimens'][k]['specimenName'],
              sampleType: data[i]['packages'][j]['specimens'][k]['specimenType'],
              generateTime: data[i]['packages'][j]['specimens'][k]['createTime'],
              generateDepartment: data[i]['packages'][j]['specimens'][k]['depName'],
              targetDepartment: data[i]['packages'][j]['specimens'][k]['distName']
            })
          }
        }
      };
      this.taskDetailsMessage['specimenPackages'] = this.sampleList
    },

    // 查询搜集的标本信息
    querySampleMessageDetails (data) {
      queryNewCircleTaskDetails(data)
      .then((res) => {
        if (res && res.data.data && res.data.code == 200) {
          if (res.data.data.length > 0) {
            // 获取的标本数据进行处理
            this.taskDetailsMessage = res.data.data;
            this.getData(res.data.data['specimenPackages'])
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
  .right-text {
    position: absolute;
    top: 10px;
    right: 9px;
    font-size: 16px;
    color: #4788fe;
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #fff;
    border-radius: 4px;
    display: inline-block
  };
  .content {
    flex: 1;
    width: 100%;
    overflow: auto;
    overflow-x: hidden;
  };
  .basic-message {
    width: 98%;
    margin: 0 auto;
    margin-top: 14px;
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
          span:last-child {
            flex: 1;
            color: black
          }
        }
      };
      .handle-message-line-wrapper-other {
        p {
          width: 100%;
        }
      };
    }
  };
  .sample-list-box {
    width: 98%;
    margin: 0 auto;
    .sample-list {
      box-sizing: border-box;
      padding: 4px 0;
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
        .sample {
          left: 36px;
          width: 34%;
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
      .sample-list-content-wrapper {
        font-size: 15px;
        .sample-list-inner-title {
          position: relative;
          height: 40px;
          background: #fff;
          .bottom-border-1px(#bcbcbc);
          >div {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          };
          .serial-number {
            font-weight: bold;
            left: 10px;
            width: 5%;
            overflow-x: auto;
            display: inline-block;
            white-space: nowrap;
            font-weight: bold
          };
          .sample {
            left: 36px;
            width: 50%;
            overflow-x: auto;
            display: inline-block;
            white-space: nowrap;
            //background: #ececec;
            padding: 6px 0;
            box-sizing: border-box;
            border-radius: 2px;
            /deep/ .van-notice-bar {
              padding: 0 !important;
              font-size: 13px;
              height: 30px
            };
            > span {
              vertical-align: top
            }
          };
          .time {
            right: 4px;
            font-size: 14px
          }
        }
        .sample-list-content {
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
              }
            ;

              span:first-child {
                width: 25%
              }
            ;

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
        }
      };
      &:last-child:after {
        display: none;
        margin-bottom: 0
      }
    }
  };
  .circulation-task-btn {
    width: 95%;
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
    .circulation-task-btn-bottom {
      position: relative;
      height: 40px;
      margin-top: 10px;
      span {
        background: #fff;
        color: #1b88ff;
        border: 1px solid #1b88ff;
        width: 100%;
        border-radius: 4px
      }
    }
  }
}
</style>

