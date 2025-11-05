import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import common from './common.js';
// 运送
import dispatchTask from './trans/dispatchTask.js'
import appointTask from './trans/appointTask.js'
import transTaskScheduling from './trans/taskScheduling.js'
import circulationTask from './trans/circulationTask.js'
import medicalTask from './trans/medicalTask.js'
import transLogin from './trans/transLogin.js'
import catchComponent from './trans/catchComponent.js'
// 工程
import repairsWorkOrder from './project/repairsWorkOrder'
import projectTaskScheduling from './project/taskScheduling.js'
import deviceService from './project/deviceService'
import departmentService from './project/departmentService'
import autoRepairTask from './project/autoRepairTask'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    login,
	  common,
    transLogin,
	  dispatchTask,
    appointTask,
    transTaskScheduling,
    circulationTask,
    medicalTask,
    catchComponent,
    repairsWorkOrder,
    projectTaskScheduling,
    deviceService,
    departmentService,
    autoRepairTask
  }
});