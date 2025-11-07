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
            <div class="content-top">
                <div class="date-box">
                    <div class="date-title">日期查询</div>
                    <div class="date-content">
                        <span>{{`${currentStartDate.replaceAll("-","/")}${!currentEndDate ? '' : '-'}${currentEndDate.replaceAll("-","/")}`}}</span>
                        <img :src="calendarPng" alt="" @click="dateQueryRangeShow = true" />
                    </div>
                </div>
            </div>
            <div class="backlog-task-list-box" ref="scrollBacklogTask">
              <div class="backlog-task-list">
                  <div class="backlog-task-top">
                      <div class="backlog-task-top-left">
                          <span>任务编号: s1212</span>
                      </div>
                      <div class="backlog-task-top-right">
                          <span>已完成</span>
                      </div>
                  </div>
                  <div class="backlog-task-content">
                    <div class="backlog-task-content-left">
                        <div class="taskset-name">
                            <span>日期:</span>
                            <span>2023-6-12</span>
                        </div>
                        <div class="status-name">正常!</div>
                    </div>
                    <div class="right-arrow-box" @click="taskDetailsEvent()">
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
      <van-calendar v-model="dateQueryRangeShow" color="#3B9DF9" allow-same-day type="range" @confirm="onDateRangeConfirm" :min-date="minDate" :max-date="maxDate"/>
    </div>

  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
export default {
  name: "HistoryEquipmSpotTaskList",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      overlayShow: false,
      dateQueryRangeShow: false,
      isOnlyMe: true,
      backlogEmptyShow: false,
      isShowBacklogTaskNoMoreData: false,
      currentDateRange: '',
      currentStartDate: this.formatDate(new Date()),
      currentEndDate: '',
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 0, 31),
      timeOne: null,
      isLoadDataTime: null,
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
    this.deviceReturn(`${this.enterHistoryEquipmSpotTaskListPageSource}`);
    this.$nextTick(()=> {
      this.initScrollChange()
    })
  },

  beforeDestroy () {
    if (this.timeOne) {
      clearTimeout(this.timeOne)
    };
    if (this.isLoadDataTime) {
      clearTimeout(this.isLoadDataTime)
    }
  },

  watch: {},

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path == '/historyEquipmentSpotCheckTaskDetails') { return };
      vm.changeEnterHistoryEquipmSpotTaskListPageSource(from.path)
	  });
    next() 
  },

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","patrolTaskListMessage","enterHistoryEquipmSpotTaskListPageSource"]),
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
    ...mapMutations(["changePatrolTaskListMessage","changeEnterHistoryEquipmSpotTaskListPageSource"]),

    // 顶部导航左边点击事件
    onClickLeft () {
      this.$router.push({path: `${this.enterHistoryEquipmSpotTaskListPageSource}`})
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
      this.currentStartDate = this.formatDate(start).replaceAll('/','-');
      this.currentEndDate = this.formatDate(end).replaceAll('/','-')
    },

    // 事件列表注册滚动事件
    initScrollChange () {
      let boxBackScroll = this.$refs['scrollBacklogTask'];
      boxBackScroll.addEventListener('scroll',this.eventListLoadMore,true)
    },

    // 事件列表加载事件
    // eventListLoadMore () {
    //   // 暂存的数据不进行上拉加载
    //   if (this.storageRadio) {return};
    //   let boxBackScroll = this.$refs['scrollBacklogTask'];
    //   if (Math.ceil(boxBackScroll.scrollTop) + boxBackScroll.offsetHeight >= boxBackScroll.scrollHeight) {
    //     // 点击筛选确定后，不加载数据
    //     if (!this.isLoadData) {return};
    //     if (this.eventTime) {return};
    //     this.eventTime = 1;
    //     this.timeTwo = setTimeout(() => {
    //       let totalPage = Math.ceil(this.totalCount/this.pageSize);
    //       if (this.currentPage >= totalPage) {
    //         if (this.isOnlyMe && this.fullBacklogTaskList.length == 0) {
    //           this.isShowBacklogTaskNoMoreData = false
    //         } else {
    //           this.isShowBacklogTaskNoMoreData = true
    //         }
    //       } else {
    //         this.isShowBacklogTaskNoMoreData = false;
    //         this.currentPage = this.currentPage + 1;
    //         if (this.isOnlyMe) {
    //           this.queryEventList(this.currentPage,this.pageSize,this.userName)
    //         } else {
    //           this.queryEventList(this.currentPage,this.pageSize)
    //         }
    //       };
    //       this.eventTime = 0;
    //       console.log('事件列表滚动了',boxBackScroll.scrollTop, boxBackScroll.offsetHeight, boxBackScroll.scrollHeight)
    //     },300)
    //   }
    // },

    // 进入历史巡检任务详情事件
    taskDetailsEvent () {
      this.$router.push({path: '/historyEquipmentSpotCheckTaskDetails'})
    },

    // 获取历史任务列表
    // queryEventList (page,pageSize,name='',startDate='',endDate='',eventType=[],registerType=[]) {
    //   this.loadingShow = true;
    //   this.overlayShow = true;
    //   this.loadText = '加载中';
    //   this.backlogEmptyShow = false;
    //   this.isShowBacklogTaskNoMoreData = false;
    //   getEventList({proId:this.proId, system: 6, 
    //     workerId: this.workerId,page, limit:pageSize, name,
    //     startDate,endDate,eventType:eventType,registerType
    //   })
    //     .then((res) => {
    //         this.loadingShow = false;
    //         this.overlayShow = false;
    //         this.loadText = '';
    //         if (res && res.data.code == 200) {
    //               this.backlogTaskList = res.data.data.list;
    //               this.totalCount = res.data.data.total;
    //               this.fullBacklogTaskList = this.fullBacklogTaskList.concat(this.backlogTaskList);
    //               this.echoFullBacklogTaskList = this.fullBacklogTaskList;
    //               if (this.fullBacklogTaskList.length == 0) {
    //                 this.backlogEmptyShow = true
    //               }
    //         } else {
    //           this.$toast({
    //               type: 'fail',
    //               message: res.data.msg
    //           })
    //         }
    //   })
    //   .catch((err) => {
    //     this.loadingShow = false;
    //     this.overlayShow = false;
    //     this.loadText = '';
    //     this.$toast({
    //       type: 'fail',
    //       message: err
    //     })
    //   })
    // }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  height: 0;
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
                    border: 1px solid #BBBBBB;
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
                  height: 70px;
                  justify-content: space-between;
                  align-items: center;
                  .backlog-task-content-left {
                    .taskset-name {
                        word-break: break-all;
                        margin-bottom: 10px;
                        font-size: 14px;
                        color: #000000  
                    };
                    .status-name {
                        font-size: 14px;
                        color: #289E8E  
                    };
                    .statusNameStyle {
                        color: #E86F50 !important
                    }
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