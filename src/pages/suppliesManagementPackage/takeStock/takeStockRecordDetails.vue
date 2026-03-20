<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="盘点单" left-text="返回" left-arrow @click-left="onClickLeft" :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-box">
            <div class="take-stock-record-title">
                <div class="take-stock-record-title-top">
                    <div class="take-stock-date">
                        <span>盘点日期:</span>
                        <span>2026-02-28</span>
                    </div>
                    <div class="take-stock-warehouse">
                        <span>盘点库房:</span>
                        <span>中心库房</span>
                    </div>
                </div>
                <div class="take-stock-record-title-bottom">
                     <div class="take-stock-person">
                        <span>盘点人:</span>
                        <span>张三</span>
                    </div>
                </div>
            </div>
            <div class="delivery-table">
				<div class="delivery-table-title">
					<div class="product-cell">
						<span>产品</span>
					</div>
					<div class="specification-cell">
						<span>规格型号</span>
					</div>
					<div class="deliver-number-cell">
						<span>账面数</span>
					</div>
					<div class="sales-return-cell">
						<span>实盘数</span>
					</div>
					<div class="unit-cell">
						<span>单位</span>
					</div>
				</div>
				<div class="delivery-list-box">
					<div class="delivery-list">
						<div class="product-content">
							<span>面签</span>
						</div>
						<div class="specification-content">
							<span>5/盒</span>
						</div>
						<div class="deliver-number-content">
							<span>100</span>
						</div>
						<div class="sales-return-content">
                            200
						</div>
						<div class="unit-content">
							<span>盒</span>
						</div>
					</div>
				</div>
			</div> 
        </div>
        <div class="btn-box">
            <div class="btn-left">
            <span>重置</span>
            </div>
            <div class="btn-center">
            <span>保存</span>
            </div>
            <div class="btn-right">
            <span>提交</span>
            </div>
        </div> 
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {getAllTaskList} from '@/api/securityPatrol/escortManagement.js'
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
import SOtime from '@/common/js/SOtime.js'
export default {
  name: "suppliesTakeStockRecordDetails",
  components: {
    NavBar
  },
  mixins:[mixinsDeviceReturn],
  data() {
    return {
      loadingShow: false,
      overlayShow: false,
      backlogEmptyShow: false
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/suppliesTakeStockRecord');
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
        this.$router.push({path: '/suppliesTakeStockRecord'})
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
  .nav {
    width: 100%;
    background: #3B9DF9;
    /deep/ .van-nav-bar {
        background: transparent !important;
        .van-nav-bar__left {
            .van-nav-bar__span {
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
        padding: 0 6px 20px 6px;
        .take-stock-record-title {
            padding: 10px;
            box-sizing: border-box;
            .take-stock-record-title-top {
                display: flex;
                align-items: center;
                .take-stock-date {
                    flex: 1;
                    width: 0;
                    display: flex;
                    align-items: center;
                    margin-right: 4px;
                    >span {
                        font-size: 14px;
                        color: #101010;
                        &:nth-child(2) {
                            word-break: break-all;
                            margin-left: 4px;
                            flex: 1;
                        }
                    }
                };
                .take-stock-warehouse {
                    flex: 1;
                    width: 0;
                    display: flex;
                    align-items: center;
                    >span {
                        font-size: 14px;
                        color: #101010;
                        &:nth-child(2) {
                            word-break: break-all;
                            margin-left: 4px;
                            flex: 1;
                        }
                    }
                }
            };
            .take-stock-record-title-bottom {
                margin-top: 10px;
                .take-stock-person {
                    display: flex;
                    align-items: center;
                    >span {
                        font-size: 14px;
                        color: #101010;
                        &:nth-child(2) {
                            word-break: break-all;
                            margin-left: 4px;
                            flex: 1;
                        }
                    }
                }
            }
        };
        .delivery-table {
            flex: 1;
            border-radius: 6px;
            height: 0;
            display: flex;
            flex-direction: column;
            .delivery-table-title {
                height: 30px;
                display: flex;
                flex-wrap: nowrap;
                background: #f5f5f5;
                border-bottom: 1px solid #d8d0d0;
                >div {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex: 1;
                    height: 30px;
                    .no-wrap;
                    >span {
                        width: 100%;
                        text-align: center;
                        display: inline-block;
                        .no-wrap;
                        font-size: 12px;
                        color: #101010;
                    }
                };
                .specification-cell {
                    width: 70px !important;
                    flex: none !important;
                }
            };
            .delivery-list-box {
                flex: 1;
                overflow: auto;
                .delivery-list {
                    height: 30px;
                    display: flex;
                    flex-wrap: nowrap;
                    border-bottom: 1px solid #d8d0d0;
                    >div {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        flex: 1;
                        height: 30px;
                        .no-wrap;
                        >span {
                            width: 100%;
                            text-align: center;
                            display: inline-block;
                            .no-wrap;
                            font-size: 12px;
                            color: #101010;
                        }
                    };
                    .product-content {
                        >span {
                            font-weight: bold;
                        }
                    };
                    .specification-content {
                        width: 70px !important;
                        flex: none !important;
                    };
                    .sales-return-content {
                    };
                    .barter-content {
                    }
                }
            }
        }
    };
    .btn-box {
          height: 80px;
          padding: 0 14px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .btn-left {
              width: 84px;
              height: 44px;
              border: 1px solid #266FFF;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              >span {
              font-size: 12px;
              color: #3B9DF9;
              }
          };
          .btn-center {
              width: 100px;
              height: 44px;
              background: #3B9DF9;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              >span {
              font-size: 12px;
              color: #fff;
              }
          };
          .btn-right {
              width: 116px;
              height: 44px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 4px;
              background: #11D183;
              >span {
                  font-size: 12px;
                  color: #fff;
              }
          }
      }
  }
}
</style>