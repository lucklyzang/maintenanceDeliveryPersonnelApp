import { setStore, getStore, removeStore } from '@/common/js/utils'
import { getDefaultTransMedicalTaskState } from '@/common/js/resetStore.js'

export default {
  state: getDefaultTransMedicalTaskState(),
  getters:{
    transportantTaskMessage: (state) => {
      state.transportantTaskMessage = JSON.parse(getStore('transportantTaskMessage')) ? JSON.parse(getStore('transportantTaskMessage')) : null;
			return state.transportantTaskMessage
    },
    taskTranceMsg:  (state) => {
			state.taskTranceMsg = getStore('taskTranceMsg') ? getStore('taskTranceMsg') : '';
			return state.taskTranceMsg
		}
  },
  mutations:{
    // 改变运送任务信息状态
    changetransportTypeMessage (state,payLoad) {
      if (payLoad&& payLoad != 'null') {
				setStore('transportantTaskMessage', payLoad.DtMsg);
				state.transportantTaskMessage = payLoad.DtMsg
			}
    },
    // 改变任务跟踪信息的状态
    changeTaskTranceMsg (state,payLoad) {
      if (payLoad&& payLoad != 'null') {
				setStore('taskTranceMsg', payLoad);
				state.taskTranceMsg = payLoad
			}
    },
    //重置Medical信息的状态
		resetTransMedicalTaskState(state) {
      Object.assign(state, getDefaultTransMedicalTaskState())
    }
  },
  actions:{
    resetTransMedicalTaskStateEvent({ commit }) {
			commit('resetTransMedicalTaskState')
		}
  }
}
