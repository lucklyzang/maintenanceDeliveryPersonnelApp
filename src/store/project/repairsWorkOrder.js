import { getDefaultRepairsWorkOrderState } from '@/common/js/resetStore'
import { setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  state: getDefaultRepairsWorkOrderState(),
  getters:{
    isFreshRepairsWorkOrderPage:(state) => {
			state.isFreshRepairsWorkOrderPage = getStore('isFreshRepairsWorkOrderPage') ? getStore('isFreshRepairsWorkOrderPage') === 'false' ? false : true : true;
			return state.isFreshRepairsWorkOrderPage
		},
    newProjectTaskName: (state) => {
			state.newProjectTaskName = JSON.parse(getStore('newTaskList')) ? JSON.parse(getStore('newTaskList'))['taskName'] : [];
			return state.newProjectTaskName
		},
    repairsWorkOrderMsg:  (state) => {
			state.repairsWorkOrderMsg = JSON.parse(getStore('repairsWorkOrderMsg')) ? JSON.parse(getStore('repairsWorkOrderMsg')) : {};
			return state.repairsWorkOrderMsg
		},
    completeRoomList: (state) => {
      state.completeRoomList = JSON.parse(getStore('completeRoomList')) ? JSON.parse(getStore('completeRoomList'))['sweepCodeInfo'] : [];
			return state.completeRoomList
    },
    isCompleteRepairsWorkOrderPhotoList: (state) => {
			return state.isCompleteRepairsWorkOrderPhotoList
    },
    isFillMaterialList: (state) => {
      state.isFillMaterialList = JSON.parse(getStore('isFillMaterialList')) ? JSON.parse(getStore('isFillMaterialList'))['number'] : [];
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
    // 改变新任务列表状态
    changeNewProjectTaskList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('newTaskList', {taskName: payLoad});
				state.newProjectTaskName = payLoad
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
				setStore('completeRoomList', {sweepCodeInfo: payLoad});
				state.completeRoomList = payLoad
			}
    },
    // 改变已完成上传图片的状态
    changeIsCompletePhotoList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				state.isCompleteRepairsWorkOrderPhotoList = payLoad
			}
    },
    // 改变是否填写耗材的状态
    changeisFillMaterialList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isFillMaterialList', {number: payLoad});
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