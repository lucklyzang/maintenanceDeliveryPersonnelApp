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
     <div class="basic-message-title">
      <span>
        <img :src="connectMessagePng" alt="">
      </span>
       交接信息确认
     </div>
     <div class="connect-message-checked-all">
       <p class="checked-all-box">
         <van-checkbox v-model="checkAll" checked-color="#4f4f4f"  disabled >全选</van-checkbox>
       </p>
       <p class="total-number">数量 {{totalNumber}}</p>
     </div>
     <div class="sweep-code-area">
      <div class="sample-type-list" v-for="(item,index) in manageSampleDataList" :key="`${item}-${index}`">
        <div class="sample-type-title-wrapper">
          <div class="sample-type-check">
            <van-checkbox v-model="item.check" @click="checkBoxEvent" disabled checked-color="#4f4f4f">{{item.sampleTypeName}}</van-checkbox>
          </div>
          <div class="sample-type-total">数量 {{item.sampleTotal}}</div>
          <!-- <div class="sample-type-stepper">
            <van-stepper  v-model="item.sampleNumber" min="0" disabled/>
          </div> -->
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
                        disabled
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
    <div class="electronic-signature" v-if="showSignature">
      <ElectronicSignature ref="mychild"></ElectronicSignature>
    </div>
    <div class="rewrite-box" v-if="showSignature">
      <span @click="rewrite">重写</span>
    </div>
    <div class="btn-area">
      <p class="circultion-task-btn-top">
        <span @click="connectMessageSure">确 认</span>
        <span @click="connectMessageSure">取 消</span>
      </p>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import ElectronicSignature from '@/components/ElectronicSignature'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import FooterBottom from '@/components/FooterBottom'
import {sampleDelivery, updateCirculationTask} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore, removeStore, IsPC, deepClone } from '@/common/js/utils'
export default {
  name: 'circulationTaskConnectMessageSure',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      checkAll: true,
      totalNumber: 0,
      showSignature: false,
      isDialogShow: false,
      isClickCancelBtn: false,
      showSignatureBox: false,
      liIndex: null,
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
    FooterBottom,
    ElectronicSignature
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        if (!this.isDialogShow) {
          this.loseDataInfo();
          return
        }
      })
    };
    this.echoConectMessage()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'originalSignature',
      'currentElectronicSignature',
      'circulationConnectMessageList',
      'circulationTaskMessage',
      'storeArriveDeparnmentId',
      'storeAlreadyConnectSample',
      'storeNoConnectSample',
      'completeDeparnmentInfo',
      'circulationTaskId',
      'circulationDetails'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsrefreshCirculationConnectPage',
      'changeCirculationConnectMessageList',
      'changeCompleteDeparnmentInfo',
      'changeCurrentElectronicSignature',
      'changeIsstoreAlreadyConnectSample',
      'changeIsStoreNoConnectSample',
      'changeIsFreshCirculationTaskPage'
    ]),

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },

      // 丢失数据提示
      loseDataInfo () {
        this.isDialogShow = false;
        this.showSignatureBox = true;
        this.$dialog.alert({
          message: '返回上级后,将丢失本页数据!',
          closeOnPopstate: false,
          showCancelButton: true
        }).then(() => {
          this.changeCurrentElectronicSignature({DtMsg: null});
          this.changeIsrefreshCirculationConnectPage(false);
          this.$router.push({path:'/circulationTaskMessageConnect'});
          this.changeTitleTxt({tit:'信息交接'});
          setStore('currentTitle','信息交接');
          this.isDialogShow = true;
          this.showSignatureBox = true
        })
        .catch(() => {
          this.isDialogShow = false;
          this.showSignatureBox = true;
        })
      },

      // 重写
      rewrite () {
        try {
          this.$refs.mychild.overwrite()
        } catch (err) {
          
        }
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      // 显示签名框点击
      controlSignatureEvent () {
        this.showSignature = !this.showSignature
      },

    // 回显交接信息
    echoConectMessage () {
      this.manageSampleDataList = deepClone(this.circulationConnectMessageList);
      this.totalNumber = this.manageSampleDataList[0]['totalNumber'];
      console.log('交接',this.manageSampleDataList);
    },

    // 返回上一页
    backTo () {
      this.loseDataInfo()
    },

    // 还有要交接的标本
    connectSure () {
      this.$toast('交接成功');
      // 当前页面回显数据
      this.manageSampleDataList = [];
      // 清空本页面store的签名数据
      this.changeCurrentElectronicSignature({DtMsg: null});
      // 清空上一页面store的已选择标本
      this.changeCirculationConnectMessageList({DtMsg:[]});
      // 清空上一页面Localstorage已选择标本
      removeStore('currentCirculationConnectMessage');
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情');
    },

    // 没有要交接的标本
    connectCancel () {
      this.updateCirculationtaskState({
        proId: this.proId,		 //当前项目ID
        id: this.circulationTaskId, //当前任务ID
        state: 7 //更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'}
      });
    },

    // 提交标本交接信息
    postSampleConnectMessage(data) {
      sampleDelivery(data).then((res) => {
        if (res && res.data.code == 200) {
          // 存储已经交接的标本信息
          let temporarySampleArrayOne = [];
          let temporarySampleArrayTwo = [];
          // store存的交接标本信息赋值
          temporarySampleArrayOne = deepClone(this.storeAlreadyConnectSample);
          // 将本次交接的标本信息和之前存的已交接标本信息合并
          temporarySampleArrayTwo = temporarySampleArrayOne.concat(this.circulationConnectMessageList);
          // 新的已交接标本信息重新存入store
          this.changeIsstoreAlreadyConnectSample(temporarySampleArrayTwo);
          this.changeCurrentElectronicSignature({DtMsg: null});
          // 删除本次locaStorage的交接科室id
          removeStore('currentDepartmentId');
          // 如果未交接的标本信息数量为0并且所有科室都已采集完成,则结束本次循环任务,更新该条任务状态为已完成
          if (this.storeNoConnectSample.length == 0) {
            if (this.circulationDetails['spaces'].every((item) => item.check) == true ) {
              this.connectCancel()
            } else {
              this.connectSure()
            }
          } else {
            this.connectSure()
          }
        } else {
          this.$dialog.alert({
            message: res.data.msg,
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

    // 更新循环任务状态
    updateCirculationtaskState (data) {
      updateCirculationTask(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast('该条任务已完成');
          // 清空当前页面回显数据
          this.manageSampleDataList = [];
          // 清空本页store的签名信息
          this.changeCurrentElectronicSignature({DtMsg: null});
          // 清空上一页面store的标本选择信息
          this.changeCirculationConnectMessageList({DtMsg:[]});
          // 清空store已完成科室信息
          let temporaryCompleteInfo = deepClone(this.completeDeparnmentInfo);
          temporaryCompleteInfo = temporaryCompleteInfo.filter((item) => { return item.taskId != this.circulationTaskId});
          this.changeCompleteDeparnmentInfo({DtMsg: temporaryCompleteInfo});
          // 清空Localstorage的已完成科室信息
          setStore('completeDepartmentMessage', {"sureInfo": temporaryCompleteInfo});
          // 清空store没有完成交接的标本信息
          this.changeIsStoreNoConnectSample([]);
          // 清空store存储的已交接标本信息
          this.changeIsstoreAlreadyConnectSample([]);
          // 清空上一页面Localstorage标本选择信息
          removeStore('currentCirculationConnectMessage');
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

     // 交接信息确认事件
    connectMessageSure () {
      // this.$refs.mychild.commitSure();
      // if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
      //   return
      // };
      let connectSampleId = [];
      // 获取需要交接的标本id
      for (let item of this.manageSampleDataList) {
        for (let innerItem in item) {
          if (innerItem == 'sampleList') {
            for (let currentItem of item['sampleList']) {
              for (let idFieId in currentItem) {
                if (idFieId == 'id') {
                  connectSampleId.push(currentItem[idFieId]);
                }
              }
            }
          }
        }
      };
      this.postSampleConnectMessage({
        proId: this.proId,  //项目ID
        departmentId: this.storeArriveDeparnmentId,  //送达科室ID
        singImg: '',   //送达签名图片信息this.currentElectronicSignature
        ids: connectSampleId   //送达选择的标本ID
      })
    },

    // 交接信息取消事件
    connectMessageCancel () {
      this.$dialog.alert({
        message: '返回上页后,将丢失本页数据!',
        closeOnPopstate: false,
        showCancelButton: true
        }).then(() => {
          this.changeCurrentElectronicSignature({DtMsg: null});
          this.changeCirculationConnectMessageList({DtMsg:[]});
          this.changeIsrefreshCirculationConnectPage(false);
          this.$router.push({path:'/circulationTaskMessageConnect'});
          this.changeTitleTxt({tit:'信息交接'});
          setStore('currentTitle','信息交接')}
        )
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
    .electronic-signature {
      height: 250px
    };
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
