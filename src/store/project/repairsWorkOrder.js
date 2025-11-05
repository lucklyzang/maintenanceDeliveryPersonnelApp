import { getDefaultRepairsWorkOrderState } from '@/common/js/resetStore'
import { setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  state: getDefaultRepairsWorkOrderState(),
  getters:{
    isFreshRepairsWorkOrderPage:(state) => {
			state.isFreshRepairsWorkOrderPage = getStore('isFreshRepairsWorkOrderPage') ? getStore('isFreshRepairsWorkOrderPage') === 'false' ? false : true : true;
			return state.isFreshRepairsWorkOrderPage
		},
    repairsWorkOrderMsg:  (state) => {
			state.repairsWorkOrderMsg = getStore('repairsWorkOrderMsg') ? getStore('repairsWorkOrderMsg') : '';
			return state.repairsWorkOrderMsg
		},
    completeRoomList: (state) => {
      state.completeRoomList = JSON.parse(getStore('completeRoomList')) ? JSON.parse(getStore('completeRoomList')) : [];
			return state.completeRoomList
    },
    isCompleteRepairsWorkOrderPhotoList: (state) => {
      state.isCompleteRepairsWorkOrderPhotoList = JSON.parse(getStore('isCompleteRepairsWorkOrderPhotoList')) ? JSON.parse(getStore('isCompleteRepairsWorkOrderPhotoList')) : [];
			return state.isCompleteRepairsWorkOrderPhotoList
    },
    isFillMaterialList: (state) => {
      state.isFillMaterialList = JSON.parse(getStore('isFillMaterialList')) ? JSON.parse(getStore('isFillMaterialList')) : [];
			return state.isFillMaterialList
    }
  },
  mutations:{
    // 改变是否刷新任务首页的状态
    changeIsFreshRepairsWorkOrderPage (state, payLoad) {
      if ( payLoad != 'null') {
				setStore('isFreshRepairsWorkOrderPage', payLoad);
				state.isFreshRepairsWorkOrderPage = payLoad
			}
    },
    // 改变任务信息的状态
    changeRepairsWorkOrderMsg (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('repairsWorkOrderMsg', payLoad);
				state.repairsWorkOrderMsg = payLoad
			}
    },
    // 改变完成房间检修的状态
    changeCompleteRoomList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('completeRoomList', payLoad);
				state.completeRoomList = payLoad
			}
    },
    // 改变已完成上传图片的状态
    changeIsCompletePhotoList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isCompleteRepairsWorkOrderPhotoList', payLoad);
				state.isCompleteRepairsWorkOrderPhotoList = payLoad
			}
    },
    // 改变是否填写耗材的状态
    changeisFillMaterialList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isFillMaterialList', payLoad);
				state.isFillMaterialList = payLoad
			}
    },
    //重置repairsWorkOrder状态
    resetRepairsWorkOrderState(state) {
      Object.assign(state, getDefaultRepairsWorkOrderState())
    }
  },
  actions:{
    resetRepairsWorkOrderStateEvent({ commit }) {
      commit('resetRepairsWorkOrderState')
    }
  }
}