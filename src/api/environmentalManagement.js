import request from '@/utils/request'
import qs from 'qs'
// 查询保洁管理任务总体情况统计
export function queryCleaningManageTaskGlobalStatistics(data) {
    return request({
        url: 'clean/cleanTask/app/clean/display',
        method: 'get',
        params: data
    })
};

// 查询巡检任务总体统计情况
export function queryPollingTaskGlobalStatistics(data) {
    return request({
        url: 'clean/xjTask/app/index',
        method: 'get',
        params: data
    })
};

// 查询保洁管理任务列表
export function queryCleaningManageTaskList(data) {
    return request({
        url: 'clean/cleanTask/app/listAll',
        method: 'get',
        params: data
    })
};

// 查询巡检任务列表
export function queryPollingTaskList(data) {
    return request({
        url: 'clean/xjTask/app/list',
        method: 'get',
        params: data
    })
};

// 更新保洁管理任务状态
export function updateCleaningManageTaskState(data) {
    return request({
        url: 'clean/cleanTask/state/update',
        method: 'put',
        data
    })
}

//保洁管理任务完成
export function cleaningManageTaskComplete(data) {
    return request({
        url: 'clean/cleanTask/complete',
        method: 'put',
        data
    })
}

// 获取任务(即时保洁和专项保洁)
export function fetchTask(taskId) {
    return request({
        url: `clean/cleanTask/fetchTask/${taskId}`,
        method: 'put'
    })
}

// 退回任务(即时保洁和专项保洁)
export function returnTask(data) {
    return request({
        url: 'clean/cleanTask/returnTask',
        method: 'put',
        data
    })
}

//复核质疑流历史任务
export function reviewTask(id) {
    return request({
        url: `clean/cleanTask/app/review/${id}`,
        method: 'post'
    })
}

// 获取建筑信息
export function getArchitectureMessage(data) {
    return request({
        url: 'clean/structure/query2Select',
        method: 'get',
        params: data
    })
}

// 获取科室信息
export function getDepartmentMessage(data) {
    return request({
        url: 'clean/department/query2Select',
        method: 'get',
        params: data
    })
}

// 获取目的区域信息
export function getGoalAreaMessage(data) {
    return request({
        url: 'clean/goalArea/queryAll',
        method: 'get',
        params: data
    })
}

// 获取功能区信息
export function getFunctionAreaMessage(data) {
    return request({
        url: 'clean/cleanArea/queryAll',
        method: 'get',
        params: data
    })
}

// 获取违反标准信息
export function getViolateStandardMessage(data) {
    return request({
        url: 'clean//cleanArea/standards',
        method: 'get',
        params: data
    })
}

// 即时保洁任务新增
export function addForthwithCleanTask(data) {
    return request({
        url: 'clean/cleanTask/add',
        method: 'post',
        data
    })
}

// 获取单个巡检任务详情
export function getSinglePollingTaskMessage(taskId) {
    return request({
        url: `clean/xjSub/app/list/${taskId}`,
        method: 'get'
    })
}

// 科室扫码(巡检任务)
export function departmentScanCode(data) {
    return request({
        url: 'clean/xjResult/dep/scan',
        method: 'put',
        data
    })
}

// 科室进入(巡检任务)
export function departmentInto(data) {
    return request({
        url: 'clean/xjResult/dep/click',
        method: 'put',
        data
    })
}

// 检查确认单个检查项(巡检任务)
export function checkConfirmSingle(data) {
    return request({
        url: 'clean/xjResult/ribbon/one/confirm',
        method: 'put',
        data
    })
}

// 检查确认所有检查项(巡检任务)
export function checkConfirmAll(data) {
    return request({
        url: 'clean/xjResult/ribbon/all/confirm',
        method: 'put',
        data
    })
}

// 提交未完成原因(巡检任务)
export function submitUnfinishedReason (data) {
    return request({
        url: 'clean/xjTask/app/unfinishedReason',
        method: 'put',
        data
    })
}

// 查询未完成原因(巡检任务)
export function getUnfinishedReason (id) {
    return request({
        url: `clean/xjTask/app/unfinishedReason/${id}`,
        method: 'get'
    })
}


// 考勤日统计
export function cleanAttendanceDay(data) {
    return request({
        url: 'clean/attendance/dayApp',
        method: 'get',
        params: data
    })
}

// 考勤日统计详情
export function cleanAttendanceDayInfo(data) {
    return request({
        url: 'clean/attendance/dayAppInfo',
        method: 'get',
        params: data
    })
}

// 考勤月统计
export function cleanAttendanceMonth(data) {
    return request({
        url: 'clean/attendance/monthApp',
        method: 'get',
        params: data
    })
}

// 考勤月统计详情
export function cleanAttendanceMonthInfo(data) {
    return request({
        url: 'clean/attendance/monthAppInfo',
        method: 'get',
        params: data
    })
}

// 考勤月统计出勤详情
export function cleanAttendanceMonthAttendance(data) {
    return request({
        url: 'clean/attendance/monthAttendanceApp',
        method: 'get',
        params: data
    })
}

// 考勤人员统计
export function cleanAttendancePeople(data) {
    return request({
        url: 'clean/attendance/peopleApp',
        method: 'get',
        params: data
    })
}

// 考勤人员详情统计
export function cleanAttendancePeopleInfo(data) {
    return request({
        url: 'clean/attendance/peopleInfoApp',
        method: 'get',
        params: data
    })
}

// 查询考勤列表
export function cleanAttendanceList(data) {
    return request({
        url: 'clean/attendance/app',
        method: 'get',
        params: data
    })
}

// 录入考勤
export function cleanAttendanceUpdate(data) {
    return request({
        url: 'clean/attendance/update',
        method: 'put',
        data
    })
}

// 批量录入考勤
export function cleanAttendanceUpdateBatch(data) {
    return request({
        url: 'clean/attendance/updateBatch',
        method: 'put',
        data
    })
}

// 查询保洁员(考勤管理)
export function cleanbxWorkerList(proId) {
    return request({
        url: `clean/bxWorker/workers/${proId}`,
        method: 'get'
    })
}

// 查询当天保洁员(保洁管理)
export function attendanceWorkerList(proId) {
    return request({
        url: `clean/attendance/forIndex/${proId}`,
        method: 'get'
    })
}

// 查询所有保洁员(保洁管理)
export function attendanceAllWorkerList(proId) {
    return request({
        url: `clean/bxWorker/workers/${proId}`,
        method: 'get'
    })
}