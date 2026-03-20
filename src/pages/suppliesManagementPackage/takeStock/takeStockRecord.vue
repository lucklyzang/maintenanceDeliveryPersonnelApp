<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="盘点记录" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-box">
          <div class="status-date-box">
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
				<div class="order-list" v-for="(item,index) in orderList" :key="index" @click="enterTakeStockOrderEvent(item,index)">
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
						<div class="create-delivery-date">
							<div class="create-delivery-date-left">
								<span>盘点日期:</span>
								<span>{{ item.createTime }}</span>
							</div>
							<div class="create-delivery-date-left">
								<span>盘点库房:</span>
								<span>{{ item.deliveryDate }}</span>
							</div>
						</div>
						<div class="product-list remark-box">
							<span>盘点人:</span>
							<span>{{ item.remark }}</span>
						</div>
					</div>
					<div class="order-list-bottom">
						<div class="order-list-btn">
							<div class="delete-left" @click.stop="deleteOrderEvent(item,index)">
								<span>删除</span>
							</div>
							<div class="edit-right" @click.stop="editEvent(item,index)">
								<span>编辑</span>
							</div>
                            <div class="audit-right" @click.stop="auditEvent(item,index)">
								<span>审核</span>
							</div>
						</div>
					</div>
				</div>
			</div>
        </div>
    </div>
    <!-- 审核记录弹框 -->
    <div class="revocation-delivery-order-modal">
        <van-dialog v-model="auditModalShow" :showConfirmButton="false">
            <div class="evaluate-model-content">
                <div class="evaluate-modal-top">
                    <span>审核</span>
                    <van-icon name="cross" color="#101010" size="20" @click="auditModalShow = false" />
                </div>
                <div class="evaluate-modal-center">
                  <van-icon name="checked" size="40" color="#289E8E" />
                  <div class="modal-center-content">请确认审核该记录</div>
                </div>
                <div class="evaluate-modal-bottom">
                    <div class="evaluate-modal-btn">
                        <div class="cancel-left" @click.stop="auditModalShowNoPassEvent">
                            <span>不通过</span>
                        </div>
                        <div class="submit-right" @click.stop="auditModalShowPassEvent">
                            <span>通过</span>
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
  name: "suppliesTakeStockRecord",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      backlogEmptyShow: false,
      showCalendar: false,
      auditModalShow: false,
      revocationInfoImage: require('@/common/images/home/revocation-info-icon.png'),
      sourcePath: '',
      defaultDateArr: [],
      startDate: '',
      endDate: '',
      minDate: new Date('2026-03-16'),
      maxDate: new Date('2027-03-16'),
      refuseReasonValue: '',
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
    this.deviceReturn('/suppliesTakeStock');
    this.getDateRange();
  },

  beforeRouteEnter(to, from, next) {
    next(vm=>{
        vm.sourcePath = from.path
    });
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
        this.$router.push({path: '/suppliesTakeStock'})
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

    // 审核记录弹框不通过事件
    auditModalShowNoPassEvent () {
      this.auditModalShow = false;
    },

    // 审核记录弹框通过事件
    auditModalShowPassEvent () {
      this.auditModalShow = false
    },

    // 进入盘点单详情事件
    enterTakeStockOrderEvent () {
        this.$router.push({path: '/suppliesTakeStockRecordDetails'})
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
    
    // 删除盘点单事件
    deleteOrderEvent(item,index) {
        this.revocationDeliveryOrderModalShow = true;
    },
    

    // 编辑盘点单事件k
    editEvent(item,index) {
        this.$router.push({path: '/suppliesEditTakeStock'})
    },

    // 审核盘点单事件
    auditEvent(item,index) {
        this.auditModalShow = true;
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
    .revocation-delivery-order-modal {
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
                      padding: 25px 40px;
                      box-sizing: border-box;
                      display: flex;
                      flex-direction: column;
                      justify-content: center;
                      align-items: center;
                     .modal-center-content {
                       margin-top: 30px;
                       font-size: 20px;
                       font-weight: bold;
                       color: #101010;
                     }
                  };
                  .evaluate-modal-bottom {
                      padding: 20px 40px;
                      box-sizing: border-box;
                      display: flex;
                      align-items: center;
                      .evaluate-modal-btn {
                          width: 100%;
                          display: flex;
                          align-items: center;
                          justify-content: space-between;
                          .cancel-left {
                              width: 100px;
                              height: 35px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              border: 1px solid #3B9DF9;
                              box-sizing: border-box;
                              border-radius: 8px;
                              >span {
                                  font-size: 14px;
                                  color: #3B9DF9;
                              }
                          };
                          .submit-right {
                              width: 100px;
                              height: 35px;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              background: #3B9DF9;
                              border-radius: 8px;
                              >span {
                                  font-size: 14px;
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
    width: 100%;
    background: #3B9DF9;
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
    .content-box {
        flex: 1;
        box-sizing: border-box;
        background: #fff;
        display: flex;
        flex-direction: column;
        height: 0;
        padding: 0px 10px 10px 10px;
        .status-date-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            .data-box {
                width: 70%;
                display: flex;
                align-items: center;
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
                        };
                        .audit-right {
                            width: 65px;
                            height: 28px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            background: #11D183;
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