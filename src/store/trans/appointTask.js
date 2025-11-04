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
      state.originalSignature = JSON.parse(getStore('originalSignature')) ? JSON.parse(getStore('originalSignature')) : {};
			return state.originalSignature
    },
    completeSweepcodeDestinationInfo: (state) => {
      state.completeSweepcodeDestinationInfo = JSON.parse(getStore('completeSweepcodeDestinationInfo')) ? JSON.parse(getStore('completeSweepcodeDestinationInfo')) : [];
			return state.completeSweepcodeDestinationInfo
    },
    completeSweepcodeDepartureInfo: (state) => {
      state.completeSweepcodeDepartureInfo = JSON.parse(getStore('completeSweepcodeDepartureInfo')) ? JSON.parse(getStore('completeSweepcodeDepartureInfo')) : [];
			return state.completeSweepcodeDepartureInfo
    },
    completeCheckedItemInfo: (state) => {
      state.completeCheckedItemInfo = JSON.parse(getStore('completeCheckedItemInfo')) ? JSON.parse(getStore('completeCheckedItemInfo')) : [];
			return state.completeCheckedItemInfo
    },
    isFreshAppointTaskPage:(state) => {
			state.isMedicalMan = getStore('isFreshAppointTaskPage') ? getStore('isFreshAppointTaskPage') === 'false' ? false : true : true;
			return state.isFreshAppointTaskPage
		}
  },
  mutations:{
    // 改变预约任务信息状态
    changeAppointTaskMessage (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('appointTaskMessage', payLoad.DtMsg);
				state.appointTaskMessage = payLoad.DtMsg
			}
    },
    // 改变转移人员列表状态
    changeAppointTaskTransferIdList (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('appointTaskTransferIdList', payLoad.DtMsg);
				state.appointTaskTransferIdList = payLoad.DtMsg
			}
    },
    // 改变原始签名状态
    changeOriginalSignature (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('originalSignature', playLoad);
				state.originalSignature = playLoad
			}
    },
    //改变完成扫码目的地信息的状态
    changeCompleteSweepcodeDestinationInfo (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('completeSweepcodeDestinationInfo', playLoad);
				state.completeSweepcodeDestinationInfo = playLoad
			}
    },
    //改变完成检查科室的信息状态
    changeCompleteCheckedItemInfo (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('completeCheckedItemInfo', playLoad);
				state.completeCheckedItemInfo = playLoad
			}
    },
    //改变完成扫码起始地信息的状态
    changeCompleteSweepcodeDepartureInfo(state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('completeSweepcodeDepartureInfo', playLoad);
				state.completeSweepcodeDepartureInfo = playLoad
			}
    },
    //改变是否刷新预约任务页的状态
    changeIsFreshAppointTaskPage (state,payLoad) {
      if (playLoad != 'null') {
				setStore('isFreshAppointTaskPage', playLoad);
				state.isFreshAppointTaskPage = playLoad
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