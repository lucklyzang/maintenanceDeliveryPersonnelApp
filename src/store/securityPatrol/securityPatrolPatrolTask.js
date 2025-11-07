import { setStore, getStore } from '@/common/js/utils'
import { getDefaultSecurityPatrolPatrolTaskState } from '@/common/js/resetStore'
export default {
    state: getDefaultSecurityPatrolPatrolTaskState(),

    getters: {
        enterProblemRecordMessage: (state) => {
            return state.enterProblemRecordMessage
        },

        patrolTaskListMessage: (state) => {
            return state.patrolTaskListMessage
        },

        taskType: (state) => {
            return state.taskType
        },

        taskOrderType: (state) => {
            return state.taskOrderType
        },

        departmentCheckList: (state) => {
            return state.departmentCheckList
        }

    },

    mutations: {
        // 保存进入问题记录页时携带的信息
        changeEnterProblemRecordMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.enterProblemRecordMessage = playLoad
            }
        },

        // 保存巡查任务列表页的信息
        changePatrolTaskListMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.patrolTaskListMessage = playLoad
            }
        },

        // 保存扫码后的检查项信息
        changeDepartmentCheckList(state, playLoad) {
            state.departmentCheckList = playLoad
        },

        // 保存任务切换类型
        changeTaskType (state, payLoad) {
            state.taskType = payLoad
        },

        // 保存任务工单列表切换类型
        changeTaskOrderType (state, payLoad) {
            state.taskOrderType = payLoad
        },

        //重置巡更任务状态
        resetPatrolTaskState(state) {
            Object.assign(state, getDefaultSecurityPatrolPatrolTaskState())
        }
    },

    actions: {
        resetSecurityPatrolTaskStore({ commit }) {
            commit('resetPatrolTaskState')
        }
    }
}