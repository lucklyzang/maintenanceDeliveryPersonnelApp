<template>
  <div class="page-box" ref="wrapper">
    <van-overlay :show="overlayShow" />
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadText }}</van-loading>
    <div class="nav">
      <NavBar path="/cleanTaskList" title="新增任务" />
    </div>
    <div class="content">
      <div class="result-picture">
        <div>
          图片
        </div>
        <div class="image-list">
          <div v-for="(item, index) in resultImgList" :key="index">
            <img :src="item" />
            <div class="icon-box"  @click="issueDelete(index)">
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
      <div class="category-box category-no-select-box">
        <div class="category-title">
          <span>*</span>
          <span>类别</span>
        </div>
        <div class="select-box">
          即时保洁任务
            <!-- <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="categoryValue" :options="categoryOption" />
            </van-dropdown-menu> -->
        </div>
      </div>
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>优先级</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="priorityValue" :options="priorityOption" />
            </van-dropdown-menu>
        </div>
      </div>
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>来源</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="sourceValue" :options="sourceOption" />
            </van-dropdown-menu>
        </div>
      </div>
      <div class="category-box location-box">
        <div class="category-title">
            <span>*</span>
            <span>位置</span>
        </div>
        <div class="select-box" @click="locationEvent">
          <span>{{ locationValue }}</span>
          <van-icon name="arrow" color="#174E97" size="20" />
        </div>
      </div>
      <div class="category-box">
        <div class="category-title">
            <span>*</span>
            <span>保洁员</span>
        </div>
        <div class="select-box">
            <van-dropdown-menu active-color="#174E97">
                <van-dropdown-item v-model="workerValue" :options="workerOption" />
            </van-dropdown-menu>
        </div>
      </div>
      <!-- <div class="category-box completeDate-box">
        <div class="category-title">
            <span>*</span>
            <span>预计完成时间</span>
        </div>
        <div class="select-box" @click="datetimePickerClickEvent">
            <span>
                {{ getNowFormatDate(currentDate) }}
            </span>
            <van-icon name="arrow" color="#174E97" size="20" />
        </div>
      </div> -->
      <div class="category-box person-number-box category-box-other">
        <div class="category-title">
            <span>预计人数</span>
        </div>
        <div class="person-input-box">
            <van-field v-model="personNumberValue" type="number"/>
            <span>人</span>
        </div>
      </div>
      <div class="category-box person-number-box duration-box category-box-other">
        <div class="category-title">
            <span>预计耗时</span>
        </div>
        <div class="person-input-box">
            <van-field v-model="durationValue" type="number"/>
            <span>分钟</span>
        </div>
      </div>
      <div class="category-box category-box-other">
        <div class="category-title">
            <span>违反标准</span>
        </div>
        <van-field-checkbox
          placeholder="请选择违反标准"
          v-model="standardValue"
          :columns="standardColumns"
          label-width="100"
          :option="{label:'text',value:'value'}"
          @showPopu="standardOptionOpenEvent"
          @confirm="standardConfirm"
      />
      </div>
      <div class="enter-remark">
        <div>
          问题描述
        </div>
        <div class="remark-box">
          <van-field
            v-model="enterRemark"
            rows="3"
            autosize
            type="textarea"
            placeholder="请输入问题描述"
          />
        </div>
      </div>
    </div>
    <div class="task-start" @click="submitEvent">提交</div>
    <transition name="van-slide-up">
      <div class="choose-photo-box" v-show="photoBox">
        <div class="choose-photo">
          <van-icon name="photo" />
          <input
            name="uploadImg1"
            id="demo1"
            @change="previewFileOne"
            ref="inputFile"
            type="file"
            accept="image/*"
          />从图库中选择
        </div>
        <div class="photo-graph">
          <van-icon name="photograph" />
          <input
            name="uploadImg2"
            id="demo2"
            @change="previewFileTwo"
            type="file"
            accept="image/*,.camera"
            capture="camera"
          />拍照
        </div>
        <div class="photo-cancel" @click="photoCancel">取消</div>
      </div>
    </transition>
    <van-popup v-model="showDateBox" position="bottom">
        <van-datetime-picker
            v-model="currentDate"
            @confirm="showDateBox = false"
            @cancel="showDateBox = false"
            type="datetime"
            title="选择完成时间"
            :min-date="minDate"
            :max-date="maxDate"
        />
    </van-popup>
    <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog>
  </div>
</template>
<script>
import VanFieldCheckbox from "@/components/VanFieldCheckbox";
import NavBar from "@/components/NavBar";
import {addForthwithCleanTask, getViolateStandardMessage,attendanceWorkerList} from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC, compress, base64ImgtoFile } from "@/common/js/utils";
import {getAliyunSign} from '@/api/clean/login.js'
import axios from 'axios'
export default {
  name: "AddTask",
  components: {
    NavBar,
    VanFieldCheckbox
  },
  data() {
    return {
      photoBox: false,
      selectStandard: [],
      imgIndex: '',
      isExpire: false,
      deleteInfoDialogShow: false,
      showDateBox: false,
      overlayShow: false,
      loadingShow: false,
      loadText: '创建中',
      enterRemark: "",
      personNumberValue: '',
      durationValue: '',
      categoryValue: 0,
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2050, 10, 1),
      currentDate: new Date(),
      standardValue: [],
      standardColumns: [],
      categoryOption: [
        {
            text: '请选择类别',
            value: 0
            
        },
        {
            text: '即时保洁任务',
            value: 1
            
        }
      ],
     workerValue: 0,
     workerOption: [
       {
          text: '请选择保洁员',
          value: 0
        }
     ],
     sourceValue: 0,
     sourceOption: [
        {
            text: '请选择来源',
            value: 0
            
        },
        {
            text: '主管反馈',
            value: 1
            
        },
        {
            text: '保洁员反馈',
            value: 2
            
        },
        {
            text: '医护反馈',
            value: 3
            
        },
        {
            text: '病患反馈',
            value: 4
            
        }
      ],
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      locationValue: '请选择位置',
      priorityValue: 1,
      priorityOption: [
        {
          text: '正常',
          value: 1
        },
        {
          text: '重要',
          value: 2
        },
        {
          text: '紧急',
          value: 3
        },
        {
          text: '紧急重要',
          value: 4
        }
      ],
      calendarPng: require("@/common/images/home/calendar-attendance.png"),
      resultImgList: [],
      imgOnlinePathArr: []
    }
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
    this.getWorkerList()
  },

  activated () {
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/cleanTaskList",
        })
      })
    };
    this.echoLoactionMessage();
    this.getWorkerList()
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","timeMessage","ossMessage","chooseProject","locationMessage","chooseHospitalArea"]),
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
    ...mapMutations(["changeIsLogin","changeCatchComponent","changeTimeMessage","changeOssMessage","storeLocationMessage"]),

    // 时间栏点击事件
    datetimePickerClickEvent () {
      this.showDateBox = true
    },

    // 违反标准下拉框确定事件
    standardConfirm (data1, data2) {
      this.selectStandard = [];
      if (data2.length > 0) {
        for (let item of data2) {
          this.selectStandard.push(item.text)
        }
      }
    },

    // 违反标准下拉框打开事件
    standardOptionOpenEvent () {
      if (this.locationMessage.length == 4) {
        this.overlayShow = true;
        this.loadingShow = true;
        this.loadText =  '查询中...';
        getViolateStandardMessage({id: this.locationMessage[3]['id']}).then((res) => {
          this.overlayShow = false;
          this.loadingShow = false;
          this.loadText =  '';
          if (res && res.data.code == 200) {
            this.standardColumns = [];
            if (res.data.data.length > 0) {
              for ( let i =0, len = res.data.data.length; i< len ; i++) {
                this.standardColumns.push({
                  text: res.data.data[i],
                  value: i+1
                })
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
          this.overlayShow = false;
          this.loadingShow = false;
          this.loadText =  '';
          this.$toast({
            message: `${err}`,
            type: 'fail'
          })
        })
      } else {
         this.$toast({
            message: '请选择位置'
          })
      }
    },

    // 回显位置信息
    echoLoactionMessage () {
      if (this.locationMessage.length == 4) {
        this.locationValue = `${this.locationMessage[0]['structName']}-${this.locationMessage[1]['departmentName']}-${this.locationMessage[2]['itemName']}-${this.locationMessage[3]['name']}`
      } else {
        this.locationValue = '请选择位置';
      }
    },

    // 位置点击事件
    locationEvent () {
      this.changeCatchComponent(['dispatchTask','AddTask']);
      this.$router.push({path: '/choosePosition'})  
    },

    // 格式化时间
    getNowFormatDate(currentDate) {   
        let seperator1 = "-";
        let seperator2 = ":";
        let month = currentDate.getMonth() + 1;
        let strDate = currentDate.getDate();
        let hours = currentDate.getHours();
        let strMinutes = currentDate.getMinutes();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (strMinutes >= 0 && strMinutes <= 9) {
            strMinutes = "0" + strMinutes;
        }
        if (hours >= 0 && hours <= 9) {
          hours = "0" + hours;
        }
        let currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
                + " " + hours + seperator2 + strMinutes
        return currentdate;
    },

     // 查询保洁员列表
    getWorkerList () {
      this.workerOption = [{ text: '请选择保洁员', value: 0 }];
      attendanceWorkerList(this.proId).then((res) => {
          if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              for (let item of res.data.data) {
                if (this.workerOption.filter((innerItem) => {return innerItem.value == item.workerId}).length == 0) {
                  this.workerOption.push({
                    text: item.workerName,
                    value: item.workerId
                  })
                }  
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
            })
        })
    },

    // 任务提交事件
    async submitEvent() {
      // if (this.categoryOption.filter((item) => { return item.value == this.categoryValue })[0]['text'] == '请选择类别') {
      //   this.$toast('请选择类别');
      //   return
      // };
      if (this.sourceOption.filter((item) => { return item.value == this.sourceValue })[0]['text'] == '请选择来源') {
        this.$toast('请选择来源');
        return
      };
      if (this.locationMessage.length != 4) {
        this.$toast('请选择位置');
        return
      };
       if (this.workerOption.filter((item) => { return item.value == this.workerValue })[0]['text'] == '请选择保洁员') {
        this.$toast('请选择保洁员');
        return
      };
      let paramsData = {
        managerId: this.workerId, // 保洁主管id，当前登陆人员id
        managerName: this.userName,// 保洁主管姓名，当前登陆人员姓名
        assignId: this.workerId, // 任务分配人员id，当前登陆人员id
        assignName: this.userName,// 任务分配人员姓名，当前登陆人员姓名
        workerId: this.workerValue,//保洁员id
        priority: this.priorityValue, //优先级
        workerName: this.workerOption.filter((item) => { return item.value == this.workerValue})[0]['text'],//保洁员姓名
        path: [], // 上传的问题图片，集合,
        taskType: 0,// 任务类型，即时保洁为 0
        source: this.sourceOption.filter((item) => { return item.value == this.sourceValue })[0]['text'], // 任务来源
        structureId: this.locationMessage[0]['id'], // 建筑id
        structureName: this.locationMessage[0]['structName'], // 建筑名称
        depId: this.locationMessage[1]['id'], // 科室id
        depName: this.locationMessage[1]['departmentName'], // 科室名称
        areaImmediateId: this.locationMessage[2]['id'], // 目的区域id
        areaImmediateName: this.locationMessage[2]['itemName'], // 目的区域名称
        spaces: [],
        standards: this.selectStandard, // 检查标准，违反标准，数组
        // planFinishTime: this.getNowFormatDate(this.currentDate), // 任务预计完成时间
        planPersons: this.personNumberValue, // 任务预计所需人数
        planUseTime: this.durationValue, // 任务预计用时，单位为分钟
        taskRemark: this.enterRemark, // 任务备注信息
        proId: this.proId, // 所属项目id
        proName: this.proName // 所属项目名称
      };
      // 上传图片到阿里云服务器
      if (this.resultImgList.length > 0) {
        this.loadText ='创建中';
        this.overlayShow = true;
        this.loadingShow = true;
        for (let imgI of this.resultImgList) {
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
        paramsData.path = this.imgOnlinePathArr
      };
      paramsData.spaces.push({
        id: this.locationMessage[3]['id'],
        name: this.locationMessage[3]['name']
      });
      this.addForthwithCleanTask(paramsData) 
    },

    // 添加任务
    addForthwithCleanTask (data) {
      this.loadingShow = true;
      this.overlayShow = true;
      addForthwithCleanTask(data).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
          this.imgOnlinePathArr = [];
					if (res && res.data.code == 200) {
            this.$toast({
							message: '任务创建成功',
							type: 'success'
						});
            this.resultImgList = [];
            this.storeLocationMessage([]);
            this.selectStandard = [];
            this.enterRemark = '';
            this.categoryValue = 0;
            this.sourceValue = 0;
            this.workerValue = 0;
            this.priorityValue = 1;
            this.currentDate = new Date();
            this.locationValue = '请选择位置';
            this.standardValue = [];
            this.personNumberValue = '';
            this.durationValue = '';
            this.$router.push({
              path: "/cleanTaskList"
            })
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
          this.imgOnlinePathArr = [];
					this.loadingShow = false;
          this.overlayShow = false
			})
    },


    // 图片上传预览
    previewFileOne() {
      let file = document.getElementById("demo1").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size / 1024 / 1024 < 16;
      if (!isLt2M) {
        this.$dialog
          .alert({
            message: "上传图片大小不能超过16MB!",
            closeOnPopstate: true,
          })
          .then(() => {});
          _this.$refs.inputFile.value = null;
          _this.photoBox = false;
          _this.overlayShow = false;
          return
      }
      reader.addEventListener(
        "load",
        function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.resultImgList.push(src);
            _this.photoBox = false;
            _this.overlayShow = false
          };
          _this.$refs.inputFile.value = null;
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
    },

    //拍照预览
    previewFileTwo() {
      let file = document.getElementById("demo2").files[0];
      let _this = this;
      let reader = new FileReader();
      let isLt2M = file.size / 1024 / 1024 < 16;
      if (!isLt2M) {
        _this.$dialog
          .alert({
            message: "上传图片大小不能超过16MB!",
            closeOnPopstate: true,
          })
          .then(() => {});
        return;
      }
      reader.addEventListener(
        "load",
        function () {
          // 压缩图片
          let result = reader.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let src = compress(img);
            _this.resultImgList.push(src);
            _this.photoBox = false;
            _this.overlayShow = false
          };
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
      }
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
							this.$toast({
								message: `${res.data.data.msg}`,
								type: 'fail'
							});
							reject()
						}
					})
					.catch((err) => {
            this.$toast({
              message: `${res.data.data.msg}`,
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
          const OSSAccessKeyId = this.ossMessage.accessId;
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
            resolve();
            console.log('阿里云图片',this.imgOnlinePathArr);
          })
          .catch((err) => {
            reject()
          })
          })
			},


    // 拍照点击
    issueClickEvent() {
      this.photoBox = true;
      this.overlayShow = true;
    },

    // 结果照片删除
    issueDelete(index) {
      this.deleteInfoDialogShow = true;
      this.imgIndex = index
    },


    // 确定删除提示框确定事件
    sureDeleteEvent () {
      this.resultImgList.splice(this.imgIndex, 1)
    },

    // 拍照取消
    photoCancel() {
      this.photoBox = false;
      this.overlayShow = false;
    },
  },
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
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
      background: #f6f6f6;
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
        line-height: 30px;
      }
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        top: 0;
        height: 100%;
        opacity: 0;
        filter: alpha(opacity=0);
        cursor: pointer;
      }
    }
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
        line-height: 50px;
      }
      input {
        position: absolute;
        font-size: 100px;
        right: 0;
        height: 100%;
        top: 0;
        opacity: 0;
      }
    }
    .photo-cancel {
      position: relative;
      display: inline-block;
      padding: 8px 12px;
      overflow: hidden;
      color: @color-theme;
      text-decoration: none;
      text-indent: 0;
      line-height: 30px;
      font-weight: bold;
    }
  }
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
  }
  .content {
    flex: 1;
    display: flex;
    background: #fff;
    flex-direction: column;
    padding: 6px 0;
    overflow: auto;
    .category-box {
      padding: 0 8px;
      margin-bottom: 6px;
      height: 40px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      align-items: center;
      .category-title {
        font-size: 14px;
        color: #101010;
        >span {
            &:first-child {
                color: red
            }
        }

      };
      .select-box {
        flex: 1;
        width: 0;
        /deep/ .van-dropdown-menu {
            .van-dropdown-menu__bar {
                box-shadow: none !important;
                .van-dropdown-menu__item {
                    justify-content: flex-end !important;
                    .van-dropdown-menu__title {
                      color: #174E97 !important;
                      font-size: 14px !important
                    };
                    .van-dropdown-menu__title::after {
                        border-color: transparent transparent #174E97 #174E97 !important;
                    }
                }
            }
        }
      };
      /deep/ .dh-field {
        flex: 1;
        padding-left: 6px !important;
        padding-right: 0 !important;
        .van-field__control {
          color: #174E97 !important
        };
        .van-hairline--bottom::after {
          display: none !important
        };
        input::placeholder {
          color: #174E97 !important;
        };
        .van-cell__right-icon {
          font-size: 21px !important;
          color: #174E97 !important
        };
        .van-picker__cancel {
          color: #a3a3a3 !important
        }
      }
    };
    .category-box-other {
      .category-title {
        font-size: 14px;
        color: #101010 !important;
         >span {
            &:first-child {
              margin-left: 10px;
              color: #101010
            }
        }
      }
    };
    .category-no-select-box {
      .select-box {
        text-align: right;
        color: #174E97 !important;
        font-size: 14px !important
      }
    };
    .location-box {
      .select-box {
        text-align: right;
        padding-left: 4px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        >span {
          font-size: 14px;
          &:nth-child(1) {
            flex: 1;
            .no-wrap();
            color: #174E97;
            vertical-align: middle
          }
        };
        /deep/ .van-icon {
          vertical-align: middle
        }
      }
    };
    .completeDate-box {
        .select-box {
          text-align: right;
            >span {
              font-size: 14px;
              vertical-align: middle;
                color: #174E97
            };
            /deep/ .van-icon {
              vertical-align: middle
            }
        }
    };
    .person-number-box {
        .person-input-box {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            /deep/ .van-cell {
                padding: 16px 8px;
                box-sizing: border-box;
                width: 30%;
                .van-cell__value {
                  font-size: 14px !important;
                  border: 1px solid #cacaca
                }
            };
            >span {
              color:#101010 !important;
              font-size: 14px
            }
        }
    };
    .duration-box {
        /deep/ .van-cell {
            width: 26% !important
        }
    };
    .result-picture {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      background: #fff;
      justify-content: space-between;
      > div {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {
        }
        &:nth-child(2) {
          margin-left: 8px;
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          > div {
            width: 31%;
            height: 100px;
            vertical-align: top;
            margin-right: 2%;
            margin-top: 2%;
            position: relative;
            &:nth-child(1) {
              margin-top: 0;
            }
            &:nth-child(2) {
              margin-top: 0;
            }
            &:nth-child(3) {
              margin-top: 0;
            }
            &:nth-child(3n + 3) {
              margin-right: 0;
            }
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
              height: 100%;
            }
            &:last-child {
             display: flex;
             justify-content: center;
             align-items: center;
              background: #f2f2f2;
              /deep/ .van-icon {
                position: relative;
                top: 0;
                right: 0;
              }
            }
          }
        }
      }
    }
    .enter-remark {
      padding: 14px 8px;
      margin-bottom: 6px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      > div {
        font-size: 14px;
        color: #a1a0a0;
        &:first-child {
        }
        &:nth-child(2) {
          margin-left: 8px;
          flex: 1;
          /deep/ .van-cell {
            padding: 4px !important;
            border: 1px solid #cacaca;
          }
        }
      }
    }
  }
  .task-start {
    height: 48px;
    width: 266px;
    font-size: 18px;
    margin: 0 auto;
    line-height: 48px;
    background: linear-gradient(to right, #6cd2f8, #2390fe);
    box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
    color: #fff;
    border-radius: 30px;
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: center;
  }
}
</style>