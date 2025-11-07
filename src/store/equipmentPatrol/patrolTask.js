import { getDefaultPatrolTaskState } from '@/common/js/resetStore'
import { setStore, getStore } from '@/common/js/utils'
export default {
    state: getDefaultPatrolTaskState(),

    getters: {
        enterPatrolAbnormalRecordPageSource: (state) => {
            return state.enterPatrolAbnormalRecordPageSource
        },

        patrolTaskListMessage: (state) => {
            return state.patrolTaskListMessage
        },

        patrolTaskAbnormalRecordList: (state) => {
            return state.patrolTaskAbnormalRecordList
        },

        patrolTaskDeviceChecklist: (state) => {
            return state.patrolTaskDeviceChecklist
        },

        devicePatrolDetailsSelectMessage: (state) => {
            return state.devicePatrolDetailsSelectMessage
        },

        historyPatrolTaskAbnormalRecordDetails: (state) => {
            return state.historyPatrolTaskAbnormalRecordDetails
        },

        patrolTaskAbnormalCheckItemEventList: (state) => {
            return state.patrolTaskAbnormalCheckItemEventList
        },

        historyPatrolTaskAbnormalCheckItemEventList: (state) => {
            return state.historyPatrolTaskAbnormalCheckItemEventList
        },

        historyPatrolTaskDetails: (state) => {
            return state.historyPatrolTaskDetails
        },

        historyPatrolTaskDeviceChecklist: (state) => {
            return state.historyPatrolTaskDeviceChecklist
        },

        historyPatrolTaskDateMessage: (state) => {
            return state.historyPatrolTaskDateMessage
        }

    },

    mutations: {
        // 保存巡查任务列表页的信息
        changePatrolTaskListMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.patrolTaskListMessage = playLoad
            }
        },

        // 保存进入异常记录页的来源页面
        changeEnterPatrolAbnormalRecordPageSource(state, playLoad) {
            state.enterPatrolAbnormalRecordPageSource = playLoad
        },

        //保存离开设备巡检详情页时选中的任务集名称和时间点信息
        changeDevicePatrolDetailsSelectMessage(state, playLoad) {
            state.devicePatrolDetailsSelectMessage = playLoad
        },

        // 保存进入设备检查单页面的信息
        changePatrolTaskDeviceChecklist(state, playLoad) {
            state.patrolTaskDeviceChecklist = playLoad
        },

        // 保存进入异常检查项事件列表页面的信息
        changePatrolTaskAbnormalCheckItemEventList(state, playLoad) {
            setStore('patrolTaskAbnormalCheckItemEventList', playLoad);
            state.patrolTaskAbnormalCheckItemEventList = playLoad
        },

        // 保存进入历史异常检查项事件列表页面的信息
        changeHistoryPatrolTaskAbnormalCheckItemEventList(state, playLoad) {
            state.historyPatrolTaskAbnormalCheckItemEventList = playLoad
        },


        // 保存进入历史巡检任务详情页面的信息
        changeHistoryPatrolTaskDetails(state, playLoad) {
            state.historyPatrolTaskDetails = playLoad
        },

        // 保存进入历史设备检查单页面的信息
        changePatrolHistoryTaskDeviceChecklist(state, playLoad) {
            state.historyPatrolTaskDeviceChecklist = playLoad
        },

        // 保存历史巡检任务进入任务详情的日期信息
        changeHistoryPatrolTaskDateMessage(state, playLoad) {
            state.historyPatrolTaskDateMessage = playLoad
        },


        // 保存进入历史异常记录详情页面的信息
        changePatrolHistoryTaskAbnormalRecordDetails(state, playLoad) {
            state.historyPatrolTaskAbnormalRecordDetails = playLoad
        },

        // 保存异常记录信息
        changePatrolTaskAbnormalRecordList(state, playLoad) {
            state.patrolTaskAbnormalRecordList = playLoad
        },

        //重置巡更任务状态
        resetPatrolTaskState(state) {
            Object.assign(state, getDefaultPatrolTaskState())
        }
    },

    actions: {
        resetPatrolTaskStore({ commit }) {
            commit('resetPatrolTaskState')
        }
    }
}