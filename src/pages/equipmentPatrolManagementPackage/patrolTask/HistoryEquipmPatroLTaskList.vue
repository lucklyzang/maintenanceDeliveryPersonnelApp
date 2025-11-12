<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <van-overlay :show="overlayShow" />
    <div class="nav">
      <van-nav-bar title="历史任务" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
      </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
          <img :src="statusBackgroundPng" />a
        </div>
        <div class="content-box">
            <div class="content-top" ref="dateBox">
                <div class="date-box">
                    <div class="date-title">日期查询</div>
                    <div class="date-content"  @click="dateQueryRangeShow = true">
                        <span>{{`${currentStartDate.replaceAll("-","/")}${!currentEndDate ? '' : '-'}${currentEndDate.replaceAll("-","/")}`}}</span>
                        <img :src="calendarPng" alt="" />
                    </div>
                </div>
            </div>
            <div class="backlog-task-list-box" ref="scrollBacklogTask">
              <div class="backlog-task-list" v-for="(item,index) in taskSetList" :key="index">
                  <div class="backlog-task-top">
                      <div class="backlog-task-top-left">
                          <span>{{ item.configName }}</span>
                      </div>
                      <div class="backlog-task-top-right">
                          <span>已完成</span>
                      </div>
                  </div>
                  <div class="backlog-task-content">
                      <div class="taskset-name">
                        <span>日期:</span>
                        <span>{{ item.createDate }}</span>
                      </div>
                      <div class="right-arrow-box" @click="taskDetailsEvent(item)">
                        <van-icon name="arrow" color="#1684FC" size="24" />
                      </div>
                  </div>
              </div>
              <van-empty description="暂无数据" v-show="backlogEmptyShow" />
              <div class="no-more-data" v-show="isShowBacklogTaskNoMoreData">没有更多数据了!</div>
          </div> 
        </div>
    </div>

    <!-- 日期查询范围 -->
    <div class="date-range">
      <van-calendar v-model="dateQueryRangeShow" lazy-render color="#3B9DF9" allow-same-day type="range" @confirm="onDateRangeConfirm" :min-date="minDate" :max-date="maxDate"/>
    </div>

  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import { getPatrolTaskDetailsList } from '@/api/equipmentPatrol/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
export default {
  name: "HistoryEquipmPatroLTaskList",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      dateQueryRangeShow: false,
      timeThree: null,
      backlogEmptyShow: false,
      isShowBacklogTaskNoMoreData: false,
      currentDateRange: '',
      currentStartDate: this.getNowFormatDate(new Date(),'day'),
      currentEndDate: this.getNowFormatDateNext(new Date(),1),
      minDate: new Date(2015, 0, 1),
      maxDate: new Date(2030, 0, 31),
      timeTwo: null,
      isLoadDataTime: null,
      taskSetList: [],
      temporaryTaskSetList: [],
      eventTime: 0,
      totalCount: '',
      currentPage: 1,
      pageSize: 10,
      isLoadData: true,
      fullBacklogTaskList: [],
      echoFullBacklogTaskList: [],
      backlogTaskList: [],
      loadingShow: false,
      loadText: '加载中',
      calendarPng: require("@/common/images/home/calendar.png"),
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      dateIconPng: require("@/common/images/home/date-icon.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn("/home");
    this.$nextTick(()=> {
      this.initScrollChange()
    })
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/equipmentPatrolDetails') {
        // 查询巡检任务详情
        vm.queryPatrolTaskDetailsList(vm.getNowFormatDate(new Date(),'day'),vm.currentEndDate)
      } else {
        if (JSON.stringify(vm.historyPatrolTaskDateMessage) != '{}') {
          vm.queryPatrolTaskDetailsList(vm.historyPatrolTaskDateMessage['startDate'],vm.historyPatrolTaskDateMessage['endDate'])
        } else {
          vm.queryPatrolTaskDetailsList(vm.getNowFormatDate(new Date(),'day'),vm.currentEndDate)
        }
      }
	  });
    next() 
  },

  beforeDestroy () {
    if (this.timeTwo) {
      clearTimeout(this.timeTwo)
    };
    if (this.timeThree) {
      clearTimeout(this.timeThree)
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","patrolTaskListMessage","historyPatrolTaskDateMessage"]),
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
    ...mapMutations(["changePatrolTaskListMessage","changeHistoryPatrolTaskDetails","changeHistoryPatrolTaskDateMessage"]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: '/equipmentPatrolDetails'})
    },

    // 获取当前日期(-)
    getNowFormatDate(currentDate,type) {
        let currentdate;
        let strDate;
        let seperator1 = "-";
        let month = currentDate.getMonth() + 1;
        strDate = currentDate.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        };
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        };
        if ( type == 'month') {
            currentdate = currentDate.getFullYear() + seperator1 + month
        } else {
            currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
        };
        return currentdate
    },

    // 获取当前日期的下一天(-)
    getNowFormatDateNext(date, i) {
      if (date === undefined || date === null) {
        date = new Date()
      };
      let month, day;
      date.setTime(date.getTime() + i * 24 * 60 * 60 * 1000);
      month = date.getMonth() + 1 < 10 ? '0' + parseInt(date.getMonth() + 1) : date.getMonth() + 1;
      day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(); 
      let time = date.getFullYear() + "-" + month + "-" + day;
      return time
    },

    // 获取当前日期(/)
    getNowFormatDateOther(currentDate) {
        let currentdate;
        let strDate;
        let seperator1 = "/";
        let month = currentDate.getMonth() + 1;
        strDate = currentDate.getDate();
        currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate;
        return currentdate
    },

    //截取日期(去除日期的时分秒)
    substringDate (date) {
      let temp = new Date(date);
      let needDtae = temp.getFullYear()+"-"+(temp.getMonth()+1)+"-"+temp.getDate();
      return needDtae
    },

    formatDate(date) {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    },

    // 日期类型范围选择确定
    onDateRangeConfirm(date) {
      const [start, end] = date;
      this.dateQueryRangeShow = false;
      this.currentDateRange = `${this.formatDate(start)} - ${this.formatDate(end)}`;
      this.currentStartDate = this.getNowFormatDate(new Date(this.formatDate(start).replaceAll('/','-')),'day');
      this.currentEndDate = this.getNowFormatDate(new Date(this.formatDate(end).replaceAll('/','-')),'day');
      this.queryPatrolTaskDetailsList(this.currentStartDate,this.currentEndDate)
    },

    // 任务集列表注册滚动事件
    initScrollChange () {
      let boxBackScroll = this.$refs['scrollBacklogTask'];
      boxBackScroll.addEventListener('scroll',this.taskSetListLoadMore,true)
    },

    // 任务集列表加载事件
    taskSetListLoadMore () {
      if (!this.isLoadMore) { return };
      let boxBackScroll = this.$refs['scrollBacklogTask'];
      if (Math.ceil(boxBackScroll.scrollTop) + boxBackScroll.offsetHeight + this.$refs['dateBox'].offsetHeight >= boxBackScroll.scrollHeight) {
        if (this.eventTime) {return};
        this.eventTime = 1;
        this.timeTwo = setTimeout(() => {
          let totalPage = Math.ceil(this.totalCount/this.pageSize);
          if (this.currentPage >= totalPage) {
            if (this.taskSetList.length == 0) {
              this.isShowBacklogTaskNoMoreData = false
            } else {
              this.isShowBacklogTaskNoMoreData = true
            }
          } else {
            this.isShowBacklogTaskNoMoreData = false;
            this.currentPage = this.currentPage + 1;
            this.loadingShow = true;
            this.overlayShow = true;
            this.loadText = '加载中...';
            // 模拟ajax请求
            this.timeThree = setTimeout(() =>{
              this.loadingShow = false;
              this.overlayShow = false;
              let currentPageList = this.temporaryBeaconList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize);
              // 合并已经加载的数据
              this.taskSetList = this.taskSetList.concat(currentPageList)
            },1000)
          };
          this.eventTime = 0
        },300)
      }
    },

    // 进入历史巡检任务详情事件
    taskDetailsEvent (item) {
      this.changeHistoryPatrolTaskDetails(item);
      let temporaryHistoryPatrolTaskDateMessage = this.historyPatrolTaskDateMessage;
      temporaryHistoryPatrolTaskDateMessage['startDate'] = this.currentStartDate;
      temporaryHistoryPatrolTaskDateMessage['endDate'] = this.currentEndDate;
      this.changeHistoryPatrolTaskDateMessage(temporaryHistoryPatrolTaskDateMessage);
      this.$router.push({path: '/historyEquipmentPatrolDetails'})
    },

   // 获取巡检任务详情
    queryPatrolTaskDetailsList (startDate,endDate) {
      this.loadingShow = true;
      this.overlayShow = true;
      this.backlogEmptyShow = false;
      this.taskSetList = [];
      getPatrolTaskDetailsList({proId : this.proId, workerId: this.workerId,state:4,system:9,startDate,endDate})
          .then((res) => {
              this.loadingShow = false;
              this.overlayShow = false;
              if (res && res.data.code == 200) {
                  if (res.data.data.length > 0) {
                    this.temporaryTaskSetList = res.data.data;
                    this.totalCount = res.data.data.length;
                    this.taskSetList = this.temporaryTaskSetList.slice((this.currentPage - 1) * this.pageSize,(this.currentPage - 1) * this.pageSize + this.pageSize);
                    this.$forceUpdate()
                  } else {
                    this.backlogEmptyShow = true
                  }
              } else {
                  this.$toast({
                      type: 'fail',
                      message: res.data.msg
                  })
              }
        })
        .catch((err) => {
          this.loadingShow = false;
          this.overlayShow = false;
          this.$toast({
            type: 'fail',
            message: err
          })
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
  position: relative;
  .content-wrapper();
  /deep/ .van-overlay {
    z-index: 1000 !important
  };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        };
        .van-nav-bar__right {
          .van-nav-bar__text {
            color: #fff
          }
        };
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
  .date-range {
   /deep/ .van-calendar {
     .van-calendar__body {
       .van-calendar__month {
         .van-calendar__day {
           .van-calendar__bottom-info {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
           }
         }
       }
     }
   }
  };
  /deep/ .van-loading {
    z-index: 1000000
  };
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      > img {
        width: 100%;
        height: 100%
      }
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        background: #F7F7F7;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding-bottom: 50px;
        .content-top {
            width: 100%;
            padding: 0 10px 0 10px;
            box-sizing: border-box;
            .date-box {
                height: 44px;
                display: flex;
                align-items: center;
                .date-title {
                    font-size: 14px;
                    color: #333333;
                    margin-right: 10px
                };
                .date-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    height: 30px;
                    border: 1px solid #bbbbbb;
                    background:#fff;
                    padding: 0 10px;
                    box-sizing: border-box;
                    border-radius: 4px;
                    > span {
                        font-size: 14px;
                        color: #101010;
                        margin-right: 10px
                    };
                    img {
                        width: 19px;
                        height: 19px
                    }
                }
            }
        };
        .backlog-task-list-box {
          overflow: scroll;
          flex: 1;
          height: 100%;
          padding: 0 10px 0 10px;
          box-sizing: border-box;
          position: relative;
          /deep/ .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%)
          };
          .backlog-task-list {
              padding: 0 8px 0 8px;
              box-sizing: border-box;
              border-radius: 6px;
              position: relative;
              background: #fff;
              box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
              margin-bottom: 10px;
              .backlog-task-top {
                  height: 40px;
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 14px;
                  color: #1684FC;
                  .bottom-border-1px(rgba(0, 0, 0, 0.23));
                  .backlog-task-top-left {
                      flex: 1;
                      .no-wrap()
                  };
                  .backlog-task-top-right {
                      width: 70px;
                      text-align: center;
                      span {
                          display: inline-block;
                          width: 62px;
                          font-size: 12px;
                          border-radius: 6px;
                          height: 22px;
                          text-align: center;
                          line-height: 22px;
                          color: #fff;
                          background: #101010;
                          border-radius: 6px;
                      };
                      .spanNoStartStyle {
                          color: #174E97;
                      };
                      .spanCompletedStyle {
                          color: #101010;
                      }
                  }
              };
              .backlog-task-content {
                  display: flex;
                  justify-content: space-between;
                  .taskset-name {
                    line-height: 40px;
                    word-break: break-all;
                    height: 40px;
                    font-size: 14px;
                    color: #000000  
                  };
                  .right-arrow-box {
                    height: 40px;
                    display: flex;
                    align-items: center
                  }
              }
          };
          .no-more-data {
              font-size: 12px;
              color: #BEC7D1;
              width: 100%;
              text-align: center;
              line-height: 30px
          }
      }
    }    
  }
}
</style>