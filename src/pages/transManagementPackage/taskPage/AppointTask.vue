<template>
  <div class="content-wrapper">
    <van-overlay :show="overlayShow" z-index="100000" />
    <van-loading size="35px" vertical color="#e6e6e6" v-show="showLoadingHint">{{loadingContent}}</van-loading>
    <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <van-dialog v-model="isShowTransferPop" :show-cancel-button="true"  :close-on-popstate="false" :title="`确认要将任务转移给${currentPerson}吗`"
      @confirm="transferSureEvent" 
      @cancel="transferCancelEvent"
    />
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>
    </HeaderTop>
    <!-- 二维码图片弹框 -->
    <div class="area-code-box">
      <van-dialog v-model="codeAreaShow" :show-confirm-button="false" @close="areaCodeBoxCloseEvent">
        <div class="title">
          <span>扫码获取任务</span>
          <van-icon name="clear" color="#808080" size="25" @click="clearAreaCodeDialogEvent" />
        </div>
        <div class="content" ref="qrcode">
        </div>
      </van-dialog>
    </div>  
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
      <div class="status-box" v-show="taskQueryShow == false && !transferTaskBtnShow">
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
      <div class="task-operate-box" v-show="cancelTaskBtnShow || transferTaskBtnShow">
        <p>
          <span v-show="transferTaskBtnShow" @click="transferTaskEvent">转移任务</span>
        </p>
        <p>
          <van-popup v-model="transferShow" position="bottom">
            <van-picker
              show-toolbar
              title="请选择要移交的运送员"
              :columns="transerColumns"
              @cancel="transferShow = false"
              @confirm="transferConfirm"
            />
          </van-popup>
        </p>
      </div>
    </div>
    <van-pull-refresh v-model="isRefresh" class="wait-handle-box" @refresh="onRefresh" v-show="waitHandleBox" success-text="刷新成功">
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == -1 && appointTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="area-code" @click="areaCodeClickEvent(item)">
              <img :src="qrCodeJpg" alt="">
            </div>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'natureImportantStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-two">
                <p>任务描述 : </p>
                <p>
                  {{item.taskRemark}}
                </p>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one  message-name">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one">
                <span>转运工具 : </span>
                <span>{{item.toolName ? item.toolName : '无'}}</span>
              </div>
            </div>
            <div class="wait-handle-message-bottom">
              <p class="wait-handle-check" v-show="item.state == 1 || item.state == 2 || item.state == 3">
                <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
              </p>
              <p class="get-wait-task">
                <span v-show="item.state == '1'" @click.stop="getTask(item.id)">
                  获&nbsp;&nbsp;取
                </span>
                <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                  进入任务
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="sendbackTaskEvent(item)">
                  退&nbsp;&nbsp;回
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">
                  取&nbsp;&nbsp;消
                </span>
              </p>
            </div>  
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 1 && appointTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="area-code" @click="areaCodeClickEvent(item)">
              <img :src="qrCodeJpg" alt="">
            </div>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'natureImportantStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-two">
                <p>任务描述 : </p>
                <p>
                  {{item.taskRemark}}
                </p>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one  message-name">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one">
                <span>转运工具 : </span>
                <span>{{item.toolName ? item.toolName : '无'}}</span>
              </div>
            </div>
            <div class="wait-handle-message-bottom">
              <p class="wait-handle-check" v-show="item.state == 1 || item.state == 2 || item.state == 3">
                <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
              </p>
              <p class="get-wait-task">
                <span v-show="item.state == '1'" @click.stop="getTask(item.id)">
                  获&nbsp;&nbsp;取
                </span>
                <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                  进入任务
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="sendbackTaskEvent(item)">
                  退&nbsp;&nbsp;回
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">
                  取&nbsp;&nbsp;消
                </span>
              </p>
            </div>  
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 2 && appointTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="area-code" @click="areaCodeClickEvent(item)">
              <img :src="qrCodeJpg" alt="">
            </div>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'natureImportantStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-two">
                <p>任务描述 : </p>
                <p>
                  {{item.taskRemark}}
                </p>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one  message-name">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one">
                <span>转运工具 : </span>
                <span>{{item.toolName ? item.toolName : '无'}}</span>
              </div>
            </div>
            <div class="wait-handle-message-bottom">
              <p class="wait-handle-check" v-show="item.state == 1 || item.state == 2 || item.state == 3">
                <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
              </p>
              <p class="get-wait-task">
                <span v-show="item.state == '1'" @click.stop="getTask(item.id)">
                  获&nbsp;&nbsp;取
                </span>
                <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                  进入任务
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="sendbackTaskEvent(item)">
                  退&nbsp;&nbsp;回
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">
                  取&nbsp;&nbsp;消
                </span>
              </p>
            </div>  
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 3 && appointTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="area-code" @click="areaCodeClickEvent(item)">
              <img :src="qrCodeJpg" alt="">
            </div>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'natureImportantStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-two">
                <p>任务描述 : </p>
                <p>
                  {{item.taskRemark}}
                </p>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one  message-name">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one">
                <span>转运工具 : </span>
                <span>{{item.toolName ? item.toolName : '无'}}</span>
              </div>
            </div>
            <div class="wait-handle-message-bottom">
              <p class="wait-handle-check" v-show="item.state == 1 || item.state == 2 || item.state == 3">
                <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
              </p>
              <p class="get-wait-task">
                <span v-show="item.state == '1'" @click.stop="getTask(item.id)">
                  获&nbsp;&nbsp;取
                </span>
                <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                  进入任务
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="sendbackTaskEvent(item)">
                  退&nbsp;&nbsp;回
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">
                  取&nbsp;&nbsp;消
                </span>
              </p>
            </div>  
          </div>
        </div>
      </div>
      <div class="state-filter-all wait-handle-one" v-show="stateIndex == 4 && appointTaskListShow">
        <div class="task-status-list">
          <div class="wait-handle-list" v-for="(item,index) in stateFilterList" :key="`${item}-${index}`">
            <p class="list-status">
              <img :src="stateTransferImg(item.state)" alt="">
            </p>
            <div class="area-code" @click="areaCodeClickEvent(item)">
              <img :src="qrCodeJpg" alt="">
            </div>
            <div class="wait-handle-message">
              <div class="wait-handle-message-one">
                <span :class="{'natureImportantStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
              <div class="wait-handle-message-one">
                <span>开始时间 : </span>
                <span>{{item.planStartTime}}</span>
              </div>
              <div class="wait-handle-message-two">
                <p>任务描述 : </p>
                <p>
                  {{item.taskRemark}}
                </p>
              </div>
              <div class="wait-handle-message-one">
                <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
                <span>{{item.setOutPlaceName}}</span>
              </div>
              <div class="wait-handle-message-one  message-name">
                <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
                <span>{{item.bedNumber}}</span>
                <img :src="contactIsolationPng" v-if="item.quarantine == 1">
              </div>
              <div class="wait-handle-message-one">
                <span>转运工具 : </span>
                <span>{{item.toolName ? item.toolName : '无'}}</span>
              </div>
            </div>
            <div class="wait-handle-message-bottom">
              <p class="wait-handle-check" v-show="item.state == 1 || item.state == 2 || item.state == 3">
                <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
              </p>
              <p class="get-wait-task">
                <span v-show="item.state == '1'" @click.stop="getTask(item.id)">
                  获&nbsp;&nbsp;取
                </span>
                <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                  进入任务
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="sendbackTaskEvent(item)">
                  退&nbsp;&nbsp;回
                </span>
                <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">
                  取&nbsp;&nbsp;消
                </span>
              </p>
            </div>  
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
        <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
          <p class="list-status">
            <img :src="stateTransferImg(item.state)" alt="">
          </p>
          <div class="wait-handle-message">
            <div class="wait-handle-message-one">
                <span :class="{'natureImportantStyle' : item.priority != 1}">优&nbsp;&nbsp;先&nbsp;&nbsp;级 : </span>
                <span class="message-tit-real" :class="{'natureNormalStyle' : item.priority == 1, 'natureImportantStyle': item.priority != 1}">{{priorityTransfer(item.priority)}}</span>
              </div>
              <!-- <div class="wait-handle-message-one contact-isolation-box">
                <span>接触隔离 : </span>
                <span>是</span>
              </div> -->
            <div class="wait-handle-message-one">
              <span>开始时间 : </span>
              <span>{{item.planStartTime}}</span>
            </div>
            <div class="wait-handle-message-two">
              <p>任务描述 : </p>
              <p>
                {{item.taskRemark}}
              </p>
            </div>
            <div class="wait-handle-message-one">
              <span>起&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;点 : </span>
              <span>{{item.setOutPlaceName}}</span>
            </div>
            <div class="wait-handle-message-one  message-name">
              <span>床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 : </span>
              <span>{{item.bedNumber}}</span>
              <img :src="contactIsolationPng" v-if="item.quarantine == 1">
            </div>
            <div class="wait-handle-message-one">
              <span>转运工具 : </span>
              <span>{{item.toolName ? item.toolName : '无'}}</span>
            </div>
          </div>
          <div class="wait-handle-message-bottom">
            <p class="wait-handle-check" v-show="item.state == 1 || item.state == 2 || item.state == 3">
              <van-checkbox v-model="item.taskCheck"  @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
            </p>
            <p class="get-wait-task">
              <span v-show="item.state == '1'" @click.stop="getTask(item.id)">
                获&nbsp;&nbsp;取
              </span>
              <span v-show="!(item.state == '1')" @click.stop="intoTask(item)">
                进入任务
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="sendbackTaskEvent(item)">
                退&nbsp;&nbsp;回
              </span>
              <span v-show="item.state == '1' || item.state == '2' " @click="cancelTaskEvent(item)">
                取&nbsp;&nbsp;消
              </span>
            </p>
          </div>  
        </div>
      </div>
    </div>
    <div class="back-reason-box">
      <!-- 取消原因弹窗 -->
      <van-dialog v-model="reasonShow" title="请选择取消原因" show-cancel-button width="92%"
        @confirm="reasonSure" @cancel="reasonCancel"
      >
        <div class="tool-name-list">
          <div class="tool-name-list-content">
            <span :class="{spanStyle:reasonIndex === index}" v-for="(item,index) in reasonOperationList" :key="`${item}-${index}`" @click="reasonCheck(item,index)">
              {{item.text}}
            </span>
          </div>
        </div>
      </van-dialog>
      <!-- 退回原因弹窗 -->
      <van-dialog v-model="sendbackShow" title="请选择退回原因" show-cancel-button width="92%"
        @confirm="sendbackSure" @cancel="sendbackCancel"
      >
        <div class="tool-name-list">
          <div class="tool-name-list-content">
            <span :class="{spanStyle:sendbackIndex === index}" v-for="(item,index) in sendbackOperationList" :key="`${item}-${index}`" @click="sendbackCheck(item,index)">
              {{item.text}}
            </span>
          </div>
        </div>
      </van-dialog>
    </div>  
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import {getWorkerMessage} from '@/api/login.js'
  import {queryAppointTaskMessage, updateAppointTaskMessage, cancelAppointTask, userSignOut, transferAppointTask,queryDispatchTaskCancelReason,sendbackAppointTask,queryAppointTaskSendbackReason} from '@/api/trans/workerPort.js'
  import NoData from '@/components/NoData'
  import store from '@/store'
  import QRCode from 'qrcodejs2'
  import Loading from '@/components/Loading'
  import SOtime from '@/common/js/SOtime.js'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, IsPC, deepClone, removeAllLocalStorage } from '@/common/js/utils'
  export default {
    name: 'appointTask',
    data () {
      return {
        codeAreaShow: false,
        overlayShow: false,
        showLoadingHint: false,
        loadingContent: '加载中,请稍候···',
        sendbackShow: false,
        appointTaskListShow: false,
        noDataShow: false,
        reasonShow: false,
        transferShow:  false,
        reasonOperationList: [],
        sendbackOperationList: [],
        transerColumns: [],
        reasonIndex: '',
        sendbackIndex: '',
        sendbackName: '',
        sendbackValue: '',
        timeFastindex: '',
        reasonText: '',
        reasonName: '',
        reasonValue: '',
        stateIndex: -1,
        valueStatus: '全部',
        statusShow: false,
        isShowTransferPop: false,
        taskQueryShow: false,
        leftDropdownDataList: ['退出登录'],
        stateListShow: false,
        leftDownShow: false,
        columns:['全部','未获取','已获取', '进行中', '未结束'],
        timeList: ['近一周','近一月','近三月'],
        startTime: '',
        endTime: '',
        startTimePop: false,
        endTimePop: false,
        currentDateStart: new Date(),
        currentDateEnd: new Date(),
        minDateStart: new Date(2020, 0, 1),
        minDateEnd: new Date(2020, 0, 1),
        liIndex: null,
        transferWorkerShow: false,
        taskOneList: ['待办任务', '历史任务'],
        onlinePersonLlist: [],
        currentPerson: [],
        taskLlineOneIndex: '0',
        cancelTask: false,
        transferTask: false,
        waitHandleCheck: true,
        cancelTaskBtnShow: false,
        transferTaskBtnShow: false,
        isRefresh: false,
        waitHandleBox: true,
        taskId: '',
        stateFilterList: [],
        stateCompleteList: [],
        waitBaskList: [],
        screenTaskList: [],
        transferTaskIdList: [],
        drawCompleteTaskIdList: [],
        qrCodeJpg: require('@/common/images/home/qr-code.jpeg'),
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
        'userInfo',
        'completeSweepcodeDestinationInfo',
        'completeSweepcodeDepartureInfo',
        'globalTimer',
        'completeCheckedItemInfo',
        'catch_components',
        'isFreshAppointTaskPage',
        'appointTaskTransferIdList',
        'chooseHospitalArea'
      ]),
      sex () {
        return this.userInfo['worker']['extendData']['sex']
      },
      userTypeId () {
        return this.isMedicalMan
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
      waitBaskList: {
        handler(newName, oldName) {
          if (newName.some(function (item, index) {return item.taskCheck == true})) {
            this.cancelTaskBtnShow = true;
            this.transferTaskBtnShow = true;
          } else {
            this.cancelTaskBtnShow = false;
            this.transferTaskBtnShow = false;
          }
        },
        deep: true,
        immediate: true
      },

      stateFilterList: {
        handler(newName, oldName) {
          if (newName.some(function (item, index) {return item.taskCheck == true})) {
            this.cancelTaskBtnShow = true;
            this.transferTaskBtnShow = true;
          } else {
            this.cancelTaskBtnShow = false;
            this.transferTaskBtnShow = false;
          }
        },
        deep: true,
        immediate: true
      }
    },

    mounted () {
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送')
        })
      };
      document.addEventListener('click',(e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询预约任务(分配给自己的)
      this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -1, isMobile: 1,startDate: '',endDate: ''}, this.stateIndex);
      this.drawTaskId()
    },

    activated () {
     // 控制设备物理返回按键测试
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          this.$router.push({path: 'home'});
          this.changeTitleTxt({tit:'中央运送'});
          setStore('currentTitle','中央运送')
        })
      };
      document.addEventListener('click',(e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      // 查询预约任务(分配给自己的)
      if (this.isFreshAppointTaskPage) {
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''}, this.stateIndex);
        this.drawTaskId()
      }
    },

    beforeRouteEnter (to, from, next) {
      let catch_components = store.state.catchComponent.catch_components;
      let i = catch_components.indexOf('appointTask');
      i === -1 && catch_components.push('appointTask');
      next();
    },

    beforeRouteLeave(to, from, next) {
      let catch_components = this.catch_components;
      if (to.name !== 'appointDetails'){
        let i = catch_components.indexOf('appointTask');
        i > -1 && this.changeCatchComponent([]);
      }
      next()
    },

    methods: {
      ...mapMutations([
        'changeTitleTxt',
        'changeAppointTaskMessage',
        'changeAppointTaskTransferIdList',
        'changeTaskDetailsMessage',
        'changeTaskType',
        'changeOverDueWay',
        'changeCatchComponent',
        'changeCompleteCheckedItemInfo',
        'changeCompleteSweepcodeDepartureInfo',
        'changeCompleteSweepcodeDestinationInfo'
      ]),

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        this.userLoginOut(this.proId, this.userInfo.userName)
      },

      // 二维码弹框关闭事件
      areaCodeBoxCloseEvent () {
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -1, isMobile: 1,startDate: '',endDate: ''}, this.stateIndex);
      },

      // 任务取消
      cancelTaskEvent (item) {
        this.taskId = item.id;
        this.reasonShow = true;
        this.loadingContent = '取消中,请稍候···';
        this.showLoadingHint = true;
        this.overlayShow = true;
        queryDispatchTaskCancelReason({proId:this.proId,state: 0,type: 2})
        .then((res) => {
          this.loadingContent = '';
          this.showLoadingHint = false;
          this.overlayShow = false;
          this.reasonOperationList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                this.reasonOperationList.push({
                  text: item.cancelName,
                  value: item.id
                })
              }
            } else {
              this.$toast('没有查询到取消原因');
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
        this.loadingContent = '';
        this.showLoadingHint = false;
        this.overlayShow = false;
        this.reasonIndex = ''
      },

      // 任务退回
      sendbackTaskEvent (item) {
        this.taskId = item.id;
        this.sendbackShow = true;
        this.loadingContent = '退回中,请稍候···';
        this.showLoadingHint = true;
        this.overlayShow = true;
        queryAppointTaskSendbackReason({proId:this.proId,state: 0,type: 2})
        .then((res) => {
          this.loadingContent = '';
          this.showLoadingHint = false;
          this.overlayShow = false;
          this.sendbackOperationList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                this.sendbackOperationList.push({
                  text: item.undoName,
                  value: item.id
                })
              }
            } else {
              this.$toast('没有查询到退回原因');
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
        this.loadingContent = '';
        this.showLoadingHint = false;
        this.overlayShow = false;
        this.sendbackIndex = ''
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
        this.queryCompleteDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -2,
          startDate: startDate,endDate: endDate})
      },

      // 取消原因确定
      reasonSure () {
        if (this.reasonIndex === '') {
          this.$toast('请选择取消原因');
          return
        };
        this.overlayShow = true;
        this.showLoadingHint = true;
        this.loadingContent = '取消中,请稍候···';
        cancelAppointTask({
          proId:this.proId, 
          taskId:this.taskId,
          workerId: this.workerId,
          reason:this.reasonText,
          endType: 1, //终止类型(0-web,1-安卓APP，2-微信小程序)
          endUser: this.userInfo.userName // 取消者(当前登录用户名)
        })
        .then((res) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.msg}`);
            this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1, startDate: '',endDate: ''}, this.stateIndex)
          } else {
            this.$toast(`${res.data.msg}`)
          }
        })
        .catch((err) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 取消原因取消
      reasonCancel() {
        this.reasonIndex = '';
        this.reasonName = '';
        this.reasonShow = false
      },
      // 取消原因选中事件
      reasonCheck (item,index) {
        this.reasonIndex = index;
        this.reasonText = item.text;
        this.reasonName = item.text
        this.reasonValue = item.value
      },

      //退回原因确定
      sendbackSure () {
        if (this.sendbackIndex === '') {
          this.$toast('请选择退回原因');
          return
        };
        this.overlayShow = true;
        this.showLoadingHint = true;
        this.loadingContent = '退回中,请稍候···';
        sendbackAppointTask({proId:this.proId, taskId:this.taskId,workerId: this.workerId,reason:this.sendbackText})
        .then((res) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.msg}`);
            this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1, startDate: '',endDate: ''}, this.stateIndex)
          } else {
            this.$toast(`${res.data.msg}`)
          }
        })
        .catch((err) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      //退回原因取消
      sendbackCancel () {
        this.sendbackIndex = '';
        this.sendbackName = '';
        this.sendbackShow = false
      },

      // 退回原因选中
      sendbackCheck (item,index) {
        this.sendbackIndex = index;
        this.sendbackText = item.text;
        this.sendbackName = item.text
        this.sendbackValue = item.value
      },


      // 进入任务
      intoTask (item) {
        this.$router.push({'path':'/appointDetails'});
        this.changeTitleTxt({tit:'预约任务详情'});
        setStore('currentTitle','预约任务详情');
        // 改变调度具体某一预约任务的信息状态
        this.changeAppointTaskMessage({DtMsg: item});
        setStore('currentAppointTaskMessage',item);
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

      // 关闭二维码弹框事件
      clearAreaCodeDialogEvent () {
        this.codeAreaShow = false
      },

      // 二维码点击事件
      areaCodeClickEvent (item) {
        this.codeAreaShow = true;
        this.$nextTick(() => {
          this.creatQrCode(`${this.workerId}|${item.id}`)
        })
      },

      // 生产二维码
      creatQrCode(codeContent) {
        this.$refs.qrcode.innerHTML = ''
        let qrcode = new QRCode(this.$refs.qrcode, {
          text: codeContent,
          width: 200,
          height: 200,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.H
        })
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
            return  this.taskCancelPng
            break;
          case 7 :
            return  this.taskFinshedPng
            break;
        }
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

      startTimeChange(e) {
        let startTimeArr = e.getValues();//["2019", "03", "22", "17", "28"]
        this.startTime = `${startTimeArr[0]}-${startTimeArr[1]}-${startTimeArr[2]}`
      },

      endTimeChange(e) {
        let endTimeArr = e.getValues();//["2019", "03", "22", "17", "28"]
        this.endTime = `${endTimeArr[0]}-${endTimeArr[1]}-${endTimeArr[2]}`
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

      // 初始化时间显示框
      initDate () {
        let currentDateList = formatTime('YYYY-MM-DD').split('-');
        this.startTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`;
        this.endTime = `${currentDateList[0]}-${currentDateList[1]}-${currentDateList[2]}`
      },

      // 搜索完成的任务
      searchCompleteTask () {
        this.queryCompleteDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -2,startDate: this.startTime,endDate: this.endTime})
      },

      // 任务状态转换
      stateTransfer (index) {
        switch(index) {
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

      // 查询预约任务(状态筛选点击专用)
      queryStateFilterDispatchTask (data, index) {
        this.noDataShow = false;
        this.overlayShow = true;
        this.showLoadingHint = true;
        this.loadingContent = '加载中,请稍候···';
        queryAppointTaskMessage (data)
        .then((res) => {
          this.overlayShow = false;
          this.showLoadingHint = false;
          this.isRefresh = false;
          this.loadingContent = '';
          let temporaryTaskListFirst = [];
          this.stateFilterList = [];
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.appointTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
                temporaryTaskListFirst.push({
                  taskCheck: false,
                  createTime: item.createTime,
                  planStartTime: item.planStartTime,
                  state: item.state,
                  setOutPlaceId: item.setOutPlaceId,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  destinationId: item.destinationId,
                  taskTypeName: item.taskName,
                  toolName: item.toolName,
                  id: item.id,
                  taskNumber: item.taskNumber,
                  patientName: item.patientName,
                  bedNumber: item.badNumber,
                  sex: item.sex,
                  age: item.age,
                  patientId: item.id,
                  quarantine: item.quarantine,
                  number: item.number,
                  priority: item.priority,
                  taskRemark: item.taskRemark
                })
              };
              if (index == -1) {
                this.stateFilterList = temporaryTaskListFirst;
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 1) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 1});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 2) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 2});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 3) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 3});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              } else if (index == 4) {
                this.stateFilterList = temporaryTaskListFirst.filter((item) => { return item.state == 4});
                if (this.stateFilterList.length == 0) {
                  this.noDataShow = true;
                  return
                }
              }
            } else {
              this.appointTaskListShow = false;
              this.noDataShow = true
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.appointTaskListShow = false
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.appointTaskListShow = false;
          this.loadingContent = '';
          this.showLoadingHint = false;
          this.overlayShow = false;
          this.isRefresh = false
        })
      },

      // 下拉刷新
      onRefresh () {
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: this.stateIndex,startDate: '',endDate: ''}, this.stateIndex)
      },

      // 提取存储已完成采集任务科室所属任务id
      drawTaskId () {
        this.drawCompleteTaskIdList = [];
        if (this.completeSweepcodeDestinationInfo.length > 0) {
          for (let item of this.completeSweepcodeDestinationInfo) {
            for (let innerItem in item) {
              if (innerItem == 'taskId') {
                this.drawCompleteTaskIdList.push(item[innerItem])
              }
            }
          }
        }
      },

      // 查询预约任务(已完成)
      queryCompleteDispatchTask (data) {
        this.noDataShow = false;
        this.overlayShow = true;
        this.showLoadingHint = true;
        this.loadingContent = '加载中,请稍候···';
        queryAppointTaskMessage(data).then((res) => {
          this.stateCompleteList = [];
          this.showLoadingHint = false;
          this.overlayShow = false;
          this.isRefresh = false;
          this.loadingContent = '';
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.appointTaskListShow = true;
              this.noDataShow = false;
              for (let item of res.data.data) {
                this.stateCompleteList.push({
                  taskCheck: false,
                  createTime: item.createTime,
                  planStartTime: item.planStartTime,
                  spaces: item.destinationName,
                  state: item.state,
                  finishTime: item.finishTime,
                  setOutPlaceName: item.setOutPlaceName,
                  destinationName: item.destinationName,
                  taskTypeName: item.taskName,
                  toolName: item.toolName,
                  taskNumber: item.taskNumber,
                  id: item.id,
                  patientName: item.patientName,
                  bedNumber: item.badNumber,
                  sex: item.sex,
                  age: item.age,
                  patientId: item.id,
                  quarantine: item.quarantine,
                  number: item.number,
                  priority: item.priority,
                  taskRemark: item.taskRemark
                })
              }
            } else {
              this.appointTaskListShow = false;
              this.noDataShow = true
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
            this.appointTaskListShow = false
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
          this.appointTaskListShow = false;
          this.showLoadingHint = false;
          this.loadingContent = '';
          this.overlayShow = false;
          this.isRefresh = false
        })
      },

      // 任务状态转换
      stateTransfernumber (item) {
        switch(item) {
          case '全部' :
            return '-1'
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
          case '未结束' :
            return 4
            break;
        }
      },

      // 阻止change事件冒泡
      emptyHandle () {},

      // 返回上一页
      backTo () {
        this.$router.push({path: 'home'});
        this.changeTitleTxt({tit:'中央运送'});
        setStore('currentTitle','中央运送')
      },

      // 调度任务第一行按钮点击
      taskLineOneEvent (item,index) {
        this.taskLlineOneIndex = index;
        this.transferTask = false;
        this.cancelTask = false;
        this.noDataShow = false;
        this.initDate();
        if (index == '0') {
          this.stateIndex = -1;
          this.taskQueryShow = false;
          this.waitHandleBox = true;
          this.valueStatus = '全部';
          this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''}, -1);
        } else if (index == '1') {
          this.stateIndex = null;
          this.taskQueryShow = true;
          this.waitHandleBox = false;
          this.cancelTaskBtnShow = false;
          this.transferTaskBtnShow = false;
          this.queryCompleteDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, state: -2,startDate: this.startTime,endDate: this.endTime})
        }
      },

       // 状态筛选列表点击
      stateListEvent (index) {
        this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1,state: index ,startDate: '',endDate: ''}, index)
      },

      // 状态框确定事件
      onConfirm(value) {
        this.valueStatus = value;
        this.statusShow = false;
        this.stateIndex = this.stateTransfernumber(value);
        this.stateListEvent(this.stateIndex)
      },

      // 转移任务弹框确定事件(picker选择器)
      transferConfirm(value) {
        // 驻点人员必须在任务状态为进行中时才能转移
        if (value.indexOf('(') != -1) {
          let temporaryStateFilterList = this.stateFilterList.filter((item) => {return item.taskCheck == true});
          if (temporaryStateFilterList.some((item) => { return item.state != 3})) {
            this.$toast({
              message: '请扫描起点后再转移给驻点人员',
              position: 'bottom'
            });
            return
          }
        };
        this.currentPerson = value;
        this.isShowTransferPop = true
      },
      

      // 获取转移人员的id
      getTransferPersonId (name) {
        let temporaryName = name;
        let temporaryIndex = temporaryName.indexOf("(");
        if (temporaryIndex != -1) {
          temporaryName = name.slice(0,temporaryIndex-1)
        };
        let id = this.onlinePersonLlist.filter((item) => {return item.text == temporaryName})[0]['value'];
        // 转移给自己或同名的
        if (temporaryName == this.workerName) {
          id = this.workerId
        };
        return id
      },

      // 转移弹框确定事件(Dialog弹框)
      transferSureEvent () {
        this.transferShow = false;
        this.sureTransferDispatchTask ({
          taskIds: this.appointTaskTransferIdList,
          afterWorkerId: this.getTransferPersonId(this.currentPerson),   //任务接受者ID
          beforeWorkerId: this.workerId,      //转移者ID
        })
      },

      // 转移弹框取消事件(Dialog弹框)
      transferCancelEvent () {
      },

      // 获取在线工作人员
      queryOnlineWorker (data) {
        this.onlinePersonLlist = [];
        this.transerColumns = [];
        getWorkerMessage(data).then((res) => {
          if (res && res.data.code == 200) {
            this.onlinePersonLlist = [{text: '请选择',value: ''}];
            for (let item of res.data.data) {
              let temporaryWorkerMessageArray = [];
              for (let innerItem in item) {
                if (innerItem == 'id') {
                  temporaryWorkerMessageArray.push(item[innerItem])
                };
                if (innerItem == 'workerName') {
                  temporaryWorkerMessageArray.push(item[innerItem]);
                  this.transerColumns.push(item[innerItem])
                };
                if (innerItem == 'depName') {
                  if (item[innerItem]) {
                    temporaryWorkerMessageArray.push(item[innerItem]);
                    this.transerColumns[this.transerColumns.length - 1] = `${this.transerColumns[this.transerColumns.length - 1]} (${item[innerItem]})`
                  } else {
                    temporaryWorkerMessageArray.push('')
                  }
                }
              };
              this.onlinePersonLlist.push({text: temporaryWorkerMessageArray[1], value: temporaryWorkerMessageArray[0],depName: temporaryWorkerMessageArray[2]})
            }
          }
        })
          .catch((err) => {
            console.log(err)
          })
      },

      // 转移任务
      sureTransferDispatchTask (data) {
        this.loadingContent = '转移中,请稍候···';
        this.showLoadingHint = true;
        this.overlayShow = true;
        transferAppointTask(data)
          .then((res) => {
            this.overlayShow = false;
            this.showLoadingHint = false;
            this.loadingContent = '';
            if (res && res.data.code == 200) {
              this.$toast(`${ res.data.msg}`);
              this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''},-1);
            } else {
              this.$dialog.alert({
                message: res.data.msg,
                closeOnPopstate: true
              }).then(() => {
              });
            }
          })
          .catch((err) => {
            this.overlayShow = false;
            this.showLoadingHint = false;
            this.loadingContent = '';
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
            });
          })
      },


      // 转移任务按钮点击
      transferTaskEvent () {
        this.transferTaskIdList = [];
        let temporaryTransferTaskCheckList = [];
        temporaryTransferTaskCheckList = this.stateFilterList.filter((item) => {return item.taskCheck == true});
        this.transferShow = true;
        for (let item of temporaryTransferTaskCheckList)  {
          for (let key in item) {
            if (key == 'id')
            this.transferTaskIdList.push(item['id'])
          }
        };
        this.transferTask = true;
        this.cancelTask = false;
        this.transferWorkerShow = true;
        this.changeAppointTaskTransferIdList({DtMsg: this.transferTaskIdList});
        this.queryOnlineWorker({proId: this.proId, state:''});
      },

      // 清空该完成任务存储的已完成检查的信息
      emptyCompleteCheckedItem () {
        let temporarySweepCodeOficeList = [];
        temporarySweepCodeOficeList = deepClone(this.completeCheckedItemInfo);
        temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return this.appointTaskTransferIdList.indexOf(item.taskId) == -1 });
        this.changeCompleteCheckedItemInfo(temporarySweepCodeOficeList);
        setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": temporarySweepCodeOficeList})
      },

      // 清空该完成任务存储的已扫过目的地科室信息
      emptyCompleteDestinationDepartment () {
        let temporarySweepCodeOficeList = [];
        temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDestinationInfo);
        temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return this.appointTaskTransferIdList.indexOf(item.taskId) == -1 });
        this.changeCompleteSweepcodeDestinationInfo(temporarySweepCodeOficeList);
        setStore('completAppointTaskSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
      },

      // 清空该完成任务存储的已扫过起始地科室信息
      emptyCompleteDepartureDepartment () {
        let temporarySweepCodeOficeList = [];
        temporarySweepCodeOficeList = deepClone(this.completeSweepcodeDepartureInfo);
        temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return this.appointTaskTransferIdList.indexOf(item.taskId) == -1 });
        this.changeCompleteSweepcodeDepartureInfo(temporarySweepCodeOficeList);
        setStore('completAppointTaskSweepCodeDepartureInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
      },

      // 复选框选择事件
      waitTaskChecked (waitHandleCheck) {
      },

      // 获取待处理任务事件
      getTask (taskId) {
        this.loadingContent = '获取中,请稍候···';
        this.showLoadingHint = true;
        this.overlayShow = true;
        updateAppointTaskMessage({
          proId: this.proId,//当前项目ID
          taskId: taskId, //当前任务ID
          workerId: this.workerId// 运送员ID即当前登录人
        })
        .then(res => {
          this.loadingContent = '';
          this.showLoadingHint = false;
          this.overlayShow = false;
          if (res && res.data.code == 200) {
            this.queryStateFilterDispatchTask({proId: this.userInfo.extendData.proId, workerId: this.workerId, isMobile: 1, state: -1,startDate: '',endDate: ''},-1)
          }
        })
        .catch(err => {
          this.loadingContent = '';
          this.showLoadingHint = false;
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
    .back-reason-box {
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
    };
    .area-code-box {
      /deep/ .van-dialog {
        .van-dialog__content {
          padding: 10px;
          box-sizing: border-box;
          .title {
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            height: 40px;
            >span {
              font-size: 18px;
              color: black;
              flex: 1;
              display: flex;
              justify-content: center
            }
          };
          .content {
            width: 100%;
            >img {
              width: 100%
            }
          }
        }
      }
    };  
    .content-wrapper();
    font-size: 14px;
    position: relative;
    .no-data {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 2000;
      left: 0;
      width: 100%;
      text-align: center;
    }
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
      };
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
        height: 50px;
        background: #f6f6f6;
        text-align: center;
        margin-top: 6px;
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 13px;
          width: 70px;
          height: 30px;
          border-radius: 4px;
          color: #fff;
          background-image: linear-gradient(to right, #37d4fd , #429bff);
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
          padding: 25px 10px 10px 10px;
          margin-bottom: 10px;
          box-sizing: border-box;
          .list-status {
            width: 80px;
            height: 30px;
            position: absolute;
            text-align: center;
            line-height: 30px;
            top: 8px;
            right: -10px;
            img {
              width: 100%;
              height: 100%
            }
          };
          .area-code {
            position: absolute;
            top: 4px;
            left: 5px;
            width: 40px;
            height: 40px;
            img {
              width: 100%;
              height: 100%
            }
          };
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
              min-height: 35px;
              line-height: 35px;
              overflow: auto;
              margin-left: -4px;
              .natureNormalStyle {
                color: #b1d676 !important
              };
              .natureImportantStyle {
                color: red !important;
                font-weight: bold;
              };
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
                  color: black;
                }
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
              line-height: 20px;
              overflow: auto;
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
                  text-align: justify;
                  color: black;
                  word-break: break-all
                }
              }
            }
          };
          .wait-handle-message-bottom {
            display: flex;
            flex-flow: row nowrap;
            justify-content: space-between;
            align-items: center;
            .wait-handle-check {
              width: 20px;
              height: 20px;
              margin-right: 10px;
            };
            .get-wait-task {
              margin-top: 4px;
              flex: 1;
              width: 100%;
              display: flex;
              flex-flow: row nowrap;
              justify-content: flex-start;
              align-items: center;
              span {
                vertical-align: top;
                display: inline-block;
                text-align: center;
                width: 30%;
                background: #1b88ff;
                line-height: 35px;
                height: 35px;
                font-size: 15px;
                color: #fff;
                margin-right: 3%;
                border-radius: 20px;
                &:nth-child(3) {
                  color: #1b88ff;
                  background: #fff;
                  border: 1px solid #1b88ff;
                  text-align: center
                }
                &:nth-child(4) {
                  margin-right: 0;
                  color: #1b88ff;
                  background: #fff;
                  border: 1px solid #1b88ff;
                  text-align: center
                };
                &:last-child {
                  margin-right: 0
                }
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
         padding-bottom: 10px;
         box-sizing: border-box;
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
       }
        .task-status-list {
          flex: 1;
          overflow: auto;
         .wait-handle-list {
          padding: 10px !important;
          box-sizing: border-box !important;
          .get-wait-task {
            justify-content: center !important;
          }
         }  
       }
    };
    .wait-handle {
      .wait-handle-list {
        box-sizing: border-box;
        position: relative;
        width: 94%;
        margin:0 auto;
        background: #fff;
        padding: 25px 10px 10px 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
        .list-status {
          width: 80px;
          height: 30px;
          position: absolute;
          text-align: center;
          line-height: 30px;
          top: 8px;
          right: -10px;
          img {
            width: 100%;
            height: 100%
          }
        };
        .area-code {
          position: absolute;
          top: 4px;
          left: 5px;
          width: 40px;
          height: 40px;
          img {
            width: 100%;
            height: 100%
          }
        };
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
            min-height: 35px;
            line-height: 35px;
            overflow: auto;
            margin-left: -4px;
            .natureNormalStyle {
              color: #b1d676 !important
            };
            .natureImportantStyle {
              color: red !important;
              font-weight: bold;
            };
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
                color: black;
              }
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
            line-height: 20px;
            overflow: auto;
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
        .wait-handle-message-bottom {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .wait-handle-check {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          };
          .get-wait-task {
            margin-top: 4px;
            flex: 1;
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            span {
              vertical-align: top;
              display: inline-block;
              text-align: center;
              width: 30%;
              background: #1b88ff;
              line-height: 35px;
              height: 35px;
              font-size: 15px;
              color: #fff;
              margin-right: 20px;
              border-radius: 20px;
              &:nth-child(3) {
                color: #1b88ff;
                background: #fff;
                border: 1px solid #1b88ff;
                text-align: center
              }
              &:nth-child(4) {
                margin-right: 0;
                color: #1b88ff;
                background: #fff;
                border: 1px solid #1b88ff;
                text-align: center
              };
              &:last-child {
                margin-right: 0
              }
            }
          }
        }
      }
    };
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
          right: -10px;
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
            min-height: 35px;
            line-height: 35px;
            overflow: auto;
            margin-left: -4px;
            .natureNormalStyle {
              color: #b1d676 !important
            };
            .natureImportantStyle {
              color: red !important;
              font-weight: bold;
            };
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
                color: black;
              }
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
            line-height: 20px;
            overflow: auto;
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
        .wait-handle-message-bottom {
          display: flex;
          flex-flow: row nowrap;
          justify-content: space-between;
          align-items: center;
          .wait-handle-check {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          };
          .get-wait-task {
            margin-top: 4px;
            flex: 1;
            width: 100%;
            display: flex;
            flex-flow: row nowrap;
            justify-content: center;
            align-items: center;
            span {
              vertical-align: top;
              display: inline-block;
              text-align: center;
              width: 30%;
              background: #1b88ff;
              line-height: 35px;
              height: 35px;
              font-size: 15px;
              color: #fff;
              margin-right: 20px;
              border-radius: 20px;
              &:nth-child(3) {
                color: #1b88ff;
                background: #fff;
                border: 1px solid #1b88ff;
                text-align: center
              }
              &:nth-child(4) {
                margin-right: 0;
                color: #1b88ff;
                background: #fff;
                border: 1px solid #1b88ff;
                text-align: center
              };
              &:last-child {
                margin-right: 0
              }
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
