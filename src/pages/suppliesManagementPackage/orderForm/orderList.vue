<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="订单" left-text="返回" left-arrow @click-left="onClickLeft" @click-right="onClickRight"  :border="false">
            <template #right>
                <van-icon name="underway-o" size="18" color="#fff" />
                <span class="history-span">历史</span>
            </template>
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-top-area">
		</div>
        <div class="content-box">
          <div class="status-date-box">
				<div class="status-box">
					<div class="status-span" @click="orderStatusListShow = !orderStatusListShow">
						<span>{{ currentStatusspan }}</span>
						<van-icon :name="orderStatusListShow ? 'arrow-down' : 'arrow-up'" color="#101010" size="16" />
					</div>
					<div class="status-list-box" v-if="orderStatusListShow">
						<div class="status-list" v-for="(item,index) in orderStatusList" @click="statusListEvent(item,index)" :key="index">
							<span :class="{'statusspanStyle': index == currentStatusIndex }">{{ item }}</span>
						</div>
					</div>
				</div>
				<div class="data-box">
					<div class="date-span">
						<span>日期:</span>
					</div>
					<div class="date-choose" @click="showCalendar = true">
						<span>{{ startDate }}</span>
						<van-icon name="minus" color="#CACACA" size="18" />
						<span>{{ endDate }}</span>
						<van-icon name="notes-o" color="#CACACA" size="20" />
					</div>
				</div>
			</div>
            <div class="order-list-box">
				<div class="order-list" v-for="(item,index) in orderList" :key="index" @click="enterOrderDetailsEvent(item,index)">
					<div class="order-list-top">
						<div class="order-type">
							<span>{{ item.orderType }}</span>
							<span>{{ item.orderNumber }}</span>
						</div>
						<div class="order-status"
						:class="{
							'noStartStyle ' : item.state == 1 || item.state == 2, 
							'underwayStyle' : item.state == 3,
							'waitRedivStyle' : item.state == 4,
							'completeStyle' : item.state == 5,
							'haveRedivStyle' : item.state == 6,
							'cancelStyle' : item.state == 7,
							'redivStyle' : item.state == 8
							}"
						>
							<span>{{ stateTransfer(item.status) }}</span>
						</div>
					</div>
					<div class="order-list-center">
						<div class="product-list">
							<span>产品清单:</span>
							<span>{{ item.productList }}</span>
						</div>
						<div class="create-delivery-date">
							<div class="create-delivery-date-left">
								<span>创建时间:</span>
								<span>{{ item.createTime }}</span>
							</div>
							<div class="create-delivery-date-left">
								<span>交货日期:</span>
								<span>{{ item.deliveryDate }}</span>
							</div>
						</div>
						<div class="create-delivery-date delivery-address">
                            <div class="create-delivery-date-left">
								<span>下单医院:</span>
								<span>{{ item.deliveryAddress }}</span>
							</div>
							<div class="create-delivery-date-left">
								<span>送货地址:</span>
								<span>{{ item.deliveryAddress }}</span>
							</div>
						</div>
						<div class="product-list remark-box">
							<span>备注:</span>
							<span>{{ item.remark }}</span>
						</div>
					</div>
					<div class="order-list-bottom">
						<div class="order-list-btn">
							<div class="delete-left" v-if="false">
								<span>删除</span>
							</div>
							<div class="delete-left" @click.stop="changingOrRefundingEvent(item,index)">
								<span>退换货</span>
							</div>
							<div class="edit-right" @click.stop="createDeliveryOrderEvent(item,index)">
								<span>生成送货单</span>
							</div>
							<div class="edit-right" v-if="false" @click.stop="refuseEvent(item,index)">
								<span>拒绝订单</span>
							</div>
						</div>
					</div>
				</div>
			</div>
        </div>
    </div>
    <!-- 拒绝弹框	 -->
    <div class="refuse-modal">
        <van-dialog v-model="refuseModalShow" :showConfirmButton="false">
            <div class="evaluate-model-content">
                <div class="evaluate-modal-top">
                    <span>拒绝订单</span>
                    <van-icon name="cross" color="#101010" size="20" @click="refuseModalShow = false" />
                </div>
                <div class="evaluate-modal-center">
                    <div class="evaluate-box">
                        <div class="evaluate-span">
                            <span>*</span>
                            <span>拒绝理由:</span>
                        </div>
                        <div class="evaluate-content">
                            <van-field
                                v-model="refuseReasonValue"
                                type="textarea"
                                placeholder="请输入"
                            />
                        </div>
                    </div>
                </div>
                <div class="evaluate-modal-bottom">
                    <div class="evaluate-modal-btn">
                        <div class="cancel-left" @click.stop="refuseModalCancelEvent">
                            <span>取消</span>
                        </div>
                        <div class="submit-right" @click.stop="refuseModalSubmitEvent">
                            <span>提交</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-dialog>
    </div>
    <!-- 日历 --> 
    <van-calendar v-model="showCalendar" :min-date="minDate" :max-date="maxDate" :default-date="defaultDateArr" type="range" @confirm="calendarConfirm" />
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {getAllTaskList} from '@/api/securityPatrol/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import SOtime from '@/common/js/SOtime.js'
export default {
  name: "PatrolTasklist",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      backlogEmptyShow: false,
      refuseModalShow: false,
      showCalendar: false,
      defaultDateArr: [],
      startDate: '',
      endDate: '',
      minDate: new Date('2026-03-16'),
      maxDate: new Date('2027-03-16'),
      currentStatusspan: '全部状态',
      currentStatusIndex: 0,
      orderStatusListShow: false,
      refuseReasonValue: '',
      orderStatusList: [
        '全部状态',
        '待确认',
        '待审核',
        '已审核'
      ],
      orderList: [
            {
                orderType: '计划订单',
                orderNumber: '5552H5552',
                status: 0,
                productList: 'XXX、XXX、XXXX',
                createTime: '05-31 17:21',
                deliveryDate: '05-31',
                deliveryAddress: '检验科',
                remark: '一周一送'
            },
            {
                orderType: '计划订单',
                orderNumber: '5552H5552',
                status: 1,
                productList: 'XXX、XXX、XXXX',
                createTime: '05-31 17:21',
                deliveryDate: '05-31',
                deliveryAddress: '检验科',
                remark: '一周一送'
            },
            {
                orderType: '计划订单',
                orderNumber: '5552H5552',
                status: 2,
                productList: 'XXX、XXX、XXXX',
                createTime: '05-31 17:21',
                deliveryDate: '05-31',
                deliveryAddress: '检验科',
                remark: '一周一送'
            },
            {
                orderType: '计划订单',
                orderNumber: '5552H5552',
                status: 3,
                productList: 'XXX、XXX、XXXX',
                createTime: '05-31 17:21',
                deliveryDate: '05-31',
                deliveryAddress: '检验科',
                remark: '一周一送'
            }
        ]
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/suppliesHome');
    this.getDateRange();
  },

  beforeDestroy () {
    if (this.timeOne) {
        clearTimeout(this.timeOne)
    };
    if (this.timeTwo) {
        clearTimeout(this.timeTwo)
    }
  },

  beforeRouteEnter(to, from, next) {
    next() 
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea"]),
    userName() {
      return this.userInfo['worker']['name']
    },
    workerId() {
      return this.userInfo['worker']['id']
    },
    proName () {
      return this.chooseHospitalArea['span']
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
    ...mapMutations([]),

    onClickLeft () {
        this.$router.push({path: '/suppliesHome'})
    },

    onClickRight () {
    },

    // 订单状态点击事件
    statusListEvent(item,index) {
        this.currentStatusspan = item;
        this.currentStatusIndex = index;
        this.orderStatusListShow = false;
    },

    //任务状态转换
    stateTransfer (num) {
        switch(num) {
                case 0:
                    return '未分配'
                    break;
                case 1:
                        return '未查阅'
                        break;
                case 2:
                        return '未开始'
                        break;
                case 3:
                        return '进行中'
                        break;
                case 4:
                        return '待复核'
                        break;
                case 5:
                        return '已完成'
                        break;
                case 6:
                        return '已复核'
                        break;
                case 7:
                        return '已取消'
                        break
                case 8:
                        return '复核中'
                        break
        } 
    },

    // 拒绝弹框取消事件
    refuseModalCancelEvent () {
        this.refuseModalShow = false
    },
    
    // 拒绝弹提交事件
    refuseModalSubmitEvent () {
        this.refuseModalShow = false
    },
    
    // 进入历史订单事件
    enterHistoryOrderEvent () {
        uni.navigateTo({
            url: '/materialApplicationPackage/pages/historyOrderForm/historyOrderForm'
        })
    },
    
    // 日历日期选择确认事件
    calendarConfirm(e) {
        this.showCalendar = false;
        this.startDate = SOtime.time8(new Date(e[0]).getTime());
        this.endDate = SOtime.time8(new Date(e[e.length-1]).getTime())
    },
    
    // 将时间戳转换为当天的 00:00:00
    normalizeTimestamp () {
        const date = new Date();
        date.setHours(0, 0, 0, 0);
        return Number(date)
    },

    // 获取开始和结束日期(中间相隔一个月)
    getDateRange() {
        this.defaultDateArr = [];
        const start = new Date(); 
        const end = new Date(start);
        end.setMonth(start.getMonth() + 1);
        end.setHours(23, 59, 59, 999);
        this.startDate = this.formatDate(start);
        this.endDate = this.formatDate(end);
        this.defaultDateArr.push(new Date(this.startDate));
        this.defaultDateArr.push(new Date(this.endDate))
    },
    
    formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    },
    
    // 订单列表点击事件
    statusListEvent(item,index) {
        this.currentStatusspan = item;
        this.currentStatusIndex = index;
        this.orderStatusListShow = false;
    },
    
    //进入订单详情事件
    enterOrderDetailsEvent(item,index) {
        this.$router.push('/suppliesOrderDetails')
    },
    
    // 订单删除事件
    deleteEvent(item,index) {},
    
    // 生成送货单事件
    createDeliveryOrderEvent(item,index) {
     this.$router.push('/suppliesCreateDeliveryOrder')
    },
    
    // 订单退换货事件
    changingOrRefundingEvent(item,index) {
       this.$router.push('/suppliesOrderDetails')
    },
    
    // 拒绝订单事件
    refuseEvent(item,index) {
      this.refuseModalShow = true 
    },

    // 获取订单列表
    queryTaskList (taskType,page,pageSize) {
        this.loadingShow = true;
        this.overlayShow = true;
        this.backlogEmptyShow = false;
        this.completedEmptyShow = false;
        this.isShowBacklogTaskNoMoreData = false;
        this.isShowCompletetedTaskNoMoreData = false;
		getAllTaskList({proId : this.proId, workerId: this.workerId,taskType,system:6,page,pageSize})
        .then((res) => {
            this.loadingShow = false;
            this.overlayShow = false;
            if (res && res.data.code == 200) {
                if (taskType == 1) {
                    this.backlogTaskList = res.data.data.list;
                    this.totalCount = res.data.data.total;
                    this.fullBacklogTaskList = this.fullBacklogTaskList.concat(this.backlogTaskList);
                    if (this.fullBacklogTaskList.length == 0) {
                        this.backlogEmptyShow = true
                    }
                } else if (taskType == 2) {
                    this.completedTaskList = res.data.data.list;
                    this.totalCount = res.data.data.total;
                    this.fullCompletedTaskList = this.fullCompletedTaskList.concat(this.completedTaskList);
                    if (this.fullCompletedTaskList.length == 0) {
                        this.completedEmptyShow = true
                    }
                }
            } else {
            this.$toast({
                type: 'fail',
                message: res.data.msg
            })
            }
      })
      .catch((err) => {
        this.loadingShow = false;
        this.overlayShow = false;
        this.$toast({
          type: 'fail',
          message: err
        })
      })
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  .content-wrapper();
   .refuse-modal {
        /deep/ .van-dialog {
            border-top-left-radius: 4px !important;
            border-top-right-radius: 4px !important;
            border-bottom-left-radius: 4px !important;
            border-bottom-right-radius: 4px !important;
            .van-dialog__content {
                .evaluate-model-content {
                    width: 100%;
                    .evaluate-modal-top {
                        height: 37px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        padding: 0 10px;
                        box-sizing: border-box;
                        background: #F6F9FB;
                        >span {
                            font-size: 14px;
                            color: #101010;
                        }
                    };
                    .evaluate-modal-center {
                        padding: 10px 40px;
                        box-sizing: border-box;
                        .evaluate-box {
                            display: flex;
                            flex-direction: column;
                            .evaluate-span {
                                margin-bottom: 10px;
                                >span {
                                   font-size: 14px;
                                   color: #101010;
                                    &:nth-child(1) {
                                        color: red !important;
                                    };
                                }
                            };
                            .evaluate-content {
                                flex: 1;
                                border: 1px solid #888888;
                                .van-cell {
                                    padding: 6px !important;
                                }
                            }
                        }
                    };
                    .evaluate-modal-bottom {
                        padding: 15px 70px;
                        box-sizing: border-box;
                        display: flex;
                        align-items: center;
                        .evaluate-modal-btn {
                            width: 100%;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            .cancel-left {
                                width: 74px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid #BBBBBB;
                                box-sizing: border-box;
                                border-radius: 5px;
                                >span {
                                    font-size: 12px;
                                    color: #BBBBBB;
                                }
                            };
                            .submit-right {
                                width: 74px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: #3B9DF9;
                                border-radius: 5px;
                                >span {
                                    font-size: 12px;
                                    color: #fff
                                }
                            }
                        }
                    }
                }
            }
        }
    };
  .nav {
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 10;
    left: 0;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        };
        .van-nav-bar__right {
          .history-span {
            color: #fff;
            margin-left: 4px;
          }
        };
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
  /deep/ .van-loading {
    z-index: 1000000
  };  
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    .content-top-area {
      width: 100%;
      margin: 0 auto;
      height: 189px;
      position: absolute;
      top: 0;
      left: 0;
      background: #3B9DF9;
    };
    .content-box {
        flex: 1;
        margin-top: 50px;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0px 10px 50px 10px;
        .status-date-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            .status-box {
                width: 70px;
                margin-right: 20px;
                position: relative;
                .status-span {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    >span {
                        margin-right: 4px;
                        font-size: 12px;
                        color: #101010
                    }
                };
                .status-list-box {
                    width: 70px;
                    background: #fff;
                    position: absolute;
                    left: 0;
                    top: 20px;
                    max-height: 160px;
                    overflow: auto;
                    .status-list {
                        height: 20px;
                        width: 70px;
                        display: flex;
                        align-items: center;
                        >span {
                            display: inline-block;
                            height: 20px;
                            width: 70px;
                            font-size: 12px;
                            color: #101010
                        };
                        .statusspanStyle {
                            color: #7BE9A0 !important;
                        }
                    }
                }
            };
            .data-box {
                width: 0;
                display: flex;
                align-items: center;
                flex: 1;
                .date-span {
                    font-size: 12px;
                    color: #101010;
                    margin-right: 4px;
                };
                .date-choose {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 4px;
                    box-sizing: border-box;
                    height: 24px;
                    border: 1px solid #BBBBBB;
                    border-radius: 3px;
                    font-size: 12px;
                    color: #101010;
                }
            }
        };
        .order-list-box {
            flex: 1;
            overflow: auto;
            padding-bottom: 10px;
            box-sizing: border-box;
            .order-list {
                padding: 0 6px 20px 6px;
                box-sizing: border-box;
                background-color: rgba(255,255,255,1);
                box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.23);
                border-radius: 7px;
                margin-bottom: 10px;
                &:nth-child(1) {
                    margin-top: 10px;
                };
                .order-list-top {
                    display: flex;
                    height: 50px;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 6px;
                    box-sizing: border-box;
                    border-bottom: 1px solid rgba(0,0,0,0.23);
                    .order-type {
                        flex: 1;
                        margin-right: 10px;
                        .no-wrap();
                        >span {
                            font-size: 16px;
                            color: #3B9DF9;
                        }
                    };
                    .order-status {
                        display: flex;
                        height: 40px;
                        align-items: center;
                        justify-content: center;
                        width: 67px;
                        height: 25px;
                        background: rgba(232,203,81,0.16);
                        border-radius: 4px;
                        >span {
                            font-size: 14px;
                            color: #E8CB51;
                        }
                    };
                    .noStartStyle {
                    background: #BBBBBB !important
                    };
                    .underwayStyle {
                    background: #289E8E !important
                    };
                    .completeStyle {
                    background: #242424 !important
                    };
                    .redivStyle {
                    background: #F2A15F !important
                    };
                    .haveRedivStyle {
                    background: #9B7D31 !important
                    };
                    .waitRedivStyle {
                    background: orange !important
                    };
                    .cancelStyle {
                    background: #E8CB51 !important
                    };
                    .completeStyle {
                    background: #101010 !important
                    }
                };
                .order-list-center {
                    margin: 10px 0;
                    padding: 0 6px;
                    box-sizing: border-box;
                    .product-list {
                        display: flex;
                        >span {
                            display: inline-block;
                            font-size: 14px;
                            &:nth-child(1) {
                                color: #9E9E9A;
                                margin-right: 6px;
                            };
                            &:nth-child(2) {
                                word-break: break-all;
                                flex: 1;
                                color: #101010;
                            }
                        }
                    };
                    .create-delivery-date {
                        display: flex;
                        margin-top: 10px;
                        .create-delivery-date-left {
                            flex: 1;
                            width: 0;
                            display: flex;
                            margin-right: 4px;
                            >span {
                                display: inline-block;
                                font-size: 14px;
                                &:nth-child(1) {
                                    color: #9E9E9A;
                                    margin-right: 6px;
                                };
                                &:nth-child(2) {
                                    word-break: break-all;
                                    flex: 1;
                                    color: #101010;
                                }
                            }
                        };
                        .create-delivery-date-right {
                            flex: 1;
                            width: 0;
                            display: flex;
                            align-items: center;
                            >span {
                                display: inline-block;
                                font-size: 14px;
                                &:nth-child(1) {
                                    color: #9E9E9A;
                                    margin-right: 6px;
                                };
                                &:nth-child(2) {
                                    .no-wrap();
                                    flex: 1;
                                    color: #101010;
                                }
                            }
                        }
                    };
                    .delivery-address {
                        margin-top: 10px;
                    };
                    .remark-box {
                        margin-top: 10px;
                        >span {
                            &:nth-child(2) {
                                color: #9E9E9A !important;
                            }
                        }
                    }
                };
                .order-list-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    .order-list-btn {
                        display: flex;
                        align-items: center;
                        .delete-left {
                                width: 65px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border: 1px solid #E86F50;
                                box-sizing: border-box;
                                border-radius: 4px;
                                margin-right: 10px;
                                >span {
                                    font-size: 12px;
                                    color: #E86F50
                                }
                        };
                        .edit-right {
                                width: 65px;
                                height: 28px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                background: #3B9DF9;
                                border-radius: 4px;
                                margin-right: 10px;
                                >span {
                                    font-size: 12px;
                                    color: #fff
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