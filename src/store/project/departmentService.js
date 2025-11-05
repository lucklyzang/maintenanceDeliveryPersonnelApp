import { getDefaultDepartmentServiceState } from '@/common/js/resetStore'
import { setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  state: getDefaultDepartmentServiceState(),
  getters:{
    isFreshDepartmentServicePage:(state) => {
			state.isMedicalMan = getStore('isFreshDepartmentServicePage') ? getStore('isFreshDepartmentServicePage') === 'false' ? false : true : true;
			return state.isFreshDepartmentServicePage
		},
    departmentServiceMsg:  (state) => {
			state.departmentServiceMsg = getStore('departmentServiceMsg') ? getStore('departmentServiceMsg') : '';
			return state.departmentServiceMsg
		},
    isDepartmentServiceVerifySweepCode: (state) => {
      state.isDepartmentServiceVerifySweepCode = JSON.parse(getStore('isDepartmentServiceVerifySweepCode')) ? JSON.parse(getStore('isDepartmentServiceVerifySweepCode')) : [];
			return state.isDepartmentServiceVerifySweepCode
    },
    isCurrentDepartmentServiceVerifySweepCode: (state) => {
      state.isCurrentDepartmentServiceVerifySweepCode = JSON.parse(getStore('isCurrentDepartmentServiceVerifySweepCode')) ? JSON.parse(getStore('isCurrentDepartmentServiceVerifySweepCode')) : [];
			return state.isCurrentDepartmentServiceVerifySweepCode
    },
    departmentServiceOfficeId:  (state) => {
			state.departmentServiceOfficeId = getStore('departmentServiceOfficeId') ? getStore('departmentServiceOfficeId') : '';
			return state.departmentServiceOfficeId
		},
    completeDepartmentServiceOfficeInfo: (state) => {
      state.completeDepartmentServiceOfficeInfo = JSON.parse(getStore('completeDepartmentServiceOfficeInfo')) ? JSON.parse(getStore('completeDepartmentServiceOfficeInfo')) : [];
			return state.completeDepartmentServiceOfficeInfo
    },
    completeDepartmentServiceCheckedItemList: (state) => {
      state.completeDepartmentServiceCheckedItemList = JSON.parse(getStore('completeDepartmentServiceCheckedItemList')) ? JSON.parse(getStore('completeDepartmentServiceCheckedItemList')) : [];
			return state.completeDepartmentServiceCheckedItemList
    },
    isSingleDepartmentSignature:(state) => {
			state.isSingleDepartmentSignature = getStore('isSingleDepartmentSignature') ? getStore('isSingleDepartmentSignature') === 'false' ? false : true : true;
			return state.isSingleDepartmentSignature
		},
    currentDepartmentServiceCheckedItemId: (state) => {
      state.currentDepartmentServiceCheckedItemId = JSON.parse(getStore('currentDepartmentServiceCheckedItemId')) ? JSON.parse(getStore('currentDepartmentServiceCheckedItemId')) : null;
			return state.currentDepartmentServiceCheckedItemId
    }
  },
  mutations:{
    // 改变是否刷新巡检任务首页的状态
    changeIsFreshDepartmentServicePage (state, payLoad) {
      if (payLoad!= 'null') {
				setStore('isFreshDepartmentServicePage', payLoad);
				state.isFreshDepartmentServicePage = payLoad
			}
    },
    // 改变巡检任务信息的状态
    changeDepartmentServiceMsg (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('departmentServiceMsg', payLoad);
				state.departmentServiceMsg = payLoad
			}
    },
    // 改变巡检任务扫码校验通过的科室编号
    changeIsDepartmentServiceVerifySweepCode (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isDepartmentServiceVerifySweepCode', payLoad);
				state.isDepartmentServiceVerifySweepCode = payLoad
			}
    },
    // 改变当前巡检任务扫码校验通过的科室id
    changeIsCurrentDepartmentServiceVerifySweepCode (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isCurrentDepartmentServiceVerifySweepCode', payLoad);
				state.isCurrentDepartmentServiceVerifySweepCode = payLoad
			}
    },
    // 改变当前巡检任务扫码校验通过的科室编号
     changeDepartmentServiceOfficeId (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('departmentServiceOfficeId', payLoad);
				state.departmentServiceOfficeId = payLoad
			}
    },
    // 改变完成巡检任务的科室信息
    changeCompleteDepartmentServiceOfficeInfo (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('completeDepartmentServiceOfficeInfo', payLoad);
				state.completeDepartmentServiceOfficeInfo = payLoad
			}
    },
    // 改变当前点击过的检查项id
    changeCurrentDepartmentServiceCheckedItemId (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('currentDepartmentServiceCheckedItemId', payLoad);
				state.currentDepartmentServiceCheckedItemId = payLoad
			}
    },
    // 改变当前完成问题上报的检查项id
    changeCompleteDepartmentServiceCheckedItemList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('completeDepartmentServiceCheckedItemList', payLoad);
				state.completeDepartmentServiceCheckedItemList = payLoad
			}
    },
    // 改变是否是单个科室的签字状态
    changeIsSingleDepartmentSignature (state, playLoad) {
      if (payLoad != 'null') {
				setStore('isSingleDepartmentSignature', payLoad);
				state.isSingleDepartmentSignature = payLoad
			}
    },
    //重置departmentService状态
    resetDepartmentServiceState(state) {
      Object.assign(state, getDefaultDepartmentServiceState())
    }
  },
  actions:{
    resetDepartmentServiceStateEvent({ commit }) {
      commit('resetDepartmentServiceState')
    }
  }
}
