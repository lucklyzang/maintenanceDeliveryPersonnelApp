import { setStore, getStore } from '@/common/js/utils'
import { getDefaultLoginState } from '@/common/js/resetStore.js'
export default {	
	state: getDefaultLoginState(),
	getters: {
		timeMessage: (state) => {
			state.timeMessage = JSON.parse(getStore('timeMessage')) ? JSON.parse(getStore('timeMessage')) : {};
			return state.timeMessage
		},
		ossMessage:(state) => {
			state.ossMessage = JSON.parse(getStore('ossMessage')) ? JSON.parse(getStore('ossMessage')) : {};
			return state.ossMessage
		},
		userInfo:(state) => {
			state.userInfo = JSON.parse(getStore('userInfo')) ? JSON.parse(getStore('userInfo')) : null;
			return state.userInfo
		},
		isMedicalMan:(state) => {
			state.isMedicalMan = getStore('isMedicalMan') ? getStore('isMedicalMan') === 'false' ? false : true : false;
			return state.isMedicalMan
		},
		chooseHospitalArea:(state) => {
			state.chooseHospitalArea = JSON.parse(getStore('chooseHospitalArea')) ? JSON.parse(getStore('chooseHospitalArea')) : null;
			return state.chooseHospitalArea
		},
		appPermission:(state) => {
			state.appPermission = JSON.parse(getStore('appPermission')) ? JSON.parse(getStore('appPermission')) : null;
			return state.appPermission
		},
		isLogin: (state) => {
			state.isLogin = getStore('isLogin') ? getStore('isLogin') === 'false' ? false : true : false;
			return state.isLogin
		},
		socketOpen: (state) => {
			state.socketOpen = getStore('socketOpen') ? getStore('socketOpen') === 'false' ? false : true : false;
			return state.socketOpen
		},
		templateType:  (state) => {
			state.templateType = getStore('templateType') ? getStore('templateType') : '';
			return state.templateType
		},
		token:(state) => {
			state.token = getStore('token') ? getStore('token') : null;
			return state.token
		},
		affairToken:(state) => {
			state.affairToken = getStore('affairToken') ? getStore('affairToken') : null;
			return state.affairToken
		},
		overDueWay: state => state.overDueWay
	},
	mutations: {
		//保存阿里云签名信息
		changeOssMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('ossMessage', playLoad);
				state.ossMessage = playLoad
			}
		},
		//保存阿里云签名过期日期
		changeTimeMessage (state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('timeMessage', playLoad);
				state.timeMessage = playLoad
			}
		},
		changeIsMedicalMan (state, playLoad) {
		  state.isMedicalMan = playLoad
		},
		storeUserInfo(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('userInfo', playLoad);
				state.userInfo = playLoad
			}
		},
		storeChooseHospitalArea(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('chooseHospitalArea', playLoad);
				state.chooseHospitalArea = playLoad
			}
		},
		storeAppPermission(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('appPermission', playLoad);
				state.appPermission = playLoad
			}
		},
		// 修改模板状态
		changeTemplateType(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('templateType', playLoad);
				state.templateType = playLoad
			}
		},
		// 修改token状态
		changeToken(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('token', playLoad);
				state.token = playLoad
			}
		},
		// 修改事务接口token状态
		changeAffairToken(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('affairToken', playLoad);
				state.affairToken = playLoad
			}
		},
		// 修改socken是否打开
		changeSocketOpen(state, playLoad) {
			if (playLoad && playLoad != 'null') {
				setStore('socketOpen', playLoad);
				state.socketOpen = playLoad
			}
		},
		// 修改是否登录状态
		changeIsLogin(state, playLoad) {
			if (playLoad != 'null') {
				setStore('isLogin', playLoad);
				state.isLogin = playLoad
			}
		},
		// 修改过期方式
		changeOverDueWay(state, playLoad) {
			state.overDueWay = playLoad
		},
		//重置登录信息的状态
		resetLoginInfoState(state) {
				Object.assign(state, getDefaultLoginState())
		}
	},
	actions: {
		resetLoginState({ commit }) {
			commit('resetLoginInfoState')
		}
	}
}
