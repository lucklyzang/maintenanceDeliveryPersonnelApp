import { getDefaultDeviceServiceState } from '@/common/js/resetStore'
import { setStore, getStore, removeStore } from '@/common/js/utils'
export default {
  state: getDefaultDeviceServiceState(),
  getters:{
    isFreshDeviceServicePage:(state) => {
			state.isFreshDeviceServicePage = getStore('isFreshDeviceServicePage') ? getStore('isFreshDeviceServicePage') === 'false' ? false : true : true;
			return state.isFreshDeviceServicePage
		},
    deviceServiceMsg:  (state) => {
			state.deviceServiceMsg = getStore('deviceServiceMsg') ? getStore('deviceServiceMsg') : '';
			return state.deviceServiceMsg
		},
    energyRecordList: (state) => {
      state.energyRecordList = JSON.parse(getStore('energyRecordList')) ? JSON.parse(getStore('energyRecordList'))['energyRecord'] : [];
			return state.energyRecordList
    },
    isCurrentDeviceCopyServiceVerifySweepCode: (state) => {
      state.isCurrentDeviceCopyServiceVerifySweepCode = JSON.parse(getStore('isCurrentDeviceCopyServiceVerifySweepCode')) ? JSON.parse(getStore('isCurrentDeviceCopyServiceVerifySweepCode'))['number'] : [];
			return state.isCurrentDeviceCopyServiceVerifySweepCode
    },
    currentDeviceCopyVerifySweepCodeDepNumber:  (state) => {
			state.currentDeviceCopyVerifySweepCodeDepNumber = getStore('energyDepartmentService') ? getStore('energyDepartmentService') : '';
			return state.currentDeviceCopyVerifySweepCodeDepNumber
		},
    completeDeviceEnergyRecordServiceOfficeInfo: (state) => {
      state.completeDeviceEnergyRecordServiceOfficeInfo = JSON.parse(getStore('isCompleteDeviceEnergyRecordServiceOfficeInfo')) ? JSON.parse(getStore('isCompleteDeviceEnergyRecordServiceOfficeInfo'))['sweepCodeInfo'] : [];
			return state.completeDeviceEnergyRecordServiceOfficeInfo
    }
  },
  mutations:{
    changeIsFreshDeviceServicePage (state, payLoad) {
      if ( payLoad != 'null') {
				setStore('isFreshDeviceServicePage', payLoad);
				state.isFreshDeviceServicePage = payLoad
			}
    },
    // 改变每条任务下各个科室能耗录入数据状态
    changeEnergyRecordList (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('energyRecordList', {energyRecord: payLoad});
				state.energyRecordList = payLoad
			}
    },
    // 改变设备巡检任务详细信息的状态
    changeDeviceServiceMsg (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('deviceServiceMsg', payLoad);
				state.deviceServiceMsg = payLoad
			}
    },
    // 改变设备巡检中能耗录入扫码校验通过的当前科室id的状态
    changeIsCurrentDeviceCopyServiceVerifySweepCode (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isCurrentDeviceCopyServiceVerifySweepCode', {number: payLoad});
				state.isCurrentDeviceCopyServiceVerifySweepCode = payLoad
			}
    },
    // 改变设备巡检中能耗录入扫码校验通过的当前科室编号的状态
    changeCurrentDeviceCopyVerifySweepCodeDepNumber (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('energyDepartmentService', payLoad);
				state.currentDeviceCopyVerifySweepCodeDepNumber = payLoad
			}
    },

    // 改变设备巡检中完成能耗录入的当前科室编号的状态
    changeCompleteDeviceEnergyRecordServiceOfficeInfo (state, payLoad) {
      if ( payLoad && payLoad != 'null') {
				setStore('isCompleteDeviceEnergyRecordServiceOfficeInfo', {sweepCodeInfo: payLoad});
				state.completeDeviceEnergyRecordServiceOfficeInfo = payLoad
			}
    },
    //重置deviceService状态
    resetDeviceServiceState(state) {
      Object.assign(state, getDefaultDeviceServiceState())
    }
  },
  actions:{
    resetDeviceServiceStateEvent({ commit }) {
      commit('resetDeviceServiceState')
    }
  }
}