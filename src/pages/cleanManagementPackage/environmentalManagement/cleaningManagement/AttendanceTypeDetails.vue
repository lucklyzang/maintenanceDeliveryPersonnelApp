<template>
  <div class="page-box">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <van-popup v-model="calendarDayShow" position="bottom">
        <van-datetime-picker
            v-model="currentDayDate"
            @confirm="onConDayFirm"
            @cancel="calendarDayShow = false"
            type="date"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <van-popup v-model="calendarMonthShow" position="bottom">
        <van-datetime-picker
            v-model="currentMonthDate"
            @confirm="onConMonthFirm"
            @cancel="calendarMonthShow = false"
            type="year-month"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <div class="nav">
       <van-nav-bar
        :title="`${ attendanceTypeDetailsMessage.type == 'day' ? attendanceTypeDetailsMessage.content.name : attendanceTypeDetailsMessage.content.attendanceTypeName}详情`"
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
       <div class="date-box" v-if="attendanceTypeDetailsMessage.type == 'day'">
          <div class="date-content">
            <span>{{  getNowFormatDate(currentDayDate,'day') }}</span>
            <img :src="calendarPng" alt="" @click="calendarDayShow = true" />
          </div>
        </div>
        <div class="date-box" v-else>
          <div class="date-content">
            <span>{{ getNowFormatDate(currentMonthDate,'month') }}</span>
            <img :src="calendarPng" alt="" @click="calendarMonthShow = true" />
          </div>
        </div>  
        <div class="attendance-type-details-list-box">
          <van-empty description="暂无数据" v-show="emptyShow" />
          <div class="attendance-type-details-list" v-show="!emptyShow" v-for="(item,index) in attendanceTypeDetailsList" :key="index">
              <div class="attendance-type-details-left">
                <img :src="item.sex == 0 ? attendanceTypeWomanPhotoPng : attendanceTypeManPhotoPng" alt="">
              </div>
              <div class="attendance-type-details-right">
                  <div class="person-name" v-show="attendanceTypeDetailsMessage.type == 'month' && attendanceTypeDetailsMessage.content.attendanceTypeName == '出勤'">
                    {{ `${item.name} (${item.total})` }}
                  </div>
                  <div class="person-name" v-show="attendanceTypeDetailsMessage.type == 'month' && attendanceTypeDetailsMessage.content.attendanceTypeName != '出勤'">
                    {{ item.workerName }}
                  </div>
                  <!-- <div class="person-name" v-show="attendanceTypeDetailsMessage.type == 'day' && attendanceTypeDetailsMessage.content.name != '出勤'">
                    {{ item.workerName }}
                  </div> -->
                  <div class="person-name" v-show="attendanceTypeDetailsMessage.type == 'day'">
                    {{ item.name }}
                  </div>
                  <div class="day-message" v-show="attendanceTypeDetailsMessage.type == 'day' ">
                    <div class="day-message-left">
                      <span>
                        上午
                      </span>
                      <span :class="{'attendanceStyle': attendanceTypeTransition(item.morning) == 1,'expatriateStyle': attendanceTypeTransition(item.morning) == 2,
                          'occupationalInjuryStyle': attendanceTypeTransition(item.morning) == 3,'sickLeaveStyle': attendanceTypeTransition(item.morning) == 4, 'changeShiftStyle': attendanceTypeTransition(item.morning) == 5, 'vocationStyle': attendanceTypeTransition(item.morning) == 6,
                          'overtimeStyle': attendanceTypeTransition(item.morning) == 7,'clockingStyle': attendanceTypeTransition(item.morning) == 8, 'absenteeismStyle': attendanceTypeTransition(item.morning) == 9, 'affairsStyle': attendanceTypeTransition(item.morning) == 10
                        }">
                        {{ item.morning }}
                      </span>
                    </div>
                    <div class="day-message-right">
                      <span>
                        下午
                      </span>
                      <span :class="{'attendanceStyle': attendanceTypeTransition(item.afternoon) == 1,'expatriateStyle': attendanceTypeTransition(item.afternoon) == 2,
                          'occupationalInjuryStyle': attendanceTypeTransition(item.afternoon) == 3,'sickLeaveStyle': attendanceTypeTransition(item.afternoon) == 4, 'changeShiftStyle': attendanceTypeTransition(item.afternoon) == 5, 'vocationStyle': attendanceTypeTransition(item.afternoon) == 6,
                          'overtimeStyle': attendanceTypeTransition(item.afternoon) == 7,'clockingStyle': attendanceTypeTransition(item.afternoon) == 8, 'absenteeismStyle': attendanceTypeTransition(item.afternoon) == 9, 'affairsStyle': attendanceTypeTransition(item.afternoon) == 10
                        }">
                        {{ item.afternoon }}
                      </span>
                    </div>
                  </div>
                  <div class="month-message" v-show="attendanceTypeDetailsMessage.type == 'month' ">
                      <span>
                       {{ attendanceTypeDetailsMessage.type == 'month' && attendanceTypeDetailsMessage.content.attendanceTypeName == '出勤' ? '实际出勤:' : '日期:'}}
                      </span>
                      <span>
                        {{ attendanceTypeDetailsMessage.type == 'month' && attendanceTypeDetailsMessage.content.attendanceTypeName == '出勤' ? `${item.chuQin}天` : `${item.workTime}(${item.label})`}}
                      </span>
                  </div>
              </div>
          </div>
        </div>  
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {cleanAttendanceDayInfo,cleanAttendanceMonthInfo,cleanAttendanceMonthAttendance} from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "AttendanceTypeDetails",
  components: {
    NavBar,
  },
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      statisticsBoxShow: false,
      emptyShow: false,
      currentDayDate: new Date(),
      currentMonthDate: new Date(),
      calendarDayShow: false,
      calendarMonthShow: false,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      calendarPng: require("@/common/images/home/calendar.png"),
      attendanceTypePhotoPng: require("@/common/images/home/attendance-type-photo.png"),
      attendanceTypeWomanPhotoPng: require("@/common/images/home/attendance-type-woman-photo.png"),
      attendanceTypeManPhotoPng: require("@/common/images/home/attendance-type-man-photo.png"),
      attendanceTypeDetailsList: []
    }
  },


  watch: {
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
    this.echoDate();
    if (this.attendanceTypeDetailsMessage.type == 'day') {
      this.getCleanAttendanceDayInfo()
    } else {
      // 月统计详情出勤类型单独一个接口
      if (this.attendanceTypeDetailsMessage.content.attendanceTypeName == '出勤') {
        this.getCleanAttendanceMonthAttendance();
      } else {
        this.getCleanAttendanceMonthInfo()
      }
    };
    console.log('考勤类型信息',this.attendanceTypeDetailsMessage);
  },

  computed: {
    ...mapGetters(["userInfo","attendanceTypeDetailsMessage","chooseHospitalArea"]),
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

    // 回显日期
    echoDate () {
      if (this.attendanceTypeDetailsMessage.type == 'day') {
        this.currentDayDate = this.attendanceTypeDetailsMessage.date;
      } else {
        this.currentMonthDate = this.attendanceTypeDetailsMessage.date
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

    // 考勤类型转换
    attendanceTypeTransitionText (num) {
      switch(num) {
        case 0 :
          return '未出勤'
          break;
        case 1 :
          return '出勤'
          break;
        case 2 :
          return '外派'
          break;
        case 3 :
          return '工伤'
          break;
        case 4 :
          return '病假'
          break;
        case 5 :
          return '调班'
          break;
        case 6 :
          return '休假'
          break;
        case 7 :
          return '加班'
          break;
        case 8 :
          return '迟到早退'
          break;
        case 9 :
          return '旷工'
          break;
        case 10 :
          return '事假'
          break;
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

    onConDayFirm() {
      this.calendarDayShow = false;
      this.getCleanAttendanceDayInfo()
    },

    onConMonthFirm() {
      this.calendarMonthShow = false;
      // 月统计详情出勤类型单独一个接口
      if (this.attendanceTypeDetailsMessage.content.attendanceTypeName == '出勤') {
        this.getCleanAttendanceMonthAttendance();
      } else {
        this.getCleanAttendanceMonthInfo()
      }
    },

    // 获取考勤日统计详情数据
    getCleanAttendanceDayInfo () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.statisticsBoxShow = false;
      this.emptyShow = false;
      cleanAttendanceDayInfo({proId: this.proId,date: this.getNowFormatDate(this.currentDayDate,'day'), type: this.attendanceTypeTransition(this.attendanceTypeDetailsMessage.content.name)}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
        if (res && res.data.code == 200) {
            if (res.data.data.length == 0) {
              this.emptyShow = true
            } else {
              this.attendanceTypeDetailsList = res.data.data
            }
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

    // 获取考勤月统计详情数据
    getCleanAttendanceMonthInfo () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.statisticsBoxShow = false;
      this.emptyShow = false;
      cleanAttendanceMonthInfo({proId: this.proId,month: this.getNowFormatDate(this.currentMonthDate,'month'),type:this.attendanceTypeTransition(this.attendanceTypeDetailsMessage.content.attendanceTypeName)}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
        if (res && res.data.code == 200) {
           if (res.data.data.length == 0) {
              this.emptyShow = true
            } else {
              this.attendanceTypeDetailsList = res.data.data
            }
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

    // 获取考勤月统计出勤详情数据
    getCleanAttendanceMonthAttendance () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.statisticsBoxShow = false;
      this.emptyShow = false;
      cleanAttendanceMonthAttendance({proId: this.proId,month: this.getNowFormatDate(this.currentMonthDate,'month')}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
        if (res && res.data.code == 200) {
          if (res.data.data.length == 0) {
              this.emptyShow = true
            } else {
              this.attendanceTypeDetailsList = res.data.data
            }
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
    height: 0;
    .date-box {
      width: 100%;
      padding: 5px 0;
      box-sizing: border-box;
      background: #fff;
      display: flex;
      align-items: center;
      margin: 10px 0;
      .date-content {
        width: 96%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 30px;
        background: #F4F5F7;
        padding: 0 10px;
        box-sizing: border-box;
        border-radius: 8px;
        > span {
            font-size: 14px;
            color: #101010
        };
        img {
            width: 19px;
            height: 19px
        }
      }
    };
    .attendance-type-details-list-box {
      flex: 1;
      overflow: auto;
      position: relative;
      /deep/ .van-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%)
      };
      .attendance-type-details-list {
          width: 98%;
          margin: 0 auto;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
          padding: 25px 0 25px 20px;
          box-sizing: border-box;
          margin-bottom: 10px;
          display: flex;
          .attendance-type-details-left {
              >img {
                  width: 55px;
                  height: 57px
              }
          };
          .attendance-type-details-right {
              margin-left: 20px;
              flex: 1;
              .person-name {
                font-size: 16px;
                color: #101010;
                margin-bottom: 20px
              };
              .day-message {
                font-size: 14px;
                display: flex;
                .day-message-left {
                  flex: 1;
                  text-align: left;
                  >span {
                    color: #9E9E9A;
                    &:nth-child(1) {
                      margin-right: 6px
                    }
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
                .day-message-right {
                  flex: 1;
                  text-align: left;
                  >span {
                    color: #9E9E9A;
                    &:nth-child(1) {
                      margin-right: 6px
                    }
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
              .month-message {
                line-height: 20px;
                >span {
                  font-size: 14px;
                  color: #9E9E9A;
                  &:nth-child(1) {
                    margin-right: 6px
                  }
                  &:nth-child(2) {
                    color: #101010
                  }
                }
              }
          }
      }
    }  
  }
}
</style>