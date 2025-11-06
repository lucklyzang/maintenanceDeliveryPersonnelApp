<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
      <NavBar path="/pollingTaskDetails" title="巡检任务详情" />
    </div>
    <div class="content">
        <div class="content-top">
            <div class="department-name">
                <van-icon name="location" color="#101010" size="22" />
                <span>{{ pollingTaskDepartmentMessage.depName }}</span>
            </div>
            <div class="tabs-area">
                <span v-for="(item,index) in tabsList" :class="{ 'spanStyle': currentTabIndex == index }" :key="index" @click="tabsClickEvent(item,index)">
                    {{ `${item}(${index == 0 ? departmentCornerList.length : index == 1 ? qualifiedDepartmentCornerList.length : noQualifiedDepartmentCornerList.length})` }}
                </span>
            </div>
        </div>
        <div class="content-bottom" v-if="currentTabIndex == 0">
            <van-empty v-show="allEmptyShow" description="暂无数据" />
            <div class="corner-list" :class="{'cornerListStyle' : item.checkResult == 2 }" v-for="(item,index) in departmentCornerList" :key="index" @click="cornerClickEvent(item,index)">
                <div class="corner-name">{{ `${item.areaName}${item.ribbonName}` }}</div>
                <div class="corner-right">
                    <span v-if="item.checkResult != 0" :class="{'spanStyle' : item.checkResult == 2}">{{ item.checkResult == 1 ? '合格' : '不合格' }}</span>
                    <van-icon name="arrow" color="#101010"  size="25" />
                </div>
            </div>
        </div>
        <div class="content-bottom" v-if="currentTabIndex == 1">
            <van-empty v-show="qualifiedEmptyShow" description="暂无数据" />
            <div class="corner-list" :class="{'cornerListStyle' : item.checkResult == 2 }" v-for="(item,index) in qualifiedDepartmentCornerList" :key="index" @click="cornerClickEvent(item,index)">
                <div class="corner-name">{{ `${item.areaName}${item.ribbonName}` }}</div>
                <div class="corner-right">
                    <span v-if="item.checkResult != 0" :class="{'spanStyle' : item.checkResult == 2}">{{ item.checkResult == 1 ? '合格' : '不合格' }}</span>
                    <van-icon name="arrow" color="#101010"  size="25" />
                </div>
            </div>
        </div>
        <div class="content-bottom" v-if="currentTabIndex == 2">
            <van-empty v-show="noQualifiedEmptyShow" description="暂无数据" />
            <div class="corner-list" :class="{'cornerListStyle' : item.checkResult == 2 }" v-for="(item,index) in noQualifiedDepartmentCornerList" :key="index" @click="cornerClickEvent(item,index)">
                <div class="corner-name">{{ `${item.areaName}${item.ribbonName}` }}</div>
                <div class="corner-right">
                    <span v-if="item.checkResult != 0" :class="{'spanStyle' : item.checkResult == 2}">{{ item.checkResult == 1 ? '合格' : '不合格' }}</span>
                    <van-icon name="arrow" color="#101010"  size="25" />
                </div>
            </div>
        </div>
        <div v-if="pollingTaskDepartmentMessage['currentTabIndex'] == pollingTaskDepartmentMessage['timeTabList'].length - 1">
             <div class="btn-box" @click="allExamineQualifiedEvent"
                v-if="cleanTaskDetails.state != 3 && (new Date().getTime() >= new Date(getNowFormatDate(pollingTaskDepartmentMessage['timeTabList'][pollingTaskDepartmentMessage['timeTabList'].length-1])).getTime())">
                    全部检查合格
            </div>
        </div>
        <div v-else>
             <div class="btn-box" @click="allExamineQualifiedEvent"
                v-if="cleanTaskDetails.state != 3 && (new Date().getTime() < new Date(getNowFormatDate(pollingTaskDepartmentMessage['timeTabList'][pollingTaskDepartmentMessage['currentTabIndex']+1])).getTime() && new Date(getNowFormatDate(pollingTaskDepartmentMessage['timeTabList'][pollingTaskDepartmentMessage['currentTabIndex']])).getTime() <= new Date().getTime())">
                    全部检查合格
            </div>
        </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { checkConfirmAll, departmentScanCode, departmentInto } from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "PollingTaskDepartmentDetails",
  components: {
    NavBar
  },
  data() {
    return {
        currentTabIndex: 0,
        loadingShow: false,
        allEmptyShow: false,
        qualifiedEmptyShow: false,
        noQualifiedEmptyShow: false,
        overlayShow: false,
        tabsList: ['功能区','检查合格','检查不合格'],
        allDepartmentCornerList: [],
        departmentCornerList: [],
        qualifiedDepartmentCornerList: [],
        noQualifiedDepartmentCornerList: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/pollingTaskDetails",
        })
      })
    };
    console.log('sas1',this.pollingTaskDepartmentMessage);
    if (this.pollingTaskDepartmentMessage.intoWay == 1) {
        this.getDepartmentScanCode()
    } else if (this.pollingTaskDepartmentMessage.intoWay == 2) {
        this.getDepartmentDetails()
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","pollingTaskDepartmentMessage","cleanTaskDetails"]),
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
    ...mapMutations(["changeIsLogin","storePollingTaskDepartmentFunctionalZoneMessage"]),

    // 提交过的功能区下沉处理
    disposeZoneList(arr) {
      if (Object.prototype.toString.call(arr) != '[object Array]') { return };
      if (arr.length == 0) { return arr };
      if (arr.every((item) => { return item.checkResult == 0})) { return arr };
      let temporary = [];
      for (let item of arr) {
        if (item.checkResult == 1 || item.checkResult == 2) {
          temporary.push(item)
        } else {
          temporary.unshift(item)
        }
      };
      return temporary
    },

    //tab切换点击事件
    tabsClickEvent (item,index) {
        this.currentTabIndex = index;
        if (item == '功能区') {
            this.departmentCornerList = this.disposeZoneList(this.allDepartmentCornerList)
        } else if (item == '检查合格') {
            this.qualifiedDepartmentCornerList = this.allDepartmentCornerList.filter((item) => { return item.checkResult == 1})
        } else if (item == '检查不合格') {
            this.noQualifiedDepartmentCornerList = this.allDepartmentCornerList.filter((item) => { return item.checkResult == 2})
        };
        if (this.departmentCornerList.length == 0) {
            this.allEmptyShow = true
        } else {
            this.allEmptyShow = false
        };
        if (this.qualifiedDepartmentCornerList.length == 0) {
            this.qualifiedEmptyShow = true
        } else {
            this.qualifiedEmptyShow = false
        };
        if (this.noQualifiedDepartmentCornerList.length == 0) {
            this.noQualifiedEmptyShow = true
        } else {
            this.noQualifiedEmptyShow = false
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

    // 功能区列表点击事件
    cornerClickEvent (item,index) {
        // 已完成的任务,已经扫码过的科室里面的功能区依然可以编辑
        if (this.cleanTaskDetails.state == 3) {
            // checkResult 检查结果，默认为0，1-合格，2-不合格
            if (item.checkResult == 0) {
                this.$toast({
                    message: '该功能区所在任务已完成！不能在进入提交',
                    type: 'fail'
                })
            } else {
                this.storePollingTaskDepartmentFunctionalZoneMessage(item);
                this.$router.push({path: '/pollingTaskDepartmentCornerDetails'})
            }   
        } else {
            // 已过时间段的任务功能区不能在点进去提交,可以编辑提交过的(最后一个时间点除外)
            if (this.pollingTaskDepartmentMessage['currentTabIndex'] != this.pollingTaskDepartmentMessage['timeTabList'].length - 1) {
                if (new Date().getTime() >= new Date(this.getNowFormatDate(this.pollingTaskDepartmentMessage['timeTabList'][this.pollingTaskDepartmentMessage['currentTabIndex']+1])).getTime()) {
                    // checkResult 检查结果，默认为0，1-合格，2-不合格
                    if (item.checkResult == 0) {
                        this.$toast({
                            message: '该功能区所在任务已过检查时间！不能在进入提交',
                            type: 'fail'
                        })
                    } else {
                        this.storePollingTaskDepartmentFunctionalZoneMessage(item);
                        this.$router.push({path: '/pollingTaskDepartmentCornerDetails'})
                    }   
                } else {
                    this.storePollingTaskDepartmentFunctionalZoneMessage(item);
                    this.$router.push({path: '/pollingTaskDepartmentCornerDetails'})
                }
            } else {
                this.storePollingTaskDepartmentFunctionalZoneMessage(item);
                this.$router.push({path: '/pollingTaskDepartmentCornerDetails'})
            }
        }
    },

    // 查询科室详情事件(科室点击)
    getDepartmentDetails () {
        this.loadingShow = true;
        this.overlayShow = true;
        this.allEmptyShow = false;
        departmentInto({
            subId: this.pollingTaskDepartmentMessage.id, // 子任务id
            depId: this.pollingTaskDepartmentMessage.depId // 科室id
        })
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
                if (res.data.data.length > 0) {
                    this.allDepartmentCornerList = res.data.data;
                    this.departmentCornerList = this.disposeZoneList(res.data.data);
                    this.qualifiedDepartmentCornerList = this.allDepartmentCornerList.filter((item) => { return item.checkResult == 1});
                    this.noQualifiedDepartmentCornerList = this.allDepartmentCornerList.filter((item) => { return item.checkResult == 2})
                } else {
                    this.allEmptyShow = true
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
    },

    // 查询科室详情事件(科室扫码)
    getDepartmentScanCode () {
        this.loadingShow = true;
        this.overlayShow = true;
        this.allEmptyShow = false;
        departmentScanCode({
            scanTime: this.$moment().format('HH:mm:ss'),
            subId: this.pollingTaskDepartmentMessage.id,
            taskId: this.cleanTaskDetails.id, // 任务id
            depId: this.pollingTaskDepartmentMessage.depId // 科室id
        })
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
                if (res.data.data.length > 0) {
                    this.allDepartmentCornerList = res.data.data;
                    this.departmentCornerList = this.disposeZoneList(res.data.data);
                    this.qualifiedDepartmentCornerList = this.allDepartmentCornerList.filter((item) => { return item.checkResult == 1});
                    this.noQualifiedDepartmentCornerList = this.allDepartmentCornerList.filter((item) => { return item.checkResult == 2})
                } else {
                    this.allEmptyShow = true
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
    },

    // 全部检查合格事件
    allExamineQualifiedEvent () {
        this.loadingShow = true;
        this.overlayShow = true;
        checkConfirmAll({taskId:this.departmentCornerList[0]['taskId'],subId:this.departmentCornerList[0]['subId'],depId:this.pollingTaskDepartmentMessage.depId})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
               this.$Alert({message:"全部提交成功!",duration:3000,type:'success'});
               if (this.pollingTaskDepartmentMessage.intoWay == 1) {
                    this.getDepartmentScanCode()
                } else if (this.pollingTaskDepartmentMessage.intoWay == 2) {
                    this.getDepartmentDetails()
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
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #F8F8F8;
    height: 0;
    .content-top {
        width: 98%;
        background: #fff;
        margin: 0 auto;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 4px;
        box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
        padding: 10px 10px 0 10px;
        box-sizing: border-box;
        .department-name {
            color: #101010;
            font-size: 16px;
            font-weight: bold;
            >span {
                vertical-align: middle
            };
            /deep/ .van-icon {
                vertical-align: middle
            }
        };
        .tabs-area {
            width: 100%;
            margin-top: 22px;
            display: flex;
            align-items: center;
            >span {
                display: inline-block;
                height: 20px;
                margin-right: 30px;
                font-size: 12px;
                color: #101010
            };
            .spanStyle {
                color: #1965FF !important;
                border-bottom: 3px solid #1965FF
            }
        }
    };
    .content-bottom {
        flex: 1;
        overflow: auto;
        position: relative;
        /deep/ .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
        };
        .corner-list {
            height: 40px;
            background: #fff;
            display: flex;
            border-radius: 6px;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            box-sizing: border-box;
            width: 98%;
            margin: 0 auto;
            margin-bottom: 10px;
            font-size: 14px;
            .corner-name {
                color: #101010;
                flex: 1;
                word-break: break-all
            };
            .corner-right {
                >span {
                    vertical-align: middle;
                    color: #289E8E
                };
                .spanStyle {
                    color: #E86F50 !important
                };
                /deep/ .van-icon {
                    vertical-align: middle
                }
            }
        };
        .cornerListStyle {
            background: #F7CABE !important
        }
    };
    .btn-box {
        height: 48px;
        width: 266px;
        font-size: 18px;
        margin: 0 auto;
        line-height: 48px;
        background: linear-gradient(to right, #6cd2f8, #2390fe);
        box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
        color: #fff;
        border-radius: 30px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
  }
}
</style>