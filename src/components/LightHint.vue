<template>
    <div class="light-hint" v-if="isShow">
		<img :src="type == 'success' ? passedPng : exclamationPointPng" alt="">
    <span>{{message}}</span>
    </div>
</template>
 
<script>
export default {
   name: 'LightHint',
  props: {
    type: {
      type: String,
      default: "success"
    },
    message: {
      type: String,
      default: ""
    },
    duration: {
      type: Number,
      default: 3000 //默认3000毫秒消失
    }
  },
  data() {
    return {
      exclamationPointPng: require("@/common/images/home/exclamation-point.png"),
      passedPng: require("@/common/images/home/passed.png"),
      isShow: false //是否显示标识
    };
  },
  methods: {
    show() {
      this.isShow = true;
      setTimeout(this.hide, this.duration);//设置时间自动消失
    },
    hide() {
      this.isShow = false;
      this.remove();//移除
    }
  }
};
</script>
<style lang="less" scoped>
 .light-hint {
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 180px;
    min-height: 48px;
    padding: 4px 10px; 
		box-sizing: border-box;
    position: fixed;
    z-index: 1000;
    bottom: 200px;
    left: 50%;
    transform: translateX(-50%);
    font-weight: bold;
    color: #101010;
    font-size: 14px;
		box-shadow: 0px 2px 6px 0px rgba(0,0,0,0.4);
    span {
      vertical-align: middle;
      margin-left: 10px;
			text-align: left;
			word-break: break-all;
    };
    img {
			flex-shrink: 0;
      vertical-align: middle;
      width: 24px;
      height: 24px
    }
  }
</style>