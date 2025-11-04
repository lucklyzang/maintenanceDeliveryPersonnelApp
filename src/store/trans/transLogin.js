import { getDefaultTransTransLoginState } from '@/common/js/resetStore.js'
export default {
  state: getDefaultTransTransLoginState(),
  getters:{
    isTemplateOne:  (state) => {
			state.isTemplateOne = getStore('isTemplateOne') ? getStore('isTemplateOne') : 0;
			return state.isTemplateOne
		},
    routerFlag: (state) => {
      state.routerFlag = getStore('routerFlag') ? getStore('routerFlag') === 'false' ? false : true : true;
			return state.routerFlag
    },
    loginSweepCode: (state) => {
      state.loginSweepCode = getStore('loginSweepCode') ? getStore('loginSweepCode') === 'false' ? false : true : false;
			return state.loginSweepCode
    },
    userType:  (state) => {
			state.userType = getStore('userType') ? getStore('userType') : '';
			return state.userType
		},
    departmentInfoList: (state) => {
      state.departmentInfoList = JSON.parse(getStore('departmentInfoList')) ? JSON.parse(getStore('departmentInfoList')) : {};
			return state.departmentInfoList
    },
    departmentInfoListNo: (state) => {
      state.departmentInfoListNo = JSON.parse(getStore('departmentInfoListNo')) ? JSON.parse(getStore('departmentInfoListNo')) : {};
			return state.departmentInfoListNo
    },
    newTaskName:  (state) => {
			state.newTaskName = getStore('newTaskName') ? getStore('newTaskName') : '';
			return state.newTaskName
		},
    taskDetailsMessage: (state) => {
      state.taskDetailsMessage = JSON.parse(getStore('taskDetailsMessage')) ? JSON.parse(getStore('taskDetailsMessage')) : {};
			return state.taskDetailsMessage
    },
    taskType:  (state) => {
			state.taskType = getStore('taskType') ? getStore('taskType') : '';
			return state.taskType
		},
    globalTimer: (state) => {
      state.globalTimer = getStore('globalTimer') ? getStore('globalTimer') : null;
			return state.globalTimer
    },
    globalCircleTimer: (state) => {
      state.globalCircleTimer = getStore('globalCircleTimer') ? getStore('globalCircleTimer') : null;
			return state.globalCircleTimer
    },
    isFreshHomePage: (state) => {
      state.isFreshHomePage = getStore('isFreshHomePage') ? getStore('isFreshHomePage') === 'false' ? false : true : false;
			return state.isFreshHomePage
    },
    isNewCircle: (state) => {
      state.isNewCircle = getStore('isNewCircle') ? getStore('isNewCircle') === 'false' ? false : true : false;
			return state.isNewCircle
    }
  },
  mutations:{
    changeRouterFlag (state, playLoad) {
      if (playLoad != 'null') {
				setStore('routerFlag', payLoad);
				state.routerFlag = payLoad
			}
    },
    changeLoginMethod (state, playLoad) {
      if (playLoad != 'null') {
				setStore('loginSweepCode', payLoad);
				state.loginSweepCode = payLoad
			}
    },
    // 修改模板状态
    changeIsTemplateOne (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('isTemplateOne', payLoad);
				state.isTemplateOne = payLoad
			}
    },
    // 修改用户状态
    changeUserType (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('userType', payLoad);
				state.userType = payLoad
			}
    },
    // 改变科室信息状态id
    changeDepartmentInfoList (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('departmentInfoList', payLoad);
				state.departmentInfoList = payLoad
			}
    },
    // 改变科室信息状态编号
    changeDepartmentInfoListNo (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('departmentInfoListNo', payLoad);
				state.departmentInfoListNo = payLoad
			}
    },
    // 改变新任务列表状态
    changeNewTaskList (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('newTaskName', payLoad);
				state.newTaskName = payLoad
			}
    },
    // 改变历史任务详情
    changeTaskDetailsMessage (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('taskDetailsMessage', payLoad);
				state.taskDetailsMessage = payLoad
			}
    },
    // 改变任务类型状态
    changeTaskType (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('taskType', payLoad);
				state.taskType = payLoad
			}
    },
    // 改变全局定时器的状态
    changeGlobalTimer (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('globalTimer', payLoad);
				state.globalTimer = payLoad
			}
    },
    // 改变全局定时器的状态
    changeGlobalCircleTimer (state, playLoad) {
      if (playLoad && playLoad != 'null') {
				setStore('globalCircleTimer', payLoad);
				state.globalCircleTimer = payLoad
			}
    },
    // 改变是否刷新首页的状态
    changeIsFreshHomePage (state, playLoad) {
      if (playLoad != 'null') {
				setStore('isFreshHomePage', payLoad);
				state.isFreshHomePage = payLoad
			}
    },
    // 修改是否是新循环任务状态
    changeIsNewCircle (state, playLoad) {
      if (playLoad != 'null') {
				setStore('isNewCircle', payLoad);
				state.isNewCircle = payLoad
			}
    },
    //重置transLogin信息的状态
		resetTransTransLoginState(state) {
      Object.assign(state, getDefaultTransTransLoginState())
    }
  },
  actions:{
    resetTransTransLoginStateEvent({ commit }) {
			commit('resetTransTransLoginState')
		}
  }
}
