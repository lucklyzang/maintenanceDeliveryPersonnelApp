<template>
  <div class="page-box" ref="wrapper">
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
    <van-popup v-model="calendarPersonShow" position="bottom">
        <van-datetime-picker
            v-model="currentPersonDate"
            @confirm="onConPersonFirm"
            @cancel="calendarPersonShow = false"
            type="year-month"
            title="选择日期"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <div class="nav">
       <van-nav-bar
        title="考勤统计"
        left-text="返回"
        right-text="考勤录入"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
        @click-right="onClickRight"
    />
    </div>
    <div class="content">
        <div class="content-top">
            <div class="statistical-type-list-box">
                <div class="statistical-type-list" :class="{'statisticalTypeListStyle': statisticalTypeIndex == index}" v-for="(item,index) in statisticalTypeList" :key="index" @click="statisticalTypeEvent(item,index)">
                    {{ item }}
                </div>
            </div>    
        </div>
        <div class="day-statistics-box" v-if="statisticalTypeIndex == 0 && statisticsBoxShow">
            <div class="date-box">
               <div class="date-content">
                    <span>{{ getNowFormatDate(currentDayDate,'day') }}</span>
                    <img :src="calendarPng" alt="" @click="calendarDayShow = true" />
               </div>
           </div> 
            <div class="content-center">
                <van-circle v-model="currentRate" :rate="currentRate" :speed="100" :color="currentRate > 0 ? '#1989fa' : '#d0d0cc'" layer-color="#d0d0cc" :size="130" :stroke-width="50">
                <template #default>
                        <div>
                            {{`${actualArrival}/${total}`}}
                        </div>
                        <div>实到/应到</div>
                </template>
                </van-circle>
                <div class="circle-explain">
                    实到=出勤人数+迟到早退人数
                </div>
                <div class="attendance-status-list-box">
                    <div class="attendance-status-list" v-for="(item,index) in attendanceStatusList"  @click="attendanceStatusEvent(item,index,'day')"
                        :key="index"
                        :class="{'attendanceStyle': index == 0,'clockingStyle': index == 1,
                            'expatriateStyle': index == 2,'occupationalInjuryStyle': index == 3, 'sickLeaveStyle': index == 4, 'vocationStyle': index == 5,
                            'affairsStyle': index == 6,'overtimeStyle': index == 7, 'changeShiftStyle': index == 8, 'absenteeismStyle': index == 9,
                            'attendanceActiveStyle': index == 0 && attendanceStatusIndex == index,'clockingActiveStyle': index == 1 && attendanceStatusIndex == index,
                            'expatriateActiveStyle': index == 2 && attendanceStatusIndex == index,'occupationalInjuryActiveStyle': index == 3 && attendanceStatusIndex == index, 'sickLeaveActiveStyle': index == 4 && attendanceStatusIndex == index, 'vocationActiveStyle': index == 5 && attendanceStatusIndex == index,
                            'affairsActiveStyle': index == 6 && attendanceStatusIndex == index,'overtimeActiveStyle': index == 7 && attendanceStatusIndex == index, 'changeShiftActiveStyle': index == 8 && attendanceStatusIndex == index, 'absenteeismActiveStyle': index == 9 && attendanceStatusIndex == index
                        }"
                    >
                        {{`${item.name} ${item.num}`}}
                    </div> 
                </div>
            </div>
            <div class="cotent-bottom">
                <van-tabs v-model="activeObjectName" color="#174E97" @change="vanTabsChangeEvent">
                    <van-tab title="出勤" name="attendance">
                        <van-empty description="暂无数据" v-show="attendanceEmptyShow" />
                        <div class="attendance-situation-list" v-for="(item,index) in attendanceSituationList" :key="index">
                            <div class="attendance-situation-left">
                                {{ item.workerName}}
                            </div>
                            <div class="attendance-situation-right">
                                <span>出勤:</span>
                                <span>{{ `${item.morning == 1 ? '上午' : ''}${item.morning == 1 && item.afternoon == 1 ? '、' : ''}${item.afternoon == 1 ? '下午' : ''}` }}</span>
                            </div>
                        </div>
                    </van-tab>
                    <van-tab title="外派" name="expatriate">
                        <van-empty description="暂无数据" v-show="expatriateEmptyShow" />
                        <div class="attendance-situation-list" v-for="(item,index) in expatriateList" :key="index">
                            <div class="attendance-situation-left">
                                {{ item.workerName}}
                            </div>
                            <div class="attendance-situation-right">
                                <span>外派:</span>
                                <span>{{ `${item.morning == 2 ? '上午' : ''}${item.morning == 2 && item.afternoon == 2 ? '、' : ''}${item.afternoon == 2 ? '下午' : ''}` }}</span>
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <div class="month-statistics-box" v-if="statisticalTypeIndex == 1 && statisticsBoxShow">
            <div class="date-box">
               <div class="date-content">
                    <span>{{ getNowFormatDate(currentMonthDate,'month') }}</span>
                    <img :src="calendarPng" alt="" @click="calendarMonthShow = true" />
               </div>
            </div> 
            <div class="attendance-type-list-box">
                <div class="attendance-type-list" v-for="(item,index) in attendanceTypeList" :key="index" @click="attendanceTypeMonthEvent(item,'month')">
                    <div class="attendance-type-left">
                        {{ item.attendanceType }}
                    </div>
                    <div class="attendance-type-right">
                        <span>{{ item.totalNum }}</span>
                        <van-icon name="arrow" color="#666666" size="20" />
                    </div>
                </div>
            </div>
        </div>
        <div class="personnel-statistics-box" v-if="statisticalTypeIndex == 2 && statisticsBoxShow">
            <div class="date-box">
               <div class="date-content">
                    <span>{{ getNowFormatDate(currentPersonDate,'person') }}</span>
                    <img :src="calendarPng" alt="" @click="calendarPersonShow = true" />
               </div>
            </div>
            <van-empty description="暂无数据" v-show="personStatisticalEmptyShow" /> 
            <div class="personnel-statistics-list-box" v-show="!personStatisticalEmptyShow">
                <div class="personnel-statistics-list" v-for="(item,index) in personnelStatisticsList" :key="index">
                    <div class="personnel-statistics-title">
                        <div class="personnel-statistics-title-left">
                            {{ item.name }}
                        </div>
                        <div class="personnel-statistics-title-right">
                            <span>满勤天数</span>
                            <span>{{ item.manQin }}</span>
                            <img :src="editPng" alt="" @click="editEvent(item)">
                        </div>
                    </div>
                    <div class="personnel-statistics-content">
                        <div>
                            <span>出勤</span>
                            <span class="attendanceStyle">
                                {{ `${item.chuQin}天` }}
                            </span>
                        </div>
                        <div>
                            <span>迟到早退</span>
                            <span class="clockingStyle">
                                {{ `${item.zaoTui}天` }}
                            </span>
                        </div>
                        <div>
                            <span>外派</span>
                            <span class="expatriateStyle">
                                {{ `${item.waiPai}天` }}
                            </span>
                        </div>
                        <div>
                            <span>工伤</span>
                            <span class="occupationalInjuryStyle">
                                {{ `${item.gongShang}天` }}
                            </span>
                        </div>
                        <div>
                            <span>病假</span>
                            <span class="sickLeaveStyle">
                                {{ `${item.bingJia}天` }}
                            </span>
                        </div>
                        <div>
                            <span>休假</span>
                            <span class="vocationStyle">
                                {{ `${item.xiuJia}天` }}
                            </span>
                        </div>
                        <div>
                            <span>事假</span>
                            <span class="affairsStyle">
                                {{ `${item.shiJia}天` }}
                            </span>
                        </div>
                        <div>
                            <span>加班</span>
                            <span class="overtimeStyle">
                                {{ `${item.jiaBan}小时` }}
                            </span>
                        </div>
                        <div>
                            <span>调班</span>
                            <span class="changeShiftStyle">
                                {{ `${item.tiaoBan}天` }}
                            </span>
                        </div>
                        <div>
                            <span>旷工</span>
                            <span class="absenteeismStyle">
                                {{ `${item.kuangGong}天` }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>      
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {cleanAttendanceDay, cleanAttendanceMonth, cleanAttendancePeople} from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "AttendanceStatistics",
  components: {
    NavBar
  },
  data() {
    return {
      loadingShow: false,
      attendanceEmptyShow: false,
      expatriateEmptyShow: false,
      overlayShow: false,
      statisticsBoxShow: false,
      personStatisticalEmptyShow: false,
      actualArrival: '',
      total: '',
      activeObjectName: 'attendance',
      currentRate: 0,
      attendanceStatusIndex: null,
      statisticalTypeIndex: 0,
      currentDayDate: new Date(),
      currentMonthDate: new Date(),
      currentPersonDate: new Date(),
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      calendarDayShow: false,
      calendarMonthShow: false,
      calendarPersonShow: false,
      calendarPng: require("@/common/images/home/calendar.png"),
      editPng: require("@/common/images/home/edit.png"),
      statisticalTypeList: ['日统计','月统计','人员统计'],
      attendanceStatusList: [
        { name: '出勤', num: ''},
        { name: '迟到早退', num: ''},
        { name: '外派', num: ''},
        { name: '工伤', num: ''},
        { name: '病假', num: ''},
        { name: '休假', num: ''},
        { name: '事假', num: ''},
        { name: '加班', num: ''},
        { name: '调班', num: ''},
        { name: '旷工', num: ''}
      ],
      expatriateList: [],
      attendanceSituationList: [],
      attendanceTypeList: [
        {
            attendanceTypeName: '出勤',
            attendanceType: '出勤(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '外派',
            attendanceType: '外派(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '工伤',
            attendanceType: '工伤(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '病假',
            attendanceType: '病假(人天)',
            totalNum: 4.5
        },
        {   
            attendanceTypeName: '休假',
            attendanceType: '休假(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '加班',
            attendanceType: '加班(人天、共计时长)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '迟到早退',
            attendanceType: '迟到早退(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '事假',
            attendanceType: '事假(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '调班',
            attendanceType: '调班(人天)',
            totalNum: 4.5
        },
        {
            attendanceTypeName: '旷工',
            attendanceType: '旷工(人天)',
            totalNum: 4.5
        }
      ],
      personnelStatisticsList: []
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
    this.itemNameIndex = this.currentCleanTaskName;
    if (JSON.stringify(this.attendanceStatisticsSwitchMessage) == '{}') {
        this.getCleanAttendanceDay();
    } else {
        this.echoStatisticsSwitchMessage()
    };
    console.log('切换缓存信息',this.attendanceStatisticsSwitchMessage)
  },

  beforeRouteLeave(to, from, next) {
    if (to.path == '/cleanHome') {
        this.storeAttendanceStatisticsSwitchMessage({})
    };
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","personnelStatisticsDetailsMessage","attendanceTypeDetailsMessage","attendanceStatisticsSwitchMessage"]),
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
    ...mapMutations(['storeAttendanceTypeDetailsMessage','storePersonnelStatisticsDetailsMessage', 'storeAttendanceStatisticsSwitchMessage']),
    onClickLeft() {
      this.$router.push({ path: "/cleanHome"})
    },

    onClickRight () {
        let temporarySwitchMessage = this.attendanceStatisticsSwitchMessage;
        temporarySwitchMessage['switchIndex'] = this.statisticalTypeIndex;
        if (this.statisticalTypeIndex == 0) {
            temporarySwitchMessage['date'] = this.currentDayDate
        } else if (this.statisticalTypeIndex == 1) {
            temporarySwitchMessage['date'] = this.currentMonthDate
        } else if (this.statisticalTypeIndex == 2) {
            temporarySwitchMessage['date'] = this.currentPersonDate
        };
        this.storeAttendanceStatisticsSwitchMessage(temporarySwitchMessage);
        this.$router.push({path: '/attendanceManagement'})
    },

    // 回显统计类型切换和时间信息
    echoStatisticsSwitchMessage () {
        this.statisticalTypeIndex = this.attendanceStatisticsSwitchMessage.switchIndex;
        if (this.attendanceStatisticsSwitchMessage.switchIndex == 0) {
            this.currentDayDate = this.attendanceStatisticsSwitchMessage.date;
            this.getCleanAttendanceDay();
        } else if (this.attendanceStatisticsSwitchMessage.switchIndex == 1) {
            this.currentMonthDate = this.attendanceStatisticsSwitchMessage.date;
            this.getCleanAttendanceMonth()
        } else if (this.attendanceStatisticsSwitchMessage.switchIndex == 2) {
            this.currentPersonDate = this.attendanceStatisticsSwitchMessage.date;
            this.getCleanAttendancePeople()
        }
    },

    // vant tab切换事件
    vanTabsChangeEvent () {
        if (this.attendanceSituationList.length == 0) {
            this.attendanceEmptyShow = true
        } else {
            this.attendanceEmptyShow = false
        };
        if (this.expatriateList.length == 0) {
            this.expatriateEmptyShow = true
        }  else {
            this.expatriateEmptyShow = false
        }
    },

    // 统计类型点击事件
    statisticalTypeEvent (item,index) {
        this.statisticalTypeIndex = index;
        if (index == 0) {
            this.getCleanAttendanceDay();
        } else if (index == 1) {
            this.getCleanAttendanceMonth()
        } else if (index == 2) {
            this.getCleanAttendancePeople()
        }
    },

    // 出勤类型日统计点击事件
    attendanceStatusEvent (item,index,type) {
        this.attendanceStatusIndex = index;
        let temporaryMessage = this.attendanceTypeDetailsMessage;
        temporaryMessage['type'] = type;
        temporaryMessage['date'] = this.currentDayDate;
        temporaryMessage['content'] = item;
        this.storeAttendanceTypeDetailsMessage(temporaryMessage);
        let temporarySwitchMessage = this.attendanceStatisticsSwitchMessage;
        temporarySwitchMessage['switchIndex'] = this.statisticalTypeIndex;
        temporarySwitchMessage['date'] = this.currentDayDate;
        this.storeAttendanceStatisticsSwitchMessage(temporarySwitchMessage);
        this.$router.push({path: '/attendanceTypeDetails'});
    },

    // 出勤类型月统计点击事件
    attendanceTypeMonthEvent (item,type) {
        let temporaryMessage = this.attendanceTypeDetailsMessage;
        temporaryMessage['type'] = type;
        temporaryMessage['date'] = this.currentMonthDate;
        temporaryMessage['content'] = item;
        this.storeAttendanceTypeDetailsMessage(temporaryMessage);
        let temporarySwitchMessage = this.attendanceStatisticsSwitchMessage;
        temporarySwitchMessage['switchIndex'] = this.statisticalTypeIndex;
        temporarySwitchMessage['date'] = this.currentMonthDate;
        this.storeAttendanceStatisticsSwitchMessage(temporarySwitchMessage);
        this.$router.push({path: '/attendanceTypeDetails'})
    },

    // 编辑事件（出勤类型人员统计详情事件）
    editEvent (item) {
        this.$router.push({path: '/personnelStatisticsDetails'});
        let temporaryMessage = this.personnelStatisticsDetailsMessage;
        temporaryMessage['date'] = this.currentPersonDate;
        temporaryMessage['content'] = item;
        let temporarySwitchMessage = this.attendanceStatisticsSwitchMessage;
        temporarySwitchMessage['switchIndex'] = this.statisticalTypeIndex;
        temporarySwitchMessage['date'] = this.currentPersonDate;
        this.storeAttendanceStatisticsSwitchMessage(temporarySwitchMessage);
        this.storePersonnelStatisticsDetailsMessage(temporaryMessage)
    },

    // 考勤类型转换
    attendanceTypeTransition (num) {
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
        this.getCleanAttendanceDay();
    },

    onConMonthFirm() {
        this.calendarMonthShow = false;
        this.getCleanAttendanceMonth();
    },

    onConPersonFirm() {
        this.calendarPersonShow = false;
        this.getCleanAttendancePeople()
    },

    // 获取考勤日统计数据
    getCleanAttendanceDay () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.statisticsBoxShow = false;
      cleanAttendanceDay({proId: this.proId,date: this.getNowFormatDate(this.currentDayDate,'day')}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
		if (res && res.data.code == 200) {
            this.actualArrival = res.data.data.arrive;
            this.total = res.data.data.total;
            this.currentRate = Math.ceil((this.actualArrival/this.total)*100);
            for (let item of this.attendanceStatusList) {
                if (item.name == '出勤') {
                    item.num = res.data.data.chuQin
                } else if (item.name == '迟到早退') {
                    item.num = res.data.data.zaoTui
                } else if (item.name == '外派') {
                    item.num = res.data.data.waiPai
                }  else if (item.name == '工伤') {
                    item.num = res.data.data.gongShang
                }  else if (item.name == '病假') {
                    item.num = res.data.data.bingJia
                } else if (item.name == '休假') {
                    item.num = res.data.data.xiuJia
                } else if (item.name == '事假') {
                    item.num = res.data.data.shiJia
                } else if (item.name == '加班') {
                    item.num = res.data.data.jiaBan
                } else if (item.name == '调班') {
                    item.num = res.data.data.tiaoBan
                } else if (item.name == '旷工') {
                    item.num = res.data.data.kuangGong
                }
            };
            this.attendanceSituationList = res.data.data.chuQinList;
            this.expatriateList = res.data.data.waiPaiList;
            if (this.attendanceSituationList.length == 0) {
                this.attendanceEmptyShow = true
            } else {
                this.attendanceEmptyShow = false
            };
            if (this.expatriateList.length == 0) {
                this.expatriateEmptyShow = true
            }  else {
                this.expatriateEmptyShow = false
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

    // 获取考勤月统计数据
    getCleanAttendanceMonth () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.statisticsBoxShow = false;
      cleanAttendanceMonth({proId: this.proId,month: this.getNowFormatDate(this.currentMonthDate,'month')}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
		if (res && res.data.code == 200) {
            for (let item of this.attendanceTypeList) {
                if (item.attendanceTypeName == '出勤') {
                    item.totalNum = res.data.data.chuQin;
                    item.attendanceType = `出勤(${res.data.data.standard})`
                } else if (item.attendanceTypeName == '迟到早退') {
                    item.totalNum = res.data.data.zaoTui
                } else if (item.attendanceTypeName == '外派') {
                    item.totalNum = res.data.data.waiPai
                }  else if (item.attendanceTypeName == '工伤') {
                    item.totalNum = res.data.data.gongShang
                }  else if (item.attendanceTypeName == '病假') {
                    item.totalNum = res.data.data.bingJia
                } else if (item.attendanceTypeName == '休假') {
                    item.totalNum = res.data.data.xiuJia
                } else if (item.attendanceTypeName == '事假') {
                    item.totalNum = res.data.data.shiJia
                } else if (item.attendanceTypeName == '加班') {
                    item.totalNum = `${res.data.data.jiaBan}(${res.data.data.jiaBanXS}小时)`
                } else if (item.attendanceTypeName == '调班') {
                    item.totalNum = res.data.data.tiaoBan
                } else if (item.attendanceTypeName == '旷工') {
                    item.totalNum = res.data.data.kuangGong
                }
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

    // 获取考勤人员统计数据
    getCleanAttendancePeople () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.personStatisticalEmptyShow = false;
      this.statisticsBoxShow = false;
      this.personnelStatisticsList = [];
      cleanAttendancePeople({proId: this.proId,month: this.getNowFormatDate(this.currentPersonDate,'person')}).then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.statisticsBoxShow = true;
		if (res && res.data.code == 200) {
           if (res.data.data.length > 0) {
                this.personnelStatisticsList = res.data.data
           } else {
                this.personStatisticalEmptyShow = true
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
        };
        .van-nav-bar__right {
            .van-nav-bar__text {
                font-weight: bold !important
            }
        };
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
    .content-top {
        width: 100%;
        margin: 0 auto;
        .statistical-type-list-box {
            height: 40px;
            width: 96%;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .statistical-type-list {
                flex: 1;
                height: 30px;
                text-align: center;
                line-height: 30px;
                font-size: 12px;
                color: #9E9E9A
            };
            .statisticalTypeListStyle {
                background: #fff !important;
                border-radius: 8px !important;
                color: #1864FF !important;
                font-weight: bold !important
            }
        }
    };
    .day-statistics-box {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 0;
        .date-box {
            width: 100%;
            padding: 5px 0;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
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
        .content-center {
            width: 96%;
            padding: 6px 10px;
            margin: 0 auto;
            border-radius: 6px;
            margin-top: 10px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            /deep/ .van-circle {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                >div {
                    font-size: 10px;
                    color: #101010;
                    margin-top: 12px
                }
            };
            .circle-explain {
                font-size: 12px;
                color: #d0d0cc;
                margin-top: 15px
            };
            .attendance-status-list-box {
                width: 96%;
                margin: 0 auto;
                display: flex;
                flex-wrap: wrap;
                margin-top: 15px;
                .attendance-status-list {
                    font-size: 14px;
                    width: 32%;
                    margin-right: 2%;
                    margin-bottom: 10px;
                    height: 30px;
                    text-align: center;
                    line-height: 30px;
                    border-radius: 4px;
                    box-sizing: border-box;
                    &:nth-child(3n) {
                        margin-right: 0
                    }
                };
                .attendanceStyle {
                    border: 1px solid #289E8E;
                    color: #289E8E
                };
                .clockingStyle {
                    border: 1px solid #E86F50;
                    color: #E86F50
                };
                .expatriateStyle {
                    border: 1px solid #174E97;
                    color: #174E97
                };
                .occupationalInjuryStyle {
                    border: 1px solid #E8CB51;
                    color: #E8CB51
                };
                .sickLeaveStyle {
                    border: 1px solid #101010;
                    color: #101010
                };
                .vocationStyle {
                    border: 1px solid #254550;
                    color: #254550
                };
                .affairsStyle  {
                    border: 1px solid #3B9DF9;
                    color: #3B9DF9
                };
                .overtimeStyle  {
                    border: 1px solid #F2A15F;
                    color: #F2A15F
                };
                .changeShiftStyle {
                    border: 1px solid #1864FF;
                    color: #1864FF
                };
                .absenteeismStyle {
                    border: 1px solid #666666;
                    color: #666666
                };

                .attendanceActiveStyle {
                    background: #289E8E !important;
                    color: #fff !important;
                    border: none !important
                };
                .clockingActiveStyle {
                    background:#E86F50 !important;
                    color: #fff !important;
                    border: none !important
                };
                .expatriateActiveStyle {
                    background: #174E97 !important;
                    color: #fff !important;
                    border: none !important
                };
                .occupationalInjuryActiveStyle {
                    background:#E8CB51 !important;
                    color: #fff !important;
                    border: none !important
                };
                .sickLeaveActiveStyle {
                    background: #101010 !important;
                    color: #fff !important;
                    border: none !important
                };
                .vocationActiveStyle {
                    background: #254550 !important;
                    color: #fff !important;
                    border: none !important
                };
                .affairsActiveStyle  {
                    background: #3B9DF9 !important;
                    color: #fff !important;
                    border: none !important
                };
                .overtimeActiveStyle  {
                    background:#F2A15F !important;
                    color: #fff !important;
                    border: none !important
                };
                .changeShiftActiveStyle {
                    background:#1864FF !important;
                    color: #fff !important;
                    border: none !important
                };
                .absenteeismActiveStyle {
                    background:#666666 !important;
                    color: #fff !important;
                    border: none !important
                };
               
            }
        };
        .cotent-bottom {
            background: #fff;
            margin-top: 10px;
            width: 100%;
            flex: 1;
            overflow: auto;
            /deep/ .van-tabs {
                display: flex;
                flex-direction: column;
                height: 100%;
                .van-tabs__nav {
                    .van-tab {
                        color: #d0d0cc !important
                    };
                    .van-tab--active {
                        color: #174E97 !important
                    }
                };
                .van-tabs__content {
                    flex: 1;
                    overflow: auto;
                    .attendance-situation-list {
                        height: 40px;
                        color: #5f5f5f;
                        display: flex;
                        font-size: 14px;
                        align-items: center;
                        justify-content: space-between;
                        padding: 20px;
                        box-sizing: border-box;
                        .attendance-situation-left {
                            width: 50%;
                            .no-wrap()
                        };
                        .attendance-situation-right {
                            width: 50%;
                            text-align: right;
                            .no-wrap();
                            >span {
                                &:first-child {
                                    color: #101010;
                                };
                                &:last-child {}
                            }
                        };
                        &:nth-child(even) {
                            background: #F8F8F8
                        }
                    }
                }
            }
        }
    };
    .month-statistics-box {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 0;
        .date-box {
            width: 100%;
            padding: 5px 0;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
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
        .attendance-type-list-box {
            height: 100%;
            overflow: auto;
            margin-top: 10px;
            .attendance-type-list {
                width: 100%;
                padding: 0 8px;
                height: 40px;
                box-sizing: border-box;
                border-radius: 6px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                .attendance-type-left {
                    flex: 1;
                    font-size: 14px;
                    color: #101010;
                    padding-right: 8px;
                    box-sizing: border-box;
                    word-break: break-all
                };
                .attendance-type-right {
                    font-size: 14px;
                    color: #666;
                    /deep/ .van-icon {
                        vertical-align: middle
                    };
                    >span {
                        vertical-align: middle
                    }
                };
                &:nth-child(odd) {
                    background: #fff;
                };
                &:nth-child(even) {
                    background: #F6F7F9;
                }
            }
        }    
    };
    .personnel-statistics-box {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 0;
        overflow: auto;
        position: relative;
        /deep/ .van-empty {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%)
        };
        .date-box {
            width: 100%;
            padding: 5px 0;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
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
        .personnel-statistics-list-box {
            height: 100%;
            overflow: auto;
            margin-top: 10px;
            .personnel-statistics-list {
                width: 98%;
                margin: 0 auto;
                background: #fff;
                border-radius: 4px;
                box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
                padding: 0 0 4px 0;
                box-sizing: border-box;
                margin-bottom: 10px;
                .personnel-statistics-title {
                    .bottom-border-1px(rgba(0, 0, 0, 0.23));
                    width: 98%;
                    box-sizing: border-box;
                    margin: 0 auto;
                    height: 44px;
                    align-items: center;
                    display: flex;
                    padding: 0 10px;
                    justify-content: space-between;
                    .personnel-statistics-title-left {
                        font-size: 16px;
                        color: #101010;
                        font-weight: bold;
                        flex: 1;
                        padding-right: 8px;
                        box-sizing: border-box;
                        .no-wrap()
                    };
                    .personnel-statistics-title-right {
                        >span {
                            vertical-align: middle;
                            font-size: 14px;
                            &:nth-child(1) {
                                color: #6d6d6d
                            };
                            &:nth-child(2) {
                                color: #101010;
                                margin: 0 8px 0 4px
                            }
                        };
                        img {
                            width: 21px;
                            height: 21px;
                            vertical-align: middle
                        }
                    }
                };
                .personnel-statistics-content {
                    width: 98%;
                    box-sizing: border-box;
                    margin: 0 auto;
                    display: flex;
                    flex-flow: row wrap;
                    padding: 10px;
                    justify-content: space-between;
                    >div {
                        width: 33.3%;
                        text-align: left;
                        font-size: 14px;
                        margin-bottom: 16px;
                        >span {
                            &:nth-child(1) {
                                color: #101010;
                                margin-right: 6px
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
                    }
                }
            } 
        }
    }    
  }
}
</style>