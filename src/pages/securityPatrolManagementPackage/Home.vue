<template>
  <div class="page-box" ref="wrapper">
    <div class="nav">
         <HeaderTop title="安全巡更">
            <div class="header-left" slot="left" @click="backTo">
                <van-icon name="wap-home" color="#fff" size="22"></van-icon>
                <span>首页</span>
            </div>
        </HeaderTop>
    </div>
    <div class="content">
        <div class="content-top-area">
			<img :src="statusBackgroundPng" />
			<div class="content-top-content" @click="userInfoEvent">
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
		</div>
        <div class="task-board">
            <h2>全部功能</h2>
            <div class="subproject-list-box">
                <div class="subproject-list" v-for="(item,index) in cleaningManagementList" 
                    :key="index"
                    @click="patrolTaskEvent(item,index)"
                >
                    <img :src="item.imgUrl" alt="">
                    <span>{{ item.name }}</span>
                    <span class="message-number" v-show="isShowMessageNumber && item.name == '留言簿' ">{{ messageNumber }}</span>
                </div> 
            </div>
        </div>
    </div>
  </div>
</template>
<script>
    import HeaderTop from '@/components/HeaderTop'
    import { queryNewCount } from '@/api/securityPatrol/escortManagement.js'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    export default {
        name: 'SecurityPatrolHome',
        components: {
            HeaderTop
        },
        data() {
            return {
                messageNumber: 0,
                windowTimer: null,
                currentMessageNumber: 0,
                isShowMessageNumber: false,
                isTimeoutContinue: true,
                cleaningManagementList: [
                    {
                        name: '巡更任务',
                        imgUrl: require("@/common/images/home/task-list.png")
                    },
                    {
                        name: '事件登记',
                        imgUrl: require("@/common/images/home/event-registration.png")
                    },
                    {
                        name: '排班管理',
                        imgUrl: require("@/common/images/home/workforce-management.png")
                    },
                    {
                        name: '留言簿',
                        imgUrl: require("@/common/images/home/guest-book.png")
                    },
                    {
                        name: '打卡范围测定工具',
                        imgUrl: require("@/common/images/home/guest-book.png")
                    }
                ],
                defaultPersonPng: require("@/common/images/home/default-person.png"),
                statusBackgroundPng: require("@/common/images/home/status-background.png")
            }
        },

        beforeDestroy () {
            if (this.windowTimer) {
                clearInterval(this.windowTimer)
            }
        },

        mounted() {
            // 轮询是否有当前登录用户参与任务集下新的留言
            if (!this.windowTimer) {
                this.windowTimer = window.setInterval(() => {
                    if (this.isTimeoutContinue) {
                        setTimeout(this.queryNewMessage, 0)
                    }
                }, 3000);
                this.changeSecurityPatrolGlobalTimer(this.windowTimer)
            }
        },

        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin',
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
                'changeSecurityPatrolGlobalTimer',
                'changeIsEnterGuestBookPageFromHomePage',
                'changeLastMessageNumber'
            ]),

             // 跳转到首页
            backTo () {
                this.$router.push({path:'/home'});
            },

            // 查询是否有当前登录用户参与任务集下新的留言
            queryNewMessage () {
                this.isTimeoutContinue = false;
                queryNewCount({userId: this.workerId, system:6, proId: this.proId}).then((res) => {
                    if (res && res.data.code == 200) {
                        this.isTimeoutContinue = true;
                        // 实时总留言数量
                        this.currentMessageNumber = res.data.data;
                        if (res.data.data > 0) {
                            // 有新增留言
                            if (this.lastMessageNumber != null && (this.lastMessageNumber != res.data.data)) {
                                // 重置是否从首页进入过留言页
                                this.changeIsEnterGuestBookPageFromHomePage(false);
                                // 显示新的留言数量
                                this.messageNumber = (res.data.data - this.lastMessageNumber) >= 0 ? (res.data.data - this.lastMessageNumber) : 0;
                                this.isShowMessageNumber = this.messageNumber > 0 ? true : false
                            } else {
                              // 记录留言数量没变化前的留言数量
                              this.changeLastMessageNumber(res.data.data);
                              // 去过留言簿页就默认读过留言
                               if (this.isEnterGuestBookPageFromHomePage) {
                                   this.isShowMessageNumber = false
                               } else {
                                   this.messageNumber = (res.data.data - this.lastMessageNumber) >= 0 ? (res.data.data - this.lastMessageNumber) : 0
                                   this.isShowMessageNumber = this.messageNumber > 0 ? true : false
                               }
                            }
                        } else {
                            this.isShowMessageNumber = false
                        }
                    }
                })
                .catch((err) => {
                    this.$dialog.alert({
                        message: `${err}`,
                        closeOnPopstate: true
                    }).then(() => {
                    })
                })
            },

            // 头像点击事件
            userInfoEvent () {
                this.$router.push({path: '/myInfo'})
            },

            // 巡查任务点击事件
            patrolTaskEvent (item, index) {
                if (item.name == '巡更任务') {
                    this.$router.push({path: '/patrolTasklist'})
                } else if (item.name == '事件登记') {
                    this.$router.push({path: '/eventList'})
                } else if (item.name == '留言簿') {
                    this.changeIsEnterGuestBookPageFromHomePage(true);
                    // 记录留言数量没变化前的留言数量(进入留言簿页面后默认读过所有新留言)
                    this.changeLastMessageNumber(this.currentMessageNumber);
                    this.$router.push({path: '/guestBook'})
                } else if (item.name == '打卡范围测定工具') {
                    this.$router.push({path: '/beaconList'})
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
        background: #F8F8F8;
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
            .content-top-area {
                position: relative;
                width: 100%;
                margin: 0 auto;
                height: 189px;
                > img {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
                .content-top-content {
                    width: 95%;
                    padding: 20px 0;
                    box-sizing: border-box;
                    overflow: auto;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    height: 125px;
                    margin: 0 auto;
                    top: 64px;
                    border-radius: 10px;
                    display: flex;
                    flex-flow: row nowrap;
                    align-items: center;
                    background: #fff;
                    box-shadow: 0px 2px 8px -1px rgba(11, 64, 173, 0.31);
                    .user-photo {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        width: 85px;
                        margin: 0 20px;
                        height: 85px;
                        border-radius: 50%;
                        z-index: 1000;
                        img {
                            vertical-align: middle;
                            width: 85px;
                            height: 85px;
                        }
                    };
                    .user-message {
                        z-index: 100;
                        color: #101010;
                        flex: 1;
                        .user-name {
                            width: 98%;
                            word-break: break-all;
                            font-size: 16px;
                        }
                        .account-name {
                            width: 98%;
                            word-break: break-all;
                            font-size: 14px;
                            margin-top: 20px;
                            color: #BEC7D1;
                            line-height: 20px
                        }
                    }
                }
            };
           .task-board {
                width: 95%;
                background: #fff;
                border-radius: 8px;
                margin: 0 auto;
                margin-top: 20px;
                padding-bottom: 10px;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                h2 {
                    width: 100%;
                    height: 55px;
                    padding-left: 26px;
                    box-sizing: border-box;
                    line-height: 55px;
                    font-size: 16px;
                    color: #242424;
                    font-weight: bold;
                };
                .subproject-list-box {
                    width: 100%;
                    display: flex;
                    flex-flow: row wrap;
                    flex: 1;
                    .subproject-list {
                        position: relative;
                        width: 33.3%;
                        display: flex;
                        margin-bottom: 25px;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        >img {
                            width: 50px;
                            height: 50px;
                            margin-left: 6px;
                        };
                        >span {
                            &:nth-child(2){
                                margin-top: 14px;
                                font-size: 16px;
                                color: #101010;
                                text-align: center
                            };
                            &:nth-child(3) {
                                position: absolute;
                                width: 70px;
                                .no-wrap();
                                top: -10px;
                                right: -10px;
                                font-size: 16px;
                                color: red;
                                padding-left: 22px;
                                display: inline-block;
                                box-sizing: border-box
                            }
                        }
                    };
                    >div:nth-child(5) {
                        width: 35% !important
                    }
                }
            }
        }
    }
</style>