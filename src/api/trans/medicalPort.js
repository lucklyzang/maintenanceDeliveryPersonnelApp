import request from '@/utils/request'
import store from '@/store';

// 查询运送类型
export function queryTransportType(data) {
    return request({
        url: 'trans/taskType/queryAll',
        method: 'get',
        params: data
    })
};

// 查询运送类型分类
export function queryTransportTypeClass(data) {
    return request({
        url: 'trans/taskTypeClass/queryAll',
        method: 'get',
        params: data
    })
};

// 查询目的地(科室)
export function queryAllDestination(proId) {
    return request({
        url: `trans/department/dict/${proId}`,
        method: 'get'
    })
};
// 查询转运工具
export function queryTransportTools(data) {
    return request({
        url: 'trans/tool/queryAll',
        method: 'get',
        params: data
    })
};
//查询设备信息
export function quereDeviceMessage(data) {
    return request({
        url: 'trans/device/queryOne',
        method: 'get',
        params: data
    })
};
// 生成调度任务(一个病人)
export function generateDispatchTask(data) {
    return request({
        url: 'trans/task/add',
        method: 'post',
        data
    })
};
// 生成调度任务(多个病人)
export function generateDispatchTaskMany(data) {
    return request({
        url: 'trans/dispatch/app/save',
        method: 'post',
        data
    })
};
// 收藏调度任务(经常发起)
export function collectDispatchTask() {
    return request({
        url: '',
        method: 'get'
    })
};
// 调度任务催单
export function taskReminder(proId, taskId) {
    return request({
        url: store.getters.templateType == 'template_one' ? `trans/task/reminder/${proId}/${taskId}` : `trans/dispatch/reminder/${proId}/${taskId}`,
        method: 'get'
    })
};
// 查询反馈意见
export function queryFeedback(data) {
    return request({
        url: 'trans/feedbackConf/queryAll',
        method: 'get',
        params: data
    })
};

// 提交总体反馈意见
export function submitFeedback(data) {
    return request({
        url: 'trans/wholeFeedback/add',
        method: 'post',
        data
    })
};

// 提交任务反馈意见
export function submitTaskFeedback(data, type) {
    return request({
        url: `trans/feedback/feedback/${type}`,
        method: 'post',
        data
    })
};

// 查询运送员
export function getTransporter(proId,workerId) {
    return request({
      url: `trans/worker/assignWorker/${proId}?workerId=${workerId}`,
      method: 'get'
    })
  };