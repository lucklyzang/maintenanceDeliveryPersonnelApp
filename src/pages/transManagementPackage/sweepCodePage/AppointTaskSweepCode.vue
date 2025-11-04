<template>
   <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="loading">
      <loading :isShow="showLoadingHint" textContent="校验中,请稍候····" textColor="#2895ea"></loading>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import FooterBottom from '@/components/FooterBottom'
import {judgeAppointTaskCheckItem, judgeAppointTaskCheckPatient,judgeAppointTaskCheckDepartment} from '@/api/trans/workerPort.js'
import NoData from '@/components/NoData'
import Loading from '@/components/Loading'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore, IsPC, deepClone, repeArray } from '@/common/js/utils'
export default {
  name: 'appointTaskSweepCode',
  data () {
    return {
      leftDropdownDataList: ['退出登录'],
      leftDownShow: false,
      showLoadingHint: false,
      liIndex: null,
      departmentId: '',
      destinationList: [],
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
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.backTo()
      })
    };
    // 二维码回调方法绑定到window下面,提供给外部调用
    let me = this;
    window['scanQRcodeCallback'] = (code) => {
      me.scanQRcodeCallback(code);
    };
    window['scanQRcodeCallbackCanceled'] = () => {
      me.scanQRcodeCallbackCanceled();
    };
    // 调取扫码方法
    this.sweepAstoffice();
    console.log('信息校验',this.appointTaskMessage);
  },

  computed:{
    ...mapGetters([
      'userInfo',
      'navTopTitle',
      'appointTaskMessage',
      'completeSweepcodeDestinationInfo',
      'completeSweepcodeDepartureInfo',
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
    }
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeCompleteSweepcodeDestinationInfo',
      'changeCompleteSweepcodeDepartureInfo'
    ]),

    // 摄像头取消扫码后的回调
    scanQRcodeCallbackCanceled () {
      this.backTo()
    },
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

    // 摄像头扫码后的回调
    scanQRcodeCallback(code) {
      if (code) {
        // 判断校验类型
        if (this.checkType != 0) {
          let codeData = code.split('|');
          if (codeData.length > 0) {
            this.departmentId = codeData[0];
            let departmentNo = codeData[1];
            if (this.checkType == 1 || this.checkType == 3) {
              if (this.checkType == 1) {
                // 校验起始科室
                this.checkDepartmentVerify({
                  proId: this.proId, //项目ID
                  workerId: this.workerId, //运送员ID
                  taskId: this.taskId,   //任务ID
                  departmentNo: departmentNo,   //扫描科室编码
                  scanDepartment: this.checkType
                },this.checkType)
              };
              if (this.checkType == 3) {
                // 校验终点科室(起始科室放在最后)
                this.checkDepartmentVerify({
                  proId: this.proId, //项目ID
                  workerId: this.workerId, //运送员ID
                  taskId: this.taskId,   //任务ID
                  departmentNo: departmentNo,   //扫描科室编码
                  scanDepartment: 2
                },this.checkType)
              }
            } else {
              // 校验检查项科室
              try {
                this.checkItemVerify({
                  proId: this.proId, //项目ID
                  workerId: this.workerId, //运送员ID
                  itemId: this.checkId,   //检查项ID
                  departmentNo: departmentNo   //扫描科室编码
                })
              } catch (err) {
                this.$dialog.alert({
                  message: `${err}`
                }).then(() => {
                })
              }
            }
          }
        } else {
          let codeInfo = code.split('|');
          // 校验病人信息
           if (codeInfo.length > 0) {
            this.checkPatientVerify({
              proId: this.proId, //项目ID
              workerId: this.workerId, //运送员ID
              taskId: this.taskId,   //任务ID
              patient: codeInfo[1] //病人信息
            })
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

    // 校验检查项科室
    checkItemVerify(data) {
      this.showLoadingHint = true;
      judgeAppointTaskCheckItem(data).then((res) => {
        if (res && res.data.code == 200) {
          try {
            //存储已经扫码验证通过的科室所属检查项信息
            let temporaryOfficeList = [];
            let temporaryDepartmentId = [];
            temporaryOfficeList = deepClone(this.completeSweepcodeDestinationInfo);
            if (this.completeSweepcodeDestinationInfo.length > 0 ) {
              let temporaryIndex = this.completeSweepcodeDestinationInfo.indexOf(this.completeSweepcodeDestinationInfo.filter((item) => {return item.taskId == this.taskId})[0]);
              if (temporaryIndex != -1) {
                temporaryDepartmentId = temporaryOfficeList[temporaryIndex]['officeList'];
                temporaryDepartmentId.push(this.checkId);
                temporaryOfficeList[temporaryIndex]['officeList'] = repeArray(temporaryDepartmentId)
              } else {
                temporaryDepartmentId.push(this.checkId);
                temporaryOfficeList.push(
                  {
                    officeList: repeArray(temporaryDepartmentId),
                    taskId: this.taskId
                  }
                )
              }
            } else {
              temporaryDepartmentId.push(this.checkId);
              temporaryOfficeList.push(
                {
                  officeList: repeArray(temporaryDepartmentId),
                  taskId: this.taskId
                }
              )
            };
            this.changeCompleteSweepcodeDestinationInfo(temporaryOfficeList);
            setStore('completAppointTaskSweepCodeDestinationInfo', {"sweepCodeInfo": temporaryOfficeList});
            this.backTo()
          } catch (err) {
            this.$dialog.alert({
              message: `${err}`
            }).then(() => {
            })
          }
        } else {
          this.backTo();
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        };
        this.showLoadingHint = false
      })
      .catch((err) => {
        this.backTo();
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 校验起始科室
    checkDepartmentVerify (data,type) {
      this.showLoadingHint = true;
      judgeAppointTaskCheckDepartment(data).then((res) => {
        if (res && res.data.code == 200) {
          // 储存校验通过的起始科室信息
          if (type == 1) {
            this.$router.push({'path':'/appointTaskCustomerInfo'});
            this.changeTitleTxt({tit:'病人信息确认'});
            setStore('currentTitle','病人信息确认')
          };
          if (type == 3) {
            this.backTo()
          }
        } else {
          this.backTo();
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        };
        this.showLoadingHint = false
      })
      .catch((err) => {
        this.backTo();
        this.showLoadingHint = false;
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },


    // 校验病人信息
    checkPatientVerify (data) {
      this.showLoadingHint = true;
      judgeAppointTaskCheckPatient(data).then((res) => {
        if (res && res.data.code == 200) {
          this.backTo()
        } else {
          this.backTo();
          this.$dialog.alert({
            message: `${res.data.msg}`,
            closeOnPopstate: true
          }).then(() => {
          })
        };
        this.showLoadingHint = false
      })
      .catch((err) => {
        this.showLoadingHint = false;
        this.backTo();
        this.$dialog.alert({
          message: `${err.message}`,
          closeOnPopstate: true
        }).then(() => {
        })
      })
    },

    // 返回上一页
    backTo () {
      this.$router.push({'path':'/appointDetails'});
      this.changeTitleTxt({tit:'预约任务详情'});
      setStore('currentTitle','预约任务详情')
    },

    // 重新扫码弹窗
    againSweepCode () {
      this.sweepAstoffice()
    },

    // 扫描二维码方法
    sweepAstoffice () {
      window.android.scanQRcode()
    },

    // 扫码确认事件
    sweepCodeSure () {
      this.sweepAstoffice()
    },

    // 取消扫码事件
    cancelSweepCode () {
      this.backTo()
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
    font-size: 14px;
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
    .sweep-code-title {
      height: 30px;
      line-height: 30px;
      padding-left: 10px;
      h3 {
        font-size: 14px;
        color: #1699e8
      }
    }
  }
</style>
