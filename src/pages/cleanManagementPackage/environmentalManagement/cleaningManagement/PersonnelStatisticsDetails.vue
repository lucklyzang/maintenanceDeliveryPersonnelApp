<template>
  <div class="page-box">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
       <van-nav-bar
        title="统计详情"
        left-text="返回"
        right-text=""
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    />
    </div>
    <div class="content">
       <div class="data-sources-box">
           <span>数据来源</span>
           <span>
               {{ personnelStatisticsDetailsMessage.content.name }}
           </span>
       </div>
       <div class="data-content">
           <div class="data-content-top">
                <div class="attendance-status-list" v-for="(item,index) in attendanceStatusList"
                    :key="index"
                    :class="{'attendanceStyle': index == 0,'clockingStyle': index == 1,
                        'expatriateStyle': index == 2,'occupationalInjuryStyle': index == 3, 'sickLeaveStyle': index == 4, 'vocationStyle': index == 5,
                        'affairsStyle': index == 6,'overtimeStyle': index == 7, 'changeShiftStyle': index == 8, 'absenteeismStyle': index == 9
                    }"
                >
                    <span>{{ `${item.attendanceType}` }}</span>
                    <span>{{`${item.duration} ${item.attendanceType == '加班' ? "小时" : "天"}`}}</span>
                </div> 
           </div>
           <div class="data-content-bottom" v-if="loadingComplete">
                <div class="calendar-container">
                    <div class="calendar-container-top">
                        <h1>{{ getNowFormatDateText(currentPersonDate,'person') }}</h1>
                        <div class="calendar-week">
                            <div class="cw-inner">
                                <div
                                    class="cw-item"
                                    v-for="(item, index) of week"
                                    :key="index">
                                    {{item}}
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div class="calendar-day">
                        <div class="cd-list" v-for="(item, index) of day" :key="index">
                            <div class="cl-item" v-for="(child,innerIndex) of item" @click="dayClickEvent(child,innerIndex,index)" :key="innerIndex" :class="[{has: child},{'clItemStyle': activeDayIndex == index && activeInnerDayIndex == innerIndex && child}]">
                                <div class="ci-inner" v-if="child" :class="{'ciInnerStyle' : child && child.text && child.text.morning != '未签到' && child.text.afternoon != '未签到'}">
                                    <span>{{child.date}}</span>
                                    <span  v-if="child.text" :class="{'attendanceStyle': attendanceTypeTransition(child.text.morning) == 1,'expatriateStyle': attendanceTypeTransition(child.text.morning) == 2,
                                        'occupationalInjuryStyle': attendanceTypeTransition(child.text.morning) == 3,'sickLeaveStyle': attendanceTypeTransition(child.text.morning) == 4, 'changeShiftStyle': attendanceTypeTransition(child.text.morning) == 5, 'vocationStyle': attendanceTypeTransition(child.text.morning) == 6,
                                        'overtimeStyle': attendanceTypeTransition(child.text.morning) == 7,'clockingStyle': attendanceTypeTransition(child.text.morning) == 8, 'absenteeismStyle': attendanceTypeTransition(child.text.morning) == 9, 'affairsStyle': attendanceTypeTransition(child.text.morning) == 10
                                    }"></span>
                                    <span  v-if="child.text" :class="{'attendanceStyle': attendanceTypeTransition(child.text.afternoon) == 1,'expatriateStyle': attendanceTypeTransition(child.text.afternoon) == 2,
                                        'occupationalInjuryStyle': attendanceTypeTransition(child.text.afternoon) == 3,'sickLeaveStyle': attendanceTypeTransition(child.text.afternoon) == 4, 'changeShiftStyle': attendanceTypeTransition(child.text.afternoon) == 5, 'vocationStyle': attendanceTypeTransition(child.text.afternoon) == 6,
                                        'overtimeStyle': attendanceTypeTransition(child.text.afternoon) == 7,'clockingStyle': attendanceTypeTransition(child.text.afternoon) == 8, 'absenteeismStyle': attendanceTypeTransition(child.text.afternoon) == 9, 'affairsStyle': attendanceTypeTransition(child.text.afternoon) == 10
                                    }"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
       </div>
       <div class="attendance-message-box" v-if="loadingComplete">
           <div class="date-box">
               {{ addDay(getNowFormatDate(currentPersonDate,'person'),currentDayMessage.date) }}
           </div>
           <div class="attendance-condition">
               <div class="attendance-condition-left">考勤情况</div>
               <div class="attendance-condition-right">
                   <div class="forenoon-attendance">
                       <span>上午</span>
                       <span :class="{'attendanceStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 1,'expatriateStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 2,
                            'occupationalInjuryStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 3,'sickLeaveStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 4, 'changeShiftStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 5, 'vocationStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 6,
                            'overtimeStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 7,'clockingStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 8, 'absenteeismStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 9, 'affairsStyle': attendanceTypeTransition(currentDayMessage.text.morning) == 10
                        }">{{ currentDayMessage.text.morning }}</span>
                   </div>
                   <div class="afternoon-attendance">
                       <span>下午</span>
                       <span :class="{'attendanceStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 1,'expatriateStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 2,
                            'occupationalInjuryStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 3,'sickLeaveStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 4, 'changeShiftStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 5, 'vocationStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 6,
                            'overtimeStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 7,'clockingStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 8, 'absenteeismStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 9, 'affairsStyle': attendanceTypeTransition(currentDayMessage.text.afternoon) == 10
                        }">{{ currentDayMessage.text.afternoon }}</span>
                   </div>
               </div>
           </div>
           <div class="attendance-condition">
               <div class="attendance-condition-left">打卡时间</div>
               <div class="attendance-condition-right">
                   <div class="forenoon-attendance">
                       <span>上午</span>
                       <span>{{ !currentDayMessage.text.inTime ? '-' : currentDayMessage.text.inTime }}</span>
                   </div>
                   <div class="afternoon-attendance">
                       <span>下午</span>
                       <span>{{ !currentDayMessage.text.outTime ?  '-' : currentDayMessage.text.outTime }}</span>
                   </div>
               </div>
           </div>
       </div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {cleanAttendancePeopleInfo} from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC,deepClone } from "@/common/js/utils";
export default {
  name: "PersonnelStatisticsDetails",
  components: {
    NavBar,
  },
  data() {
    return {
        loadingShow: false,
        overlayShow: false,
        activeDayIndex: 0,
        activeInnerDayIndex: 0,
        loadingComplete: false,
        currentDayMessage: {
            text: {
                afternoon: '',
                date: '',
                inTime: '',
                morning: '',
                outTime: ''
            },
            date: ''
        },
        currentPersonDate: new Date(),
        attendanceStatusList: [
            {attendanceType:'出勤', duration: 13.4},
            {attendanceType:'迟到早退', duration: 13},
            {attendanceType: '外派', duration: 1},
            {attendanceType:'工伤', duration: 3},
            {attendanceType: '病假', duration: 6},
            {attendanceType: '休假', duration: 4},
            {attendanceType: '事假', duration: 2},
            {attendanceType: '加班', duration: 8},
            {attendanceType: '调班', duration: 4},
            {attendanceType: '旷工', duration: 2}
        ],
        kqzlData: {},
        week: [
        '日',
        '一',
        '二',
        '三',
        '四',
        '五',
        '六'
      ],
      day: []
    }
  },


  watch: {
  },

  computed: {
    setItemWidth () {
      return 100 / 7 + '%'
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/attendanceStatistics"
        })
      })
    };
    this.echoAttendanceData();
    this.currentPersonDate = this.personnelStatisticsDetailsMessage.date;
    this.getCleanAttendancePeopleInfo();
    this.activeInnerDayIndex = this.judjeFirstDay(this.personnelStatisticsDetailsMessage.date.getFullYear(),this.personnelStatisticsDetailsMessage.date.getMonth()+1)
  },

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","personnelStatisticsDetailsMessage"]),
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
    ...mapMutations([]),

    onClickLeft() {
      this.$router.push({ path: "/attendanceStatistics"})
    },

    setItemWidth () {
      return 100 / 7 + '%'
    },

    /**
     * @name: 格式化日期
     * @param {date}
     */
    dateFormat (date) {
      let dateArr = date.split('-');
      let month = dateArr[1] >= 10 ? dateArr[1] : '0' + dateArr[1];
      let day = dateArr[2] >= 10 ? dateArr[2] : '0' + dateArr[2];
      return dateArr[0] + '-' + month + '-' + day
    },

    /**
     * @name: 日期信息
     * @param {date}
     */
    getDayInfo (date) {
      let kqzl = this.kqzlData.data;
      let formatDate = this.dateFormat(date);
      let txt = kqzl[kqzl.findIndex(item => item.date === formatDate)];
      return txt
    },

    /**
     * @name: 生成日历表
     * @param {year}
     * @param {month}
     */
    createCalendar (year, month) {
      // 某个月一共有多少天
      let allDay = new Date(year, month, 0).getDate();
      // 某个月1号是星期几
      let firstDay = this.judjeFirstDay(year, month);
      // 需要多少行来展示
      let row = Math.ceil((allDay + firstDay) / 7);
      let k = firstDay;
      let result = [];
      let count = 1;
      // 生成日历二维数组
      for (let i = 0; i < row; i++) {
        result[i] = new Array(7)
        do {
          if (count <= allDay) {
            result[i][k] = {
              date: count,
              // 根据接口匹配日期对应的信息
              text: this.getDayInfo(year + '-' + month + '-' + count),
            }
            k++
            count++
          } else {
            break
          }
        } while (k < 7)
        k = 0
      };
      this.day = result
    },

    /**
     * @name: 判断某年某月1号是星期几
     * @param {year}
     * @param {month}
     */
    judjeFirstDay (year, month) {
      const date = new Date(year, month - 1, 1);
      const week = date.getDay();
      return week
    },

    // 日历上号点击事件
    dayClickEvent (child,innerIndex,index) {
        this.activeDayIndex = index;
        this.activeInnerDayIndex = innerIndex;
        if (child.text) {
            this.currentDayMessage = deepClone(child);
            if (JSON.stringify(this.currentDayMessage['text']['inTime']) == '{}' ) {
                this.currentDayMessage['text']['inTime'] = null
            };
            if (JSON.stringify(this.currentDayMessage['text']['outTime']) == '{}' ) {
                this.currentDayMessage['text']['outTime'] = null
            }
        } else {
            this.currentDayMessage['text'] = {
                afternoon: '-',
                date: '',
                inTime: null,
                morning: '-',
                outTime: null
            };
            this.currentDayMessage['date'] = child.date
        }
        console.log('信息',this.currentDayMessage)
    },

    // 日期后面拼接号
    addDay(date,day) {
        if (day < 10) {
            return date + '-0' + day
        } else {
            return date + '-' + day
        }
    },

    // 格式化时间
    getNowFormatDate(currentDate,type) {
      let currentdate;
      let strDate;
      let seperator1 = "-";
      let month = currentDate.getMonth() + 1;
      if (type == 'day') {
          strDate = currentDate.getDate();
      };
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      if (type == 'day') {
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
      };
      if (type == 'day') {
          currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
      } else {
          currentdate = currentDate.getFullYear() + seperator1 + month
      }
      return currentdate
    },

    // 格式化时间(有汉字)
    getNowFormatDateText(currentDate,type) {
      let currentdate;
      let strDate;
      let seperator1 = "年";
      let seperator2 = "月";
      let month = currentDate.getMonth() + 1;
      if (type == 'day') {
          strDate = currentDate.getDate();
      };
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      };
      if (type == 'day') {
          if (strDate >= 0 && strDate <= 9) {
              strDate = "0" + strDate;
          }
      };
      if (type == 'day') {
          currentdate = currentDate.getFullYear() + seperator1 + month + seperator2 + strDate
      } else {
          currentdate = currentDate.getFullYear() + seperator1 + month + seperator2
      }
      return currentdate
    },

    // 回显各种考勤类型数据和日期
    echoAttendanceData () {
        for (let item of this.attendanceStatusList) {
            if (item.attendanceType == '出勤') {
                item.duration = this.personnelStatisticsDetailsMessage.content.chuQin
            } else if (item.attendanceType == '迟到早退') {
                item.duration = this.personnelStatisticsDetailsMessage.content.zaoTui
            } else if (item.attendanceType == '外派') {
                item.duration = this.personnelStatisticsDetailsMessage.content.waiPai
            }  else if (item.attendanceType == '工伤') {
                item.duration = this.personnelStatisticsDetailsMessage.content.gongShang
            }  else if (item.attendanceType == '病假') {
                item.duration = this.personnelStatisticsDetailsMessage.content.bingJia
            } else if (item.attendanceType == '休假') {
                item.duration = this.personnelStatisticsDetailsMessage.content.xiuJia
            } else if (item.attendanceType == '事假') {
                item.duration = this.personnelStatisticsDetailsMessage.content.shiJia
            } else if (item.attendanceType == '加班') {
                item.duration = this.personnelStatisticsDetailsMessage.content.jiaBan
            } else if (item.attendanceType == '调班') {
                item.duration = this.personnelStatisticsDetailsMessage.content.tiaoBan
            } else if (item.attendanceType == '旷工') {
                item.duration = this.personnelStatisticsDetailsMessage.content.kuangGong
            }
        }
    },

    // 考勤类型转换
    attendanceTypeTransition (text) {
        switch(text) {
          case '未出勤' :
            return 0
            break;
          case '出勤' :
            return 1
            break;
          case '外派' :
            return 2
            break;
          case '工伤' :
            return 3
            break;
          case '病假' :
            return 4
            break;
          case '调班' :
            return 5
            break;
          case '休假' :
            return 6
            break;
          case '加班' :
            return 7
            break;
          case '迟到早退' :
            return 8
            break;
          case '旷工' :
            return 9
            break;
          case '事假' :
            return 10
            break;
      }
    },

    // 获取考勤人员统计数据
    getCleanAttendancePeopleInfo () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.statisticsBoxShow = false;
      cleanAttendancePeopleInfo({proId: this.proId,workerId: this.personnelStatisticsDetailsMessage.content.id, month: this.getNowFormatDate(this.currentPersonDate, 'person')}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
		if (res && res.data.code == 200) {
          this.loadingComplete = true;
          // 根据年月生成日历表
          this.kqzlData = res.data;
          this.createCalendar(this.personnelStatisticsDetailsMessage.date.getFullYear(),this.personnelStatisticsDetailsMessage.date.getMonth()+1);
          this.defaultShowAttendanceMessage()
        } else {
            this.$toast({
                message: `${res.data.msg}`,
                type: 'fail'
            })
        }
        }).
        catch((err) => {
            this.$toast({
                message: `${err}`,
                type: 'fail'
            });
            this.loadingShow = false;
            this.overlayShow = false;
            this.statisticsBoxShow = true
        })
    },

    // 默认显示每月一号的考勤信息
    defaultShowAttendanceMessage () {
        // 当月一号的考勤信息
        let oneDayMessage = deepClone(this.day[0][Object.keys(this.day[0])[0]]);
        if (oneDayMessage.text) {
            this.currentDayMessage = oneDayMessage;
            if (JSON.stringify(this.currentDayMessage['text']['inTime']) == '{}' ) {
                this.currentDayMessage['text']['inTime'] = null
            };
            if (JSON.stringify(this.currentDayMessage['text']['outTime']) == '{}' ) {
                this.currentDayMessage['text']['outTime'] = null
            }
        } else {
            this.currentDayMessage['text'] = {
                afternoon: '-',
                date: '',
                inTime: null,
                morning: '-',
                outTime: null
            };
            this.currentDayMessage['date'] = 1
        }
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
  .nav {
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
        .van-nav-bar__text {
            color: black !important;
            margin-left: 8px !important;
        }
        }
        .van-icon {
        color: black !important;
        font-size: 22px !important;
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
  /deep/ .van-loading {
    z-index: 1000000
  };      
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    .data-sources-box {
        height: 42px;
        line-height: 42px;
        background: #fff;
        padding-left: 10px;
        box-sizing: border-box;
        margin: 10px 0;
        >span {
            font-size: 14px;
            &:nth-child(1) {
                color: #666666;
                margin-right: 8px
            };
            &:nth-child(2) {
                color: #101010;
                font-weight: bold
            }
        }
    };
    .data-content {
        padding: 10px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        .data-content-top {
            width: 92%;
            margin: 0 auto;
            display: flex;
            flex-wrap: wrap;
            .attendance-status-list {
                font-size: 14px;
                width: 33.3%;
                margin-bottom: 4px;
                height: 30px;
                text-align: left;
                line-height: 30px;
                border-radius: 4px;
                box-sizing: border-box;
                &:nth-child(3n) {
                    text-align: right
                };
                >span {
                    &:nth-child(1) {
                        margin-right: 10px
                    }
                }
            };
            .attendanceStyle {
                color: #289E8E
            };
            .clockingStyle {
                color: #E86F50
            };
            .expatriateStyle {
                color: #174E97
            };
            .occupationalInjuryStyle {
                color: #E8CB51
            };
            .sickLeaveStyle {
                color: #101010
            };
            .vocationStyle {
                color: #254550
            };
            .affairsStyle  {
                color: #3B9DF9
            };
            .overtimeStyle  {
                color: #F2A15F
            };
            .changeShiftStyle {
                color: #1864FF
            };
            .absenteeismStyle {
                color: #666666
            }
            
        };
        .data-content-bottom {
            flex: 1;
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            .calendar-container {
                text-align: center;
                .calendar-container-top {
                    height: 70px;
                    background: #F4F5F7;
                    display: flex;
                    border-radius: 6px;
                    flex-direction: column;
                    justify-content: center;
                    h1 {
                        height: 30px;
                        line-height: 30px;
                        font-weight: bold
                    };
                    .calendar-week {
                        .cw-inner {
                            display: flex;
                            overflow: hidden;
                            color: #101010;
                            .cw-item {
                                flex: 1;
                                padding: 8px 0;
                            }
                        }
                    }
                };    
                .calendar-day {
                    .cd-list {
                        display: flex;
                        overflow: hidden;
                        padding: 4px 2px;
                        box-sizing: border-box;
                        .cl-item {
                            flex: 1;
                            height: 20px;
                            box-sizing: border-box;
                            line-height: 20px;
                            margin-right: 10px;
                            &:last-child {
                                margin-right: 0
                            };
                            .ci-inner {
                                width: 100%;
                                height: 100%;
                                display: flex;
                                position: relative;
                                color: #101010;
                                > span {
                                    &:nth-child(1) {
                                        position: absolute;
                                        width: 30px;
                                        height: 20px;
                                        top: 0;
                                        left: 50%;
                                        transform: translateX(-50%)
                                    };
                                    &:nth-child(2) {
                                        display: inline-block;
                                        flex: 1;
                                        border-top-left-radius: 2px;
                                        border-bottom-left-radius: 2px
                                    };
                                    &:nth-child(3) {
                                       display: inline-block;
                                       flex: 1;
                                       border-top-right-radius: 2px;
                                       border-bottom-right-radius: 2px
                                    }
                                };
                                .dayStyle {
                                    color: #fff !important
                                };
                                .attendanceStyle {
                                    background: #289E8E
                                };
                                .clockingStyle {
                                    background: #E86F50
                                };
                                .expatriateStyle {
                                    background: #174E97
                                };
                                .occupationalInjuryStyle {
                                    background: #E8CB51
                                };
                                .sickLeaveStyle {
                                    background: #101010
                                };
                                .vocationStyle {
                                    background: #254550
                                };
                                .affairsStyle  {
                                    background: #3B9DF9
                                };
                                .overtimeStyle  {
                                    background: #F2A15F
                                };
                                .changeShiftStyle {
                                    background: #1864FF
                                };
                                .absenteeismStyle {
                                    background: #666666
                                }
                            };
                            .ciInnerStyle {
                                color: #fff !important
                            }
                        };
                         .clItemStyle {
                            box-shadow: 0px 2px 6px 0 rgba(102, 102, 102, 1);
                        }
                    }
                }
            }
        }
    };
    .attendance-message-box {
        background: #fff;
        padding: 20px 10px;
        box-sizing: border-box;
        margin-top: 10px;
        .date-box {
            font-size: 14px;
            color: #1864FF
        };
        .attendance-condition {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .attendance-condition-left {
                font-size: 14px;
                color: #101010;
                width: 65px
            };
            .attendance-condition-right {
                flex: 1;
                display: flex;
                justify-content: flex-end;
                .forenoon-attendance {
                    padding-right: 16px;
                    box-sizing: border-box;
                    border-right: 1px solid #101010;
                    text-align: center;
                    line-height: 20px;
                    >span {
                        font-size: 14px;
                        &:nth-child(1) {
                            color: #101010;
                            margin-right: 6px;
                        };
                        &:nth-child(2) {
                            color: #101010
                        }
                    };
                    .attendanceStyle {
                        color: #289E8E !important
                    };
                    .clockingStyle {
                        color: #E86F50 !important
                    };
                    .expatriateStyle {
                        color: #174E97 !important
                    };
                    .occupationalInjuryStyle {
                        color: #E8CB51 !important
                    };
                    .sickLeaveStyle {
                        color: #101010 !important
                    };
                    .vocationStyle {
                        color: #254550 !important
                    };
                    .affairsStyle  {
                        color: #3B9DF9 !important
                    };
                    .overtimeStyle  {
                        color: #F2A15F !important
                    };
                    .changeShiftStyle {
                        color: #1864FF !important
                    };
                    .absenteeismStyle {
                        color: #666666 !important
                    }
                };
                .afternoon-attendance {
                    padding-left: 16px;
                    box-sizing: border-box;
                    text-align: center;
                    line-height: 20px;
                    >span {
                        font-size: 14px;
                        &:nth-child(1) {
                            color: #101010;
                            margin-right: 6px;
                        };
                        &:nth-child(2) {
                            color: #101010
                        }
                    };
                    .attendanceStyle {
                        color: #289E8E !important
                    };
                    .clockingStyle {
                        color: #E86F50 !important
                    };
                    .expatriateStyle {
                        color: #174E97 !important
                    };
                    .occupationalInjuryStyle {
                        color: #E8CB51 !important
                    };
                    .sickLeaveStyle {
                        color: #101010 !important
                    };
                    .vocationStyle {
                        color: #254550 !important
                    };
                    .affairsStyle  {
                        color: #3B9DF9 !important
                    };
                    .overtimeStyle  {
                        color: #F2A15F !important
                    };
                    .changeShiftStyle {
                        color: #1864FF !important
                    };
                    .absenteeismStyle {
                        color: #666666 !important
                    }
                }
            };
            position: relative;
            &:before {
                content: '';
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height:1px;
                background-color: #cccaca;
                transform: scaleY(0.5)
            }
        }
    } 
  }
}
</style>