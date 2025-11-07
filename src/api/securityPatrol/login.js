import request from '@/utils/request'

// 获取阿里云签名接口
export function getAliyunSign() {
	return request({
	    url: 'nblink/patrol/oss/getSign',
	    method: 'get'
	})
}