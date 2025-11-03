import Vue from 'vue';
import Vuex from 'vuex';
import login from './login.js';
import common from './common.js';
import dispatchTask from './trans/dispatchTask.js'
import appointTask from './trans/appointTask.js'
import taskScheduling from './trans/taskScheduling.js'
import circulationTask from './trans/circulationTask.js'
import medicalTask from './trans/medicalTask.js'
import catchComponent from './trans/catchComponent.js'
Vue.use(Vuex);
export default new Vuex.Store({
  modules:{
    login,
	common,
	dispatchTask,
    appointTask,
    taskScheduling,
    circulationTask,
    medicalTask,
    catchComponent
  }
});