<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
       <van-nav-bar
        title="任务列表"
        left-text="返回"
        right-text="刷新"
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
        <div class="content-top-task-item-name">
            <div @click="taskItemNameEvent(1)" v-show="currentCleanTaskName.forthwithTaskShow" :class="{'forthwithItemStyle':itemNameIndex == 1}">{{`即时${forthwithTaskList.length}`}}</div>
            <div @click="taskItemNameEvent(2)" v-show="currentCleanTaskName.specialTaskShow" :class="{'specialItemStyle':itemNameIndex == 2}">{{`专项${specialTaskList.length}`}}</div>
            <div @click="taskItemNameEvent(3)" v-show="currentCleanTaskName.pollingTaskShow" :class="{'pollingItemStyle':itemNameIndex == 3}">{{`巡检${pollingTaskList.length}`}}</div>
        </div>
        <div class="content-top-filtrate">
            <div class="filtrate-box">
                <div class="select-box">
                    <van-dropdown-menu active-color="#1989fa">
                        <van-dropdown-item v-model="selectValue"  :options="selectOption" @change="selecOptionChangeEvent" />
                    </van-dropdown-menu>
                </div>
                <div class="search-box">
                    <van-field
                        v-model="searchValue"
                        placeholder="搜索关键词"
                    >
                        <template #right-icon>
                           <van-icon @click="searchEvent" name="search" color="#101010" size="24" />
                        </template>
                    </van-field>
                </div>
            </div>
        </div>
        <div class="content-bottom">
            <div class="task-list-box" v-if="currentCleanTaskName.num == 1">
                <van-empty v-show="forthwithEmptyShow" description="暂无数据" />
                <div class="task-list" v-show="!forthwithEmptyShow" v-for="(item,index) in forthwithTaskList" @click="forthwithTaskDetailsEvent(item,generateTaskNumber('即时',index))" :key="index">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            即时任务编号{{ generateTaskNumber('即时',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{
                            'underwayStyle' : item.state == 3, 
                            'completeStyle' : item.state == 5,
                            'reviewStyle' : item.state == 4 || item.state == 8,
                            'haveReviewStyle' : item.state == 6
                            }"
                            >
                            {{ stausTransfer(item.state) }}
                        </div>
                    </div>
                    <div class="task-list-content">
                        <div class="one-line">
                            <span>地点: </span>
                            <span>{{ `${item.structureName}${item.depName}${item.areaImmediateName}${extractSpaceMessage(item.spaces)}` }}</span>
                        </div>
                        <div class="one-line">
                            <span>创建时间: </span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="one-line" v-show="item.state != 1 && item.state != 2">
                            <span>开始时间: </span>
                            <span>{{ item.startTime }}</span>
                        </div>
                        <div class="one-line" v-show="item.state == 5 || item.state == 6">
                            <span>完成时间: </span>
                            <span>{{ item.finishTime }}</span>
                        </div>
                        <div class="one-line">
                            <span>保洁主管: </span>
                            <span>{{ `${!item.workerName ? '' : item.workerName }${!item.workerName ? '' : '、'}${item.managerName}` }}</span>
                        </div>
                        <div class="one-line">
                            <span>问题描述: </span>
                            <span>{{ item.taskRemark }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-list-box" v-if="currentCleanTaskName.num == 2">
                <van-empty v-show="specialEmptyShow" description="暂无数据" />   
                <div class="task-list special-list" v-show="!specialEmptyShow" v-for="(item,index) in specialTaskList" @click="specialTaskDetailsEvent(item,generateTaskNumber('专项',index))" :key="item.taskNumber">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            编号{{ generateTaskNumber('专项',index) }}
                        </div>
                        <div class="task-list-title-right" :class="{
                                'underwayStyle' : item.state == 3, 
                                'completeStyle' : item.state == 5,
                                'reviewStyle' : item.state == 4 || item.state == 8,
                                'haveReviewStyle' : item.state == 6
                            }">
                            {{ stausTransfer(item.state) }}
                        </div>
                    </div>
                    <div class="task-list-content">
                        <div class="one-line">
                            <span>地点: </span>
                            <span>{{ `${item.structureName}${item.depName}${item.areaSpecialName}` }}</span>
                        </div>
                        <div class="one-line">
                            <span>保洁事项: </span>
                            <span>{{ item.cleanItemName }}</span>
                        </div>
                        <div class="one-line">
                            <span>创建时间: </span>
                            <span>{{ item.createTime }}</span>
                        </div>
                        <div class="one-line" v-show="item.state != 1 && item.state != 2">
                            <span>开始时间: </span>
                            <span>{{ item.startTime }}</span>
                        </div>
                        <div class="one-line" v-show="item.state == 5 || item.state == 6">
                            <span>完成时间: </span>
                            <span>{{ item.finishTime }}</span>
                        </div>
                        <div class="one-line">
                            <span>保洁主管: </span>
                            <span>{{ `${disposeWorkers(item.workers)}${!disposeWorkers(item.workers) ? '' : '、'}${item.managerName}` }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="task-list-box" v-if="currentCleanTaskName.num == 3">
                <van-empty v-show="pollingEmptyShow" description="暂无数据" />  
                <div class="task-list polling-list" v-show="!pollingEmptyShow" v-for="(item) in pollingTaskList" @click="pollingTaskDetailsEvent(item)" :key="item.pollingTaskName">
                    <div class="task-list-title">
                        <div class="task-list-title-left">
                            {{ item.settingName }}
                        </div>
                        <div class="task-list-title-right" :class="{'forbidStyle':item.state == -10,'noStartStyle': item.state == 1,'underwayStyle' : item.state == 2, 'completeStyle' : item.state == 3}">
                            {{ stausPollingTaskTransfer(item.state) }}
                        </div>
                    </div>
                    <div class="task-list-content">
                        <div class="list-content-left">
                            <div>
                                <span>开始时间:</span>
                                <span>{{ disposeTime(item) }}</span>
                            </div>
                            <div>
                                <span>巡检人:</span>
                                <span>{{ item.workerName }}</span>
                            </div>
                        </div>
                        <div class="list-content-right">
                            <van-circle v-model="item.complete" :rate="`${Math.ceil((item['ratioMap']['finish']/item['ratioMap']['all'])*100)}`" :speed="100" layer-color="#d0d0cc" 
                            :size="30" :stroke-width="100"
                            :color="item['ratioMap']['finish'] == 0 ? '#d0d0cc' : '#1864FF'" 
                            />
                            <div class="complete-text">
                                <span>完成率:</span>
                                <span>{{ `${Math.ceil((item['ratioMap']['finish']/item['ratioMap']['all'])*100)}%` }}</span>
                            </div>
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
import { queryCleaningManageTaskList, queryPollingTaskList } from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
let windowTimer
export default {
  name: "CleaningTask",
  components: {
    NavBar,
  },
  data() {
    return {
      loadingShow: false,
      currentShowTime: '',
      overlayShow: false,
      forthwithEmptyShow: false,
      isTimeoutContinue: true,
      specialEmptyShow: false,
      pollingEmptyShow: false,
      currentSelectValue: -1,
      selectValue: -1,
      itemNameIndex: 1,
      searchValue: '',
      currenDate: new Date(),
      selectOption: [
        { text: '全部状态', value: -1 },
        { text: '未开始', value: 2 },
        { text: '进行中', value: 3 },
        { text: '待复核', value: 4 },
        { text: '已完成', value: 5},
        { text: '已复核', value: 6 },
        { text: '复核中', value: 8 }
      ],
      forthwithTaskList: [],
      specialTaskList: [],
      allForthwithTaskList: [],
      allSpecialTaskList: [],
      pollingTaskList: [],
      allPollingTaskList: []
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
      if (from.path != '/cleanTaskList') {
        //非此页面进入时,回显筛选状态
        // if (JSON.stringify(vm.cleanTaskDetails) != "{}" && vm.cleanTaskDetails.selectValue) {
        //     vm.currentSelectValue = vm.cleanTaskDetails.selectValue;
        //     vm.selectValue = vm.cleanTaskDetails.selectValue
        // }
      }
	});
    next() 
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleanTaskList",
        })
      })
    };
    this.itemNameIndex = this.currentCleanTaskName.num;
    if (this.itemNameIndex == 1 || this.itemNameIndex == 2) {
        this.selectOption = [
            { text: '全部状态', value: -1 },
            { text: '未开始', value: 2 },
            { text: '进行中', value: 3 },
            { text: '待复核', value: 4 },
            { text: '已完成', value: 5},
            { text: '已复核', value: 6 },
            { text: '复核中', value: 8 }
        ]
    } else if (this.itemNameIndex == 3) {
        this.selectOption = [
            { text: '全部状态', value: -1 },
            { text: '未开始', value: 1 },
            { text: '进行中', value: 2 },
            { text: '已完成', value: 3 }
        ]
    };
    this.getForthwithTaskList(0);
    this.getSpecialTaskList(1);
    this.getPollingTaskList();
    // 轮询巡检任务状态
    if (!windowTimer) {
        windowTimer = window.setInterval(() => {
            // 所有任务都完成时就不在查询任务状态状态
            let isAllSellout = this.pollingTaskList.every((item) => { return item.state == 3 });
            if (this.isTimeoutContinue && !isAllSellout) {
                this.timingGetPollingTaskList()
            }
        }, 3000)
    }
  },

  beforeDestroy () {
    if(windowTimer) {
        clearTimeout(windowTimer);
        windowTimer = null
    }
  },

  watch: {
        selectValue: {
            handler(newName, oldName) {  
                this.currentSelectValue = newName;
                if (this.searchValue) {
                    this.searchValue = ''
                };
                if (this.currentSelectValue == -1) {
                    if (this.itemNameIndex == 1) {
                        this.forthwithTaskList = this.allForthwithTaskList;
                        if (this.forthwithTaskList.length == 0) {
                            this.forthwithEmptyShow = true
                        } else {
                            this.forthwithEmptyShow = false
                        }
                    };
                    if (this.itemNameIndex == 2) {
                        this.specialTaskList = this.allSpecialTaskList;
                        if (this.specialTaskList.length == 0) {
                            this.specialEmptyShow = true
                        } else {
                            this.specialEmptyShow = false
                        }
                    };
                    if (this.itemNameIndex == 3) {
                        this.pollingTaskList = this.allPollingTaskList;
                        if (this.pollingTaskList.length == 0) {
                            this.pollingEmptyShow = true
                        } else {
                            this.pollingEmptyShow = false
                        }
                    }
                } else {
                    if (this.itemNameIndex == 1) {
                        // 未查阅也算未开始
                        if (this.currentSelectValue == 2) {
                            this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == 1})
                        } else {
                            this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue})
                        };
                        if (this.forthwithTaskList.length == 0) {
                            this.forthwithEmptyShow = true
                        } else {
                            this.forthwithEmptyShow = false
                        }
                    };
                    if (this.itemNameIndex == 2) {
                        // 未查阅也算未开始
                        if (this.currentSelectValue == 2) {
                            this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == 1 })
                        } else {
                            this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue})
                        };
                        if (this.specialTaskList.length == 0) {
                            this.specialEmptyShow = true
                        } else {
                            this.specialEmptyShow = false
                        }
                    };
                    if (this.itemNameIndex == 3) {
                        // 未到开始时间也算未开始
                        if (this.currentSelectValue == 1) {
                            this.pollingTaskList = this.allPollingTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == -10 })
                        } else {
                            this.pollingTaskList = this.allPollingTaskList.filter((item) => { return item.state == this.currentSelectValue})
                        };
                        if (this.pollingTaskList.length == 0) {
                            this.pollingEmptyShow = true;
                            console.log('箱子',this.pollingTaskList,this.currentCleanTaskName.num);
                        } else {
                            this.pollingEmptyShow = false
                        }
                    }
                }
            },
            deep: true
        }
  },

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","currentCleanTaskName","cleanTaskDetails"]),
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
    ...mapMutations(['storeCurrentCleanTaskName','storeCleanTaskDetails','storePollingTaskCurrentShowTime']),
    onClickLeft() {
      this.$router.push({ path: "/cleanTaskList"})
    },
    onClickRight () {
        if (this.searchValue) {
            this.searchValue = ''
        };
        if (this.selectValue != -1) {
            this.selectValue = -1;
            this.currentSelectValue = -1
        };
        this.getForthwithTaskList(0);
        this.getSpecialTaskList(1);
        this.getPollingTaskList()
    },

    // 处理保洁员
    disposeWorkers (workerName) {
        if (workerName.length == 0) { return '' };
        let temporaryArr = [];
        for ( let item of workerName) {
            temporaryArr.push(item.name)
        };
        return temporaryArr.join('、')
    },

    // 处理巡检任务开始时间
    disposeTime (item) {
        if (Object.prototype.toString.call(item.startTime) === '[object Array]') {
            if (item.startTime.length > 0) {
                // 未开始(已到开始时间,但是没扫码)和进行中的任务,开始时间只显示当前检查时间段的开始时间
                if (item.state == 1 || item.state == 2) {
                    let temporaryArr = [];
                    // 当当前时间大于或等于开始时间集合里最大的时间(时间集合的最后一位)时,就显示开始时间集合里最大的时间
                    if (new Date().getTime() >= new Date(this.getNowFormatDate(item.startTime[item.startTime.length-1])).getTime()) {
                        temporaryArr.push(item.startTime[item.startTime.length-1])
                    } else {        
                        for (let i=0, len = item.startTime.length; i<len; i++) {
                            if (i > 0) {
                                if (new Date().getTime() < new Date(this.getNowFormatDate(item.startTime[i])).getTime()) {
                                    temporaryArr.push(item.startTime[i-1])
                                    break
                                }
                            }    
                        }
                    };    
                    return temporaryArr.join(',')
                } else {
                    return item.startTime.join(',')
                }
            }
        }
    },

    // 获取巡检任务当前显示的开始时间点
    disposeTimeTwo (item) {
        if (Object.prototype.toString.call(item.startTime) === '[object Array]') {
            if (item.startTime.length > 0) {
                let temporaryArr = [];
                // 当当前时间大于或等于开始时间集合里最大的时间(时间集合的最后一位)时,就显示开始时间集合里最大的时间
                if (new Date().getTime() >= new Date(this.getNowFormatDate(item.startTime[item.startTime.length-1])).getTime()) {
                    temporaryArr.push(item.startTime[item.startTime.length-1])
                } else {        
                    for (let i=0, len = item.startTime.length; i<len; i++) {
                        if (i > 0) {
                            if (new Date().getTime() < new Date(this.getNowFormatDate(item.startTime[i])).getTime()) {
                                temporaryArr.push(item.startTime[i-1])
                                break
                            }
                        }    
                    }
                };    
                return temporaryArr.join(',')
            }
        }
    },

    // 任务状态转换(即时和专项)
    stausTransfer (num) {
        switch(num) {
            case 1:
                return '未开始'
                break;
            case 2:
                return '未开始'
                break;
            case 3:
                return '进行中'
                break;
            case 4:
                return '待复核'
                break;
            case 5:
                return '已完成'
                break;
            case 6:
                return '已复核'
                break
            case 8:
                return '复核中'
                break
        } 
    },

    // 任务状态转换(巡检)
    stausPollingTaskTransfer (num) {
        switch(num) {
            case -10:
                return '任务未到开始时间'
                break;
            case 1:
                return '未开始'
                break;
            case 2:
                return '进行中'
                break;
             case 3:
                return '已完成'
                break;
        } 
    },

    // 提取即时保洁功能区信息
    extractSpaceMessage (spaces) {
        if (spaces.length == 0) {
            return ''
        };
        let temporaryArray = [];
        for (let item of spaces) {
            temporaryArray.push(item.name);
        };
        return temporaryArray.join("、")
    },

    // 生成任务编号
    generateTaskNumber (type,index) {
        let startField = '';
        let endIndex = index+1 >= 10 ? `0${index+1}` : `00${index+1}`;
        let month = this.currentCleanTaskName.originalDate.getMonth() + 1;
        let Date = this.currentCleanTaskName.originalDate.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        };
        if (Date >= 0 && Date <= 9) {
            Date = "0" + Date;
        };
        if (type == '即时') {
            startField = 'JS'
        } else if (type == '专项') {
            startField = 'ZX'
        } else if (type == '巡检') {
            startField = 'XJ'
        };
        return  `${startField}${month}${Date}${endIndex}`
    },

    // 查询即时保洁任务列表
    getForthwithTaskList (taskType) {
        let data = {
            proId : this.proId, // 所属项目id
            queryDate: this.currentCleanTaskName.date, // 查询时间
            managerId: this.workerId, // 保洁主管id    
            taskType: taskType // 0-即时，1-专项
        };
        this.loadingShow = true;
        this.overlayShow = true;
        this.forthwithTaskList = [];
        queryCleaningManageTaskList(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
	      if (res && res.data.code == 200) {
                this.forthwithTaskList = res.data.data.filter((item) => { return item.state != 7 && item.state != 0});
                this.allForthwithTaskList = this.forthwithTaskList;
                if (this.currentSelectValue == -1) {
                    this.forthwithTaskList = this.allForthwithTaskList;
                    if (this.forthwithTaskList.length == 0) {
                        this.forthwithEmptyShow = true
                    } else {
                        this.forthwithEmptyShow = false
                    };
                    return
                };
                if (this.itemNameIndex == 1) {
                    // 未查阅也算未开始
                    if (this.currentSelectValue == 2) {
                        this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == 1})
                    } else {
                        this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue})
                    }
                };    
                if (this.forthwithTaskList.length == 0) {
                    this.forthwithEmptyShow = true
                } else {
                    this.forthwithEmptyShow = false
                }
                if (this.forthwithTaskList.length == 0) {
                    this.forthwithEmptyShow = true
                } else {
                    this.forthwithEmptyShow = false
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
            this.overlayShow = false
        })
    },

    // 查询专项保洁任务列表
    getSpecialTaskList (taskType) {
        let data = {
            proId : this.proId, // 所属项目id
            queryDate: this.currentCleanTaskName.date, // 查询时间
            managerId: this.workerId, // 保洁主管id    
            taskType: taskType // 0-即时，1-专项
        };
        this.loadingShow = true;
        this.overlayShow = true;
        this.specialTaskList = [];
        queryCleaningManageTaskList(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
	      if (res && res.data.code == 200) {
                this.specialTaskList = res.data.data.filter((item) => { return item.state != 7 && item.state != 0});
                this.allSpecialTaskList = this.specialTaskList;
                if (this.currentSelectValue == -1) {
                    this.specialTaskList = this.allSpecialTaskList;
                    if (this.specialTaskList.length == 0) {
                        this.specialEmptyShow = true
                    } else {
                        this.specialEmptyShow = false
                    };
                    return
                };
                if (this.itemNameIndex == 2) {
                    // 未查阅也算未开始
                    if (this.currentSelectValue == 2) {
                        this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == 1 })
                    } else {
                        this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue })
                    }
                };    
                if (this.specialTaskList.length == 0) {
                    this.specialEmptyShow = true
                } else {
                    this.specialEmptyShow = false
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
            this.overlayShow = false
        })
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

    // 定时查询巡检任务列表(实时更新任务状态)
    timingGetPollingTaskList() {
        this.isTimeoutContinue = false;
        queryPollingTaskList({
            proId : this.proId, // 所属项目id
            workerId: this.workerId, // 保洁主管id
        }).then((res) => {
            this.isTimeoutContinue = true;
            let temporaryPollingTaskList;
            if (res && res.data.code == 200) {
                if (this.currentSelectValue == -1) {
                    temporaryPollingTaskList = res.data.data.filter((item) => { return item.state != 7 && item.state != 0})
                } else {
                    temporaryPollingTaskList = res.data.data.filter((item) => { return item.state == this.currentSelectValue && item.state != 7 && item.state != 0})
                };
                if (temporaryPollingTaskList.length > 0) {
                    for (let item of temporaryPollingTaskList) {
                        let currentIndex = this.pollingTaskList.indexOf(this.pollingTaskList.filter((innerItem) => { return innerItem.id == item.id})[0]);
                        if (currentIndex != -1) {
                            // 已完成任务的状态不更改
                            if (this.pollingTaskList[currentIndex]['state'] != 3) {
                                // 进行中的任务不重新定义状态
                                if (this.pollingTaskList[currentIndex]['state'] != 2) {
                                    if (new Date().getTime() < new Date(this.getNowFormatDate(this.pollingTaskList[currentIndex]['startTime'][0])).getTime()) {
                                        this.pollingTaskList[currentIndex]['state'] = -10
                                    } else {
                                        this.pollingTaskList[currentIndex]['state'] = 1
                                    }
                                } else {
                                    this.pollingTaskList[currentIndex]['state'] = item.state
                                } 
                            };
                            // 未到开始时间的任务显示所有开始时间集合
                            if (this.pollingTaskList[currentIndex]['state'] != -10) {
                                this.pollingTaskList[currentIndex]['startTime'] = item['startTime'];
                            }    
                        }
                    } 
                }
            }
        })
        .catch((err) => {
            this.isTimeoutContinue = true
        })
    },

    // 查询巡检任务列表
    getPollingTaskList () {
        let data = {
            proId : this.proId, // 所属项目id
            workerId: this.workerId // 保洁主管id    
        };
        this.loadingShow = true;
        this.overlayShow = true;
        this.pollingTaskList = [];
        queryPollingTaskList(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
	      if (res && res.data.code == 200) {
                this.pollingTaskList = res.data.data.filter((item) => { return item.state != 7 && item.state != 0});
                this.allPollingTaskList = this.pollingTaskList;
                if (this.currentSelectValue == -1) {
                    this.pollingTaskList = this.allPollingTaskList;
                    if (this.pollingTaskList.length == 0) {
                        this.pollingEmptyShow = true
                    } else {
                        this.pollingEmptyShow = false
                    };
                    return
                };
                if (this.itemNameIndex == 3) {
                    // 未到开始时间也算未开始
                    if (this.currentSelectValue == 1) {
                        this.pollingTaskList = this.allPollingTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == -10 })
                    } else {
                        this.pollingTaskList = this.allPollingTaskList.filter((item) => { return item.state == this.currentSelectValue})
                    }
                };
                if (this.pollingTaskList.length == 0) {
                    this.pollingEmptyShow = true
                } else {
                    this.pollingEmptyShow = false
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
            this.overlayShow = false
        })
    },

    // 下拉框值改变事件
    selecOptionChangeEvent (value) {
    },

    // 任务名称点击事件
    taskItemNameEvent (num) {
        if (this.selectValue != -1) {
            this.selectValue = -1;
            this.currentSelectValue = -1
        };
        if (num == 1 || num == 2) {
           this.selectOption = [
                { text: '全部状态', value: -1 },
                { text: '未开始', value: 2 },
                { text: '进行中', value: 3 },
                { text: '待复核', value: 4 },
                { text: '复核中', value: 8 },
                { text: '已完成', value: 5},
                { text: '已复核', value: 6 }
            ]
        } else {
           this.selectOption = [
                { text: '全部状态', value: -1 },
                { text: '未开始', value: 1 },
                { text: '进行中', value: 2 },
                { text: '已完成', value: 3 }
            ] 
        };
        let temporaryMessage = this.currentCleanTaskName;
        temporaryMessage['num'] = num;
        this.storeCurrentCleanTaskName(temporaryMessage);
        if (this.searchValue) { this.searchValue = ''}
        this.itemNameIndex = num;
        if (this.currentSelectValue == -1) {
            if (this.itemNameIndex == 1) {
                this.forthwithTaskList = this.allForthwithTaskList;
                if (this.forthwithTaskList.length == 0) {
                    this.forthwithEmptyShow = true
                } else {
                    this.forthwithEmptyShow = false
                }
            };
            if (this.itemNameIndex == 2) {
                this.specialTaskList = this.allSpecialTaskList;
                if (this.specialTaskList.length == 0) {
                    this.specialEmptyShow = true
                } else {
                    this.specialEmptyShow = false
                }
            };
            if (this.itemNameIndex == 3) {
                this.pollingTaskList = this.allPollingTaskList;
                if (this.pollingTaskList.length == 0) {
                    this.pollingEmptyShow = true
                } else {
                    this.pollingEmptyShow = false
                }
            }
        } else {
            if (this.itemNameIndex == 1) {
                // 未查阅也算未开始
                if (this.currentSelectValue == 2) {
                    this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == 1})
                } else {
                    this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.state == this.currentSelectValue})
                };
                if (this.forthwithTaskList.length == 0) {
                    this.forthwithEmptyShow = true
                } else {
                    this.forthwithEmptyShow = false
                }
            };
            if (this.itemNameIndex == 2) {
                // 未查阅也算未开始
                if (this.currentSelectValue == 2) {
                    this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue || item.state == 1 })
                } else {
                    this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.state == this.currentSelectValue})
                };
                if (this.specialTaskList.length == 0) {
                    this.specialEmptyShow = true
                } else {
                    this.specialEmptyShow = false
                }
            };
            if (this.itemNameIndex == 3) {
                this.pollingTaskList = this.allPollingTaskList.filter((item) => { return item.state == this.currentSelectValue});
                if (this.pollingTaskList.length == 0) {
                    this.pollingEmptyShow = true
                } else {
                    this.pollingEmptyShow = false
                }
            }
        }
    },

    // 搜索事件
    searchEvent () {
        this.selectValue = -1;
        if (this.itemNameIndex == 1) {
            if (!this.searchValue) {
                this.forthwithTaskList = this.allForthwithTaskList;
                this.currentSelectValue = -1;
                this.selectValue = -1
            } else {
                this.forthwithTaskList = this.allForthwithTaskList.filter((item) => { return item.structureName.indexOf(this.searchValue) != -1 || item.depName.indexOf(this.searchValue) != -1 ||
                item.areaImmediateName.indexOf(this.searchValue) != -1  ||  (this.extractSpaceMessage(item.spaces)).indexOf(this.searchValue) != -1 ||
                item.workerName.indexOf(this.searchValue) != -1 || item.managerName.indexOf(this.searchValue) != -1}
                )
            };
            if (this.forthwithTaskList.length == 0) {
                this.forthwithEmptyShow = true
            } else {
                this.forthwithEmptyShow = false
            }
        } else if (this.itemNameIndex == 2) {
            if (!this.searchValue) {
                this.specialTaskList = this.allSpecialTaskList;
                this.currentSelectValue = -1;
                this.selectValue = -1
            } else {
                this.specialTaskList = this.allSpecialTaskList.filter((item) => { return item.structureName.indexOf(this.searchValue) != -1 || item.depName.indexOf(this.searchValue) != -1 ||
                item.areaSpecialName.indexOf(this.searchValue) != -1 || item.workerName.indexOf(this.searchValue) != -1 || item.managerName.indexOf(this.searchValue) != -1}
                )
            };
            if (this.specialTaskList.length == 0) {
                this.specialEmptyShow = true
            } else {
                this.specialEmptyShow = false
            }
        } else if (this.itemNameIndex == 3) {
            if (!this.searchValue) {
                this.pollingTaskList = this.allPollingTaskList;
                this.currentSelectValue = -1;
                this.selectValue = -1
            } else {
                this.pollingTaskList = this.allPollingTaskList.filter((item) => { return item.settingName.indexOf(this.searchValue) != -1 || item.workerName.indexOf(this.searchValue) != -1 }
                )
            };
            if (this.pollingTaskList.length == 0) {
                this.pollingEmptyShow = true
            } else {
                this.pollingEmptyShow = false
            }
        }    
    },

    // 即时保洁任务点击进入任务详情事件
    forthwithTaskDetailsEvent(item,number) {
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        temporaryMessage['selectValue'] = this.selectValue;
        this.storeCleanTaskDetails(temporaryMessage);
        this.$router.push({path: '/forthwithCleaningTaskDetails'})
    },

    // 专项保洁任务点击进入任务详情事件
    specialTaskDetailsEvent(item,number) {
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        temporaryMessage['selectValue'] = this.selectValue;
        this.storeCleanTaskDetails(temporaryMessage);
        this.$router.push({path: '/specialCleaningTaskDetails'})
    },

    // 巡检任务点击进入任务详情事件
    pollingTaskDetailsEvent(item,number) {
        // 未到开始时间，不能进入任务
        if ( item.state != 3) {
            if (new Date().getTime() < new Date(this.getNowFormatDate(item['startTime'][0])).getTime()) {
                this.$toast({
                    message: '还未到达开始时间,请稍候再试',
                    type: 'fail'
                }); 
                return
            }
        };    
        this.storeCleanTaskDetails(item);
        let temporaryMessage = this.cleanTaskDetails;
        temporaryMessage['num'] = number;
        temporaryMessage['selectValue'] = this.selectValue;
        this.storeCleanTaskDetails(temporaryMessage);
        // 保存当前任务显示时间
        this.storePollingTaskCurrentShowTime(this.disposeTimeTwo(item));
        this.$router.push({path: '/pollingTaskDetails'})
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
    position: relative;
    height: 0;
    .content-top-task-item-name{
        display: flex;
        box-sizing: border-box;
        padding: 10px 0;
        margin: 0 auto;
        width: 92%;
        .forthwithItemStyle {
            background: #289E8E !important;
            border: 1px solid #289E8E;
            color: #fff !important
        };
        .specialItemStyle {
            background: #174E97 !important;
            border: 1px solid #174E97;
            color: #fff !important
        };
        .pollingItemStyle {
            background: #E86F50 !important;
            border: 1px solid #E86F50;
            color: #fff !important
        };
        >div {
            width: 32%;
            height: 32px;
            font-size: 14px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            &:nth-child(1) {
                border: 1px solid #289E8E;
                color: #289E8E;
                margin-right: 2%;
            };
            &:nth-child(2) {
                border: 1px solid #174E97;
                color: #174E97;
                margin-right: 2%;
            };
            &:nth-child(3) {
                border: 1px solid #E86F50;
                color: #E86F50
            }
        }
    };
    .content-top-filtrate {
        width: 100%;
        background: #f8f8f8;
        padding: 8px 0;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .filtrate-box {
            height: 24px;
            display: flex;
            padding: 0 18px;
            box-sizing: border-box;
            justify-content: space-between;
            .select-box {
                height: 24px;
                width: 20%;
                /deep/ .van-dropdown-menu {
                    .van-dropdown-menu__bar {
                        height: 24px !important;
                        box-shadow: none !important;
                        background: none;
                        border-radius: 4px;
                        .van-dropdown-menu__item {
                            justify-content: flex-start !important;
                            .van-dropdown-menu__title {
                                font-size: 12px !important;
                                padding: 0 8px 0 0 !important;
                                color: #101010
                            }
                        };    
                        .van-dropdown-menu__title::after {
                            border-color: transparent transparent #101010 #101010 !important
                        }
                    }
                }
            };
            .search-box {
                height: 24px;
                width: 78%;
                /deep/ .van-cell {
                    line-height: 24px !important;
                    border-radius: 20px;
                    height: 24px;
                    padding: 0 10px !important;
                    .van-cell__value {
                        .van-field__body {
                            .van-field__button {
                                display: flex;
                                align-items: center
                            }
                        }
                    }
                }
            }    
        }
    };
    .content-bottom {
        width: 100%;
        background: #F8F8F8;
        flex: 1;
        padding: 0 6px 6px 6px;
        box-sizing: border-box;
        overflow: auto;
        .task-list-box {
            height: 100%;
            min-height: 600px;
            overflow: auto;
            position: relative;
            /deep/ .van-empty {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%)
            };
            .task-list {
                margin-bottom: 12px;
                border-radius: 4px;
                padding: 0 6px 6px  6px;
                background: #fff;
                box-sizing: border-box;
                box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.23);
                .task-list-title {
                    width: 100%;
                    .bottom-border-1px(rgba(0, 0, 0, 0.23));
                    padding: 10px 6px;
                    box-sizing: border-box;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .task-list-title-left {
                        font-size: 16px;
                        color: #289E8E
                    };
                    .task-list-title-right {
                        width: 61px;
                        height: 27px;
                        text-align: center;
                        font-size: 14px;
                        line-height: 27px;
                        background: #BBBBBB;
                        color: #fff;
                        border-radius: 4px
                    };
                    .forbidStyle {
                        color: #3B9DF9 !important;
                        background: #fff !important;
                        width: auto !important;
                    };
                    .noStartStyle {
                        background: #174E97 !important
                    };
                    .underwayStyle {
                        background: #289E8E !important
                    };
                    .completeStyle {
                        background: #242424 !important
                    };
                    .reviewStyle {
                        background: #F2A15F !important
                    };
                    .haveReviewStyle {
                        background: #9B7D31 !important
                    }
                };
                .task-list-content {
                    width: 100%;
                    padding: 10px 6px;
                    box-sizing: border-box;
                    .one-line {
                        line-height: 28px;
                        word-break: break-all;
                        span {
                        font-size: 14px;
                        &:first-child  {
                                color: #9E9E9A
                        };
                        &:last-child  {
                                color: #101010
                        }
                        }
                    }
                }
            }
        };    
        .special-list {
            .task-list-title {
                .task-list-title-left {
                    color: #174E97
                }
             }    
        };
        .polling-list {
            .task-list-title {
                .task-list-title-left {
                    color: #174E97 !important;
                    flex: 1;
                    word-break: break-all;
                    margin-right: 4px
                };
                .task-list-title-right {
                    width: 61px;
                    height: 27px;
                    text-align: center;
                    font-size: 14px;
                    line-height: 27px;
                    background: #174E97;
                    color: #fff;
                    border-radius: 4px
                }
            };
            .task-list-content {
                width: 100%;
                display: flex;
                padding: 20px 6px;
                box-sizing: border-box;
                justify-content: space-between;
                align-items: center;
                .list-content-left {
                    width: 65%;
                    >div {
                        word-break: break-all;
                        line-height: 18px;
                        >span {
                        font-size: 14px;
                            &:first-child  {
                                color: #9E9E9A
                            };
                            &:last-child  {
                                color: #101010
                            }
                        };
                        &:first-child {
                            margin-bottom: 14px
                        }
                    }
                };
                .list-content-right {
                    width: 35%;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .complete-text {
                        margin-left: 8px;
                        >span {
                        font-size: 12px;
                            &:first-child  {
                                color: #9E9E9A
                            };
                            &:last-child  {
                                color: #1864FF
                            }
                        }
                    }
                }
            }
        }
    }
  }
}
</style>