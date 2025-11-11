// 登录信息store的初始值
export function getDefaultLoginState() {
	return {
		userInfo: {},
		token: null, //请求token,
		affairToken: null, //事务订单专用token
		isLogin: false,
		overDueWay: false,
		isMedicalMan: true,
		templateType: '',
		socketOpen: false,
		appPermission: {},
		chooseHospitalArea: {},
		timeMessage: {},
		ossMessage: {}
	}	
}

// 公共信息store的初始值
export function getDefaultCommonState() {
	return {
		//状态栏高度
		statusBarHeight: 0,
		//导航栏栏高度
		navigationBarHeight: 0,
		// 胶囊信息
		capsuleMessage: {},
		// 各种类型订单取消原因
		allOrderCancelReason: {
			cancelReason: {},
			environmentCancelReason: {},
			projectCancelReason: {},
			affairCancelReason: {}
		},
		// 生产域名 https://blinktech.cn
		// 开发域名 https://blink.blinktech.cn
		// 准生产域名 https://ver.blinktech.cn
		// 测试域名 https://show.blinktech.cn
		baseURL: 'https://show.blinktech.cn'
	}
}

/*
 * 中央运送相关模块store初始值
*/

//预约任务store初始值
export function getDefaultTransAppointTaskState() {
	return {
		appointTaskMessage: {},
		appointTaskTransferIdList: [],
		isFreshAppointTaskPage: true,
		originalSignature: '',
		completeSweepcodeDestinationInfo: [],
		completeSweepcodeDepartureInfo: [],
		completeCheckedItemInfo: []
	}
}

// 缓存组件store初始值
export function getDefaultTransCatchComponentsState() {
	return {
		catch_components: ['dispatchTask','AddTask']
	}
}

//循环任务store初始值
export function getDefaultTransCirculationTaskState() {
	return {
		arriveDepartmentId: false,
		storeArriveDeparnmentId: '',
		circulationTaskMessage: null,
		currentElectronicSignature: '',
		circulationCollectMessageList: [],
		isCollectEnterSweepCodePage: false,
		circulationConnectMessageList: [],
		isrefreshCirculationConnectPage: false,
		completeDeparnmentInfo: [],
		stipulateOfficeList: [],
		storeAlreadyConnectSample: [],
		storeNoConnectSample: [],
		isDeleteEcho: false,
		isDeleteCancel: false,
		isClickSure: false,
		circulationDetails: null,
		verifyCirculationOfficeId: '',
		verifyNewCirculationOfficeId: '',
		isFreshCirculationTaskPage: true,
		circulationTaskId: '',
		// 新循环任务采集过的标本信息
		isCompleteSampleList: []
	}
}

//调度任务store初始值
export function getDefaultTransDispatchTaskState() {
	return {
		navTopTitle: '中央运送',
		dispatchTaskMessage: null,
		dispatchTaskTransferIdList: [],
		dispatchTaskCancelIdList: [],
		dispatchTaskState: '',
		dispatchTaskId: '',
		dispatchTaskDepartmentType: '',
		isCoerceTakePhoto: false,
		isCompleteSweepCode: [],
		isCompleteSweepCodeDestinationList: [],
		isDispatchTaskFirstSweepCode: true,
		isCompletePhotoList: [],
		isBack: '',
		isSign: '',
		isSingleDestination: '',
		showEndTaskBtn: false,
		isFreshDispatchTaskPage: true,
		currentDepartmentNumber: [],
		photoAreaBoxShow: false,
		isCallDispatchSweepcodeMethod: true,
		isCompleteDispatchIssuePhotoList: []
	}
}

//medicalTask store初始值
export function getDefaultTransMedicalTaskState() {
	return {
		transportantTaskMessage: null,
		taskTranceMsg: ''
	}
}

//taskScheduling store初始值
export function getDefaultTransTaskSchedulingState() {
	return {
		// 任务调度类型
		schedulingTaskType: {},
		// 任务调度详情
		schedulingTaskDetails: {},
		//操作按钮点击记录
		operateBtnClickRecord: {
		  allocationBtnClick: false,
		  delayBtnClick: false,
		  cancelBtnClick: false
		},
		// 暂存创建调度任务的信息
		temporaryStorageCreateDispathTaskMessage: {},
		// 暂存创建预约任务的信息
		temporaryStorageCreateAppointTaskMessage: {}
	}
}

//transLogin store初始值
export function getDefaultTransTransLoginState() {
	return {
		isTemplateOne: 0,
		// 是否扫码登录
		loginSweepCode: false,
		// 用户身份
		userType: '',
		departmentInfoList: {},
		departmentInfoListNo: {},
		newTaskName: [],
		taskDetailsMessage: {},
		taskType: '',
		globalTimer: null,
		globalCircleTimer: null,
		isFreshHomePage: false,
		isNewCircle: false
	}
}

/*
 * 工程维修相关模块store初始值
*/

// 自主任务模块store的初始值
export function getDefaultAutoRepairTaskState() {
    return {
        createAutoRepairTaskMessage: {}, //创建自主报修任务信息(暂存)
        submitAutoRepairTaskMessage: {}, //提交自主报修任务信息
		projectGlobalTimer: null
    }
}

// departmentService模块store的初始值
export function getDefaultDepartmentServiceState() {
    return {
        isFreshDepartmentServicePage: true,
		departmentServiceMsg: {},
		isSingleDepartmentSignature: true,
		isDepartmentServiceVerifySweepCode: [],
		isCurrentDepartmentServiceVerifySweepCode: [],
		departmentServiceOfficeId: '',
		completeDepartmentServiceOfficeInfo: [],
		currentDepartmentServiceCheckedItemId: null,
		completeDepartmentServiceCheckedItemList: []
    }
}

// deviceService模块store的初始值
export function getDefaultDeviceServiceState() {
    return {
        isFreshDeviceServicePage: true,
		deviceServiceMsg: {},
		energyRecordList: [],
		isCurrentDeviceCopyServiceVerifySweepCode: [],
		currentDeviceCopyVerifySweepCodeDepNumber: '',
		completeDeviceEnergyRecordServiceOfficeInfo: []
    }
}

// repairsWorkOrder模块store的初始值
export function getDefaultRepairsWorkOrderState() {
    return {
		newProjectTaskName: [],
		isFreshRepairsWorkOrderPage: true,
		repairsWorkOrderMsg: {},
		completeRoomList: [],
		isFillMaterialList: [],
		isCompleteRepairsWorkOrderPhotoList: []
    }
}

// taskScheduling模块store的初始值
export function getDefaultTaskSchedulingState() {
    return {
		// 任务调度相关信息
		schedulingTaskAboutMessage: {},
		// 暂存创建维修任务的信息
		temporaryStorageCreateRepairsTaskMessage: {}
    }
}

/*
 * 保洁管理相关模块store初始值
*/

// 保洁管理信息store的初始值
export function getDefaultEnvironmentManagementState() {
    return {
		permissionInfo: [], //权限列表
		roleNameList: [], //角色列表
		chooseProject: [], //选择的医院 
		currentCleanTaskName: {},
		cleanTaskDetails: {},
		attendanceTypeDetailsMessage: {},
		personnelStatisticsDetailsMessage: {},
		locationMessage: [],
		attendanceStatisticsSwitchMessage: {},
		storageForthwithTaskMessage: [],
		storageSpecialTaskMessage: [],
		pollingTaskDepartmentMessage: {},
		pollingTaskDepartmentFunctionalZoneMessage: {},
		pollingTaskCurrentShowTime: ''
    }
}


/*
 * 设备巡检相关模块store初始值
*/


// 登录信息store的初始值
export function getEquipmentPatrolDefaultLoginState() {
    return {
        equipmentPatrolGlobalTimer: null
    }
}

// 巡检任务模块store的初始值
export function getDefaultPatrolTaskState() {
    return {
        patrolTaskListMessage: [], //巡查任务列表信息
        enterPatrolAbnormalRecordPageSource: '',
        devicePatrolDetailsSelectMessage: {}, // 设备巡检详情页选中的任务集名称和时间点信息
        patrolTaskDeviceChecklist: [], // 巡检任务设备检查单信息
        patrolTaskAbnormalCheckItemEventList: [], // 异常检查项事件列表信息
        historyPatrolTaskAbnormalCheckItemEventList: [], // 历史异常检查项事件列表信息
        historyPatrolTaskDetails: [], // 历史巡检任务详情信息
        historyPatrolTaskAbnormalRecordDetails: {}, // 历史异常记录详情信息
        historyPatrolTaskDeviceChecklist: [], // 历史巡检任务设备检查单信息
        patrolTaskAbnormalRecordList: [], // 巡检任务异常记录列表信息
        historyPatrolTaskDateMessage: {} // 历史巡检任务选择的日期信息
    }
}

// 点检任务模块store的初始值
export function getSpotCheckTaskState() {
    return {
        enterHistoryEquipmSpotTaskListPageSource: ''
    }
}

// 点检任务调度管理模块store的初始值
export function getSpotTaskDispatchingManagementState() {
    return {
    }
}

/*
 * 安全巡更相关模块store初始值
*/

// 登录信息store的初始值
export function getDefaultSecurityPatrolLoginState() {
    return {
        securityPatrolGlobalTimer: null
    }
};

// 巡更模块store的初始值
export function getDefaultSecurityPatrolPatrolTaskState() {
    return {
        securityPatrolTaskType: {}, //任务类型
        taskOrderType: {}, //任务工单类型
        departmentCheckList: {
            depId: '',
            checkItemList: []
        }, // 科室检查项信息
        enterProblemRecordMessage: {}, //进入问题记录页时携带的相关信息
        securityPatrolTaskListMessage: {}, //巡查任务列表信息
        currentElectronicSignature: null, // 工单完成时的签名信息
        originalSignature: null //// 工单完成时原始签名信息
    }
};

// 事件登记模块store的初始值
export function getDefaultEventRegisterState() {
    return {
        temporaryStorageRepairsRegisterMessage: [], //暂存事件登记(工程报修)信息
        temporaryStorageOtherRegisterMessage: [], //暂存事件登记(其他)信息
        temporaryStorageClaimRegisterMessage: [], //暂存事件登记(拾金不昧)信息
        temporaryStorageHistoryClaimRegisterMessage: [], //暂存历史事件登记(拾金不昧)信息
        enterEventRegisterPageMessage: {}, // 进入事件登记页的信息
        moreEventMessage: {}, // 更多信息
        claimRegisterElectronicSignatureMessage: {receiverSignature:[]} //拾金不昧签名相关信息
    }
};

// 留言簿模块store的初始值
export function getDefaultGuestbookState() {
    return {
        enterPostMessagePageMessage: {}, // 进入留言发布页的信息,
        isEnterGuestBookPageFromHomePage: false, // 是否从首页进入过留言簿页
        lastMessageNumber: null, //上次留言数量
        currentScrollTop: 0 // 留言簿列表当前滚动距离
    }
};