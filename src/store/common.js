import { setStore, getStore } from '@/common/js/utils'
import { getDefaultCommonState } from '@/common/js/resetStore.js'
export default {	
	state: getDefaultCommonState(),
	getters: {
		statusBarHeight:(state) => {
			state.statusBarHeight = getStore('statusBarHeight') ? getStore('statusBarHeight') : 47;
			return state.statusBarHeight
		},
		navigationBarHeight:(state) => {
			state.navigationBarHeight = getStore('navigationBarHeight') ? getStore('navigationBarHeight') : 40;
			return state.navigationBarHeight
		},
		capsuleMessage:(state) => {
			state.capsuleMessage = getStore('capsuleMessage') ? getStore('capsuleMessage') : {};
			return state.capsuleMessage
		},
		allOrderCancelReason:(state) => {
			state.allOrderCancelReason = getStore('allOrderCancelReason') ? getStore('allOrderCancelReason') :  {
				cancelReason: {},
				environmentCancelReason: {},
				projectCancelReason: {},
				affairCancelReason: {}
			};
			return state.allOrderCancelReason
		},
		currentIndex:(state) => {
			state.currentIndex = getStore('currentIndex') ? getStore('currentIndex') : 0;
			return state.currentIndex
		},
		baseURL:(state) => {
			return state.baseURL
		}
	},
	mutations: {
		storeStatusBarHeight(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('statusBarHeight', playLoad);
				state.statusBarHeight = playLoad
			}
		},
		storeNavigationBarHeight(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('navigationBarHeight', playLoad);
				state.navigationBarHeight = playLoad
			}
		},
		storeCapsuleMessage(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('capsuleMessage', playLoad);
				state.capsuleMessage = playLoad
			}
		},
		storeAllOrderCancelReason (state,playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('allOrderCancelReason', playLoad);
				state.allOrderCancelReason = playLoad
			}
		},
		storeCurrentIndex (state,playLoad) {
			if (playLoad != 'null') {
				setStore('currentIndex', playLoad);
				state.currentIndex = playLoad
			}
		},
		//重置公共信息的状态
		resetCommonInfoState(state) {
				Object.assign(state, getDefaultCommonState())
		}
	},
	actions: {
		resetCommitState({ commit }) {
			commit('resetCommonInfoState')
		}
	}
}
