<template>
  <div id="app">
     <transition :name="transitionName" mode="out-in">
      <keep-alive :include="catch_components">
        <router-view class="child-view"></router-view>
      </keep-alive>
    </transition>
  </div>
</template>
<script>
	import {
		mapGetters
	} from 'vuex'
  export default {
    data () {
      return {
        transitionName: ''
      }
    },
    computed: {
      ...mapGetters([
        'catch_components',
      ]),
      cachedRoutes() {
        return this.$route.matched.filter(r => r.meta && r.meta.keepAlive).map(r => r.name) // 获取需要缓存的路由名称数组
      }
    },
    mounted () {},

    methods: {
    },

    watch: {
      '$route' (to, from) {
        // if (to.name == 'home' && from.name == 'myInfo') {
        //   this.transitionName = '';
        //   return
        // };
        // if (to.name == 'myInfo' && from.name == 'home') {
        //   this.transitionName = '';
        //   return
        // };
        const toDepth = to.meta.index;
        const fromDepth = from.meta.index;
        if (toDepth > fromDepth) {
          this.transitionName = 'slide-right'
        } else if (toDepth < fromDepth) {
          this.transitionName = 'slide-left'
        } else {
          this.transitionName = ''
        }
      }
    }
  };
  //App接口
  window['setAppInfo'] =function (uid,os) {
    window.os=os
    window.uid=uid
  }
  //H5接口
  window.addEventListener('message',function(event){
    let data = event.data
    if(data.os !== undefined){
      window.os=data.os
      window.uid=data.uid
    }
  },false)
</script>
<style lang="less" scoped>
 html,body{
      height: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
      touch-action: none;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
  };
  #app {
      height: 100vh;
      overflow-y: hidden;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      position: relative;
  };
  .slide-right-leave-active,
  .slide-left-enter,
  .slide-right-enter,
  .slide-left-leave-active {
    width: 100%
  }
  .slide-left-enter, .slide-right-leave-active {
    opacity: 0;
    transition: all 0.4s ease;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
  .slide-left-leave-active, .slide-right-enter {
    opacity: 0;
    transition: all 0.4s ease;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
  .slide-right-enter, .slide-left-leave-active {
    opacity: 0;
    transition: all 0.4s ease;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
  }
  .slide-right-leave-active, .slide-left-enter {
    opacity: 0;
    transition: all 0.5s ease;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
  }
</style>
