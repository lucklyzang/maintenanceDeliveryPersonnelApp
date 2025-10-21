import Vue from 'vue'

// 防重复点击
Vue.directive('preventReClick', {
  inserted (el, binding) {
    let openDalay = false;
    el.addEventListener('click', () => {
        if(openDalay) return;
        openDalay = !openDalay;
        setTimeout(() => {
          openDalay = !openDalay
        }, binding.value || 3000)
    })
  }
})