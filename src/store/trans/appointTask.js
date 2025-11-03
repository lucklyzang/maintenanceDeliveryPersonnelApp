import { setStore, getStore, removeStore } from '@/common/js/utils'

export default {
  state:{
    appointTaskMessage: null,
    appointTaskTransferIdList: [],
    isFreshAppointTaskPage: true,
    originalSignature: null,
    completeSweepcodeDestinationInfo: [],
    completeSweepcodeDepartureInfo: [],
    completeCheckedItemInfo: []
  },
  getters:{
    appointTaskMessage: state => state.appointTaskMessage,
    appointTaskTransferIdList: state => state.appointTaskTransferIdList,
    originalSignature: state => state.originalSignature,
    isAppointTaskFirstSweepCode: state => state.isAppointTaskFirstSweepCode,
    completeSweepcodeDestinationInfo: state => state.completeSweepcodeDestinationInfo,
    completeSweepcodeDepartureInfo: state => state.completeSweepcodeDepartureInfo,
    completeCheckedItemInfo: state => state.completeCheckedItemInfo,
    isFreshAppointTaskPage: state => state.isFreshAppointTaskPage
  },
  mutations:{
    // 改变预约任务信息状态
    changeAppointTaskMessage (state,payLoad) {
      state.appointTaskMessage = payLoad.DtMsg
    },
    // 改变转移人员列表状态
    changeAppointTaskTransferIdList (state,payLoad) {
      state.appointTaskTransferIdList = payLoad.DtMsg
    },
    // 改变原始签名状态
    changeOriginalSignature (state,payLoad) {
      state.originalSignature = payLoad
    },
    //改变完成扫码目的地信息的状态
    changeCompleteSweepcodeDestinationInfo (state,payLoad) {
      state.completeSweepcodeDestinationInfo = payLoad
    },
    //改变完成检查科室的信息状态
    changeCompleteCheckedItemInfo (state,payLoad) {
      state.completeCheckedItemInfo = payLoad
    },
    //改变完成扫码起始地信息的状态
     changeCompleteSweepcodeDepartureInfo(state,payLoad) {
      state.completeSweepcodeDepartureInfo = payLoad
    },
    //改变是否刷新预约任务页的状态
    changeIsFreshAppointTaskPage (state,payLoad) {
      state.isFreshAppointTaskPage = payLoad
    }
  },
  actions:{}
}