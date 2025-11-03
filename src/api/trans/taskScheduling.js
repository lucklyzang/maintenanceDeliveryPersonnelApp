import request from '@/utils/request'
import store from '@/store';
// 调度任务列表查询(单病人)
export function dispathSinglePatientList (state,proId) {
    return request({
      url: `task/index/qtdTask?state=${state}&proId=${proId}`,
      method: 'get'
    })
  };

// 调度任务列表查询(多病人)
export function dispathManyPatientList (state,proId) {
  return request({
    url: `dispatch/index/qtdTask?state=${state}&proId=${proId}`,
    method: 'get'
  })
};

// 生成调度任务(多个病人)
export function generateDispatchTaskManyNew(data) {
  return request({
      url: 'dispatch/saveTransDispatchTaskForApp',
      method: 'post',
      data
  })
};

// 编辑调度任务(多个病人)
export function editDispatchTaskManyNew(data) {
  return request({
      url: 'dispatch/updateTransDispatchTaskForApp',
      method: 'post',
      data
  })
};

// 调度任务分配
export function assignDispathTask (data) {
  return request({
    url: 'task/assignTask',
    method: 'put',
    data
  })
};

// 调度任务延迟
export function delayDispathTask (data) {
  return request({
    url: 'task/delay',
    method: 'put',
    data
  })
};

// 调度任务取消
export function cancelDispathTask (data) {
  return request({
    url: 'task/cancel',
    method: 'put',
    data
  })
};

// 调度任务编辑(单病人)
export function editDispathTaskSingle (data) {
  return request({
    url: 'task/updateTransForApp',
    method: 'post',
    data
  })
};

// 预约任务列表查询(单病人)
export function appointList (state,proId) {
    return request({
      url: `bookTask/index/queryTask?state=${state}&proId=${proId}`,
      method: 'get'
    })
  };

// 预约任务检查类型查询
export function getAppointCheckType (state,proId,typeName) {
  return request({
    url: `taskTypeClass/queryByTypeName?state=${state}&proId=${proId}&typeName=${encodeURI(typeName)}`,
    method: 'get'
  })
};

// 预约任务创建
export function createAppoint (data) {
  return request({
    url: 'bookTask/save',
    method: 'post',
    data
  })
};

// 预约任务分配
export function assignAppointTask (data) {
  return request({
    url: 'bookTask/assignTask',
    method: 'put',
    data
  })
};

// 预约任务延迟
export function delayAppointTask (data) {
  return request({
    url: 'bookTask/delayTask',
    method: 'put',
    data
  })
};

// 预约任务取消
export function cancelAppointTask (data) {
  return request({
    url: 'bookTask/cancelTask',
    method: 'put',
    data
  })
};

// 预约任务编辑

export function editAppoint (data) {
  return request({
    url: 'bookTask/modify',
    method: 'put',
    data
  })
};

// 查询创建预约任务、调度任务时是否配置接触隔离选项
export function queryTransConfig (proId, key) {
  return request({
    url: `paramConfig/queryByKey?proId=${proId}&key=${key}`,
    method: 'get'
  })
};