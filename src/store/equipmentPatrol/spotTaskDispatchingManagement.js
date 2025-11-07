import { getSpotTaskDispatchingManagementState } from '@/common/js/resetStore'
export default {
    state: getSpotTaskDispatchingManagementState(),

    getters: {
    },

    mutations: {
        //重置点检任务状态
        resetSpotTaskDispatchingManagementState(state) {
            Object.assign(state, getSpotTaskDispatchingManagementState())
        }
    },

    actions: {
        resetSpotTaskDispatchingManagementStore({ commit }) {
            commit('resetSpotTaskDispatchingManagementState')
        }
    }
}