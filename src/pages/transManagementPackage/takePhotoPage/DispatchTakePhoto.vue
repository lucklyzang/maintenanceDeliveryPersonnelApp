<template>
  <div class="content-wrapper">
    <!-- 顶部导航栏 -->
    <HeaderTop :title="navTopTitle">
      <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>
    </HeaderTop>
    <div class="photo-title">
      <div class="uploadPhoto" @click="uploadPhoto">上传照片</div>
      <div class="choose-photo">
        <input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/camera"/>拍照
      </div>
    </div>
    <div class="photo-list">
      <ul class="photo-list-wrapper">
        <li v-for="(item,index) in issueImageList" :key="`${item}-${index}`">
          <img width="100" height="130" :src="item.imgUrl"/>
          <span class="checkbox">
            <van-checkbox v-model="item.check"></van-checkbox>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import HeaderTop from '@/components/HeaderTop'
  import { mapGetters, mapMutations } from 'vuex'
  import { setStore,  IsPC, compress } from '@/common/js/utils'
  export default {
    name: 'dispatchTakePhoto',
    data () {
      return {
        issueImageList: []
      }
    },
    components: {
      HeaderTop
    },
    mounted () {
      // 控制设备物理按键返回
      if (!IsPC()) {
        let that = this;
        pushHistory();
        that.gotoURL(() => {
          pushHistory();
          that.backTo()
        })
      };
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
        'catch_components'
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
    methods: {
      ...mapMutations([
          'changeTitleTxt'
      ]),
      // 返回上一页
      backTo () {
        this.$router.push({path:'/dispatchDetails'});
        this.changeTitleTxt({tit:'任务详情'});
        setStore('currentTitle','任务详情')
      },

      // 上传照片
      uploadPhoto () {
        console.log(this.issueImageList)
      },

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
            _this.issueImageList.push({check:false,imgUrl:src})
          }
        }, false);
        if (file) {
          reader.readAsDataURL(file);
        };
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
    .photo-title {
      width: 95%;
      padding: 4px 0;
      margin: 0 auto;
      > div {
        display: inline-block;
        width: 100px
      };
      .uploadPhoto {
        padding: 8px 10px;
        height: 20px;
        line-height: 20px;
        vertical-align: top;
        background: #2895ea;
        border-radius: 4px;
        text-align: center;
        color: #fff;
      };
      .choose-photo {
        padding: 8px 10px;
        height: 20px;
        line-height: 20px;
        position: relative;
        cursor: pointer;
        color: #888;
        background: #fafafa;
        border: 1px solid #ddd;
        text-align: center;
        border-radius: 4px;
        overflow: hidden;
        display: inline-block;
        *display: inline;
        *zoom: 1;
        input {
          position: absolute;
          font-size: 100px;
          right: 0;
          top: 0;
          opacity: 0;
          filter: alpha(opacity=0);
          cursor: pointer
        }
      };
    }
    .photo-list {
      width: 98%;
      padding: 6px 0;
      box-sizing: border-box;
      flex: 1;
      margin: 0 auto;
      border: 1px solid #d0d0d0;
      overflow: auto;
      .photo-list-wrapper {
        width: 98%;
        height: 100%;
        margin: 0 auto;
        li {
          display: inline-block;
          width: 48%;
          height: 100px;
          margin-bottom: 8px;
          margin-right: 4%;
          position: relative;
          &:nth-child(even) {
            margin-right: 0
          };
          img {
            width: 100%;
            height: 100%
          };
          .checkbox {
            width: 20px;
            height: 20px;
            display: inline-block;
            position: absolute;
            top:2px;
            right:2px
          }
        }
      }
    }
  }
</style>
