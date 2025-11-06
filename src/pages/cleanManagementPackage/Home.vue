<template>
  <div class="page-box" ref="wrapper">
    <div class="content">
        <!-- 顶部导航栏 -->
        <HeaderTop title="保洁管理">
            <div class="header-left" slot="left" @click="backTo">
                <van-icon name="wap-home" color="#fff" size="22"></van-icon>
                <span>首页</span>
            </div>
            <div class="header-right" slot="right" @click="scanQRCodeEvent">
                <van-icon name="scan" color="#fff" size="22" />
            </div>
        </HeaderTop>
        <div class="content-box">
            <div class="banner-box">
                <img :src="environmentBannerPng" alt="">
            </div>
            <div class="subproject">
                <h2>保洁管理</h2>
                <div class="subproject-list-box">
                    <div class="subproject-list" v-for="(item,index) in cleaningManagementList" 
                        :key="index"
                        @click="cleanManagementEvent(item,index)"
                    >
                        <img :src="item.imgUrl" alt="">
                        <span>{{ item.name }}</span>
                    </div> 
                </div>
            </div>
        </div>
    </div>
  </div>
</template>
<script>
    import HeaderTop from '@/components/HeaderTop'
    import {
    } from '@/api/clean/environmentalManagement.js'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    import {
        IsPC,
        removeExceptLoginMessageLocalStorage
    } from '@/common/js/utils'
    export default {
        name: 'CleanHome',
        components: {
            HeaderTop
        },
        data() {
            return {
                cleaningManagementList: [
                    {
                        name: '任务列表',
                        imgUrl: require("@/common/images/home/task-list.png")
                    },
                    {
                        name: '考勤管理',
                        imgUrl: require("@/common/images/home/attendance-management.png")
                    },
                    {
                        name: '考勤统计',
                        imgUrl: require("@/common/images/home/attendance-statistics.png")
                    }
                ],
                environmentBannerPng: require("@/common/images/home/environment-banner.png")
            }
        },

        mounted() {
            // 控制设备物理返回按键
            if (!IsPC()) {
                pushHistory();
                this.gotoURL(() => {
                    pushHistory();
					this.$router.push({
						path: '/home'
					})
                })
            }
        },

        watch: {},

        computed: {
            ...mapGetters([
                'userInfo',
                'isLogin'
            ])
        },

        methods: {
            ...mapMutations([
                "changeChooseProject"
            ]),

            // 跳转到首页
            backTo () {
                this.$router.push({path:'/home'});
            },

            // 扫码事件
            scanQRCodeEvent () {
                this.$router.push({path:'/scanQRCode'});
            },

            // 保洁管理子项点击事件
            cleanManagementEvent (item, index) {
                if (item.name == '任务列表') {
                    this.$router.push({ path: "/cleanTaskList" })
                } else if (item.name == '考勤管理') {
                    this.$router.push({ path: "/attendanceManagement" })
                } else if (item.name == '考勤统计') {
                    this.$router.push({ path: "/attendanceStatistics" })
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
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            .header {
                position: relative;
                .header-left {
                    >span {
                        font-size: 14px;
                        color: #F8F9FA;
                    }
                };
                .header-right {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                }
            };
            .content-box {
                position: relative;
                flex: 1;
                height: 0;
                display: flex;
                flex-direction: column;
                margin-top: 10px;
                .banner-box {
                    width: 100%;
                    height: 145px;
                    img {
                        width: 100%;
                        height: 100%
                    }
                };
                .subproject {
                    width: 98%;
                    margin: 0 auto;
                    height: 160px;
                    background: #fff;
                    border-radius: 8px;
                    margin-top: 8px;
                    padding: 10px 12px;
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: column;
                    h2 {
                        width: 100%;
                        height: 24px;
                        font-size: 16px;
                        color: #242424;
                        font-weight: bold;
                    };
                    .subproject-list-box {
                        width: 100%;
                        display: flex;
                        height: 100px;
                        .subproject-list {
                            flex: 1;
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: flex-start;
                            >img {
                                width: 50px;
                                height: 50px;
                                margin-left: 6px;
                            };
                            >span {
                                margin-top: 10px;
                                font-size: 16px;
                                color: #101010
                            }
                        }
                    }
                }
            }
        }
    }
</style>