<template>
	<div class="content-box">
		<van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></div>
		<div class="nav" :style="{ 'margin-top':navigationBarHeight + 4 + 'px' }">
      		<NavBar title="修改密码" path="/myInfo" />
		</div>
		<div class="content">
			<div class="former-password-area">
				<div class="former-password-left">
					<span>*</span>
					<span>请输入旧密码</span>
				</div>
				<div class="former-password-right">
				 	<van-field
						type="password"
						clearable
						v-model="formerPasswordValue"
					/>
				</div>
			</div>
			<div class="former-password-area new-password-area">
				<div class="former-password-left">
					<span>*</span>
					<span>请输入新密码</span>
				</div>
				<div class="former-password-right">
				   <van-field
						type="password"
						clearable
						v-model="newPasswordValue"
					/>
					<div class="password-explain">
						密码至少8位，可以使用字母和数字。
					</div>
				</div>
			</div>
			<div class="former-password-area">
				<div class="former-password-left">
					<span>*</span>
					<span>请确认新密码</span>
				</div>
				<div class="former-password-right">
				 <van-field
						type="password"
						clearable
						v-model="surePasswordValue"
					/>
				</div>
			</div>
		</div>
		<div class="bottom-area">
			<div class="quit-area" @click="submitModificationEvent">提交修改</div>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import _ from 'lodash'
	import {
		removeAllLocalStorage,
	} from '@/common/js/utils'
	import store from '@/store'
	import { modificationPassword } from '@/api/login.js'
	import NavBar from "@/components/NavBar";
	export default {
		components: {
			NavBar
		},
		data() {
			return {
				infoText: '提交中···',
				showLoadingHint: false,
				formerPasswordValue: '',
				newPasswordValue: '',
				surePasswordValue: ''
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
				'userBasicInfo',
				'statusBarHeight',
				'navigationBarHeight'
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
			
			// 顶部导航返回事件
			backTo () {
				uni.navigateBack()
			},
			
			// 提交修改事件
			submitModificationEvent () {
				// 旧密码不能为空
				if (this.formerPasswordValue == '') {
					this.$dialog.alert({
						message: "请输入旧密码!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				// 新密码不能为空
				if (this.newPasswordValue == '') {
					this.$dialog.alert({
						message: "请输入新密码!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				// 新旧密码不能相同
				if (this.newPasswordValue == this.formerPasswordValue) {
					this.$dialog.alert({
						message: "修改失败！旧密码与新密码一致，请重新输入!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				// 确认新密码不能为空
				if (this.surePasswordValue == '') {
					this.$dialog.alert({
						message: "请确认新密码!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				// 两次密码输入不一致
				if (this.newPasswordValue != this.surePasswordValue) {
					this.$dialog.alert({
						message: "两次密码输入不一致!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				// 新密码不能少于8位
				if (this.newPasswordValue.length < 8) {
					this.$dialog.alert({
						message: "修改失败，新密码不得少于8位!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				// 新密码只能包含数字和字母
				if (!(/^[a-zA-Z0-9]+$/.test(this.newPasswordValue))) {
					this.$dialog.alert({
						message: "修改失败，新密码只能包含数字和字母!",
						closeOnPopstate: true,
					})
					.then(() => {});
					return
				};
				this.showLoadingHint = true;
				modificationPassword({
					username: this.userName,
					password: this.formerPasswordValue,
					newPassword: this.newPasswordValue
				}).then((res) => {
					this.showLoadingHint = false;
					if (res && res.data.code == 200) {
						setTimeout(()=>{
							this.$router.push({ path: '/' });
						},2000);
						// 清空store和localStorage
						store.dispatch('resetLoginState');
						removeAllLocalStorage();
						this.$Alert({message:"修改成功!",type:'success'})
					} else {
						this.$Alert({message:"修改失败!",type:'error'})
					}
				})
				.catch((err) => {
					this.showLoadingHint = false;
					this.modalShow = true;
					this.modalContent = err.message;
				})
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
				width: 100%;
				/deep/ .tabBar-box {
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
		};
		.content {
			 flex: 1;
			 overflow: auto;
			 padding: 20px;
			 box-sizing: border-box;
			 position: relative;
			 background: #F8F8F8;
			 .former-password-area {
				 display: flex;
				 justify-content: space-between;
				 align-items: center;
				 height: 48px;
				 .former-password-left {
					 margin-right: 10px;
					 >span {
						 &:first-child {
							 color: #DB4747;
							 margin-right: 4px;
						 };
						 &:last-child {
							 font-weight: bold;
							 font-size: 14px;
							 color: #000000;
						 }
					 }
				 };
				 .former-password-right {
					flex: 1;
					/deep/ .van-cell {
						padding: 0 10px !important;
						border-radius: 5px;
						height: 30px;
						border: 1px solid #BBBBBB;
					}
				 }
			 };
			 .new-password-area {
				 margin-bottom: 10px;
				 .former-password-right {
					 position: relative;
					 .password-explain {
						 position: absolute;
						 left: 0;
						 bottom: -18px;
						 font-size: 12px;
						 color: #DB4747;
					 }
				 }
			 }
		};
		.bottom-area {
			height: 110px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			align-items: center;
			padding-bottom: 10px;
			box-sizing: border-box;
			.quit-area {
				display: block;
				height: 44px;
				background: #3890EE;
				border-radius: 4px;
				font-size: 14px;
				color: #fff;
				line-height: 44px;
				text-align: center;
				width: 60%;
			}
		}
	}
</style>
