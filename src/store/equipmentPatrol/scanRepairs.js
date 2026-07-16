import { getScanRepairsState } from '@/common/js/resetStore'
export default {
    state: getScanRepairsState(),

    getters: {
        scanRepairsMessage: (state) => {
            return state.scanRepairsMessage
        }
    },

    mutations: {
        // 保存扫码报修的扫码信息
        changeScanRepairsMessage (state, playLoad) {
            state.scanRepairsMessage = playLoad
        },

        //重置报修模块任务状态
        resetScanRepairsState(state) {
            Object.assign(state, getScanRepairsState())
        }
    },

    actions: {
        resetScanRepairsStateStore({ commit }) {
            commit('resetScanRepairsState')
        }
    }
}