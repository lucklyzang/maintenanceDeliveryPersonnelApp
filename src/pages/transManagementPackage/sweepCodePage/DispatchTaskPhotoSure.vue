<template>
   <div class="content-wrapper">
    <HeaderTop :title="navTopTitle">
      <!-- <van-icon name="arrow-left" slot="left" @click="backTo"></van-icon>  -->
      <!-- <van-icon name="manager-o" slot="right" @click="skipMyInfo"></van-icon>  -->
    </HeaderTop>
    <div class="sweep-code-area">
      <p>
        <img :src="upImgUrl" alt="">
      </p>
    </div>
    <div class="btn-area">
      <span>
        <img :src="taskSurePng" alt=""  @click="submitPhoto">
      </span>
    </div>
  </div>
</template>

<script>
import HeaderTop from '@/components/HeaderTop'
import { mapGetters, mapMutations } from 'vuex'
import { setStore, getStore,  IsPC } from '@/common/js/utils'
export default {
  name: 'dispatchTaskPhotoSure',
  data () {
    return {
      upImgUrl: require('@/common/images/home/no-data-default.png'),
      taskSurePng: require('@/components/images/task-sure.png')
    };
  },

  components:{
    HeaderTop
  },

  mounted () {
    // 控制设备物理返回按键测试
    if (!IsPC()) {
      let that = this;
      pushHistory();
      that.gotoURL(() => {
        pushHistory();
        this.$router.push({'path':'/dispatchTaskSweepCode'});
        this.changeTitleTxt({tit:'扫码'});
        setStore('currentTitle','扫码')
      })
    };
    this.echoPhoto()
  },

  computed:{
    ...mapGetters([
      'isCompletePhotoList',
      'navTopTitle',
      'dispatchTaskMessage'
    ]),
    proId () {
      return JSON.parse(getStore('userInfo')).extendData.proId
    },
    userId () {
      return JSON.parse(getStore('userInfo')).id
    },
    proName () {
      return JSON.parse(getStore('userInfo')).extendData.proName
    },
    taskId () {
      return this.dispatchTaskMessage.id
    }
  },

  beforeRouteLeave(to, from, next) {
    if (to.name == 'dispatchTaskSweepCode'){
      this.changeIsCallDispatchSweepcodeMethod(false)
    };
    next()
  },

  methods:{
    ...mapMutations([
      'changeTitleTxt',
      'changeIsCallDispatchSweepcodeMethod'
    ]),

    // 回显照片
    echoPhoto () {
      if (this.isCompletePhotoList.length == 0) { return };
      let echoIndex = this.isCompletePhotoList.indexOf(this.isCompletePhotoList.filter((item) => {return item.taskId == this.taskId})[0]);
      if (echoIndex == -1) { return };
      this.upImgUrl = this.isCompletePhotoList[echoIndex]['phototList'][this.isCompletePhotoList[echoIndex]['phototList'].length-1]
    },

    // 提交图片
    submitPhoto () {
      this.$router.push({'path':'/DispatchTaskSweepCode'});
      this.changeTitleTxt({tit:'扫码'});
      setStore('currentTitle','扫码')
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
    font-size: 14px;
    .sweep-code-area {
      padding-top: 10px;
      width: 100%;
      flex: 1;
      overflow: auto;
      p {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%
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
