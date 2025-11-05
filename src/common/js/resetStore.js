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
		catch_components: ['dispatchTask']
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
		newTaskName: '',
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
        submitAutoRepairTaskMessage: {} //提交自主报修任务信息
    }
}

// departmentService模块store的初始值
export function getDefaultDepartmentServiceState() {
    return {
        isFreshDepartmentServicePage: true,
		departmentServiceMsg: '',
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
		deviceServiceMsg: '',
		energyRecordList: [],
		isCurrentDeviceCopyServiceVerifySweepCode: [],
		currentDeviceCopyVerifySweepCodeDepNumber: '',
		completeDeviceEnergyRecordServiceOfficeInfo: []
    }
}

// repairsWorkOrder模块store的初始值
export function getDefaultRepairsWorkOrderState() {
    return {
		isFreshRepairsWorkOrderPage: true,
		repairsWorkOrderMsg: '',
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