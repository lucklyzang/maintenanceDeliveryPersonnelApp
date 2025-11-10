<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow" z-index="100000" />
    <van-loading size="35px" vertical color="#e6e6e6" v-show="showLoadingHint">{{loadingContent}}</van-loading>
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
   <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="dispatch-task-title">
      <div class="task-line-one-wrapper">
        <ul class="task-line-one">
          <li :class="{'taskLineOneStyle':taskLlineOneIndex == index}" :key="index" v-for="(item,index) in taskOneList" @click="taskLineOneEvent(item, index)">{{item}}</li>
        </ul>
      </div>
      <div class="status-box" v-show="taskQueryShow == false">
        <p class="task-line-two">
          <span class="state-filter-span">
            状态筛选
          </span>
         </p>
        <p class="status-name-box">
          <van-field v-model="valueStatus" readonly  :right-icon="statusShow == true ? 'arrow-up' : 'arrow-down'" @click="statusShow = true"/>
          <van-popup v-model="statusShow" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @cancel="statusShow = false"
              @confirm="onConfirm"
            />
          </van-popup>
        </p>
      </div>
    </div>
    <van-pull-refresh class="wait-handle-box" v-show="waitHandleBox" v-model="isRefresh" @refresh="onRefresh" success-text="刷新成功">
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == -1 && dispatchTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList"  :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'priorityStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span :class="{'priorityStyle' : item.priority != 1}">{{ priorityTransfer(item.priority) }}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one message-name" v-if="templateType === 'template_one'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientName == "" ? '无' : item.patientName}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one  message-name" v-else-if="templateType === 'template_two'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientInfoList[0].patientName == "" ? '无' : item.patientInfoList[0].patientName}}</span>
                <img :src="contactIsolationPng" v-if="item['patientInfoList'].some((el) => { return el.quarantine == 1})">
              </div>
              <div class="wait-handle-message-one" v-if="templateType === 'template_one'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber == "" ? '无' : item.bedNumber}}</span>
              </div>
              <div class="wait-handle-message-one" v-else-if="templateType === 'template_two'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{ extractBedNumber(item.patientInfoList) }}</span>
              </div>
              <div class="wait-handle-message-two" v-if="templateType === 'template_one'">
                <p>运送类型 : </p>
                <p>{{item.parentTypeName}}-{{item.taskTypeName}}</p>
              </div>
              <div class="wait-handle-message-two" v-else-if="templateType === 'template_two'">
                <p>运送类型 : </p>
                <p>
                  <span>
                    {{extractTransportType(item.patientInfoList)}}
<!--                    {{item.patientInfoList[0].typeList.length == 0  ? '无': item.patientInfoList[0].typeList[0].parentTypeName}}-{{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].taskTypeName}}-->
                  </span>
                </p>
              </div>
            </div>
            <p class="get-wait-task">
              <span v-show="item.state == '1'" @click.stop="getTask(item)">
                获&nbsp;&nbsp;取
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
               <span v-show="item.state == '1' || item.state == '2'" @click.stop="sendBack(item)">
                退&nbsp;&nbsp;回
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-no-get wait-handle-one" v-show="stateIndex == 1 && dispatchTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList"  :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'priorityStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span :class="{'priorityStyle' : item.priority != 1}">{{ priorityTransfer(item.priority) }}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one message-name" v-if="templateType === 'template_one'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientName == "" ? '无' : item.patientName}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one message-name" v-else-if="templateType === 'template_two'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientInfoList[0].patientName == "" ? '无' : item.patientInfoList[0].patientName}}</span>
                <img :src="contactIsolationPng" v-if="item['patientInfoList'].some((el) => { return el.quarantine == 1})">
              </div>
              <div class="wait-handle-message-one" v-if="templateType === 'template_one'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber == "" ? '无' : item.bedNumber}}</span>
              </div>
              <div class="wait-handle-message-one" v-else-if="templateType === 'template_two'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{ extractBedNumber(item.patientInfoList) }}</span>
              </div>
              <div class="wait-handle-message-two" v-if="templateType === 'template_one'">
                <p>运送类型: </p>
                <p>{{item.parentTypeName}}-{{item.taskTypeName}}</p>
              </div>
              <div class="wait-handle-message-two" v-else-if="templateType === 'template_two'">
                <p>运送类型: </p>
                <p>
                   <span>
                      {{extractTransportType(item.patientInfoList)}}
<!--                    {{item.patientInfoList[0].typeList.length == 0  ? '无': item.patientInfoList[0].typeList[0].parentTypeName}}-{{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].taskTypeName}}-->
                  </span>
                </p>
              </div>
            </div>
            <p class="get-wait-task">
              <span v-show="item.state == '1'" @click.stop="getTask(item)">
                获&nbsp;&nbsp;取
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2'" @click.stop="sendBack(item)">
                退&nbsp;&nbsp;回
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-get wait-handle-one" v-show="stateIndex == 2 && dispatchTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'priorityStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span :class="{'priorityStyle' : item.priority != 1}">{{ priorityTransfer(item.priority) }}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one message-name" v-if="templateType === 'template_one'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientName == "" ? '无' : item.patientName}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one message-name" v-else-if="templateType === 'template_two'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientInfoList[0].patientName == "" ? '无' : item.patientInfoList[0].patientName}}</span>
                <img :src="contactIsolationPng" v-if="item['patientInfoList'].some((el) => { return el.quarantine == 1})">
              </div>
              <div class="wait-handle-message-one" v-if="templateType === 'template_one'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber == "" ? '无' : item.bedNumber}}</span>
              </div>
              <div class="wait-handle-message-one" v-else-if="templateType === 'template_two'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{ extractBedNumber(item.patientInfoList) }}</span>
              </div>
              <div class="wait-handle-message-two" v-if="templateType === 'template_one'">
                <p>运送类型 : </p>
                <p>{{item.parentTypeName}}-{{item.taskTypeName}}</p>
              </div>
              <div class="wait-handle-message-two" v-else-if="templateType === 'template_two'">
                <p>运送类型 : </p>
                <p>
                   <span>
                      {{extractTransportType(item.patientInfoList)}}
<!--                    {{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].parentTypeName}}-{{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].taskTypeName}}-->
                  </span>
                </p>
              </div>
            </div>
            <p class="get-wait-task">
              <span v-show="item.state == '1'" @click.stop="getTask(item)">
                获&nbsp;&nbsp;取
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2'" @click.stop="sendBack(item)">
                退&nbsp;&nbsp;回
              </span>
            </p>
          </div>
        </div>
      </div>
      <div class="state-filter-going wait-handle-one" v-show="stateIndex == 3 && dispatchTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList"  :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'priorityStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span :class="{'priorityStyle' : item.priority != 1}">{{ priorityTransfer(item.priority) }}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-one message-name">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one message-name" v-if="templateType === 'template_one'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientName == "" ? '无' : item.patientName}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one" v-else-if="templateType === 'template_two'">
                <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
                <span>{{item.patientInfoList[0].patientName == "" ? '无' : item.patientInfoList[0].patientName}}</span>
                <img :src="contactIsolationPng" v-if="item['patientInfoList'].some((el) => { return el.quarantine == 1})">
              </div>
              <div class="wait-handle-message-one" v-if="templateType === 'template_one'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber == "" ? '无' : item.bedNumber}}</span>
              </div>
              <div class="wait-handle-message-one" v-else-if="templateType === 'template_two'">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{ extractBedNumber(item.patientInfoList) }}</span>
              </div>
              <div class="wait-handle-message-two" v-if="templateType === 'template_one'">
                <p>运送类型 : </p>
                <p>{{item.parentTypeName}}-{{item.taskTypeName}}</p>
              </div>
              <div class="wait-handle-message-two" v-else-if="templateType === 'template_two'">
                <p>运送类型 : </p>
                <p>
                  <span>
                     {{extractTransportType(item.patientInfoList)}}
<!--                    {{item.patientInfoList[0].typeList.length == 0  ? '无': item.patientInfoList[0].typeList[0].parentTypeName}}-{{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].taskTypeName}}-->
                  </span>
                </p>
              </div>
            </div>
            <p class="get-wait-task">
              <span v-show="item.state == '1'" @click.stop="getTask(item)">
                获&nbsp;&nbsp;取
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2'" @click.stop="sendBack(item)">
                退&nbsp;&nbsp;回
              </span>
            </p>
          </div>
        </div>
      </div>
    </van-pull-refresh>
    <div class="task-query wait-handle task-complete" v-show="taskQueryShow">
      <div class="content-middle-top">
        <span class="time-between">至</span>
        <div class="content-middle-top-content">
          <div style="left:0">
            <van-field v-model="startTime" placeholder="开始日期" readonly="readonly" @click="startTimePop = true" right-icon="newspaper-o"/>
          </div>
          <div style="right:0">
            <van-field v-model="endTime" placeholder="结束日期" readonly="readonly" @click="endTimePop = true" right-icon="newspaper-o"/>
          </div>
        </div>
        <van-popup v-model="startTimePop" label="离开时间" position="bottom" :overlay="true">
          <van-datetime-picker  v-model="currentDateStart"  type="date"  :min-date="minDateStart"
          @cancel="startTimePop = false"  @confirm="confirmEvent" @change="startTimeChange"/>
        </van-popup>
        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true">
          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
          @cancel="endTimePop = false"  @confirm="endConfirmEvent"  @change="endTimeChange"/>
        </van-popup>
      </div>
      <div class="content-top-time-fask">
        <span v-for="(item,index) in timeList" :key="index" :class="{timeFastStyle: timeFastindex === index}" @click="timeFasleEvent(item,index)">{{item}}</span>
      </div>
      <div class="task-status-list">
        <div class="wait-handle-list" v-for="(item,index) in stateCompleteList"  :key="`${item}-${index}`">
          <p class="list-status">
            <img :src="stateTransferImg(item.state)" alt="">
          </p>
          <div class="wait-handle-message">
            <div class="wait-handle-message-one">
              <span :class="{'priorityStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
              <span :class="{'priorityStyle' : item.priority != 1}">{{ priorityTransfer(item.priority) }}</span>
            </div>
            <!-- <div class="wait-handle-message-one contact-isolation-box">
              <span>接触隔离 : </span>
              <span>是</span>
            </div> -->
            <div class="wait-handle-message-one">
              <span>开始时间 : </span>
              <span>{{item.planStartTime}}</span>
            </div>
            <div class="wait-handle-message-one">
              <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
              <span>{{item.setOutPlaceName}}</span>
            </div>
            <div class="wait-handle-message-one message-name" v-if="templateType === 'template_one'">
              <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
              <span>{{item.patientName == "" ? '无' : item.patientName}}</span>
              <img :src="contactIsolationPng" v-if="item.quarantine == 1">
            </div>
            <div class="wait-handle-message-one message-name" v-else-if="templateType === 'template_two'">
              <span>姓&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;名 : </span>
              <span>{{item.patientInfoList[0].patientName == "" ? '无' : item.patientInfoList[0].patientName}}</span>
              <img :src="contactIsolationPng" v-if="item['patientInfoList'].some((el) => { return el.quarantine == 1})">
            </div>
            <div class="wait-handle-message-one" v-if="templateType === 'template_one'">
              <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
              <span>{{item.bedNumber == "" ? '无' : item.bedNumber}}</span>
            </div>
            <div class="wait-handle-message-one" v-else-if="templateType === 'template_two'">
              <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
              <span>{{ extractBedNumber(item.patientInfoList) }}</span>
            </div>
            <div class="wait-handle-message-two" v-if="templateType === 'template_one'">
              <p>运送类型 : </p>
              <p>{{item.parentTypeName}}-{{item.taskTypeName}}</p>
            </div>
            <div class="wait-handle-message-two" v-else-if="templateType === 'template_two'">
              <p>运送类型 : </p>
              <p>
                   <span>
                      {{extractTransportType(item.patientInfoList)}}
<!--                    {{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].parentTypeName}}-{{item.patientInfoList[0].typeList.length == 0 ? '无': item.patientInfoList[0].typeList[0].taskTypeName}}-->
                  </span>
              </p>
            </div>
          </div>
          <p class="get-wait-task">
              <span v-show="item.state == '1'" @click.stop="getTask(item)">
                获&nbsp;&nbsp;取
              </span>
            <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
            <span v-show="item.state == '1' || item.state == '2'" @click.stop="sendBack(item)">
                退&nbsp;&nbsp;回
              </span>
          </p>
        </div>
      </div>
    </div>
    <van-dialog v-model="toolShow" title="请选择退回原因" show-cancel-button width="92%"
          @confirm="toolSure" @cancel="toolCancel"
        >
          <div class="tool-name-list">
            <div class="tool-name-list-content">
              <span :class="{spanStyle:toolIndex === index}" v-for="(item,index) in vehicleOperationList" :key="`${item}-${index}`" @click="toolCheck(item,index)">
                {{item.text}}
              </span>
            </div>
          </div>
    </van-dialog>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {userSignOut} from '@/api/login.js'
  import {getDispatchTaskMessage, getDispatchTaskComplete, querySendBackDispatchTaskReason, updateDispatchTask, getDispatchTask, sendBackDispatchTask, queryAppointTaskSendbackReason} from '@/api/trans/workerPort.js'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import { mapGetters, mapMutations } from 'vuex'
  import store from '@/store'
  import SOtime from '@/common/js/SOtime.js'
  import { formatTime, setStore, getStore, IsPC, removeAllLocalStorage, checkEmptyArray } from '@/common/js/utils'
  export default {
    name: 'dispatchTask',
    data () {
      return {
        value:0,
        taskId: '',
        showLoadingHint: false,
        loadingContent: '加载中,请稍候···',
        overlayShow: false,
        noDataShow: false,
        stateListShow: false,
        dispatchTaskListShow: false,
        timeFastindex: '',
        stateIndex: -1,
        columns: ['全部','未获取','已获取', '进行中'],
        timeList: ['近一周','近一月','近三月'],
        valueStatus: '全部',
        startTime: '',
        statusShow: false,
        endTime: '',
        toolIndex: '',
        toolText: '',
        toolShow: false,
        toolName: '',
        toolValue: '',
        vehicleOperationList: [],
        startTimePop: false,
        endTimePop: false,
        currentDateStart: new Date(),
        currentDateEnd: new Date(),
        minDateStart: new Date(2020, 0, 1),
        minDateEnd: new Date(2020, 0, 1),
        stateFilterList: [],
        leftDropdownDataList: ['退出登录'],
        leftDownShow: false,
        liIndex: null,
        taskOneList: ['待办任务', '历史任务'],
        taskLlineOneIndex: '0',
        checkPerson: 0,
        stateCompleteList: [],
        cancelTaskIdList : [],
        transferTaskIdList : [],
        cancelTask: false,
        transferTask: false,
        taskQueryShow: false,
        waitHandleCheck: true,
        waitHandleBox: true,
        isRefresh: false,
        waitBaskList: [],
        tempFlagId: '',
        taskGetPng: require('@/components/images/task-get.png'),
        taskSearchPng: require('@/components/images/task-search.png'),
        noEndPng: require('@/common/images/home/no-end.png'),
        noReferPng: require('@/common/images/home/no-refer.png'),
        noStartPng: require('@/common/images/home/no-start.png'),
        taskFinshedPng: require('@/common/images/home/task-finshed.png'),
        taskGoingPng: require('@/common/images/home/task-going.png'),
        taskCancelPng: require('@/common/images/home/task-cancel.png'),
        waitSurePng: require('@/common/images/home/wait-sure.png'),
        contactIsolationPng: require("@/common/images/home/contact-isolation.png")
      };
    },

    components: {
      HeaderTop,
      NoData,
      Loading,
      FooterBottom
    },

    computed: {
      ...mapGetters([
        'navTopTitle',
        'isRefershDispatchTaskPage',
        'userInfo',
        'globalTimer',
        'isFreshDispatchTaskPage',
        'catch_components',
        'templateType',
        'chooseHospitalArea',
        'projectGlobalTimer',
        'globalTimer',
        'equipmentPatrolGlobalTimer',
        'securityPatrolGlobalTimer'
      ]),
      sex () {
        return this.userInfo['worker']['extendData']['sex']
      },
      workerName() {
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

    watch : {
    },

    beforeRouteEnter (to, from, next){
      let catch_components = store.state.catchComponent.catch_components;
      let i = catch_components.indexOf('dispatchTask');
      i === -1 && catch_components.push('dispatchTask');
      next();
    },

    beforeRouteLeave(to, from, next) {
      let catch_components = this.catch_components;
      if (to.name !== 'dispatchDetails'){
        let i = catch_components.indexOf('dispatchTask');
        i > -1 && this.changeCatchComponent([]);
      }
      next()
    },

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'transHome'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送')
        })
      };
      document.addEventListener('click', (e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询调度任务(分配给自己的)
      this.queryStateFilterDispatchTask(this.proId, this.workerId, this.stateIndex)

    },

    activated () {
      // 控制设备物理返回案件测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'transHome'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送')
        })
      };
      document.addEventListener('click', (e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询调度任务(分配给自己的)
      if (this.isFreshDispatchTaskPage) {
        this.queryStateFilterDispatchTask(this.proId, this.workerId, -1)
      }
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeDispatchTaskMessage',
        'changedispatchTaskTransferIdList',
        'changedispatchTaskCancelIdList',
        'changeDispatchTaskDepartmentType',
        'changeDispatchTaskState',
        'changeIsCoerceTakePhoto',
        'changeIsBack',
        'changeIsSign',
        'changeIsSingleDestination',
        'changeTaskDetailsMessage',
        'changeTaskType',
        'changeOverDueWay',
        'changeDispatchTaskId',
        'changeCatchComponent'
      ]),

      startTimeChange(e) {
        let startTimeArr = e.getValues();//["2019", "03", "22", "17", "28"]
        this.startTime = `${startTimeArr[0]}-${startTimeArr[1]}-${startTimeArr[2]}`
      },

      endTimeChange(e) {
        let endTimeArr = e.getValues();//["2019", "03", "22", "17", "28"]
        this.endTime = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}`
      },

      // 初始化时间显示框
      initDate () {
        let currentDateList = formatTime('YYYY-MM-DD').split('-');
        this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
        this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
      },

      // 开始时间确定事件
      confirmEvent () {
        this.startTimePop = false;
        if (SOtime.time6(this.endTime) < SOtime.time6(this.startTime)) {
          this.$toast({
            message: `结束日期不能小于开始日期`,
            type: 'fail'
          });
          return
        };
        this.searchCompleteTask()
      },

      // 结束时间确定事件
      endConfirmEvent () {
        this.endTimePop = false;
        if (SOtime.time6(this.endTime) < SOtime.time6(this.startTime)) {
          this.$toast({
            message: `结束日期不能小于开始日期`,
            type: 'fail'
          });
          return
        };
        this.searchCompleteTask()
      },

      // 搜索完成的任务
      searchCompleteTask () {
        this.queryCompleteDispatchTask({proId:this.proId, workerId:this.workerId,state:7, startDate: this.startTime, endDate: this.endTime})
      },

      // 状态框确定事件
      onConfirm(value) {
        this.valueStatus = value;
        this.statusShow = false;
        this.stateIndex = this.stateTransfernumber(value);
        this.stateListEvent(this.stateIndex)
      },

    // 查询调度任务(状态筛选点击专用)
      queryStateFilterDispatchTask (proID, workerId, index) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        this.loadingContent = '加载中,请稍候···';
        this.overlayShow = true;
        getDispatchTaskMessage (proID, workerId,index)
        .then((res) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false;
          let temporaryTaskListFirst = [];
          this.stateFilterList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.dispatchTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
                if (this.templateType === 'template_one') {
                  temporaryTaskListFirst.push({
                    createTime: item.createTime,
                    planUseTime: item.planUseTime,
                    planStartTime: item.planStartTime,
                    state: item.state,
                    setOutPlaceName: item.setOutPlaceName,
                    setOutPlaceId: item.setOutPlaceId,
                    parentTypeName: item.parentTypeName,
                    destinationName: item.destinationName,
                    destinationId: item.destinationId,
                    taskTypeName: item.taskTypeName,
                    toolName: item.toolName,
                    priority: item.priority,
                    id: item.id,
                    patientName: item.patientName,
                    bedNumber: item.bedNumber,
                    startPhoto: item.startPhoto,
                    endPhoto: item.endPhoto,
                    isBack: item.isBack,
                    isSign: item.isSign,
                    quarantine: item.quarantine,
                    number: item.number,
                    actualCount: item.actualCount,
                    distName: item.distName,
                    hasSanOut: item.hasSanOut,
                    tempFlag: item.tempFlag
                  })
                } else if (this.templateType === 'template_two') {
                  temporaryTaskListFirst.push({
                    createTime: item.createTime,
                    planUseTime: item.planUseTime,
                    planStartTime: item.planStartTime,
                    state: item.state,
                    setOutPlaceName: item.setOutPlaceName,
                    setOutPlaceId: item.setOutPlaceId,
                    toolName: item.toolName,
                    priority: item.priority,
                    id: item.id,
                    startPhoto: item.startPhoto,
                    endPhoto: item.endPhoto,
                    isBack: item.isBack,
                    isSign: item.isSign,
                    number: item.number,
                    actualCount: item.actualCount,
                    distName: item.distName,
                    destinations: item.destinations,
                    hasSanOut: item.hasSanOut,
                    patientInfoList: item.patientInfoList,
                    tempFlag: null
                  })
                }
              };
              if (index == -1) {
                this.stateFilterList = temporaryTaskListFirst;
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                }
              } else if (index == 1) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 1});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                }
              } else if (index == 2) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 2});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                }
              } else if (index == 3) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 3});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                }
              }
            } else {
              this.dispatchTaskListShow = false;
              this.noDataShow = true
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.dispatchTaskListShow = false
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.dispatchTaskListShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false
        })
      },

      // 下拉刷新
      onRefresh () {
        this.queryStateFilterDispatchTask(this.proId, this.workerId, this.stateIndex)
      },

      // 查询调度任务(已完成)
      queryCompleteDispatchTask (data) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        this.loadingContent = '加载中,请稍候···';
        this.overlayShow = true;
        getDispatchTaskComplete(data).then((res) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false;
          this.stateCompleteList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.dispatchTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
                if (this.templateType === 'template_one') {
                  this.stateCompleteList.push({
                    createTime: item.createTime,
                    planUseTime: item.planUseTime,
                    planStartTime: item.planStartTime,
                    state: item.state,
                    setOutPlaceName: item.setOutPlaceName,
                    destinationName: item.destinationName,
                    taskTypeName: item.taskTypeName,
                    toolName: item.toolName,
                    priority: item.priority,
                    id: item.id,
                    parentTypeName: item.parentTypeName,
                    finishTime: item.finishTime,
                    patientName: item.patientName,
                    bedNumber: item.bedNumber,
                    startPhoto: item.startPhoto,
                    endPhoto: item.endPhoto,
                    isBack: item.isBack,
                    isSign: item.isSign,
                    quarantine: item.quarantine,
                    number: item.number,
                    actualCount: item.actualCount,
                    distName: item.distName,
                    tempFlag: item.tempFlag
                  })
                } else if (this.templateType === 'template_two') {
                  this.stateCompleteList.push({
                    createTime: item.createTime,
                    planUseTime: item.planUseTime,
                    planStartTime: item.planStartTime,
                    state: item.state,
                    setOutPlaceName: item.setOutPlaceName,
                    setOutPlaceId: item.setOutPlaceId,
                    toolName: item.toolName,
                    priority: item.priority,
                    id: item.id,
                    startPhoto: item.startPhoto,
                    endPhoto: item.endPhoto,
                    isBack: item.isBack,
                    isSign: item.isSign,
                    number: item.number,
                    actualCount: item.actualCount,
                    distName: item.distName,
                    destinations: item.destinations,
                    hasSanOut: item.hasSanOut,
                    patientInfoList: item.patientInfoList,
                    tempFlag: null
                  })
                }
              };
              console.log('完成',this.stateCompleteList);
            } else {
              this.dispatchTaskListShow = false;
              this.noDataShow = true
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.dispatchTaskListShow = false
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.dispatchTaskListShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false
        })
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.showLoadingHint = true;
        this.loadingContent = '签退中,请稍候···';
        this.overlayShow = true;
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            if(this.globalTimer) {window.clearInterval(this.globalTimer)};
            // 退出信标服务器连接
            // try {
            //   window.android.logOut()
            // } catch (err) {
            //   this.$dialog.alert({
            //     message: `${err}`,
            //     closeOnPopstate: true
            //   }).then(() => {
            //   })
            // };
            if(this.projectGlobalTimer) {window.clearInterval(this.projectGlobalTimer)};
						if(this.globalTimer) {window.clearInterval(this.globalTimer)};
						if(this.equipmentPatrolGlobalTimer) {window.clearInterval(this.equipmentPatrolGlobalTimer)};
						if(this.securityPatrolGlobalTimer) {window.clearInterval(this.securityPatrolGlobalTimer)};
						removeAllLocalStorage();
						store.dispatch('resetAutoRepairTaskStore');
						store.dispatch('resetLoginState');
						store.dispatch('resetCleanManagementStore');
						store.dispatch('resetEquipmentPatroLoginStateEvent');
						store.dispatch('resetPatrolTaskStore');
						store.dispatch('resetSpotCheckTaskStore');
						store.dispatch('resetSpotTaskDispatchingManagementStore');
						store.dispatch('resetDepartmentServiceStateEvent');
						store.dispatch('resetDeviceServiceStateEvent');
						store.dispatch('resetRepairsWorkOrderStateEvent');
						store.dispatch('resetTaskSchedulingStateEvent');
						store.dispatch('resetTransAppointTaskStateEvent');
						store.dispatch('resetTransCatchComponentsStateEvent');
						store.dispatch('resetTransCirculationTaskStateEvent');
						store.dispatch('resetTransDispatchTaskStateEvent');
						store.dispatch('resetTransMedicalTaskStateEvent');
						store.dispatch('resetTransTaskSchedulingStateEvent');
						store.dispatch('resetTransTransLoginStateEvent');
						store.dispatch('resetRegisterStore');
						store.dispatch('resetGuestbookStore');
						store.dispatch('resetSecurityPatrolLoginState');
						store.dispatch('resetSecurityPatrolTaskStore');
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
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 任务状态转换图片
      stateTransferImg (index) {
        switch(index) {
          case 1 :
            return this.noReferPng
            break;
          case 2 :
            return  this.noStartPng
            break;
          case 3 :
            return  this.taskGoingPng
            break;
          case 4 :
            return  this.noEndPng
            break;
          case 6 :
            return this.taskCancelPng
            break;
          case 7 :
            return  this.taskFinshedPng
            break;
        }
      },

      // 任务优先级转换
      priorityTransfer (index) {
        switch(index) {
          case 1 :
            return '正常'
            break;
          case 2 :
            return '重要'
            break;
          case 3 :
            return '紧急'
            break;
          case 4 :
            return '紧急重要'
            break;
        }
      },

      // 任务状态转换
      stateTransfernumber (item) {
        switch(item) {
          case '全部' :
            return -1
            break;
          case '未获取' :
            return 1
            break;
          case '已获取' :
            return 2
            break;
          case '进行中' :
            return 3
            break;
        }
      },

      // 任务状态转换
      stateTransfer (index) {
        switch(index) {
          case 0 :
            return '未分配'
            break;
          case 1 :
            return '待确认'
            break;
          case 2 :
            return '未开始'
            break;
          case 3 :
            return '进行中'
            break;
          case 4 :
            return '未结束'
            break;
          case 5 :
            return '已延迟'
            break;
          case 6 :
            return '已取消'
            break;
          case 7 :
            return '已完成'
            break;
        }
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      // 返回上一页
      backTo () {
        this.$router.push({path: 'transHome'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 调度任务第一行按钮点击
      taskLineOneEvent (item,index) {
        this.taskLlineOneIndex = index;
        this.stateListShow = false;
        this.transferTask = false;
        this.cancelTask = false;
        this.noDataShow = false;
        if (index == '0') {
          this.stateIndex = -1;
          this.valueStatus = '全部';
          this.waitHandleBox = true;
          this.taskQueryShow = false;
          this.queryStateFilterDispatchTask(this.proId, this.workerId, this.stateIndex)
        } else if (index == '1') {
          this.timeFastindex = '';
          this.stateIndex = null;
          this.taskQueryShow = true;
          this.waitHandleBox = false;
          this.initDate();
          this.queryCompleteDispatchTask({proId:this.proId, workerId:this.workerId,state:7, startDate: this.startTime, endDate: this.endTime})
        }
      },

      // 时间查询快捷键点击事件
      timeFasleEvent (item,index) {
        this.timeFastindex = index;
        let dateList = formatTime('YYYY-MM-DD').split('-');
        let endDate = `${dateList[0]}-${dateList[1]}-${dateList[2]}`
        let startDate = '';
        if (item == '近一周') {
          startDate = this.$moment().subtract(1, 'weeks').format('YYYY-MM-DD')
        } else if (item == '近一月') {
          startDate = this.$moment().subtract(1, 'months').format('YYYY-MM-DD')
        } else if (item == '近三月') {
          startDate = this.$moment().subtract(3, 'months').format('YYYY-MM-DD')
        };
        this.queryCompleteDispatchTask({proId: this.proId, workerId: this.workerId, state: 7,
          startDate: startDate,endDate: endDate})
      },

      // 状态筛选列表点击
      stateListEvent (index) {
        this.queryStateFilterDispatchTask(this.proId, this.workerId, index)
      },

      // 退回接口
      sendBack (item) {
        this.taskId = item.id;
        this.toolShow = true;
        this.tempFlagId = this.templateType == 'template_one' ? item.tempFlag : null;
        queryAppointTaskSendbackReason({proId:this.proId,state: 0, type: 1})
        .then((res) => {
          this.vehicleOperationList = [];
          if (res && res.data.code == 200) {
            if (res.data.data && res.data.data.length > 0) {
              for (let item of res.data.data) {
                this.vehicleOperationList.push({
                  text: item.undoName,
                  value: item.id
                })
              }
            } else {
              this.$toast('没有查到退回原因');
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        });
        this.toolIndex = ''
      },

      // 退回原因选中点击事件
      toolCheck (item, index) {
        this.toolIndex = index;
        this.toolText = item.text;
        this.toolName = item.text
        this.toolValue = item.value
      },

      // 退回原因弹框确认事件
      toolSure () {
        if (this.toolIndex === '') {
          this.$toast('请选择退回原因');
          return
        };
        this.showLoadingHint = true;
        this.loadingContent = '退回中,请稍候···';
        this.overlayShow = true;
        sendBackDispatchTask(this.proId,this.taskId,this.toolText,this.tempFlagId)
        .then((res) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.msg}`);
            this.queryStateFilterDispatchTask(this.proId, this.workerId, this.stateIndex)
          }
        })
        .catch((err) => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 提取靠前的运送类型
      extractTransportType (transParent) {
        if (transParent.length == 0) { return "无-无"};
        let temporaryParentTypeName = transParent[0]['typeList'][0]['parentTypeName'];
        let temporaryTaskTypeName = [];
        for (let i = 0, len = transParent.length; i < len; i++) {
          if  (transParent[i]['typeList'].length == 0) {continue};
          for (let innerI = 0, innerlen = transParent[i]['typeList'].length; innerI < innerlen; innerI++) {
            temporaryTaskTypeName.push(transParent[i]['typeList'][innerI]['taskTypeName'])
          }
        };
        temporaryParentTypeName = !temporaryParentTypeName ? '无' : temporaryParentTypeName;
        return `${temporaryParentTypeName} - ${(checkEmptyArray(temporaryTaskTypeName)).join("、")}`
      },

      // 提取床号
      extractBedNumber (patientInfoList) {
        if (patientInfoList.length == 0) { return "无"};
        let temporaryArr = [];
        for (let item of patientInfoList) {
          temporaryArr.push(item.bedNumber)
        };
        return temporaryArr.join("、")
      },

      // 退回原因取消事件
      toolCancel () {
        this.toolIndex = '';
        this.toolName = '';
        this.toolShow = false
      },

      // 点击具体任务事件
      intoTask (item) {
        if (item.state !== 1 && item.state !== 7) {
          //是否需要返回出发地
          this.changeIsBack(item.isBack);
          //是否需要签字
          this.changeIsSign(item.isSign);
          //判断是否为单一目的地
          if (this.templateType == 'template_one') {
            if (item.destinationName == "") {
              this.changeIsSingleDestination(false)
            } else {
              this.changeIsSingleDestination(true)
            }
          }  else if (this.templateType == 'template_two') {
            if (item.destinations.length > 1 || item.destinations.length == 0) {
              this.changeIsSingleDestination(false)
            } else {
              this.changeIsSingleDestination(true)
            }
          }
        };
        //储存任务id状态
        this.changeDispatchTaskId(item.id);
        this.$router.push({'path':'/dispatchDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情');
        // 改变调度具体某一任务的信息状态
        this.changeDispatchTaskMessage({DtMsg: item});
        setStore('currentDispatchTaskMessage',item);
      },

      // 获取待处理任务事件
      getTask (item) {
        this.showLoadingHint = true;
        this.loadingContent = '获取中,请稍候···';
        this.overlayShow = true;
        getDispatchTask(item.id,this.workerId,item.tempFlag)
        .then(res => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.queryStateFilterDispatchTask(this.proId, this.workerId, this.stateIndex)
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            })
          }
        })
        .catch(err => {
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      }
    }
}

</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    /deep/ .van-loading {
      z-index: 200000
    };
    /deep/ .van-dialog {
      .van-dialog__content {
        margin-bottom: 6px;
        height: 200px;
        margin: 10px 0;
        .tool-name-list {
          width: 94%;
          height: 100%;
          overflow: auto;
          margin: 0 auto;
          padding: 0;
          .tool-name-list-content {
            padding: 6px;
            .spanStyle {
              color: #2895ea;
              background: #fff;
              border: 1px solid #2895ea
            }
            span {
              display: inline-block;
              width: 48%;
              height: 40px;
              text-align: center;
              margin-bottom: 8px;
              border-radius: 20px;
              line-height: 40px;
              background: #f3f3f3;
              margin-right: 3%;
              &:nth-child(even) {
                margin-right: 0
              }
            }
          }
        }
      }
    };
    .content-wrapper();
    position: relative;
    font-size: 14px;
    .no-data {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2000;
      left: 0;
      width: 100%;
      text-align: center;
    };
    .left-dropDown {
      .rightDropDown
    }
    .dispatch-task-title {
        .task-line-one-wrapper {
          font-size: 17px;
          height: 36px;
        .task-line-one {
          width: 80%;
          margin: 0 auto;
          .taskLineOneStyle {
            color: black;
            border-bottom: 2px solid #2895ea
          }
          li {
            display: inline-block;
            margin-top: 1px;
            color: #999999;
            width: 46%;
            height: 36px;
            line-height: 36px;
            text-align: center
          }
        };
      }
      .status-box {
        display: flex;
        box-sizing: border-box;
        padding: 0 10px;
        width: 100%;
        flex-flow: row nowrap;
        margin-top: 6px;
        height: 60px;
        justify-content: space-between;
        align-items: center;
        background: #f6f6f6;
        .task-line-two {
          height: 40px;
          width: 80px;
          font-size: 0;
          box-sizing: border-box;
          color: black;
          span {
            font-size: 15px;
            height: 40px;
            display: inline-block;
            text-align: center;
            line-height: 40px;
            border-right: 1px solid #dedada;
            &:last-child {
              border-right: none
            }
          }
        }
        .status-name-box {
          font-size: 18px;
          flex: 1;
          /deep/ .van-cell {
            border-radius: 8px;
            color: black
          }
        }
      }
      .task-operate-box {
        height: 40px;
        line-height: 30px;
        padding-left: 10px;
        span {
          font-size: 13px;
          display: inline-block;
          margin-top: 5px;
          width: 70px;
          height: 30px;
          color: #fff;
          background: #2895ea;
          text-align: center;
          border-radius: 2px
        }
      }
    };
    .wait-handle-box {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
      background: #f6f6f6;
      .wait-handle-one {
        .wait-handle-list {
          box-sizing: border-box;
          position: relative;
          width: 94%;
          margin:0 auto;
          background: #fff;
          padding: 10px;
          margin-bottom: 10px;
          box-sizing: border-box;
          .list-status {
            width: 80px;
            height: 30px;
            position: absolute;
            text-align: center;
            line-height: 30px;
            top: 8px;
            right: -12px;
            img {
              width: 100%;
              height: 100%
            }
          }
          .listStatusStyleOne {
            color: red
          }
          .listStyleStatusTwo {
            color: #85dc85
          }
          .wait-handle-message {
            font-size: 16px;
            padding: 14px 0;
            box-sizing: border-box;
            .wait-handle-message-top {
              height: 60px;
              border-left: 6px solid #2895ea;
              span {
                display: inline-block;
                width: 75%;
                padding-left: 5px;
                height: 28px;
                box-sizing: border-box;
                &:first-child {
                  margin-bottom: 10px;
                  overflow: auto
                }
              }
            };
            .wait-handle-message-top-two {
              height: 54px;
              border-left: 6px solid #2895ea;
              p {
                display: inline-block;
                width: 75%;
                height: 20px;
                overflow: auto;
                padding-left: 5px;
                box-sizing: border-box;
                &:first-child {
                  margin-bottom: 15px
                }
              }
            };
            .wait-handle-message-one {
              line-height: 24px;
              min-height: 35px;
              margin-left: -4px;
              span {
                display: inline-block;
                padding-left: 5px;
                box-sizing: border-box;
                color: #a0a0a0;
                &:first-child {
                  vertical-align: top;
                };
                &:last-child {
                  width: 70%;
                  word-break: break-all;
                  color: black;
                }
              };
              .priorityStyle {
                color: red !important;
                font-weight: bold !important
              };
              p {
                display: inline-block;
                span {
                  color: black !important
                }
              }
            };
            .message-name {
              display: flex;
              >span {
                &:nth-child(2) {
                  padding: 0 5px 0 10px;
                  box-sizing: border-box;
                  flex: 1;
                  color: black;
                  word-break: break-all
                }
              };
              img {
                width: 27px;
                height: 27px;
                vertical-align: bottom
              }
            };
            .wait-handle-message-two {
              min-height: 35px;
              line-height: 24px;
              margin-left: -4px;
              p {
                display: inline-block;
                padding-left: 5px;
                box-sizing: border-box;
                color: #a0a0a0;
                &:first-child {
                  vertical-align: top;
                };
                &:last-child {
                  width: 70%;
                  color: black;
                  word-break: break-all
                }
              }
            }
          };
          .get-wait-task {
            margin-top: 4px;
            width: 100%;
            text-align: center;
            span {
              vertical-align: top;
              display: inline-block;
              width: 120px;
              background: #1b88ff;
              line-height: 35px;
              height: 35px;
              font-size: 15px;
              color: #fff;
              margin-right: 20px;
              border-radius: 20px;
              &:last-child {
                margin-right: 0;
                color: #1b88ff;
                background: #fff;
                border: 1px solid #1b88ff;
                text-align: center
              }
            }
          }
        }
      };
    };
    .wait-handle, .task-query, .status-handle-screen {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
    };
    .wait-handle {
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        width: 94%;
        margin:0 auto;
        background: #fff;
        padding: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
        .list-status {
          width: 80px;
          height: 30px;
          position: absolute;
          text-align: center;
          line-height: 30px;
          top: 8px;
          right: -12px;
          img {
            width: 100%;
            height: 100%
          }
        }
        .listStatusStyleOne {
          color: red
        }
        .listStyleStatusTwo {
          color: #85dc85
        }
        .wait-handle-message {
          font-size: 16px;
          padding: 14px 0;
          box-sizing: border-box;
          .wait-handle-message-top {
            height: 60px;
            border-left: 6px solid #2895ea;
            span {
              display: inline-block;
              width: 75%;
              padding-left: 5px;
              height: 28px;
              box-sizing: border-box;
              &:first-child {
                margin-bottom: 10px;
                overflow: auto
              }
            }
          };
          .wait-handle-message-top-two {
            height: 54px;
            border-left: 6px solid #2895ea;
            p {
              display: inline-block;
              width: 75%;
              height: 20px;
              overflow: auto;
              padding-left: 5px;
              box-sizing: border-box;
              &:first-child {
                margin-bottom: 15px
              }
            }
          };
          .wait-handle-message-one {
            line-height: 24px;
            min-height: 35px;
            margin-left: -4px;
            span {
              display: inline-block;
              padding-left: 5px;
              box-sizing: border-box;
              color: #a0a0a0;
              &:first-child {
                vertical-align: top;
              };
              &:last-child {
                width: 70%;
                word-break: break-all;
                color: black;
              }
            };
            .priorityStyle {
              color: red !important;
              font-weight: bold !important
            };
            p {
              display: inline-block;
              span {
                color: black !important
              }

            }
          };
          .message-name {
            display: flex;
            >span {
              &:nth-child(2) {
                padding: 0 5px 0 10px;
                box-sizing: border-box;
                flex: 1;
                color: black;
                word-break: break-all
              }
            };
            img {
              width: 27px;
              height: 27px;
              vertical-align: bottom
            }
          };
          .wait-handle-message-two {
            min-height: 35px;
            line-height: 24px;
            margin-left: -4px;
            p {
              display: inline-block;
              padding-left: 5px;
              box-sizing: border-box;
              color: #a0a0a0;
              &:first-child {
                vertical-align: top;
              };
              &:last-child {
                width: 70%;
                word-break: break-all;
                color: black;
              }
            }
          }
        };
        .get-wait-task {
          margin-top: 4px;
          width: 100%;
          text-align: center;
          span {
            vertical-align: top;
            display: inline-block;
            width: 120px;
            background: #1b88ff;
            line-height: 35px;
            height: 35px;
            font-size: 15px;
            color: #fff;
            margin-right: 20px;
            border-radius: 20px;
            &:last-child {
              margin-right: 0;
              color: #1b88ff;
              background: #fff;
              border: 1px solid #1b88ff;
              text-align: center
            }
          }
        }
      }
    };
    .task-complete {
      display: flex;
      flex-direction: column;
      background: #f6f6f6;
      margin-top: 4px;
      .content-middle-top {
        background: #f6f6f6;
        width: 94%;
        margin: 0 auto;
        padding: 10px 0;
        height: 40px;
        position: relative;
        //box-shadow: 0px 1px 3px 1px #e4e4e4,  /*下边阴影*/
        //0px -1px 3px 0px #e4e4e4;   /*上边阴影*/
        /deep/ .van-cell {
          width: 100%;
          display: inline-block;
          padding: 10px 24px;
          border-radius: 4px;
          line-height: 0;
        }
        .time-between {
          color: black;
          position: absolute;
          display: inline-block;
          height: 40px;
          line-height: 60px;
          top: 0;
          left: 0
        }
        .content-middle-top-content {
          position: relative;
          height: 100%;
          margin: 0 auto;
          > div {
            width: 44%;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      };
      .content-top-time-fask {
        background: #f6f6f6;
        width: 94%;
        margin: 0 auto;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-bottom: 10px;
        span {
          display: inline-block;
          color: #fff;
          margin-right: 10px;
          width: 60px;
          height: 25px;
          text-align: center;
          line-height: 25px;
          border-radius: 4px;
          background: #d9d9d9
        };
        .timeFastStyle {
          background: #fff;
          color: black
        };
      };
      .task-status-list {
        flex: 1;
        overflow: auto
      }
    }
    .status-handle-screen {
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        width: 94%;
        margin:0 auto;
        background: #fff;
        padding: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
        .list-status {
          width: 80px;
          height: 30px;
          position: absolute;
          text-align: center;
          line-height: 30px;
          top: 8px;
          right: -12px;
          img {
            width: 100%;
            height: 100%
          }
        }
        .listStatusStyleOne {
          color: red
        }
        .listStyleStatusTwo {
          color: #85dc85
        }
        .wait-handle-message {
          font-size: 16px;
          padding: 14px 0;
          box-sizing: border-box;
          .wait-handle-message-top {
            height: 60px;
            border-left: 6px solid #2895ea;
            span {
              display: inline-block;
              width: 75%;
              padding-left: 5px;
              height: 28px;
              box-sizing: border-box;
              &:first-child {
                margin-bottom: 10px;
                overflow: auto
              }
            }
          };
          .wait-handle-message-top-two {
            height: 54px;
            border-left: 6px solid #2895ea;
            p {
              display: inline-block;
              width: 75%;
              height: 20px;
              overflow: auto;
              padding-left: 5px;
              box-sizing: border-box;
              &:first-child {
                margin-bottom: 15px
              }
            }
          };
          .wait-handle-message-one {
            line-height: 24px;
            min-height: 35px;
            margin-left: -4px;
            span {
              display: inline-block;
              padding-left: 5px;
              box-sizing: border-box;
              color: #a0a0a0;
              &:first-child {
                vertical-align: top;
              };
              &:last-child {
                width: 70%;
                word-break: break-all;
                color: black;
              }
            };
            .priorityStyle {
              color: red !important;
              font-weight: bold !important
            };
            p {
              display: inline-block;
              span {
                color: black !important
              }

            }
          };
          .message-name {
            display: flex;
            >span {
              &:nth-child(2) {
                padding: 0 5px 0 10px;
                box-sizing: border-box;
                flex: 1;
                color: black;
                word-break: break-all
              }
            };
            img {
              width: 27px;
              height: 27px;
              vertical-align: bottom
            }
          };
          .wait-handle-message-two {
            min-height: 35px;
            line-height: 24px;
            margin-left: -4px;
            p {
              display: inline-block;
              padding-left: 5px;
              box-sizing: border-box;
              color: #a0a0a0;
              &:first-child {
                vertical-align: top;
              };
              &:last-child {
                width: 70%;
                word-break: break-all;
                color: black;
              }
            }
          }
        };
        .get-wait-task {
          margin-top: 4px;
          width: 100%;
          text-align: center;
          span {
            vertical-align: top;
            display: inline-block;
            width: 120px;
            background: #1b88ff;
            line-height: 35px;
            height: 35px;
            font-size: 16px;
            color: #fff;
            margin-right: 20px;
            border-radius: 20px;
            &:last-child {
              margin-right: 0;
              color: #1b88ff;
              background: #fff;
              border: 1px solid #1b88ff;
              text-align: center
            }
          }
        }
      }
    }
    .status-handle-screen {
      /deep/ .van-tabs {
        .right-sign {
          .status-sign
        }
      }
    }
  }
</style>
