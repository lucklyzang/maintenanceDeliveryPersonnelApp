<template>
  <div class="page-box" ref="wrapper">
    <!-- 发现时间 -->
    <div class="find-time-box">
      <van-popup v-model="showFindTime" position="bottom">
        <van-datetime-picker
          v-model="currentFindTime"
          type="datetime"
          :min-date="minDate"
          :max-date="maxDate"
        >
          <template #default>
            <h3>发现时间</h3>
            <van-icon name="cross" size="25" @click="showFindTime = false" />
          </template>
          <template #columns-bottom>
            <div class="button-box">
              <span @click="showFindTime = false">取消</span>
              <span @click="onConDayFirm">确认</span>
            </div>
          </template>
        </van-datetime-picker>
      </van-popup>
    </div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <!-- accept="image/album" -->
          <input name="uploadImg1" ref="inputFile" id="demo1" @change="previewFileOne" type="file" accept="image/*" />从图库中选择
        </div>
        <div class="photo-graph">
          <!-- accept="image/camera" -->
          <van-icon name="photograph" />
          <input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" capture="camera" accept="image/*,.camera" />拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="videoBox">
        <div class="choose-photo">
          <!-- accept="video/mp4" -->
          <van-icon name="photo" />
          <input name="uploadImg3" ref="inputFileThree" id="demo3" @change="previewFileThree" type="file" accept="video/*" />从图库中选择
        </div>
        <div class="photo-graph">
          <!-- accept="video/mp4" -->
          <van-icon name="photograph" />
          <input name="uploadImg4" ref="inputFileFour" id="demo4"  @change="previewFileFour" type="file" accept="video/*,.camera"  capture="camcorder" />拍摄
        </div>
        <div class="photo-cancel" @click="videoCancel">取消</div>
      </div>
    </transition>
    <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog>
    <van-dialog v-model="deleteVideoInfoDialogShow" title="确定删除此视频?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteVideoEvent"
      >
    </van-dialog>
    <!-- 退出提示框   -->
    <div class="quit-info-box">
       <van-dialog v-model="quitInfoShow"  show-cancel-button width="85%"
          @confirm="quitSure" @cancel="quitCancel" confirm-button-text="是"
          cancel-button-text="否"
        >
          <div class="delete-icon">
            <van-icon name="cross" size="24" @click="quitInfoShow = false" />
          </div>
          <div class="dialog-title">
            退出前是否保存?
          </div>
          <div class="dialog-center">
            保存的记录可再次点击×进行查看
          </div>
      </van-dialog>
    </div>
    <div class="img-dislog-box">
        <van-dialog v-model="imgBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
            <img :src="currentImgUrl" />
        </van-dialog> 
    </div>
    
    <div class="img-dislog-box">
        <van-dialog v-model="videoBoxShow" width="98%" :close-on-click-overlay="true" confirm-button-text="关闭">
          <video controls
            width="100%"
            :src="currentVideoUrl"
            poster="">
          </video>
        </van-dialog> 
    </div>    
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{loadingText}}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 异常类型 -->
    <div class="transport-rice-box" v-if="showAbnormalType">
      <ScrollSelection :columns="abnormalTypeOption" title="异常类型" @sure="abnormalTypeSureEvent" @cancel="abnormalTypeCancelEvent" @close="abnormalTypeCloseEvent" />
    </div>
    <!-- 严重程度 -->
    <div class="transport-rice-box" v-if="showSeverityLevel">
      <ScrollSelection :columns="severityLevelOption" title="严重程度" @sure="severityLevelSureEvent" @cancel="severityLevelCancelEvent" @close="severityLevelCloseEvent" />
    </div>
    <!-- 设备状态 -->
    <div class="transport-rice-box" v-if="showEquipmentStatus">
      <ScrollSelection :columns="equipmentStatusOption" title="设备状态" @sure="equipmentStatusSureEvent" @cancel="equipmentStatusCancelEvent" @close="equipmentStatusCloseEvent" />
    </div>
    <div class="nav">
       <van-nav-bar
        title="异常记录"
        left-text="返回"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
    </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
		</div>
      <div class="content-box">
        <div class="message-box">
         <!-- <div class="select-box event-type">
            <div class="select-box-left">
              <span>*</span>
              <span>编号</span>
            </div>
            <div class="select-box-right event-type-right">
              <span>{{ patrolTaskAbnormalCheckItemEventList.taskNumber }}</span>
            </div>
        </div> -->
        <div class="select-box event-type">
          <div class="select-box-left">
            <span>*</span>
            <span>检查项类型</span>
          </div>
          <div class="select-box-right">
            <span>{{ patrolTaskAbnormalCheckItemEventList.typeName }}</span>
          </div>
        </div>
        <div class="select-box event-type">
          <div class="select-box-left">
            <span>*</span>
            <span>检查项</span>
          </div>
          <div class="select-box-right">
            <span>{{ patrolTaskAbnormalCheckItemEventList.itemName }}</span>
          </div>
        </div>
        <div class="select-box end-select-box">
          <div class="select-box-left">
            <span>*</span>
            <span>记录时间</span>
          </div>
          <div class="select-box-right" @click="showFindTime = true">
            <span>{{ getNowFormatDate(currentFindTime) }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>*</span>
            <span>异常类型</span>
          </div>
          <div class="select-box-right" @click="abnormalTypeClickEvent">
            <span>{{ currentAbnormalType  }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>*</span>
            <span>严重程度</span>
          </div>
          <div class="select-box-right" @click="severityLevelClickEvent">
            <span>{{ currentSeverityLevel  }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="select-box end-select-box end-select-box-room">
          <div class="select-box-left">
            <span>*</span>
            <span>设备状态</span>
          </div>
          <div class="select-box-right" @click="equipmentStatusClickEvent">
            <span>{{ currentEquipmentStatus }}</span>
            <van-icon name="arrow" color="#989999" size="20" />
          </div>
        </div>
        <div class="transport-type problem-overview">
            <div class="transport-type-left">
              <span>异常情况说明</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="problemOverview"
                rows="2"
                maxlength="500"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </div>
          </div>
          <div class="result-picture">
            <div class="title-picture">图片</div>
            <div class="image-list">
                <div v-for="(item, index) in problemPicturesList" :key='index'>
                    <img :src="item" @click="enlareEvent(item)" />
                    <div class="icon-box" @click="issueDelete(index,item)">
                        <van-icon
                        name="delete"
                        color="#d70000"
                        />
                    </div>
                </div>
                <div @click="issueClickEvent">
                    <van-icon name="plus" size="30" color="#101010" />
                </div>
            </div>
         </div>
         <div class="result-picture">
            <div class="title-picture">视频</div>
            <div class="image-list">
                <div v-for="(item, index) in problemVideosList" :key='index' @click="enlareVideoEvent(item)">
                  <video
                    width="100%"
                    height="70px"
                    :src="item"
                    poster="">
                  </video>
                  <div class="icon-box" @click.stop="issueVideoDelete(index,item)">
                      <van-icon
                      name="delete"
                      color="#d70000"
                      />
                  </div>
                </div>
                <div @click="issueVideoClickEvent">
                    <van-icon name="plus" size="30" color="#101010" />
                </div>
            </div>
         </div>
          <div class="transport-type">
            <div class="transport-type-left">
              <span>意见或建议</span>
            </div>
            <div class="transport-type-right">
              <van-field
                v-model="taskDescribe"
                rows="2"
                maxlength="500"
                show-word-limit
                type="textarea"
                placeholder="请输入"
              />
            </div>
          </div>
        </div>
        <div class="btn-box">
          <span class="operate-one" @click="quitEvent">退出</span>
          <span class="operate-two" @click="temporaryStorageEvent">保存</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import {getAliyunSign} from '@/api/equipmentPatrol/login.js'
import { saveDeviceAbnormalRecord } from '@/api/equipmentPatrol/escortManagement.js'
import { compress, base64ImgtoFile } from '@/common/js/utils'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'
import ScrollSelection from "@/components/ScrollSelection";
import BottomSelect from "@/components/BottomSelect";
export default {
  name: "PatrolAbnormalRecord",
  components: {
    ScrollSelection,
    BottomSelect
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      msg: null,
      isExpire: false,
      quitInfoShow: false,
      showFindTime: false,
      problemPicturesList: [],
      problemVideosList: [],
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentFindTime: new Date(),
      currentImgUrl: '',
      currentVideoUrl: '',
      photoBox: false,
      videoBox: false,
      imgBoxShow: false,
      videoBoxShow: false,
      imgIndex: '',
      videoIndex: '',
      checkResultId: '',
      imgOnlinePathArr: [],
      imgDeleteUrlArr: [],
      existOnlineImgPath: [],
      imgDeleteUrl: '',
      videoDeleteUrl: '',
      deleteInfoDialogShow: false,
      deleteVideoInfoDialogShow: false,
      loadingText: '加载中...',
      problemOverview: '',
      taskDescribe: '',
      transportNumberValue: '',
      abnormalTypeOption: [
        {
          id: 0,
          value: 3,
          text: '其他'
        },
        {
          id: 1,
          value: 4,
          text: '设备损坏'
        },
        {
          id: 2,
          value: 5,
          text: '隐患排查'
        }
      ],
      showAbnormalType: false,
      currentAbnormalType: '设备损坏',

      severityLevelOption: [
        {
          id: 0,
          text: '普通'
        },
        {
          id: 1,
          text: '严重'
        },
      ],
      showSeverityLevel: false,
      currentSeverityLevel: '普通',

      equipmentStatusOption: [
        {
          id: 0,
          text: '正常使用'
        },
        {
          id: 1,
          text: '停机待修'
        },
        {
          id: 2,
          text: '停用'
        },
        {
          id: 3,
          text: '报废'
        }
      ],
      showEquipmentStatus: false,
      currentEquipmentStatus: '停机待修',

      overlayShow: false,
      statusBackgroundPng: require("@/common/images/home/status-background.png")
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        that.$router.push({path: `${this.enterPatrolAbnormalRecordPageSource}`})
      })
    };
    let casuallyTemporaryStoragePatrolTaskAbnormalRecordList = this.patrolTaskAbnormalRecordList;
    let temporaryIndex = casuallyTemporaryStoragePatrolTaskAbnormalRecordList.findIndex((item) => { return item.storeId == this.$route.query.eventId &&
    item.showDate ==  this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
    item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == this.patrolTaskAbnormalCheckItemEventList.typeId && 
    item.extendData.checkItemId == this.patrolTaskAbnormalCheckItemEventList.itemId && item.checkResultId == this.patrolTaskAbnormalCheckItemEventList.resultId
    });
    if (temporaryIndex != -1) {
      this.echoTemporaryStorageMessage(temporaryIndex)
    }
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
	  });
    next() 
  },

  watch: {
  },

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","ossMessage","timeMessage","patrolTaskAbnormalRecordList","enterPatrolAbnormalRecordPageSource","patrolTaskAbnormalCheckItemEventList","patrolTaskDeviceChecklist","patrolTaskListMessage","devicePatrolDetailsSelectMessage"]),
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
    ...mapMutations(["changeOverDueWay","changeTimeMessage","changeOssMessage","changePatrolTaskAbnormalRecordList"]),

    onClickLeft() {
      this.$router.push({path: `${this.enterPatrolAbnormalRecordPageSource}`})
    },

    // 任务开始事件弹框确认事件
     onConDayFirm() {
      this.showFindTime = false
    },

    // 图片放大事件
    enlareEvent (item) {
      this.currentImgUrl = item;
      this.imgBoxShow = true
    },

    // 视频放大播放事件
    enlareVideoEvent (item) {
      this.currentVideoUrl = item;
      this.videoBoxShow = true
    },

    // 拍照点击
    issueClickEvent () {
      if (this.problemPicturesList.length + this.problemVideosList.length >= 9) {
        this.$toast('至多总共只能上传9张图片或视频!');
        return
      };
      this.photoBox = true;
      this.overlayShow = true
    },

    // 拍摄点击
    issueVideoClickEvent () {
      if (this.problemPicturesList.length + this.problemVideosList.length >= 9) {
        this.$toast('至多总共只能上传9张图片或视频!');
        return
      };
      this.videoBox = true;
      this.overlayShow = true
    },

    // 确定删除图片提示框确定事件
    sureDeleteEvent () {
      this.imgDeleteUrlArr.push(this.imgDeleteUrl);
      this.problemPicturesList.splice(this.imgIndex, 1);
      for (let item of this.imgDeleteUrlArr) {
        let temporaryIndex = this.existOnlineImgPath.indexOf(item);
        if (temporaryIndex > -1) {
          this.existOnlineImgPath.splice(this.existOnlineImgPath.indexOf(item),1)
        }
      }
    },

    // 确定删除视频提示框事件
    sureDeleteVideoEvent () {
      this.problemVideosList.splice(this.videoIndex, 1)
    },

    // 拍照照片删除
    issueDelete (index,item) {
      this.deleteInfoDialogShow = true;
      this.imgIndex = index;
      this.imgDeleteUrl = item
    },

    // 视频删除
    issueVideoDelete (index,item) {
      this.deleteVideoInfoDialogShow = true;
      this.videoIndex = index;
      this.videoDeleteUrl = item
    },

    // 回显暂存的信息
    echoTemporaryStorageMessage (temporaryIndex) {
      let casuallyTemporaryStoragePatrolTaskAbnormalRecordList = this.patrolTaskAbnormalRecordList;
      this.currentAbnormalType = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['eventType'] === '' ? '请选择' : this.abnormalTypeOption.filter((item) => { return item.value == casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['eventType']})[0]['text'];
      this.currentSeverityLevel = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['registerSeverity'] === '' ? '请选择' : this.severityLevelOption.filter((item) => { return item.id == casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['registerSeverity']})[0]['text'];
      this.currentEquipmentStatus = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['registerState'] === '' ? '请选择' : this.equipmentStatusOption.filter((item) => { return item.id == casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['registerState']})[0]['text'];
      this.problemOverview = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['description'];
      this.currentFindTime = new Date(casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['findTime']);
      this.taskDescribe = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['remark'];
      this.problemPicturesList = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['images'];
      this.problemVideosList = casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['videos']
    },

    // 处理维修任务参与者
    disposeTaskPresent (item) {
      if (item.length == 0) { return '请选择'};
      let temporaryArray = [];
      for (let innerItem of item) {
        temporaryArray.push(innerItem.text)
      };
      return temporaryArray.join('、')
    },

    // 获取阿里云签名接口
    getSign (filePath = '') {
      return new Promise((resolve, reject) => {
        getAliyunSign().then((res) => {
          if (res && res.data.code == 200) {
            // 存储签名信息
            this.changeOssMessage(res.data.data);
            let temporaryTimeInfo = {};
            temporaryTimeInfo['expire'] = Number(res.data.data.expire);
            // 存储过期时间信息
            this.changeTimeMessage(temporaryTimeInfo);
            if (this.isExpire) {
              this.uploadImageToOss(filePath)
            };
            this.isExpire = false;
            resolve()
          } else {
            this.overlayShow = false;
            this.loadingShow = false;
            this.$toast({
              message: `${res.data.msg}`,
              type: 'fail'
            });
            reject()
          }
        })
        .catch((err) => {
          this.overlayShow = false;
          this.loadingShow = false;
          this.$toast({
            message: `${err}`,
            type: 'fail'
          });
          reject()
        })
      })	
    },
    
    // 上传图片到阿里云服务器
    uploadImageToOss (filePath) {
      return new Promise((resolve, reject) => {
        // OSS地址
        const aliyunServerURL = this.ossMessage.host;
        // 存储路径(后台固定位置+随即数+文件格式)
        const aliyunFileKey = this.ossMessage.dir + new Date().getTime() + Math.floor(Math.random() * 100) + base64ImgtoFile(filePath).name;
        // 临时AccessKeyID0
        const OSSAccessKeyId = this.ossMessage.accessid;
        // 加密策略
        const policy = this.ossMessage.policy;
        // 签名
        const signature = this.ossMessage.signature;
        let formData = new FormData();
        formData.append('key',aliyunFileKey);
        formData.append('policy',policy);
        formData.append('OSSAccessKeyId',OSSAccessKeyId);
        formData.append('success_action_status','200');
        formData.append('Signature',signature);
        formData.append('file',base64ImgtoFile(filePath));
        axios({
          url: aliyunServerURL,
          method: 'post',
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'}
        }).then((res) => {
          this.imgOnlinePathArr.push(`${aliyunServerURL}/${aliyunFileKey}`);
          resolve()
        })
        .catch((err) => {
          this.overlayShow = false;
          this.loadingShow = false;
          this.loadingText = '';
          this.$toast({
            message: `${err}`,
            type: 'fail'
          });
          reject()
        })
      })
    },


    // 图片上传预览
    previewFileOne() {
      let file = document.getElementById("demo1").files[0];
      this.temporaryFile = file;
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 5;
      if (!isLt2M) {
        this.$dialog.alert({
          message: '上传图片大小不能超过5MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        _this.$refs.inputFile.value = null;
        _this.photoBox = false;
        _this.overlayShow = false;
        return
      };  
      reader.addEventListener("load", function () {
        // 压缩图片
        let result = reader.result;
        let img = new Image();
        img.src = result;
        img.onload = function () {
          let src = compress(img);
          _this.problemPicturesList.push(src);
          _this.photoBox = false;
          _this.overlayShow = false
        };
        _this.$refs.inputFile.value = null;
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    //拍照预览
    previewFileTwo() {
      let file = document.getElementById("demo2").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 5;
      if (!isLt2M) {
        _this.$dialog.alert({
          message: '上传图片大小不能超过5MB!',
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
          let src = compress(img);
          _this.problemPicturesList.push(src);
          _this.photoBox = false;
          _this.overlayShow = false
        }
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      };
    },

    // 视频上传预览
    previewFileThree () {
      let file = document.getElementById("demo3").files[0];
      this.temporaryFile = file;
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      if (!isLt2M) {
        this.$dialog.alert({
          message: '上传视频大小不能超过16MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };  
      reader.addEventListener("load", function () {
        _this.videoBox = false;
        _this.overlayShow = false;
        let result = reader.result;
        _this.problemVideosList.push(result);
        _this.$refs.inputFileThree.value = null;
        console.log('资源3',result)
      }, false);
      if (file) {
        reader.readAsDataURL(file);
      }
    },

    // 视频拍摄预览
    async previewFileFour () {
      let file = document.getElementById("demo4").files[0];
      this.temporaryFile = file;
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size/1024/1024 < 16;
      if (!isLt2M) {
        this.$dialog.alert({
          message: '上传视频大小不能超过16MB!',
          closeOnPopstate: true
        }).then(() => {
        });
        return
      };
      reader.addEventListener("load", function () {
        _this.videoBox = false;
        _this.overlayShow = false;
        let result = reader.result;
        _this.problemVideosList.push(result);
        _this.$refs.inputFileFour.value = null;
        console.log('资源4',result);
      }, false)
      if (file) {
        reader.readAsDataURL(file);
      }
    },


    // 拍照取消
    photoCancel () {
      this.photoBox = false;
      this.overlayShow = false
    },

    // 拍摄视频取消
    videoCancel () {
      this.videoBox = false;
      this.overlayShow = false
    },

    // 格式化时间
    getNowFormatDate(currentDate) {
      let currentdate;
      let strDate = currentDate.getDate();
      let seperator1 = "-";
      let seperator2 = ":";
      let month = currentDate.getMonth() + 1;
      let hour = currentDate.getHours();
      let minutes = currentDate.getMinutes();
      if (month >= 1 && month <= 9) {
        month = "0" + month;
      };
      if (hour >= 0 && hour <= 9) {
        hour = "0" + hour;
      };
      if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
      };
      if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
      };
      currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hour + seperator2 + minutes
      return currentdate
    },

    // 异常类型列点击事件
    abnormalTypeClickEvent () {
      this.showAbnormalType = true
    },

    // 异常类型下拉选择框确认事件
    abnormalTypeSureEvent (val) {
      if (val.length > 0) {
        this.currentAbnormalType = val
      } else {
        this.currentAbnormalType = '请选择'
      };
      this.showAbnormalType = false
    },

    // 异常类型下拉选择框取消事件
    abnormalTypeCancelEvent () {
      this.showAbnormalType = false
    },

    // 异常类型下拉选择框关闭事件
    abnormalTypeCloseEvent () {
      this.showAbnormalType = false
    },

    // 严重程度列点击事件
    severityLevelClickEvent () {
      this.showSeverityLevel = true
    },

    // 严重程度下拉选择框确认事件
    severityLevelSureEvent (val) {
      if (val.length > 0) {
        this.currentSeverityLevel = val
      } else {
        this.currentSeverityLevel = '请选择'
      };
      this.showSeverityLevel = false
    },

    // 严重程度下拉选择框取消事件
    severityLevelCancelEvent () {
      this.showSeverityLevel = false
    },

    // 严重程度下拉选择框关闭事件
    severityLevelCloseEvent () {
      this.showSeverityLevel = false
    },

    // 设备状态列点击事件
    equipmentStatusClickEvent () {
      this.showEquipmentStatus = true
    },

    // 设备状态下拉选择框确认事件
    equipmentStatusSureEvent (val) {
      if (val.length > 0) {
        this.currentEquipmentStatus = val
      } else {
        this.currentEquipmentStatus = '请选择'
      };
      this.showEquipmentStatus = false
    },

    // 设备状态下拉选择框取消事件
    equipmentStatusCancelEvent () {
      this.showEquipmentStatus = false
    },

    // 设备状态下拉选择框关闭事件
    equipmentStatusCloseEvent () {
      this.showEquipmentStatus = false
    },

    // 退出事件
    quitEvent () {
      this.quitInfoShow = true
    },

    // 异常记录提交事件
    async abnormalRecordEvent () {
      if (this.currentAbnormalType == '请选择') {
        this.$toast('异常类型不能为空');
        return
      };
      if (this.currentSeverityLevel == '请选择') {
        this.$toast('严重程度不能为空');
        return
      };
      if (this.currentEquipmentStatus == '请选择') {
        this.$toast('设备状态不能为空');
        return
      };
      if (!this.currentFindTime) {
        this.$toast('记录时间不能为空');
        return
      };
      // 上传图片到阿里云服务器
      let temporaryProblemPicturesList = this.problemPicturesList.filter((item) => { return item.indexOf('https://') == -1});
      this.loadingText ='图片上传中...';
      this.overlayShow = true;
      this.loadingShow = true;
      for (let imgI of temporaryProblemPicturesList) {
          if (Object.keys(this.timeMessage).length > 0) {
          // 判断签名信息是否过期
          if (new Date().getTime()/1000 - this.timeMessage['expire']  >= -30) {
              await this.getSign();
              await this.uploadImageToOss(imgI)
          } else {
              await this.uploadImageToOss(imgI)
          }
          } else {
          await this.getSign();
          await this.uploadImageToOss(imgI)
          }
      };
      // 新增设备巡检项异常记录
      let temporaryMessage = {
        eventType: this.abnormalTypeOption.filter((item) => { return item.text == this.currentAbnormalType })[0]['value'],
        registerSeverity: this.severityLevelOption.filter((item) => { return item.text == this.currentSeverityLevel })[0]['id'],
        registerState: this.equipmentStatusOption.filter((item) => { return item.text == this.currentEquipmentStatus })[0]['id'],
        checkResultId: this.patrolTaskAbnormalCheckItemEventList.resultId,
        depId: this.patrolTaskDeviceChecklist.deviceId,
        depName: this.patrolTaskDeviceChecklist.deviceName,
        findTime: this.getNowFormatDate(this.currentFindTime),
        description: this.problemOverview,
        remark: this.taskDescribe,
        extendData: {
          colName: this.patrolTaskDeviceChecklist.configName,
          deviceId: this.patrolTaskDeviceChecklist.deviceId,
          deviceName: this.patrolTaskDeviceChecklist.deviceName,
          checkItemId: this.patrolTaskAbnormalCheckItemEventList.itemId,
          checkTypeId: this.patrolTaskAbnormalCheckItemEventList.typeId,
          deviceNorms: this.patrolTaskDeviceChecklist.norms,
          checkItemName: this.patrolTaskAbnormalCheckItemEventList.itemName,
          checkTypeName: this.patrolTaskAbnormalCheckItemEventList.typeName
        },
        images: this.imgOnlinePathArr.concat(this.problemPicturesList.filter((item) => { return item.indexOf('https://') != -1})),
        collect: this.devicePatrolDetailsSelectMessage.selectTaskSetId,
        proId: this.proId,
        system: 9,
        createName: this.userName,
        taskNumber: this.patrolTaskAbnormalCheckItemEventList.taskNumber
      };
      this.postGenerateRepairsTask(temporaryMessage)
    },

    // 新增设备巡检项异常记录
    postGenerateRepairsTask (data) {
      this.loadingText = '登记中...';
      this.loadingShow = true;
      this.overlayShow = true;
      saveDeviceAbnormalRecord(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$Alert({message:"新增成功",duration:3000,type:'success'});
        } else {
          // 防止任务生成失败后，再次生成时造成同一图片重复上传
          this.imgOnlinePathArr = [];
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
        };
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false
      })
      .catch((err) => {
        this.imgOnlinePathArr = [];
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
        this.loadingText = '';
        this.loadingShow = false;
        this.overlayShow = false
      })
    },

    // 确定退出(暂存)
    quitSure () {
      this.temporaryStorageEvent()
    },

    // 取消退出(不暂存)
    quitCancel () {
      this.$router.push({path: `${this.enterPatrolAbnormalRecordPageSource}`})
    },

    // 暂存事件
    temporaryStorageEvent () {
      if (this.currentAbnormalType == '请选择') {
        this.$toast('异常类型不能为空');
        return
      };
      if (this.currentSeverityLevel == '请选择') {
        this.$toast('严重程度不能为空');
        return
      };
      if (this.currentEquipmentStatus == '请选择') {
        this.$toast('设备状态不能为空');
        return
      };
      try {
        let casuallyTemporaryStoragePatrolTaskAbnormalRecordList = this.patrolTaskAbnormalRecordList;
        if (casuallyTemporaryStoragePatrolTaskAbnormalRecordList.length > 0 ) {
            let temporaryIndex = casuallyTemporaryStoragePatrolTaskAbnormalRecordList.findIndex((item) => { return item.storeId == this.$route.query.eventId &&
            item.showDate ==  this.devicePatrolDetailsSelectMessage.showDate && item.collect == this.devicePatrolDetailsSelectMessage.selectTaskSetId && item.selectTime == this.devicePatrolDetailsSelectMessage.selectTime &&
            item.taskSite == this.devicePatrolDetailsSelectMessage.taskSite && item.extendData.deviceId == this.patrolTaskDeviceChecklist.deviceId && item.extendData.checkTypeId == this.patrolTaskAbnormalCheckItemEventList.typeId && 
            item.extendData.checkItemId == this.patrolTaskAbnormalCheckItemEventList.itemId && item.checkResultId == this.patrolTaskAbnormalCheckItemEventList.resultId
            });
            if (temporaryIndex != -1) {
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['eventType'] = this.currentAbnormalType == '请选择' ? '' : this.abnormalTypeOption.filter((item) => { return item.text == this.currentAbnormalType })[0]['value'];
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['registerSeverity'] = this.currentSeverityLevel == '请选择' ? '' : this.severityLevelOption.filter((item) => { return item.text == this.currentSeverityLevel })[0]['id'];
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['registerState'] = this.currentEquipmentStatus == '请选择' ? '' : this.equipmentStatusOption.filter((item) => { return item.text == this.currentEquipmentStatus })[0]['id'];
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['description'] = this.problemOverview;
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['findTime'] = this.getNowFormatDate(this.currentFindTime);
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['remark'] = this.taskDescribe;
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['images'] = this.problemPicturesList;
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList[temporaryIndex]['videos'] = this.problemVideosList
            } else {
              casuallyTemporaryStoragePatrolTaskAbnormalRecordList.push({
                storeId: uuidv4(), 
                eventType: this.currentAbnormalType == '请选择' ? '' : this.abnormalTypeOption.filter((item) => { return item.text == this.currentAbnormalType })[0]['value'],
                registerSeverity: this.currentSeverityLevel == '请选择' ? '' : this.severityLevelOption.filter((item) => { return item.text == this.currentSeverityLevel })[0]['id'],
                registerState: this.currentEquipmentStatus == '请选择' ? '' : this.equipmentStatusOption.filter((item) => { return item.text == this.currentEquipmentStatus })[0]['id'],
                checkResultId: this.patrolTaskAbnormalCheckItemEventList.resultId,
                depId: this.patrolTaskDeviceChecklist.deviceId,
                depName: this.patrolTaskDeviceChecklist.deviceName,
                findTime: this.getNowFormatDate(this.currentFindTime),
                description: this.problemOverview,
                remark: this.taskDescribe,
                selectTime: this.devicePatrolDetailsSelectMessage.selectTime,
                showDate: this.devicePatrolDetailsSelectMessage.showDate,
                taskSite: this.devicePatrolDetailsSelectMessage.taskSite,
                extendData: {
                  colName: this.patrolTaskDeviceChecklist.configName,
                  deviceId: this.patrolTaskDeviceChecklist.deviceId,
                  deviceName: this.patrolTaskDeviceChecklist.deviceName,
                  checkItemId: this.patrolTaskAbnormalCheckItemEventList.itemId,
                  checkTypeId: this.patrolTaskAbnormalCheckItemEventList.typeId,
                  deviceNorms: this.patrolTaskDeviceChecklist.norms,
                  checkItemName: this.patrolTaskAbnormalCheckItemEventList.itemName,
                  checkTypeName: this.patrolTaskAbnormalCheckItemEventList.typeName
                },
                images: this.problemPicturesList,
                videos: this.problemVideosList,
                collect: this.devicePatrolDetailsSelectMessage.selectTaskSetId,
                proId: this.proId,
                system: 9,
                createName: this.userName,
                taskNumber: this.patrolTaskAbnormalCheckItemEventList.taskNumber
              })
            }
          } else {
            casuallyTemporaryStoragePatrolTaskAbnormalRecordList.push({
              storeId: uuidv4(),
              eventType: this.currentAbnormalType == '请选择' ? '' : this.abnormalTypeOption.filter((item) => { return item.text == this.currentAbnormalType })[0]['value'],
              registerSeverity: this.currentSeverityLevel == '请选择' ? '' : this.severityLevelOption.filter((item) => { return item.text == this.currentSeverityLevel })[0]['id'],
              registerState: this.currentEquipmentStatus == '请选择' ? '' : this.equipmentStatusOption.filter((item) => { return item.text == this.currentEquipmentStatus })[0]['id'],
              checkResultId: this.patrolTaskAbnormalCheckItemEventList.resultId,
              depId: this.patrolTaskDeviceChecklist.deviceId,
              depName: this.patrolTaskDeviceChecklist.deviceName,
              findTime: this.getNowFormatDate(this.currentFindTime),
              description: this.problemOverview,
              remark: this.taskDescribe,
              selectTime: this.devicePatrolDetailsSelectMessage.selectTime,
              showDate: this.devicePatrolDetailsSelectMessage.showDate,
              taskSite: this.devicePatrolDetailsSelectMessage.taskSite,
              extendData: {
                colName: this.patrolTaskDeviceChecklist.configName,
                deviceId: this.patrolTaskDeviceChecklist.deviceId,
                deviceName: this.patrolTaskDeviceChecklist.deviceName,
                checkItemId: this.patrolTaskAbnormalCheckItemEventList.itemId,
                checkTypeId: this.patrolTaskAbnormalCheckItemEventList.typeId,
                deviceNorms: this.patrolTaskDeviceChecklist.norms,
                checkItemName: this.patrolTaskAbnormalCheckItemEventList.itemName,
                checkTypeName: this.patrolTaskAbnormalCheckItemEventList.typeName
              },
              images: this.problemPicturesList,
              videos: this.problemVideosList,
              collect: this.devicePatrolDetailsSelectMessage.selectTaskSetId,
              proId: this.proId,
              system: 9,
              createName: this.userName,
              taskNumber: this.patrolTaskAbnormalCheckItemEventList.taskNumber
            })
        };
        this.changePatrolTaskAbnormalRecordList(casuallyTemporaryStoragePatrolTaskAbnormalRecordList);
        this.$Alert({message:"暂存成功",duration:3000,type:'success'});
        this.$router.push({path: `${this.enterPatrolAbnormalRecordPageSource}`})
      } catch (err) {
        this.$dialog.alert({
          message: `${err}`,
          closeOnPopstate: true
        }).then(() => {
        })
      }  
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
  .quit-info-box {
    /deep/ .van-dialog {
      .van-dialog__content {
          padding: 20px 16px 0 16px !important;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          .delete-icon {
            text-align: right
          };
          .dialog-title {
            padding: 10px 0;
            box-sizing: border-box;
            text-align: center;
            color: #101010;
            font-size: 16px;
          };
          .dialog-center {
            line-height: 20px;
            padding: 20px 0;
            text-align: center;
            box-sizing: border-box;
            color: #101010;
            font-size: 12px
          }
        };
        .van-dialog__footer {
          padding: 10px 40px 20px 40px !important;
          box-sizing: border-box;
          justify-content: space-between;
          ::after {
            content: none
          };
        .van-dialog__cancel {
          height: 40px;
          background: #3B9DF9;
          color: #fff !important;
          border-radius: 8px;
          margin-right: 20px
        };
        .van-dialog__confirm {
           height: 40px;
            color: #3B9DF9;
            border: 1px solid #3B9DF9;
            border-radius: 8px
        }
        };
        .van-hairline--top::after {
          border-top-width: 0 !important
        }
    }
  };
  .choose-photo-box {
    position: fixed;
    margin: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 200000;
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
  };
  .img-dislog-box {
    /deep/ .van-dialog {
      top: 50% !important;
      max-height: 98vh;
      display: flex;
      flex-direction: column;
      .van-dialog__content {
        flex: 1;
        overflow: auto;
        >img {
          width: 100%;
        }
      };
      .van-dialog__footer {
        .van-dialog__confirm {
          background: #f2f2f2
        }
      }
    }
  };
  .find-time-box {
    /deep/ .van-popup {
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      .van-picker {
        padding: 20px 10px;
        box-sizing: border-box;
        .van-picker__toolbar {
          h3 {
            display: flex;
            justify-content: space-around;
            font-size: 18px;
            width: 100%;
            line-height: 40px;
            color: #101010;
            height: 40px;
            position: relative;
            /deep/ .van-icon {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 0
            }
          }
        };
        .button-box {
          height: 60px;
          display: flex;
          width: 100%;
          margin: 0 auto;
          align-items: center;
          justify-content: center;
          >span {
              width: 40%;
              display: inline-block;
              height: 45px;
              font-size: 18px;
              line-height: 45px;
              background: #fff;
              text-align: center;
              border-radius: 30px;
              &:nth-child(1) {
                  color: #1864FF;
                  box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                  margin-right: 40px
              };
              &:last-child {
                  color: #fff;
                  background: linear-gradient(to right, #6cd2f8, #2390fe);
                  box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
              }
          }
        }
      }
    }
  };
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
          .event-type {
            .select-box-left {
              padding-right: 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  font-size: 14px;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            }
          };
          .select-box {
            width: 100%;
            padding: 8px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .select-box-left {
              padding-right: 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  font-size: 14px;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            };
            .select-box-right {
              flex: 1;
              justify-content: flex-end;
              align-items: center;
              display: flex;
              padding-right: 6px;
              box-sizing: border-box;
              width: 0;
              .spanStyle {
                color: #bfbfbf !important
              };
              >span {
                font-size: 14px;
                color: #101010;
                text-align: right;
                flex: 1;
                .no-wrap()
              }
            }
          };
          .end-select-box {
              .select-box-right {
                font-size: 14px;
                color: #101010;
                padding-right: 0 !important;
                .spanStyle {
                  color: #bfbfbf !important
                };
              }
          };
          .end-select-box-room {
            .select-box-left {
              >span {
                &:nth-child(1) {
                  color: red
                };
                &:nth-child(2) {
                  color: #9E9E9A;
                  font-size: 14px;
                  padding-right: 6px;
                  box-sizing: border-box
                }
              }
            }
          };
          .problem-overview {
            align-items: center
          };
          .details-site {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              padding-right: 10px;
              box-sizing: border-box;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
            .transport-type-right {
              width: 0;
              flex: 1;
              display: flex;
              flex-wrap: wrap;
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            }
          };
          .transport-type {
            width: 100%;
            padding: 10px 6px;
            box-sizing: border-box;
            background: #fff;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            font-size: 14px;
            margin-top: 6px;
            .transport-type-left {
              width: 100%;
              margin-bottom: 8px;
              >span {
                &:nth-child(1) {
                  color: #9E9E9A;
                  padding-right: 6px;
                  box-sizing: border-box
                };
              }
            };
            .transport-type-right {
              width: 100%;
              display: flex;
              flex-wrap: wrap;
              /deep/ .van-cell {
                padding: 4px 6px !important;
                background: #F9F9F9
              }
            }
          };
          .result-picture {
            padding: 0 8px 14px 8px;
            margin-top: 6px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            background: #fff;
            justify-content: space-between;
            .title-picture {
              font-size: 14px;
              height: 30px;
              line-height: 30px;
              color: #9E9E9A
            };
            .image-list {
              width: 100%;
              flex-wrap: wrap;
              display: flex;
              >div {
                  width: 23.5%;
                  height: 70px;
                  video {
                    width: 100%;
                    height: 70px;
                  };
                  vertical-align: top;
                  margin-right: 2%;
                  margin-top: 2%;
                  position: relative;
                  &:nth-child(1) {
                      margin-top: 0;
                  };
                  &:nth-child(2) {
                      margin-top: 0;
                  };
                  &:nth-child(3) {
                      margin-top: 0;
                  };
                  &:nth-child(4) {
                      margin-top: 0;
                  };
                  &:nth-child(4n+4) {
                      margin-right: 0;
                  };
                  .icon-box {
                      position: absolute;
                      bottom: 0;
                      right: 0;
                      display: flex;
                      width: 100%;
                      padding: 2px 0;
                      box-sizing: border-box;
                      justify-content: center;
                      align-items: center;
                      background: #616161;
                      /deep/ .van-icon {
                      }  
                  };
                  img {
                      width: 100%;
                      height: 100%
                  };
                  &:last-child {
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      background: #f2f2f2;
                      /deep/ .van-icon{
                          position: relative;
                          top: 0;
                          right: 0;
                      }
                  }
              }
            }
          }
        };
        .btn-box {
          width: 90%;
          margin: 0 auto;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          >span {
            width: 40%;
            display: inline-block;
            height: 45px;
            font-size: 18px;
            line-height: 45px;
            background: #fff;
            text-align: center;
            border-radius: 30px;
            &:nth-child(1) {
              color: #E86F50;
              border: 1px solid #E86F50;
              margin-right: 30px
            };
            &:nth-child(2) {
              color: #3B9DF9;
              border: 1px solid #3B9DF9;
              margin-right: 30px
            };
            &:last-child {
              color: #fff;
              background: linear-gradient(to right, #6cd2f8, #2390fe);
              box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            }
          }
        }
    }
  }
}
</style>