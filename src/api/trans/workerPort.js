import request from '@/utils/request'
import store from '@/store';
// 查询总量和排序
export function queryAllTaskMessage(data) {
  return request({
    url: `trans/worker/countRank`,
    method: 'get',
    params: data
  })
};

// 获取是否有新任务
export function getNewWork(proId,workerId) {
  return request({
    url: `trans/worker/getNew/${proId}/${workerId}`,
    method: 'get'
  })
};

// 获取所有任务数量
export function getAllTaskNumber(proID,workerId) {
  return request({
    url: `trans/worker/taskCount/${proID}/${workerId}`,
    method: 'get'
  })
};

/**
 * 调度任务
*/

// 查询调度任务(分配给本人的)
export function getDispatchTaskMessage(proID,workerId,state) {
  return request({
    url: store.getters.templateType == 'template_one' ? `trans/task/allTask/${proID}/${workerId}/?state=${state}` : `trans/dispatch/allTask/${proID}/${workerId}/?state=${state}`,
    method: 'get',
  })
};
// 查询调度任务(分配给本人的已完成)
export function getDispatchTaskComplete(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'trans/task/queryTask':'trans/dispatch/queryTask',
    method: 'get',
    params: data
  })
};
// 查询调度任务(根据id)
export function getDispatchTaskMessageById(taskId,tempFlag) {
  return request({
    url: store.getters.templateType == 'template_one' ? `trans/task/query/${taskId}/${tempFlag}` : `trans/dispatch/app/query/${taskId}`,
    method: 'get'
  })
};
// 调度任务的操作(更新、延迟、取消)
export function updateDispatchTask(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'trans/task/update':'trans/dispatch/update',
    method: 'put',
    data
  })
};
// 获取调度任务的操作
export function getDispatchTask(taskId,workerId,tempFlag) {
  return request({
    url: store.getters.templateType == 'template_one' ? `trans/task/getTransTask/${taskId}/${workerId}/${tempFlag}` : `trans/dispatch/getTransTask/${taskId}/${workerId}`,
    method: 'get'
  })
};
// 调度任务退回原因查询
export function querySendBackDispatchTaskReason(proId,type) {
  return request({
    url: 'trans/back/dict',
    method: 'get',
    params: {
      proId,
      type
    }
  })
};
// 调度任务退回接口
export function sendBackDispatchTask(proId,taskId,reason,tempFlag) {
  return request({
    url: store.getters.templateType == 'template_one' ? `trans/task/sendBack/${proId}/${taskId}/${tempFlag}?reason=${reason}` : `trans/dispatch/sendBack/${proId}/${taskId}?reason=${reason}`,
    method: 'get'
  })
};
// 调度任务批量取消
export function cancelDispatchTaskBatch(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'trans/task/batchCancel' : 'trans/dispatch/batchCancel',
    method: 'put',
    data
  })
};

// 取消原因查询
export function queryDispatchTaskCancelReason(data) {
  return request({
    url: 'trans/cancel/queryAll',
    method: 'get',
    params: data
  })
};

// 退回原因查询
export function queryAppointTaskSendbackReason(data) {
  return request({
    url: 'trans/undo/queryAll',
    method: 'get',
    params: data
  })
};

// 调度任务的转移
export function transferDispatchTask(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'trans/task/transfer' : 'trans/dispatch/transfer',
    method: 'put',
    data
  })
};
// 任务取消原因查询
export function queryTaskCancelReason(data) {
  return request({
    url: 'trans/cancel/queryAll',
    method: 'get',
    params: data
  })
};
// 任务延迟原因查询
export function queryTaskDelayReason(data) {
  return request({
    url: 'trans/delay/queryAll',
    method: 'get',
    params: data
  })
};

// 校验调度任务扫描科室信息
export function judgeDispatchTaskDepartment(data) {
  return request({
    url: store.getters.templateType == 'template_one' ? 'trans/task/checkTransTask' : 'trans/dispatch/checkTransTask',
    method: 'post',
    data
  })
};

// 调度任务上传拍照信息
export function dispatchTaskUploadMsg(data) {
  return request({
    url: 'trans/taskPhoto/saveOrUpdatePhotoByString',
    method: 'post',
    data
  })
};

// 根据ID查询调度任务详情
export function queryDispatchTaskMessage(taskId) {
  return request({
    url: store.getters.templateType == 'template_one' ? `trans/task/query/${taskId}` : `trans/dispatch/queryOne/${taskId}`,
    method: 'get'
  })
};

/**
 * 循环任务
*/

// 查询循环任务
export function queryCirculationTask(data) {
  return request({
    url: 'trans/circleTask/workerTask',
    method: 'get',
    params: data
  })
};

// 查询循环任务(根据id)
export function getCirculationTaskMessageById(id) {
  return request({
    url: `trans/circleTask/query/${id}`,
    method: 'get'
  })
};

// 查询标本信息
export function querySampleMessage(data) {
  return request({
    url: 'trans/specimen/queryAll',
    method: 'get',
    params: data
  })
};

// 查询检查项
export function queryCheckEntry(data) {
  return request({
    url: 'trans/collectionItem/queryAll',
    method: 'get',
    params: data
  })
};

// 判断科室是否为指定的科室
export function judgeDepartment(data) {
  return request({
    url: 'trans/circleTask/verifySpaces',
    method: 'get',
    params: data
  })
};

// 循环任务标本信息收集
export function collectSampleInfo(data) {
  return request({
    url: 'trans/taskSpecimen/specimens',
    method: 'post',
    data
  })
};

// 标本送达信息
export function samplesArrived(data) {
  return request({
    url: 'trans/taskSpecimen/arrive',
    method: 'put',
    data
  })
};

// 根据项目ID和任务ID查询收集的标本信息
export function queryCollectSampleMessage(proId,taskId) {
  return request({
    url: `trans/taskSpecimen/specimen/${proId}/${taskId}`,
    method: 'get'
  })
};

// 标本送达信息
export function sampleDelivery(data) {
  return request({
    url: 'trans/taskSpecimen/arrive',
    method: 'put',
    data
  })
};

// 循环任务更新
export function updateCirculationTask(data) {
  return request({
    url: 'trans/circleTask/update',
    method: 'put',
    data
  })
};

// 获取循环情况接口
export function getCirculationCondition(data) {
  return request({
    url: 'trans/circleTask/circleCondition',
    method: 'get',
    params: data
  })
};

// 获取循环任务详情
export function queryCirculationTaskMessage(id, date) {
  return request({
    url: `trans/circleTask/circleTaskDetial/${id}/${date}`,
    method: 'get'
  })
};

/**
 * 新循环任务
 */

// 搜集标本信息
export function collectNewCircleSampleMessage(data) {
  return request({
    url: 'trans/circlePackage/collect',
    method: 'put',
    data
  })
};

// 查询标本信息
export function queryNewCircleSampleMessage(data) {
  return request({
    url: 'trans/circlePackage/arriveQuery',
    method: 'get',
    params: data
  })
};

// 查询任务详情
export function queryNewCircleTaskDetails(taskId) {
  return request({
    url: `trans/circlePackage/info/${taskId}`,
    method: 'get'
  })
};

// 查询科室标本交接情况
export function queryNewCircleTaskComplete(data) {
  return request({
    url: 'trans/circlePackage/finish',
    method: 'get',
    params: data
  })
};

/**
 * 预约任务
*/

// 查询预约任务
export function queryAppointTaskMessage(data) {
  return request({
    url: 'trans/bookTask/queryTask',
    method: 'get',
    params: data
  })
};

// 根据ID查询预约任务详情
export function queryAppointTaskDetailsMessage(taskId) {
  return request({
    url: `trans/bookTask/query/${taskId}`,
    method: 'get'
  })
};

// 查询调度任务(分配给本人的已完成)
export function getAppointTaskComplete(data) {
  return request({
    url: 'trans/reserve/queryTask',
    method: 'get',
    params: data
  })
};

// 预约任务的获取
export function updateAppointTaskMessage(data) {
  return request({
    url: 'trans/bookTask/confirm',
    method: 'put',
    data
  })
};

// 任务转移
export function transferAppointTask(data) {
  return request({
    url: 'trans/bookTask/transfer',
    method: 'put',
    data
  })
};

// 任务取消
export function cancelAppointTask(data) {
  return request({
    url: 'trans/bookTask/cancelTask',
    method: 'put',
    data
  })
};

// 任务退回
export function sendbackAppointTask(data) {
  return request({
    url: 'trans/bookTask/undoTask',
    method: 'put',
    data
  })
};


// 校验病人信息
export function judgeAppointTaskCheckPatient(data) {
  return request({
    url: 'trans/bookTask/checkPatient',
    method: 'put',
    data
  })
};

// 校验起始科室
export function judgeAppointTaskCheckDepartment(data) {
  return request({
    url: 'trans/bookTask/checkDepartment',
    method: 'put',
    data
  })
};

// 校验检查项科室
export function judgeAppointTaskCheckItem(data) {
  return request({
    url: 'trans/bookCheckItem/verify',
    method: 'put',
    data
  })
};

// 客户预约信息确认
export function sureCustomerAppointInfo (data) {
  return request({
    url: 'trans/bookTask/saveSign',
    method: 'put',
    data
  })
};

// 预约任务检查科室完成
export function checkItemsCompleted (data) {
  return request({
    url: 'trans/bookCheckItem/complete',
    method: 'put',
    data
  })
};

// 预约任务完成
export function appointTaskCompleted (data) {
  return request({
    url: 'trans/bookTask/completeTask',
    method: 'put',
    data
  })
};

// 预约任务签名完成
export function appointTaskSignCompleted (data) {
  return request({
    url: 'trans/bookTask/complete/sign',
    method: 'put',
    data
  })
};

// 查询预约任务结束原因
export function getAppointTaskEndReason(data) {
  return request({
    url: 'trans/complete/queryAll',
    method: 'get',
    params: data
  })
};