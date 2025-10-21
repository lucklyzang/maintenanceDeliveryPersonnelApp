import request from '@/utils/request'
import Qs from 'qs'

// 查询任务类型
export function queryTaskType(data) {
  return request({
    url: 'project/bxTaskType/queryAll',
    method: 'get',
    params: data
  })
};

// 查询目的地(科室)
export function queryAllDestination(proId) {
  return request({
    url: `project/department/dict/${proId}`,
    method: 'get'
  })
};

// 根据科室查询房间信息
export function departmentRoom(data) {
  return request({
    url: 'project/bxSpace/loadData',
    method: 'get',
    params: data
  })
};

// 巡检问题上报
export function reportProblem(data) {
  return request({
    url: 'project/bxTask/reportProblem',
    method: 'post',
    data
  })
};

// 查询工程任务列表
export function getMaintainTask(data) {
  return request({
    url: 'project/bxTask/queryTask',
    method: 'get',
    params: data
  })
};

// 任务取消
export function projectTaskCancel(data) {
  return request({
    url: 'project/bxTask/cancelTask',
    method: 'put',
    data
  })
};

// 工程任务催单
export function projectTaskReminder(proId,taskId) {
  return request({
    url: `project/bxTask/reminder/${proId}/${taskId}`,
    method: 'get'
  })
};

// 任务取消原因
export function projectTaskCancelReason(data) {
  return request({
    url: 'project/cancel/queryAll',
    method: 'get',
    params: data
  })
};


// // 维修任务列表查询
// export function repairsList (state,proId,flag,workId) {
// 	return request({
// 		url: `project/bxTask/new/queryTask?state=${state}&proId=${proId}&flag=${flag}&workId=${workId}`,
// 		method: 'get'
// 	})
// };

// // 维修任务取消
// export function cancelRepairsTask (data) {
//   return request({
//     url: 'project/bxTask/cancelTask',
//     method: 'put',
//     data
//   })
// };

// // 维修任务取消原因查询
// export function queryRepairsTaskCancelReason(proId) {
//   return request({
//     url: `project/cancel/queryAll?proId=${proId}`,
//     method: 'get'
//   })
// };

// 维修任务详情查询
export function repairsDetails (id) {
  return request({
    url: `project/bxTask/query/${id}`,
    method: 'get'
  })
};

// 维修任务图片查询
export function repairsImage (data) {
  return request({
    url: 'project/bxRepairTaskImage/queryAll',
    method: 'get',
		params: data
  })
};

// // 维修任务任务类型查询
// export function getRepairsTaskType (proId) {
//   return request({
//     url: `project/bxTaskType/init/${proId}`,
//     method: 'get'
//   })
// };

// // 维修任务创建
// export function createRepairsTask (data) {
//   return request({
//     url: 'project/bxTask/add',
//     method: 'post',
//     data
//   })
// };

// // 维修任务编辑
// export function editRepairsTask (data) {
//   return request({
//     url: 'project/bxTask/update',
//     method: 'put',
//     data
//   })
// };

// // 维修任务工具查询
// export function queryRepairsTaskTool(proId) {
//   return request({
//     url: `project/bxTool/queryAll?proId=${proId}`,
//     method: 'get'
//   })
// };

// // 维修任务物料查询
// export function queryRepairsTaskMaterial(proId) {
//   return request({
//     url: `project/bxMaterial/queryAllFromStorageServer?proId=${proId}`,
//     method: 'get'
//   })
// };

// // 查询建筑信息
// export function queryStructure(proId) {
//   return request({
//     url: `project/structure/queryAll?proId=${proId}`,
//     method: 'get'
//   })
// };

// // 查询科室信息
// export function queryDepartment(proId,structId) {
//   return request({
//     url: `project/department/queryAll?proId=${proId}&structId=${structId}`,
//     method: 'get'
//   })
// };

// 查询空间信息
export function querySpace(proId,depId) {
  return request({
    url: `project/bxSpace/queryAll?proId=${proId}&depId=${depId}`,
    method: 'get'
  })
};

// // 查询维修员
// export function getTransporter(proId) {
//   return request({
//     url: `project/worker/workerList/${proId}`,
//     method: 'get'
//   })
// };
