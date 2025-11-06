<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
       <van-nav-bar
        title="巡检任务详情"
        left-text="返回"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
        <template #right>
            <van-icon v-show="cleanTaskDetails.state != 3" name="scan" size="23" color="#101010" @click="scanQRCode" />
            <van-icon v-show="cleanTaskDetails.state == 3 && cleanTaskDetails['ratioMap']['finish'] != cleanTaskDetails['ratioMap']['all']" name="records" size="23" color="#101010" @click="editReasonEvent"/>
        </template>
    </van-nav-bar>
    </div>
    <div class="content">
      <van-empty v-show="emptyShow" description="暂无数据" />
      <div class="time-tab">
        <span v-for="(item,index) in timeTabList" :key="index" :class="{'tabStyle': currentTabIndex == index}" @click="tabEvent(item,index)">{{ item }}</span>
      </div>
      <div class="departments-name-list" v-for="(item,index) in currentDepartmentsNameList" :key="index">
          <div class="departments-name-left">
              {{ item['depName'] }}
          </div>
          <div class="departments-name-right" @click="departmentClickEvent(item)" v-if="cleanTaskDetails.state != 3">
            <div v-if="currentTabIndex == timeTabList.length - 1">
              <span :class="{'departmentsNameRightStyle':item['flag'] == 1,'noScanStyle': (new Date().getTime() < new Date(getNowFormatDate(timeTabList[currentTabIndex])).getTime()) && item['flag'] == 0}">{{ item['flag'] == 0 ? '未扫码' : '已扫码' }}</span>
              <van-icon v-show="(new Date().getTime() >= new Date(getNowFormatDate(timeTabList[currentTabIndex])).getTime()) || item['flag'] == 1" name="arrow" :color="item['flag'] == 0 ? 'red':'#00c400'" size="24" />
            </div>
            <div v-else>
              <span :class="{'departmentsNameRightStyle':item['flag'] == 1,'noScanStyle': (new Date().getTime() >= new Date(getNowFormatDate(timeTabList[currentTabIndex+1])).getTime() || new Date(getNowFormatDate(timeTabList[currentTabIndex])).getTime() > new Date().getTime()) && item['flag'] == 0}">{{ item['flag'] == 0 ? '未扫码' : '已扫码' }}</span>
              <van-icon v-show="(new Date().getTime() < new Date(getNowFormatDate(timeTabList[currentTabIndex+1])).getTime() && new Date(getNowFormatDate(timeTabList[currentTabIndex])).getTime() <= new Date().getTime()) || item['flag'] == 1" name="arrow" :color="item['flag'] == 0 ? 'red':'#00c400'" size="24" />
            </div>
          </div>
          <div class="departments-name-right" @click="departmentClickEvent(item)" v-else>
            <span :class="{'departmentsNameRightStyle':item['flag'] == 1,'noScanStyle': item['flag'] == 0}">{{ item['flag'] == 0 ? '未扫码' : '已扫码' }}</span>
            <van-icon v-if="item['flag'] == 1" name="arrow" :color="item['flag'] == 0 ? 'red':'#00c400'" size="24" />
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSinglePollingTaskMessage } from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC, arrDateTimeSort } from "@/common/js/utils";
export default {
  name: "PollingTaskDetails",
  components: {
  },
  data() {
    return {
      currentTabIndex: 0,
      emptyShow: false,
      loadingShow: false,
      overlayShow: false,
      subId: '',
      timeTabList: [],
      departmentsNameList: [],
      currentDepartmentsNameList: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleaningTask"
        })
      })
    };
    this.getPollingTaskDetails();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","pollingTaskDepartmentMessage","cleanTaskDetails","pollingTaskCurrentShowTime"]),
    userName() {
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
    }
  },

  methods: {
    ...mapMutations(['storePollingTaskDepartmentMessage',"storePollingTaskCurrentShowTime"]),
    onClickLeft() {
      this.$router.push({ path: "/cleaningTask"})
    },

    // 时间tab点击事件
    tabEvent (item,index) {
      this.currentTabIndex = index;
      this.currentDepartmentsNameList = this.departmentsNameList.filter((innerItem) => { return innerItem['startTime'] == item })[0]['spaces'];
      this.subId = this.departmentsNameList.filter((innerItem) => { return innerItem['startTime'] == item })[0]['id']
    },

    // 编辑原因事件
    editReasonEvent () {
      this.$router.push({
        path: "/pollingTaskNoCompleteReason"
      })
    },

    // 扫描二维码方法
    scanQRCode () {
      window.android.scanQRcode()
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
      this.$router.push({
        path: "/cleaningTask"
      })
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        try {
          if (codeData.length > 0) {
            // 判断该扫描科室是否已经扫过码0-未扫码,1-已扫码
            if (this.currentDepartmentsNameList.filter((innerItem) => { return innerItem['depId'] == codeData[0] })[0]['flag'] == 1) {
              let temporaryPollingTaskDepartmentMessage = this.pollingTaskDepartmentMessage;
              temporaryPollingTaskDepartmentMessage['intoWay'] = 1;
              temporaryPollingTaskDepartmentMessage['id'] = this.subId;
              temporaryPollingTaskDepartmentMessage['timeTabList'] = this.timeTabList;
              temporaryPollingTaskDepartmentMessage['currentTabIndex'] = this.currentTabIndex;
              temporaryPollingTaskDepartmentMessage['depId'] = codeData[0];
              temporaryPollingTaskDepartmentMessage['depName'] = this.currentDepartmentsNameList.filter((innerItem) => { return innerItem['depId'] == codeData[0] })[0]['depName'];
              this.storePollingTaskDepartmentMessage(temporaryPollingTaskDepartmentMessage);
              this.storePollingTaskCurrentShowTime(this.timeTabList[this.currentTabIndex]);
              this.$router.push({
                path: "/pollingTaskDepartmentDetails"
              })
            } else if (this.currentDepartmentsNameList.filter((innerItem) => { return innerItem['depId'] == codeData[0] })[0]['flag'] == 0) {
              // 未到开始时间也不能扫码检查未到开始时间的任务
              if (new Date(this.getNowFormatDate(this.timeTabList[this.currentTabIndex])).getTime() > new Date().getTime()) {
                this.$toast({
                  message: '该任务未到检查时间！无法扫码',
                  type: 'fail'
                })
              } else {
                // 未扫码的科室如果错过当前时间段,则不能在扫码检查已过时间段的任务(最后一个时间段除外)
                if (this.currentTabIndex != this.timeTabList.length - 1) {
                  if (new Date().getTime() >= new Date(this.getNowFormatDate(this.timeTabList[this.currentTabIndex+1])).getTime()) {
                    this.$toast({
                      message: '该任务已过检查时间！无法扫码',
                      type: 'fail'
                    })
                  } else {
                    let temporaryPollingTaskDepartmentMessage = this.pollingTaskDepartmentMessage;
                    temporaryPollingTaskDepartmentMessage['intoWay'] = 1;
                    temporaryPollingTaskDepartmentMessage['id'] = this.subId;
                    temporaryPollingTaskDepartmentMessage['timeTabList'] = this.timeTabList;
                    temporaryPollingTaskDepartmentMessage['currentTabIndex'] = this.currentTabIndex;
                    temporaryPollingTaskDepartmentMessage['depId'] = codeData[0];
                    temporaryPollingTaskDepartmentMessage['depName'] = this.currentDepartmentsNameList.filter((innerItem) => { return innerItem['depId'] == codeData[0] })[0]['depName'];
                    this.storePollingTaskDepartmentMessage(temporaryPollingTaskDepartmentMessage);
                    this.storePollingTaskCurrentShowTime(this.timeTabList[this.currentTabIndex]);
                    this.$router.push({
                      path: "/pollingTaskDepartmentDetails"
                    })
                  }
                } else {
                  let temporaryPollingTaskDepartmentMessage = this.pollingTaskDepartmentMessage;
                  temporaryPollingTaskDepartmentMessage['intoWay'] = 1;
                  temporaryPollingTaskDepartmentMessage['id'] = this.subId;
                  temporaryPollingTaskDepartmentMessage['timeTabList'] = this.timeTabList;
                  temporaryPollingTaskDepartmentMessage['currentTabIndex'] = this.currentTabIndex;
                  temporaryPollingTaskDepartmentMessage['depId'] = codeData[0];
                  temporaryPollingTaskDepartmentMessage['depName'] = this.currentDepartmentsNameList.filter((innerItem) => { return innerItem['depId'] == codeData[0] })[0]['depName'];
                  this.storePollingTaskDepartmentMessage(temporaryPollingTaskDepartmentMessage);
                  this.storePollingTaskCurrentShowTime(this.timeTabList[this.currentTabIndex]);
                  this.$router.push({
                    path: "/pollingTaskDepartmentDetails"
                  })
                }
              }
            }
          }
        } catch (err) {
          this.$toast({
            message: `${err}`,
            type: 'fail'
          })
        }  
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.scanQRCode()
        });
      }
    },

    // 拼接完整时间
    getNowFormatDate(hourTime) {
      let currentdate;
      let strDate;
      let seperator1 = "-";
      let month = new Date().getMonth() + 1;
      strDate = new Date().getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      };
      currentdate = new Date().getFullYear() + seperator1 + month + seperator1 + strDate
      return currentdate + ' ' + hourTime
    },

    // 科室点击事件
    departmentClickEvent (item) {
      // 0-未扫码，1-已扫码
      if (item.flag == 1) {
        let temporaryPollingTaskDepartmentMessage = item;
        temporaryPollingTaskDepartmentMessage['intoWay'] = 2;
        temporaryPollingTaskDepartmentMessage['id'] = this.subId;
        temporaryPollingTaskDepartmentMessage['timeTabList'] = this.timeTabList;
        temporaryPollingTaskDepartmentMessage['currentTabIndex'] = this.currentTabIndex;
        this.storePollingTaskDepartmentMessage(item);
        this.storePollingTaskCurrentShowTime(this.timeTabList[this.currentTabIndex]);
        this.$router.push({
          path: "/pollingTaskDepartmentDetails"
        })
      } else {
        if (this.cleanTaskDetails.state != 3) {
          if (this.currentTabIndex == this.timeTabList.length - 1) {
            if (new Date().getTime() >= new Date(this.getNowFormatDate(this.timeTabList[this.timeTabList.length-1])).getTime()) {
              this.$Alert({message:"请扫描科室二维码!",duration:2000,type:'fail'})
            }
          } else {
            if (new Date().getTime() < new Date(this.getNowFormatDate(this.timeTabList[this.currentTabIndex+1])).getTime() && new Date(this.getNowFormatDate(this.timeTabList[this.currentTabIndex])).getTime() <= new Date().getTime()) {
              this.$Alert({message:"请扫描科室二维码!",duration:2000,type:'fail'})
            }
          }
        }
      }
    },

    // 获取任务详情
    getPollingTaskDetails () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.emptyShow = false;
      getSinglePollingTaskMessage(this.cleanTaskDetails.id)
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        if (res && res.data.code == 200) {
            if (res.data.data.length == 0) {
              this.emptyShow = true
            } else {
              for (let item of res.data.data) {
                this.timeTabList.push(item['startTime'])
              };
              // 后台返回的时间列表不一定是升序排列,此处将时间列表统一做升序处理
              this.timeTabList = arrDateTimeSort(this.timeTabList);
              this.departmentsNameList = res.data.data;
              // 回显进入该页面之前选中的时间
              this.currentTabIndex = this.timeTabList.findIndex((item) => { return item == this.pollingTaskCurrentShowTime});
              if (this.currentTabIndex == -1) { this.currentTabIndex = 0 };
              this.currentDepartmentsNameList = this.departmentsNameList.filter((innerItem) => { return innerItem['startTime'] == this.timeTabList[this.currentTabIndex] })[0]['spaces'];
              this.subId = this.departmentsNameList.filter((innerItem) => { return innerItem['startTime'] == this.timeTabList[this.currentTabIndex]})[0]['id']
            }
          } else {
            this.$toast({
              message: `${res.data.msg}`,
              type: 'fail'
            })
          }
        })
        .catch((err) => {
          this.$toast({
              message: `${err}`,
              type: 'fail'
          });
          this.loadingShow = false;
          this.overlayShow = false
        })
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  background: #F8F8F8;
  .content-wrapper();
  /deep/ .van-loading {
    z-index: 1000000
  };
  .nav {
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: black !important;
                margin-left: 8px !important;
            };
            .van-icon {
                color: black !important;
                font-size: 22px !important;
            }
        }
        .van-nav-bar__title {
            color: black !important;
            font-size: 16px !important;
        }
    }
  };
  /deep/ .van-popup {
    z-index: 30000 !important
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0 6px 6px 6px;
    box-sizing: border-box;
    position: relative;
    /deep/ .van-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%)
    };
    .departments-name-list {
        width: 100%;
        padding: 6px 8px;
        height: 50px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .departments-name-left {
            flex: 1;
            font-size: 16px;
            color: #101010;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all
        };
        .departments-name-right {
            font-size: 14px;
            /deep/ .van-icon {
              vertical-align: middle
            };
            span {
              color: red;
              vertical-align: middle
            };
            .departmentsNameRightStyle {
              color: #00c400 !important
            };
            .noScanStyle {
              color: #969799 !important;
              margin-right: 26px !important
            }
        };
    };
    .time-tab {
      width: 100%;
      padding: 6px 0;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      overflow-x: scroll;
      white-space: nowrap;
      &::-webkit-scrollbar {
        height: 0;
        display: none
      };
      >span {
        flex: none;
        display: inline-block;
        width: 70px;
        font-size: 14px;
        color: #101010
      };
      .tabStyle {
        color: #289E8E !important
      }
    }
  }
}
</style>