<template>
	<div class="content-box">
    <van-loading size="24px" vertical v-show="showLoadingHint">{{ infoText }}</van-loading>
    <van-dialog v-model="modalShow" title="确定退出登录?"
		  show-cancel-button @confirm="sureCancel" @cancel="cancelSure" confirm-button-color="#3890EE">
		</van-dialog>
		<div class="top-background-area" :style="{ 'height': statusBarHeight + navigationBarHeight + 5 + 'px' }"></div>
		<div class="nav" :style="{ 'margin-top':navigationBarHeight + 'px' }">
      <NavBar title="个人中心" :leftArrow="false" leftText="" />
		</div>
		<div class="content">
			<div class="content-top">
				<div class="account-area account-area-bottom-border">
					<div class="account-area-left">
						用户账号
					</div>
					<div class="account-area-right">
						{{ userAccount }}
					</div>
				</div>
				<div class="account-area account-area-bottom-border">
					<div class="account-area-left">
						用户姓名
					</div>
					<div class="account-area-right">
						{{ userName }}
					</div>
				</div>
				<div class="account-area account-area-bottom-border">
					<div class="account-area-left">
						所属科室
					</div>
					<div class="account-area-right">
						{{ depName }}
					</div>
				</div>
				<div class="account-area" @click="modificationPasswordEvent">
					<div class="account-area-left">
						修改密码
					</div>
					<div class="account-area-right">
            <van-icon name="arrow" color="#101010" size="24" />
					</div>
				</div>
			</div>
		</div>
		<div class="bottom-area">
			<div class="quit-area" @click="signOutEvent">退出登录</div>
			<div class="version-area">当前版本 1.0.0</div>
		</div>
    <FooterBottom></FooterBottom>  
	</div>
</template>

<script>
	import {
		mapGetters,
		mapMutations
	} from 'vuex'
	import _ from 'lodash'
	import store from '@/store'
	import {
		removeAllLocalStorage
	} from '@/common/js/utils'
	import { userSignOut } from '@/api/login.js'
	import NavBar from "@/components/NavBar";
  import FooterBottom from "@/components/FooterBottom";
	export default {
		components: {
			FooterBottom,
      NavBar
		},
		data() {
			return {
				infoText: '开启中···',
				showLoadingHint: false,
				modalShow: false
			}
		},
		computed: {
			...mapGetters([
				'userInfo',
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
				'changeUserBasicInfo'
			]),
			
			// 修改密码事件
			modificationPasswordEvent () {
			  this.$router.push({ path: '/modificationPassword' })
			},
			
			// 退出登录事件
			signOutEvent () {
				this.modalShow = true;
			},
			
			// 退出登录弹框确定事件
			sureCancel () {
				this.modalShow = false;
				this.userSignOutEvent();
			},
			
			// 弹框取消事件
			cancelSure () {
				this.modalShow = false;
			},
			
			// 退出登录
			userSignOutEvent () {
				this.showLoadingHint = true;
				this.infoText = '退出登录中...';
				userSignOut(this.proId,this.workerId).then((res) => {
					if ( res && res.data.code == 200) {
            // 清空store和localStorage
						removeAllLocalStorage();
						store.dispatch('resetLoginState');
					  this.$router.push({path: "/"});
					} else {
            this.modalShow = true;
						this.modalContent = `${res.data.msg}`
					};
					this.showLoadingHint = false;
				})
				.catch((err) => {
					this.showLoadingHint = false;
          this.modalShow = true;
					this.modalContent = err.message
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
      /deep/ .tabBar-box {
        .van-nav-bar__title {
          color: #fff;
          font-size: 14px;
        }
      }
		};
		.content {
			 flex: 1;
			 overflow: auto;
			 padding: 6px 0;
			 box-sizing: border-box;
			 position: relative;
			 background: #F8F8F8;
			 .content-top {
				 background: #fff;
				 .account-area-bottom-border {
					 border-bottom: 1px solid #F8F8F8;
				 };
				 .account-area {
					 padding: 0 10px;
					 box-sizing: border-box;
					 height: 44px;
					 display: flex;
					 align-items: center;
					 justify-content: space-between;
					 .account-area-left {
						 font-size: 14px;
						 color: #9C9C9C;
					 };
					 .account-area-right {
						 font-size: 14px;
						 color: #000000;
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
				background: #E86F50;
				border-radius: 4px;
				font-size: 14px;
				color: #fff;
				line-height: 44px;
				text-align: center;
				width: 60%;
			};
			.version-area {
				font-size: 14px;
				color: #9C9C9C;
			}
		}
	}
</style>
