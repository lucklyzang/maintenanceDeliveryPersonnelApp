<template>
  <div class="content-wrapper">
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="tabs-box">
      <ul class="task-line-one">
        <li :class="{'taskLineOneStyle':taskLlineOneIndex == index}" :key="index" v-for="(item,index) in taskOneList" @click="taskLineOneEvent(item, index)">{{item}}</li>
      </ul>
    </div>
    <van-pull-refresh class="task-list-box"  v-model="isRefresh" @refresh="onRefresh" success-text="刷新成功">
      <van-empty description="数据为空" v-show="sampleList.length == 0" />
      <div class="sample-list-box" v-show="taskLlineOneIndex == 0">
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
<!--              <span>{{`${item.depName}`}}</span>-->
<!--              <span><van-icon name="share"/></span>-->
<!--              <span>{{`${item.sampleNumber}个标本送往`}}</span>-->
<!--              <span><van-icon name="share"/></span>-->
<!--              <span>{{item.targetDepartment}}</span>-->
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
      <div class="sample-list-box" v-show="taskLlineOneIndex == 1">
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
              <van-notice-bar speed="100" scrollable color="#000" background="#ececec" :text="`${item.depName}-->${item.sampleNumber}个标本送往-->${item.targetDepartment}`" />
<!--              <span>{{`${item.depName}`}}</span>-->
<!--              <span><van-icon name="share"/></span>-->
<!--              <span>{{`${item.sampleNumber}个标本往`}}</span>-->
<!--              <span><van-icon name="share"/></span>-->
<!--              <span>{{item.targetDepartment}}</span>-->
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
    </van-pull-refresh>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import {queryNewCircleSampleMessage} from '@/api/trans/workerPort.js'
import { setStore, getStore, IsPC } from '@/common/js/utils'
export default {
  name: 'appointTaskCustomerInfo',
  data () {
    return {
      taskLlineOneIndex: '0',
      isRefresh: false,
      showLoadingHint: false,
      noDataShow: false,
      taskOneList: ['待送达', '已送达'],
      sampleList: []
    }
  },

  components:{
    HeaderTop,
    NoData,
    Loading
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'circulationDetails',
      'verifyCirculationOfficeId',
      'verifyNewCirculationOfficeId',
      'isCompleteSampleList'
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
    this.querySampleMessage({
      taskId: this.circulationTaskId,
      depId: "",
      state: 2,  //  0-未收集，1-已采集，2-已收集 | 未送达，3-已送达
    })
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeCurrentElectronicSignature',
      'changeCatchComponent',
      'changeCompleteSweepcodeDepartureInfo'
    ]),

    // 标题列表点击事件
    sampleListEvent (item,index) {
      this.sampleList[index]['isDown'] = !this.sampleList[index]['isDown'];
      this.sampleList[index]['isShow'] = !this.sampleList[index]['isShow']
    },

    // 提取后台返回的标本信息数据
    getData(data) {
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
      this.showLoadingHint = true;
      this.sampleList = [];
      queryNewCircleSampleMessage(data).then((res) => {
        this.showLoadingHint = false;
        this.isRefresh = false;
        if (res && res.data.data && res.data.code == 200) {
          if (res.data.data.length > 0) {
            // 获取的标本数据进行处理
            this.getData(res.data.data)
          }
        } else {
          this.$toast(`${res.data.msg}`)
        }
      })
        .catch((err) => {
          this.showLoadingHint = false;
          this.isRefresh = false;
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: false
          }).then(() => {
          })
        })
    },

    // tab切换点击
    taskLineOneEvent (item,index) {
      this.taskLlineOneIndex = index;
      this.noDataShow = false;
      if (index == '0') {
        this.querySampleMessage({
          taskId: this.circulationTaskId,
          depId: "",
          state: 2,  // 状态 2-未送达，3-已送达
        })
      } else if (index == '1') {
        this.querySampleMessage({
          taskId: this.circulationTaskId,
          depId: "",
          state: 3,  // 状态 2-未送达，3-已送达
        })
      }
    },

    // 下拉刷新
    onRefresh () {
      if (this.taskLlineOneIndex == 0) {
        this.querySampleMessage({
          taskId: this.circulationTaskId,
          depId: "",
          state: 2,
        })
      } else {
        this.querySampleMessage({
          taskId: this.circulationTaskId,
          depId: "",
          state: 3,
        })
      }
    },

    // 返回上一页
    backTo () {
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
  background: #f5f5f5;
  font-size: 14px;
  position: relative;
  .loading {
    position: absolute;
    top: 260px;
    left: 0;
    width: 100%;
    height: 50px;
    text-align: center;
  }
  .task-list-box {
    flex: 1;
    overflow: auto;
    /deep/ .van-empty {
      height: 100%;
    };
    .sample-list-box {
      .sample-list {
        padding: 4px;
        .sample-list-title {
          position: relative;
          height: 50px;
          font-size: 16px;
          background: #fff;
          .bottom-border-1px(#bcbcbc);

          > div {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        ;

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
          }
        ;

          .time {
            right: 4px;
            font-size: 14px
          }
        }
      ;

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
        };
        &:last-child:after {
          display: none;
          margin-bottom: 0
        }
      }
    } ;
  }
  .tabs-box {
    font-size: 17px;
    height: 38px;
    margin-bottom: 2px;
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
    }
  }
}
</style>

