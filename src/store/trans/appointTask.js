import { setStore, getStore, removeStore } from '@/common/js/utils'
import { getDefaultTransAppointTaskState } from '@/common/js/resetStore.js'

export default {
  state: getDefaultTransAppointTaskState(),
  getters:{
    appointTaskMessage: (state) => {
      state.appointTaskMessage = JSON.parse(getStore('appointTaskMessage')) ? JSON.parse(getStore('appointTaskMessage')) : {};
			return state.appointTaskMessage
    },
    appointTaskTransferIdList: (state) => {
      state.appointTaskTransferIdList = JSON.parse(getStore('appointTaskTransferIdList')) ? JSON.parse(getStore('appointTaskTransferIdList')) : [];
			return state.appointTaskTransferIdList
    },
    originalSignature: (state) => {
      state.originalSignature = getStore('originalSignature') ? getStore('originalSignature') : '';
			return state.originalSignature
    },
    completeSweepcodeDestinationInfo: (state) => {
      state.completeSweepcodeDestinationInfo = JSON.parse(getStore('completAppointTaskSweepCodeDestinationInfo')) ? JSON.parse(getStore('completAppointTaskSweepCodeDestinationInfo'))['sweepCodeInfo'] : [];
			return state.completeSweepcodeDestinationInfo
    },
    completeSweepcodeDepartureInfo: (state) => {
      state.completeSweepcodeDepartureInfo = JSON.parse(getStore('completAppointTaskSweepCodeDepartureInfo')) ? JSON.parse(getStore('completAppointTaskSweepCodeDepartureInfo'))['sweepCodeInfo'] : [];
			return state.completeSweepcodeDepartureInfo
    },
    completeCheckedItemInfo: (state) => {
      state.completeCheckedItemInfo = JSON.parse(getStore('completAppointTaskCheckedItemInfo')) ? JSON.parse(getStore('completAppointTaskCheckedItemInfo'))['sweepCodeInfo'] : [];
			return state.completeCheckedItemInfo
    },
    isFreshAppointTaskPage:(state) => {
			state.isFreshAppointTaskPage = getStore('isFreshAppointTaskPage') ? getStore('isFreshAppointTaskPage') === 'false' ? false : true : true;
			return state.isFreshAppointTaskPage
		}
  },
  mutations:{
    // 改变预约任务信息状态
    changeAppointTaskMessage (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('appointTaskMessage', payLoad.DtMsg);
				state.appointTaskMessage = payLoad.DtMsg
			}
    },
    // 改变转移人员列表状态
    changeAppointTaskTransferIdList (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('appointTaskTransferIdList', payLoad.DtMsg);
				state.appointTaskTransferIdList = payLoad.DtMsg
			}
    },
    // 改变原始签名状态
    changeOriginalSignature (state,payLoad) {
				setStore('originalSignature', payLoad);
				state.originalSignature = payLoad
    },
    //改变完成扫码目的地信息的状态
    changeCompleteSweepcodeDestinationInfo (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('completAppointTaskSweepCodeDestinationInfo', {"sweepCodeInfo": payLoad});
				state.completeSweepcodeDestinationInfo = payLoad
			}
    },
    //改变完成检查科室的信息状态
    changeCompleteCheckedItemInfo (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('completAppointTaskCheckedItemInfo', {"sweepCodeInfo": payLoad});
				state.completeCheckedItemInfo = payLoad
			}
    },
    //改变完成扫码起始地信息的状态
    changeCompleteSweepcodeDepartureInfo(state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('completAppointTaskSweepCodeDepartureInfo', {"sweepCodeInfo": payLoad});
				state.completeSweepcodeDepartureInfo = payLoad
			}
    },
    //改变是否刷新预约任务页的状态
    changeIsFreshAppointTaskPage (state,payLoad) {
      if (payLoad != 'null') {
				setStore('isFreshAppointTaskPage', payLoad);
				state.isFreshAppointTaskPage = payLoad
			}
    },
    //重置预约任务信息的状态
		resetTransAppointTaskState(state) {
      Object.assign(state, getDefaultTransAppointTaskState())
    }
  },
  actions:{
    resetTransAppointTaskStateEvent({ commit }) {
			commit('resetTransAppointTaskState')
		}
  }
}