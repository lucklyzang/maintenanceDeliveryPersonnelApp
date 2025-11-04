import { setStore, getStore, removeStore } from '@/common/js/utils'
import { getDefaultTransTaskSchedulingState } from '@/common/js/resetStore.js'
export default {
  state: getDefaultTransTaskSchedulingState(),

  getters:{
    schedulingTaskType: (state) => {
      state.schedulingTaskType = JSON.parse(getStore('schedulingTaskType')) ? JSON.parse(getStore('schedulingTaskType')) : {};
			return state.schedulingTaskType
    },
    schedulingTaskDetails: (state) => {
      state.schedulingTaskDetails = JSON.parse(getStore('schedulingTaskDetails')) ? JSON.parse(getStore('schedulingTaskDetails')) : {};
			return state.schedulingTaskDetails
    },
    operateBtnClickRecord: (state) => {
      state.operateBtnClickRecord = JSON.parse(getStore('operateBtnClickRecord')) ? JSON.parse(getStore('operateBtnClickRecord')) : {
        allocationBtnClick: false,
        delayBtnClick: false,
        cancelBtnClick: false
      };
			return state.operateBtnClickRecord
    },
    temporaryStorageCreateDispathTaskMessage: (state) => {
      state.temporaryStorageCreateDispathTaskMessage = JSON.parse(getStore('temporaryStorageCreateDispathTaskMessage')) ? JSON.parse(getStore('temporaryStorageCreateDispathTaskMessage')) : {};
			return state.temporaryStorageCreateDispathTaskMessage
    },
    temporaryStorageCreateAppointTaskMessage: (state) => {
      state.temporaryStorageCreateAppointTaskMessage = JSON.parse(getStore('temporaryStorageCreateAppointTaskMessage')) ? JSON.parse(getStore('temporaryStorageCreateAppointTaskMessage')) : {};
			return state.temporaryStorageCreateAppointTaskMessage
    }
  },

  mutations:{

    // 保存任务调度切换类型
    changeSchedulingTaskType (state, payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('schedulingTaskType', payLoad);
				state.schedulingTaskType = payLoad
			}
    },

    // 保存任务调度详情
    changeSchedulingTaskDetails (state, payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('schedulingTaskDetails', payLoad);
				state.schedulingTaskDetails = payLoad
			}
    },

    // 保存操作按钮点击记录
    changeOperateBtnClickRecord (state, payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('operateBtnClickRecord', payLoad);
				state.operateBtnClickRecord = payLoad
			}
    },

    // 保存暂存创建调度任务的信息
    changeTemporaryStorageCreateDispathTaskMessage (state, payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('temporaryStorageCreateDispathTaskMessage', payLoad);
				state.temporaryStorageCreateDispathTaskMessage = payLoad
			}
    },

    // 保存暂存创建预约任务的信息
    changeTemporaryStorageCreateAppointTaskMessage (state, payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('temporaryStorageCreateAppointTaskMessage', payLoad);
				state.temporaryStorageCreateAppointTaskMessage = payLoad
			}
    },

    //重置TaskScheduling信息的状态
		resetTransTaskSchedulingState(state) {
      Object.assign(state, getDefaultTransTaskSchedulingState())
    }
  },
  
  actions:{
    resetTransTaskSchedulingStateEvent({ commit }) {
			commit('resetTransTaskSchedulingState')
		}
  }
}
