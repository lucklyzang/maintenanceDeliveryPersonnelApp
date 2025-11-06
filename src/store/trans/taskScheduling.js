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
			return state.temporaryStorageCreateDispathTaskMessage
    },
    temporaryStorageCreateAppointTaskMessage: (state) => {
			return state.temporaryStorageCreateAppointTaskMessage
    }
  },

  mutations:{

    // 保存任务调度切换类型
    changeSchedulingTaskType (state, payLoad) {
      if (payLoad&& payLoad != 'null') {
				setStore('schedulingTaskType', payLoad);
				state.schedulingTaskType = payLoad
			}
    },

    // 保存任务调度详情
    changeSchedulingTaskDetails (state, payLoad) {
      if (payLoad&& payLoad != 'null') {
				state.schedulingTaskDetails = payLoad
			}
    },

    // 保存操作按钮点击记录
    changeOperateBtnClickRecord (state, payLoad) {
      if (payLoad&& payLoad != 'null') {
				setStore('operateBtnClickRecord', payLoad);
				state.operateBtnClickRecord = payLoad
			}
    },

    // 保存暂存创建调度任务的信息
    changeTemporaryStorageCreateDispathTaskMessage (state, payLoad) {
      if (payLoad&& payLoad != 'null') {
				state.temporaryStorageCreateDispathTaskMessage = payLoad
			}
    },

    // 保存暂存创建预约任务的信息
    changeTemporaryStorageCreateAppointTaskMessage (state, payLoad) {
      if (payLoad&& payLoad != 'null') {
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
