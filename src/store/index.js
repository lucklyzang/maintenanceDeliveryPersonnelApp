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
import repairsWorkOrder from './project/repairsWorkOrder.js'
import projectTaskScheduling from './project/taskScheduling.js'
import deviceService from './project/deviceService.js'
import departmentService from './project/departmentService.js'
import autoRepairTask from './project/autoRepairTask.js'
// 保洁
import environmentManagement from './clean/environmentManagement.js'
// 设备巡检
import equipmentPatrolLogin from './equipmentPatrol/equipmentPatrolLogin.js';
import patrolTask from './equipmentPatrol/patrolTask.js';
import spotCheckTask from './equipmentPatrol/spotCheckTask.js';
import spotTaskDispatchingManagement from './equipmentPatrol/spotTaskDispatchingManagement.js';
// 安全巡更
import securityPatrolLogin from './securityPatrol/securityPatrolLogin.js';
import securityPatrolPatrolTask from './securityPatrol/securityPatrolPatrolTask.js';
import eventRegister from './securityPatrol/eventRegister.js';
import guestBook from './securityPatrol/guestBook.js';
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
    autoRepairTask,
    environmentManagement,
    equipmentPatrolLogin,
    patrolTask,
    spotCheckTask,
    spotTaskDispatchingManagement,
    securityPatrolLogin,
    securityPatrolPatrolTask,
    eventRegister,
    guestBook
  }
});