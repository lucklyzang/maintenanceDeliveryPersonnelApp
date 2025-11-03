import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    // 任务调度类型
    schedulingTaskType: {},
    // 任务调度详情
    schedulingTaskDetails: {},
    //操作按钮点击记录
    operateBtnClickRecord: {
      allocationBtnClick: false,
      delayBtnClick: false,
      cancelBtnClick: false
    },
    // 暂存创建调度任务的信息
    temporaryStorageCreateDispathTaskMessage: {},
    // 暂存创建预约任务的信息
    temporaryStorageCreateAppointTaskMessage: {}
  },

  getters:{
    schedulingTaskType: (state) => {
      return state.schedulingTaskType
    },
    schedulingTaskDetails: (state) => {
      return state.schedulingTaskDetails
    },
    operateBtnClickRecord: (state) => {
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
      state.schedulingTaskType = payLoad
    },

    // 保存任务调度详情
    changeSchedulingTaskDetails (state, payLoad) {
      state.schedulingTaskDetails = payLoad
    },

    // 保存操作按钮点击记录
    changeOperateBtnClickRecord (state, payLoad) {
      state.operateBtnClickRecord = payLoad
    },

    // 保存暂存创建调度任务的信息
    changeTemporaryStorageCreateDispathTaskMessage (state, payLoad) {
      state.temporaryStorageCreateDispathTaskMessage = payLoad
    },

    // 保存暂存创建预约任务的信息
    changeTemporaryStorageCreateAppointTaskMessage (state, payLoad) {
      state.temporaryStorageCreateAppointTaskMessage = payLoad
    }
  },
  
  actions:{}
}
