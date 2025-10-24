<template>
	<div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
	<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
	<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
		<div class="nav">
			<NavBar title="选择位置" path="/cleanCallTask" />
		</div>
	</div>
	 <div class="content">
			<van-empty description="暂无数据" v-show="emptyShow" />
			<!-- 建筑 -->
			<div class="departments-name-list" v-for="(item) in architectureList" :key="item.id" v-show="architectureShow"
				@click="architectureClickEvent(item)"
			>
					<div class="departments-name-left">
						<span>建筑</span>
						<span>
							{{ item.structName }}
						</span>
					</div>
					<div class="departments-name-right">
						<van-icon name="arrow" color="#174E97" size="24" />
					</div>
			</div>
			<!-- 科室 -->
			<div class="departments-name-list" v-for="(item) in departmentList" :key="item.id" v-show="departmentShow"
				@click="departmentClickEvent(item)"
			>
					<div class="departments-name-left">
						<span>科室</span>
						<span>
							{{ item.departmentName }}
						</span>
					</div>
					<div class="departments-name-right">
						<van-icon name="arrow" color="#174E97" size="24" />
					</div>
			</div>
			<!-- 目的区域 -->
			<div class="departments-name-list" v-for="(item) in goalAreaList" :key="item.id" v-show="goalAreaShow"
				@click="goalAreaClickEvent(item)"
			>
					<div class="departments-name-left">
						<span>区域</span>
						<span>
							{{ item.itemName }}
						</span>
					</div>
					<div class="departments-name-right">
						<van-icon name="arrow" color="#174E97" size="24" />
					</div>
			</div>
			<!-- 功能区 -->
			<div class="departments-name-list" v-for="(item) in functionAreaList" :key="item.id" v-show="functionAreaShow"
				@click="functionAreaClickEvent(item)"
			>
					<div class="departments-name-left">
						<span>功能区</span>
						<span>
							{{ item.name }}
						</span>
					</div>
					<div class="departments-name-right">
						<van-icon name="arrow" color="#174E97" size="24" />
					</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { getArchitectureMessage, getGoalAreaMessage, getFunctionAreaMessage, getDepartmentMessage } from '@/api/environment.js'
	import NavBar from "@/components/NavBar";
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中···',
				emptyShow: false,
				architectureShow: false,
				architectureList: [],
				selectArchitectureValue: [],
				departmentShow: false,
				departmentList: [],
				selectDepartmentValue: [],
				goalAreaShow: false,
				goalAreaList: [],
				selectgoalAreaValue: [],
				functionAreaShow: false,
				functionAreaList: [],
				selectFunctionAreaValue: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				'locationMessage',
				'chooseHospitalArea'
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
			this.getArchitecture()
		},
		methods: {
			...mapMutations([
				'storeLocationMessage'
			]),
			
			// 顶部导航返回事件
			backTo () {
				if (this.architectureShow) {
					uni.navigateBack()
				} else if (this.departmentShow) {
					this.emptyShow = false;
					this.departmentShow = false;
					this.architectureShow = true;
				} else if (this.goalAreaShow) {
					this.emptyShow = false;
					this.goalAreaShow = false;
					this.departmentShow = true;
				} else if (this.functionAreaShow) {
					this.emptyShow = false;
					this.functionAreaShow = false;
					this.goalAreaShow = true;
				}
			},
			
			// 获取建筑
			getArchitecture () {
				this.showLoadingHint = true;
				this.emptyShow = false;
				this.architectureShow = true;
				this.architectureList = [];
				getArchitectureMessage({proId: this.proId}).then((res) => {
						this.showLoadingHint = false;
						this.functionAreaShow = false;
						this.goalAreaShow = false;
						this.departmentShow = false;
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								this.architectureList = res.data.data;
							} else {
								this.emptyShow = true
							}
						} else {
							that.$dialog.alert({
								message: res.data.msg,
								closeOnPopstate: true
							}).then(() => {
							})
						}
					}).
					catch((err) => {
						that.$dialog.alert({
							message: err,
							closeOnPopstate: true
						}).then(() => {
						});
						this.showLoadingHint = false
				})
			},
	
			// 获取科室
			getDepartment () {
				this.emptyShow = false;
				this.showLoadingHint = true;
				this.functionAreaShow = false;
				this.goalAreaShow = false;
				this.architectureShow = false;
				this.departmentShow = true;
				this.departmentList = [];
				getDepartmentMessage({proId: this.proId,structId: this.selectArchitectureValue[0]['id']}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								this.departmentList = res.data.data
							} else {
								this.emptyShow = true
							}
						} else {
							that.$dialog.alert({
								message: res.data.msg,
								closeOnPopstate: true
							}).then(() => {
							})
						}
					}).
					catch((err) => {
						that.$dialog.alert({
							message: err,
							closeOnPopstate: true
						}).then(() => {
						});
						this.showLoadingHint = false;
				})
			},
	
			// 获取目的区域
			getGoalArea () {
				this.emptyShow = false;
				this.showLoadingHint = true;
				this.departmentShow = false;
				this.functionAreaShow = false;
				this.architectureShow = false;
				this.goalAreaShow = true;
				this.goalAreaList = [];
				getGoalAreaMessage({proId: this.proId,status: 1}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								this.goalAreaList = res.data.data
							} else {
								this.emptyShow = true
							}
						} else {
							that.$dialog.alert({
								message: res.data.msg,
								closeOnPopstate: true
							}).then(() => {
							})
						}
					}).
					catch((err) => {
						that.$dialog.alert({
							message: err,
							closeOnPopstate: true
						}).then(() => {
						});
						this.showLoadingHint = false;
				})
			},
	
			// 获取功能区
			getFunctionArea () {
				this.emptyShow = false;
				this.showLoadingHint = true;
				this.goalAreaShow = false;
				this.departmentShow = false;
				this.architectureShow = false;
				this.functionAreaShow = true;
				this.functionAreaList = [];
				getFunctionAreaMessage({hospitalId: this.proId}).then((res) => {
						this.showLoadingHint = false;
						if (res && res.data.code == 200) {
							if (res.data.data.length > 0) {
								this.functionAreaList = res.data.data
							} else {
								this.emptyShow = true
							}
						} else {
							that.$dialog.alert({
								message: res.data.msg,
								closeOnPopstate: true
							}).then(() => {
							})
						}
					}).
					catch((err) => {
						that.$dialog.alert({
							message: err,
							closeOnPopstate: true
						}).then(() => {
						});
						this.showLoadingHint = false;
				})
			},
	
			// 建筑点击事件
			architectureClickEvent (item) {
				this.selectArchitectureValue = [];
				this.selectArchitectureValue.push(item);
				this.getDepartment()
			},
	
			// 科室点击事件
			departmentClickEvent (item) {
				this.selectDepartmentValue = [];
				this.selectDepartmentValue.push(item);
				this.getGoalArea()
			},
	
			// 目的区域点击事件
			goalAreaClickEvent (item) {
				this.selectgoalAreaValue = [];
				this.selectgoalAreaValue.push(item);
				this.getFunctionArea()
			},
	
			// 功能区点击事件
			functionAreaClickEvent(item) {
				this.selectFunctionAreaValue = [];
				this.selectFunctionAreaValue.push(item);
				this.$router.push({ path: "/cleanCallTask" });
				let temporary = [];
				let temporaryMessage = temporary.concat(this.selectArchitectureValue,this.selectDepartmentValue,this.selectgoalAreaValue,this.selectFunctionAreaValue);
				this.storeLocationMessage(temporaryMessage)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";	
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content-box {
		.content-wrapper();
		height: 100vh !important;
		box-sizing: border-box;
		background: #fff;
		.top-background-area {
			width: 100%;
			background: #3890EE;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 10
		};
		.nav {
			width: 100%;
			/deep/ .tabBar-box {
				.van-nav-bar {
					.van-nav-bar__left {
						.van-icon {
							color: #fff !important;
							font-size: 20px !important;
						};
						.van-nav-bar__text {
							color: #fff !important;
							font-size: 14px !important;
							margin-left: 10px;
						}
					};
					.van-nav-bar__title {
						color: #fff !important;
						font-size: 14px !important;
					}
				}	
			}
		};
		.content {
			flex: 1;
			display: flex;
			flex-direction: column;
			padding-top: 6px;
			box-sizing: border-box;
			position: relative;
			overflow: auto;
			/deep/ .van-empty {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%)
			};
			.departments-name-list {
					width: 100%;
					padding: 10px 8px;
					box-sizing: border-box;
					background: #fff;
					border-top: 1px solid #BBBBBB;
					border-bottom: 1px solid #BBBBBB;
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 10px;
					.departments-name-left {
							flex: 1;
							font-size: 16px;
							color: #101010;
							padding-right: 8px;
							box-sizing: border-box;
							word-break: break-all;
							>span {
								&:nth-child(1) {
									margin-right: 8px
								}
								&:nth-child(2) {
									color: #174E97
								}
							}
					};
					.departments-name-right {
							font-size: 14px;
							/deep/ .u-icon {
								vertical-align: middle
							}
					}
			}
		}
	}
</style>
