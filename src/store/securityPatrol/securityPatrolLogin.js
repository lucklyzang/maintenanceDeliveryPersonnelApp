import { setStore, getStore } from '@/common/js/utils'
import { getDefaultSecurityPatrolLoginState } from '@/common/js/resetStore'
export default {
    state: getDefaultSecurityPatrolLoginState(),

    getters: {
        globalTimer: state => state.globalTimer
    },

    mutations: {
        // 保存全局定时器的状态
        changeGlobalTimer (state, playLoad) {
            state.globalTimer = playLoad
        },

        //重置login的store
        resetState(state) {
            Object.assign(state, getDefaultSecurityPatrolLoginState())
        }
    },
    actions: {
        resetSecurityPatrolLoginState({ commit }) {
            commit('resetState')
        }
    }
}