<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="历史巡检任务详情" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <van-tabs v-model="activeName" color="#1684FC" title-inactive-color="#BEC7D1" title-active-color="#1684FC" @change="vanTabsChangeEvent">
                <van-tab :title="item" :name="item" v-for="(item) in timeList" :key="item">
                    <van-empty description="无巡检任务" v-if="isShowNoMoreData" />
                    <div class="backlog-task-list-box">
                        <div class="backlog-task-list" v-for="(item,index) in timeTaskContentList" :key="index">
                            <div class="backlog-task-top">
                                <div class="backlog-task-top-left">
                                    <span>{{ item.taskSite }}</span>
                                </div>
                            </div>
                            <div class="backlog-task-content">
                               <div class="equipment-name-list" v-for="(innerItem,innerIndex) in item.taskContentList" @click="equipmentChecklistEvent(innerItem)" :key="innerIndex">
                                   <div class="equipment-name">
                                      {{ `${innerItem.deviceName} ${innerItem.norms}` }}
                                   </div>
                               </div>
                            </div>
                        </div>
                    </div>    
                </van-tab>
            </van-tabs>
            <div class="complete-btn-box">
                <div class="complete-btn" @click="backEvent">返回</div>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import { arrDateTimeSort } from "@/common/js/utils";
export default {
  name: "HistoryEquipmentPatrolDetails",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      isShowNoMoreData: false,
      timeList: [],
      timeTaskContentList:[],
      activeName: '',
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/historyEquipmPatroLTaskList');
    this.initData();
    console.log('历史巡检任务信息',this.historyPatrolTaskDetails)
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","historyPatrolTaskDetails"]),
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
    ...mapMutations(["changePatrolTaskListMessage","changePatrolHistoryTaskDeviceChecklist"]),

    onClickLeft () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 返回事件
    backEvent () {
        this.$router.push({path: '/historyEquipmPatroLTaskList'})
    },

    // 初始化数据
    initData () {
        // 获取时间集合
        Object.keys(this.historyPatrolTaskDetails.deviceListByTime).forEach((item) => {
            this.timeList.push(item)
        });
        //当前任务集的时间点集合,做升序处理
        this.timeList = arrDateTimeSort(this.timeList);
        // 显示离任务时间最近的时间点
        this.activeName = this.disposeTime(this.timeList);
        // 拼装当前时间段任务列表数据
        let currentTimeData = this.historyPatrolTaskDetails['deviceListByTime'][this.activeName];
        Object.keys(currentTimeData).forEach((item) => { this.timeTaskContentList.push({
            taskSite: item,
            taskContentList: currentTimeData[item]
        })})
    },

    // 拼接完整时间
    getFullDate(hourTime) {
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

    // 获取当前离任务开始时间最近的时间点
    disposeTime (item) {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        if (item.length > 0) {
          let temporaryArr = [];
          if (item.length == 1) { temporaryArr.push(item[item.length-1]);return temporaryArr.join(',') };
          // 当当前时间大于或等于开始时间集合里最大的时间(时间集合的最后一位)时,就显示开始时间集合里最大的时间
          if (new Date().getTime() >= new Date(this.getFullDate(item[item.length-1])).getTime()) {
            temporaryArr.push(item[item.length-1])
          } else {        
            for (let i=0, len = item.length; i<len; i++) {
              if (i > 0) {
                if (new Date().getTime() < new Date(this.getFullDate(item[i])).getTime()) {
                  temporaryArr.push(item[i-1])
                  break
                }
              }    
            }
          };    
          return temporaryArr.join(',')
        }
      }
    },

    // tab切换值变化事件
    vanTabsChangeEvent (value) {
        // 拼装当前时间段任务列表数据
        this.timeTaskContentList = [];
        let currentTimeData = this.historyPatrolTaskDetails['deviceListByTime'][value];
        Object.keys(currentTimeData).forEach((item) => { this.timeTaskContentList.push({
            taskSite: item,
            taskContentList: currentTimeData[item]
        })})
    },

    // 点击进入设备检查单事件
    equipmentChecklistEvent (item) {
        this.changePatrolHistoryTaskDeviceChecklist(item)
        this.$router.push('/historyEquipmentChecklist')
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
        /deep/ .van-tabs {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 0;
            .van-tabs__wrap {
                border-right: 1px solid #333;
                border-left: 1px solid #333;
                box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                .bottom-border-1px(#BEC7D1);
                .van-tabs__nav {
                    .van-tab {
                        flex: none !important;
                        width: 90px
                    };
                }
            };
            .van-tabs__content {
                flex: 1;
                padding: 12px 4px 0px 4px;
                box-sizing: border-box;
                background: #f7f7f7;
                overflow: scroll;
                .van-tab__pane {
                    height: 100%;
                    position: relative;
                    .van-empty {
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%,-50%)
                    };
                    .backlog-task-list-box {
                        overflow: scroll;
                        height: 100%;
                        .backlog-task-list {
                            padding: 0 0 4px 0;
                            box-sizing: border-box;
                            border-radius: 6px;
                            background: #fff;
                            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.23);
                            margin-bottom: 10px;
                            .backlog-task-top {
                                height: 40px;
                                padding: 0 14px;
                                box-sizing: border-box;
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                font-size: 16px;
                                color: #101010;
                                .bottom-border-1px(#BEC7D1);
                                .backlog-task-top-left {
                                    flex: 1;
                                    .no-wrap()
                                }
                            };
                            .backlog-task-content {
                                position: relative;
                                padding: 10px 14px 8px 14px;
                                box-sizing: border-box;
                                .equipment-name-list {
                                    display: flex;
                                    align-items: center;
                                    height: 30px;
                                    margin-bottom: 10px;
                                    .equipment-name {
                                        height: 30px;
                                        line-height: 30px;
                                        padding: 0 8px;
                                        box-sizing: border-box;
                                        background: #C5E5E0;
                                        border-radius: 6px;
                                        font-size: 12px;
                                        color: #101010;
                                        flex: 1;
                                        margin-right: 6px
                                    };
                                    &:last-child {
                                        margin-bottom: 0
                                    }
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
        };
        .complete-btn-box {
            height: 50px;
            display: flex;
            justify-content: center;
            align-items: center;
            .complete-btn {
                width: 60%;
                height: 45px;
                text-align: center;
                line-height: 45px;
                font-size: 14px;
                color: #fff;
                background: linear-gradient(to right, #6cd2f8, #2390fe);
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                border-radius: 20px
            }
        }
    }
  }
}
</style>