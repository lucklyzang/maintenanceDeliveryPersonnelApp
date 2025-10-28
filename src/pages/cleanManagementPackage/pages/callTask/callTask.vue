<template>
	<div class="content-box" :style="{ 'padding-top': statusBarHeight + 'px' }">
		<van-overlay :show="overlayShow" />
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + 'px' }">
			<div class="nav">
				<NavBar title="任务呼叫" path="/home" leftText="首页" />
			</div>
		</div>
		<div class="content">
			<div class="result-picture">
				<div>
					图片
				</div>
				<div class="img-list">
					<div v-for="(item, index) in resultimageList" :key="index">
						<img :src="item" />
						<div class="icon-box"  @click="issueDelete(index)">
							<van-icon name="delete-o" color="#d70000" />
						</div>    
					</div>
					<div @click="getImg">
						<van-icon name="plus" color="#101010" size="36px" />
					</div>
				</div>
			</div>
			<div class="category-box">
				<div class="category-title">
						<span>*</span>
						<span>优先级</span>
				</div>
				<div class="select-box">
					<van-radio-group v-model="priorityRadioValue" direction="horizontal">
						<van-radio name="1" checked-color="#289E8E">正常</van-radio>
						<van-radio name="2" checked-color="#F2A15F">重要</van-radio>
						<van-radio name="3" checked-color="#E8CB51">紧急</van-radio>
						<van-radio name="4" checked-color="#E86F50">紧急重要</van-radio>
              		</van-radio-group>
				</div>
			</div>
			<div class="category-box location-box">
				<div class="category-title">
						<span>*</span>
						<span>位置</span>
				</div>
				<div class="select-box" @click="locationEvent">
					<span>{{ locationValue }}</span>
					<van-icon name="arrow" color="#101010" size="20" />
				</div>
			</div>
			<div class="enter-remark">
				<div>
					问题描述
				</div>
				<div class="remark-box">
					<van-field
						v-model="enterRemark"
						rows="3"
						autosize
						show-word-limit
						maxlength="500" 
						placeholder="请输入问题描述"
						type="textarea"
					/>
				</div>
			</div>
		</div>
		<div class="btn-box">
		  <span class="operate-one" @click="resetEvent">重置</span>
		  <span class="operate-two" @click="submitEvent">提交</span>
		</div>
		<van-dialog v-model="deleteInfoDialogShow" title="确定删除此图片?" :close-on-click-overlay="true"  @close="deleteInfoDialogShow = false"
		  show-cancel-button @confirm="sureDeleteEvent" @cancel="deleteInfoDialogShow" confirm-button-color="#3890EE">
		</van-dialog>
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
		<transition name="van-slide-up">
			<div class="choose-photo-box" v-show="photoBox">
			<div class="choose-photo">
				<van-icon name="photo" />
				<input name="uploadImg1" id="demo1" @change="previewFileOne" type="file" accept="image/album"/>从图库中选择
			</div>
			<div class="photo-graph">
				<van-icon name="photograph" />
				<input name="uploadImg2" id="demo2"  @change="previewFileTwo" type="file" accept="image/camera"/>拍照
			</div>
			<div class="photo-cancel" @click="photoCancel">取消</div>
			</div>
		</transition>
	</div>
</template>

<script>
	import store from '@/store'
	import axios from 'axios';
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import { compress } from '@/common/js/utils'
	import { addForthwithCleanTask } from '@/api/environment.js'
	import NavBar from "@/components/NavBar";
	export default {
		name: "cleanCallTask",
		components: {
			NavBar
		},
		data() {
			return {
				showLoadingHint: false,
				overlayShow: false,
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
				fileList: [],
				fromPath: ''
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
		beforeRouteEnter(to, from, next) {
			next(vm => {
			vm.fromPath = from['path']
			})
		},
		activated() {
			this.valueName = 0;
			this.echoLoactionMessage();
			if (this.fromPath == '/home') {
				this.resetEvent()
			}
		},
		methods: {
			...mapMutations([
				"changeTimeMessage",
				"changeOssMessage",
				"storeLocationMessage",
				"storeCurrentIndex"
			]),
			
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
			this.$router.push({ path: "/cleanChoosePosition"})
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

		// 拍照问题照片点击
		getImg () {
			this.photoBox = true;
			this.overlayShow = true
		},

		// 图片上传预览
		previewFileOne() {
			let Orientation;
			let file = document.getElementById("demo1").files[0];
			this.fileList.push(file);
			let _this = this;
			let reader = new FileReader();
			let index = file['name'].lastIndexOf(".");
			//获取后缀
			let jpgUrl = file['name'].substr(index + 1);
			if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
				that.$dialog.alert({
					message: '只可上传jpg或png格式的图片!',
					closeOnPopstate: true
				}).then(() => {
				});
				return
			};
			let isLt2M = file.size/1024/1024 < 10;
			if (!isLt2M) {
				this.$dialog.alert({
					message: '上传图片大小不能超过10MB!',
					closeOnPopstate: true
				}).then(() => {
				});
				return
			};  
			reader.addEventListener("load", function () {
				_this.photoCancel();
				// 压缩图片
				let result = reader.result;
				let img = new Image();
				img.src = result;
				img.onload = function () {
					let src = compress(img,Orientation);
					_this.resultimageList.push(src)
				}
			}, false);
			if (file) {
				reader.readAsDataURL(file);
			};
		},

		//拍照预览
		previewFileTwo() {
			let Orientation;
			let file = document.getElementById("demo2").files[0];
			this.fileList.push(file);
			let _this = this;
			let reader = new FileReader();
			let index = file['name'].lastIndexOf(".");
			//获取后缀
			let jpgUrl = file['name'].substr(index + 1);
			if (jpgUrl != "png" && jpgUrl != "jpg" && jpgUrl != "jpeg") {
				that.$dialog.alert({
					message: '只可上传jpg或png格式的图片!',
					closeOnPopstate: true
				}).then(() => {
				});
				return
			};
			let isLt2M = file.size/1024/1024 < 10;
			if (!isLt2M) {
				_this.$dialog.alert({
					message: '上传图片大小不能超过10MB!',
					closeOnPopstate: true
				}).then(() => {
				});
				return
			};  
			reader.addEventListener("load", function () {
				_this.photoCancel();
				// 压缩图片
				let result = reader.result;
				let img = new Image();
				img.src = result;
				img.onload = function () {
					let src = compress(img,Orientation);
					_this.resultimageList.push(src)
				}
			}, false);
			if (file) {
				reader.readAsDataURL(file);
			};
		},

		// 拍照取消
		photoCancel () {
			this.photoBox = false;
			this.overlayShow = false
		},
		
		// 上传图片到服务器
		uploadFileEvent (imgI) {
			this.infoText = '图片上传中···';
			this.showLoadingHint = true;
			return new Promise((resolve, reject) => {
				const imgPath = new FormData();
				imgPath.append('files',imgI)
				axios({
					url: 'http://show.blinktech.cn/clean/oss/upload',
					method: 'post',
					data: imgPath,
					headers: {
						'Authorization': `${store.getters.token}`,
						'HTTP_REQUEST_TYPE': 'new'
					},
				}).then(res => {
					if (res.data.code == 200) {
						if (res.data.data.length > 0) {
							this.imageOnlinePathArr.push(res.data.data[0]);
							resolve()
						} else {
							this.showLoadingHint = false;
							this.$dialog.alert({
								message: '返回数据为空',
								closeOnPopstate: true
							}).then(() => {
							});
							reject()
						}	
					} else {
						this.showLoadingHint = false;
						this.$dialog.alert({
							message: res.data.msg,
							closeOnPopstate: true
						}).then(() => {
						});
						reject()
					}
				}).catch(err => {
					this.showLoadingHint = false;
					this.$dialog.alert({
						message: err,
						closeOnPopstate: true
					}).then(() => {
					});
					reject()
				})
			})
		},

		// 任务提交事件
		async submitEvent() {
			if (this.locationMessage.length != 4) {
				this.$toast({message: '请选择位置'});
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
						this.$Alert({message:"提交成功!",type:'success'});
						this.resetEvent();
						setTimeout(() => {
							this.$router.push({ path: "/home"})
						},2000);
					} else {
						this.$Alert({message:res.data.msg,type:'error'});
					}
				}).
				catch((err) => {
					this.$Alert({message:err,type:'success'});
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
					this.$router.push({ path: "/cleanCallTask" })
				} else if (this.valueName == 1) {
					this.$router.push({ path: "/cleanRealtimeTask" })
				} else if (this.valueName == 2) {
					this.$router.push({ path: "/cleanHistoricalTask" })
				}
			} 
		}
	}
</script>

<style lang="less" scoped>
	@import "~@/common/stylus/variable.less";	
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
	.content-box {
		/deep/ .van-overlay {
			z-index: 100 !important
		};
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
		        >span {
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
		        >span {
							display: inline-block;
							padding-left: 10px;
							flex: 1;
							text-align: right;
							color: #174E97 !important;
							font-size: 14px !important;
							margin-right: 4px;
							.no-wrap();
						};
						/deep/ .van-radio-group {
						justify-content: space-between;
						width: 100%;
						margin-left: 10px;
						.van-radio--horizontal {
							margin-right: 0 !important;
							&:nth-child(1) {
								.van-radio__label {
								color: #289E8E !important
								}
							};
							&:nth-child(2) {
								.van-radio__label {
								color: #E8CB51 !important
								}
							};
							&:nth-child(3) {
								.van-radio__label {
								color: #F2A15F !important
								}
							};
							&:nth-child(4) {
								.van-radio__label {
								color: #E86F50 !important
								}
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
		        >span {
		          font-size: 14px;
		          &:nth-child(1) {
		            flex: 1;
		            .no-wrap();
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
		            >span {
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
		      > div {
		        font-size: 14px;
		        color: #101010;
		        &:first-child {
		        }
		        &:nth-child(2) {
		          margin-left: 8px;
		          display: flex;
		          flex-wrap: wrap;
		          flex: 1;
		          > div {
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
						height: 20px;
						box-sizing: border-box;
						justify-content: center;
						align-items: center;
						background: #616161;
						/deep/ .van-icon {}  
		            };
		            img {
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
		      > div {
		        font-size: 14px;
		        color: #101010;
		        &:first-child {
							margin-bottom: 10px;
		        };
		        &:nth-child(2) {
		          /deep/ .van-cell {
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
				>span {
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
			};
			 .choose-photo-box {
        position: fixed;
        margin: auto;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1000;
        font-size: 0;
        > div {
          width: 100%;
          text-align: center;
          font-size: 16px;
          background: #f6f6f6
        }
        .choose-photo {
          padding: 8px 10px;
          height: 30px;
          .bottom-border-1px(#cbcbcb);
          line-height: 30px;
          position: relative;
          cursor: pointer;
          color: @color-theme;
          overflow: hidden;
          display: inline-block;
          *display: inline;
          *zoom: 1;
          /deep/ .van-icon {
            vertical-align: top;
            font-size: 20px;
            display: inline-block;
            line-height: 30px
          };
          input {
            position: absolute;
            font-size: 100px;
            right: 0;
            top: 0;
            height: 100%;
            opacity: 0;
            filter: alpha(opacity=0);
            cursor: pointer
          }
        };
        .photo-graph {
          position: relative;
          display: inline-block;
          height: 50px;
          overflow: hidden;
         .bottom-border-1px(#cbcbcb);
          color: @color-theme;
          text-decoration: none;
          text-indent: 0;
          line-height: 50px;
          /deep/ .van-icon {
            vertical-align: top;
            font-size: 20px;
            display: inline-block;
            line-height: 50px
          };
          input {
            position: absolute;
            font-size: 100px;
            right: 0;
            height: 100%;
            top: 0;
            opacity: 0;
          }
        };
        .photo-cancel {
          position: relative;
          display: inline-block;
          padding: 8px 12px;
          overflow: hidden;
          color: @color-theme;
          text-decoration: none;
          text-indent: 0;
          line-height: 30px;
          font-weight: bold
        }
      }
	}
</style>
