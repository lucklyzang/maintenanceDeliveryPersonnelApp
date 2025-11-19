import { setStore, getStore, removeStore } from '@/common/js/utils'
import { getDefaultTransMedicalTaskState } from '@/common/js/resetStore.js'

export default {
  state: getDefaultTransMedicalTaskState(),
  getters:{
    transportantTaskMessage: (state) => {
			return state.transportantTaskMessage
    },
    taskTranceMsg:  (state) => {
			return state.taskTranceMsg
		}
  },
  mutations:{
    // 改变运送任务信息状态
    changetransportTypeMessage (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				state.transportantTaskMessage = payLoad.DtMsg
			}
    },
    // 改变任务跟踪信息的状态
    changeTaskTranceMsg (state,payLoad) {
      if (payLoad && payLoad != 'null') {
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
