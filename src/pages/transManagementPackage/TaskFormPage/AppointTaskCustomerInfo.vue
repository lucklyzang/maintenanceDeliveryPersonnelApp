<template>
  <div class="content-wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="showLoadingHint">确认中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
     <!-- 右边下拉框菜单 -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="sweep-code-title">
      <h3>客户预约信息</h3>
    </div>
    <div class="customerInfo-box">
      <div class="custormer-info">
        <van-field disabled v-model="patientName" label="病人姓名"/>
        <van-field  disabled v-model="sex" label="病人性别"/>
        <van-field  disabled v-model="age" label="病人年龄"/>
        <van-field  disabled v-model="bedNumber" label="病人床号"/>
        <van-field  disabled v-model="number" label="任务编号"/>
        <van-field
          v-model="appointDescribe"
          rows="1"
          autosize
          disabled
          label="描述"
          type="textarea"
        />
      </div>
    </div>
    <div class="electronic-signature">
      <ElectronicSignature ref="mychild"></ElectronicSignature>
    </div>
    <div class="rewrite-box">
      <span @click="rewrite">重写</span>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSurePng" alt=""  @click="appointMessageSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="appointMessageCancel">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import VanFieldSelectPicker from '@/components/VanFieldSelectPicker'
import ElectronicSignature from '@/components/ElectronicSignature'
import FooterBottom from '@/components/FooterBottom'
import {sureCustomerAppointInfo} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore, IsPC, deepClone } from '@/common/js/utils'
export default {
  name: 'appointTaskCustomerInfo',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      overlayShow: false,
      showLoadingHint: false,
      liIndex: null,
      appointDescribe: '',
      patientName: '',
      sex: '',
      age: '',
      bedNumber: '',
      number: '',
      taskSurePng: require('@/components/images/task-sure.png'),
      taskCancelPng: require('@/components/images/task-cancel.png')
    };
  },

  components:{
    VanFieldSelectPicker,
    HeaderTop,
    NoData,
    FooterBottom,
    ElectronicSignature
  },

  computed: {
    ...mapGetters([
      'navTopTitle',
      'userInfo',
      'originalSignature',
      'appointTaskMessage',
      'completeSweepcodeDepartureInfo',
      'currentElectronicSignature',
      'chooseHospitalArea'
    ]),
    sex () {
      return this.userInfo['worker']['extendData']['sex']
    },
    userTypeId () {
      return this.isMedicalMan
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
    },
    taskId () {
      return this.appointTaskMessage.id
    }
  },

  mounted () {
    console.log(this.appointTaskMessage);
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.backTo()
      })
    };
    this.echoCustomerInfo()
  },

  methods: {
    ...mapMutations([
      'changeTitleTxt',
      'changeCurrentElectronicSignature',
      'changeCatchComponent',
      'changeCompleteSweepcodeDepartureInfo'
    ]),
    // 右边下拉框菜单点击
    leftLiCLick (index) {
      this.liIndex = index;
      localStorage.clear();
      this.$router.push({path:'/'})
    },

     // 性别转换
      sexTransfer (index) {
        switch(index) {
          case 0 :
            return '未指定'
            break;
          case 1 :
            return '男'
            break;
          case 2 :
            return '女'
            break;
          default:
            return '未指定'
        }
      },

    // 回显客户预约信息
    echoCustomerInfo () {
      this.patientName = this.appointTaskMessage['patientName'],
      this.sex = this.sexTransfer(this.appointTaskMessage['sex']),
      this.age = this.appointTaskMessage['age'],
      this.bedNumber = this.appointTaskMessage['bedNumber'],
      this.number = this.appointTaskMessage['taskNumber'],
      this.appointDescribe = this.appointTaskMessage['taskRemark']
    },

    // 重写
    rewrite () {
      try {
        this.$refs.mychild.overwrite()
      } catch (err) {
        
      }
    },

    // 确认客户信息
    checkCustomerInfo (data) {
      this.overlayShow = true;
      this.showLoadingHint = true;
      sureCustomerAppointInfo(data).then((res) => {
        if (res && res.data.code == 200) {
          this.$toast(`${res.data.msg}`);
          this.rewrite();
          this.clearInfo()
        } else {
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          });
        };
        this.overlayShow = false;
        this.showLoadingHint = false;
      })
      .catch((err)=>{
        this.overlayShow = false;
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

     // 更新任务状态
    clearInfo () {
      this.changeCurrentElectronicSignature({DtMsg: null});
      this.$router.push({'path':'/appointDetails'});
      this.changeTitleTxt({tit:'预约任务详情'});
      setStore('currentTitle','预约任务详情')
    },

    // 跳转到我的页
    skipMyInfo () {
      this.leftDownShow = !this.leftDownShow;
    },

    // 预约信息确认
    appointMessageSure () {
      this.$refs.mychild.commitSure();
      if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
        return
      };
      this.checkCustomerInfo({
        taskId: this.taskId,//任务Id,必填项
        proId: this.proId,//项目ID，必填项
        workerId: this.workerId, //运送员ID即当前登录人
			  sign: this.currentElectronicSignature //base64字符串 必填项
      })
    },

    // 预约信息取消
    appointMessageCancel () {
      // 重置起始科室校验状态
      let temporaryOfficeList = deepClone(this.completeSweepcodeDepartureInfo);
      if (this.completeSweepcodeDepartureInfo.length > 0 ) {
        let temporaryIndex = this.completeSweepcodeDepartureInfo.indexOf(this.completeSweepcodeDepartureInfo.filter((item) => {return item.taskId == this.taskId})[0]);
        if (temporaryIndex != -1) {
          temporaryOfficeList[temporaryIndex]['patienVerified'] = false;
          temporaryOfficeList[temporaryIndex]['startPonitVerified'] = false;
          temporaryOfficeList[temporaryIndex]['backStartPonitVerified'] = false
        }
      };
      this.changeCompleteSweepcodeDepartureInfo(temporaryOfficeList);
      setStore('completAppointTaskSweepCodeDepartureInfo', {"sweepCodeInfo": temporaryOfficeList})
      this.$router.push({'path':'/appointDetails'});
      this.changeTitleTxt({tit:'预约任务详情'});
      setStore('currentTitle','预约任务详情')
    },

    // 返回上一页
    backTo () {
      this.$dialog.alert({
        message: '请确认客户信息',
        closeOnPopstate: true
      }).then(() => {
      });
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
      .left-dropDown {
      .rightDropDown
    }
    font-size: 14px;
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    };
    .customerInfo-box {
      width: 100%;
      flex:1;
      overflow: auto;
      margin: 0 auto;
      .custormer-info {
        width: 100%;
        font-size: 14px;
        padding-left: 10px;
        /deep/ .van-cell {
          padding: 10px 0;
          color: black;
          .van-cell__value {
            .van-field__control:disabled {
              color: black
            }
          }
        }
      }
    };
    .electronic-signature {
      height: auto
    }
    .rewrite-box {
      height: 40px;
      margin: 10px 0;
      width: 100%;
      text-align: center;
      span {
        display: inline-block;
        width: 120px;
        height: 40px;
        line-height: 40px;
        background: #fff;
        border-radius: 3px;
        color: #888888;
        border: 1px solid #ebebeb
      }
    };
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
  }
</style>
