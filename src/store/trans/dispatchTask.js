import { setStore, getStore, removeStore } from '@/common/js/utils'
import { getDefaultTransDispatchTaskState } from '@/common/js/resetStore.js'
export default {
  state: getDefaultTransDispatchTaskState(),
  getters:{
    navTopTitle:  (state) => {
			state.navTopTitle = getStore('currentTitle') ? getStore('currentTitle') : '中央运送';
			return state.navTopTitle
		},
    dispatchTaskMessage: (state) => {
      state.dispatchTaskMessage = JSON.parse(getStore('currentDispatchTaskMessage')) ? JSON.parse(getStore('currentDispatchTaskMessage')) : null;
			return state.dispatchTaskMessage
    },
    dispatchTaskTransferIdList: (state) => {
      state.dispatchTaskTransferIdList = JSON.parse(getStore('dispatchTaskTransferIdList')) ? JSON.parse(getStore('dispatchTaskTransferIdList')) : [];
			return state.dispatchTaskTransferIdList
    },
    dispatchTaskCancelIdList: (state) => {
      state.dispatchTaskCancelIdList = JSON.parse(getStore('dispatchTaskCancelIdList')) ? JSON.parse(getStore('dispatchTaskCancelIdList')) : [];
			return state.dispatchTaskCancelIdList
    },
    dispatchTaskState:  (state) => {
			state.dispatchTaskState = getStore('dispatchTaskState') ? getStore('dispatchTaskState') : '';
			return state.dispatchTaskState
		},
    dispatchTaskDepartmentType:  (state) => {
			state.dispatchTaskDepartmentType = getStore('dispatchTaskDepartmentType') ? getStore('dispatchTaskDepartmentType') : '';
			return state.dispatchTaskDepartmentType
		},
    isCoerceTakePhoto: (state) => {
      state.isCoerceTakePhoto = getStore('isCoerceTakePhoto') ? getStore('isCoerceTakePhoto') === 'false' ? false : true : false;
			return state.isCoerceTakePhoto
    },
    isCompleteSweepCode: (state) => {
      state.isCompleteSweepCode = JSON.parse(getStore('completeDispatchSweepCodeInfo')) ? JSON.parse(getStore('completeDispatchSweepCodeInfo'))['sweepCodeInfo'] : [];
			return state.isCompleteSweepCode
    },
    isDispatchTaskFirstSweepCode: (state) => {
      state.isDispatchTaskFirstSweepCode = getStore('isDispatchFirstSweepCode') ? getStore('isDispatchFirstSweepCode') === 'false' ? false : true : true;
			return state.isDispatchTaskFirstSweepCode
    },
    isCompletePhotoList: (state) => {
			return state.isCompletePhotoList
    },
    isBack: (state) => {
			state.isBack = getStore('isBack') ? getStore('isBack') : '';
			return state.isBack
		},
    isSign: (state) => {
			state.isSign = getStore('isSign') ? getStore('isSign') : '';
			return state.isSign
		},
    dispatchTaskId: (state) => {
			state.dispatchTaskId = getStore('dispatchTaskId') ? getStore('dispatchTaskId') : '';
			return state.dispatchTaskId
		},
    isSingleDestination: (state) => {
			state.isSingleDestination = getStore('isSingleDestination') ? getStore('isSingleDestination') : '';
			return state.isSingleDestination
		},
    showEndTaskBtn: (state) => {
      state.showEndTaskBtn = getStore('showEndTaskBtn') ? getStore('showEndTaskBtn') === 'false' ? false : true : false;
			return state.showEndTaskBtn
    },
    isCompleteSweepCodeDestinationList: (state) => {
      state.isCompleteSweepCodeDestinationList = JSON.parse(getStore('completeDispatchSweepCodeDestinationInfo')) ? JSON.parse(getStore('completeDispatchSweepCodeDestinationInfo'))['sweepCodeInfo'] : [];
			return state.isCompleteSweepCodeDestinationList
    },
    isFreshDispatchTaskPage: (state) => {
      state.isFreshDispatchTaskPage = getStore('isFreshDispatchTaskPage') ? getStore('isFreshDispatchTaskPage') === 'false' ? false : true : true;
			return state.isFreshDispatchTaskPage
    },
    currentDepartmentNumber: (state) => {
      state.currentDepartmentNumber = JSON.parse(getStore('completDepartmentNumber')) ? JSON.parse(getStore('completDepartmentNumber'))['number'] : [];
			return state.currentDepartmentNumber
    },
    photoAreaBoxShow: (state) => {
      state.photoAreaBoxShow = getStore('photoAreaBoxShow') ? getStore('photoAreaBoxShow') === 'false' ? false : true : false;
			return state.photoAreaBoxShow
    },
    isCallDispatchSweepcodeMethod: (state) => {
      state.isCallDispatchSweepcodeMethod = getStore('isCallDispatchSweepcodeMethod') ? getStore('isCallDispatchSweepcodeMethod') === 'false' ? false : true : true;
			return state.isCallDispatchSweepcodeMethod
    },
    isCompleteDispatchIssuePhotoList: (state) => {
			return state.isCompleteDispatchIssuePhotoList
    }
  },
  mutations:{
    // 改变页面标题
    changeTitleTxt (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('currentTitle', payLoad.tit);
				state.navTopTitle = payLoad.tit
			}
    },

    // 改变调度任务信息状态
    changeDispatchTaskMessage (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('currentDispatchTaskMessage', payLoad.DtMsg);
				state.dispatchTaskMessage = payLoad.DtMsg
			}
    },

    // 改变调度任务id状态
    changeDispatchTaskId (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('dispatchTaskId', payLoad);
				state.dispatchTaskId = payLoad
			}
    },

    // 改变转移人员列表状态
    changedispatchTaskTransferIdList (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('dispatchTaskTransferIdList', payLoad.DtMsg);
				state.dispatchTaskTransferIdList = payLoad.DtMsg
			}
    },
    // 改变取消原因列表状态
    changedispatchTaskCancelIdList (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('dispatchTaskCancelIdList', payLoad.DtMsg);
				state.dispatchTaskCancelIdList = payLoad.DtMsg
			}
    },
    // 改变调度任务状态的状态
    changeDispatchTaskState (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('dispatchTaskState', payLoad);
				state.dispatchTaskState = payLoad
			}
    },
    // 改变调度任务科室类型的状态
    changeDispatchTaskDepartmentType (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('dispatchTaskDepartmentType', payLoad);
				state.dispatchTaskDepartmentType = payLoad
			}
    },
    //改变是否强制拍照的状态
    changeIsCoerceTakePhoto (state,payLoad) {
      if (payLoad != 'null') {
				setStore('isCoerceTakePhoto', payLoad);
				state.isCoerceTakePhoto = payLoad
			}
    },
    //改变是否完成扫码的状态(出发地和单一目的地的id)
    changeisCompleteSweepCode (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('completeDispatchSweepCodeInfo', {sweepCodeInfo: payLoad});
				state.isCompleteSweepCode = payLoad
			}
    },
    //改变是否完成非单一目的地扫码的状态
    changeIsCompleteSweepCodeDestinationList (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('completeDispatchSweepCodeDestinationInfo', {sweepCodeInfo: payLoad});
				state.isCompleteSweepCodeDestinationList = payLoad
			}
    },
    //改变是否首次扫码的状态
    changeIsDispatchTaskFirstSweepCode (state,payLoad) {
      if (payLoad != 'null') {
				setStore('isDispatchFirstSweepCode', payLoad);
				state.isDispatchTaskFirstSweepCode = payLoad
			}
    },
    //改变完成上传的照片
     changeTransDispatchIsCompletePhotoList (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				state.isCompletePhotoList = payLoad
			}
    },
    //改变是否返回出发地的状态
    changeIsBack (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('isBack', payLoad);
				state.isBack = payLoad
			}
    },
    //改变是否签字的状态
    changeIsSign (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('isSign', payLoad);
				state.isSign = payLoad
			}
    },
    //改变是否是单一目的地状态
    changeIsSingleDestination (state,payLoad) {
      if (payLoad != 'null') {
				setStore('isSingleDestination', payLoad);
				state.isSingleDestination = payLoad
			}
    },
    // 改变是否显示结束任务按钮状态
    changeShowEndTaskBtn (state,payLoad) {
      if (payLoad != 'null') {
				setStore('showEndTaskBtn', payLoad);
				state.showEndTaskBtn = payLoad
			}
    },
    // 改变是否刷新任务页的状态
    changeIsFreshDispatchTaskPage (state,payLoad) {
      if (payLoad != 'null') {
				setStore('isFreshDispatchTaskPage', payLoad);
				state.isFreshDispatchTaskPage = payLoad
			}
    },
    // 改变当前科室标号状态
    changeCurrentDepartmentNumber (state,payLoad) {
      if (payLoad && payLoad != 'null') {
				setStore('completDepartmentNumber', { number: payLoad});
				state.currentDepartmentNumber = payLoad
			}
    },
    // 改变显示图爿框的状态
    changePhotoAreaBoxShow (state,payLoad) {
      if (payLoad != 'null') {
				setStore('photoAreaBoxShow', payLoad);
				state.photoAreaBoxShow = payLoad
			}
    },
    // 改变是否调取扫码方法的状态
    changeIsCallDispatchSweepcodeMethod (state,payLoad) {
      if (payLoad != 'null') {
				setStore('isCallDispatchSweepcodeMethod', payLoad);
				state.isCallDispatchSweepcodeMethod = payLoad
			}
    },
    // 改变已完成上传图片的状态
    changeIsCompleteDispatchIssuePhotoList (state, payLoad) {
      if (payLoad && payLoad != 'null') {
				state.isCompleteDispatchIssuePhotoList = payLoad
			}
    },
    //重置调度任务信息的状态
		resetTransDispatchTaskState(state) {
      Object.assign(state, getDefaultTransDispatchTaskState())
    }
  },
  actions:{
    resetTransDispatchTaskStateEvent({ commit }) {
			commit('resetTransDispatchTaskState')
		}
  }
}
