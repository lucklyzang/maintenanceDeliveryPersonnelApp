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
		chooseHospitalArea: {}
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