<template>
	<div class="content">
		 <!-- <div class="nav">
        	<NavBar path="/home" title="个人中心" />
    	</div> -->
		<div class="top-background-area"></div>
		<!-- 顶部标题 -->
		<div class="topTabbar" :style="{ 'height': navigationBarHeight + 'px', 'lineHeight': navigationBarHeight + 'px'}">
				<div class="title-left">
					<img :src="homeIconPng" />
					<span>新茂医信</span>
				</div>
				<div class="title-center">
					智慧后勤服务平台
				</div>
		</div>
		<div class="home-banner-area">
            <img :src="homeBannerPng" />
		</div>
		<div class="content-box">
			<div class="service-management">
				<div class="service-management-title">
					服务管理
				</div>
				<div class="service-management-content">
					<div class="service-list" v-for="(item,index) in hasAuthserviceManagementSystemsList" :key="index" @click="serviceManagementEvent(item,index)">
						<div class="list-top">
							<img :src="item.url" />
						</div>
						<div class="list-bottom">{{ item.text }}</div>
					</div>
				</div>
			</div>
			<div class="service-management safe-management">
				<div class="service-management-title">
					安全管理
				</div>
				<div class="service-management-content">
					<div class="service-list" v-for="(item,index) in safeList" :key="index" @click="safeManagementEvent(item,index)">
						<div class="list-top">
							<img :src="item.url" />
						</div>
						<div class="list-bottom">{{ item.text }}</div>
					</div>
				</div>
			</div>
		</div>
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<FooterBottom></FooterBottom>  
	</div>
</template>
<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import FooterBottom from "@/components/FooterBottom";
	import NavBar from "@/components/NavBar";
	export default{
		components: {
			FooterBottom
		},
		data() {
			return {
				showLoadingHint: false,
				triangleRectListInfoShow: false,
				infoText: '加载中···',
                homeIconPng: require('@/common/images/home/home-icon.png'),
                homeBannerPng: require('@/common/images/home/home-banner.png'),
				hasAuthserviceManagementSystemsList: [
					{
						text: '中央运送',
						value: 'trans',
						url: require('@/common/images/home/trans-icon.png')
					},
					{
						text: '工程维修',
						value: 'project',
						url: require('@/common/images/home/project-icon.png')
					},
					{
						text: '保洁管理',
						value: 'clean',
						url: require('@/common/images/home/clean-icon.png')
					}
				],
				serviceList: [
					{
						text: '中央运送',
						value: 'trans',
						url: require('@/common/images/home/trans-icon.png')
					},
					{
						text: '工程维修',
						value: 'project',
						url: require('@/common/images/home/project-icon.png')
					},
					{
						text: '保洁管理',
						value: 'clean',
						url: require('@/common/images/home/clean-icon.png')
					}
				],
				hasAuthsafeManagementSystemsList: [
					{
						text: '安全巡更',
						value: 'safePatrol',
						url: require('@/common/images/home/safe-patrol-icon.png')
					},
					{
						text: '设备巡检',
						value: 'equipmentPatrol',
						url: require('@/common/images/home/equipment-patrol-icon.png')
					}
				],
				safeList: [
					{
						text: '安全巡更',
						value: 'safePatrol',
						url: require('@/common/images/home/safe-patrol-icon.png')
					},
					{
						text: '设备巡检',
						value: 'equipmentPatrol',
						url: require('@/common/images/home/equipment-patrol-icon.png')
					}
				]
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'socketOpen',
				'statusBarHeight',
				'navigationBarHeight',
				'capsuleMessage',
				'chooseHospitalArea',
				'appPermission'
			]),
			userName() {
			  return this.userInfo['worker']['name']
			},
			workerId() {
				return this.userInfo['worker']['id']
			},
			proName () {
			  return this.chooseHospitalArea['text']
			},
			proId() {
				return this.chooseHospitalArea['value']
			},
			depId() {
				return this.userInfo['worker']['departments'].length == 0 ? '' : this.userInfo['worker']['departments'][0]['id']
			},
			depName() {
				return this.userInfo['worker']['departments'].length == 0 ? '' : this.userInfo['worker']['departments'][0]['name']
			},
			userAccount() {
				return this.userInfo['worker']['account']
			}
		},
		
		mounted() {
			// this.controlServiceManageModuleShowEvent()
		},
		
		methods: {
			...mapMutations([
				'changeSocketOpen',
				'storeCurrentIndex',
				'storeLocationMessage'
			]),
			
			// 控制服务管理模块显示隐藏
			controlServiceManageModuleShowEvent () {
				this.hasAuthserviceManagementSystemsList = [];
				if (this.appPermission.hasOwnProperty('systems')) {
					this.serviceList.map((value,index,arr) => {
						if (this.appPermission['systems'].indexOf(value['value']) != -1) {
							this.hasAuthserviceManagementSystemsList.push(value)
						}
					})
				}
			},
			
			// 格式化时间
			getNowFormatDate(currentDate,type) {
				// type:1(只显示小时分钟秒),2(只显示年月日)3(只显示年月)4(显示年月日小时分钟秒)5(显示月日)
				let currentdate;
				let strDate = currentDate.getDate();
				let seperator1 = "-";
				let seperator2 = ":";
				let seperator3 = " ";
				let month = currentDate.getMonth() + 1;
				let hour = currentDate.getHours();
				let minutes = currentDate.getMinutes();
				let seconds = currentDate.getSeconds();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				};
				if (hour >= 0 && hour <= 9) {
					hour = "0" + hour;
				};
				if (minutes >= 0 && minutes <= 9) {
					minutes = "0" + minutes;
				};
				if (seconds >= 0 && seconds <= 9) {
					seconds = "0" + seconds;
				};
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				};
				if (type == 1) {
					currentdate = hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 2) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
				};
				if (type == 3) {
					currentdate = currentDate.getFullYear() + seperator1 + month
				};
				if (type == 4) {
					currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate + seperator3 + hour + seperator2 + minutes + seperator2 + seconds
				};
				if (type == 5) {
					currentdate = month + seperator1 + strDate
				};
				return currentdate
			},
			
			// px转换成rpx
			rpxTopx(px){
				let deviceWidth = uni.getSystemInfoSync().windowWidth;
				let rpx = ( 750 / deviceWidth ) * Number(px);
				return Math.floor(rpx)
			},
			
			// 服务管理项点击事件
			serviceManagementEvent (item,index) {
				if (item.text == '中央运送') {
					this.$router.push({ path: "/transHome" })
				} else if (item.text == '工程维修') {
					this.$router.push({ path: "/projectHome" })
				} else if (item.text == '保洁管理') {
					this.$router.push({ path: "/cleanHome" })
				}
			},

			
			// 安全管理项点击事件
			safeManagementEvent (item,index) {
				if (item.text == '安全巡更') {
					this.$router.push({ path: "/transIndex" })
				} else if (item.text == '设备巡检') {
					this.$router.push({ path: "/equipmentPatrolHome" })
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content {
		.content-wrapper();
		height: 100vh !important;
		padding: 0 2px;
		box-sizing: border-box;
		position: relative;
		background: #F8F8F8;
		.top-background-area {
			width: 100%;
			position: absolute;
			top: 0;
			left: 0
		};
    	.topTabbar {
			width: 100%;
			display: flex;
			box-sizing: border-box;
			align-items: center;
			position: relative;
			.title-left {
				padding-left: 8px;
				box-sizing: border-box;
				>img {
					width: 23px;
					margin-right: 2px;
					vertical-align: middle;
				};
				>sapn {
					font-size: 12px;
					color: #3370FF;
					vertical-align: middle;
				}
			};
			.title-center {
				flex: 1;
				padding-left: 15%;
				font-size: 14px;
				color: #101010;
			}
		};
		.home-banner-area {
			margin-top: 10px;
			height: 150px;
			>img {
				width: 100%;
				height: 100%;
			}
		};
		.content-box {
			position: relative;
			flex: 1;
			height: 0;
			display: flex;
			flex-direction: column;
			margin-top: 10px;
			.service-management {
				padding: 10px 10px 20px 10px;
				box-sizing: border-box;
				width: 98%;
				max-height: 25vh;
				overflow: auto;
				margin: 0 auto;
				background: #fff;
				border-radius: 10px;
				.service-management-title {
					font-size: 16px;
					color: #242424;
					font-weight: bold;
					margin-bottom: 16px;
				};
				.service-management-content {
					display: flex;
					flex-wrap: wrap;
					.service-list {
						width: 25%;
						display: flex;
						flex-direction: column;
						.list-top {
							width: 50px;
							height: 50px;
							display: flex;
							align-items: center;
							justify-content: center;
							background: #3370FF;
							border-radius: 12px;
							>img {
								width: 32px;
								height: 32px;
							}
						};
						.list-bottom {
							margin-top: 10px;
							font-size: 12px;
							color: #101010;
						}
					};
					>div {
						&:nth-child(2) {
							.list-top {
								background: #FC8F66 !important;
							} 
						};
						&:nth-child(3) {
							.list-top {
								background: #4CC9E4 !important;
							} 
						}
					}
				}
			};
			.safe-management {
				margin-top: 10px;
				max-height: 25vh;
				overflow: auto;
				>div {
					&:nth-child(2) {
							.list-top {
								background: #4CC9E4 !important;
							} 
						};
				}
			}
		};
		.loading-box {
			height: 35px;
			display: flex;
			align-items: center;
			justify-content: center
		};
	}
</style>