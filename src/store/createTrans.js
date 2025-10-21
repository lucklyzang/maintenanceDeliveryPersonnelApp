import { setCache, getCache } from '@/common/js/utils'
import { getDefaultTransState } from '@/common/js/resetStore.js'
export default {
 state: getDefaultTransState(),

  getters:{
		transTaskMessage:(state) => {
			state.transTaskMessage = getCache('transTaskMessage') ? getCache('transTaskMessage') : {};
			return state.transTaskMessage
		}
  },

  mutations:{
		// 保存运送任务的信息
		changeTransTaskMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('transTaskMessage', playLoad);
				state.transTaskMessage = playLoad
			}
		}
  },
  
  actions:{}
}
