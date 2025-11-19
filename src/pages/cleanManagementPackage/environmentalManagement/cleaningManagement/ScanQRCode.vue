<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
       <van-nav-bar
        title="扫码"
        left-text="返回"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
      <template #right>
         <div class="photo-graph">
          <input
            name="uploadImg2"
            id="demo2"
            @change="previewFileTwo"
            type="file"
            accept="image/*,.camera"
            capture="camera"
          />拍照
        </div>
      </template>
    </van-nav-bar>
    </div>
    <div class="content">
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import {} from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC, compress } from "@/common/js/utils";
export default {
  name: "ScanQRCode",
  components: {
    NavBar,
  },
  data() {
    return {
      resultImgList: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/home"
        })
      })
    }
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea"]),
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
    ...mapMutations([]),
    onClickLeft() {
      this.$router.push({ path: "/cleanHome"})
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
          };
        },
        false
      );
      if (file) {
        reader.readAsDataURL(file);
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
        };
        .van-nav-bar__right {
          .photo-graph {
            position: relative;
            display: inline-block;
            height: 50px;
            overflow: hidden;
            color: #1965ff;
            text-decoration: none;
            text-indent: 0;
            line-height: 50px;
            input {
              position: absolute;
              font-size: 100px;
              right: 0;
              width: 100%;
              height: 100%;
              top: 0;
              opacity: 0;
            }
          }
        }
    }
  };
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
</style>