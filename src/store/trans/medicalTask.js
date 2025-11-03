import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    transportantTaskMessage: null,
    taskTranceMsg: '',
    // 判断模板类型
    templateType: ''
  },
  getters:{
    transportantTaskMessage: state => state.transportantTaskMessage,
    taskTranceMsg: state => state.taskTranceMsg,
    templateType: state => state.templateType
  },
  mutations:{
    // 改变运送任务信息状态
    changetransportTypeMessage (state,payLoad) {
      state.transportantTaskMessage = payLoad.DtMsg
    },
    // 改变任务跟踪信息的状态
    changeTaskTranceMsg (state,payLoad) {
      state.taskTranceMsg = payLoad
    },
    // 修改模板状态
    changeTemplateType(state, playLoad) {
      state.templateType = playLoad
    }
  },
  actions:{}
}
