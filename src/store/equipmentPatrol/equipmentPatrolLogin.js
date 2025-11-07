import { setStore, getStore } from '@/common/js/utils'
import { getEquipmentPatrolDefaultLoginState } from '@/common/js/resetStore'
export default {
    state: getEquipmentPatrolDefaultLoginState(),

    getters: {
        equipmentPatrolGlobalTimer: state => state.equipmentPatrolGlobalTimer
    },

    mutations: {

        // 保存全局定时器的状态
        changeequipmentPatrolGlobalTimer (state, playLoad) {
            state.equipmentPatrolGlobalTimer = playLoad
        },

        //重置login的store
        resetEquipmentPatroLoginState(state) {
            Object.assign(state, getEquipmentPatrolDefaultLoginState())
        }
    },    

    actions: {
        resetEquipmentPatroLoginStateEvent({ commit }) {
            commit('resetEquipmentPatroLoginState')
        }
    }
}