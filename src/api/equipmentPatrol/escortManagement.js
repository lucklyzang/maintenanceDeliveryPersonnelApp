import request from '@/utils/request'

// 巡任务

// 获取巡更任务列表
export function getPatrolTaskDetailsList(data) {
    return request({
        url: 'nblink/patrol/checkTask/deviceDetails4App',
        method: 'get',
        params: data
    })
}

// 重置日历
export function resetPatrolTaskCalendarData (data) {
    return request({
        url: 'nblink/patrol/checkTask/deviceCalendar4App',
        method: 'get',
        params: data
    })
}

// 设备巡检打卡
export function patrolTaskPunchCard(data) {
    return request({
        url: 'nblink/patrol/checkTask/device/app/clockIn',
        method: 'put',
        data
    })
}

// 检查项通过
export function checkItemPass(data) {
    return request({
        url: 'nblink/patrol/checkResult/check/2Yes',
        method: 'put',
        data
    })
}

// 检查项不通过
export function checkItemNoPass(data) {
    return request({
        url: 'nblink/patrol/checkResult/check/2No',
        method: 'put',
        data
    })
}

// 提交检查项
export function submitCheckItem(data) {
    return request({
        url: 'nblink/patrol/checkResult/device/app/batchSubmit',
        method: 'put',
        data
    })
}

// 提交异常信息记录
export function saveDeviceAbnormalRecord(data) {
    return request({
        url: 'nblink/patrol/eventregister/device/save',
        method: 'post',
        data
    })
}

// 异常信息记录删除
export function deleteDeviceAbnormalRecord(id) {
    return request({
        url: `nblink/patrol/eventregister/device/${id}`,
        method: 'delete'
    })
}

// 上传问题工单
export function problemWorkOrderUpload(data) {
    return request({
        url: 'nblink/patrol/problemTask/problem',
        method: 'post',
        data
    })
}


// 本次任务问题工单
export function getCurrentTaskProblemWorkerOrder(taskId) {
    return request({
        url: `nblink/patrol/problemTask/app/current/${taskId}`,
        method: 'get'
    })
}

// 所有任务问题工单
export function getAllTaskProblemWorkerOrder(data) {
    return request({
        url: 'nblink/patrol/problemTask/app/all',
        method: 'get',
        params: data
    })
}

// 查询任务问题工单详情
export function getTaskProblemWorkerOrderDetails(data) {
    return request({
        url: 'nblink/patrol/problemTask/app/one',
        method: 'get',
        params: data
    })
}

// 任务完成
export function taskComplete(data) {
    return request({
        url: 'nblink/patrol/checkTask/app/confirm',
        method: 'put',
        data
    })
}

// 根据检查项ID判断该检查项下是否有注册事件
export function getIsHaveEventRegister(proId,system,resultId) {
    return request({
        url: `nblink/patrol/checkResult/isHaveEventRegister/${proId}/${system}/${resultId}`,
        method: 'get'
    })
}


// 设备管理

// 设备列表查询
export function getdevicesList(data) {
    return request({
        url: 'nblink/patrol/device/initAllByPage',
        method: 'get',
        params: data
    })
}

// 设备操作记录添加
export function addDeviceOperateRecord(data) {
    return request({
        url: 'nblink/patrol/deviceOperateRecord/',
        method: 'post',
        data
    })
}

// 设备操作记录添加
export function getDeviceOperateRecordList(data) {
    return request({
        url: 'nblink/patrol/deviceOperateRecord/list',
        method: 'get',
        params: data
    })
}