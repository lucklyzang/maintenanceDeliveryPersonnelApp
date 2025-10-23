<template>
  <div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
	<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
	<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
		<div class="nav">
			<NavBar title="任务呼叫" leftText="首页" path="/home" />
		</div>
	</div>
    <div class="content">
			<div class="trans-type">
				<div class="trans-type-title">
					运送类型
				</div>
				<div class="trans-type-content">
					<div class="trans-list" v-for="(item,index) in transTypeList" :key="item.value" @click="transTypeEvent(item,index)">
						<div class="list-top">
							<img src="@/common/img/circle-background.png" />
							<img v-if="item.text == '标本'" src="@/common/img/sample-icon.png" />
							<img v-if="item.text == '检查'" src="@/common/img/examine-icon.png" />
							<img v-if="item.text == '药物文书'" src="@/common/img/medicine-icon.png" />
						</div>
						<div class="list-bottom">{{ item.text }}</div>
					</div>
				</div>
			</div>
    </div>
	<div class="tab-bar">
		<van-tabbar v-model="valueName" @change="tabBarEvent" active-color="#1684FC" inactive-color="#666666">
			<van-tabbar-item>
				<span>呼叫</span>
				<template #icon="props">
					<img :src="props.active ? require('@/common/img/call-active-icon.png') : require('@/common/img/call-inactive-icon.png')" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item>
				<span>实时任务</span>
				<template #icon="props">
					<img :src="props.active ? require('@/common/img/real-timetask-active-icon.png') : require('@/common/img/real-timetask-inactive-icon.png')" />
				</template>
			</van-tabbar-item>
			<van-tabbar-item>
				<span>历史任务</span>
				<template #icon="props">
					<img :src="props.active ? require('@/common/img/historical-task-active-icon.png') : require('@/common/img/historical-task-inactive-icon.png')" />
				</template>
			</van-tabbar-item>
		</van-tabbar>
	</div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import { queryTransportTypeClass } from '@/api/transport.js'
import NavBar from "@/components/NavBar";
export default {
  components: {
	NavBar
  },
  data() {
    return {
		infoText: '加载中···',
		tierNum: 0,
		valueName: 0,
		transTypeList: [],
		showLoadingHint: false
    }
  },
	
  mounted() {
	this.parallelFunctionTwo();
	this.valueName = 0;
  },

  watch: {},

  computed: {
    ...mapGetters([
			"userInfo",
			'statusBarHeight',
			'navigationBarHeight',
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

  methods: {
    ...mapMutations([
		]),
		 
		 // 运送类型点击事件
		 transTypeEvent (item,index) {
			this.$router.push({ path: "/transCallTask",query: item })
		 },
		 
		 //运送类型
		 parallelFunctionTwo() {
		 	this.showLoadingHint = true;
		 	Promise.all([this.getTransportsType()])
		 		.then((res) => {
		 			this.showLoadingHint = false;
		 			if (res && res[0] && res[0].length > 0) {
		 				let [item1] = res;
		 				if (item1) {
		 					this.transTypeList = [];
		 					for (let item of item1) {
								if (item.typeName == '标本' || item.typeName == '检查' || item.typeName == '药物文书') {
									this.transTypeList.push({
										value: item.id,
										text: item.typeName
									})
								}	
		 					}
		 				}
		 			}
		 		})
		 		.catch((err) => {
		 			this.showLoadingHint = false;
		 			this.$refs.uToast.show({
		 				title: `${err}`,
		 				type: 'warning'
		 			})
		 		})
		 },
		 
		 // 查询运送类型分类
		 getTransportsType() {
		 	return new Promise((resolve, reject) => {
		 		queryTransportTypeClass({
		 				proId: this.proId,
		 				state: 0
		 			}).then((res) => {
		 				if (res && res.data.code == 200) {
		 					resolve(res.data.data)
		 				}
		 			})
		 			.catch((err) => {
		 				reject(err.message)
		 			})
		 	})
		 },
		 
		 // tabBar点击事件
		 tabBarEvent (index) {
			 this.valueName = index;
			 if (this.valueName == 0) {
				this.$router.push({ path: "/transIndex" })
			 } else if (this.valueName == 1) {
				this.$router.push({ path: "/transRealtimeTask" })
			 } else if (this.valueName == 2) {
				this.$router.push({ path: "/transHistoricalTask" })
			 }
		 } 
  }
};
</script>
<style lang='less' scoped>
	@import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
.content-box {
  .content-wrapper();
  height: 100vh !important;
  box-sizing: border-box;
  background: #f6f6f6;
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
	.tab-bar {
		height: 51px;
		border: 1px solid #f1f1f1;
		/deep/ .van-tabbar {
			background: #F8F8F8;
			.van-tabbar-item--active {
				background: #F8F8F8;
			}
		}
	};
  .content {
		 flex: 1;
		 overflow: auto;
		 padding: 8px 4px;
		 box-sizing: border-box;
		 position: relative;
		 background: #F8F8F8;
		 .trans-type {
		 	padding: 10px 10px 20px 10px;
		 	box-sizing: border-box;
		 	width: 98%;
		 	margin: 0 auto;
		 	background: #fff;
		 	border-radius: 10px;
		 	.trans-type-title {
		 		font-size: 16px;
		 		color: #242424;
		 		font-weight: bold;
		 		margin-bottom: 20px;
		 	};
		 	.trans-type-content {
		 		display: flex;
		 		flex-wrap: wrap;
		 		.trans-list {
		 			width: 25%;
		 			display: flex;
		 			flex-direction: column;
		 			.list-top {
		 				width: 50px;
		 				height: 50px;
						position: relative;
		 				>img {
							&:nth-child(1) {
								width: 50px;
								height: 50px;
								position: absolute;
								top: 0;
								left: 0
							};
							&:nth-child(2) {
								width: 24px;
								height: 24px;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%,-50%)
							};
		 				}
		 			};
		 			.list-bottom {
						width: 50px;
						text-align: center;
		 				margin-top: 10px;
		 				font-size: 16px;
		 				color: #101010;
		 			};
					&:nth-child(2) {
						width: 35% !important;
						align-items: center;
					};
					&:nth-child(3) {
						width: 40% !important;
						align-items: center;
						.list-bottom {
							width: 70px !important
						}
					}
		 		}
		 	}
		 }
  }
}
</style>