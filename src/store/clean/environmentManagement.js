import { setStore, getStore } from '@/common/js/utils'
import { getDefaultEnvironmentManagementState } from '@/common/js/resetStore'
export default {
    state: getDefaultEnvironmentManagementState(),

    getters: {
        permissionInfo: (state) => {
            state.permissionInfo = JSON.parse(getStore('permissionInfo')) ? JSON.parse(getStore('permissionInfo')) : [];
            return state.permissionInfo
        },

        chooseProject: (state) => {
            state.chooseProject = JSON.parse(getStore('chooseProject')) ? JSON.parse(getStore('chooseProject')) : [];
            return state.chooseProject
        },

        roleNameList: (state) => {
            state.roleNameList = JSON.parse(getStore('roleNameList')) ? JSON.parse(getStore('roleNameList')) : [];
            return state.roleNameList
        },

        currentCleanTaskName: (state) => {
            state.currentCleanTaskName = getStore('currentCleanTaskName') ? JSON.parse(getStore('currentCleanTaskName')) : {};
            return state.currentCleanTaskName
        },

        storageForthwithTaskMessage: (state) => {
            state.storageForthwithTaskMessage = getStore('storageForthwithTaskMessage') ? JSON.parse(getStore('storageForthwithTaskMessage')) : [];
            return state.storageForthwithTaskMessage
        },

        storageSpecialTaskMessage: (state) => {
            state.storageSpecialTaskMessage = getStore('storageSpecialTaskMessage') ? JSON.parse(getStore('storageSpecialTaskMessage')) : [];
            return state.storageSpecialTaskMessage
        },

        currentCleanTaskDateVlue : (state) => {
            state.currentCleanTaskDateVlue = getStore('currentCleanTaskDateVlue') ? getStore('currentCleanTaskDateVlue') : 1;
            return state.currentCleanTaskDateVlue
        },

        cleanTaskDetails : (state) => {
            state.cleanTaskDetails = getStore('cleanTaskDetails') ? JSON.parse(getStore('cleanTaskDetails')) : {};
            return state.cleanTaskDetails
        },

        attendanceStatisticsSwitchMessage : (state) => {
            return state.attendanceStatisticsSwitchMessage
        },

        locationMessage : (state) => {
            return state.locationMessage
        },

        pollingTaskCurrentShowTime : (state) => {
            return state.pollingTaskCurrentShowTime
        },

        pollingTaskDepartmentMessage : (state) => {
            return state.pollingTaskDepartmentMessage
        },

        pollingTaskDepartmentFunctionalZoneMessage : (state) => {
            return state.pollingTaskDepartmentFunctionalZoneMessage
        },

        attendanceTypeDetailsMessage : (state) => {
            state.attendanceTypeDetailsMessage = getStore('attendanceTypeDetailsMessage') ? JSON.parse(getStore('attendanceTypeDetailsMessage')) : {};
            return state.attendanceTypeDetailsMessage
        },

        personnelStatisticsDetailsMessage : (state) => {
            state.personnelStatisticsDetailsMessage = getStore('personnelStatisticsDetailsMessage') ? JSON.parse(getStore('personnelStatisticsDetailsMessage')) : {};
            return state.personnelStatisticsDetailsMessage
        }
    },

    mutations: {

        // 保存权限列表
		changePermissionInfo(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('permissionInfo', playLoad);
                state.permissionInfo = playLoad
            }
		},

        // 保存角色列表
		changeRoleNameList(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('roleNameList', playLoad);
                state.roleNameList = playLoad
            }
		},

        //保存选择的项目
        changeChooseProject (state, playLoad) {
            if (playLoad != 'null') {
                setStore('chooseProject', playLoad);
                state.chooseProject = playLoad
            }
		},


        // 保存保洁管理中点击的任务类型
        storeCurrentCleanTaskName(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('currentCleanTaskName', playLoad);
                state.currentCleanTaskName = playLoad
            }
        },


        // 保存保洁管理任务列表选择的日期
        storeCurrentCleanTaskDateVlue(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('currentCleanTaskDateVlue', playLoad);
                state.currentCleanTaskDateVlue = playLoad
            }
        },

        // 保存暂存的即时保洁任务相关信息
        changeTemporaryStorageForthwithTaskMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('storageForthwithTaskMessage', playLoad);
                state.storageForthwithTaskMessage = playLoad
            }
        },

        // 保存暂存的专项保洁任务相关信息
        changeTemporaryStorageSpecialTaskMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('storageSpecialTaskMessage', playLoad);
                state.storageSpecialTaskMessage = playLoad
            }
        },

        // 保存保洁管理任务详情
        storeCleanTaskDetails(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('cleanTaskDetails', playLoad);
                state.cleanTaskDetails = playLoad
            }
        },

        // 保存保洁管理考勤统计类型详情
        storeAttendanceTypeDetailsMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('attendanceTypeDetailsMessage', playLoad);
                state.attendanceTypeDetailsMessage = playLoad
            }
        },

        // 保存保洁管理考勤人员统计详情
        storePersonnelStatisticsDetailsMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                setStore('personnelStatisticsDetailsMessage', playLoad);
                state.personnelStatisticsDetailsMessage = playLoad
            }
        },

        // 保存保洁管理考勤统计切换和日期信息
        storeAttendanceStatisticsSwitchMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.attendanceStatisticsSwitchMessage = playLoad
            }
        },

        // 保存保洁管理即时保洁任务添加的位置信息
        storeLocationMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.locationMessage = playLoad
            }
        },

        // 保存保洁管理巡检任务科室相关信息
        storePollingTaskDepartmentMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.pollingTaskDepartmentMessage = playLoad
            }
        },

        // 保存保洁管理巡检任务科室相关信息
        storePollingTaskDepartmentFunctionalZoneMessage(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.pollingTaskDepartmentFunctionalZoneMessage = playLoad
            }
        },

        // 保存保洁管理巡检任务当前显示时间
        storePollingTaskCurrentShowTime(state, playLoad) {
            if (playLoad && playLoad != 'null') {
                state.pollingTaskCurrentShowTime = playLoad
            }
        },

        //重置保洁管理状态
        resetCleanManagementState(state) {
            Object.assign(state, getDefaultEnvironmentManagementState())
        }
    },

    actions: {
        resetCleanManagementStore({ commit }) {
            commit('resetCleanManagementState')
        }
    }
}