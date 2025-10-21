<template>
  <div class="page-box" ref="wrapper">
    <div class="content">
        <div class="hospital-select-box">
            <img :src="myLocationPng" alt="">
            <van-dropdown-menu active-color="#1965FF">
                <van-dropdown-item v-model="currentHospitaiName" :options="hospitalOption" @change="dropdownItemChangeEvent" />
            </van-dropdown-menu>
        </div>
        <div class="tabs-box">
            <van-tabs v-model="activeObjectName" color="#101010" sticky>
                <van-tab title="环境管理" name="environmentalManagement">
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
                </van-tab>
                <van-tab title="中央运送" name="centralTransport"></van-tab>
            </van-tabs>
        </div>
    </div>
    <FooterBottom></FooterBottom>
  </div>
</template>
<script>
    import FooterBottom from '@/components/FooterBottom'
    import {
    } from '@/api/environmentalManagement.js'
    import {
        mapGetters,
        mapMutations
    } from 'vuex'
    import {
        IsPC,
        removeExceptLoginMessageLocalStorage
    } from '@/common/js/utils'
    export default {
        name: 'Home',
        components: {
            FooterBottom
        },
        data() {
            return {
                activeObjectName: 'environmentalManagement',
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
                currentHospitaiName: '',
                hospitalOption: [],
                myLocationPng: require("@/common/images/home/my-location.png"),
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
            };

            // 获取医院列表
            this.currentHospitaiName = this.userInfo.hospitalList[0]['hospitalId'];
            for (let item of this.userInfo.hospitalList) {
                this.hospitalOption.push({
                    text: item.hospitalName,
                    value: item.hospitalId
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

            // 医院下拉菜单值变化事件
            dropdownItemChangeEvent (value) {
                // 清空除登录信息之外的store和localStorage
                removeExceptLoginMessageLocalStorage();
                this.$store.dispatch('resetCleanManagementStore');
                //存储选择的项目
                this.changeChooseProject(this.hospitalOption.filter((item) => { return item.value == value}))
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
            .hospital-select-box {
                width: 98%;
                margin: 0 auto;
                height: 40px;
                background: #fff;
                border-radius: 20px;
                box-shadow: 0px 3px 4px -1px rgba(24, 100, 255, 0.31);
                display: flex;
                align-items: center;
                padding: 0 10px;
                box-sizing: border-box;
                > img {
                    width: 22px;
                    height: 22px
                };
                /deep/ .van-dropdown-menu {
                    .van-dropdown-menu__bar {
                        height: 40px !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        .van-dropdown-menu__title {
                            font-size: 16px !important;
                            color: #1965FF !important
                        }
                    }
                }
            };
            .tabs-box {
                width: 98%;
                margin: 0 auto;
                display: flex;
                align-items: center;
                /deep/ .van-tabs {
                    width: 100%;
                    .van-tabs__wrap {
                        height: 40px !important;
                        .van-tabs__nav {
                            background: transparent !important;
                            .van-tab {
                                flex: none !important
                            }
                        };
                        .van-tabs__nav--line {
                            box-sizing: border-box;
                            padding-bottom: 0 !important;
                            .van-tabs__line {
                                bottom: 2px !important
                            }
                        }
                    };
                    .van-tabs__content {
                        margin-top: 4px;
                        .banner-box {
                            width: 100%;
                            height: 145px;
                            img {
                                width: 100%;
                                height: 100%
                            }
                        };
                        .subproject {
                            width: 100%;
                            height: 160px;
                            background: #fff;
                            border-radius: 8px;
                            margin-top: 10px;
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
        }
    }
</style>