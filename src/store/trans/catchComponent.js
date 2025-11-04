import { getDefaultTransCatchComponentsState } from '@/common/js/resetStore.js'
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
      if (playLoad && playLoad != 'null') {
				setStore('catch_components', playLoad);
				state.catch_components = playLoad
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