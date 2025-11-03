<template>
  <div class="tabBar-box">
    <van-tabbar route v-model="active" placeholder  @change="onChange" active-color="#1684FC" inactive-color="#333" :border="false" :safe-area-inset-bottom="true">
      <van-tabbar-item replace to="/home" icon="wap-home-o">
        首页
        <!-- <span>模块管理</span>
        <template #icon="props">
          <img :src="props.active ? icon.homeActive : icon.homeInactive" />
        </template> -->
      </van-tabbar-item>
      <van-tabbar-item replace to="/myInfo" icon="contact">
        个人中心
        <!-- <span>个人中心</span>
        <template #icon="props">
          <img :src="props.active ? icon.mineActive : icon.mineInactive" />
        </template> -->
      </van-tabbar-item>
    </van-tabbar>
  </div>  
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'FooterBottom',
  data () {
    return {
      active: 0,
      icon: {
        homeActive: require("@/common/images/home/index-current.png"),
        homeInactive: require("@/common/images/home/index.png"),
        mineActive: require("@/common/images/home/my-current.png"),
        mineInactive: require("@/common/images/home/my.png")
      }
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    ...mapMutations([
    ]),
    onChange(index) {
    }
  }
}

</script>
<style lang='less' scoped>
@import "../common/stylus/variable.less";
@import "../common/stylus/mixin.less";
.tabBar-box {
  /deep/ .van-tabbar {
    background: @color-background;
    z-index: 10000;
    .van-tabbar-item {
      background: @color-background;
      .van-tabbar-item__text {
        font-size: 10px !important;
        margin-top: 6px
      }
    } 
  }
}  
</style>