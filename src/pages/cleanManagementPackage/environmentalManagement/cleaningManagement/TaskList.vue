<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" z-index="100000" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
      <NavBar path="/cleanHome" title="任务列表" />
    </div>
    <van-popup v-model="calendarShow" position="bottom">
        <van-datetime-picker
            v-model="currentDayDate"
            @confirm="onConfirm"
            @cancel="calendarShow = false"
            type="date"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <div class="content">
      <div class="content-top-area">
			  <img :src="statusBackgroundPng" />
        <div class="content-top-content">
          <div class="content-top-content-title">
            <div class="content-top-content-title-left">
              <img :src="clockPng" alt="">
              <span>未完成任务</span>
            </div>
            <div class="content-top-content-title-right">
              <img :src="arrowRightPng" alt="">
            </div>
          </div>
        </div>
      </div>
      <div class="content-bottom-area">
        <div class="date-box" @click="calendarShow = true">
          <span>{{ getNowFormatDate(currentDayDate,'day') }}</span>
          <img :src="calendarPng" alt="">
        </div>
        <van-empty v-show="emptyShow" description="暂无数据" />
        <div class="task-infobox" v-show="!loadingShow && !emptyShow">
          <div class="forthwith-cleaning-task" v-if="forthwithTaskShow">
            <div class="forthwith-cleaning-task-title">
              <div class="forthwith-cleaning-task-title-left">
                即时保洁任务
              </div>
              <div class="forthwith-cleaning-task-title-right" @click="taskDetailsEvent(1)">
                <span>详情</span>
                <van-icon name="arrow" color="#1864FF" size="24" />
              </div>
            </div>
            <div class="forthwith-cleaning-task-content">
              <div class="forthwith-cleaning-task-content-left">
                <div class="total">
                  <span>总&nbsp;&nbsp;&nbsp;数: </span>
                  <span>{{ forthwithCleaningTaskGlobalStatistics.total }}</span>
                </div>
                <div class="execution">
                  <span>执行中: </span>
                  <span>{{ forthwithCleaningTaskGlobalStatistics.progress }}</span>
                </div>
                <div class="no-comolete">
                  <span>未完成: </span>
                  <span>{{ forthwithCleaningTaskGlobalStatistics.noFinish }}</span>
                </div>
              </div>
              <div class="forthwith-cleaning-task-content-right">
                <van-circle v-model="forthwithCurrentRate" :rate="forthwithCleaningTaskGlobalStatistics.percent" :speed="100" :text="forthwithCleaningTaskGlobalStatistics.finish != 0 ? '' : `${Math.ceil(forthwithCleaningTaskGlobalStatistics.percent)}%`" 
                  layer-color="#d0d0cc"
                  :color="forthwithCleaningTaskGlobalStatistics.percent == 0 ? '#d0d0cc' : '#1864FF'"
                  :size="45" 
                  :stroke-width="140" 
                />
                <div class="complete-info">
                  <span>{{ forthwithCleaningTaskGlobalStatistics.finish == 0 ? '已完成:' : '完成率:'}}</span>
                  <span>{{ forthwithCleaningTaskGlobalStatistics.finish == 0 ? forthwithCleaningTaskGlobalStatistics.finish : `${Math.ceil(forthwithCleaningTaskGlobalStatistics.percent)}%`}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="forthwith-cleaning-task special-cleaning-task"  v-if="specialTaskShow">
            <div class="forthwith-cleaning-task-title">
              <div class="forthwith-cleaning-task-title-left">
                专项保洁任务
              </div>
              <div class="forthwith-cleaning-task-title-right" @click="taskDetailsEvent(2)">
                <span>详情</span>
                <van-icon name="arrow" color="#1864FF" size="24" />
              </div>
            </div>
            <div class="forthwith-cleaning-task-content">
              <div class="forthwith-cleaning-task-content-left">
                <div class="total">
                  <span>总&nbsp;&nbsp;&nbsp;数: </span>
                  <span>{{ specialCleaningTaskGlobalStatistics.total }}</span>
                </div>
                <div class="execution">
                  <span>执行中: </span>
                  <span>{{ specialCleaningTaskGlobalStatistics.progress }}</span>
                </div>
                <div class="no-comolete">
                  <span>未完成: </span>
                  <span>{{ specialCleaningTaskGlobalStatistics.noFinish }}</span>
                </div>
              </div>
              <div class="forthwith-cleaning-task-content-right">
                <van-circle v-model="specialCurrentRate" :rate="specialCleaningTaskGlobalStatistics.percent" :speed="100" :text="specialCleaningTaskGlobalStatistics.finish != 0 ? '' : `${Math.ceil(specialCleaningTaskGlobalStatistics.percent)}%`" 
                  layer-color="#d0d0cc"
                  :color="specialCleaningTaskGlobalStatistics.percent == 0 ? '#d0d0cc' : '#1864FF'"
                  :size="45"
                  :stroke-width="140"
                 />
                <div class="complete-info">
                  <span>{{ specialCleaningTaskGlobalStatistics.finish == 0 ? '已完成:' : '完成率'}}</span>
                  <span>{{ specialCleaningTaskGlobalStatistics.finish == 0 ? specialCleaningTaskGlobalStatistics.finish : `${Math.ceil(specialCleaningTaskGlobalStatistics.percent)}%`}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="forthwith-cleaning-task polling-task" v-if="pollingTaskShow">
            <div class="forthwith-cleaning-task-title">
              <div class="forthwith-cleaning-task-title-left">
                巡检任务
              </div>
              <div class="forthwith-cleaning-task-title-right" @click="taskDetailsEvent(3)">
                <span>详情</span>
                <van-icon name="arrow" color="#1864FF" size="24" />
              </div>
            </div>
            <div class="forthwith-cleaning-task-content">
              <div class="forthwith-cleaning-task-content-left">
                <div class="total">
                  <span>总&nbsp;&nbsp;&nbsp;数: </span>
                  <span>{{ pollingTaskGlobalStatistics.all }}</span>
                </div>
                <div class="execution">
                  <span>执行中: </span>
                  <span>{{ pollingTaskGlobalStatistics.proceed }}</span>
                </div>
                <div class="no-comolete">
                  <span>未完成: </span>
                  <span>{{ pollingTaskGlobalStatistics.all - pollingTaskGlobalStatistics.finish }}</span>
                </div>
              </div>
              <div class="forthwith-cleaning-task-content-right">
                <van-circle v-model="pollingCurrentRate" :rate="`${Math.ceil((pollingTaskGlobalStatistics.finish/pollingTaskGlobalStatistics.all)*100)}`" :text="pollingTaskGlobalStatistics.finish != 0 ? '' : `${Math.ceil((pollingTaskGlobalStatistics.finish/pollingTaskGlobalStatistics.all)*100)}%`" :speed="100" 
                layer-color="#d0d0cc" 
                :color="pollingTaskGlobalStatistics.finish == 0 ? '#d0d0cc' : '#1864FF'"
                :size="45" 
                :stroke-width="140" 
                />
                <div class="complete-info">
                  <span>{{ pollingTaskGlobalStatistics.finish == 0 ? '已完成:' : '完成率'}}</span>
                  <span>{{ pollingTaskGlobalStatistics.finish == 0 ? pollingTaskGlobalStatistics.finish : `${Math.ceil((pollingTaskGlobalStatistics.finish/pollingTaskGlobalStatistics.all)*100)}%`}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
		  </div>
    </div>
    <div class="add-task-png-box" @click="addTaskEvent">
      <img :src="addTaskPng" alt="">
    </div>
    <!-- <FooterBottom></FooterBottom>   -->
  </div>
</template>
<script>
import FooterBottom from "@/components/FooterBottom";
import NavBar from "@/components/NavBar";
import { queryCleaningManageTaskGlobalStatistics, queryPollingTaskGlobalStatistics } from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "CleaningTaskList",
  components: {
    FooterBottom,
    NavBar,
  },
  data() {
    return {
      forthwithCurrentRate: 0,
      specialCurrentRate: 0,
      pollingCurrentRate: 0,
      forthwithTaskShow: false,
      specialTaskShow: false,
      pollingTaskShow: false,
      currentDayDate: new Date(),
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      emptyShow: false,
      loadingShow: false,
      overlayShow: false,
      calendarShow: false,
      forthwithCleaningTaskGlobalStatistics: {},
      specialCleaningTaskGlobalStatistics: {},
      pollingTaskGlobalStatistics: {},
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      clockPng: require("@/common/images/home/clock.png"),
      addTaskPng: require("@/common/images/home/add-task.png"),
      calendarPng: require("@/common/images/home/calendar.png"),
      arrowRightPng: require("@/common/images/home/arrow-right.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleanHome"
        })
      })
    };
    this.parallelGetAllTaskGlobalStatistics()
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/cleanHome' || from.path == '/addTask') {
        vm.currentDayDate = new Date()
      } else {
        vm.currentDayDate = vm.currentCleanTaskName.originalDate
      }
	  });
    next() 
  },
  

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","currentCleanTaskName"]),
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
    ...mapMutations(["changeIsLogin","storeCurrentCleanTaskName","storeCurrentCleanTaskDateVlue"]),

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

    onConfirm(date) {
      this.calendarShow = false;
      this.parallelGetAllTaskGlobalStatistics()
    },

    // 点击任务详情事件
    taskDetailsEvent (num) {
      let temporaryMessage = this.currentCleanTaskName;
      temporaryMessage['num'] = num;
      temporaryMessage['date'] = this.getNowFormatDate(this.currentDayDate,'day');
      temporaryMessage['originalDate'] = this.currentDayDate;
      temporaryMessage['forthwithTaskShow'] = this.forthwithTaskShow;
      temporaryMessage['specialTaskShow'] = this.specialTaskShow;
      temporaryMessage['pollingTaskShow'] = this.pollingTaskShow;
      this.storeCurrentCleanTaskName(temporaryMessage);
      this.storeCurrentCleanTaskDateVlue(this.dateValue);
      this.$router.push({path: '/cleaningTask'})
    },

    // 并行查询保洁任务、专项保洁任务、巡检任务统计详情
    parallelGetAllTaskGlobalStatistics () {
        this.loadingShow = true;
        this.overlayShow = true;
        this.emptyShow = false;
        Promise.all([this.getCleaningManageTaskGlobalStatistics(),this.getPollingTaskGlobalStatistics()])
        .then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
          if (res.length == 2) {
            let [item1,item2] = res;
            if (item1) {
              if (JSON.stringify(item1) == '{}' && JSON.stringify(item2) == '{}') {
                this.emptyShow = true
              } else {
                if (JSON.stringify(item1) != '{}') {
                  if (item1['0']) {
                    this.forthwithTaskShow = true;
                    this.forthwithCleaningTaskGlobalStatistics = item1['0'];
                  } else {
                    this.forthwithTaskShow = false
                  };
                  if (item1['1']) {
                    this.specialCleaningTaskGlobalStatistics = item1['1'];
                    this.specialTaskShow = true
                  } else {
                    this.specialTaskShow = false
                  }
                }  
              }
            };
            if (item2) {
              if (JSON.stringify(item1) == '{}' && JSON.stringify(item2) == '{}') {
                this.emptyShow = true
              } else {
                if (JSON.stringify(item2) != '{}') {
                  if (item2) {
                    this.pollingTaskGlobalStatistics = item2;
                    this.pollingTaskShow = true
                  } else {
                    this.pollingTaskShow = false
                  }
                }  
              }
            }  
          }
        })
        .catch((err) => {
          this.loadingShow = false;
          this.overlayShow = false;
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

    // 查询保洁任务和专项保洁任务统计详情
    getCleaningManageTaskGlobalStatistics () {
      return new Promise((resolve,reject) => {
        queryCleaningManageTaskGlobalStatistics({
          proId : this.proId, // 所属项目id
          queryDate: this.getNowFormatDate(this.currentDayDate,'day'), // 查询时间
          managerId: this.workerId // 保洁主管id
        })
        .then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          } else {
            this.$toast({
              message: `${res.data.msg}`,
              type: 'fail'
            })
          }
        })
        .catch((err) => {
          this.loadingShow = false;
          this.overlayShow = false;
          reject(err)
        })
      })  
    },

    // 查询巡检任务统计详情
    getPollingTaskGlobalStatistics () {
      return new Promise((resolve,reject) => {
        queryPollingTaskGlobalStatistics({
          proId : this.proId, // 所属项目id
          queryDate: this.getNowFormatDate(this.currentDayDate,'day'), // 查询时间
          workerId: this.workerId // 保洁主管id
        }).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            resolve(res.data.data)
          } else {
            this.$toast({
							message: `${res.data.msg}`,
							type: 'fail'
						})
          }
        })
        .catch((err) => {
          this.loadingShow = false;
          this.overlayShow = false;
          reject(err)
        })
      })
    },


    // 新增任务事件
    addTaskEvent () {
      this.$router.push({path: '/addTask'})
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
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
        .van-nav-bar__text {
            color: #fff !important;
            margin-left: 8px !important;
        }
        }
        .van-icon {
        color: #fff !important;
        font-size: 22px !important;
        }
        .van-nav-bar__title {
        color: #fff !important;
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
  .add-task-png-box {
    position: fixed;
    width: 70px;
    height: 70px;
    bottom: 60px;
    right: 10px;
    z-index: 1000;
    >img {
        width:100%;
        height: 100%
    }
  }  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    .content-top-area {
      position: relative;
      width: 100%;
      margin: 0 auto;
      height: 240px;
      > img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .content-top-content {
        margin: 0 auto;
        width: 94%;
        height: 52px;
        margin-top: 60px;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        .content-top-content-title {
          padding: 0 20px;
          box-sizing: border-box;
          background: #fff;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          z-index: 1000;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .content-top-content-title-left {
            >img {
              width: 24px;
              height: 24px;
              vertical-align: middle
            };
            >span {
              font-size: 18px;
              color: #417AEC;
              margin-left: 10px;
              vertical-align: middle
            }
          };
          .content-top-content-title-right {
            >img {
              width: 24px;
              height: 24px;
            }
          }
        }
      }
    }
    .content-bottom-area {
      flex: 1;
      overflow: auto;
      margin: 0 auto;
      background: #F8F8F8;
      margin-top: -100px;
      box-sizing: border-box;
      z-index: 1000;
      font-size: 14px;
      display: flex;
      position: relative;
      flex-direction: column;
      width: 100%;
      /deep/ .van-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%)
      };
      .date-box {
        width: 90%;
        margin: 0 auto;
        height: 40px;
        display: flex;
        align-items: center;
        >span {
          font-size: 14px;
          color: #1864FF;
          vertical-align: middle
        };
        >img {
          margin-left: 10px;
          width: 18px;
          height: 18px;
          vertical-align: middle
        }
      };
      .task-infobox {
        width: 96%;
        margin: 0 auto;
        flex: 1;
        overflow: auto;
        .forthwith-cleaning-task {
          width: 100%;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
          padding: 0 0 8px 0;
          box-sizing: border-box;
          margin-bottom: 14px;
          .forthwith-cleaning-task-title {
            .bottom-border-1px(rgba(0, 0, 0, 0.23));
            width: 96%;
            box-sizing: border-box;
            margin: 0 auto;
            height: 44px;
            align-items: center;
            display: flex;
            padding: 0 6px;
            justify-content: space-between;
            .forthwith-cleaning-task-title-left {
              font-size: 16px;
              color: #289E8E;
              font-weight: bold
            };
            .forthwith-cleaning-task-title-right {
              margin-right: -10px;
              >span {
                vertical-align: middle;
                font-size: 16px;
                color: #1864FF;
                font-weight: bold;
              };
              /deep/ .van-icon {
                vertical-align: middle
              }
            }
          };
          .forthwith-cleaning-task-content {
            width: 100%;
            padding-left: 14px;
            box-sizing: border-box;
            margin: 0 auto;
            height: 113px;
            align-items: center;
            display: flex;
            justify-content: space-between;
            .forthwith-cleaning-task-content-left {
              width: 50%;
              height: 90px;
              border-right: 1px solid #dadada;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              padding: 10px 0;
              box-sizing: border-box;
              >div {
                span {
                  font-size: 14px;
                  &:first-child {
                    color: #9E9E9A
                  };
                  &:last-child {
                    color: #333;
                    font-weight: bold;
                  }
                }
              }
            };
            .forthwith-cleaning-task-content-right {
              width: 50%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              padding: 10px 0;
              box-sizing: border-box;
              .complete-info {
                margin-top: 10px;
                span {
                  font-size: 12px;
                  &:first-child {
                    color: #9E9E9A
                  };
                  &:last-child {
                    color: #1864FF;
                    font-weight: bold
                  }
                }
              };
              /deep/ .van-circle {
                .van-circle__text {
                  color: #1864FF;
                  font-size: 12px
                }
              }
            }
          };
        };
        .special-cleaning-task {
          .forthwith-cleaning-task-title-left {
            color: #174E97 !important
          }
        };
        .polling-task {
          .forthwith-cleaning-task-title-left {
            color: #E86F50 !important
          }
        }
      }
    }
  }
}
</style>