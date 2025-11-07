import { getDefaultTaskSchedulingState } from '@/common/js/resetStore'
export default {
  state: getDefaultTaskSchedulingState(),

  getters:{
    schedulingTaskAboutMessage: (state) => {
      return state.schedulingTaskAboutMessage
    },
    temporaryStorageCreateRepairsTaskMessage: (state) => {
      return state.temporaryStorageCreateRepairsTaskMessage
    }
  },

  mutations:{

    // 保存任务调度相关信息
     changeSchedulingTaskAboutMessage (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				state.schedulingTaskAboutMessage = payLoad
			}
    },

    // 保存暂存创建维修任务的信息
    changeTemporaryStorageCreateRepairsTaskMessage (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				state.temporaryStorageCreateRepairsTaskMessage = payLoad
			}
    },

    //重置taskScheduling状态
    resetTaskSchedulingState(state) {
      Object.assign(state, getDefaultTaskSchedulingState())
    }
  },
  
  actions:{
    resetTaskSchedulingStateEvent({ commit }) {
      commit('resetTaskSchedulingState')
    }
  }
}
