import { setStore, getStore } from '@/common/js/utils'
import { getDefaultSecurityPatrolLoginState } from '@/common/js/resetStore'
export default {
    state: getDefaultSecurityPatrolLoginState(),

    getters: {
        securityPatrolGlobalTimer: state => state.securityPatrolGlobalTimer
    },

    mutations: {
        // 保存全局定时器的状态
        changeSecurityPatrolGlobalTimer (state, playLoad) {
            state.securityPatrolGlobalTimer = playLoad
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