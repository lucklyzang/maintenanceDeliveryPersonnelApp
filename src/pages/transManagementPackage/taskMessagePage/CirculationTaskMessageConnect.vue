<template>
   <div class="content-wrapper">
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="basic-message-title">
      <span>
        <img :src="connectMessagePng" alt="">
      </span>
     采集信息交接
    </div>
     <div class="connect-message-checked-all">
       <p class="checked-all-box">
         <van-checkbox v-model="checkAll" @click="checkAllEvent" checked-color="#4f4f4f">全选</van-checkbox>
       </p>
       <p class="total-number">数量 {{totalNumber}}</p>
     </div>
    <div class="sweep-code-area" v-show="connectMessageArea">
      <div class="sample-type-list" v-for="(item,index) in manageSampleDataList" :key="`${item}-${index}`">
        <div class="sample-type-title-wrapper">
          <!-- <div class="sample-type-stepper">
            <van-stepper @change="stepperEvent" v-model="item.sampleNumber" min="1"  :max="`${item.sampleTotal}`"/>
          </div> -->
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent" checked-color="#4f4f4f">{{item.sampleTypeName}}</van-checkbox>
          </div>
          <div class="sample-type-total">数量 {{item.sampleTotal}}</div>
        </div>
        <div class="sample-type-message-wrapper">
          <div class="sample-type-message-list" v-for="(innerItem,innerIndex) in item.sampleList" :key="`${innerItem}-${innerIndex}`">
            <div class="wait-handle-message-one">
              <span class="message-tit">科室 :</span>
              <span class="message-tit-real">{{innerItem.spaceName}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span class="message-tit">收集时间 :</span>
              <span class="message-tit-real">{{innerItem.collectionTime}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span class="message-tit">病人姓名 :</span>
              <span class="message-tit-real">{{innerItem.patientName}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span class="message-tit">病人床号 :</span>
              <span class="message-tit-real">{{innerItem.bedNumber}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span class="message-tit">标本数量 :</span>
              <span class="message-tit-real">{{innerItem.quantity}}</span>
            </div>
              <!-- <P>
                <span class="message-tit">检查项:</span>
                <span class="message-tit-real">
                    <van-checkbox-group  v-model="innerItem.checkEntryList" direction="horizontal">
                      <van-checkbox
                        shape="quare"
                        v-for="(item,index) in innerItem.collectionItem"
                        :key="`${item}-${index}`"
                        :name='`{"itemName":"${item.itemName}","id":"${item.id}"}`'
                      >
                        {{ item.itemName }}
                      </van-checkbox>
                    </van-checkbox-group>
                </span>
              </P> -->
          </div>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <p class="circultion-task-btn-top">
        <span @click="ConnectSure">确 认</span>
        <span @click="ConnectCancel">取 消</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {queryCollectSampleMessage, updateCirculationTask} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore,  IsPC, repeArray, deepClone, arrayDiff} from '@/common/js/utils'
export default {
  name: 'circulationTaskMessageConnect',
  data () {
    return {
      showLoadingHint: false,
      noDataShow: false,
      checkAll: false,
      totalNumber: 0,
      noConnectSampleShow: false,
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      connectMessageArea: false,
      liIndex: null,
      originCollectSampleMessageList: [],
      allSampleTypeList: [],
      manageSampleDataList: [],
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png'),
      connectMessagePng: require('@/common/images/home/connect-message.png')
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    Loading,
    FooterBottom
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (this.noConnectSampleShow) {
          this.noConnectSampleInfo();
          return
        };
        this.$router.push({'path':'/circulationDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情');
      })
    };
    this.getCollectSampleMessage(this.proId,this.circulationTaskId)
  },

  activated () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (this.noConnectSampleShow) {
          this.noConnectSampleInfo();
          return
        };
        this.$router.push({'path':'/circulationDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情');
      })
    };
    if (this.isrefreshCirculationConnectPage) {
      this.getCollectSampleMessage(this.proId,this.circulationTaskId)
    }
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'isrefreshCirculationConnectPage',
      'circulationTaskId',
      'storeNoConnectSample',
      'storeAlreadyConnectSample',
      'completeDeparnmentInfo',
      'circulationDetails'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCirculationConnectMessageList',
      'changeIsStoreNoConnectSample',
      'changeCompleteDeparnmentInfo',
      'changeIsFreshCirculationTaskPage'
    ]),

    // 计数器变化回调
    stepperEvent (value) {
      let emptyArr = [];
      },

    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      localStorage.clear();
      this.$router.push({path:'/'})
    },

    // 跳转到我的页
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
    },

    // 没有交接标本提示提示
    noConnectSampleInfo () {
      this.noConnectSampleShow = true;
      if (this.circulationDetails['spaces'].every((item) => item.check) == true ) {
        this.$dialog.alert({
          message: '该条循环任务没有需要交接的标本,确定后将更新该循环任务状态为已完成',
          closeOnPopstate: false
        }).then(() => {
          this.dealNoSampleMessage()
        })
      } else {
        this.$toast('当前没有需要交接的标本');
        this.$router.push({'path':'/circulationDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情')
      }
    },

    // 返回上一页
    backTo () {
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情');
    },

    // 没有需要交接的标本操作
    dealNoSampleMessage () {
      updateCirculationTask({
        proId: this.proId,
        id: this.circulationTaskId,
        state: 7
      }).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast('该条任务已完成');
          this.noConnectSampleShow = false;
          this.noDataShow = false;
          // 清空store已完成科室信息
          let temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
          temporaryCompleteInfo = temporaryCompleteInfo.filter((item) => { return item.taskId != this.circulationTaskId});
          this.changeCompleteDeparnmentInfo({DtMsg: temporaryCompleteInfo});
          // 清空Localstorage的已完成科室信息
          setStore('completeDepartmentMessage', {"sureInfo": temporaryCompleteInfo});
          this.$router.push({path:'/circulationTask'});
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务');
          this.changeIsFreshCirculationTaskPage(true)
        } else {
          this.$dialog.alert({
            message: `${res.data.data}`,
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

    // 查询收集的标本信息
    getCollectSampleMessage (proId, taskId) {
      this.showLoadingHint = true;
      queryCollectSampleMessage(proId, taskId).then((res) => {
         if (res && res.data.code == 200) {
          if (res.data.data.length == 0) {
            this.connectMessageArea = false;
            this.noDataShow = true;
            this.noConnectSampleInfo();
            return
          };
          this.connectMessageArea = true;
          this.noDataShow = false;
          this.originCollectSampleMessageList = res.data.data;
          this.allSampleTypeList = [];
          for (let item of this.originCollectSampleMessageList) {
            for (let currentItem in item) {
              if (currentItem === 'specimenName') {
                this.allSampleTypeList.push(item[currentItem])
              }
            }
          };
          this.manageSampleDataList = [];
          let filterSampleMessage = [];
          let sameSampleTypeNumber = '';
          let sameSampleNumberList = [];
          for (let i = 0, len = repeArray(this.allSampleTypeList).length; i < len; i++) {
            sameSampleTypeNumber = '';
            sameSampleNumberList = [];
            // 过滤标本为同一类型的数据
            filterSampleMessage =  this.originCollectSampleMessageList.filter((itemInfo) => {return itemInfo['specimenName'] == repeArray(this.allSampleTypeList)[i]});
            // 提取同一类型标本里的数量字段
            for (let numberFiel of filterSampleMessage) {
              for (let currentNumberFiel in numberFiel) {
                if (currentNumberFiel === 'quantity') {
                  sameSampleNumberList.push(numberFiel[currentNumberFiel])
                }
              }
            };
            let temporaryManageSampleDataList = [],
            // 对同一标本类型的数量进行求和
            sameSampleTypeNumber = sameSampleNumberList.reduce((last, before, index, array) => last + before);
            // 生成符合页面展示要求的数据结构
            this.manageSampleDataList.push(
              {
                sampleTypeName: repeArray(this.allSampleTypeList)[i],
                check: false,
                sampleTotal: sameSampleTypeNumber,
                sampleList: deepClone(filterSampleMessage),
                sampleNumber: 0
              }
            );
            let manageCheckArray = [];
            let manageCheckArrayCheck = [];
            // 格式换标本项里的检查项字段
            // for (let j = 0, innerLen = this.manageSampleDataList[i].sampleList.length; j < innerLen; j++) {
            //   manageCheckArray = [];
            //   manageCheckArrayCheck = [];
            //   let removeBraceArray = this.manageSampleDataList[i].sampleList[j]['collectionItem'].split(",");
            //   for (let currentCheckEntry of removeBraceArray) {
            //     let transferArray = removeBlock(currentCheckEntry.replace(/\"/g, "")).split(":");
            //     manageCheckArray.push({
            //       itemName: transferArray[1],
            //       id: transferArray[0]
            //     });
            //     manageCheckArrayCheck.push(JSON.stringify({
            //       itemName: transferArray[1],
            //       id: transferArray[0]
            //     }))
            //   };
            //   this.manageSampleDataList[i]['sampleList'][j]['collectionItem'] = manageCheckArray;
            //   this.manageSampleDataList[i]['sampleList'][j]['checkEntryList'] = manageCheckArrayCheck
            // }
          };
          // 去除已经交接过的标本
          this.manageSampleDataList = arrayDiff(this.manageSampleDataList, this.storeAlreadyConnectSample);
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: false
          }).then(() => {
            this.connectMessageArea = false;
            this.noDataShow = true;
          });
        }
      })
      .catch((err) => {
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: false
        }).then(() => {
          this.connectMessageArea = false;
          this.noDataShow = true;
        });
      });
      this.showLoadingHint = false;
    },

    // 复选框点击事件(单个标本)
    checkBoxEvent () {
      let flagOne = this.manageSampleDataList.some((item) => {
        return item.check == false
      });
      let flagTwo = this.manageSampleDataList.every((item) => {
        return item.check == true
      });
      if (flagOne) {
        this.checkAll = false;
      };
      if (flagTwo) {
        this.checkAll = true
      };
      this.reduceTotal()
    },

    // 复选框点击事件(全选)
    checkAllEvent (event) {
      this.manageSampleDataList.forEach((item) => {
        this.checkAll ? item.check = true : item.check = false
      });
      this.reduceTotal()
    },

    // 求和函数
    reduceTotal () {
      let temporaryDataList = [];
      temporaryDataList = this.manageSampleDataList.filter((item) => {return item.check == true});
      this.totalNumber = temporaryDataList.reduce((prev, cur) => {
        return prev + cur.sampleTotal
      },0)
    },

    // 交接信息确认事件
    ConnectSure () {
      let circulationMessageListSure = this.manageSampleDataList.filter((item) => { return item.check == true});
      // 存储没有交接的标本
      this.changeIsStoreNoConnectSample(this.manageSampleDataList.filter((item) => { return item.check == false}));
      if (circulationMessageListSure.length == 0) {
        this.$dialog.alert({
          message: '请选择要交接的标本',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      circulationMessageListSure[0]['totalNumber'] = this.totalNumber;
      this.changeCirculationConnectMessageList({DtMsg: circulationMessageListSure});
      setStore('currentCirculationConnectMessage',{innerMessage: circulationMessageListSure});
      this.$router.push({path:'/circulationTaskConnectMessageSure'})
      this.changeTitleTxt({tit:'交接信息确认'});
      setStore('currentTitle','交接信息确认')
    },

    // 交接信息取消事件
    ConnectCancel () {
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情');
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
    position: relative;
    .left-dropDown {
      .rightDropDown
    }
    .no-data {
      position: absolute;
      top: 200px;
      left: 0;
      width: 100%;
      text-align: center;
    }
    .loading {
      position: absolute;
      top: 260px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
    }
    .basic-message-title {
      font-size: 18px;
      color: #1a89fd;
      width: 93%;
      margin: 0 auto;
      margin-top: 10px;
      background: #fff;
      padding: 20px;
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
    .connect-message-checked-all {
      padding: 8px 20px;
      background: #ececec;
      width: 93%;
      margin: 0 auto;
      display: flex;
      box-sizing: border-box;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
      > p {
        color: black;
        font-size: 16px;
      };
      .checked-all-box {
        /deep/ .van-checkbox {
          .van-checkbox__icon {
            font-size: 16px;
          };
          .van-checkbox__label {
            color: black;
            font-size: 16px;
          }
        }
      };
      .total-number {
        font-size: 15px
      }
    };
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 93%;
      background: #fff;
      .sample-type-list {
        position: relative;
        padding: 6px 20px;
        box-sizing: border-box;
        .sample-type-title-wrapper {
          position: relative;
          height: 36px;
          line-height: 36px;
          font-size: 16px;
          color: #2895ea;
          .sample-type-check {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            /deep/ .van-checkbox {
              .van-checkbox__icon {
                font-size: 16px;
              };
              .van-checkbox__label {
                color: black;
                font-size: 16px;
              }
            }
          }
          .sample-type-total {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 15px;
            color: #9a9a9a
          };
          .sample-type-stepper {
            position: absolute;
            top: 0;
            left: 150px;
          }
        }
        .sample-type-message-wrapper{
          box-sizing: border-box;
          padding: 0 0 16px 24px;
          font-size: 16px;
          border-bottom: 1px solid #d5d5d5;
          .sample-type-message-list {
            width: 100%;
            box-sizing: border-box;
            padding-bottom: 8px;
            &:last-child {
              padding-bottom: 0
            };
            .wait-handle-message-one {
              height: 28px;
              line-height: 28px;
              overflow: auto;
              margin-left: -4px;
              span {
                display: inline-block;
                padding-left: 5px;
                box-sizing: border-box;
                color: #a0a0a0;
                &:first-child {
                  vertical-align: top;
                };
                &:last-child {
                  width: 70%;
                  color: black;
                }
              };
              p {
                display: inline-block;
                span {
                  color: black !important
                }
              }
            };
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
