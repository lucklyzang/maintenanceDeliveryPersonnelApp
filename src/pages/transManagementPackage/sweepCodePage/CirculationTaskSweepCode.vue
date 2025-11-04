<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
     <!--  -->
    <ul class="left-dropDown" v-show="leftDownShow">
      <li v-for="(item, index) in leftDropdownDataList" :key="index" :class="{liStyle:liIndex == index}" @click="leftLiCLick(index)">{{item}}</li>
    </ul>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="校验中,请稍候····" textColor="#2895ea"></loading>
    </div>
    <div class="sweep-code-area">
      <div class="point-area">
        <div class="task-start-point" v-show="arriveDepartmentId == false">
          <p>任务起点:</p>
          <ul>
            <li v-for="(item,index) in startPointList" :key="index">{{item.text}}</li>
          </ul>
        </div>
        <div class="task-start-point" v-show="arriveDepartmentId == true">
          <p>请扫描标本送达的科室</p>
        </div>
      </div>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSweepCodePng" alt=""  @click="sweepCodeSure">
      </span>
      <span>
        <img :src="taskCancelPng" alt="" @click="cancelSweepCode">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {judgeDepartment} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore, IsPC } from '@/common/js/utils'
export default {
  name: 'circulationTaskSweepCode',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      showLoadingHint: false,
      liIndex: null,
      startPointList: [],
      taskCancelPng: require('@/components/images/task-cancel.png'),
      taskSweepCodePng: require('@/components/images/task-sweep-code.png')
    };
  },

  components:{
    HeaderTop,
    NoData,
    Loading,
    FooterBottom
  },

  mounted () {
    console.log('id');
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        this.changeIsrefreshCirculationConnectPage(false);
        this.$router.push({'path':'/circulationDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情');
      })
    };
    this.echoOfficeList();
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    };
    this.sweepCodeSure()
  },

  computed:{
    ...mapGetters([
      'navTopTitle',
      'circulationTaskMessage',
      'isCollectEnterSweepCodePage',
      'stipulateOfficeList',
      'arriveDepartmentId',
      'circulationDetails',
      'isNewCircle',
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
    },
    checkType () {
      return this.$route.query.checkType
    },
    checkId () {
      return this.$route.query.id
    },
    circulationId () {
      return this.circulationDetails.id
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeStoreArriveDeparnmentId',
      'changeIsrefreshCirculationConnectPage',
      'changeVerifyCirculationOfficeId',
      'changeVerifyNewCirculationOfficeId'
    ]),

     // 右边下拉框菜单点击
      leftLiCLick (index) {
        this.liIndex = index;
        localStorage.clear();
        this.$router.push({path:'/'})
      },

      // 跳转到我的页
      skipMyInfo () {
        this.leftDownShow = !this.leftDownShow;
      },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

     // 重新扫码弹窗
    againSweepCode () {
      this.sweepAstoffice()
    },

    // 回显要扫码的科室列表
    echoOfficeList () {
      this.startPointList = this.circulationDetails.spaces
    },

    // 返回上一页
    backTo () {
      this.changeIsrefreshCirculationConnectPage(false);
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情');
    },

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
      this.backTo()
    },

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        let codeData = code.split('|');
        if (codeData.length > 0) {
          let departmentId = codeData[0],
              departmentNo = codeData[1];
          if (!this.arriveDepartmentId) {
            this.juddgeMedicalCorrect({
              id: this.circulationId,// 循环任务ID 必输
              proId: this.proId, // 项目ID 必输
              departmentNo: departmentNo, //项目编号
              departmentId: departmentId //扫描科室ID 必输
            })
          } else {
            // 存储送达的科室编号
            this.changeStoreArriveDeparnmentId(departmentNo);
            setStore('currentDepartmentId', departmentNo);
            // 存储新循环任务要送达的科室id
            this.changeVerifyNewCirculationOfficeId(departmentId);
            this.changeIsrefreshCirculationConnectPage(true);
            if (this.isNewCircle) {
              this.$router.push({path:'/newCirculationTaskConnectMessage'});
              this.changeTitleTxt({tit:'待送达标本'});
              setStore('currentTitle','待送达标本')
            } else {
              this.$router.push({path:'/circulationTaskMessageConnect'});
              this.changeTitleTxt({tit:'循环信息交接'});
              setStore('currentTitle','循环信息交接')
            }
          }
        }
      } else {
        this.$dialog.alert({
          message: '当前没有扫描到任何信息,请重新扫描'
        }).then(() => {
          this.sweepAstoffice()
        });
      }
    },

    // 扫码确认事件
    sweepCodeSure () {
      this.sweepAstoffice()
    },

    //判断扫码科室是否为当前要收集的科室
    juddgeMedicalCorrect(data) {
      this.showLoadingHint = true;
      judgeDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          // 存储校验通过的科室编号
          this.changeVerifyCirculationOfficeId(data['departmentNo']);
          // 存储新循环任务校验通过的科室id
          this.changeVerifyNewCirculationOfficeId(data['departmentId']);
          if(this.isCollectEnterSweepCodePage) {
            if (this.isNewCircle) {
              this.$router.push({path:'/newCirculationTaskCollectMessage'});
              this.changeTitleTxt({tit:'标本采集'});
              setStore('currentTitle','标本采集')
            } else {
              this.$router.push({path:'/circulationTaskCollectMessage'});
              this.changeTitleTxt({tit:'循环信息采集'});
              setStore('currentTitle','循环信息采集')
            }
          }
        } else {
          this.backTo();
          this.$dialog.alert({
            message: res.data.msg,
            closeOnPopstate: true
          }).then(() => {
          }).catch((err) =>{
          })
        };
        this.showLoadingHint = false
      })
      .catch((err) => {
        this.backTo();
        this.showLoadingHint = false
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        });
      })
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.changeIsrefreshCirculationConnectPage(false);
      this.$router.push({'path':'/circulationDetails'});
      this.changeTitleTxt({tit:'任务详情'});
      setStore('currentTitle','任务详情');
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
      .left-dropDown {
      .rightDropDown
    };
    .loading {
      position: absolute;
      top: 520px;
      left: 0;
      width: 100%;
      height: 50px;
      text-align: center;
    };
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
    .sweep-code-area {
      flex:1;
      overflow: auto;
      margin: 0 auto;
      width: 100%;
       .point-area {
        height: 75%;
        width: 80%;
        background: #fff;
        margin-left: 4%;
        margin-top: 20px;
        padding: 20px 10px 20px 20px;
        box-shadow: 0 2.5px 12px 4px #d1d1d1;
        border-radius: 8px;
        overflow: auto;
        box-sizing: border-box;
        color: #313131;
        font-weight: bold;
        letter-spacing: 2px;
        .task-start-point{
          margin-bottom: 20px;
          padding-left: 10px;
          font-size: 20px;
          p {
            margin-bottom: 30px
          }
          span {
            color: #585858;
          }
          ul {
             margin-top: 6px;
             li {
               line-height: 20px;
               margin-bottom: 40px
             }
          }
        }
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
