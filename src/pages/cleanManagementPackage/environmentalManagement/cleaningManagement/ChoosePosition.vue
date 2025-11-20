<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">加载中...</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
       <van-nav-bar
        title="选择位置"
        left-text="返回"
        :left-arrow="true"
        :placeholder="true"
        :border="false"
        :fixed="true"
        z-index="1000"
        :safe-area-inset-top="true"
        @click-left="onClickLeft"
    >
    </van-nav-bar>
    </div>
    <div class="content">
      <van-empty description="暂无数据" v-show="emptyShow" />
      <!-- 建筑 -->
      <div class="departments-name-list" v-for="(item) in architectureList" :key="`${item.id}-${item.structName}`" v-show="architectureShow"
        @click="architectureClickEvent(item)"
      >
          <div class="departments-name-left">
            <span>建筑</span>
            <span>
              {{ item.structName }}
            </span>
          </div>
          <div class="departments-name-right">
              <van-icon name="arrow" color="#174E97" size="24" />
          </div>
      </div>
      <!-- 科室 -->
      <div class="departments-name-list" v-for="(item) in departmentList" :key="`${item.id}-${item.departmentName}`" v-show="departmentShow"
        @click="departmentClickEvent(item)"
      >
          <div class="departments-name-left">
            <span>科室</span>
            <span>
              {{ item.departmentName }}
            </span>
          </div>
          <div class="departments-name-right">
              <van-icon name="arrow" color="#174E97" size="24" />
          </div>
      </div>
      <!-- 目的区域 -->
      <div class="departments-name-list" v-for="(item) in goalAreaList" :key="`${item.id}-${item.itemName}`" v-show="goalAreaShow"
        @click="goalAreaClickEvent(item)"
      >
          <div class="departments-name-left">
            <span>区域</span>
            <span>
              {{ item.itemName }}
            </span>
          </div>
          <div class="departments-name-right">
              <van-icon name="arrow" color="#174E97" size="24" />
          </div>
      </div>
      <!-- 功能区 -->
      <div class="departments-name-list" v-for="(item) in functionAreaList" :key="`${item.id}-${item.name}`" v-show="functionAreaShow"
        @click="functionAreaClickEvent(item)"
      >
          <div class="departments-name-left">
            <span>功能区</span>
            <span>
              {{ item.name }}
            </span>
          </div>
          <div class="departments-name-right">
              <van-icon name="arrow" color="#174E97" size="24" />
          </div>
      </div>
    </div>
  </div>
</template>
<script>
import {getArchitectureMessage, getGoalAreaMessage, getFunctionAreaMessage, getDepartmentMessage} from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "ChoosePosition",
  components: {
  },
  data() {
    return {
      emptyShow: false,
      loadingShow: false,
      overlayShow: false,
      architectureShow: false,
      architectureList: [],
      selectArchitectureValue: [],
      departmentShow: false,
      departmentList: [],
      selectDepartmentValue: [],
      goalAreaShow: false,
      goalAreaList: [],
      selectgoalAreaValue: [],
      functionAreaShow: false,
      functionAreaList: [],
      selectFunctionAreaValue: []
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/addTask"
        })
      })
    };
    this.getArchitecture()
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","locationMessage"]),
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
    ...mapMutations(['storeLocationMessage']),
    onClickLeft() {
      	if (this.architectureShow) {
					this.$router.push({ path: "/addTask"});
				} else if (this.departmentShow) {
					this.emptyShow = false;
					this.departmentShow = false;
					this.architectureShow = true;
				} else if (this.goalAreaShow) {
					this.emptyShow = false;
					this.goalAreaShow = false;
					this.departmentShow = true;
				} else if (this.functionAreaShow) {
					this.emptyShow = false;
					this.functionAreaShow = false;
					this.goalAreaShow = true;
				}
    },

    // 获取建筑
    getArchitecture () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.emptyShow = false;
      this.functionAreaShow = false;
      this.goalAreaShow = false;
      this.departmentShow = false;
			this.architectureShow = true;
			this.architectureList = [];
      getArchitectureMessage({proId: this.proId}).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
					if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.architectureList = res.data.data;
            } else {
              this.emptyShow = true
            }
					} else {
						this.$toast({
							message: `${res.data.msg}`,
							type: 'fail'
						})
					}
				}).
				catch((err) => {
					this.$toast({
						message: `${err}`,
						type: 'fail'
					});
					this.loadingShow = false;
          this.overlayShow = false
			})
    },

    // 获取科室
    getDepartment () {
      this.emptyShow = false;
      this.loadingShow = true;
      this.overlayShow = true;
      this.functionAreaShow = false;
      this.goalAreaShow = false;
      this.architectureShow = false;
      this.departmentShow = true;
      this.departmentList = [];
      getDepartmentMessage({proId: this.proId,structId: this.selectArchitectureValue[0]['id']}).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
					if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.departmentList = res.data.data
            } else {
              this.emptyShow = true
            }
					} else {
						this.$toast({
							message: `${res.data.msg}`,
							type: 'fail'
						})
					}
				}).
				catch((err) => {
					this.$toast({
						message: `${err}`,
						type: 'fail'
					});
					this.loadingShow = false;
          this.overlayShow = false
			})
    },

    // 获取目的区域
    getGoalArea () {
      this.emptyShow = false;
      this.loadingShow = true;
      this.overlayShow = true;
      this.departmentShow = false;
      this.functionAreaShow = false;
      this.architectureShow = false;
      this.goalAreaShow = true;
      this.goalAreaList = [];
      getGoalAreaMessage({proId: this.proId,status: 1}).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
					if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.goalAreaList = res.data.data
            } else {
              this.emptyShow = true
            }
					} else {
						this.$toast({
							message: `${res.data.msg}`,
							type: 'fail'
						})
					}
				}).
				catch((err) => {
					this.$toast({
						message: `${err}`,
						type: 'fail'
					});
					this.loadingShow = false;
          this.overlayShow = false
			})
    },

    // 获取功能区
    getFunctionArea () {
      this.emptyShow = false;
      this.loadingShow = true;
      this.overlayShow = true;
      this.goalAreaShow = false;
      this.departmentShow = false;
      this.architectureShow = false;
      this.functionAreaShow = true;
      this.functionAreaList = [];
      getFunctionAreaMessage({proId: this.proId}).then((res) => {
          this.loadingShow = false;
          this.overlayShow = false;
					if (res && res.data.code == 200) {
            if (res.data.data.length > 0) {
              this.functionAreaList = res.data.data
            } else {
              this.emptyShow = true
            }
					} else {
						this.$toast({
							message: `${res.data.msg}`,
							type: 'fail'
						})
					}
				}).
				catch((err) => {
					this.$toast({
						message: `${err}`,
						type: 'fail'
					});
					this.loadingShow = false;
          this.overlayShow = false
			})
    },

    // 建筑点击事件
    architectureClickEvent (item) {
      this.selectArchitectureValue = [];
      this.selectArchitectureValue.push(item);
      this.getDepartment()
    },

    // 科室点击事件
    departmentClickEvent (item) {
      this.selectDepartmentValue = [];
      this.selectDepartmentValue.push(item);
      this.getGoalArea()
    },

    // 目的区域点击事件
    goalAreaClickEvent (item) {
      this.selectgoalAreaValue = [];
      this.selectgoalAreaValue.push(item);
      this.getFunctionArea()
    },

    // 功能区点击事件
    functionAreaClickEvent(item) {
      this.selectFunctionAreaValue = [];
      this.selectFunctionAreaValue.push(item);
      this.$router.push({ path: "/addTask"});
      let temporary = [];
      let temporaryMessage = temporary.concat(this.selectArchitectureValue,this.selectDepartmentValue,this.selectgoalAreaValue,this.selectFunctionAreaValue);
      this.storeLocationMessage(temporaryMessage)
    }
  }
};
</script>
<style lang='less' scoped>
@import "~@/common/stylus/variable.less";
@import "~@/common/stylus/mixin.less";
@import "~@/common/stylus/modifyUi.less";
.page-box {
  background: #F8F8F8;
  .content-wrapper();
  .nav {
    /deep/ .van-nav-bar {
        .van-nav-bar__left {
            .van-nav-bar__text {
                color: black !important;
                margin-left: 8px !important;
            };
            .van-icon {
                color: black !important;
                font-size: 22px !important;
            }
        }
        .van-nav-bar__title {
            color: black !important;
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
    padding-top: 6px;
    box-sizing: border-box;
    position: relative;
    /deep/ .van-empty {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%)
    };
    .departments-name-list {
        width: 100%;
        padding: 10px 8px;
        box-sizing: border-box;
        background: #fff;
        border-top: 1px solid #BBBBBB;
        border-bottom: 1px solid #BBBBBB;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        .departments-name-left {
            flex: 1;
            font-size: 16px;
            color: #101010;
            padding-right: 8px;
            box-sizing: border-box;
            word-break: break-all;
            >span {
              &:nth-child(1) {
                margin-right: 8px
              }
              &:nth-child(2) {
                color: #174E97
              }
            }
        };
        .departments-name-right {
            font-size: 14px;
            /deep/ .van-icon {
              vertical-align: middle
            }
        }
    }
  }
}
</style>