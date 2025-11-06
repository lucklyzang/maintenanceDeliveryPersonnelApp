<template>
  <div class="content-wrapper">
   <div class="no-data" v-show="noDataShow">
      <NoData></NoData>
    </div>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="加载中,请稍候····" textColor=""></loading>
    </div>
    <!-- 工作人员操作区域 v-if="workerShow-->
    <div class="worker-show" v-if="workerShow">
      <!-- 顶部导航栏 -->
      <HeaderTop :title="navTopTitle">
        <div class="header-left" slot="left" @click="backTo">
          <van-icon name="wap-home" color="#fff" size="22"></van-icon>
          <span>首页</span>
        </div>
      </HeaderTop>
      <!-- 右边下拉框菜单 -->
      <ul class="left-dropDown" v-show="leftDownShow">
        <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
      </ul>
      <!-- 内容部分 -->
      <div class="content-top">
        <div class="content-top-userName">
          <div class="content-top-userName-left">
            <span class="content-top-userName-img">
              <img :src="sex == 1 ? defaultPersonManPng : defaultPersonWomanPng" alt="">
            </span>
            <span class="real-name">{{ userName }}</span>
          </div>
          <div class="content-top-userName-right">
            <span class="scan-code" @click="scanCodeEvent">扫描任务二维码</span>
          </div>  
        </div>
        <div class="wait-dask-wrapper">
          <div class="wait-dask-img-box">
            <img :src="taskInfoPng" alt="">
          </div>
          <ul class="wait-dask-list">
            <li v-show="item.number !== 0" :class="{listTaskStyle: index == 0 && isHaveTask != ''}" @click="taskEvent(item)" v-for="(item,index) in taskTypeList" :key="`${item}-${index}`">
              {{item.text}}
              <span class="dask-list-sign" :class="{daskListSignStyle:index == 0 && isHaveTask != ''}">{{item.number}}</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="content-middle-task-message">
        <div class="task-message-number-wrapper">
          <div class="task-message-number">
            <p class="task-message-img">
              <img :src="homeBannerPng" alt="">
            </p>
            <p class="transport-day-number">
              <span class="current-day-message-tit">昨日运送量</span>
              <span>{{yesterdayNumber}}</span>
            </p>
            <p class="transport-day-rank">
              <span>昨日排名</span>
              <span>{{yesterdayRank}}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="content-bottom">
        <ul class="task-button">
          <li v-for="(item,index) in taskList" :key="index" @click="taskRouterSkip(item.tit, index)">
            <p class="task-button-wrapper">
              <img :src="btnTaskWrapperPng" alt="">
            </p>
            <p class="task-btn-img">
              <img :src="item.imgUrl" alt="">
            </p>
            <p  class="task-btn-tit">{{item.tit}}</p>
          </li>
        </ul>
        <p class="task-version">
          <span>{{ versionNumber }}</span>
        </p>
      </div>
    </div>
    <!-- 医护人员操作区域 -->
    <div class="medical-worker-show" v-else>
      <!-- 顶部导航栏 -->
      <HeaderTop :title="navTopTitle">
        <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>
      </HeaderTop>
       <!-- 右边下拉框菜单 -->
      <ul class="left-dropDown" v-show="leftDownShow">
        <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
      </ul>
      <div class="medical-worker-operate">
        <div class="medical-worker-operate-left">
          <div class="medical-worker-operate-list">
            <div class="medical-worker-operate-list-inner" :class="{'operate-list-inner-style': operateListInnerIndex == index}" v-for="(item,index) in operateList" :key="index" @click="operateListEvent(item,index)">
              <p class="operate-list-img">
                <img :src="operateListInnerIndex == index ? item.imgUrlChecked : item.imgUrl" alt="">
              </p>
              <p class="operate-list-tit">{{item.tit}}</p>
            </div>
          </div>
        </div>
        <div class="medical-worker-operate-right">
          <div class="medical-worker-operate-right-inner">
            <div class="medical-worker-operate-right-message" v-show="operateMessage == 1">
              <p>消息</p>
            </div>
            <div class="medical-worker-operate-right-callOut" v-show="operateCallOut == 2">
              <p class="medical-worker-transport-type">运送类型</p>
              <p v-for="(item,index) in transPortTypeList" :key="index" @click="typeClick(item)">
                {{item.value}}
                <van-icon name="arrow"/>
              </p>
            </div>
            <van-pull-refresh class="wait-handle-box"  v-show="operateTaskTrace == 3" v-model="isRefresh" @refresh="onRefresh" success-text="刷新成功">
              <div class="medical-worker-operate-right-taskTrace">
                <p>任务跟踪</p>
                <div class="task-list-trace">
                  <div class="task-list-inner" v-for="(item,index) in taskTraceList" :key="`${item}-${index}`">
                    <div class="wait-handle-message">
                      <div class="handle-message-line-wrapper">
                        <p>
                          <span class="message-tit">出发地:</span>
                          <span class="message-tit-real message-tit-real-style">{{item.setOutPlaceName}}</span>
                        </p>
                        <P class="destiname-line" v-if="templateType === 'template_one'">
                          <span class="message-tit">目的地:</span>
                          <span class="message-tit-real message-tit-real-style">
                            {{ !item.destinationName  ? '无' : item.destinationName }}
                          </span>
                        </P>
                        <P class="destiname-line" v-else-if="templateType == 'template_two'">
                          <span class="message-tit">目的地:</span>
                          <span v-for="(itemInner,indexInner) in item.destinationName"
                                :key="`${itemInner}-${indexInner}`"
                                class="message-tit-real message-tit-real-style">
                            {{item.destinationName.length > 0 ? itemInner.destinationName : '无'}}
                          </span>
                        </P>
                        <p v-if="templateType == 'template_one'">
                          <span class="message-tit">运送类型:</span>
                          <span class="message-tit-real">{{item.taskTypeName}}</span>
                        </p>
                        <p v-else-if="templateType == 'template_two'">
                          <span class="message-tit">运送类型:</span>
                          <span class="message-tit-real">{{item.patientInfoList[0]['typeList'].length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</span>
                        </p>
                        <P>
                          <span class="message-tit">状态:</span>
                          <span class="message-tit-real" style="color:red">{{stateTransfer(item.state)}}</span>
                        </P>
                        <p>
                          <span class="message-tit">运送人:</span>
                          <span class="message-tit-real">{{item.workerName}}</span>
                        </p>
                        <P v-if="templateType == 'template_one'">
                          <span class="message-tit">床号:</span>
                          <span class="message-tit-real message-tit-real-style">{{item.bedNumber}}</span>
                        </P>
                        <P v-else-if="templateType == 'template_two'">
                          <span class="message-tit">床号:</span>
                          <span class="message-tit-real message-tit-real-style">{{ extractBedNumber(item['patientInfoList']) }}</span>
                        </P>
                        <p v-if="templateType == 'template_one'">
                          <span class="message-tit">病人:</span>
                          <span class="message-tit-real">{{item.patientName}}</span>
                        </p>
                        <P v-else-if="templateType == 'template_two'">
                          <span class="message-tit">病人:</span>
                          <span class="message-tit-real message-tit-real-style">{{ extractPatientName(item['patientInfoList']) }}</span>
                        </P>
                        <P>
                          <span class="message-tit">转运工具:</span>
                          <span class="message-tit-real message-tit-real-style">{{item.toolName}}</span>
                        </P>
                      </div>
                    </div>
                    <div class="contact-isolation-box">
                      <img :src="contactIsolationPng" v-if="templateType == 'template_one' && item.quarantine == 1" />
								      <img :src="contactIsolationPng" v-if="templateType == 'template_two' && item['patientInfoList'].some((el) => { return el.quarantine == 1})" />
                    </div>
                    <div class="btn-area-trace">
                      <span @click="reminderTask(item)">
                        催单
                      </span>
                      <span @click="taskCancel(item)">
                        取消
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </van-pull-refresh>
            <div class="medical-worker-operate-right-historyTask" v-show="operateHistoryTask == 4">
              <!--任务切换栏-->
              <div class="task-switch">
                <span v-for="(item,index) in taskNameList" :class="{'active-tab-style':taskNameIndex === index}" :key="index" @click="tabSwitchEvent(item,index)">{{item.name}}</span>
              </div>
                <div class="historyTask-box">
                  <div class="historyTask-list-box historyTask-list-dispatch-box" v-if="taskNameIndex === 0">
                    <div class="time-search">
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
                        @cancel="startTimePop = false"  @confirm="confirmEvent"  @change="startTimeChange"/>
                      </van-popup>
                      <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true">
                        <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
                        @cancel="endTimePop = false"  @confirm="endConfirmEvent"  @change="endTimeChange"/>
                      </van-popup>
                    </div>
<!--                <p class="middle-top-search">-->
<!--                  <span>-->
<!--                    <img :src="taskSearchPng" alt="" @click.stop="searchCompleteTask">-->
<!--                  </span>-->
<!--                </p>-->
                    <van-tabs v-model="activetaskDispatch" @click="onClickTab">
                      <van-tab name="0">
                        <div slot="title">
                          <span class="title">已完成</span>
                          <span class="right-sign sign-not-in" v-show="currentIndex == 0 && taskNameIndex === 0">{{taskCount}}</span>
                        </div>
                        <div class="historyTask-list">
                          <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                            <div class="wait-handle-message">
                              <div class="wait-handle-message-top">
                                <p>
                                  编号: {{item.taskNumber}}
                                </p>
                                <p>
                                  <img :src="contactIsolationPng" v-if="templateType == 'template_one' && item.quarantine == 1">
                                  <img :src="contactIsolationPng" v-else-if="templateType == 'template_two' && item['patientInfoList'].some((el) => { return el.quarantine == 1})">
                                </p>
                                <p>
                                    {{stateTransfer(item.state)}}
                                </p>
                              </div>
                              <div class="wait-handle-message-middle">
                                <p v-if="templateType == 'template_one'">
                                  <span class="message-tit">运送类型:</span>
                                  <span class="message-tit-real">{{item.taskTypeName ? item.taskTypeName : '无'}}</span>
                                </p>
                                <p v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">运送类型:</span>
                                  <span class="message-tit-real">{{item.patientInfoList[0]['typeList'].length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</span>
                                </p>
                              </div>
                              <div class="handle-message-line-wrapper">
                                <P>
                                  <span class="message-tit">出发地:</span>
                                  <span class="message-tit-real">{{item.setOutPlaceName}}</span>
                                </P>
                               <P class="destiname-line" v-if="templateType === 'template_one'">
                                  <span class="message-tit">目的地:</span>
                                  <span class="message-tit-real message-tit-real-style">
                                    {{ !item.destinationName  ? '无' : item.destinationName }}
                                  </span>
                                </P>
                                <P class="destiname-line" v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">目的地:</span>
                                  <span v-for="(itemInner,indexInner) in item.destinationName"
                                        :key="`${itemInner}-${indexInner}`"
                                        class="message-tit-real message-tit-real-style">
                                    {{item.destinationName.length > 0 ? itemInner.destinationName : '无'}}
                                  </span>
                                </P>
                              </div>
                              <div class="handle-message-line-wrapper">
                                <p>
                                  <span class="message-tit">优先级:</span>
                                  <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
                                </p>
                                <P v-if="templateType == 'template_one'">
                                  <span class="message-tit">床号:</span>
                                  <span class="message-tit-real message-tit-real-style">{{item.bedNumber ? item.bedNumber : '无'}}</span>
                                </P>
                                <P v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">床号:</span>
                                  <span class="message-tit-real message-tit-real-style">{{ extractBedNumber(item['patientInfoList']) }}</span>
                                </P>
                              </div>
                              <div class="handle-message-line-wrapper">
                                <p class="adimission-number" v-if="templateType == 'template_one'">
                                  <span class="message-tit">住院号:</span>
                                  <span class="message-tit-real">{{item.patientNumber}}</span>
                                </p>
                                <p class="adimission-number" v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">住院号:</span>
                                  <span class="message-tit-real">{{ extractAdmissionNumber(item.patientInfoList) }}</span>
                                </p>
                                <p>
                                  <span class="message-tit">运送工具:</span>
                                  <span class="message-tit-real">{{item.toolName}}</span>
                                </p>
                              </div>
                              <!-- <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                <p>
                                  <span class="message-tit">接触隔离:</span>
                                  <span class="message-tit-real">是</span>
                                </p>
                              </div> -->
<!--                              <div class="handle-message-line-wrapper">-->
<!--                                <p>-->
<!--                                  <span class="message-tit">出发地拍照:</span>-->
<!--                                  <span class="message-tit-real">{{item.startPhoto == 0 ? '否' : '是'}}</span>-->
<!--                                </p>-->
<!--                                <p>-->
<!--                                  <span class="message-tit">目的地拍照:</span>-->
<!--                                  <span class="message-tit-real">{{item.endPhoto == 0 ? '否' : '是'}}</span>-->
<!--                                </p>-->
<!--                              </div>-->
<!--                              <div class="handle-message-line-wrapper">-->
<!--                                <p>-->
<!--                                  <span class="message-tit">签字:</span>-->
<!--                                  <span class="message-tit-real">{{item.isSign == 0 ? '否' : '是'}}</span>-->
<!--                                </p>-->
<!--                                <p>-->
<!--                                  <span class="message-tit">回到出发地:</span>-->
<!--                                  <span class="message-tit-real">{{item.isBack == 0 ? '否' : '是'}}</span>-->
<!--                                </p>-->
<!--                              </div>-->
<!--                              <div class="handle-message-line-wrapper">-->
<!--                                <p v-if="templateType == 'template_one'">-->
<!--                                  <span class="message-tit">病人:</span>-->
<!--                                  <span class="message-tit-real">{{item.patientName}}</span>-->
<!--                                </p>-->
<!--                                <P v-else-if="templateType == 'template_two'">-->
<!--                                  <span class="message-tit">病人:</span>-->
<!--                                  <span class="message-tit-real message-tit-real-style">{{item['patientInfoList'][0]['patientName']}}</span>-->
<!--                                </P>-->
<!--                              </div>-->
                              <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                <p>
                                  <span class="message-tit">订单创建时间:</span>
                                  <span class="message-tit-real">{{item.createTime}}</span>
                                </p>
                              </div>
                              <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                <p>
                                  <span class="message-tit">完成时间:</span>
                                  <span class="message-tit-real">{{item.finishTime}}</span>
                                </p>
                              </div>
                              <!-- 反馈区域 -->
                              <div class="feedback-area">
                                <div class="feedback-top">
                                  <div class="left">
                                    <van-icon name="manager" size="20" />
                                    <span>运送人:</span>
                                    <span>{{item.workerName}}</span>
                                  </div>
                                  <div class="right" v-show="!item.isShowGiveLikeIconStyle && !item.isIssueFeedback && templateType == 'template_one' && item.feedbackFlag == 0">
                                    <div class="left-feedback-icon"  @click="feedBackEvent(item,index,1)">
                                      <van-icon name="triangle-bottom" class="iconfont" class-prefix="icon" size="20" :color="item.isShowFeedBackIconStyle ? 'orange' : '#a59f9f'" />
                                    </div>
                                    <div class="right-like-icon" @click="giveLikeEvent(item,index,1,'点赞')">
                                      <van-icon name="triangle-top" class="iconfont" class-prefix="icon" size="20" :color="item.isShowGiveLikeIconStyle ? 'orange' : '#a59f9f'" />
                                      <span :class="{'give-like-text-style':item.isShowGiveLikeIconStyle}">
                                        点赞
                                      </span>
                                    </div>
                                  </div>
                                  <div class="thank-feedback" v-show="(item.isShowGiveLikeIconStyle || item.isIssueFeedback || item.feedbackFlag == 1) && templateType == 'template_one'">
                                    感谢您的反馈!
                                  </div>
                                </div>
                                <div class="feedback-bottom" v-show="item.isShowFeedBack">
                                  <div class="idea-feedback">
                                    请输入你的反馈意见
                                  </div>
                                  <van-field
                                    rows="4"
                                    v-model="item.deedbackContent"
                                    type="textarea"
                                    maxlength="2000"
                                    show-word-limit
                                    placeholder="请输入你的反馈意见"
                                  />
                                  <div class="guess-speak">
                                    猜你想说
                                  </div>
                                  <div class="guess-speak-list">
                                    <span v-for="(innerItem,innerIndex) in guessSpeakList" @click="guessSpeakListEvent(index,innerItem,innerIndex)" :key="innerIndex">{{innerItem.name}}</span>
                                  </div>
                                  <div class="submit-feedback" @click="submitTaskFeedBack(item,index,1,'反对')">
                                    提交反馈
                                  </div>
                                </div>
                              </div>
                              <p class="wait-handle-check" v-show="item.state == 2 ">
                                <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                              </p>
                            </div>
                            <p class="get-wait-task">
                              <span v-show="item.state == '1'">
                                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                              </span>
                            </p>
                          </div>
                        </div>
                      </van-tab>
                      <van-tab name="1" >
                        <div slot="title">
                          <span class="title">已取消</span>
                          <span class="right-sign sign-not-in" v-show="currentIndex == 1 && taskNameIndex === 0">{{taskCount}}</span>
                        </div>
                        <div class="historyTask-list historyTask-list-cancel">
                          <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                            <div class="wait-handle-message">
                              <div class="wait-handle-message-top">
                                <p>
                                  编号: {{item.taskNumber}}
                                </p>
                                <p>
                                  <img :src="contactIsolationPng" v-if="templateType == 'template_one' && item.quarantine == 1">
                                  <img :src="contactIsolationPng" v-else-if="templateType == 'template_two' && item['patientInfoList'].some((el) => { return el.quarantine == 1})">
                                </p>
                                <p>
                                  {{stateTransfer(item.state)}}
                                </p>
                              </div>
                              <div class="wait-handle-message-middle">
                                <p v-if="templateType == 'template_one'">
                                  <span class="message-tit">运送类型:</span>
                                  <span class="message-tit-real">{{item.taskTypeName ? item.taskTypeName : '无'}}</span>
                                </p>
                                <p v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">运送类型:</span>
                                  <span class="message-tit-real">{{item.patientInfoList[0]['typeList'].length > 0 ? item.patientInfoList[0].typeList[0].parentTypeName : '无'}}</span>
                                </p>
                              </div>
                              <div class="handle-message-line-wrapper">
                                <P>
                                  <span class="message-tit">出发地:</span>
                                  <span class="message-tit-real">{{item.setOutPlaceName}}</span>
                                </P>
                               <P class="destiname-line" v-if="templateType === 'template_one'">
                                  <span class="message-tit">目的地:</span>
                                  <span class="message-tit-real message-tit-real-style">
                                    {{ !item.destinationName  ? '无' : item.destinationName }}
                                  </span>
                                </P>
                                <P class="destiname-line" v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">目的地:</span>
                                  <span v-for="(itemInner,indexInner) in item.destinationName"
                                        :key="`${itemInner}-${indexInner}`"
                                        class="message-tit-real message-tit-real-style">
                                    {{ item.destinationName.length > 0 ? itemInner.destinationName : '无' }}
                                  </span>
                                </P>
                              </div>
                              <div class="handle-message-line-wrapper">
                                <p>
                                  <span class="message-tit">优先级:</span>
                                  <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
                                </p>
                                <P v-if="templateType == 'template_one'">
                                  <span class="message-tit">床号:</span>
                                  <span class="message-tit-real message-tit-real-style">{{item.bedNumber ? item.bedNumber : '无'}}</span>
                                </P>
                                <P v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">床号:</span>
                                  <span class="message-tit-real message-tit-real-style">{{ extractBedNumber(item['patientInfoList']) }}</span>
                                </P>
                              </div>
                              <div class="handle-message-line-wrapper">
                               <p class="adimission-number" v-if="templateType == 'template_one'">
                                  <span class="message-tit">住院号:</span>
                                  <span class="message-tit-real">{{item.patientNumber}}</span>
                                </p>
                                <p class="adimission-number" v-else-if="templateType == 'template_two'">
                                  <span class="message-tit">住院号:</span>
                                  <span class="message-tit-real">{{ extractAdmissionNumber(item.patientInfoList) }}</span>
                                </p>
                                <p>
                                  <span class="message-tit">运送工具:</span>
                                  <span class="message-tit-real">{{item.toolName}}</span>
                                </p>
                              </div>
                              <!-- <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                <p>
                                  <span class="message-tit">接触隔离:</span>
                                  <span class="message-tit-real">是</span>
                                </p>
                              </div> -->
                                <!-- <div class="handle-message-line-wrapper">
                                  <p v-if="templateType == 'template_one'">
                                    <span class="message-tit">病人:</span>
                                    <span class="message-tit-real">{{item.patientName}}</span>
                                  </p>
                                  <P v-else-if="templateType == 'template_two'">
                                    <span class="message-tit">病人:</span>
                                    <span class="message-tit-real message-tit-real-style">{{item['patientInfoList'][0]['patientName']}}</span>
                                  </P>
                                </div> -->
                              <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                <p>
                                  <span class="message-tit">订单创建时间:</span>
                                  <span class="message-tit-real">{{item.createTime}}</span>
                                </p>
                              </div>
                              <div class="feedback-area">
                                <div class="feedback-top">
                                  <div class="left">
                                    <van-icon name="manager" size="20" />
                                    <span>运送人:</span>
                                    <span>{{item.workerName}}</span>
                                  </div>
                                </div>
                              </div>  
                              <p class="wait-handle-check" v-show="item.state == 2 ">
                                <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                              </p>
                            </div>
                            <p class="get-wait-task">
                              <span v-show="item.state == '1'">
                                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                              </span>
                            </p>
                          </div>
                        </div>
                      </van-tab>
                    </van-tabs>
                    </div>
                  <div class="historyTask-list-box historyTask-list-appoint-box" v-if="taskNameIndex === 1">
                      <div class="time-search">
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
                                                @cancel="startTimePop = false"  @confirm="confirmEvent"  @change="startTimeChange"/>
                        </van-popup>
                        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true">
                          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
                                                @cancel="endTimePop = false"  @confirm="endConfirmEvent"  @change="endTimeChange"/>
                        </van-popup>
                      </div>
                      <!--                <p class="middle-top-search">-->
                      <!--                  <span>-->
                      <!--                    <img :src="taskSearchPng" alt="" @click.stop="searchCompleteTask">-->
                      <!--                  </span>-->
                      <!--                </p>-->
                      <van-tabs v-model="activetaskAppoint" @click="onClickTab">
                        <van-tab name="0">
                          <div slot="title">
                            <span class="title">已完成</span>
                            <span class="right-sign sign-not-in" v-show="currentIndex == 0 && taskNameIndex === 1">{{taskCount}}</span>
                          </div>
                          <div class="historyTask-list">
                            <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                              <div class="wait-handle-message">
                                <div class="wait-handle-message-top">
                                  <p>
                                    编号:{{item.taskNumber}}
                                  </p>
                                  <p>
                                    <img :src="contactIsolationPng" v-if="item.quarantine == 1">
                                  </p>
                                  <p>
                                    {{stateTransfer(item.state)}}
                                  </p>
                                </div>
                                <div class="wait-handle-message-middle">
                                  <p>
                                    <span class="message-tit">检查类型:</span>
                                    <span class="message-tit-real">{{item.taskTypeName.length > 0 ? item.taskTypeName.join(";") : '无'}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper">
                                  <P>
                                    <span class="message-tit">出发地:</span>
                                    <span class="message-tit-real">{{item.setOutPlaceName}}</span>
                                  </P>
                                  <p>
                                    <span class="message-tit">目的地:</span>
                                    <span style="margin-right: 4px;" class="message-tit-real" v-for="(itemInner,indexInner) in item.distName" :key="`${itemInner}-${indexInner}`">{{item.distName.length > 0 ? itemInner : '无'}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper">
                                  <p>
                                    <span class="message-tit">优先级:</span>
                                    <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
                                  </p>
                                  <P>
                                    <span class="message-tit">床号:</span>
                                    <span class="message-tit-real message-tit-real-style">{{item.bedNumber}}</span>
                                  </P>
                                </div>
                                <div class="handle-message-line-wrapper">
                                  <p class="adimission-number">
                                    <span class="message-tit">住院号:</span>
                                    <span class="message-tit-real">{{item.patientNumber}}</span>
                                  </p>
                                  <p>
                                    <span class="message-tit">运送工具:</span>
                                    <span class="message-tit-real">{{item.toolName}}</span>
                                  </p>
                                </div>
                                <!-- <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">接触隔离:</span>
                                    <span class="message-tit-real">是</span>
                                  </p>
                                </div> -->
                                <!--                              <div class="handle-message-line-wrapper">-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">出发地拍照:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.startPhoto == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">目的地拍照:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.endPhoto == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                              </div>-->
                                <!--                              <div class="handle-message-line-wrapper">-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">签字:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.isSign == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">回到出发地:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.isBack == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                              </div>-->
                                <!--                              <div class="handle-message-line-wrapper">-->
                                <!--                                <p v-if="templateType == 'template_one'">-->
                                <!--                                  <span class="message-tit">病人:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.patientName}}</span>-->
                                <!--                                </p>-->
                                <!--                                <P v-else-if="templateType == 'template_two'">-->
                                <!--                                  <span class="message-tit">病人:</span>-->
                                <!--                                  <span class="message-tit-real message-tit-real-style">{{item['patientInfoList'][0]['patientName']}}</span>-->
                                <!--                                </P>-->
                                <!--                              </div>-->
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">订单创建时间:</span>
                                    <span class="message-tit-real">{{item.createTime}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">完成时间:</span>
                                    <span class="message-tit-real">{{item.finishTime}}</span>
                                  </p>
                                </div>
                                <!-- 反馈区域 -->
                              <div class="feedback-area">
                                <div class="feedback-top">
                                  <div class="left">
                                    <van-icon name="manager" size="20" />
                                    <span>运送人:</span>
                                    <span>{{item.workerName}}</span>
                                  </div>
                                  <div class="right" v-show="!item.isShowGiveLikeIconStyle && !item.isIssueFeedback && templateType == 'template_one' && item.feedbackFlag == 0">
                                    <div class="left-feedback-icon"  @click="feedBackEvent(item,index,2)">
                                      <van-icon name="triangle-bottom" class="iconfont" class-prefix="icon" size="20" :color="item.isShowFeedBackIconStyle ? 'orange' : '#a59f9f'" />
                                    </div>
                                    <div class="right-like-icon" @click="giveLikeEvent(item,index,2,'点赞')">
                                      <van-icon name="triangle-top" class="iconfont" class-prefix="icon" size="20" :color="item.isShowGiveLikeIconStyle ? 'orange' : '#a59f9f'" />
                                      <span :class="{'give-like-text-style':item.isShowGiveLikeIconStyle}">
                                        点赞
                                      </span>
                                    </div>
                                  </div>
                                  <div class="thank-feedback" v-show="(item.isShowGiveLikeIconStyle || item.isIssueFeedback || item.feedbackFlag == 1) && templateType == 'template_one'">
                                    感谢您的反馈!
                                  </div>
                                </div>
                                <div class="feedback-bottom" v-show="item.isShowFeedBack">
                                  <div class="idea-feedback">
                                    请输入你的反馈意见
                                  </div>
                                  <van-field
                                    rows="4"
                                    v-model="item.deedbackContent"
                                    type="textarea"
                                    maxlength="2000"
                                    show-word-limit
                                    placeholder="请输入你的反馈意见"
                                  />
                                  <div class="guess-speak">
                                    猜你想说
                                  </div>
                                  <div class="guess-speak-list">
                                    <span v-for="(innerItem,innerIndex) in guessSpeakList" @click="guessSpeakListEvent(index,innerItem,innerIndex)" :key="innerIndex">{{innerItem.name}}</span>
                                  </div>
                                  <div class="submit-feedback" @click="submitTaskFeedBack(item,index,2,'反对')">
                                    提交反馈
                                  </div>
                                </div>
                              </div>
                              <p class="wait-handle-check" v-show="item.state == 2 ">
                                <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                              </p>
                              </div>
                              <p class="get-wait-task">
                              <span v-show="item.state == '1'">
                                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                              </span>
                              </p>
                            </div>
                          </div>
                        </van-tab>
                        <van-tab name="1" >
                          <div slot="title">
                            <span class="title">已取消</span>
                            <span class="right-sign sign-not-in" v-show="currentIndex == 1 && taskNameIndex === 1">{{taskCount}}</span>
                          </div>
                          <div class="historyTask-list historyTask-list-cancel">
                            <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                              <div class="wait-handle-message">
                                <div class="wait-handle-message-top">
                                  <p>
                                    编号:{{item.taskNumber}}
                                  </p>
                                  <p>
                                    <img :src="contactIsolationPng" v-if="item.quarantine == 1">
                                  </p>
                                  <p>
                                    {{stateTransfer(item.state)}}
                                  </p>
                                </div>
                                <div class="wait-handle-message-middle">
                                  <p>
                                    <span class="message-tit">检查类型:</span>
                                    <span class="message-tit-real">{{item.taskTypeName.length > 0 ? item.taskTypeName.join(";") : '无'}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper">
                                  <P>
                                    <span class="message-tit">出发地:</span>
                                    <span class="message-tit-real">{{item.setOutPlaceName}}</span>
                                  </P>
                                  <p>
                                    <span class="message-tit">目的地:</span>
                                    <span style="margin-right: 4px;" class="message-tit-real" v-for="(itemInner,indexInner) in item.distName" :key="`${itemInner}-${indexInner}`">{{item.distName.length > 0 ? itemInner : '无'}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper">
                                  <p>
                                    <span class="message-tit">优先级:</span>
                                    <span class="message-tit-real">{{priorityTransfer(item.priority)}}</span>
                                  </p>
                                  <P>
                                    <span class="message-tit">床号:</span>
                                    <span class="message-tit-real message-tit-real-style">{{item.bedNumber}}</span>
                                  </P>
                                </div>
                                <div class="handle-message-line-wrapper">
                                  <p class="adimission-number">
                                    <span class="message-tit">住院号:</span>
                                    <span class="message-tit-real">{{item.patientNumber}}</span>
                                  </p>
                                  <p>
                                    <span class="message-tit">运送工具:</span>
                                    <span class="message-tit-real">{{item.toolName}}</span>
                                  </p>
                                </div>
                                <!-- <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">接触隔离:</span>
                                    <span class="message-tit-real">是</span>
                                  </p>
                                </div> -->
                                <!--                              <div class="handle-message-line-wrapper">-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">出发地拍照:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.startPhoto == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">目的地拍照:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.endPhoto == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                              </div>-->
                                <!--                              <div class="handle-message-line-wrapper">-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">签字:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.isSign == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                                <p>-->
                                <!--                                  <span class="message-tit">回到出发地:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.isBack == 0 ? '否' : '是'}}</span>-->
                                <!--                                </p>-->
                                <!--                              </div>-->
                                <!--                              <div class="handle-message-line-wrapper">-->
                                <!--                                <p v-if="templateType == 'template_one'">-->
                                <!--                                  <span class="message-tit">病人:</span>-->
                                <!--                                  <span class="message-tit-real">{{item.patientName}}</span>-->
                                <!--                                </p>-->
                                <!--                                <P v-else-if="templateType == 'template_two'">-->
                                <!--                                  <span class="message-tit">病人:</span>-->
                                <!--                                  <span class="message-tit-real message-tit-real-style">{{item['patientInfoList'][0]['patientName']}}</span>-->
                                <!--                                </P>-->
                                <!--                              </div>-->
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">订单创建时间:</span>
                                    <span class="message-tit-real">{{item.createTime}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">完成时间:</span>
                                    <span class="message-tit-real">{{item.finishTime}}</span>
                                  </p>
                                </div>
                                <div class="feedback-area">
                                  <div class="feedback-top">
                                    <div class="left">
                                      <van-icon name="manager" size="20" />
                                      <span>运送人:</span>
                                      <span>{{item.workerName}}</span>
                                    </div>
                                  </div>
                                </div>  
                                <p class="wait-handle-check" v-show="item.state == 2 ">
                                  <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                                </p>
                              </div>
                              <p class="get-wait-task">
                              <span v-show="item.state == '1'">
                                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                              </span>
                              </p>
                            </div>
                          </div>
                        </van-tab>
                      </van-tabs>
                    </div>
                  <div class="historyTask-list-box historyTask-list-circulation-box" v-if="taskNameIndex === 2">
                      <div class="time-search">
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
                                                @cancel="startTimePop = false"  @confirm="confirmEvent"  @change="startTimeChange"/>
                        </van-popup>
                        <van-popup v-model="endTimePop" label="离开时间" position="bottom" :overlay="true">
                          <van-datetime-picker  v-model="currentDateEnd"  type="date"  :min-date="minDateEnd"
                                                @cancel="endTimePop = false"  @confirm="endConfirmEvent"  @change="endTimeChange"/>
                        </van-popup>
                      </div>
                      <!--                <p class="middle-top-search">-->
                      <!--                  <span>-->
                      <!--                    <img :src="taskSearchPng" alt="" @click.stop="searchCompleteTask">-->
                      <!--                  </span>-->
                      <!--                </p>-->
                      <van-tabs v-model="activetaskCirculation" @click="onClickTab">
                        <van-tab name="0">
                          <div slot="title">
                            <span class="title">已完成</span>
                            <span class="right-sign sign-not-in" v-show="currentIndex == 0 && taskNameIndex === 2">{{taskCount}}</span>
                          </div>
                          <div class="historyTask-list">
                            <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                              <div class="wait-handle-message">
                                <div class="wait-handle-message-top">
                                  <p>
                                    编号: {{item.taskNumber}}
                                  </p>
                                  <p>
                                    {{stateTransfer(item.state)}}
                                  </p>
                                </div>
                                <div class="wait-handle-message-middle">
                                  <p>
                                    <span class="message-tit">任务名称:</span>
                                    <span class="message-tit-real">{{item.taskTypeName}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">预计开始时间:</span>
                                    <span class="message-tit-real">{{item.startTime}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">实际开始时间:</span>
                                    <span class="message-tit-real">{{item.startUpTime}}</span>
                                  </p>
                                </div>
                                <div class="dist-list">
                                  <span v-for="(innerItem,innerIndex) in item.distName" :key="innerIndex">{{innerItem.name}}</span>
                                </div>
                                <!-- 反馈区域 -->
                              <div class="feedback-area">
                                <div class="feedback-top">
                                  <div class="left">
                                    <van-icon name="manager" size="20" />
                                    <span>运送人:</span>
                                    <span>{{item.workerName}}</span>
                                  </div>
                                <div class="right" v-show="!item.isShowGiveLikeIconStyle && !item.isIssueFeedback && templateType == 'template_one' && item.feedbackFlag == 0">
                                    <div class="left-feedback-icon"  @click="feedBackEvent(item,index,3)">
                                      <van-icon name="triangle-bottom" class="iconfont" class-prefix="icon" size="20" :color="item.isShowFeedBackIconStyle ? 'orange' : '#a59f9f'" />
                                    </div>
                                    <div class="right-like-icon" @click="giveLikeEvent(item,index,3,'点赞')">
                                      <van-icon name="triangle-top" class="iconfont" class-prefix="icon" size="20" :color="item.isShowGiveLikeIconStyle ? 'orange' : '#a59f9f'" />
                                      <span :class="{'give-like-text-style':item.isShowGiveLikeIconStyle}">
                                        点赞
                                      </span>
                                    </div>
                                  </div>
                                  <div class="thank-feedback" v-show="(item.isShowGiveLikeIconStyle || item.isIssueFeedback || item.feedbackFlag == 1) && templateType == 'template_one'">
                                    感谢您的反馈!
                                  </div>
                                </div>
                                <div class="feedback-bottom" v-show="item.isShowFeedBack">
                                  <div class="idea-feedback">
                                    请输入你的反馈意见
                                  </div>
                                  <van-field
                                    rows="4"
                                    v-model="item.deedbackContent"
                                    type="textarea"
                                    maxlength="2000"
                                    show-word-limit
                                    placeholder="请输入你的反馈意见"
                                  />
                                  <div class="guess-speak">
                                    猜你想说
                                  </div>
                                  <div class="guess-speak-list">
                                    <span v-for="(innerItem,innerIndex) in guessSpeakList" @click="guessSpeakListEvent(index,innerItem,innerIndex)" :key="innerIndex">{{innerItem.name}}</span>
                                  </div>
                                  <div class="submit-feedback" @click="submitTaskFeedBack(item,index,3,'反对')">
                                    提交反馈
                                  </div>
                                </div>
                              </div>
                                <p class="wait-handle-check" v-show="item.state == 2 ">
                                  <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                                </p>
                              </div>
                              <p class="get-wait-task">
                              <span v-show="item.state == '1'">
                                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                              </span>
                              </p>
                            </div>
                          </div>
                        </van-tab>
                        <van-tab name="1" >
                          <div slot="title">
                            <span class="title">已取消</span>
                            <span class="right-sign sign-not-in" v-show="currentIndex == 1 && taskNameIndex === 2">{{taskCount}}</span>
                          </div>
                          <div class="historyTask-list">
                            <div class="wait-handle-list" v-for="(item,index) in stateCompleteList" :key="`${item}-${index}`">
                              <div class="wait-handle-message">
                                <div class="wait-handle-message-top">
                                  <p>
                                    编号: {{item.taskNumber}}
                                  </p>
                                  <p>
                                    {{stateTransfer(item.state)}}
                                  </p>
                                </div>
                                <div class="wait-handle-message-middle">
                                  <p>
                                    <span class="message-tit">任务名称:</span>
                                    <span class="message-tit-real">{{item.taskTypeName}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">预计开始时间:</span>
                                    <span class="message-tit-real">{{item.startTime}}</span>
                                  </p>
                                </div>
                                <div class="handle-message-line-wrapper handle-message-line-wrapper-one-line">
                                  <p>
                                    <span class="message-tit">实际开始时间:</span>
                                    <span class="message-tit-real">{{item.startUpTime}}</span>
                                  </p>
                                </div>
                                <div class="dist-list">
                                  <span v-for="(innerItem,innerIndex) in item.distName" :key="innerIndex">{{innerItem.name}}</span>
                                </div>
                                <div class="feedback-area">
                                  <div class="feedback-top">
                                    <div class="left">
                                      <van-icon name="manager" size="20" />
                                      <span>运送人:</span>
                                      <span>{{item.workerName}}</span>
                                    </div>
                                  </div>
                                </div>  
                                <p class="wait-handle-check" v-show="item.state == 2 ">
                                  <van-checkbox v-model="item.taskCheck" @click.stop.native="emptyHandle" @change="waitTaskChecked(item.taskCheck)"></van-checkbox>
                                </p>
                              </div>
                              <p class="get-wait-task">
                              <span v-show="item.state == '1'">
                                <img :src="taskGetPng" alt="" @click.stop="getTask(item.id)">
                              </span>
                              </p>
                            </div>
                          </div>
                        </van-tab>
                      </van-tabs>
                    </div>
                </div>
            </div>
            <div class="medical-worker-operate-right-taskCollect" v-show="operateTaskCollect == 5">
              <p>收藏</p>
            </div>
            <div class="medical-worker-operate-right-taskFeedback" v-show="operateTaskCollect == 6">
              <div class="feedback-icon">
                <van-icon name="records" size="50" color="#2895ea" />
              </div>
              <div class="idea-type">
                <span>*</span>意见类型
              </div>
              <div class="idea-type-list">
                <span v-for="(item,index) in opinionTypeList" :class="{'opinionTypeStyle': opinionTypeIndex == index}" :key="index" @click="opinionTypeEvent(item,index)">
                  {{item}}
                </span>
              </div>
              <div class="feedback-idea">
                <span>*</span>反馈意见
              </div>
              <van-field
                rows="8"
                v-model="deedbackContent"
                type="textarea"
                maxlength="2000"
                show-word-limit
                placeholder="请输入反馈意见"
              />
              <div class="guess-speak">
                <span>猜你想说 :</span>
              </div>
              <div class="guess-speak-list">
                <span v-for="(innerItem,innerIndex) in totalGuessSpeakList" @click="totalGuessSpeakListEvent(innerItem,innerIndex)" :key="innerIndex">{{innerItem.name}}</span>
              </div>
              <div class="feedback-btn" @click="submitFeedBackEvent">
                提交反馈
              </div>
            </div>
            <p class="medical-version">
              <span>{{versionNumber}}</span>
              <span>{{this.userInfo.depName}}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HeaderTop from '@/components/HeaderTop'
  import FooterBottom from '@/components/FooterBottom'
  import NoData from '@/components/NoData'
  import Loading from '@/components/Loading'
  import store from '@/store'
  import {getAllTaskNumber, queryAllTaskMessage, userSignOut, getNewWork, getDispatchTaskComplete, queryAppointTaskMessage, queryCirculationTask, transferAppointTask} from '@/api/trans/workerPort.js'
  import {queryTransportTypeClass, collectDispatchTask, taskReminder, queryFeedback, submitFeedback, submitTaskFeedback} from '@/api/trans/medicalPort.js'
  import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
  import { mapGetters, mapMutations } from 'vuex'
  import { formatTime, setStore, getStore, IsPC, changeArrIndex, removeAllLocalStorage, checkEmptyArray, getFileName } from '@/common/js/utils'
  import dispatchTaskPng from '@/common/images/home/dispatch-task.png'
  import circulationTaskPng from '@/common/images/home/circulation-task.png'
  import offWorkSignOutPng from '@/common/images/home/offWork-signOut.png'
  import appointTaskPng from '@/common/images/home/appoint-task.png'
  import schedulingPng  from '@/common/images/home/scheduling.png'
  import medicalMessagePng from '@/common/images/home/medical-message.png'
  import medicalCallPng from '@/common/images/home/medical-call.png'
  import taskTailPng from '@/common/images/home/task-tail.png'
  import SOtime from '@/common/js/SOtime.js'
  import historyTaskPng from '@/common/images/home/history-task.png'
  import medicalCollectPng from '@/common/images/home/medical-collect.png'
  import medicalMessageCheckedPng from '@/common/images/home/medical-message-checked.png'
  import medicalCallCheckedPng from '@/common/images/home/medical-call-checked.png'
  import taskTailCheckedPng from '@/common/images/home/task-tail-checked.png'
  import historyTaskCheckedPng from '@/common/images/home/history-task-checked.png'
  import medicalCollectCheckedPng from '@/common/images/home/medical-collect-checked.png'
  let windowTimer
  export default {
    name: 'TransHome',
    components:{
      HeaderTop,
      NoData,
      Loading,
      FooterBottom,
      VanFieldSelectPicker
    },
    data() {
      return {
        currentAppointTaskId: '',
        appointTaskRawPeopleId: '',
        leftDownShow: false,
        workerShow: true,
        cancelShow: true,
        liIndex: null,
        showLoadingHint: false,
        noDataShow: false,
        activetaskDispatch: 0,
        activetaskAppoint: 0,
        activetaskCirculation: 0,
        currentIndex: 0,
        taskCount: '',
        operateListInnerIndex: 1,
        yesterdayNumber: '',
        yesterdayRank: '',
        isHaveTask: '',
        opinionTypeList: ['运送人员','功能故障','其它意见'],
        opinionTypeIndex: null,
        leftDropdownDataList: ['退出登录'],
        taskTypeList: [],
        startTime: '',
        endTime: '',
        startTimePop: false,
        versionNumber: '',
        endTimePop: false,
        currentDateStart: new Date(),
        currentDateEnd: new Date(),
        minDateStart: new Date(2020, 0, 1),
        minDateEnd: new Date(2020, 0, 1),
        taskNameList: [{name: '调度任务'},{name: '预约任务'},{name: '循环任务'}],
        taskNameIndex: 0,
        deedbackContent: '',
        guessSpeakList: [],
        totalGuessSpeakList: [],
        taskCurrentName: '调度任务',
        taskList: [
          {tit:'调度任务',imgUrl: dispatchTaskPng},
          {tit:'循环任务',imgUrl: circulationTaskPng},
          {tit:'预约任务',imgUrl: appointTaskPng},
          {tit:'任务调度',imgUrl: schedulingPng},
          {tit:'下班签退',imgUrl: offWorkSignOutPng}
        ],
        operateList: [
          {tit:'消息', imgUrl: medicalMessagePng, imgUrlChecked:medicalMessageCheckedPng},
          {tit:'呼叫', imgUrl: medicalCallPng, imgUrlChecked:medicalCallCheckedPng},
          {tit:'任务跟踪', imgUrl: taskTailPng, imgUrlChecked:taskTailCheckedPng},
          {tit:'历史任务', imgUrl: historyTaskPng, imgUrlChecked:historyTaskCheckedPng},
          {tit:'收藏', imgUrl: medicalCollectPng, imgUrlChecked:medicalCollectCheckedPng},
          {tit:'意见反馈', imgUrl: medicalCollectPng, imgUrlChecked:medicalCollectCheckedPng}
        ],
        operateMessage: '',
        operateCallOut: 2,
        isRefresh: false,
        operateTaskTrace: '',
        operateHistoryTask: '',
        operateTaskCollect: '',
        isTimeoutContinue: true,
        stateCompleteList: [],
        transPortTypeList: [],
        taskTraceList: [],
        taskCancelReason: '',
        taskSurePng: require('@/components/images/task-sure.png'),
        taskCancelPng: require('@/components/images/task-cancel.png'),
        defaultPersonManPng: require('@/common/images/home/man-person-default.png'),
        taskInfoPng: require('@/common/images/home/task-info.png'),
        defaultPersonWomanPng: require('@/common/images/home/woman-person-default.png'),
        homeBannerPng: require('@/common/images/home/trans-home-banner.png'),
        btnTaskWrapperPng: require('@/common/images/home/btn-background.png'),
        taskSearchPng: require('@/components/images/task-search.png'),
        taskGetPng: require('@/components/images/task-get.png'),
        contactIsolationPng: require("@/common/images/home/contact-isolation.png")
      }
    },

    mounted() {
      setStore('currentTitle','中央运送');
      // 控制设备物理返回按键测试
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
        });
        this.getVersionNumber()
      };

    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    };
      document.addEventListener('click',(e) => {
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      if (this.userTypeId == 0) {
        this.isHaveTask = this.newTaskName;
        this.parallelFunction(this.taskTypeTransfer(this.newTaskName));
        this.judgeTaskComplete();
        // 轮询是否有新任务
        if (!windowTimer) {
            windowTimer = window.setInterval(() => {
              if (this.isTimeoutContinue) {
                setTimeout(this.queryNewWork(this.proId, this.workerId), 0)
              }
            }, 3000);
            this.changeGlobalTimer(windowTimer)
        }
      } else {
        let me = this;
        window['setDeviceInfo'] = (val) => {
          me.setDeviceInfo(val);
        };
        this.parallelFunctionTwo();
        this.isShowFeedbackEvent()
      };
      this.controlModuleShow()
    },

    watch: {
      userTypeId: {
        handler(newName, oldName) {
          if (newName == 0) {
            this.workerShow = true
          } else {
            this.workerShow = false
          }
        },
        immediate: true,
        deep: true
      }
    },
    activated () {
      this.changeTitleTxt({tit:'中央运送'});
      setStore('currentTitle','中央运送');
      if (!IsPC()) {
        pushHistory();
        this.gotoURL(() => {
        });
        this.getVersionNumber()
      };
      this.noDataShow = false;
      if (this.userTypeId == 0) {
        // 查询任务数量
        this.leftDownShow = false;
        this.isHaveTask = this.newTaskName;
        this.parallelFunction(this.taskTypeTransfer(this.newTaskName));
        this.judgeTaskComplete();
      } else {
        let me = this;
        window['setDeviceInfo'] = (val) => {
          me.setDeviceInfo(val);
        };
        this.parallelFunctionTwo();
        if (this.isFreshHomePage) {
          if (this.operateListInnerIndex == 1) {
            this.operateListInnerIndex = 1
          } else {
            this.operateListInnerIndex = 2;
          }
          this.operateTaskTrace = 3;
          this.queryCompleteDispatchTask(
            {
              proId:this.proId, workerId:'',state: -1,
              departmentId: this.userInfo.depId
            },"任务跟踪"
          )
        };
        this.isShowFeedbackEvent()
      };
      document.addEventListener('click',(e) => {
        if(e.target.className!='status-name'){
          this.stateListShow = false;
        };
        if(e.target.className!='van-icon van-icon-manager-o' && e.target.className!='left-dropDown'){
          this.leftDownShow = false;
        }
      });
      this.controlModuleShow()
    },

    computed:{
      ...mapGetters([
        'navTopTitle',
        'userType',
        'chooseHospitalArea',
        'userInfo',
        'newTaskName',
        'globalTimer',
        'catch_components',
        'isFreshHomePage',
        'templateType',
        'isNewCircle',
        'isMedicalMan',
        'appPermission'
      ]),
      sex () {
        return this.userInfo['worker']['extendData']['sex']
      },
      userTypeId () {
        return 0
      },
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

    beforeRouteEnter (to, from, next) {
      next(vm => {
        if (vm.isMedicalMan) {
          let catch_components = store.state.catchComponent.catch_components;
          let i = catch_components.indexOf('home');
          i === -1 && catch_components.push('home')
        }
      })
    },

    beforeRouteLeave (to, from, next) {
      let catch_components = this.catch_components;
      if (this.isMedicalMan) {
        if (to.name !== 'transportTypeMessage' && to.name !== 'padDispatchTaskCancelForm'){
          let i = catch_components.indexOf('home');
          i > -1 && this.changeCatchComponent([]);
        }
      };
      next()
    },

    methods:{
      ...mapMutations([
        'changeTitleTxt',
        'changetransportTypeMessage',
        'changeOverDueWay',
        'changeNewTaskList',
        'changeTaskTranceMsg',
        'changeGlobalTimer',
        'changeCatchComponent',
        'changeCompleteCheckedItemInfo',
        'changeCompleteSweepcodeDestinationInfo',
        'changeCompleteSweepcodeDepartureInfo'
      ]),

      // 控制模块显示
      controlModuleShow () {
        if (this.appPermission) {
          if (!this.appPermission['dispTask']) {
            this.taskList = this.taskList.filter((item) => { return item.tit != '调度任务'})
          };
          if (!this.appPermission['dispAssgin'] && !this.appPermission['bookAssgin']) {
            this.taskList = this.taskList.filter((item) => { return item.tit != '任务调度'})
          }
        }  
      },

      juddgeIspc () {
        return IsPC()
      },

      playInfoVoice () {
        let currentAudio = this.$refs.audio;
        currentAudio.play()
      },

      //模板二时不展示意见反馈
      isShowFeedbackEvent () {
        if (this.templateType == 'template_two') {
          this.operateList = this.operateList.filter((item) => {return item.tit != '意见反馈'})
        }
      },

      // 并行查询任务数量和排名
      parallelFunction (type) {
        Promise.all([this.queryAllTaskNumber(this.proId, this.workerId,type),this.getAllTaskMessage()])
        .then((res) => {
          if (res && res.length > 0) {
            let [item1,item2] = res;
            if (item2) {
              const {totalCount, rank} = item2;
              this.yesterdayNumber = totalCount;
              this.yesterdayRank = rank
            };
            if (item1) {
              this.taskTypeList = [];
              let innerItem = item1;
              Object.keys(innerItem).forEach((item) => {
                if (item == 'resTask') {
                  this.taskTypeList.push({text: '预约任务',number: innerItem[item]})
                } else if (item == 'transTask') {
                  this.taskTypeList.push({text: '调度任务',number: innerItem[item]})
                } else if (item == 'circleTask') {
                  this.taskTypeList.push({text: '循环任务',number: innerItem[item]})
                }
              });
              if (type == '' || type == undefined) {return};
              this.taskTypeList = changeArrIndex(this.taskTypeList,type)
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 任务类型转换文字
      taskTypeTransfer (type) {
        switch(type) {
          case 'book' :
            return '预约任务'
            break;
          case 'trans' :
            return '调度任务'
            break;
          case 'circle' :
            return '循环任务'
            break;
            default:
            ''
        }
      },

      // 任务类型转换字母
      taskTypeTransferLetter (type) {
        switch(type) {
          case '预约任务' :
            return 'book'
            break;
          case '调度任务' :
            return 'trans'
            break;
          case '循环任务' :
            return 'circle'
            break
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

      // 提取住院号
			extractAdmissionNumber (patientInfoList) {
				if (patientInfoList.length == 0) { return "无"};
				let temporaryArr = [];
				for (let item of patientInfoList) {
					temporaryArr.push(item.number)
				};
				return temporaryArr.join("、")
			},

       // 提取病人姓名
			extractPatientName (patientInfoList) {
				if (patientInfoList.length == 0) { return "无"};
				let temporaryArr = [];
				for (let item of patientInfoList) {
					temporaryArr.push(item.patientName)
				};
				return temporaryArr.join("、")
			},


      // 查询是否有新任务
      queryNewWork (proId,workerId) {
        this.isTimeoutContinue = false;
        let audio = new Audio();
        audio.preloadc = "auto";
        process.env.NODE_ENV == 'development' ? audio.src = "/static/audios/task-info-voice.wav" : audio.src = "/transWeb/static/audios/task-info-voice.wav";
        getNewWork(proId,workerId).then((res) => {
          // token过期,清楚定时器
          if (!res['headers']['token']) {
            if(windowTimer) {window.clearInterval(windowTimer)}
          };
          if (res && res.data.code == 200) {
            this.isTimeoutContinue = true;
            let isBreak = false;
            Object.keys(res.data.data).forEach((item) => {
              if (isBreak) {return};
              if (item != "all" && res.data.data[item] == true) {
                isBreak = true;
                // 新任务存入store中
                this.changeNewTaskList(item);
                let playPromiser = audio.play();//进行播放
                audio.onended = () => {
                  // 更新任务数量和排名
                  this.isHaveTask = this.taskTypeTransfer(item);
                  this.parallelFunction(this.taskTypeTransfer(item))
                }
              }
            })
          } else {
            if (res.headers.hasOwnProperty('offline')) {return};
            if (res.data) {
              if (res.data.hasOwnProperty('msg')) {
                this.$toast(`${res.data.msg}`)
              }
            }
          }
        })
        .catch((err) => {
          if (err.hasOwnProperty('message')) {
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
            })
          }
        })
      },

      /**
       * 工作人员代码
       *
      */

      // 转移任务
      sureTransferDispatchTask (data) {
        transferAppointTask(data)
          .then((res) => {
            if (res && res.data.code == 200) {
              this.$toast(`${ res.data.msg}`);
              this.appointEvent()
            } else {
              this.$dialog.alert({
                message: res.data.msg,
                closeOnPopstate: true
              }).then(() => {
              });
            }
          })
          .catch((err) => {
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
            });
          })
      },


    //首页扫描二维码事件
    scanCodeEvent () {
      this.sweepAstoffice()
    },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        // 判断校验类型
        if (code.indexOf('|') != -1) {
          let cutoutIndex = code.indexOf('|');
          this.appointTaskRawPeopleId = code.substr(0,cutoutIndex);
          this.currentAppointTaskId = (code.substr(cutoutIndex + 1)).split(',');
          // 转移任务
          this.sureTransferDispatchTask({
            taskIds: this.currentAppointTaskId,
            afterWorkerId: this.workerId,   //任务接受者ID
            beforeWorkerId: this.appointTaskRawPeopleId //转移者ID
          })
        }
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

      // 获取版本号
      getVersionNumber () {
        this.versionNumber = window.android.getVersion()
      },

      // 用户签退
      userLoginOut (proId,workerId) {
        this.changeOverDueWay(true);
        setStore('storeOverDueWay',true);
        userSignOut(proId,workerId).then((res) => {
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
          this.changeOverDueWay(false);
          setStore('storeOverDueWay',false);
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 查询所有任务数量
      queryAllTaskNumber (proID, workerId, taskType) {
        return new Promise((resolve,reject) => {
          getAllTaskNumber(proID, workerId)
          .then(res => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            } else {
              this.$dialog.alert({
                message: `${res.data.msg}`,
                closeOnPopstate: true
              }).then(() => {
              })
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      //查询完成任务数量和排名
      getAllTaskMessage () {
        return new Promise((resolve,reject) => {
          queryAllTaskMessage({
            proId: this.proId, // 项目ID 必输
            workerId: this.workerId, //运送员ID   非必输
            date: ''
          })
          .then((res) => {
            if (res && res.data.code == 200) {
              resolve(res.data.data)
            }
          })
          .catch((err) => {
            reject(err.message)
          })
        })
      },

      // 路由跳转
      dispatchEvent () {
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      },

      circulationEvent () {
        this.$router.push({path:'/circulationTask'})
        this.changeTitleTxt({tit:'循环任务'});
        setStore('currentTitle','循环任务')
      },

      appointEvent () {
        this.$router.push({path:'/appointTask'});
        this.changeTitleTxt({tit:'预约任务'});
        setStore('currentTitle','预约任务')
      },

      // 顶部任务点击事件
      taskEvent (item) {
        if (item.text == '循环任务') {
          if (this.taskTypeTransferLetter(item.text) == this.newTaskName) {
            this.changeNewTaskList('')
          };
          this.circulationEvent()
        } else if (item.text == '预约任务') {
          if (this.taskTypeTransferLetter(item.text) == this.newTaskName) {
            this.changeNewTaskList('')
          };
          this.appointEvent()
        } else {
          if (this.taskTypeTransferLetter(item.text) == this.newTaskName) {
            this.changeNewTaskList('')
          };
          this.dispatchEvent()
        }
      },

      // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        this.userLoginOut(this.proId, this.userInfo.userName)
      },

      // 跳转到首页
      backTo () {
        this.$router.push({path:'/home'});
      },

      //下面任务按钮路由跳转
      taskRouterSkip (name, index) {
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
        } else if (name === '下班签退') {
          this.$dialog.alert({
            message: '确定签退?',
            closeOnPopstate: true,
            showCancelButton: true
          }).then(() => {
            this.userLoginOut(this.proId, this.userInfo.userName)
          })
          .catch(() => {
          })
        } else if (name === '任务调度') {
          this.$router.push({path:'/taskScheduling'});
          this.changeTitleTxt({tit:'中央运送任务管理'});
          setStore('currentTitle','中央运送任务管理')
        }
      },

      // 判断每种任务是否收集完成
      judgeTaskComplete () {
        // 重新存入用户信息
        if (getStore('userInfo')) {
          this.$store.commit('storeUserInfo',JSON.parse(getStore('userInfo')));
        };
        if (getStore('userType')) {
          this.$store.commit('changeUserType',getStore('userType'));
        };
        // 重新存入当前标题
        if (getStore('currentTitle')) {
          this.$store.commit('changeTitleTxt', {tit: getStore('currentTitle')});
        };
        // 重新存入模板信息
        if (getStore('templateType')) {
          this.$store.commit('changeTemplateType', getStore('templateType'));
        };
        // 重新存入请求token
        if (getStore('questToken')) {
          this.$store.commit('changeToken', getStore('questToken'));
        };
        // 重新存入调度任务具体信息
        if (getStore('currentDispatchTaskMessage')) {
          this.$store.commit('changeDispatchTaskMessage', {DtMsg: getStore('currentDispatchTaskMessage')});
        };
        // 重新存入预约任务具体信息
        if (getStore('currentAppointTaskMessage')) {
          this.$store.commit('changeAppointTaskMessage', {DtMsg: getStore('currentAppointTaskMessage')});
        };
        // 重新存入循环任务科室采集信息
        if (getStore('currentCirculationCollectMessage')) {
          this.$store.commit('changeCirculationCollectMessageList', {DtMsg: (JSON.parse(getStore('currentCirculationCollectMessage'))['innerMessage'])})
        };
        // 重新存入循环任务科室交接信息
        if (getStore('currentCirculationConnectMessage')) {
          this.$store.commit('changeCirculationConnectMessageList', {DtMsg: (JSON.parse(getStore('currentCirculationConnectMessage'))['innerMessage'])})
        };
        // 重新存入医护人员生成运送类型信息
        if (getStore('currentTransportTypeMessage')) {
          this.$store.commit('changetransportTypeMessage', {DtMsg: getStore('currentTransportTypeMessage')});
        };
        // 重新存入循环任务完成采集科室信息
        if (getStore('completeDepartmentMessage')) {
          this.$store.commit('changeCompleteDeparnmentInfo', {DtMsg: JSON.parse(getStore('completeDepartmentMessage'))['sureInfo']});
        };
        // 重新存入送达的科室id
        if (getStore('currentDepartmentId')) {
          this.$store.commit('changeStoreArriveDeparnmentId',getStore('currentDepartmentId'));
        };
        // 重新存入过期方式
        if (getStore('storeOverDueWay')) {
          this.$store.commit('changeOverDueWay',JSON.parse(getStore('storeOverDueWay')));
        };
        // 重新存入是否循环采集页面取消按钮回显生效
        if (getStore('isDeleteCancel')) {
          this.$store.commit('changeIsDeleteCancel',JSON.parse(getStore('isDeleteCancel')));
        };
        // 重新存入是否循环采集页面生命周期回显生效
        if (getStore('isDeleteEcho')) {
          this.$store.commit('changeIsDeleteEcho',JSON.parse(getStore('isDeleteEcho')));
        };
        // 重新存入是否循环采集页面弹框确定按钮确定按钮点击状态
        if (getStore('isClickSure')) {
          this.$store.commit('changeIsClickSure',JSON.parse(getStore('isClickSure')));
        };
        // 重新存入新循环任务完成标本采集信息的状态
        if (getStore('completeCollectSample')) {
          this.$store.commit('changeIsCompleteSampleList',JSON.parse(getStore('completeCollectSample'))['sampleInfo']);
        };
        // 重新存入调度任务完成扫码的出发地和单一目的地科室信息(id)
        if (getStore('completeDispatchSweepCodeInfo')) {
          this.$store.commit('changeisCompleteSweepCode', JSON.parse(getStore('completeDispatchSweepCodeInfo'))['sweepCodeInfo']);
        };
        // 页面刷新重新存入调度任务完成扫码的非单一目的地科室信息
        if (getStore('completeDispatchSweepCodeDestinationInfo')) {
          this.$store.commit('changeIsCompleteSweepCodeDestinationList', JSON.parse(getStore('completeDispatchSweepCodeDestinationInfo'))['sweepCodeInfo']);
        };
        // 重新存入调度任务是否第一次扫码
        if (getStore('isDispatchFirstSweepCode')) {
          this.$store.commit('changeIsDispatchTaskFirstSweepCode', JSON.parse(getStore('isDispatchFirstSweepCode')));
        };
        // 页面刷新重新存入预约任务完成扫码的目的地科室信息
        if (getStore('completAppointTaskSweepCodeDestinationInfo')) {
          this.$store.commit('changeCompleteSweepcodeDestinationInfo', JSON.parse(getStore('completAppointTaskSweepCodeDestinationInfo'))['sweepCodeInfo']);
        };
        // 页面刷新重新存入预约任务完成扫码起始地科室信息
        if (getStore('completAppointTaskSweepCodeDepartureInfo')) {
          this.$store.commit('changeCompleteSweepcodeDepartureInfo', JSON.parse(getStore('completAppointTaskSweepCodeDepartureInfo'))['sweepCodeInfo']);
        };
        // 页面刷新重新存入预约任务完成检查的科室信息
        if (getStore('completAppointTaskCheckedItemInfo')) {
          this.$store.commit('changeCompleteCheckedItemInfo', JSON.parse(getStore('completAppointTaskCheckedItemInfo'))['sweepCodeInfo']);
        };
        // 重新存入调度任务完成上传的照片
        if (getStore('completPhotoInfo')) {
          this.$store.commit('changeIsTransDispatchTaskCompletePhotoList', JSON.parse(getStore('completPhotoInfo'))['photoInfo']);
        };
        // 重新存入调度任务上传的问题图片
        if (getStore('completdispatchIssuePhotoInfo')) {
          this.$store.commit('changeIsCompleteDispatchIssuePhotoList', JSON.parse(getStore('completdispatchIssuePhotoInfo'))['photoInfo']);
        };
        // 重新存入调度任务当前扫码校验通过的科室编号
        if (getStore('completDepartmentNumber')) {
          this.$store.commit('changeCurrentDepartmentNumber', JSON.parse(getStore('completDepartmentNumber'))['number']);
        };
        // 页面刷新重新存入科室信息id
        if (getStore('departmentInfo')) {
          this.$store.commit('changeDepartmentInfoList', JSON.parse(getStore('departmentInfo')));
        };
        // 页面刷新重新存入科室信息编号
        if (getStore('departmentInfoNo')) {
          this.$store.commit('changeDepartmentInfoListNo', JSON.parse(getStore('departmentInfoNo')));
        };
        // 页面刷新重新存入是否为新任务状态
        if (JSON.parse(getStore('isNewCircle'))['isNewCircle']) {
          this.$store.commit('changeIsNewCircle', JSON.parse(getStore('isNewCircle'))['isNewCircle']);
        }
      },

      /**
       * 医务人员代码
      */

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

      // 提取床号
      extractBedNumber (patientInfoList) {
        if (patientInfoList.length == 0) { return "无"};
        let temporaryArr = [];
        for (let item of patientInfoList) {
          temporaryArr.push(item.bedNumber)
        };
        return temporaryArr.join("、")
      },

      // 总体意见反馈栏意见类型点击事件
      opinionTypeEvent (item,index) {
        this.opinionTypeIndex = index;
        this.deedbackContent = '';
        // 查询总体反馈意见
        this.inquireFeedback({
          proId: this.proId,
          signFlag: 1,
          typeFlag: index + 1,
          state: 1
        })
      },

      // 查询反馈意见
      inquireFeedback (data) {
        if (data.signFlag == 1) {
          this.totalGuessSpeakList = [];
        } else if (data.signFlag == 2) {
          this.guessSpeakList = [];
        }
        queryFeedback(data).then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              if (data.signFlag == 1) {
                for (let item of res.data.data) {
                  this.totalGuessSpeakList.push({
                    name: item.content
                  })
                }
              } else if (data.signFlag == 2) {
                for (let item of res.data.data) {
                  this.guessSpeakList.push({
                    name: item.content
                  })
                }
              }
            }
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 提交总体意见反馈
      submitFeedBackEvent () {
        if (this.opinionTypeIndex === null || this.deedbackContent == '') {
          this.$toast('请选择/填写反馈意见');
          return
        };
        submitFeedback({
          proId : this.proId,
          feedbackId : this.workerId, // 反馈者ID
          typeFlag: this.opinionTypeIndex + 1, //意见类型
          feedbackName : this.userName, // 反馈者名称
          feedbackRole : this.userInfo.roleName, //反馈角色，暂定为医务人员的 role 字段
          depId : this.userInfo.depId  , //反馈科室ID，医务人员depId字段
          depName:  this.userInfo.depName , //反馈科室名称医务人员depName字段
          content : this.deedbackContent , //反馈内容，可以为空，点赞默认为空
          type : 1, //反馈类型(1-意见反馈，2-赞)
          terminal : 1, //反馈终端(1-客户端，2-小程序)
        }).then((res) => {
          if (res && res.data.code == 200) {
            this.deedbackContent = '';
            this.$toast('意见反馈成功');
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      //任务反馈事件点击
			submitTaskFeedBack (item,index,type,text) {
        if (this.stateCompleteList[index]['isIssueFeedback']) {
          this.$toast('该任务已反馈过!');
          return
        };
				let data = {
					feedbackId : this.workerId, // 反馈者ID
					feedbackName : this.userName, // 反馈者名称
					feedbackRole : this.userInfo.roleName, //反馈角色，暂定为医务人员的 role 字段
					depId : this.userInfo.depId  , //反馈科室ID，医务人员depId字段
					depName:  this.userInfo.depName , //反馈科室名称医务人员depName字段
					content : this.stateCompleteList[index]['deedbackContent'] , //反馈内容，可以为空，点赞默认为空
					type : 1, //反馈类型(1-意见反馈，2-赞)
					terminal : 1, //反馈终端(1-客户端，2-小程序)
					taskType : '', //任务类型-调度任务(1-调度任务，2-预约任务，3-循环任务)
					proId : this.proId, //所属项目ID，医务人员proId字段
          isIssueFeedback: item.isIssueFeedback,
          feedbackFlag: item.feedbackFlag,
          isShowFeedBack: item.isShowFeedBack,
					taskId : item.id, //任务ID
					taskNumber : item.taskNumber, //任务编号
					taskCreate : item.createTime, //调度任务创建时间
					taskStart : item.planStartTime, //调度任务开始时间
					taskFinish : item.finishTime, //调度任务结束时间
					taskState : 7, //调度任务状态
					taskPriority : item.priority, //调度任务优先级
					taskWorkerId : item.workerId, //运送员ID
					taskWorkerName : item.workerName //运送员姓名
				};
				if (type == 1) {
          data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
          data['taskStart'] = item.planStartTime ? item.planStartTime.slice(0,item.planStartTime.lastIndexOf(':')) : '';
          data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskType'] = type;
					data['taskStartDep'] = '';
					data['taskCreateDep'] = item['setOutPlaceName'];
					if (this.userInfo.pc == 'template_one') {
						data['taskTransType'] = `${item.parentTypeName ? item.parentTypeName : ''}-${item.taskTypeName ? item.taskTypeName : ''}`;
					} else {
						if (item.patientInfoList.length > 0 && item.patientInfoList[0].typeList.length > 0) {
							let typeList = this.extractTransportTypeSmallClass(item.patientInfoList).join('、');
							data['taskTransType'] = `${item.patientInfoList[0].typeList[0].parentTypeName}-${typeList}`
						} else {
							data['taskTransType'] = ''
						}
					};
					data['taskTemplate'] = this.userInfo.pc == 'template_two' ? 2 : 1;
					this.submitTaskFeedBackEvent(data,index,type,text)
				} else if (type == 2) {
					data['taskCreateDep'] = item['setOutPlaceName'];
					data['taskType'] = type;
					data['taskHospitalNo'] = item['patientNumber'] ? item['patientNumber'] : '';
					data['taskDistDepartments'] = item['distDepartments'] ? item['distDepartments'] : [];
					this.submitTaskFeedBackEvent(data,index,type,text)
				} else if (type == 3) {
					data['taskHasAccess'] = item.hasAccess;
					data['taskType'] = type;
					data['taskName'] = item['taskTypeName'];
          data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
          data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskStart'] = item['startUpTime'] ? item['startUpTime'].slice(0,item['startUpTime'].lastIndexOf(':')) : '';
					data['taskStartTime'] = item['startTime'] ? item['startTime'].slice(0,item['startTime'].lastIndexOf(':')) : '';
					this.submitTaskFeedBackEvent(data,index,type,text)
				} 
			},

      // 提交任务意见反馈
			submitTaskFeedBackEvent (data,index,type,text) {
        if (data.feedbackFlag == 1 || data.isIssueFeedback) {
          this.$toast('该任务已反馈过!');
          return
        };
				submitTaskFeedback(data,type).then((res) => {
					if (res && res.data.code == 200) {
            this.$toast('意见反馈成功');
						if (text == '点赞') {
							this.stateCompleteList[index]['isShowGiveLikeIconStyle'] = !this.stateCompleteList[index]['isShowGiveLikeIconStyle'];
							this.stateCompleteList[index]['isShowFeedBackIconStyle'] = false;
							this.stateCompleteList[index]['isShowFeedBack'] = false;
						} else if (text == '反对') {
							this.stateCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateCompleteList[index]['isShowFeedBackIconStyle'];
              this.stateCompleteList[index]['isIssueFeedback'] = true;
							this.stateCompleteList[index]['isShowFeedBack'] = !this.stateCompleteList[index]['isShowFeedBack'];
						};
					} else {
							this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
					}
				})
				.catch((err) => {
				this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
            });
				})
			},
			
			// 点赞事件
			giveLikeEvent(item,index,type,text) {
				if (this.stateCompleteList[index]['isShowGiveLikeIconStyle']) {return};
				let data = {
					feedbackId : this.workerId, // 反馈者ID
					feedbackName : this.userName, // 反馈者名称
					feedbackRole : this.userInfo.roleName, //反馈角色，暂定为医务人员的 role 字段
					depId : this.userInfo.depId, //反馈科室ID，医务人员depId字段
          isIssueFeedback: item.isIssueFeedback,
          isShowFeedBack: item.isShowFeedBack,
					depName:  this.userInfo.depName , //反馈科室名称医务人员depName字段
					content : '' , //反馈内容，可以为空，点赞默认为空
					type : 2, //反馈类型(1-意见反馈，2-赞)
					terminal : 1, //反馈终端(1-客户端，2-小程序)
					taskType : '', //任务类型-调度任务(1-调度任务，2-预约任务，3-循环任务)
					proId : this.proId, //所属项目ID，医务人员proId字段
					taskId : item.id, //任务ID
          feedbackFlag: item.feedbackFlag,
					taskNumber : item.taskNumber, //任务编号
					taskCreate : item.createTime, //调度任务创建时间
					taskStart : item.planStartTime, //调度任务开始时间
					taskFinish : item.finishTime, //调度任务结束时间
					taskState : 7, //调度任务状态
					taskPriority : item.priority, //调度任务优先级
					taskWorkerId : item.workerId, //运送员ID
					taskWorkerName : item.workerName //运送员姓名
				};
				if (type == 1) {
          data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
          data['taskStart'] = item.planStartTime ? item.planStartTime.slice(0,item.planStartTime.lastIndexOf(':')) : '';
          data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskType'] = type;
					data['taskStartDep'] = '';
					data['taskCreateDep'] = item['setOutPlaceName'];
					if (this.userInfo.pc == 'template_one') {
						data['taskTransType'] = `${item.parentTypeName ? item.parentTypeName : ''}-${item.taskTypeName ? item.taskTypeName : ''}`;
					} else {
						if (item.patientInfoList.length > 0 && item.patientInfoList[0].typeList.length > 0) {
							let typeList = this.extractTransportTypeSmallClass(item.patientInfoList).join('、');
							data['taskTransType'] = `${item.patientInfoList[0].typeList[0].parentTypeName}-${typeList}`
						} else {
							data['taskTransType'] = ''
						}
					};
					data['taskTemplate'] = this.userInfo.pc == 'template_two' ? 2 : 1;
					this.submitTaskFeedBackEvent(data,index,type,text)
				} else if (type == 2) {
					data['taskCreateDep'] = item['setOutPlaceName'];
					data['taskType'] = type;
					data['taskHospitalNo'] = item['patientNumber'] ? item['patientNumber'] : '';
					data['taskDistDepartments'] = item['distDepartments'] ? item['distDepartments'] : [];
					this.submitTaskFeedBackEvent(data,index,type,text)
				} else if (type == 3) {
					data['taskHasAccess'] = item.hasAccess;
					data['taskType'] = type;
					data['taskName'] = item['taskTypeName'];
          data['taskCreate'] = item.createTime ? item.createTime.slice(0,item.createTime.lastIndexOf(':')) : '';
          data['taskFinish'] = item.finishTime ? item.finishTime.slice(0,item.finishTime.lastIndexOf(':')) : '';
					data['taskStart'] = item['startUpTime'] ? item['startUpTime'].slice(0,item['startUpTime'].lastIndexOf(':')) : '';
					data['taskStartTime'] = item['startTime'] ? item['startTime'].slice(0,item['startTime'].lastIndexOf(':')) : '';
					this.submitTaskFeedBackEvent(data,index,type,text)
				} 
			},

      //提取调度任务运送类型小类
			extractTransportTypeSmallClass (transportTypeList) {
				let TransportTypeList = [];
				if (transportTypeList.length > 0) {
					for (let item of transportTypeList) {
						if (item.typeList.length > 0) {
							for (let innerItem of item.typeList) {
								TransportTypeList.push(innerItem['taskTypeName'])
							}
						}
					}
				};
				return TransportTypeList
			},

      //提取预约任务检查类型
			extractAppointTaskCheckType (checkItems) {
        if (checkItems == null) {return []};
				let AppointTypeList = [];
				if (checkItems.length > 0) {
					for (let item of checkItems) {
						AppointTypeList.push(item.checkTypeName)
					}
				};
				return AppointTypeList
			},

      //提取预约任务目的地
			extractAppointTaskDist (checkItems) {
        if (checkItems == null) {return []};
				let AppointDistList = [];
				if (checkItems.length > 0) {
					for (let item of checkItems) {
						AppointDistList.push(!item.depName ? '无' : item.depName)
					};
          return checkEmptyArray(AppointDistList)
				} else {
          return []
        }
			},



      // 任务类型tab切换事件
      tabSwitchEvent (item,index) {
        this.taskNameIndex = index;
        this.taskCurrentName = item.name;
        this.currentIndex = 0;
        if (index == 0) {
          this.activetaskDispatch = 0
        } else if (index == 1) {
          this.activetaskAppoint = 0
        } else {
          this.activetaskCirculation = 0
        };
        if (this.taskCurrentName == '调度任务') {
          this.queryCompleteDispatchTask(
            {
              proId: this.proId, workerId: '', state: 7,
              startDate: this.startTime, endDate: this.endTime,
              departmentId: this.userInfo.depId
            }, "历史任务", name
          )
        } else if (this.taskCurrentName == '预约任务') {
          this.queryCompleteAppointTask(
            {
              proId: this.proId, workerId: '', state: 7,
              startDate: this.startTime, endDate: this.endTime,
              departmentId: this.userInfo.depId
            }
          )
        } else if (this.taskCurrentName == '循环任务') {
          this.queryCompleteCirculationTask(
            {
              proId: this.proId, workerId: '', state: 7,
              startDate: this.startTime, endDate: this.endTime,
              departmentId: this.userInfo.depId
            }
          )
        }
      },

      // 点击标签按钮事件
      onClickTab (name, title) {
        this.currentIndex = name;
        this.taskCount = 0;
        if (this.taskCurrentName == '调度任务') {
          if (name == 1) {
            this.queryCompleteDispatchTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }, "历史任务", name
            )
          } else {
            this.queryCompleteDispatchTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }, "历史任务", name
            )
          }
        } else if (this.taskCurrentName == '预约任务') {
          if (name == 1) {
            this.queryCompleteAppointTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          } else {
            this.queryCompleteAppointTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          }
        } else if (this.taskCurrentName == '循环任务') {
          if (name == 1) {
            this.queryCompleteCirculationTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          } else {
            this.queryCompleteCirculationTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          }
        }
      },

      // 搜索完成的任务
      searchCompleteTask () {
        if (this.taskCurrentName == '调度任务') {
          if (this.currentIndex == 0) {
            this.queryCompleteDispatchTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }, "历史任务", 0
            )
          } else {
            this.queryCompleteDispatchTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }, "历史任务", 1
            )
          }
        } else if (this.taskCurrentName == '预约任务') {
          if (this.currentIndex == 0) {
            this.queryCompleteAppointTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          } else {
            this.queryCompleteAppointTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          }
        } else if (this.taskCurrentName == '循环任务') {
          if (this.currentIndex == 0) {
            this.queryCompleteCirculationTask(
              {
                proId: this.proId, workerId: '', state: 7,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          } else {
            this.queryCompleteCirculationTask(
              {
                proId: this.proId, workerId: '', state: 6,
                startDate: this.startTime, endDate: this.endTime,
                departmentId: this.userInfo.depId
              }
            )
          }
        }
      },

      // 左边列表点击
      operateListEvent (item,index) {
        this.operateListInnerIndex = index;
        if (index == 0) {
          this.operateMessage = 1;
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
        } else if (index == 1) {
          this.operateMessage = '';
          this.operateCallOut = 2;
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = '';
          this.parallelFunctionTwo();
          // 查询运送类型
        } else if (index == 2) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = 3;
          this.operateHistoryTask = '';
          this.operateTaskCollect = ''
          this.queryCompleteDispatchTask(
            {
              proId:this.proId, workerId:'',state: -1,
              departmentId: this.userInfo.depId
            },"任务跟踪"
          )
        } else if (index == 3) {
          this.currentIndex = 0;
          this.activetaskDispatch = 0;
          this.activetaskAppoint = 0;
          this.activetaskCirculation = 0;
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = 4;
          this.operateTaskCollect = '';
          this.initDate();
          this.queryCompleteDispatchTask(
            {
              proId:this.proId, workerId:'',state:7,
              startDate: this.startTime, endDate: this.endTime,
              departmentId: this.userInfo.depId
            },"历史任务",0
          )
        } else if (index == 4) {
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = 5
        } else if (index == 5) {
          this.noDataShow = false;
          this.operateMessage = '';
          this.operateCallOut = '';
          this.operateTaskTrace = '';
          this.operateHistoryTask = '';
          this.operateTaskCollect = 6
        }
      },

      // 调度任务催单
      reminderTask(item) {
        taskReminder(this.proId,item.id).then((res) => {
          if (res && res.data.code == 200) {
            this.$toast(`${res.data.data}`);
          } else {
            this.$dialog.alert({
              message: `${res.data.msg}`,
              closeOnPopstate: true
            }).then(() => {
            });
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      // 调度任务取消
      taskCancel(item) {
        this.$router.push({path:'/padDispatchTaskCancelForm'});
        this.changeTitleTxt({tit:'取消原因选择'});
        setStore('currentTitle','取消原因选择');
        this.changeTaskTranceMsg(item)
      },

      // 调度任务下拉刷新
      onRefresh () {
        this.queryCompleteDispatchTask(
          {
            proId:this.proId, workerId:'',state: -1,
            departmentId: this.userInfo.depId
          },"任务跟踪"
        )
      },

      // 收藏任务(经常发起的调度任务)
      getCollectTask (data) {
        collectDispatchTask(data).then((res) => {
          if (res && res.data.code == 200) {}
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
          });
        })
      },

      //运送类型
      parallelFunctionTwo (type) {
        Promise.all([this.getTransportsType()])
        .then((res) => {
          if (res && res.length > 0) {
            let [item1] = res;
            if (item1) {
              this.transPortTypeList = [];
              for (let item of item1) {
                this.transPortTypeList.push({
                  id: item.id,
                  value: item.typeName
                })
              }
            }
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err}`,
            closeOnPopstate: true
          }).then(() => {})
        })
      },

      // 运送类型点击事件
      typeClick (item) {
        this.changetransportTypeMessage({DtMsg:item});
        this.$router.push({path:'/transportTypeMessage'});
        this.changeTitleTxt({tit:'创建调度任务'});
        setStore('currentTitle','创建调度任务')
      },

      // 查询运送类型分类
      getTransportsType () {
        return new Promise((resolve,reject) => {
          queryTransportTypeClass({proId: this.proId, state: 0}).then((res) => {
            if (res && res.data.code == 200) {
              if (res.data.data.length > 0) {
                this.noDataShow = false;
                resolve(res.data.data)
              }
            }
          })
          .catch((err) => {
            this.noDataShow = true;
            reject(err.message)
          })
        })
      },

      // 查询历史调度任务(已完成)
      queryCompleteDispatchTask (data, type, name) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        getDispatchTaskComplete(data).then((res) => {
          this.showLoadingHint = false;
          if (res && res.data.code == 200) {
            this.isRefresh = false;
            this.stateCompleteList = [];
            this.taskTraceList = [];
            if (res.data.data.length > 0) {
              this.noDataShow = false;
              for (let item of res.data.data) {
                if (type == "历史任务") {
                  this.stateCompleteList.push({
                    createTime: item.createTime,
                    planUseTime: item.planUseTime,
                    planStartTime: item.planStartTime,
                    state: item.state,
                    setOutPlaceName: item.setOutPlaceName,
                    taskNumber: item.taskNumber,
                    destinationName: this.templateType == 'template_one' ? item.destinationName : item.destinations,
                    taskTypeName: item.taskTypeName,
                    toolName: item.toolName,
                    feedbackFlag: item.feedbackFlag,
                    quarantine: item.quarantine,
                    priority: item.priority,
                    patientNumber: item.number,
                    id: item.id,
                    parentTypeName: item.parentTypeName,
                    deedbackContent: '',
                    workerId: item.workerId,
                    isIssueFeedback: false,
                    isShowFeedBack: false,
                    isShowFeedBackIconStyle: false,
                    isShowGiveLikeIconStyle: false,
                    workerName: item.workerName,
                    distName: item.distName,
                    finishTime: item.finishTime,
                    patientName: item.patientName,
                    bedNumber: item.bedNumber,
                    startPhoto: item.startPhoto,
                    endPhoto: item.endPhoto,
                    isBack: item.isBack,
                    isSign: item.isSign,
                    patientInfoList: item.patientInfoList
                  });
                  this.taskCount = this.stateCompleteList.length;
                } else if (type == "任务跟踪") {
                  this.taskTraceList.push({
                    state: item.state,
                    setOutPlaceName: item.setOutPlaceName,
                    destinationName: this.templateType == 'template_one' ? item.destinationName : item.destinations,
                    taskTypeName: item.taskTypeName,
                    toolName: item.toolName,
                    priority: item.priority,
                    id: item.id,
                    quarantine: item.quarantine,
                    patientName: item.patientName,
                    bedNumber: item.bedNumber,
                    workerName: item.workerName,
                    distName: item.distName,
                    patientInfoList: item.patientInfoList
                  });
                  console.log('122',this.taskTraceList);
                }
              }
            } else {
              this.noDataShow = true;
              this.taskCount = 0
            }
          } else {
            this.$toast(`${res.data.msg}`)
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
            this.noDataShow = true;
          });
          this.showLoadingHint = false;
        })
      },
      // 查询历史预约任务(已完成)
      queryCompleteAppointTask (data) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        this.stateCompleteList = [];
        queryAppointTaskMessage(data).then((res) => {
          this.showLoadingHint = false;
          if (res && res.data.code == 200) {
            this.isRefresh = false;
            if (res.data.data.length > 0) {
              this.noDataShow = false;
              for (let item of res.data.data) {
                this.stateCompleteList.push({
                  createTime: item.createTime,
                  planUseTime: item.planUseTime,
                  planStartTime: item.planStartTime,
                  state: item.state,
                  setOutPlaceName: item.setOutPlaceName,
                  taskNumber: item.taskNumber,
                  destinationName: item.destinationName,
                  taskTypeName: this.extractAppointTaskCheckType(item.checkItems),
                  toolName: item.toolName,
                  feedbackFlag: item.feedbackFlag,
                  priority: item.priority,
                  patientNumber: item.hospitalNo,
                  id: item.id,
                  distDepartments: item.distDepartments,
                  distName: this.extractAppointTaskDist(item.checkItems),
                  deedbackContent: '',
                  isIssueFeedback: false,
                  isShowFeedBack: false,
                  isShowFeedBackIconStyle: false,
                  isShowGiveLikeIconStyle: false,
                  quarantine: item.quarantine,
                  workerName: item.workerName,
                  workerId: item.workerId,
                  finishTime: item.finishTime,
                  patientName: item.patientName,
                  bedNumber: item.badNumber,
                  startPhoto: item.startPhoto,
                  endPhoto: item.endPhoto,
                  isBack: item.isBack,
                  isSign: item.isSign
                });
                this.taskCount = this.stateCompleteList.length;
              };
            } else {
              this.noDataShow = true;
              this.taskCount = 0
            }
          } else {
            this.$toast(`${res.data.msg}`)
          }
        })
        .catch((err) => {
          this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
          }).then(() => {
            this.noDataShow = true;
          });
          this.showLoadingHint = false;
        })
      },
      // 查询历史循环任务(已完成)
      queryCompleteCirculationTask (data) {
        this.noDataShow = false;
        this.showLoadingHint = true;
        this.stateCompleteList = [];
        queryCirculationTask(data).then((res) => {
          this.showLoadingHint = false;
          if (res && res.data.code == 200) {
            this.isRefresh = false;
            if (res.data.data.length > 0) {
              this.noDataShow = false;
              for (let item of res.data.data) {
                this.stateCompleteList.push({
                  startTime: item.startTime,
                  startUpTime: item.startUpTime,
                  state: item.state,
                  taskNumber: item.taskNumber,
                  taskTypeName: item.taskTypeName,
                  id: item.id,
                  feedbackFlag: item.feedbackFlag,
                  deedbackContent: '',
                  isIssueFeedback: false,
                  isShowFeedBack: false,
                  isShowFeedBackIconStyle: false,
                  isShowGiveLikeIconStyle: false,
                  workerId: item.workerId,
                  workerName: item.workerName,
                  distName: Object.values(JSON.parse(item.hasAccess)),
                  priority: item.priority,
									finishTime: item.finishTime,
									createTime: item.createTime,
                  hasAccess: item.hasAccess,

                });
                this.taskCount = this.stateCompleteList.length;
              };
              console.log('科室列表',this.stateCompleteList);
            } else {
              this.noDataShow = true;
              this.taskCount = 0
            }
          } else {
            this.$toast(`${res.data.msg}`)
          }
        })
          .catch((err) => {
            this.$dialog.alert({
              message: `${err.message}`,
              closeOnPopstate: true
            }).then(() => {
              this.noDataShow = true;
            });
            this.showLoadingHint = false;
          })
      },

      // 任务反对点击事件
      feedBackEvent(item, index, type) {
        this.stateCompleteList[index]['isShowFeedBackIconStyle'] = !this.stateCompleteList[index]['isShowFeedBackIconStyle'];
				this.stateCompleteList[index]['isShowFeedBack'] = !this.stateCompleteList[index]['isShowFeedBack'];
				if (this.stateCompleteList[index]['isShowFeedBack']) {
					if (!this.stateCompleteList[index]['deedbackContent']) {
						this.stateCompleteList[index]['deedbackContent'] == ''
					};
					this.inquireFeedback({
						proId: this.proId,
						signFlag: 2,
						typeFlag: '',
						state: 1
					})
				}
      },
      // 任务猜你想说项点击事件
      guessSpeakListEvent(index,innerItem,innerIndex) {
        if (this.stateCompleteList[index]['deedbackContent'].length == 0) {
          this.stateCompleteList[index]['deedbackContent'] = `${innerItem.name}`
        } else {
          this.stateCompleteList[index]['deedbackContent'] = `${this.stateCompleteList[index]['deedbackContent']},${innerItem.name}`
        }
      },
      // 总体反馈猜你想说项点击事件
      totalGuessSpeakListEvent(innerItem,innerIndex) {
        if (this.deedbackContent.length == 0) {
          this.deedbackContent = `${innerItem.name}`
        } else {
          this.deedbackContent = `${this.deedbackContent},${innerItem.name}`
        }
      }
    }
  }
</script>
<style lang='less' scoped>
  @import "~@/common/stylus/variable.less";
  @import "~@/common/stylus/mixin.less";
  @import "~@/common/stylus/modifyUi.less";
  .content-wrapper {
    .content-wrapper();
    position: relative;
    .header {
      .header-left {
        >span {
          font-size: 14px;
          color: #F8F9FA;
        }
      }
    };
     .no-data {
      position: absolute;
      top: 245px;
      left: 13%;
      width: 100%;
      text-align: center;
      z-index: 100
    }
    .loading {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
      width: 100%;
      text-align: center;
    };
    .play-voive-box {
      position: absolute;
      top: 60px;
      left: 10px
    };
    .worker-show {
      .content-wrapper();
      overflow: auto;
      .content-top {
        padding: 0 0 15px 0;
        font-size: 14px;
        color: #fff;
        background-image: linear-gradient(to bottom, #2895ea, #5173f8);
        .content-top-userName {
          padding: 0 10px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
          .content-top-userName-left {
            flex: 1;
            display: flex;
            flex-flow: row nowrap;
            justify-content: flex-start;
            align-items: center;
            padding-right: 10px;
            box-sizing: border-box;
            .content-top-userName-img {
              display: inline-block;
              width: 40px;
              height: 40px;
              vertical-align: middle;
              margin-right: 8px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .real-name {
              flex: 1;
              width: 0;
              font-size: 17px;
              .no-wrap()
            }
          };
          .content-top-userName-right {
            >span {
              padding: 6px;
              box-sizing: border-box;
              border: 1px solid #f3f3f3;
              font-size: 12px;
              color: #fff;
              border-radius: 4px
            }
          }
        };
        .wait-dask-wrapper {
          display: flex;
          flex-flow: row nowrap;
          height: 55px;
          align-items: center;
          .wait-dask-img-box {
            width: 45px;
            height: 45px;
            border-radius: 4px;
            box-sizing: border-box;
            margin-right: 8px;
            background: #4e70f8;
            img {
              width: 100%;
              height: 100%
            }
          };
          .wait-dask-list {
            flex: 1;
            border-radius: 4px;
            display: flex;
            align-items: center;
            flex-flow: row nowrap;
            justify-content: space-around;
            font-size: 16px;
            background-image: linear-gradient(to right, #4e70f8,#5662f6);
            .listTaskStyle {
              color: #eb0000
            };
            li {
              display: flex;
              flex-flow: row nowrap;
              align-items: center;
              justify-content: center;
              height: 45px;
              position: relative;
              .dask-list-sign {
                box-shadow: 0px 0px 4px 4px #747474;
                .status-sign(40px,40px,0,orange)
              }
              .daskListSignStyle {
                .status-sign(40px,40px,0, #eb0000)
              }
            }
          }
        };
      };
      .content-middle-task-message {
        height: 100px;
        background: #f2f2f2;
        padding: 16px 0;
        box-sizing: border-box;
        .task-message-number-wrapper {
          height: 68px;
          padding: 10px 0;
          position: relative;
          box-sizing: border-box;
          .task-message-img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            img {
              width: 100%;
              height: 100%;
            }
          };
          .task-message-number {
            box-sizing: border-box;
            color: #434343;
            font-size: 0;
            height: 48px;
            .transport-day-number::after {
              content:"";
              background: #e3e3e3;
              position: absolute;
              top: 0;
              right: 0;
              width: 1px;
              height: 48px
            };
            .transport-day-number {
              font-size: 13px;
              height: 48px;
              width: 50%;
              display: inline-block;
              position: relative;
              span {
                position: absolute;
                left: 0;
                width: 100%;
                text-align: center;
                &:first-child {
                  top: 0
                };
                &:last-child {
                  bottom: 0;
                  font-size: 28px;
                  color: #2499e9
                }
              }
            }
            .transport-day-rank {
              height: 100%;
              font-size: 13px;
              width: 50%;
              height: 48px;
              display: inline-block;
              position: relative;
              span {
                width: 100%;
                text-align: center;
                position: absolute;
                right: 0;
                &:first-child {
                  top: 0
                };
                &:last-child {
                  bottom: 0;
                  font-size: 28px;
                  color: #fa8118;
                  right: 0;
                }
              }
            }
          }
        }
      }
      .content-bottom {
        flex-direction: column;
        flex:1;
        display: flex;
        height: 0;
        overflow: auto;
        margin: 0 auto;
        margin-top: 16px;
        width: 100%;
        .task-button  {
          flex: 1;
          box-sizing: border-box;
          padding: 0 16px;
          li {
            width:49.5%;
            height: 130px;
            border-radius: 4px;
            display:inline-block;
            text-align: center;
            padding-top: 25px;
            box-sizing: border-box;
            position: relative;
            .task-button-wrapper {
              width: 100%;
              height: 130px;
              position: absolute;
              top: 0;
              left: 0;
              z-index: -1;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .task-btn-img {
              width: 40px;
              height: 40px;
              margin: 0 auto;
              img {
                width: 100%;
                height: 100%;
              }
            };
            .task-btn-tit {
              color: black;
              font-size: 16px;
              margin-top: 15px;
            }
            &:nth-child(3) {
              margin-top: 4px
            };
            &:nth-child(4) {
              margin-top: 4px
            };
            &:nth-child(odd) {
              margin-right: 1%
            }
          }
        }
        .task-version {
          line-height: 30px;
          span {
            width: 100%;
            display: inline-block;
            text-align: center;
            color:#bebebe;
            font-size: 16px
          }
        }
      };
      .left-dropDown {
        .rightDropDown
      }
    }
    .medical-worker-show {
      position: relative;
      .content-wrapper();
      overflow: auto;
      .left-dropDown {
        .rightDropDown
      }
      .medical-worker-operate {
        font-size: 14px;
        flex:1;
        display: flex;
        flex-flow: row nowrap;
        overflow: auto;
        margin: 0 auto;
        width: 100%;
        >div {
          display: inline-block
        }
        .medical-worker-operate-left {
          background: #3a4862;
          .medical-worker-operate-list {
            height: 100%;
            width: 80px;
            .medical-worker-operate-list-inner {
              height: 90px;
              padding-top: 20px;
              box-sizing: border-box;
              text-align: center;
              border-bottom: 1px solid #fff;
              background: #3a4862;
              .operate-list-img {
                margin: 0 auto;
                width: 30px;
                height: 30px;
                margin-bottom: 10px;
                img {
                  width: 100%;
                  height: 100%
                }
              };
              .operate-list-tit {
                color: #fff;
                font-size: 12px;
              }
            };
            .operate-list-inner-style {
              background: #15c4f9 !important;
            };
          }
        };
        .medical-worker-operate-right {
          flex: 1;
          background: #fff;
          .medical-worker-operate-right-inner {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            > div {
              display: flex;
              flex: 1;
              flex-direction: column;
              background: #fff;
              > p {
                height: 30px;
                font-size: 14px;
                line-height: 30px;
                background: #fff;
                padding-left: 8px;
                box-sizing: border-box;
                color: black;
              }
              .transport-type-area {
                  flex:1;
                  overflow: auto;
                  margin: 0 auto;
                  margin: 10px 0;
                  width: 100%;
                  .destination-box {
                    padding-left: 15px;
                    box-sizing: border-box;
                    > div {
                        display: inline-block
                      };
                      .destination-title {
                        width: 24%;
                        color: #323233;
                      }
                    .destination-content {
                      width: 66%;
                      /deep/ .van-dropdown-menu {
                        .van-dropdown-menu__item {
                          .van-dropdown-menu__title {
                              width: 100%;
                              padding: 0;
                              color: #323233;
                              font-size: 14px;
                          }
                        }
                        .van-dropdown-menu__bar {
                          box-shadow: none
                        }
                        .van-dropdown-item {
                          left: 24%
                        }
                      }
                    }
                  }
                  /deep/ .van-cell {
                    .van-field__label {
                      width: 24%;
                      margin-right: 8px
                    }
                  }
                }
                .btn-area {
                  height: 80px;
                  text-align: center;
                  line-height: 80px;
                  span {
                    .bottomButton;
                    display: inline-block;
                    margin-top: 15px;
                    img {
                      width: 100%;
                      height: 100%
                    }
                  }
                }
              .medical-worker-task-list-box {
                flex:1;
                overflow: auto;
                overflow-x: hidden;
                .medical-worker-task-list {
                  height: 40px;
                  position: relative;
                  background: #fff;
                  box-sizing: border-box;
                  .list-content {
                    position: absolute;
                    top: 0;
                    left: 8px;
                    color: black;
                    height: 40px;
                    line-height: 40px;
                    .bottom-border-1px(#dcdcdc);
                  }
                  .list-icon {
                    position: absolute;
                    top: 12px;
                    right: 4px;
                    color: #b4b4b4;
                  }
                }
              }
            };
            .medical-version {
              width: 100%;
              height: 40px;
              display: flex;
              padding: 0 10px;
              box-sizing: border-box;
              flex-flow: row nowrap;
              justify-content: space-between;
              align-items: center;
              color:#bebebe;
              font-size: 16px;
              span {
                display: inline-block;
                &:first-child {
                  padding-left: 6px;
                  box-sizing: border-box;
                };
                &:last-child {
                  padding-right: 6px;
                  box-sizing: border-box;
                }
              }
            };
            .medical-worker-operate-right-message {
              p {
                color: #2895ea;
                font-size: 16px;
                position: relative;
                height: 40px !important;
                line-height: 40px !important;
                .bottom-border-1px(#d0d0d0);
              }
            }
            .medical-worker-operate-right-taskCollect {
              p {
                color: #2895ea;
                font-size: 16px;
                position: relative;
                height: 40px !important;
                line-height: 40px !important;
                .bottom-border-1px(#d0d0d0);
              }
            };
            .medical-worker-operate-right-taskFeedback {
              padding: 0 8px;
              box-sizing: border-box;
              .feedback-icon {
                height: 140px;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
              };
              /deep/ .van-cell {
                border: 1px solid #dadada;
                background-color: #f6f6f6
              };
              .idea-type {
                color: black;
                font-size: 14px;
                font-weight: bold;;
                margin-bottom: 12px;
                >span {
                  color: red;
                }
              };
              .guess-speak {
                margin: 20px 0;
                font-size: 12px;
                color: #767676;
              };
              .guess-speak-list {
                  display: flex;
                  flex-flow: row wrap;
                  justify-content: flex-start;
                  height: 100px;
                  overflow: auto;
                  padding: 6px 0;
                  box-sizing: border-box;
                  >span {
                    font-size: 13px;
                    color: #a59f9f;
                    display: inline-block;
                    box-sizing: border-box;
                    height: 30px;
                    max-width: 250px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 30px;
                    border-radius: 20px;
                    padding: 0 8px;
                    box-sizing: border-box;
                    text-align: center;
                    border: 1px solid #a59f9f;
                    margin: 0 8px 8px 0;
                  }
              };
              .idea-type-list {
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                span {
                  font-size: 13px;
                  color: #a59f9f;
                  display: inline-block;
                  padding: 8px 16px;
                  background: #f4f4f4;
                  box-sizing: border-box;
                  text-align: center;
                  border: 1px solid #a59f9f;
                  margin: 0 8px 8px 0;
                };
                .opinionTypeStyle {
                  border: none;
                  background: #63bbff;
                  color: #ffff;
                }
              };
              .feedback-idea {
                color: black;
                font-size: 14px;
                font-weight: bold;
                margin: 12px 0;
                >span {
                  color: red;
                }
              };
              .feedback-btn {
                width: 100%;
                margin: 0 auto;
                margin-top: 10px;
                height: 42px;
                line-height: 42px;
                color: #fff;
                font-size: 13px;
                text-align: center;
                background: #63bbff
              }
            };
            .medical-worker-operate-right-callOut {
              .medical-worker-transport-type {
                color: #2895ea;
              }
              p {
                color: #545454;
                font-size: 16px;
                position: relative;
                height: 40px !important;
                line-height: 40px !important;
                .bottom-border-1px(#d0d0d0);
                /deep/ .van-icon  {
                  position: absolute;
                  top: 11px;
                  right: 6px
                }
              }
            }
            .medical-worker-operate-right-historyTask {
              flex:1;
              overflow: auto;
              .task-switch {
                width: 100%;
                display: flex;
                flex-flow: row nowrap;
                justify-content: center;
                align-items: center;
                height: 50px;
                >span {
                  display: inline-block;
                  font-size: 16px;
                  color: #333;
                  text-align: center;
                  width: 30%;
                  margin-right: 2%;
                  line-height: 50px;
                  height: 50px;
                  &:last-child {
                    margin-right: 0
                  }
                };
                .active-tab-style {
                  color: #2895ea;
                  font-size: 17px;
                  font-weight: bold;
                  position: relative;
                  &:after {
                    content: '';
                    position: absolute;
                    bottom: 4px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 26px;
                    height: 4px;
                    background: #2895ea;
                    border-radius: 2px;
                  }
                };
              };
              /deep/ .van-tabs--line {
                .van-tabs__line {
                  background-color: @color-theme;
                }
              };
              /deep/ .van-tabs {
                .right-sign {
                  .status-sign-pad
                };
                .van-tabs__content {
                  background: #fafafa;
                  padding-top: 8px;
                  box-sizing: border-box;
                };
                .van-tabs__nav {
                  .van-tab {
                    font-size: 18px;
                    flex-basis: 33% !important;
                  }
                }
              };
              > p {
                color: #2895ea;
                font-size: 16px;
                background: #fff;
                padding-left: 10px;
                box-sizing: border-box;
                position: relative;
                height: 40px !important;
                line-height: 40px !important;
                .bottom-border-1px(#d0d0d0);
              }
                .historyTask-box {
                  .historyTask-list-box {
                    display: flex;
                    height: 100%;
                    flex-direction: column;

                    /deep/ .van-tabs {
                      flex: 1;
                      overflow: auto
                    }
                  ;

                    .time-search {
                      background: #fff;
                      height: 44px;
                      position: relative;

                      /deep/ .van-cell {
                        width: 100%;
                        display: inline-block;
                        padding: 10px 10px;
                        box-sizing: border-box;
                        border: 1px solid #d8d5d5;
                        border-radius: 4px;
                        line-height: 0;
                      }

                      .time-between {
                        color: black;
                        position: absolute;
                      }

                      .content-middle-top-content {
                        position: relative;
                        height: 100%;
                        width: 100%;
                        margin: 0 auto;

                        > div {
                          width: 44%;
                          position: absolute;
                          top: 14%;
                        }
                      }
                    }
                  ;

                    .middle-top-search {
                      width: 100%;
                      margin: 4px 0;
                      text-align: center;

                      span {
                        display: inline-block;
                        width: 70px;
                        height: 30px;

                        img {
                          width: 100%;
                          height: 100%
                        }
                      }
                    }

                    .historyTask-list {
                      .wait-handle-list {
                        box-sizing: border-box;
                        position: relative;
                        box-sizing: border-box;
                        background: #fff;
                        width: 96%;
                        margin: 0 auto;
                        margin-bottom: 8px;
                        &:last-child {
                          margin-bottom: 0
                        };
                        .wait-handle-message-createTime {
                          height: 24px;
                          line-height: 24px;
                          font-size: 12px;
                          color: #7f7d7d
                        };
                        .wait-handle-message-planUseTime {
                          position: absolute;
                          top: 6px;
                          right: 10px;
                          font-size: 12px;
                          color: #7f7d7d
                        }
                      ;

                        .wait-handle-message {
                          font-size: 12px;
                          box-sizing: border-box;
                          .wait-handle-message-top {
                            display: flex;
                            flex-flow: row nowrap;
                            justify-content: space-between;
                            height: 40px;
                            align-items: center;
                            background: #f1f1f1;
                            > p {
                              font-size: 14px;
                              color: #7f7d7d;
                              &:first-child {
                                flex: 1;
                                overflow: auto;
                                height: 40px;
                                display: flex;
                                align-items: center;
                                word-break: break-all;
                              };
                              &:nth-child(2) {
                                height: 40px;
                                display: flex;
                                align-items: center;
                                img {
                                  width: 27px;
                                  height: 27px;
                                  margin: 0 4px;
                                  vertical-align: middle
                                }
                              };
                              &:last-child {
                                width: 60px;
                                color: #0ac50a;
                                justify-content: flex-end;
                                height: 40px;
                                display: flex;
                                align-items: center;
                              }
                            }
                          };
                          .wait-handle-message-middle {
                            font-size: 15px;
                            color: black;
                            line-height: 20px;
                            text-align: justify;
                            margin-top: 6px;
                          };
                          .handle-message-line-wrapper {
                            .adimission-number {
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis
                            };
                            p {
                              width: 47%;
                              height: 30px;
                              line-height: 30px;
                              display: inline-block;
                              overflow: auto;
                              vertical-align: top;
                              > span {
                                &:first-child {
                                  margin-right: 2px
                                }
                              };
                              .message-tit {
                                color: #7f7d7d
                              }
                            ;

                              .message-tit-real {
                                color: black
                              }
                            }
                          };
                          .handle-message-line-wrapper-one-line {
                            > p {
                              width: 100%;
                              > span {
                                &:first-child {
                                  margin-right: 2px
                                }
                              }
                            }
                          };
                          .feedback-area {
                            display: flex;
                            flex-direction: column;
                            .feedback-top {
                              display: flex;
                              flex-flow: row nowrap;
                              justify-content: space-between;
                              align-items: center;
                              background: #f7f7f7;
                              height: 60px;
                              .left {
                                flex: 1;
                                word-break: break-all;
                                line-height: 20px;
                                display: flex;
                                flex-flow: row nowrap;
                                align-items: center;
                                span {
                                  color: black;
                                  display: inline-block;
                                  &:nth-child(2) {
                                    font-size: 13px;
                                    margin: 0 2px;
                                  };
                                  &:nth-child(3) {
                                    font-size: 13px;
                                    height: 50px;
                                    display: flex;
                                    flex-flow: row nowrap;
                                    align-items: center;
                                    overflow: auto;
                                    flex: 1;
                                  }
                                }
                              };
                              .right {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: space-between;
                                align-items: center;
                                height: 50px;
                                width: 160px;
                                padding: 0 8px;
                                box-sizing: border-box;
                                border: 1px solid #e2e2e2;
                                border-radius: 30px;
                                .left-feedback-icon {
                                  width: 50px;
                                  height: 50px;
                                  display: flex;
                                  flex-flow: row nowrap;
                                  justify-content: center;
                                  align-items: center;
                                  border-right: 1px solid #a59f9f;
                                };
                                .right-like-icon {
                                  flex: 1;
                                  text-align: center;
                                  span {
                                    font-size: 12px;
                                    color: #a59f9f;
                                    margin-left: 4px
                                  };
                                  .give-like-text-style {
                                    color: orange
                                  }
                                }
                              };
                              .thank-feedback {
                                display: flex;
                                flex-flow: row nowrap;
                                justify-content: space-between;
                                align-items: center;
                                height: 50px;
                                padding: 0 8px;
                                box-sizing: border-box;
                                color: orange;
                                font-size: 14px;
                              }
                            };
                          .feedback-bottom {
                            .idea-feedback {
                              color: black;
                              font-size: 13px;
                              margin: 12px 0;
                            };
                            /deep/ .van-cell {
                              border: 1px solid #dadada
                            };
                            .guess-speak {
                              font-size: 12px;
                              color: #a59f9f;
                              height: 30px;
                              line-height: 30px
                            };
                            .guess-speak-list {
                                display: flex;
                                flex-flow: row wrap;
                                justify-content: flex-start;
                                height: 100px;
                                overflow: auto;
                                >span {
                                  font-size: 13px;
                                  color: #a59f9f;
                                  display: inline-block;
                                  max-width: 250px;
                                  box-sizing: border-box;
                                  height: 30px;
                                  line-height: 30px;
                                  padding: 0 8px;
                                  box-sizing: border-box;
                                  border-radius: 20px;
                                  text-align: center;
                                  overflow: hidden;
                                  white-space: nowrap;
                                  text-overflow: ellipsis;
                                  border: 1px solid #a59f9f;
                                  margin: 0 8px 8px 0;
                                }
                            };
                            .submit-feedback {
                              width: 180px;
                              height: 40px;
                              background: orange;
                              font-size: 13px;
                              text-align: center;
                              line-height: 40px;
                              color: #fff;
                              margin: 0 auto;
                              margin-top: 12px;
                              border-radius: 20px;
                            }
                          }
                        }
                    };

                        .wait-handle-check {
                          position: absolute;
                          top: 60px;
                          left: 6px
                        }
                      ;

                        .get-wait-task {
                          width: 100%;
                          text-align: center;

                          span {
                            display: inline-block;
                            width: 90px;
                            height: 40px;

                            img {
                              width: 100%;
                              height: 100%
                            }
                          }
                        }
                      }
                    };
                    .historyTask-list-cancel {
                      .wait-handle-message-top {
                        > p {
                          &:nth-child(2) {
                            img {
                              width: 27px;
                              height: 27px;
                              margin: 0 4px;
                              vertical-align: middle
                            }
                          };
                          &:last-child {
                            color: indianred !important;
                          }
                        }
                      };
                    }
                  };
                  .historyTask-list-circulation-box {
                    .message-tit {
                      color: black !important
                    };
                    .dist-list {
                      display: flex;
                      flex-flow: row wrap;
                      justify-content: space-between;
                      >span {
                        display: inline-block;
                        padding: 6px 10px;
                        box-sizing: border-box;
                        width: 48%;
                        margin-bottom: 10px;
                        border: 1px solid #d5d5d5;
                        font-size: 12px;
                        color: #333;
                        text-align: center
                      }
                    }
                  }
                }
            }
            .wait-handle-box {
              overflow: auto;
              .medical-worker-operate-right-taskTrace {
                display: flex;
                height: 100%;
                flex-direction: column;
                > p {
                  color: #2895ea;
                  font-size: 16px;
                  background: #fff;
                  padding-left: 10px;
                  box-sizing: border-box;
                  position: relative;
                  height: 40px !important;
                  line-height: 40px !important;
                  .bottom-border-1px(#d0d0d0);
                  /deep/ .van-icon  {
                    position: absolute;
                    top: 11px;
                    right: 6px
                  }
                }
                .task-list-trace {
                  box-sizing: border-box;
                  position: relative;
                  flex: 1;
                  overflow: auto;
                  .task-list-inner {
                    background: #f7f7f7;
                    padding-bottom: 10px;
                    box-sizing: border-box;
                    margin-bottom: 6px;
                    .wait-handle-message {
                      font-size: 14px;
                      padding-top: 6px;
                      box-sizing: border-box;
                      .wait-handle-message-top {
                        display: flex;
                        flex-flow: row nowrap;
                        justify-content: space-between;
                        height: 40px;
                        align-items: center;
                        background: #f1f1f1;
                        > p {
                          font-size: 14px;
                          color: #7f7d7d;
                          &:first-child {
                            flex: 1;
                            overflow: auto;
                            height: 40px;
                            display: flex;
                            align-items: center;
                            word-break: break-all
                          };
                          &:nth-child(2) {
                            img {
                              width: 27px;
                              height: 27px;
                              margin: 0 4px;
                              vertical-align: middle
                            }
                          };
                          &:last-child {
                            width: 60px;
                            color: #0ac50a;
                            justify-content: flex-end;
                            height: 40px;
                            display: flex;
                            align-items: center;
                          }
                        }
                      };
                      .handle-message-line-wrapper {
                        .adimission-number {
                          overflow: hidden;
                          white-space: nowrap;
                          text-overflow: ellipsis
                        };
                        p {
                          width: 24%;
                          display: inline-block;
                          text-align: left;
                          height: 30px;
                          line-height: 30px;
                          overflow: auto;
                          vertical-align: top;
                          > span {
                            &:first-child {
                              margin-right: 2px;
                            };
                            &:last-child {
                              line-height: 24px;
                            }
                          }
                          .message-tit {
                            color: #7f7d7d
                          };
                          .message-tit-real {
                            color: black
                          }
                          .message-tit-real-style {
                            color: #2895ea
                          }
                        }
                        .destiname-line {
                          span {
                            line-height: 24px;
                          }
                        }
                      };
                      .handle-message-line-wrapper-one-line {
                        p {
                          width: 100%;
                        }
                      };
                      .feedback-area {
                        display: flex;
                        flex-direction: column;
                        .feedback-top {
                          display: flex;
                          flex-flow: row nowrap;
                          justify-content: space-between;
                          align-items: center;
                          height: 60px;
                          .left {
                            flex: 1;
                            word-break: break-all;
                            line-height: 20px;
                            display: flex;
                            flex-flow: row nowrap;
                            align-items: center;
                            span {
                              color: black;
                              display: inline-block;
                              &:nth-child(1) {
                                font-size: 13px;
                                margin-left: 2px;
                              };
                              &:nth-child(2) {
                                font-size: 13px;
                                height: 50px;
                                display: flex;
                                flex-flow: row nowrap;
                                align-items: center;
                                overflow: auto;
                                flex: 1;
                              }
                            }
                          }
                        };
                        .feedback-bottom {

                        }
                      }
                    };
                    .contact-isolation-box {
                      width: 100%;
                      height: 50px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      >img {
                        width: 27px;
                        height: 27px;
                      }
                    };
                    .btn-area-trace {
                      text-align: center;
                      height: 25px;
                      > span {
                        width: 60px;
                        height: 25px;
                        line-height: 25px;
                        border-radius: 4px;
                        color: #fff;
                        display: inline-block;
                        &:first-child {
                          margin-right: 12px;
                          background: #2895ea
                        }
                        &:last-child {
                          margin-right: 12px;
                          background: orange
                        }
                      }
                    }
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
