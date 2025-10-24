import { setCache, getCache } from '@/common/js/utils'
import { getDefaultEnvironmentState } from '@/common/js/resetStore.js'
export default {
	state: getDefaultEnvironmentState(),
	getters:{
			locationMessage:(state) => {
				state.locationMessage = JSON.parse(getCache('locationMessage')) ? JSON.parse(getCache('locationMessage')) : [];
				return state.locationMessage
			},
			timeMessage: (state) => {
				state.timeMessage = JSON.parse(getCache('timeMessage')) ? JSON.parse(getCache('timeMessage')) : null;
				return state.timeMessage
			},
			ossMessage:(state) => {
				state.ossMessage = JSON.parse(getCache('ossMessage')) ? JSON.parse(getCache('ossMessage')) : null;
				return state.ossMessage
			},
			environmentTaskMessage:(state) => {
				state.environmentTaskMessage = JSON.parse(getCache('environmentTaskMessage')) ? JSON.parse(getCache('environmentTaskMessage')) : null;
				return state.environmentTaskMessage
			}
	},

	mutations:{
		// 保存环境任务添加的位置信息
		storeLocationMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('locationMessage', playLoad);
				state.locationMessage = playLoad
			}
		},
		//保存阿里云签名信息
		changeOssMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('ossMessage', playLoad);
				state.ossMessage = playLoad
			}
		},
		//保存阿里云签名过期日期
		changeTimeMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('timeMessage', playLoad);
				state.timeMessage = playLoad
			}
		},
		//保存环境订单详情
		changeEnvironmentTaskMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setCache('environmentTaskMessage', playLoad);
				state.environmentTaskMessage = playLoad
			}
		},
		//重置环境管理信息的状态
		resetEnvironmentInfoState(state) {
			Object.assign(state, getDefaultEnvironmentState())
		}
	},
  
	actions:{
		resetEnvironmentState({ commit }) {
			commit('resetEnvironmentInfoState')
		}
	}
}
