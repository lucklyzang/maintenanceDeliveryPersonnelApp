import { deepClone } from '@/common/js/utils'
import { getDefaultTransCirculationTaskState } from '@/common/js/resetStore.js'
export default {
  state: getDefaultTransCirculationTaskState(),
  getters:{
    circulationTaskMessage: (state) => {
      state.circulationTaskMessage = JSON.parse(getStore('circulationTaskMessage')) ? JSON.parse(getStore('circulationTaskMessage')) : null;
			return state.circulationTaskMessage
    },
    currentElectronicSignature: (state) => {
      state.currentElectronicSignature = JSON.parse(getStore('currentElectronicSignature')) ? JSON.parse(getStore('currentElectronicSignature')) : null;
			return state.currentElectronicSignature
    },
    circulationCollectMessageList: (state) => {
      state.circulationCollectMessageList = JSON.parse(getStore('circulationCollectMessageList')) ? JSON.parse(getStore('circulationCollectMessageList')) : [];
			return state.circulationCollectMessageList
    },
    isCollectEnterSweepCodePage: (state) => {
      state.isCollectEnterSweepCodePage = getStore('isCollectEnterSweepCodePage') ? getStore('isCollectEnterSweepCodePage') === 'false' ? false : true : false;
			return state.isCollectEnterSweepCodePage
    },
    circulationConnectMessageList: (state) => {
      state.circulationConnectMessageList = JSON.parse(getStore('circulationConnectMessageList')) ? JSON.parse(getStore('circulationConnectMessageList')) : [];
			return state.circulationConnectMessageList
    },
    isrefreshCirculationConnectPage: (state) => {
      state.isrefreshCirculationConnectPage = getStore('isrefreshCirculationConnectPage') ? getStore('isrefreshCirculationConnectPage') === 'false' ? false : true : false;
			return state.isrefreshCirculationConnectPage
    },
    completeDeparnmentInfo: (state) => {
      state.completeDeparnmentInfo = JSON.parse(getStore('completeDeparnmentInfo')) ? JSON.parse(getStore('completeDeparnmentInfo')) : [];
			return state.completeDeparnmentInfo
    },
    stipulateOfficeList: (state) => {
      state.stipulateOfficeList = JSON.parse(getStore('stipulateOfficeList')) ? JSON.parse(getStore('stipulateOfficeList')) : [];
			return state.stipulateOfficeList
    },
    arriveDepartmentId: (state) => {
      state.arriveDepartmentId = getStore('arriveDepartmentId') ? getStore('arriveDepartmentId') === 'false' ? false : true : false;
			return state.arriveDepartmentId
    },
    storeArriveDeparnmentId:  (state) => {
			state.storeArriveDeparnmentId = getStore('storeArriveDeparnmentId') ? getStore('storeArriveDeparnmentId') : '';
			return state.storeArriveDeparnmentId
		},
    storeAlreadyConnectSample: (state) => {
      state.storeAlreadyConnectSample = JSON.parse(getStore('storeAlreadyConnectSample')) ? JSON.parse(getStore('storeAlreadyConnectSample')) : [];
			return state.storeAlreadyConnectSample
    },
    storeNoConnectSample: (state) => {
      state.storeNoConnectSample = JSON.parse(getStore('storeNoConnectSample')) ? JSON.parse(getStore('storeNoConnectSample')) : [];
			return state.storeNoConnectSample
    },
    isDeleteEcho: (state) => {
      state.isDeleteEcho = getStore('isDeleteEcho') ? getStore('isDeleteEcho') === 'false' ? false : true : false;
			return state.isDeleteEcho
    },
    isDeleteCancel: (state) => {
      state.isDeleteCancel = getStore('isDeleteCancel') ? getStore('isDeleteCancel') === 'false' ? false : true : false;
			return state.isDeleteCancel
    },
    isClickSure: (state) => {
      state.isClickSure = getStore('isClickSure') ? getStore('isClickSure') === 'false' ? false : true : false;
			return state.isClickSure
    },
    circulationDetails: (state) => {
      state.circulationDetails = JSON.parse(getStore('circulationDetails')) ? JSON.parse(getStore('circulationDetails')) : null;
			return state.circulationDetails
    },
    verifyCirculationOfficeId:  (state) => {
			state.verifyCirculationOfficeId = getStore('verifyCirculationOfficeId') ? getStore('verifyCirculationOfficeId') : '';
			return state.verifyCirculationOfficeId
		},
    verifyNewCirculationOfficeId:  (state) => {
			state.verifyNewCirculationOfficeId = getStore('verifyNewCirculationOfficeId') ? getStore('verifyNewCirculationOfficeId') : '';
			return state.verifyNewCirculationOfficeId
		},
    isFreshCirculationTaskPage: (state) => {
      state.isFreshCirculationTaskPage = getStore('isFreshCirculationTaskPage') ? getStore('isFreshCirculationTaskPage') === 'false' ? false : true : true;
			return state.isFreshCirculationTaskPage
    },
    circulationTaskId:  (state) => {
			state.circulationTaskId = getStore('circulationTaskId') ? getStore('circulationTaskId') : '';
			return state.circulationTaskId
		},
    isCompleteSampleList: (state) => {
      state.isCompleteSampleList = JSON.parse(getStore('isCompleteSampleList')) ? JSON.parse(getStore('isCompleteSampleList')) : [];
			return state.isCompleteSampleList
    }
  },
  mutations:{
    // 改变电子签名状态
    changeCurrentElectronicSignature (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('currentElectronicSignature', payLoad.DtMsg);
				state.currentElectronicSignature = payLoad.DtMsg
			}
    },
    // 改变循环采集信息状态
     changeCirculationCollectMessageList (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('circulationCollectMessageList', payLoad.DtMsg);
				state.circulationCollectMessageList = payLoad.DtMsg
			}
    },
    // 改变是否是采集环节进入扫码页面
    changeIsCollectEnterSweepCodePage (state,payLoad) {
      if (playLoad != 'null') {
				setStore('isCollectEnterSweepCodePage', payLoad);
				state.isCollectEnterSweepCodePage = payLoad
			}
    },
    // 改变循环信息交接状态
    changeCirculationConnectMessageList (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('circulationConnectMessageList', deepClone(payLoad.DtMsg));
				state.circulationConnectMessageList = deepClone(payLoad.DtMsg)
			}
    },
    // 改变是否刷新交接页面状态
    changeIsrefreshCirculationConnectPage (state,payLoad) {
      if (playLoad != 'null') {
				setStore('isrefreshCirculationConnectPage', payLoad);
				state.isrefreshCirculationConnectPage = payLoad
			}
    },
    // 改变采集完成科室信息的状态
    changeCompleteDeparnmentInfo (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('completeDeparnmentInfo', deepClone(payLoad.DtMsg));
				state.completeDeparnmentInfo = deepClone(payLoad.DtMsg)
			}
    },
    // 改变要扫码的科室列表状态
    changeStipulateOfficeList (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('stipulateOfficeList', payLoad);
				state.stipulateOfficeList = payLoad
			}
    },
    // 改变送达科室是否扫码状态
    changeArriveDepartmentId (state,payLoad) {
      if (playLoad != 'null') {
				setStore('arriveDepartmentId', payLoad);
				state.arriveDepartmentId = payLoad
			}
    },
    // 改变送达科室id状态
    changeStoreArriveDeparnmentId (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('storeArriveDeparnmentId', payLoad);
				state.storeArriveDeparnmentId = payLoad
			}
    },
    // 改变已经交接的标本状态
    changeIsstoreAlreadyConnectSample (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('storeAlreadyConnectSample', deepClone(payLoad));
				state.storeAlreadyConnectSample = deepClone(payLoad)
			}
    },
    // 改变没有交接的标本状态
    changeIsStoreNoConnectSample (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('storeNoConnectSample', deepClone(payLoad));
				state.storeNoConnectSample = deepClone(payLoad)
			}
    },
    // 改变采集页面是否按钮回显生效状态
    changeIsDeleteCancel(state,payLoad) {
      if (playLoad != 'null') {
				setStore('isDeleteCancel', payLoad);
				state.isDeleteCancel = payLoad
			}
    },
    // 改变采集页面是否mounted周期回显生效状态
     changeIsDeleteEcho(state,payLoad) {
      if (playLoad != 'null') {
				setStore('isDeleteEcho', payLoad);
				state.isDeleteEcho = payLoad
			}
    },
    // 改变采集页面是否点击弹框确定按钮状态
    changeIsClickSure(state,payLoad) {
      if (playLoad != 'null') {
				setStore('isClickSure', payLoad);
				state.isClickSure = payLoad
			}
    },
    // 改变循环任务详细信息
    changeCirculationDetails (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('circulationDetails', payLoad);
				state.circulationDetails = payLoad
			}
    },
    // 改变校验通过的科室id状态
    changeVerifyCirculationOfficeId (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('verifyCirculationOfficeId', payLoad);
				state.verifyCirculationOfficeId = payLoad
			}
    },
    // 改变校验通过的科室id状态
    changeVerifyNewCirculationOfficeId (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('verifyNewCirculationOfficeId', payLoad);
				state.verifyNewCirculationOfficeId = payLoad
			}
    },
    // 改变是否刷新任务页的状态
    changeIsFreshCirculationTaskPage (state,payLoad) {
      if (playLoad != 'null') {
				setStore('isFreshCirculationTaskPage', payLoad);
				state.isFreshCirculationTaskPage = payLoad
			}
    },
    // 改变循环任务id状态
    changeCirculationTaskId (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('circulationTaskId', payLoad);
				state.circulationTaskId = payLoad
			}
    },
    // 改变新循环任务完成标本采集的状态
    changeIsCompleteSampleList (state,payLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('isCompleteSampleList', payLoad);
				state.isCompleteSampleList = payLoad
			}
    },
    //重置循环任务信息的状态
		resetTransCirculationTaskState(state) {
      Object.assign(state, getDefaultTransCirculationTaskState())
    }
  },
  actions:{
    resetTransCirculationTaskStateEvent({ commit }) {
			commit('resetTransCirculationTaskState')
		}
  }
}
