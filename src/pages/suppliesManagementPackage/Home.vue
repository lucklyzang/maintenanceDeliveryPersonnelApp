<template>
  <div class="page-box" ref="wrapper">
    <!-- 顶部导航栏 -->
    <div class="nav">
        <HeaderTop title="物资管理系统">
            <div class="header-left" slot="left" @click="backTo">
                <van-icon name="wap-home" color="#fff" size="22"></van-icon>
                <span>首页</span>
            </div>
        </HeaderTop>
    </div>
    <div class="content">
        <div class="content-top-area">
		</div>
        <div class="user-box" @click="userInfoEvent">
            <div class="user-photo">
                <img :src="defaultPersonPng" />
            </div>
            <div class="user-message">
                <div class="user-name">
                    {{ userName }}
                </div>
                <div class="account-name">
                    {{ proName }}
                </div>
            </div>
		</div>
        <div class="task-board">
            <h2>待办事项</h2>
            <div class="subproject-list-box">
                <div class="subproject-list" v-for="(item,index) in cleaningManagementList" 
                    :key="index"
                    @click="patrolTaskEvent(item,index)"
                >
                    <span>{{ item.name }}</span>
                    <p>
                        <span class="message-number">2</span>
                    </p>
                </div> 
            </div>
        </div>
        <div class="functional-zone">
            <div class="service-list" v-for="(item,index) in safeList" :key="index" @click="functionalZoneEvent(item,index)">
                <div class="list-top">
                    <img :src="item.url" />
                </div>
                <div class="list-bottom">{{ item.text }}</div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
    import HeaderTop from '@/components/HeaderTop'
    import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction';
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    export default {
        name: 'suppliesHome',
        components: {
            HeaderTop
        },
        mixins:[mixinsDeviceReturn],
        data() {
            return {
                loadingShow: false,
                overlayShow: false,
                quitInfoShow: false,
                messageNumber: 0,
                currentMessageNumber: 0,
                isShowMessageNumber: false,
                isTimeoutContinue: true,
                cleaningManagementList: [
                    {
                        name: '待送货',
                        value: 1
                    },
                    {
                        name: '待确认',
                        value: 2
                    }
                ],
                safeList: [
					{
						text: '订单',
						url: require('@/common/images/home/supplies-order-icon.png')
					},
					{
						text: '送货',
						url: require('@/common/images/home/supplies-delivery-icon.png')
					},
                    {
						text: '退换货',
						url: require('@/common/images/home/supplies-barter-icon.png')
					},
					{
						text: '盘点',
						url: require('@/common/images/home/supplies-stock-tacking-icon.png')
					},
                    {
						text: '评价',
						url: require('@/common/images/home/supplies-evaluate-icon.png')
					}
				],
                defaultPersonPng: require("@/common/images/home/equipment-patrol-default-person.png"),
                statusBackgroundPng: require("@/common/images/home/status-background.png")
            }
        },

        beforeDestroy () {
        },

        mounted() {
            // 控制设备物理返回按键
            this.deviceReturn("/home");
            // 二维码回调方法绑定到window下面,提供给外部调用
            let me = this;
            window['scanQRcodeCallback'] = (code) => {
                me.scanQRcodeCallback(code);
            };
            window['scanQRcodeCallbackCanceled'] = () => {
                me.scanQRcodeCallbackCanceled();
            }
        },

        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin',
                'hospitalMessage',
                'isEnterGuestBookPageFromHomePage',
                'lastMessageNumber',
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
                "changeChooseProject",
                'changeIsEnterGuestBookPageFromHomePage',
                'changeLastMessageNumber',
                'changeOverDueWay'
            ]),

            // 跳转到首页
            backTo () {
                this.$router.push({path:'/home'});
            },


            // 头像点击事件
            userInfoEvent () {
                this.$router.push({path: '/myInfo'})
            },
            
            // 扫描二维码方法
            scanQRCode () {
                window.android.scanQRcode()
            },

            // 功能区点击事件
            functionalZoneEvent (item, index) {
                if (item.text == '订单') {
                    this.$router.push({path: '/suppliesOrderList'})
                } else if(item.text == '送货') {
                    this.$router.push({path: '/suppliesDeliverGoodsList'})
                } else if(item.text == '退换货') {
                    this.$router.push({path: '/suppliesChangingOrRefundingList'})
                } else if(item.text == '评价') {
                    this.$router.push({path: '/suppliesMyEvaluate'})
                } else if(item.text == '盘点') {
                    this.$router.push({path: '/suppliesTakeStock'})
                } 
            }
        }
    }
</script>
<style lang='less' scoped>
    @import "~@/common/stylus/variable.less";
    @import "~@/common/stylus/mixin.less";
    @import "~@/common/stylus/modifyUi.less";
    .page-box {
        background: #fff;
        .content-wrapper();
        .nav {
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 10;
            left: 0;
            .header {
                .header-left {
                    >span {
                        font-size: 14px;
                        color: #F8F9FA;
                    }
                }
            }
        };
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 0;
            .content-top-area {
                position: relative;
                width: 100%;
                margin: 0 auto;
                height: 60px;
                background: #3B9DF9;
            };
            .user-box {
                width: 100%;
                padding: 16px;
                box-sizing: border-box;
                overflow: auto;
                display: flex;
                flex-flow: row nowrap;
                align-items: center;
                .user-photo {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 48px;
                    height: 48px;
                    margin-right: 10px;
                    border-radius: 50%;
                    background: #E5E5E5;
                    img {
                        vertical-align: middle;
                        width: 40px;
                        height: 40px;
                    }
                };
                .user-message {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    z-index: 100;
                    color: #101010;
                    height: 60px;
                    flex: 1;
                    font-size: 13px;
                    .user-name {
                        width: 98%;
                        word-break: break-all;
                    }
                    .account-name {
                        width: 98%;
                        word-break: break-all;
                        margin-top: 10px;
                        line-height: 20px
                    }
                }
            };
           .task-board {
                width: 100%;
                padding: 0 16px 10px 16px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                h2 {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    font-size: 12px;
                    color: #101010;
                };
                .subproject-list-box {
                    width: 100%;
                    display: flex;
                    flex-flow: row wrap;
                    flex: 1;
                    align-content: flex-start;
                    .subproject-list {
                        position: relative;
                        width: 100px;
                        height: 50px;
                        margin-right: 20px;
                        display: flex;
                        background: #F0F2FE;
                        border-radius: 6px;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        >span {
                            &:nth-child(2){
                                margin-top: 14px;
                                font-size: 16px;
                                color: #101010;
                                text-align: center
                            }
                        };
                        >p {
                            position: absolute;
                            width: 17px;
                            height: 17px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background: #E86F50;
                            border-radius: 50%;
                            top: -10px;
                            right: 0;
                            span {
                                .no-wrap();
                                font-size: 12px;
                                color: #fff;
                            }
                        }
                    };
                    >div:nth-child(5) {
                        width: 35% !important
                    }
                }
            };
            .functional-zone {
                display: flex;
                flex-wrap: wrap;
                width: 100%;
                margin-top: 20px;
                .service-list {
                    width: 25%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;
                    .list-top {
                        width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #3B9DF9;
                        border-radius: 12px;
                        >img {
                            width: 25px;
                            height: 25px;
                        }
                    };
                    .list-bottom {
                        margin-top: 14px;
                        font-size: 12px;
                        color: #101010;
                    }
                }
            }
        }
    }
</style>