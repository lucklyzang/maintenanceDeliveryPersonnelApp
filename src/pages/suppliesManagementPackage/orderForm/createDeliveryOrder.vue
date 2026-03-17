<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
        <van-nav-bar title="生成送货单" left-span="返回" left-arrow @click-left="onClickLeft"  :border="false">
        </van-nav-bar>
    </div>
    <div class="content">
        <div class="content-box">
            <div class="content-top">
				<div class="content-top-left">
					<span>生成送货单</span>
				</div>
			</div>
			<div class="content-center">
				<div class="empty-info" v-if="chooseMaterialList.length == 0">
					<van-empty description="暂无产品" />
				</div>
				<div class="product-list" v-for="(item,index) in chooseMaterialList" :key="item.productName">
					<div class="product-left">
						<img :src="item.productImage" />
					</div>
					<div class="product-center">
						<div class="product-name">
							<span>
								{{ item.productName }}
							</span>
						</div>
						<div class="product-specification">
							<div class="product-specification-left">
								<span>
									{{ item.specification }}
								</span>
							</div>
						</div>
					</div>
					<div class="product-right">
						<div class="product-number-box">
							<van-stepper v-model="item.quantity" @change="function(val){productNumberBoxChange(item,index,val)}" integer min="0" />
						</div>
						<div class="product-total-price">
              <div class="total-demand">
                <span>总需求数</span>
                <span>200</span>
              </div>
              <div class="surplus-demand">
                <span>剩余需求数</span>
                <span>100</span>
              </div>
						</div>
					</div>
				</div>
			</div>
			<div class="total-prices">
				<div class="total-prices-right">
					<span>总数量:</span>
					<span>{{ `${allChooseProductPrice}` }}</span>
				</div>
			</div>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn-left" @click="quitEvent">
            <span>退出</span>
        </div>
        <div class="btn-right" @click="submitEvent">
            <span>提交</span>
        </div>
    </div>
    <!-- 确定生成送货单弹框	 -->
    <div class="create-delivery-order-modal">
        <van-dialog v-model="createDeliveryOrderModalShow" :showConfirmButton="false">
            <div class="evaluate-model-content">
                <div class="evaluate-modal-top">
                    <span></span>
                    <van-icon name="cross" color="#101010" size="20" @click="createDeliveryOrderModalShow = false" />
                </div>
                <div class="evaluate-modal-center">
                   <div class="modal-center-title">
                     确定要生成送货单吗？
                   </div>
                   <div class="modal-center-content">
                     <span>
                       订单号不变，选中的物品生成新的送货单，新生成的送货单号为
                     </span>
                     <span>【SHD456332】</span>
                   </div>
                   <div class="modal-center-info">
                     您可以继续生成新的送货单
                   </div>
                </div>
                <div class="evaluate-modal-bottom">
                    <div class="evaluate-modal-btn">
                        <div class="cancel-left" @click.stop="createDeliveryOrderModalShowCancelEvent">
                            <span>取消</span>
                        </div>
                        <div class="submit-right" @click.stop="createDeliveryOrderModalShowSubmitEvent">
                            <span>生成</span>
                        </div>
                    </div>
                </div>
            </div>
        </van-dialog>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { mapGetters, mapMutations } from "vuex";
import {mixinsDeviceReturn} from '@/mixins/deviceReturnFunction'
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
      allChooseProductPrice: 0,
      createDeliveryOrderModalShow: false,
      chooseMaterialList: [
          {
            productName: '洗手液',
            specification: '500ML',
            unit: '瓶',
            unitPrice: '4.5',
            quantity: 0,
            checked: false,
            disabled: false,
            productImage: require('@/common/images/home/supplies-order-icon.png')
        },
        {
            productName: '一次性垫',
            specification: '90*40cm',
            unit: '包',
            unitPrice: '8.3',
            quantity: 0,
            checked: false,
            disabled: false,
            productImage: require('@/common/images/home/supplies-order-icon.png')
        }
      ],
    }
  },

  mounted() {
    // 控制设备物理返回按键
    this.deviceReturn('/suppliesOrderList');
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
      this.$router.push({path: '/suppliesOrderList'})
    },

    // 求和函数(计算所有添加产品总价格)
    reduceTotal() {
        let targetMsg = this.chooseMaterialList.filter((item) => {
            return item.quantity > 0
        });
        this.allChooseProductPrice = targetMsg.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.quantity
        }, 0);
    },

    // 保留两位小数，返回数字类型，修复精度问题
    formatPrice(num) {
        if (typeof num !== 'number' || isNaN(num)) return "0.00";
        const value = Math.round(num * 100) / 100;
        return value.toFixed(2);
    },

    // 产品步进器change事件
    productNumberBoxChange(item,index,val) {
        if (val === 0) {
          this.chooseMaterialList.splice(index,1);
        };
        item['quantity'] = val;
        this.reduceTotal();
    },

    // 确定生成送货单弹框取消事件
    createDeliveryOrderModalShowCancelEvent () {
      this.createDeliveryOrderModalShow = false;
    },

    // 确定生成送货单弹框确定事件
    createDeliveryOrderModalShowSubmitEvent () {
      this.createDeliveryOrderModalShow = false;
    },

    // 退出事件
    quitEvent() {
      this.$router.push({path: '/suppliesOrderList'});
    },

    // 提交事件
    submitEvent() {
      this.createDeliveryOrderModalShow = true;
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
            .van-nav-bar__text {
              color: #fff !important;
              margin-left: 8px !important;
            };
            .van-icon {
              color: #fff !important;
            }
        };
        .van-nav-bar__title {
          color: #fff !important;
          font-size: 16px !important;
        }
    }
  };
   .create-delivery-order-modal {
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
                      padding: 20px 40px;
                      box-sizing: border-box;
                     .modal-center-title {
                       text-align: center;
                       font-size: 14px;
                       color: #101010;
                     };
                     .modal-center-content {
                       margin: 20px 0;
                       word-break: break-all;
                       >span {
                        font-size: 14px;
                        color: #989999;
                        &:nth-child(2) {
                          margin-left: 4px;
                          color: red;
                        }
                       }
                     };
                     .modal-center-info {
                       word-break: break-all;
                       font-size: 14px;
                       color: #989999;
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
        padding:  0 6px;
      .content-top {
			 height: 40px;
			 padding: 0 4px;
			 box-sizing: border-box;
			 display: flex;
			 align-items: center;
			 justify-content: space-between;
			 .content-top-left {
				 >span {
					font-size: 14px;
					color: #777575; 
				 }
			 }
		 };
		 .content-center {
			 width: 99%;
			 flex: 1;
			 margin: 0 auto;
			 border-radius: 6px;
			 background: #F0F2FE;
			 overflow: auto;
			 position: relative;
      /deep/ .van-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%)
      };
			 .product-list {
				 padding: 10px 4px;
				 box-sizing: border-box;
				 border-bottom: 1px solid #BBBBBB;
				 display: flex;
				 align-items: center;
				 .product-left {
					 margin-right: 10px;
					 img {
						 width: 54px;
						 height: 54px;
					 }
				 };
				 .product-center {
					 flex: 1;
					 .no-wrap;
					 .product-name {
						 .no-wrap;
						 margin-bottom: 10px;
						 >span {
							 width: 100%;
							 display: inline-block;
							 .no-wrap;
							 font-size: 14px;
							 color: #3B9DF9;
						 }
					 };
					 .product-specification {
						 display: flex;
						 .no-wrap;
						 .product-specification-left {
							 >span {
								 font-size: 12px;
								 color: #777575;
							 }
						 }
					 }
				 };
				 .product-right {
					 display: flex;
					 flex-direction: column;
					 justify-content: center;
					 width: 180px;
					 .product-number-box {
						 margin-bottom: 4px;
             display: flex;
             justify-content: flex-end;
						 /deep/ .van-stepper{
                width: 70%;
                display: flex;
							 .van-stepper__minus {
								 background: transparent !important;
							 };
               .van-stepper__minus::before {
                 background: #3B9DF9 !important;
                 height: 2px;
               };
							 .van-stepper__input {
								 border-radius: 5px;
								 height: 25px !important;
								 border: 1px solid #9EA1B6 !important;
								 font-size: 14px !important;
								 color: #101010 !important;
								 flex: 1;
								 box-sizing: border-box;
							 };
							 .van-stepper__plus {
								background: transparent !important;
							 };
               .van-stepper__plus::before {
                 background: #3B9DF9 !important;
                 height: 2px;
               };
               .van-stepper__plus::after {
                 background: #3B9DF9 !important;
                 width: 2px;
               };
						 }
					 };
					 .product-total-price {
             display: flex;
             align-items: center;
             .total-demand {
               flex: 1;
               >span {
                font-size: 10px;
                color: #777575;
                &:nth-child(1) {
                  margin-right: 4px;
                }
               }
             };
             .surplus-demand {
               flex: 1;
                >span {
                font-size: 10px;
                color: #777575;
                &:nth-child(1) {
                  margin-right: 4px;
                }
               }
             }
					 }
				 }
			 }
		 };
		 .total-prices {
			 width: 96%;
			 height: 40px;
			 display: flex;
			 align-items: center;
			 justify-content: flex-end;
			 margin: 0 auto;
			 .total-prices-right {
				>span {
				 font-size: 14px;
				 color: #3B9DF9;
				 &:nth-child(1) {
					 margin-right: 4px;
				 }
				} 
			 }
		 }
    }
  };
  .btn-box {
        height: 60px;
        padding: 0 14px;
        box-sizing: border-box;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .btn-left {
            width: 45%;
            height: 32px;
            border: 1px solid #3B9DF9;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            >span {
            font-size: 12px;
            color: #3B9DF9;
            }
        };
        .btn-right {
            width: 45%;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background: #3B9DF9;
            >span {
                font-size: 12px;
                color: #fff;
            }
        }
    }
}
</style>