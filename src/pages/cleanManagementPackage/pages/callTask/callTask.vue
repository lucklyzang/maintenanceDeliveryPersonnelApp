<template>
	<view class="content-box">
		<u-transition :show="showLoadingHint" mode="fade-down">
			<view class="loading-box" v-if="showLoadingHint">
				<u-loading-icon :show="showLoadingHint" :text="infoText" size="18" textSize="16"></u-loading-icon>
			</view>
		</u-transition>
		<light-hint ref="alertToast"></light-hint>
		<view class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></view>
		<u-toast ref="uToast"></u-toast>
		<view class="nav">
			<nav-bar :home="false" :isShowBackText="true" :isHomeText="true" backState='3000' fontColor="#FFF" bgColor="none" title="任务呼叫" @backClick="backTo">
			</nav-bar> 
		</view>
		<view class="content">
			<view class="result-picture">
				<view>
					图片
				</view>
				<view class="image-list">
					<view v-for="(item, index) in resultimageList" :key="index">
						<image :src="item" />
						<view class="icon-box"  @click="issueDelete(index)">
								<u-icon name="trash" color="#d70000"></u-icon>
						</view>    
					</view>
					<view @click="getImg">
						<u-icon name="plus" size="30" color="#101010"></u-icon>
					</view>
				</view>
			</view>
			<view class="category-box">
				<view class="category-title">
						<text>*</text>
						<text>优先级</text>
				</view>
				<view class="select-box">
					<u-radio-group v-model="priorityRadioValue" direction="horizontal">
						<u-radio name="1" activeColor="#289E8E" labelColor="#289E8E" label="正常"></u-radio>
						<u-radio name="2" activeColor="#E8CB51" labelColor="#E8CB51" label="重要"></u-radio>
						<u-radio name="3" activeColor="#F2A15F" labelColor="#F2A15F" label="紧急"></u-radio>
						<u-radio name="4" activeColor="#E86F50" labelColor="#E86F50" label="紧急重要"></u-radio>
					</u-radio-group>
				</view>
			</view>
			<view class="category-box location-box">
				<view class="category-title">
						<text>*</text>
						<text>位置</text>
				</view>
				<view class="select-box" @click="locationEvent">
					<text>{{ locationValue }}</text>
					<u-icon name="arrow-right" color="#101010" size="20"></u-icon>
				</view>
			</view>
			<view class="enter-remark">
				<view>
					问题描述
				</view>
				<view class="remark-box">
					<u--textarea v-model="enterRemark" count maxlength="500" placeholder="请输入问题描述"></u--textarea>
				</view>
			</view>
		</view>
		<view class="btn-box">
		  <text class="operate-one" @click="resetEvent">重置</text>
			<text class="operate-two" @click="submitEvent">提交</text>
		</view>
		<u-modal :show="deleteInfoDialogShow" title="确定删除此图片?"
			:closeOnClickOverlay="true" @close="deleteInfoDialogShow = false"
			confirmColor="#218FFF" showCancelButton
			@confirm="sureDeleteEvent"
			@cancel="deleteInfoDialogShow=false"
			>
		</u-modal>
		<view class="tab-bar">
			<u-tabbar
			  :value="valueName"
			  @change="tabBarEvent"
			  :placeholder="false"
				activeColor="#3890EE"
				:fixed="true"
			  :safeAreaInsetBottom="true"
				hover-class="hover-effect"
			>
			  <u-tabbar-item text="呼叫">
			    <image
			  	  class="u-page__item__slot-icon"
			  		style="width:19px;height:18px"
			      slot="active-icon"
			      src="/static/img/call-active-icon.png"
			    ></image>
			    <image
			  	  class="u-page__item__slot-icon"
			      slot="inactive-icon"
			  		style="width:19px;height:18px"
			      src="/static/img/call-inactive-icon.png"
			    ></image>
			  </u-tabbar-item>
			  <u-tabbar-item text="实时任务">
			    <image
			  	  class="u-page__item__slot-icon"
			  		style="width:19px;height:18px"
			      slot="active-icon"
			      src="/static/img/real-timetask-active-icon.png"
			    ></image>
			    <image
			  	  class="u-page__item__slot-icon"
			  		style="width:19px;height:18px"
			      slot="inactive-icon"
			      src="/static/img/real-timetask-inactive-icon.png"
			    ></image>
			  </u-tabbar-item>
			  <u-tabbar-item text="历史任务">
			    <image
			  	  class="u-page__item__slot-icon"
			  		style="width:19px;height:18px"
			      slot="active-icon"
			      src="/static/img/historical-task-active-icon.png"
			    ></image>
			    <image
			  	  class="u-page__item__slot-icon"
			  		style="width:19px;height:18px"
			      slot="inactive-icon"
			      src="/static/img/historical-task-inactive-icon.png"
			    ></image>
			  </u-tabbar-item>
			</u-tabbar>
		</view>
	</view>
</template>

<script>
	import store from '@/store'
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import {
		setCache,
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { addForthwithCleanTask } from '@/api/environment.js'
	import navBar from "@/components/zhouWei-navBar"
	import LightHint from "@/components/light-hint/light-hint.vue"
	export default {
		components: {
			navBar,
			LightHint
		},
		data() {
			return {
				showLoadingHint: false,
				isShowNoData: false,
				infoText: '加载中···',
				photoBox: false,
				valueName: 0,
				imageIndex: '',
				isExpire: false,
				deleteInfoDialogShow: false,
				enterRemark: "",
				locationValue: '请选择位置',
				
				priorityRadioValue: '1',
				resultimageList: [],
				imageOnlinePathArr: [],
				fileList: []
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'statusBarHeight',
				'navigationBarHeight',
				"timeMessage",
				"ossMessage",
				"locationMessage",
			  'chooseHospitalArea'
			  ]),
			  userName() {
			  	return this.userInfo['name']
			  },
			  proName () {
			    return this.userInfo['proName']
			  },
			  proId() {
			  	return this.userInfo['proId']
			  },
			  workerId() {
			  	return this.userInfo['user']['id']
			  },
			  depId() {
			  	return this.userInfo['depId'] === null ? '' : this.userInfo['depId']
			  },
			  depName() {
			  	return this.userInfo['depName'] === null ? '' : this.userInfo['depName']
			  },
			  userAccount() {
			  	return this.userInfo['userName']
			  }
		},
		onShow() {
		  this.echoLoactionMessage();
		},
		methods: {
			...mapMutations([
				"changeTimeMessage",
				"changeOssMessage",
				"storeLocationMessage",
				"storeCurrentIndex"
			]),
			
			// 顶部导航返回事件
			backTo () {
				this.resetEvent();
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			
			// 重置事件
			resetEvent () {
				this.storeLocationMessage([]);
			  this.enterRemark = "";
			  this.locationValue = '请选择位置';
			  this.priorityRadioValue = '1';
			  this.resultimageList = [];
			  this.imageOnlinePathArr = [];
			  this.fileList = []
			},
		// 回显位置信息
		echoLoactionMessage () {
			if (this.locationMessage.length == 4) {
				this.locationValue = `${this.locationMessage[0]['structName']}-${this.locationMessage[1]['departmentName']}-${this.locationMessage[2]['itemName']}-${this.locationMessage[3]['name']}`
			}
		},

		// 位置点击事件
		locationEvent () {
			uni.navigateTo({
				url: '/cleanManagementPackage/pages/callTask/choosePosition'
			})
		},

		// 格式化时间
		getNowFormatDate(currentDate) {   
				let seperator1 = "-";
				let seperator2 = ":";
				let month = currentDate.getMonth() + 1;
				let strDate = currentDate.getDate();
				let hours = currentDate.getHours();
				let strMinutes = currentDate.getMinutes();
				if (month >= 1 && month <= 9) {
						month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
						strDate = "0" + strDate;
				}
				if (strMinutes >= 0 && strMinutes <= 9) {
						strMinutes = "0" + strMinutes;
				}
				if (hours >= 0 && hours <= 9) {
					hours = "0" + hours;
				}
				let currentdate = currentDate.getFullYear() + seperator1 + month + seperator1 + strDate
								+ " " + hours + seperator2 + strMinutes
				return currentdate;
		},

		// 选择图片方法
		getImg() {
			if (this.resultimageList.length == 5) {
				this.$refs.uToast.show({
					message: "至多只能上传5张图片",
					position: 'center'
				});
				return
			};
			let that = this;
			uni.chooseImage({
				count: 5,
				sizeType: ['original', 'compressed'],
				sourceType: ['album', 'camera'],
				success: function(res) {
					uni.previewImage({
						urls: res.tempFilePaths
					});
					for (let imgI = 0, len = res.tempFilePaths.length; imgI < len; imgI++) {
						let url = res.tempFiles[imgI].path;
						//获取最后一个的位置
						let index = url.lastIndexOf(".");
						//获取后缀
						let jpgUrl = url.substr(index + 1);
						if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
							that.$refs.uToast.show({
								message: '只可上传jpg或png格式的图片!',
								type: 'error',
								position: 'center'
							});
							continue
						};
						let isLt2M = res.tempFiles[imgI].size/1024/1024 < 10;
						if (!isLt2M) {
							that.$refs.uToast.show({
								message: '图片必须小于10MB!',
								type: 'error',
								position: 'center'
							});
							continue
						};
						that.fileList.push(res.tempFiles[imgI]['path']);
						uni.getFileSystemManager().readFile({
							filePath: res.tempFilePaths[imgI],
							encoding: 'base64',
							success: res => {
								let base64 = 'data:image/jpeg;base64,' + res.data;
								that.resultimageList.push(base64);
							}
						})
					}
				}
			})
		},
		
		// 上传图片到服务器
		uploadFileEvent (imgI) {
			this.infoText = '图片上传中···';
			this.showLoadingHint = true;
			return new Promise((resolve, reject) => {
				uni.uploadFile({
				 url: 'https://show.blinktech.cn/clean/oss/upload',
				 filePath: imgI,
				 name: 'files',
				 header: {
					'content-type': 'multipart/form-data',
					'Authorization': `${store.getters.token}`
				 },
				 success: (res) => {
					if (res.statusCode == 200) {
						if (res.data != '') {
							let temporaryData = JSON.parse(res.data);
							if (temporaryData.code == 200) {
								this.imageOnlinePathArr.push(temporaryData.data[0]);
								resolve()
							} else {
								this.showLoadingHint = false;
								this.$refs.uToast.show({
									message: temporaryData.msg,
									type: 'error',
									position: 'center'
								});
								reject()
							}
						} else {
							this.showLoadingHint = false;
							this.$refs.uToast.show({
								message: '返回数据为空',
								type: 'error',
								position: 'center'
							});
							reject()
						}	
					} else {
						this.showLoadingHint = false;
						this.$refs.uToast.show({
							message: '上传图片失败',
							type: 'error',
							position: 'center'
						});
						reject()
					}
				 },
				 fail: (err) => {
					this.showLoadingHint = false;
					this.$refs.uToast.show({
						message: err.errMsg,
						type: 'error',
						duration: 5000,
						position: 'center'
					});
					reject()
				 }
				})
			})
		},

		// 任务提交事件
		async submitEvent() {
			if (this.locationMessage.length != 4) {
				this.$refs.uToast.show({
						message: '请选择位置',
				});
				return
			};
			let paramsData = {
				createId: this.workerId,
				managerId: this.workerId, // 保洁主管id，当前登陆人员id
				managerName: this.userName,// 保洁主管姓名，当前登陆人员姓名
				assignId: '', // 任务分配人员id，当前登陆人员id
				assignName: '',// 任务分配人员姓名，当前登陆人员姓名
				workerId: '',//保洁员id
				priority: this.priorityRadioValue, //优先级
				workerName: '',//保洁员姓名
				path: [], // 上传的问题图片，集合,
				taskType: 0,// 任务类型，即时保洁为 0
				structureId: this.locationMessage[0]['id'], // 建筑id
				structureName: this.locationMessage[0]['structName'], // 建筑名称
				depId: this.locationMessage[1]['id'], // 科室id
				depName: this.locationMessage[1]['departmentName'], // 科室名称
				areaImmediateId: this.locationMessage[2]['id'], // 目的区域id
				areaImmediateName: this.locationMessage[2]['itemName'], // 目的区域名称
				spaces: [],
				taskRemark: this.enterRemark, // 任务备注信息
				proId: this.proId, // 所属项目id
				proName: this.proName // 所属项目名称
			};
			// 上传图片到服务器
			if (this.fileList.length > 0) {
				for (let imgI of this.fileList) {
					await this.uploadFileEvent(imgI)
				};
				paramsData.path = this.imageOnlinePathArr
			};
			paramsData.spaces.push({
				id: this.locationMessage[3]['id'],
				name: this.locationMessage[3]['name']
			});
			this.addForthwithCleanTaskEvent(paramsData) 
		},

		// 添加环境任务
		addForthwithCleanTaskEvent (data) {
		 this.infoText = '提交中···';
		 this.showLoadingHint = true;
			addForthwithCleanTask(data).then((res) => {
				 this.showLoadingHint = false;
					this.imageOnlinePathArr = [];
					this.fileList = [];
					if (res && res.data.code == 200) {
						this.$refs.alertToast.show({
							type: 'success',
							message: '提交成功!',
							isShow: true
						});
						this.resetEvent();
						setTimeout(() => {
							this.backTo();
						},2000);
					} else {
						this.$refs.alertToast.show({
							type: 'error',
							message: res.data.msg,
							isShow: true
						})
					}
				}).
				catch((err) => {
					this.$refs.alertToast.show({
						type: 'error',
						message: err,
						isShow: true
					});
					this.imageOnlinePathArr = [];
					this.fileList = [];
					this.showLoadingHint = false;
			})
		},
			
			// 结果照片删除
			issueDelete(index) {
				this.deleteInfoDialogShow = true;
				this.imageIndex = index
			},


			// 确定删除提示框确定事件
			sureDeleteEvent () {
				this.resultimageList.splice(this.imageIndex, 1);
				this.fileList.splice(this.imageIndex, 1);
				this.deleteInfoDialogShow = false;
			},
			
			// tabBar点击事件
				tabBarEvent (index) {
				 this.valueName = index;
				 if (this.valueName == 0) {
					 uni.redirectTo({
						url: '/cleanManagementPackage/pages/callTask/callTask'
					 })
				 } else if (this.valueName == 1) {
					 uni.redirectTo({
						url: '/cleanManagementPackage/pages/realtimeTask/realtimeTask'
					 })
				 } else if (this.valueName == 2) {
					 uni.redirectTo({
						url: '/cleanManagementPackage/pages/historicalTask/historicalTask'
					 })
				 }
			} 
	
		}
	}
</script>

<style lang="scss">
	@import "~@/common/stylus/variable.scss";
	page {
		width: 100%;
		height: 100%;
	};
	.content-box {
		@include content-wrapper;
		height: 100vh !important;
		box-sizing: border-box;
		background: #fff;
		::v-deep .u-popup {
			flex: none !important
		};
		::v-deep .u-loading-icon {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%,-50%);
			z-index: 200000;
		};
		::v-deep .u-transition {
			z-index: 100000 !important;
		};
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
		};
		.tab-bar {
			height: 85px;
			.hover-effect {
			  transform: scale(1.1);
			  transition: transform 0.2s ease;
			};
			::v-deep {
				.u-tabbar {
					height: 100%;
					.u-tabbar__content {
						background: #F8F8F8;
						.u-tabbar-item {
							transition: none;
						};
						.u-tabbar-item.active {
						  transform: scale(1.1); /* 轻微放大 */
						  transition: transform 0.2s ease; /* 平滑过渡 */
						}
					}
				}
			}
		};
		 .content {
		    flex: 1;
		    display: flex;
		    background: #fff;
		    flex-direction: column;
		    padding: 6px 0;
		    overflow: auto;
		    .category-box {
		      padding: 0 8px;
					min-height: 38px;
		      margin-bottom: 6px;
		      height: 40px;
		      box-sizing: border-box;
		      display: flex;
		      background: #fff;
		      justify-content: space-between;
		      align-items: center;
		      .category-title {
		        font-size: 14px;
		        color: #101010;
		        >text {
		            &:first-child {
		                color: red
		            }
		        }
		      };
		      .select-box {
		        flex: 1;
		        width: 0;
						display: flex;
						align-items: center;
						justify-content: flex-end;
		        >text {
							display: inline-block;
							padding-left: 10px;
							flex: 1;
							text-align: right;
							color: #174E97 !important;
							font-size: 14px !important;
							margin-right: 4px;
							@include no-wrap();
						};
						/deep/ .u-radio-group {
							display: flex;
							justify-content: space-between;
							.u-radio {
								flex: 1 0 auto !important;
								justify-content: center;
								.u-radio__label {
									margin-right: 9px;
								}
							}
						}
		      }
		    };
		    .location-box {
		      .select-box {
		        text-align: right;
		        padding-left: 4px;
		        box-sizing: border-box;
		        display: flex;
		        align-items: center;
		        >text {
		          font-size: 14px;
		          &:nth-child(1) {
		            flex: 1;
		            @include no-wrap();
		            color: #101010 !important;
		            vertical-align: middle
		          }
		        };
		        /deep/ .van-icon {
		          vertical-align: middle
		        }
		      }
		    };
		    .completeDate-box {
		        .select-box {
		          text-align: right;
		            >text {
		              font-size: 14px;
		              vertical-align: middle;
		                color: #174E97
		            };
		            /deep/ .u-icon {
		              vertical-align: middle
		            }
		        }
		    };
		    .result-picture {
		      padding: 14px 8px;
		      margin-bottom: 6px;
		      box-sizing: border-box;
		      display: flex;
		      background: #fff;
		      justify-content: space-between;
		      > view {
		        font-size: 14px;
		        color: #101010;
		        &:first-child {
		        }
		        &:nth-child(2) {
		          margin-left: 8px;
		          display: flex;
		          flex-wrap: wrap;
		          flex: 1;
		          > view {
		            width: 31%;
		            height: 100px;
		            vertical-align: top;
		            margin-right: 2%;
		            margin-top: 2%;
		            position: relative;
		            &:nth-child(1) {
		              margin-top: 0;
		            }
		            &:nth-child(2) {
		              margin-top: 0;
		            }
		            &:nth-child(3) {
		              margin-top: 0;
		            }
		            &:nth-child(3n + 3) {
		              margin-right: 0;
		            }
		            .icon-box {
									position: absolute;
									bottom: 0;
									right: 0;
									display: flex;
									width: 100%;
									padding: 2px 0;
									box-sizing: border-box;
									justify-content: center;
									align-items: center;
									background: #616161;
									/deep/ .van-icon {}  
		            };
		            image {
		              width: 100%;
									height: 80px;
		            }
		            &:last-child {
		             display: flex;
		             justify-content: center;
		             align-items: center;
		              background: #f2f2f2;
		              /deep/ .u-icon {
		                position: relative;
		                top: 0;
		                right: 0;
		              }
		            }
		          }
		        }
		      }
		    }
		    .enter-remark {
		      padding: 14px 8px;
		      margin-bottom: 6px;
		      box-sizing: border-box;
		      display: flex;
					flex-direction: column;
		      > view {
		        font-size: 14px;
		        color: #101010;
		        &:first-child {
							margin-bottom: 10px;
		        };
		        &:nth-child(2) {
		          /deep/ .u-cell {
		            padding: 4px !important;
		            border: 1px solid #cacaca;
		          }
		        }
		      }
		    }
		  };
			.btn-box {
				width: 90%;
				margin: 0 auto;
				height: 100px;
				display: flex;
				align-items: center;
				justify-content: center;
				>text {
					width: 35%;
					display: inline-block;
					height: 45px;
					font-size: 14px;
					line-height: 45px;
					background: #fff;
					text-align: center;
					border-radius: 4px;
					&:nth-child(1) {
						color: #2B98FE;
						border: 1px solid #2B98FE;
						box-sizing: border-box;
						box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
						margin-right: 30px
					};
					&:nth-child(2) {
						color: #fff;
						background: #2B98FE;
						box-shadow: 0px 2px 6px 0 rgba(0, 0, 0, 0.4);
					}
				}
			}
	}
</style>
