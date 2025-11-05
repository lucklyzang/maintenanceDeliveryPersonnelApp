import { getDefaultTransCatchComponentsState } from '@/common/js/resetStore.js'
import { getStore, setStore } from '@/common/js/utils'
export default {
  state: getDefaultTransCatchComponentsState(),
  getters:{
    catch_components: (state) => {
      state.catch_components = JSON.parse(getStore('catch_components')) ? JSON.parse(getStore('catch_components')) : ['dispatchTask'];
			return state.catch_components
    }
  },
  mutations:{
    changeCatchComponent(state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('catch_components', payLoad);
				state.catch_components = payLoad
			}
    },
		resetTransCatchComponentsState(state) {
      Object.assign(state, getDefaultTransCatchComponentsState())
    }
  },
  actions:{
    resetTransCatchComponentsStateEvent({ commit }) {
			commit('resetTransCatchComponentsState')
		}
  }
}