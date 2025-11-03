<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 右侧菜单 -->
    <van-popup v-model="rightMenuShow" position="right" ref="vanPopup" :style="{ width: '60%', height: '100%' }">
        <div class="top-icon">
            <img :src="switchHiddenPng" alt="切换隐藏" @click="switchHiddenEvent">
        </div>
        <div class="center-content">
            <div class="function-list" :class="{'functionListStyle': functionListIndex == index}" v-for="(item, index) in taskList" :key="index" @click="taskRouterSkip(item.tit,index)">
                {{ item.tit }}
            </div>
        </div>
        <div class="signout-box" @click="signOutEvent">
            下班签退
        </div>
    </van-popup>
    <div class="nav">
       <van-nav-bar
        title="任务详情"
        left-text=""
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
        <template #right>
            <img :src="switchShowPng" alt="切换显示" @click="onClickRight">
        </template>
    </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
        <div class="content-box">
            <div class="message-box">
                <div class="message-one">
                    <div class="message-one-left">
                        <span>序号:</span>
                        <span>{{ schedulingTaskDetails.serial }}</span>
                    </div>
                    <div class="message-one-right" :class="{'noLookupStyle':schedulingTaskDetails.state == 1,'noStartStyle':schedulingTaskDetails.state == 2,'underwayStyle':schedulingTaskDetails.state == 3,'noEndStyle':schedulingTaskDetails.state == 4}">
                        {{ taskStatusTransition(schedulingTaskDetails.state) }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>创建时间</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.createTime }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>运送大类</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.parentTypeName }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>起点</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.setOutPlaceName }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>终点</span>
                    </div>
                    <div class="message-two-right" v-if="templateType == 'template_one'">
                        {{schedulingTaskDetails.destinationName ? schedulingTaskDetails.destinationName : ''}}
                    </div>
                    <div class="message-two-right message-two-right-endDepartment" v-if="templateType == 'template_two'">
                        {{ disposeDestinations(schedulingTaskDetails.destinations) }}
                    </div>
                </div>
                <div class="message-one message-two message-six">
                    <div class="message-two-left" :class="{
                        'priorityUrgencyStyle' : schedulingTaskDetails.priority !=1
                     }">
                        <span>优先级</span>
                    </div>
                    <div class="message-two-right" 
                    :class="{
                        'priorityNormalStyle' : schedulingTaskDetails.priority == 1,
                        'priorityUrgencyStyle' : schedulingTaskDetails.priority == 2,
                        'priorityImportanceStyle' : schedulingTaskDetails.priority == 3,
                        'priorityUrgentImportanceStyle' : schedulingTaskDetails.priority == 4,
                     
                     }">
                        {{ taskPriotityTransition(schedulingTaskDetails.priority) }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>运送员</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.workerName }}
                    </div>
                </div>
                <div class="message-one message-two message-bed-number" v-if="templateType == 'template_one'">
                    <div class="message-two-left">
                        <span>床号</span>
                    </div>
                    <div class="message-two-right">
                        <span :class="{'spanStyle': schedulingTaskDetails['quarantine'] == 1}">{{ schedulingTaskDetails.bedNumber }}</span>
                        <img :src="contactIsolationPng" v-if="schedulingTaskDetails['quarantine'] == 1">
                    </div>
                </div>
                <!-- <div class="message-one message-two" v-if="templateType == 'template_one'">
                    <div class="message-two-left">
                        <span>接触隔离</span>
                    </div>
                    <div class="message-two-right">
                        是
                    </div>
                </div> -->
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>响应时间</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.responseTime }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>开始时间</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.startTime }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>已经历时间</span>
                    </div>
                    <div class="message-two-right">
                        {{ elapsedTime(schedulingTaskDetails.planStartTime) }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>运送工具</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.toolName }}
                    </div>
                </div>
                <div class="message-one message-two" v-if="templateType == 'template_one'">
                    <div class="message-two-left">
                        <span>运送类型</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.taskTypeName }}
                    </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left">
                        <span>运送员是否返回</span>
                    </div>
                    <div class="message-two-right">
                        {{ schedulingTaskDetails.isBack == 0 ? '否' : '是' }}
                    </div>
                </div>
                <div class="patient-list" v-if="templateType == 'template_two'">
                   <div class="patient-list-left">
                       <span>运送类型</span>
                   </div>
                   <div class="patient-list-right">
                       <div v-for="(item,index) in schedulingTaskDetails['patientInfoList']" :key="index">
                            <span class="transport-partent">运送类型:</span>
                            <span class="transport-partent">{{`${schedulingTaskDetails['parentTypeName']}${index+1}`}}</span>
                            <!-- <span class="contact-isolation-title">接触隔离:</span>
                            <span class="contact-isolation-content">是;</span> -->
                            <span :class="{'spanStyle': item['quarantine'] == 1}">{{`床号: ${item['bedNumber'] ? item['bedNumber'] : '床号未输入'},`}}</span>
                            <span :class="{'spanStyle': item['quarantine'] == 1}">{{`姓名: ${item['patientName'] ? item['patientName'] : '姓名未输入'},`}}</span>
                            <span :class="{'spanStyle': item['quarantine'] == 1}">{{`性别: ${!item['sex'] ? '性别未指定' : item['sex'] == 1 ? '男' : '女'},`}}</span>
                            <span :class="{'spanStyle': item['quarantine'] == 1}">{{`住院号: ${item['number'] ? item['number'] : '住院号未输入'},`}}</span>
                            <span v-show="item.typeList.length > 0" class="patient-subclass" v-for="(innerItem,innerIndex) in item.typeList" :key="innerIndex">
                                {{ `${innerItem['taskTypeName']}` ? `${innerItem['taskTypeName']}×${innerItem['quantity']};`: ''}}
                            </span>
                            <img :src="contactIsolationPng" v-if="item['quarantine'] == 1">
                        </div>    
                   </div>
                </div>
                <div class="message-one message-two">
                    <div class="message-two-left task-remark-left">
                        <span>描述</span>
                    </div>
                    <div class="message-two-right task-remark">
                        {{ schedulingTaskDetails.taskRemark }}
                    </div>
                </div>
            </div>
            <div class="btn-box">
                <span class="operate-one" @click="allocationEvent" v-if="schedulingTaskDetails.state == 0">分配</span>
                <span class="operate-two" @click="editEvent">编辑</span>
                <span class="operate-three" @click="delayReasonEvent" v-if="schedulingTaskDetails.hasDelay == 0">延迟</span>
                <span class="operate-four" @click="cancelReasonEvent">取消</span>
            </div>
        </div>
    </div> 
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { userSignOut } from '@/api/trans/workerPort.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import { setStore,removeAllLocalStorage } from '@/common/js/utils'
import SelectSearch from "@/components/SelectSearch";
export default {
  name: "SchedulingDispathTaskDetails",
  components: {
    SelectSearch
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      moveInfo: {
        startX: ''
      },
      functionListIndex: 0,
      overlayShow: false,
      rightMenuShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png"),
      switchShowPng: require("@/common/images/home/switch-show.png"),
      switchHiddenPng: require("@/common/images/home/switch-hidden.png"),
      anxiousSignPng: require("@/common/images/home/anxious-sign.png"),
      contactIsolationPng: require("@/common/images/home/contact-isolation.png"),
      taskList: [
        {tit:'调度管理'},
        {tit:'调度任务'},
        {tit:'预约任务'},
        {tit:'循环任务'}
      ]
    }
  },

  mounted() {
      console.log(this.schedulingTaskDetails);
    // 控制设备物理返回按键
    this.deviceReturn('/taskScheduling');
    this.registerSlideEvent()
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","schedulingTaskDetails","operateBtnClickRecord","templateType"]),
    proId () {
        return this.userInfo.extendData.proId
    }
  },

  methods: {
    ...mapMutations(["changeTitleTxt","changeCatchComponent","changeOverDueWay","changeOperateBtnClickRecord"]),

     onClickLeft() {
      this.$router.push({ path: "/taskScheduling"})
    },

    // 计算已经历时间
    elapsedTime (planStartTme) {
      let currentTime = new Date().getTime();
      let transferPlanStartTme = new Date(planStartTme).getTime();
      if (transferPlanStartTme > currentTime) {
        return ''
      } else {
        return `${this.$moment(currentTime).diff(transferPlanStartTme, 'minutes')}分钟`
      }
    },

    // 任务状态转换
    taskStatusTransition (state) {
      switch(state) {
        case 0 :
          return '未分配'
          break;
        case 1 :
          return '未查阅'
          break;
        case 2 :
          return '未开始'
          break;
        case 3 :
          return '进行中'
          break;
        case 4 :
          return '未结束'
          break
      }
    },

    // 优先级装换
    taskPriotityTransition (state) {
      switch(state) {
        case 1 :
          return '正常'
          break;
        case 2 :
          return '紧急'
          break;
        case 3 :
          return '重要'
          break;
        case 4 :
          return '紧急重要'
          break
      }
    },

    // 注册滑动事件  
    registerSlideEvent () {
      this.$refs.wrapper.addEventListener('touchstart',this.touchstartHandle,false);
      this.$refs.wrapper.addEventListener('touchmove',this.touchmoveHandle,false)
    },

    // 滑动开始
    touchstartHandle() {
        //判断是否在滑动区域内滑动
        let e = e || window.event;
        if (e.targetTouches.length == 1) {
            this.moveInfo.startX = parseInt(e.targetTouches[0].clientX)
        }    
    },

    // 滑动中
    touchmoveHandle() {
        let e = e || window.event;
        if (e.targetTouches.length == 1) {
        // 滑动距离
        let moveX = parseInt((e.targetTouches[0].clientX - this.moveInfo.startX));
        //左滑(根据左右滑动来控制右侧菜单的显示与隐藏)
        if (moveX < -50) {
          if(this.rightMenuShow) {return};
          this.rightMenuShow = true
        } else if (moveX > 50) {
          if(!this.rightMenuShow) {return};
          this.rightMenuShow = false
        }
        }        
    },

    // 切换显示右侧菜单事件
    onClickRight () {
      this.rightMenuShow = true
    },

    // 切换隐藏右侧菜单事件
    switchHiddenEvent () {
      this.rightMenuShow = false
    },

    // 右侧菜单任务列表点击事件
    taskRouterSkip (name, index) {
        this.functionListIndex = index;
        if (name === '调度任务') {
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
        } else if (name === '循环任务') {
          this.$router.push({path:'/circulationTask'})
          this.changeTitleTxt({tit:'循环任务'});
          setStore('currentTitle','循环任务')
        } else if (name === '预约任务') {
          this.$router.push({path:'/appointTask'});
          this.changeTitleTxt({tit:'预约任务'});
          setStore('currentTitle','预约任务')
        } else if (name === '调度管理') {
          this.$router.push({path:'/taskScheduling'});
          this.changeTitleTxt({tit:'中央运送任务管理'});
          setStore('currentTitle','中央运送任务管理')
        }
      },

    // 处理调度任务目的地(模板二)
    disposeDestinations (item) {
      if (!item) { return ''};
      if (item.length == 0) { return ''};
      if (Object.prototype.toString.call(item) === '[object Array]') {
        let temporaryArray = [];
        for (let innerItem of item) {
          temporaryArray.push(innerItem.destinationName)
        };
        return temporaryArray.join('、')
      } else {
        return ''
      }
    },

      // 下班签退事件
      signOutEvent () {
          this.$dialog.alert({
            message: '确定签退?',
            closeOnPopstate: true,
            showCancelButton: true
          }).then(() => {
            this.userLoginOut(this.proId, this.userInfo.userName)
          })
          .catch(() => {
          })
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          if (res && res.data.code == 200) {
            removeAllLocalStorage();
            this.changeCatchComponent([]);
            this.$router.push({path:'/'})
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.changeOverDueWay(false);
            setStore('storeOverDueWay',false);
          }
        }).
        catch((err) => {
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },


    // 任务状态转换
    taskStatusTransition (state) {
        switch(state) {
            case 0 :
                return '未分配'
                break;
            case 1 :
                return '未查阅'
                break;
            case 2 :
                return '未开始'
                break;
            case 3 :
                return '进行中'
                break;
            case 4 :
                return '未结束'
                break
        }
    },

    // 分配点击事件
    allocationEvent () {
        let temporaryOperateBtnClickRecord = this.operateBtnClickRecord;
        temporaryOperateBtnClickRecord['allocationBtnClick'] = true;
        this.changeOperateBtnClickRecord(temporaryOperateBtnClickRecord);
        this.$router.push({path:'/taskScheduling'})
    },

    // 编辑点击事件
    editEvent () {
        this.$router.push({path: '/editDispathTask'})
    },

    // 延迟点击事件
    delayReasonEvent () {
        let temporaryOperateBtnClickRecord = this.operateBtnClickRecord;
        temporaryOperateBtnClickRecord['delayBtnClick'] = true;
        this.changeOperateBtnClickRecord(temporaryOperateBtnClickRecord);
        this.$router.push({path:'/taskScheduling'})
    },

    // 取消点击事件
    cancelReasonEvent () {
        let temporaryOperateBtnClickRecord = this.operateBtnClickRecord;
        temporaryOperateBtnClickRecord['cancelBtnClick'] = true;
        this.changeOperateBtnClickRecord(temporaryOperateBtnClickRecord);
        this.$router.push({path:'/taskScheduling'})
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
  /deep/ .van-popup--right {
    padding: 20px 0 80px 0;
    box-sizing: border-box;
    .top-icon {
        padding-left: 10px;
        box-sizing: border-box
    };
    .center-content {
        margin-top: 20px;
        .function-list {
            width: 153px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            margin: 0 auto;
            border: 1px solid #3B9DF9;
            box-sizing: border-box;
            font-size: 16px;
            color: #3B9DF9;
            border-radius: 8px;
            margin-bottom: 20px
        };
        .functionListStyle {
            color: #fff !important;
            border: none !important;
            background: #3B9DF9 !important
        }
    };
    .signout-box {
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: 153px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #E86F50;
        font-size: 16px;
        color: #fff;
        border-radius: 8px
    }
  };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent;
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: #fff !important;
                margin-left: 8px !important;
            }
        };
        .van-nav-bar__right {
            .van-nav-bar__text {
                font-weight: bold !important
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
  /deep/ .van-loading {
    z-index: 1000000
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 0;
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
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 0;
        background: #f7f7f7;
        z-index: 10;
        .message-box {
            flex: 1;
            width: 100%;
            overflow: scroll;
            .message-one {
                width: 100%;
                padding: 4px 6px;
                box-sizing: border-box;
                background: #fff;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 14px;
                margin-top: 6px;
                .message-one-left {
                    color: #289E8E
                };
                .message-one-right {
                    width: 61px;
                    height: 27px;
                    text-align: center;
                    line-height: 27px;
                    color: #fff;
                    background: #E86F50;
                    border-radius: 4px
                };
                .noLookupStyle {
                    background: #E8CB51 !important
                };
                .noStartStyle {
                    background: #174E97 !important
                };
                .underwayStyle {
                    background: #289E8E !important
                };
                .noEndStyle {
                    background: #F2A15F !important
                }
            };
            .message-two {
                align-items: flex-start !important;
                padding: 11px 6px;
                .message-two-left {
                    color: #9E9E9A
                };
                .task-remark-left {
                    width: 70px
                };
                .message-two-right {
                    flex: 1;
                    color: #101010;
                    word-break: break-all;
                    padding-left: 10px;
                    box-align: border-box;
                    text-align: right
                };
                .message-two-right-endDepartment {
                    line-height: 20px
                };
                .task-remark {
                    text-align: left !important
                }
            };
            .message-bed-number {
                align-items: center !important;
                .message-two-right {
                    display: flex;
                    align-items: center;
                    .spanStyle {
                        color: #E8CB51 !important
                    };
                    span {
                        flex: 1;
                        padding-right: 4px;
                        box-sizing: border-box;
                        word-break: break-all;
                        vertical-align: middle
                    };
                    img {
                        width: 24px;
                        height: 24px;
                        margin-left: 4px;
                        vertical-align: middle
                    }
                }
            };
            .message-six {
                align-items: flex-start !important;
                .priorityNormalStyle { 
                    color: #289E8E !important
                };
                .priorityUrgencyStyle { 
                    color: red !important
                    // color: #E8CB51 !important
                };
                .priorityImportanceStyle {
                    color: red !important 
                    // color: #F2A15F !important
                };
                .priorityUrgentImportanceStyle { 
                    color: red !important
                    // color: #E86F50 !important
                }
            };
            .patient-list {
                width: 100%;
                box-sizing: border-box;
                background: #fff;
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;
                font-size: 14px;
                margin-top: 6px;
                align-items: flex-start !important;
                padding: 11px 6px;
                .patient-list-left {
                    color: #9E9E9A;
                    width: 70px
                };
                .patient-list-right {
                    > div {
                        width: 100%;
                        margin-bottom: 4px;
                        .spanStyle {
                            color: #E8CB51 !important;
                            font-weight: bold !important
                        };
                        img {
                            width: 21px;
                            height: 21px;
                            vertical-align: bottom;
                            margin-left: 4px
                        }
                    };
                    color: #9E9E9A;
                    flex: 1;
                    line-height: 18px;
                    padding-left: 10px;
                    box-sizing: border-box;
                    word-break: break-all;
                    .transport-partent {
                        color: #101010 !important
                    }
                }
            }
        };
        .btn-box {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            >span {
                font-weight: bold;
                display: inline-block;
                color: #fff;
                border-radius: 10px;
                font-size: 14px;
                width: 76px;
                height: 29px;
                text-align: center;
                line-height: 29px;
                box-sizing: border-box;
                border-radius: 4px;
                margin-right: 8px;
                color: #fff
            };
            .operate-one {
                background: #F2A15F
            };
            .operate-two {
                background: #174E97
            };
            .operate-three {
                background: #254550
            };
            .operate-four {
                background: #E86F50;
                margin-right: 0
            }                   
        }
    }
  }
}
</style>