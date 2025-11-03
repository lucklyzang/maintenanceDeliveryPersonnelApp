<template>
  <div class="content-wrapper" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
<!--      <span class="right-text" slot="right" @click="takePhoto">自主拍照</span>-->
    </HeaderTop>
    <div class="content">
      <div class="basic-message" ref="basicMessage">
        <p class="basic-mesage-state">
          <img :src="stateTransferImg(dispatchTaskMessage.state)" alt="">
        </p>
        <p class="basic-message-title">
          <span>
            <img :src="taskInfoPng" alt="">
          </span>
          基本信息
        </p>
         <div class="wait-handle-message">
           <div class="wait-handle-message-top">
            <div class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
              <P>
                <span class="message-tit">任务类型 :&nbsp;</span>
                <span class="message-tit-real">{{dispatchTaskMessage.taskTypeName}}</span>
              </P>
            </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit" :class="{'priorityTwoStyle' : dispatchTaskMessage.priority != 1}">优&nbsp;&nbsp;先&nbsp;级 :&nbsp;</span>
                 <span class="message-tit-real" :class="[dispatchTaskMessage.priority==1 ? 'priorityOneStyle' : 'priorityTwoStyle']">{{priorityTransfer(dispatchTaskMessage.priority)}}</span>
               </p>
             </div>
            <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
              <P>
                <span class="message-tit">任务起点 :&nbsp;</span>
                <span class="message-tit-real">{{dispatchTaskMessage.setOutPlaceName}}</span>
              </P>
            </div>
            <div class="handle-message-line-wrapper handle-message-line-wrapper-other" v-if="templateType === 'template_one'">
              <P>
                <span class="message-tit">任务终点 :&nbsp;</span>
                <span class="message-tit-real">{{dispatchTaskMessage.destinationName}}</span>
              </P>
            </div>
           <div class="handle-message-line-wrapper-other-two" v-else-if="templateType === 'template_two'">
             <P>
               <span class="message-tit">任务终点 :&nbsp;</span>
             </P>
             <p>
               <span class="message-tit-real message-tit-real-destinationList" v-for="(innerItem,innerindex) in dispatchTaskMessage.destinations" :key="innerindex">{{innerItem.destinationName}}</span>
             </p>
           </div>
            <div class="handle-message-line-wrapper handle-message-line-wrapper-other">
              <p>
                <span class="message-tit">任务时间 :&nbsp;</span>
                <span class="message-tit-real">{{dispatchTaskMessage.planStartTime}}</span>
              </p>
            </div>
           </div>
           <div class="wait-handle-message-middle">
              <div class="handle-message-line-wrapper message-name" v-if="templateType === 'template_one'">
                <P>
                  <span class="message-tit" :class="{'spanStyle' : dispatchTaskMessage.quarantine == 1}">病人姓名 :&nbsp;</span>
                  <span class="message-tit-real" :class="{'spanStyle' : dispatchTaskMessage.quarantine == 1}">{{dispatchTaskMessage.patientName == "" ? '无' : dispatchTaskMessage.patientName}}</span>
                  <img :src="contactIsolationPng" v-if="dispatchTaskMessage.quarantine == 1">
                </P>
              </div>
             <div class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
               <p>
                 <span class="message-tit" :class="{'spanStyle' : dispatchTaskMessage.quarantine == 1}">床&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号 :&nbsp;</span>
                 <span class="message-tit-real" :class="{'spanStyle' : dispatchTaskMessage.quarantine == 1}">{{dispatchTaskMessage.bedNumber == "" ? '无' : dispatchTaskMessage.bedNumber}}</span>
               </p>
             </div>
             <div class="handle-message-line-wrapper" v-if="templateType === 'template_one'">
               <p>
                 <span class="message-tit">年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;龄 :&nbsp;</span>
                 <span class="message-tit-real">{{dispatchTaskMessage.age == "" ? '无' : dispatchTaskMessage.age}}</span>
               </p>
             </div>
            <div class="handle-message-line-wrapper">
                <p>
                  <span class="message-tit">数&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量 :&nbsp;</span>
                  <span class="message-tit-real">{{dispatchTaskMessage.actualCount == "" ? "无" : dispatchTaskMessage.actualCount}}</span>
                </p>
              </div>
             <div class="handle-message-line-wrapper">
               <p>
                 <span class="message-tit">转运工具 :&nbsp;</span>
                 <span class="message-tit-real">{{dispatchTaskMessage.toolName == "" ? '无' : dispatchTaskMessage.toolName}}</span>
               </p>
             </div>
              <div class="handle-message-line-wrapper">
                <p class="describe-line-wrapper">
                  <span class="message-tit">语音备注 :&nbsp;</span>
                  <span class="message-tit-real-audio" v-if="showChildrenComponent">
                    <MyAudio v-if="!dispatchTaskMessage.recordTime != true" :src="`http://show.blinktech.cn/trans/${dispatchTaskMessage.taskNumber}.mp3`"></MyAudio>
                  </span>
                  <span class="message-tit-real" v-show="!dispatchTaskMessage.recordTime">
                    无语音信息
                  </span>
                </p>
              </div>
           </div>
           <div class="wait-handle-message-content">
             <div class="transport-type-wrapper" v-if="templateType === 'template_two'">
               <div class="transport-type-title">
                 运送类型 :&nbsp;
               </div>
               <div class="transport-type-content">
                 <div class="transport-type-list-wrapper" v-for="(item,index) in transportList" :key="index">
                    <div class="transport-type-list">
                      <p class="transport-type-list-title">{{item.parentTypeName == '' ? '无': item.parentTypeName}}</p>
                      <p class="transport-type-list-content" v-for="(itemInner,indexInner) in item.typeList" :key="indexInner">
                        <span class="serial"  style="vertical-align: middle;">{{indexInner+1}}、</span>
                        <span :class="{'spanStyle' : itemInner.quarantine == 1}"  style="vertical-align: middle;">
                          床号 : {{itemInner.bedNumber}},{{itemInner.patientName}},{{genderTransfer(itemInner.sex)}};
                        </span>
                        <span v-for="(targetItem, targetIndex) in itemInner.typeChildList" :key="targetIndex" style="vertical-align: middle;">
                          {{targetItem.taskTypeName}}×{{targetItem.quantity}};
                        </span>
                        <img :src="contactIsolationPng" v-if="itemInner.quarantine == 1">
                      </p>
                    </div>
                  </div>
               </div>
              </div>
           </div>
           <div class="wait-handle-message-bottom">
              <div class="handle-message-line-wrapper">
               <p class="describe-line-wrapper">
                 <span class="message-tit">任务描述 :&nbsp;</span>
                 <span class="message-tit-real">{{dispatchTaskMessage.taskRemark ? dispatchTaskMessage.taskRemark : '无'}}</span>
               </p>
              </div>
           </div>
        </div>
      </div>
  <!--    <div class="content-middle">-->
  <!--      <p class="issue-photo">-->
  <!--        <span>问题拍照</span>-->
  <!--        <ul class="photo-list">-->
  <!--          <li v-for="(item,index) in issueImageList" :key="`${item}-${index}`" v-show="dispatchTaskMessage.state !== 7">-->
  <!--            <img width="100" height="130" :src="item" @click="enlargeCompleteImgEvent(item)"/>-->
  <!--            <van-icon name="cross" @click="issueDelete(index)"/>-->
  <!--          </li>-->
  <!--          <li v-for="(item,index) in historyIssueImageList" :key="`${item}-${index}`" v-show="dispatchTaskMessage.state == 7">-->
  <!--            <img width="100" height="130" :src="Base64.decode(item)" @click="enlargeCompleteImgEvent(Base64.decode(item))"/>-->
  <!--          </li>-->
  <!--        </ul>-->
  <!--        <span @click="issueClickEvent" class="icon-wrapper" v-show="dispatchTaskMessage.state !== 7">-->
  <!--              <van-icon name="plus"/>-->
  <!--        </span>-->
  <!--      </p>-->
  <!--    </div>-->
      <div class="office-list">
        <div class="basic-message-title">
          <span>
            <img :src="siteTractPng" alt="">
          </span>
          地点轨迹
        </div>
        <div class="office-list-inner-wrapper">
          <div class="track-name" v-if="dispatchTaskMessage.state !== 7">
            <div class="track-name-top">
              <span>{{dispatchTaskMessage.hasSanOut ? dispatchTaskMessage.hasSanOut.split(';')[0] : ''}}</span>
              <span v-show="dispatchTaskMessage.hasSanOut!=''" class="collect-parcel">(取件)</span>
            </div>
            <div class="track-name-bottom">
              <p v-for="(item,index) in dispatchTaskMessage.distName" :key="`we${item}-${index}`">
                <span>{{item}}</span>
                <span class="send-parcel">(送件)</span>
                <span>
                  <img :src="nextStepPng" alt="">
                </span>
              </p>
            </div>
          </div>
          <div class="track-name" v-else>
            <div class="track-name-top">
              <span>{{dispatchTaskMessage.setOutPlaceName}}</span>
              <span class="collect-parcel">(取件)</span>
            </div>
            <div class="track-name-bottom">
              <p v-for="(item,index) in dispatchTaskMessage.distName" :key="`we${item}-${index}`">
                <span>{{item}}</span>
                <span class="send-parcel">(送件)</span>
                <span>
                  <img :src="nextStepPng" alt="">
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="circultion-task-btn">
      <p class="circultion-task-btn-top" v-show="dispatchTaskMessage.state != 7">
        <span @click="fetchPiece">取件</span>
        <span @click="sendPiece">送件</span>
      </p>
      <p class="circultion-task-btn-bottom" v-show="!isSingleDestination && dispatchTaskMessage.state != 7 && dispatchTaskMessage.state != 2">
        <span @click="endTask">完成任务</span>
      </p>
      <p class="circultion-task-btn-bottom"  v-show="dispatchTaskMessage.state == 7">
        <span @click="backTo">返回</span>
      </p>
    </div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <van-dialog v-model="enlargeImgShow" width="90%">
      <img :src="enlargeImgUrl">
    </van-dialog>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import { mergeMethods } from '@/common/js/utils'
import {updateDispatchTask,getDispatchTaskMessageById} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import MyAudio from '@/components/MyAudio'
import Ldselect from '@/components/Ldselect'
import { mapGetters, mapMutations } from 'vuex'
import { setStore,  IsPC,  Dictionary, deepClone, compress } from '@/common/js/utils'
export default {
  name: 'dispatchDetails',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      liIndex: null,
      moveInfo: {
        startX: ''
      },
      transportList: [],
      trackList: [],
      showChildrenComponent: false,
      overlayShow: false,
      loadingShow: false,
      enlargeImgShow: false,
      photoBox: false,
      enlargeImgUrl: '',
      issueImageList: [],
      testDist: ['急诊一科','肛肠科','刷刷科','急诊二科','急诊三科','急诊四科','肝病科','胃肠科','心内科'],
      historyIssueImageList: [],
      taskInfoPng: require('@/common/images/home/basic-message.png'),
      siteTractPng: require('@/common/images/home/site-tract.png'),
      nextStepPng: require('@/common/images/home/next-step.png'),
      noEndPng: require('@/common/images/home/no-end.png'),
      noReferPng: require('@/common/images/home/no-refer.png'),
      noStartPng: require('@/common/images/home/no-start.png'),
      taskFinshedPng: require('@/common/images/home/task-finshed.png'),
      taskGoingPng: require('@/common/images/home/task-going.png'),
      taskCancelPng: require('@/common/images/home/task-cancel.png'),
      waitSurePng: require('@/common/images/home/wait-sure.png'),
      contactIsolationPng: require("@/common/images/home/contact-isolation.png")
    }
  },

  components: {
    HeaderTop,
    NoData,
    Ldselect,
    FooterBottom,
    MyAudio
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'completeDeparnmentInfo',
      'isCompleteSweepCodeDestinationList',
      'departmentInfoListNo',
      'dispatchTaskMessage',
      'isSingleDestination',
      'dispatchTaskState',
      'dispatchTaskDepartmentType',
      'isCompleteSweepCode',
      'isBack',
      'dispatchTaskId',
      'currentDepartmentNumber',
      'catch_components',
      'isCompleteDispatchIssuePhotoList',
      'templateType'
    ]),

    proId () {
      return this.userInfo.extendData.proId
    },
    userName () {
      return this.userInfo.userName
    },
    proName () {
      return this.userInfo.extendData.proName
    },
    workerId () {
      return this.userInfo.extendData.userId
    },
    taskId () {
      return this.dispatchTaskMessage.id
    }
  },


  mounted () {
    // if (true) {
    //   this.$refs['basicMessage'].style.height = "450px";
    // }
    // 控制设备物理按键返回
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        if (this.dispatchTaskMessage.state == 7 || this.dispatchTaskMessage.state == 6 ) {
          this.changeIsFreshDispatchTaskPage(false)
        } else {
          this.changeIsFreshDispatchTaskPage(true)
        };
        this.$router.push({path:'/dispatchTask'});
        this.changeTitleTxt({tit:'调度任务'});
        setStore('currentTitle','调度任务')
      })
    };
    document.addEventListener('click', (e) => {
      if(e.target.className !='van-icon van-icon-plus' && e.target.className != 'quit-account'){
        this.photoBox = false;
        this.overlayShow = false
      }
    });
    this.$nextTick(()=> {
      try {
        this.registerSlideEvent()
      } catch (error) {
        // this.$toast({
        //   type: 'fail',
        //   message: error
        // })
      }
    });
    this.echoPhoto();
    this.getTaskMessage()
  },

  beforeRouteLeave(to, from, next) {
    if (to.name == 'dispatchTaskSweepCode'){
      this.changeIsCallDispatchSweepcodeMethod(true)
    };
    next()
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeIsCompleteSweepCodeDestinationList',
      'changeisCompleteSweepCode',
      'changeIsFreshDispatchTaskPage',
      'changeDispatchTaskMessage',
      'changeIsCoerceTakePhoto',
      'changeDispatchTaskDepartmentType',
      'changeDispatchTaskState',
      'changeCurrentDepartmentNumber',
      'changeCatchComponent',
      'changeIsCallDispatchSweepcodeMethod',
      'changeIsCompleteDispatchIssuePhotoList'
    ]),

    // 图片上传预览
    previewFileOne() {
      let Orientation;
      let file = document.getElementById("demo1").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      if (!isLt2M) {
        this.$dialog.alert({
          message: '上传图片大小不能超过16MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img,Orientation);
          _this.issueImageList.push(src);
          _this.storePhoto(_this.issueImageList)
        }
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    //拍照预览
    previewFileTwo() {
      let Orientation;
      let file = document.getElementById("demo2").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      if (!isLt2M) {
        _this.$dialog.alert({
          message: '上传图片大小不能超过16MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img,Orientation);
          _this.issueImageList.push(src);
          _this.storePhoto(_this.issueImageList)
        }
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    // 放大维修后图片点击事件
    enlargeCompleteImgEvent (item) {
      this.enlargeImgShow = true;
      this.enlargeImgUrl = item
    },

    // 拍照取消
    photoCancel () {
      this.photoBox = false;
      this.overlayShow = false
    },

    // 拍照问题照片点击
    issueClickEvent () {
      this.photoBox = true;
      this.overlayShow = true
    },

    // 问题照片删除
    issueDelete (index) {
      this.issueImageList.splice(index,1);
      this.storePhoto(this.issueImageList)
    },

    // 回显照片
    echoPhoto () {
      this.historyIssueImageList = [];
      this.issueImageList = [];
      if (this.isCompleteDispatchIssuePhotoList.length == 0) { return };
      let echoIndex = this.isCompleteDispatchIssuePhotoList.indexOf(this.isCompleteDispatchIssuePhotoList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (echoIndex === -1) { return };
      if (this.isCompleteDispatchIssuePhotoList[echoIndex]['issuePhototList']) {
        this.issueImageList = deepClone(this.isCompleteDispatchIssuePhotoList[echoIndex]['issuePhototList'])
      };
    },

    // 存储已经上传的照片
    storePhoto (photoId) {
      let temporaryPhotoList = [];
      temporaryPhotoList = deepClone(this.isCompleteDispatchIssuePhotoList);
      if (this.isCompleteDispatchIssuePhotoList.length > 0 ) {
        let temporaryIndex = this.isCompleteDispatchIssuePhotoList.indexOf(this.isCompleteDispatchIssuePhotoList.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex !== -1) {
          temporaryPhotoList[temporaryIndex]['issuePhototList'] = photoId;
        } else {
          temporaryPhotoList.push(
            {
              issuePhototList: photoId,
              taskId: this.taskId
            }
          )
        };
      } else {
        temporaryPhotoList.push(
          {
            issuePhototList: photoId,
            taskId: this.taskId
          }
        )
      };
      this.changeIsCompleteDispatchIssuePhotoList(temporaryPhotoList);
      setStore('completdispatchIssuePhotoInfo', {"photoInfo": temporaryPhotoList})
    },

    // 获取任务详情
    getTaskMessage () {
      this.overlayShow = true;
      this.loadingShow = true;
      getDispatchTaskMessageById(this.dispatchTaskId,this.dispatchTaskMessage.tempFlag)
      .then((res) => {
        this.overlayShow = false;
        this.loadingShow = false;
        if (res && res.data.code == 200) {
          this.showChildrenComponent = true;
          // 改变调度具体某一任务的信息状态
          this.changeDispatchTaskMessage({DtMsg: res.data.data});
          this.transportList = mergeMethods(this.dispatchTaskMessage['patientInfoList']);
          console.log('飒飒飒飒',res.data.data)
        }
      })
      .catch((err) => {
        this.overlayShow = false;
        this.loadingShow = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
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
        //右滑
        if (moveX > 0) {
          if (this.dispatchTaskMessage.state == 7 || this.dispatchTaskMessage.state == 6) {
            this.changeIsFreshDispatchTaskPage(false)
          } else {
            this.changeIsFreshDispatchTaskPage(true)
          }
        }
      }        
    },

    // 返回上一页
    backTo () {
      if (this.dispatchTaskMessage.state == 7 || this.dispatchTaskMessage.state == 6) {
        this.changeIsFreshDispatchTaskPage(false)
      } else {
        this.changeIsFreshDispatchTaskPage(true)
      };
      this.$router.push({path:'/dispatchTask'});
      this.changeTitleTxt({tit:'调度任务'});
      setStore('currentTitle','调度任务')
    },
    // 自主拍照
    takePhoto () {
      this.$router.push({path:'/dispatchTakePhoto'});
      this.changeTitleTxt({tit:'拍照'});
      setStore('currentTitle','拍照')
    },

    // 结束任务
    endTask () {
      if (this.templateType == 'template_one') {
        if (this.dispatchTaskMessage.distName.length == 0) {
          this.$toast('至少完成一个目的地时,才能结束任务');
          return
        };
      } else if (this.templateType == 'template_two') {
        if (this.dispatchTaskMessage.destinations.length > 0) {
          if (this.dispatchTaskMessage.distName.length < this.dispatchTaskMessage.destinations.length) {
            this.$toast('扫完规定的目的地时,才能结束任务');
            return
          }
        }  else {
          if (this.dispatchTaskMessage.distName.length == 0) {
            this.$toast('至少完成一个目的地时,才能结束任务');
            return
          }
        }
      };
      if (this.dispatchTaskMessage.state == 4) {
        this.$toast('请再次扫描出发地结束任务');
      } else {
        this.$dialog.alert({
          message: '确定结束任务?',
          showCancelButton: true
        })
        .then(() => {
          if (this.dispatchTaskMessage.state == 7 || this.dispatchTaskMessage.state == 6) {
            this.changeIsFreshDispatchTaskPage(false)
          } else {
            this.changeIsFreshDispatchTaskPage(true)
          };
          this.judgeIsGoDeparture()
        })
        .catch((err) => {
        })
      }
    },

    // 判断是否需要要回到出发地 0不回 1回
    judgeIsGoDeparture () {
      if (this.isBack == 1) {
        // 需要回到出发地时更新任务状态为4未结束
        this.updateTaskState({
          proId: this.proId, //当前项目ID
          id: this.dispatchTaskMessage.id, //当前任务ID
          tempFlag: this.dispatchTaskMessage.tempFlag,
          state: 4//更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
        })
      } else {
        this.updateTaskState({
          proId: this.proId, //当前项目ID
          id: this.dispatchTaskMessage.id, //当前任务ID
          tempFlag: this.dispatchTaskMessage.tempFlag,
          state: this.dispatchTaskState, //更新后的状态 {0: '未分配', 1: '未查阅', 2: '未开始', 3: '进行中', 4: '未结束', 5: '已延迟', 6: '已取消', 7: '已完成'
          endType: 1, //1-安卓APP，2-微信小程序
          endUser: this.userInfo.name //结束用户名
        })
      }
    },

    // 更新任务状态
    updateTaskState (data) {
      updateDispatchTask(data).then((res) => {
        if (res && res.data.code == 200) {
          // 为单一类型目的地或第二次扫出发地时结束该任务
          if ((this.dispatchTaskDepartmentType == 1 && this.isSingleDestination && this.dispatchTaskState != 4) || (this.dispatchTaskState == 7)) {
            this.$toast('该条任务已完成');
            // 清空该完成任务存储的已扫过非单一目的地科室信息
            let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCodeDestinationList);
            temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
            this.changeIsCompleteSweepCodeDestinationList(temporarySweepCodeOficeList);
            setStore('completeDispatchSweepCodeDestinationInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});

            // 清空该完成任务存储的已校验通过的当前科室编号
            let temporaryCurrentDepartmentNumber = deepClone(this.currentDepartmentNumber);
            temporaryCurrentDepartmentNumber = temporaryCurrentDepartmentNumber.filter((item) => { return item.taskId != this.taskId});
            this.changeCurrentDepartmentNumber(temporaryCurrentDepartmentNumber);
            setStore('completDepartmentNumber', {"number": temporaryCurrentDepartmentNumber})
          };
          // 清空完成该任务存储的已扫过出发地和单一目的地科室信息
          let temporarySweepCodeOficeList = deepClone(this.isCompleteSweepCode);
          temporarySweepCodeOficeList = temporarySweepCodeOficeList.filter((item) => { return item.taskId != this.taskId});
          this.changeisCompleteSweepCode(temporarySweepCodeOficeList);
          setStore('completeDispatchSweepCodeInfo', {"sweepCodeInfo": temporarySweepCodeOficeList});
          this.$router.push({path:'/dispatchTask'});
          this.changeTitleTxt({tit:'调度任务'});
          setStore('currentTitle','调度任务')
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

    // 根据科室id获取科室名称
    getDepartmentName () {
      let temporarySweepCodeDestinationList = [];
      let temporarySweepCodeOficeList = [];
      let echoIndex = this.isCompleteSweepCodeDestinationList.indexOf(this.isCompleteSweepCodeDestinationList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (echoIndex == -1) {return};
      temporarySweepCodeOficeList = this.isCompleteSweepCodeDestinationList.filter((item) => { return item.taskId == this.taskId})[0]['officeList'];
      for (let item of temporarySweepCodeOficeList) {
        temporarySweepCodeDestinationList.push(Dictionary(this.departmentInfoListNo,item.toString()))
      };
      this.trackList = temporarySweepCodeDestinationList;
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
    // 性别转换
    genderTransfer (index) {
      switch(index) {
        case 1 :
          return '男'
          break;
        case 2 :
          return '女'
          break;
        default:
          return '未输入'
      }
    },

    // 取件
    fetchPiece () {
      if (this.dispatchTaskMessage.state == 3 || this.dispatchTaskMessage.state == 4) {
        this.$toast('取件已完成，请点击送件')
      } else {
        this.joinSweepCode()
      }
    },

    // 送件
    sendPiece () {
      if (this.dispatchTaskMessage.state == 2) {
        this.$toast('请先完成出发地取件');
      } else {
        this.joinSweepCode()
      }
    },

    // 进入扫码页
    joinSweepCode () {
      if (this.dispatchTaskMessage.state == 7) {
        this.$dialog.alert({
          message: '该条调度任务已完成,不能进行扫码',
          closeOnPopstate: true
        }).then(() => {
        })
      } else {
      if (this.dispatchTaskMessage.state == 2) {
          // 判断出发地是否强制拍照
          this.changeIsCoerceTakePhoto(this.dispatchTaskMessage.startPhoto);
          this.changeDispatchTaskDepartmentType(0);
          this.changeDispatchTaskState(3)
        } else if (this.dispatchTaskMessage.state == 3) {
          // 判断目的地是否强制拍照
          this.changeIsCoerceTakePhoto(this.dispatchTaskMessage.endPhoto);
          this.changeDispatchTaskDepartmentType(1);
          // 判断是否回到出发地0不回1回
          if (this.dispatchTaskMessage.isBack == 0) {
            this.changeDispatchTaskState(7)
          } else {
            this.changeDispatchTaskState(4)
          }
        } else if (this.dispatchTaskMessage.state == 4) {
          this.changeIsCoerceTakePhoto(this.dispatchTaskMessage.startPhoto);
          this.changeDispatchTaskDepartmentType(0);
          this.changeDispatchTaskState(7)
        };
        this.$router.push({'path':'/dispatchTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码')
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
    /deep/ .van-loading {
      z-index: 200000
    };
    .content-wrapper();
      font-size: 16px;
      background: #f6f6f6;
    .right-text {
      position: absolute;
      top: 10px;
      right: 9px;
      font-size: 16px;
      color: #4788fe;
      width: 80px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: #fff;
      border-radius: 4px;
      display: inline-block
    };
    .content {
      flex: 1;
      width: 100%;
      overflow: auto;
    };
    .basic-message {
      width: 93%;
      margin: 0 auto;
      margin-top: 14px;
      position: relative;
      background: #fff;
      padding: 10px;
      box-sizing: border-box;
      .basic-mesage-state {
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
      };
      .basic-message-title {
        font-size: 18px;
        color: #1a89fd;
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          height: 15px;
          width: 15px;
          vertical-align: top;
          margin-top: 1px;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
      .wait-handle-message {
        width: 100%;
        margin-top: 5px;
        .wait-handle-message-middle {
          margin: 10px 0
        };
        .wait-handle-message-bottom {
          margin-top: 10px
        };
        .handle-message-line-wrapper {
          p {
            display: flex;
            overflow: auto;
            height: 30px;
            line-height: 30px;
            flex-flow: row nowrap;
            color: #a0a0a0;
            .spanStyle {
              color: #E8CB51 !important;
              font-weight: bold
            };
            .priorityOneStyle {
              color: #b1d676 !important
            };
            .priorityTwoStyle {
              color: red !important;
              font-weight: bold
            };
            span {
              display: inline-block;
            };
            span:first-child {
              width: 25%
            };
            .message-tit-real-style {
              color: #2895ea;
            }
            span:last-child {
              flex: 1;
              color: black
            }
          };
          .describe-line-wrapper {
            width: 100%;
            .message-tit-real-audio {
              margin-left: 4px
            }
          }
        };
         .message-name {
          p {
            display: flex;
            >span {
              &:nth-child(2) {
                padding: 0 5px 0 0;
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
          }
        };
        .transport-type-wrapper {
          display: flex;
          flex-flow: row nowrap;
          .transport-type-title {
            color: #a0a0a0;
            width: 25%
          };
          .transport-type-content {
            color: black;
            flex: 1;
            > div:not(:first-child) {
              .transport-type-list-title {
                margin-top: 6px
              }
            };
            .transport-type-list-wrapper {
              .transport-type-list {
                > p {
                };
                .transport-type-list-title {
                  font-weight: bold;
                  color: black
                };
                .transport-type-list-content {
                  line-height: 30px;
                  img {
                    width: 24px;
                    height: 24px;
                    vertical-align: middle;
                    margin-left: 2px
                  };
                  .spanStyle {
                    color: #E8CB51 !important;
                    font-weight: bold
                  }
                }
              }
            }
          }
        };
        .handle-message-line-wrapper-other {
          p {
            width: 100%;
          }
        };
        .handle-message-line-wrapper-other-two {
          display: flex;
          flex-flow: row now;
          line-height: 35px;
          >p:first-child {
            width: 25%;
            span {
              color: #a0a0a0;
            }
          };
          > p:last-child {
            flex: 1;
            span {
              color: black
            };
            .message-tit-real-destinationList {
              margin-right: 4px
            }
          }
        }
      }
    }
    .content-middle {
      height: 120px;
      margin: 0 auto;
      width: 100%;
      font-size: 14px;
      background: #f7f7f7;
      position: relative;
      .photo-list {
        position: absolute;
        left: 70px;
        width: 250px;
        top: 10px;
        height: 100px;
        overflow: auto;
        li {
          width: 80px;
          height: 80px;
          float: left;
          margin-right: 4px;
          position: relative;
          margin-bottom: 4px;
          /deep/ .van-icon-cross {
            position: absolute;
            top: 0;
            right:0;
            color: @color-theme;
            font-size: 20px;
          };
          img {
            width: 100%;
            height: 100%
          };
          &:nth-of-type(3n+0)
          {
            margin-right: 0
          }
        }
      };
      .issue-photo {
        position: relative;
        margin-top: 15px;
        height: 100px;
        background: #fff;
        line-height: 100px;
        box-sizing: border-box;
        > span {
          position: absolute;
          display: inline-block;
          &:first-child {
            left: 0;
            top: 0;
            color: #bbbaba;
            padding-left: 10px;
          };
          &:last-child {
            color: @color-theme;
            font-size: 34px;
            font-weight: bold;
            right: 10px;
            top: 4px
          }
        }
      }
    };
    .office-list {
      display: flex;
      flex-flow: column nowrap;
      width: 93%;
      margin: 0 auto;
      margin-top: 8px;
      height: auto;
      background: #fff;
      padding: 10px;
      position: relative;
      box-sizing: border-box;
      .basic-message-title {
        font-size: 18px;
        color: #1a89fd;
        height: 40px;
        line-height: 40px;
        span {
          display: inline-block;
          height: 15px;
          width: 15px;
          vertical-align: top;
          margin-top: 1px;
          img {
            width: 100%;
            height: 100%
          }
        }
      }
      .office-list-inner-wrapper {
        box-sizing: border-box;
        width: 100%;
        flex: 1;
        .track-name {
          height: 100%;
          display: flex;
          flex-flow: column;
          .track-name-top {
            height: 35px;
            line-height: 35px;
            span {
              color: black;
              &:last-child {
                color: #a0a0a0;
              }
            }
          };
          .track-name-bottom {
            flex: 1;
            overflow: auto;
            > p {
              display: inline-block;
              margin-right: 8px;
              line-height: 25px;
              height: 25px;
              span {
                display: inline-block;
                color: black;
                &:nth-child(2) {
                  color: #a0a0a0;
                  margin: 0 8px
                };
                &:nth-child(3) {
                  width: 22px;
                  height: 22px;
                  vertical-align: middle;
                  img {
                    width: 100%;
                    height: 100%
                  }
                }
              }
            }
          }
        }
      }
    }
    .circultion-task-btn {
      width: 95%;
      margin: 0 auto;
      padding: 10px;
      height: auto;
      span {
        vertical-align: top;
        display: inline-block;
        line-height: 40px;
        height: 40px;
        background: #2895ea;
        color: #fff;
        text-align: center
      }
      .circultion-task-btn-top {
        position: relative;
        height: 40px;
        span {
          width: 47%;
          border-radius: 4px;
          &:first-child {
            position: absolute;
            top: 0;
            left: 0
          }
          &:last-child {
            position: absolute;
            background: #fff;
            color: #1b88ff;
            border: 1px solid #1b88ff;
            top: 0;
            right: 0
          }
        }
      };
       .circultion-task-btn-bottom {
        position: relative;
        height: 40px;
        margin-top: 10px;
        span {
          background: #fff;
          color: #1b88ff;
          border: 1px solid #1b88ff;
          width: 100%;
          border-radius: 4px
        }
      }
    };
    .choose-photo-box {
      position: fixed;
      margin: auto;
      left: 0;
      bottom: 0;
      width: 100%;
      z-index: 1000;
      font-size: 0;
      > div {
        width: 100%;
        text-align: center;
        font-size: 16px;
        background: #f6f6f6
      }
      .choose-photo {
        padding: 8px 10px;
        height: 30px;
        .bottom-border-1px(#cbcbcb);
        line-height: 30px;
        position: relative;
        cursor: pointer;
        color: @color-theme;
        overflow: hidden;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        /deep/ .van-icon {
          vertical-align: top;
          font-size: 20px;
          display: inline-block;
          line-height: 30px
        };
        input {
          position: absolute;
          font-size: 100px;
          right: 0;
          top: 0;
          height: 100%;
          opacity: 0;
          filter: alpha(opacity=0);
          cursor: pointer
        }
      };
      .photo-graph {
        position: relative;
        display: inline-block;
        height: 50px;
        overflow: hidden;
        .bottom-border-1px(#cbcbcb);
        color: @color-theme;
        text-decoration: none;
        text-indent: 0;
        line-height: 50px;
        /deep/ .van-icon {
          vertical-align: top;
          font-size: 20px;
          display: inline-block;
          line-height: 50px
        };
        input {
          position: absolute;
          font-size: 100px;
          right: 0;
          height: 100%;
          top: 0;
          opacity: 0;
        }
      };
      .photo-cancel {
        position: relative;
        display: inline-block;
        padding: 8px 12px;
        overflow: hidden;
        color: @color-theme;
        text-decoration: none;
        text-indent: 0;
        line-height: 30px;
        font-weight: bold
      }
    }
  }
</style>
