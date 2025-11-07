import { getSpotCheckTaskState } from '@/common/js/resetStore'
export default {
    state: getSpotCheckTaskState(),

    getters: {
        enterHistoryEquipmSpotTaskListPageSource: (state) => {
            return state.enterHistoryEquipmSpotTaskListPageSource
        }
    },

    mutations: {
        // 保存进入历史设备点击任务列表页的来源页面
        changeEnterHistoryEquipmSpotTaskListPageSource (state, playLoad) {
            state.enterHistoryEquipmSpotTaskListPageSource = playLoad
        },

        //重置点检任务状态
        resetSpotCheckTaskState(state) {
            Object.assign(state, getSpotCheckTaskState())
        }
    },

    actions: {
        resetSpotCheckTaskStore({ commit }) {
            commit('resetSpotCheckTaskState')
        }
    }
}