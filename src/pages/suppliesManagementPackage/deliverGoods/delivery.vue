<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="送达" left-text="返回" left-arrow @click-left="onClickLeft"  :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-box">
            <div class="signature-box">
                <div class="signature-title">
                    <span>*</span>
                    <span>请在下方签字区域内手写签字</span>
                </div>
                <div class="signature-content" ref="contentTop">
                    <ElectronicSignature ref="mychild"></ElectronicSignature>
                </div>
            </div>
            <div class="photograph-box">
                <div class="photograph-title">
                    <span>拍照</span>
                    <span>（最多上传5张）</span>
                </div>
                <div class="result-picture">
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
            </div>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn-left" @click="quitEvent">
            <span>取消</span>
        </div>
        <div class="btn-right" @click="submitEvent">
            <span>提交</span>
        </div>
    </div>
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
     <van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" 
      confirm-button-color="#218FFF" show-cancel-button
      @confirm="sureDeleteEvent"
      >
    </van-dialog>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import ElectronicSignature from '@/components/ElectronicSignature'
import { compress, base64ImgtoFile } from "@/common/js/utils";
export default {
  name: "suppliesDelivery",
  components: {
    NavBar,
    ElectronicSignature
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      photoBox: false,
      deleteInfoDialogShow: false,
      imgIndex: '',
      resultImgList: [],
      imgOnlinePathArr: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/suppliesDeliverGoodsList');
  },

  beforeRouteEnter(to, from, next) {
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","currentElectronicSignature","originalSignature"]),
    userName() {
      return this.userInfo['worker']['name']
    },
    workerId() {
      return this.userInfo['worker']['id']
    },
    proName () {
      return this.chooseHospitalArea['span']
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
    ...mapMutations([]),

    onClickLeft () {
        this.$router.push({path: '/suppliesDeliverGoodsList'})
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

    // 签名重写
    rewrite () {
        this.$refs.mychild.overwrite()
    },

    // 签名取消
    cancel () {
        this.$refs.mychild.overwrite();
    },

    // 确认
    sure () {
    this.$refs.mychild.commitSure();
    if (this.currentElectronicSignature == this.originalSignature || !this.currentElectronicSignature) {
        return
    };
    this.$refs.contentTop.style.zIndex = 0;
    this.loadinText = '上传中,请稍等···';
    this.showLoadingHint = true;
    this.overlayShow = true;
    if (!this.isSingleDepartmentSignature) {
        submitDepartMentServiceSignInfo({
        taskId: this.taskId,
        imgType: 0,
        imgOrsign: this.currentElectronicSignature
        }).then((res) => {
            this.showLoadingHint = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
            this.updateTaskComplete(this.proId, this.taskId)
            } else {
            this.$toast(`${res.data.msg}`)
            }
        })
        .catch((err) => {
            this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
            }).then(() => {
            });
            this.showLoadingHint = false;
            this.overlayShow = false
        })
    } else {
        submitSingleDepartMentServiceSignInfo({
        proId: this.proId, //项目ID
        taskId: this.taskId, //任务id
        depId: this.currentDepartmentId, //部门ID
        depNo: this.departmentServiceOfficeId, //部门编号
        imgSign: this.currentElectronicSignature // 签名信息
        }).then((res) => {
            this.showLoadingHint = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
            this.$toast(`${res.data.data}`);
            this.backTo()
            } else {
            this.$toast(`${res.data.msg}`)
            }
        })
        .catch((err) => {
            this.$dialog.alert({
            message: `${err.message}`,
            closeOnPopstate: true
            }).then(() => {
            });
            this.showLoadingHint = false;
            this.overlayShow = false
        })
    }
    },

    // 退出事件
    quitEvent() {
      this.$router.push({path: '/suppliesDeliverGoodsList'});
    },

    // 提交事件
    submitEvent() {
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
  .choose-photo-box {
    position: fixed;
    margin: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 100000;
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
  };
  .nav {
    width: 100%;
    background: #3B9DF9;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        };
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
    .content-box {
        flex: 1;
        box-sizing: border-box;
        background: #F5F5F5;
        display: flex;
        flex-direction: column;
        padding: 0px 6px 20px 6px;
        .signature-box {
            height: 300px;
            display: flex;
            flex-direction: column;
            .signature-title {
                height: 40px;
                display: flex;
                align-items: center;
                >span {
                    color: #777575;
                    font-size: 14px;
                    &:nth-child(1) {
                        color: red !important;
                    }
                }
            };
            /deep/ .signature-content {
                flex: 1;
                overflow: auto;
                .signatureBox {
                    border: none !important;
                    width: 100% !important;
                }
            }
        };
        .photograph-box {
            margin-top: 10px;
            flex: 1;
            height: 0;
            display: flex;
            flex-direction: column;
            .photograph-title {
                height: 40px;
                display: flex;
                align-items: center;
                >span {
                    color: #777575;
                    font-size: 14px;
                    &:nth-child(2) {
                        font-size: 10px !important;
                        margin-left: 4px;
                    }
                }
            };
            .result-picture {
                margin-bottom: 6px;
                flex: 1;
                overflow: auto;
                >div {
                    &:nth-child(1) {
                        display: flex;
                        flex-wrap: wrap;
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
                            };
                            &:last-child {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                background: #fff;
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
        }
    }
  };
   .btn-box {
        height: 60px;
        padding: 0 14px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        background: #F5F5F5;
        .btn-left {
            width: 20%;
            height: 32px;
            border: 1px solid #BBBBBB;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            margin-right: 100px;
            >span {
            font-size: 12px;
            color: #BBBBBB;
            }
        };
        .btn-right {
            width: 25%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background: #3B9DF9;
            >span {
                font-size: 12px;
                color: #fff;
            }
        }
    }
}
</style>