<template>
  <div class="page-box" ref="wrapper">
    <van-loading size="35px" vertical color="#e6e6e6" v-show="loadingShow">{{ loadingText }}</van-loading>
    <van-overlay :show="overlayShow" z-index="100000" />
    <div class="nav">
      <NavBar path="/pollingTaskDetails" title="未完成原因" />
    </div>
    <div class="content">
        <div class="no-complete-reason-box-wrapper">
            <div class="no-complete-reason-box">
                <div class="title-reason">
                    <span>*</span>
                    <span>未完成原因</span>
                </div>
                <van-field
                    v-model="reasonValue"
                    rows="4"
                    autosize
                    type="textarea"
                    maxlength="200"
                    placeholder="请输入未完成该条巡检任务的原因"
                    show-word-limit
                />
            </div>
        </div>
        <div class="btn-box" @click="submitEvent">提交</div>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar";
import { submitUnfinishedReason, getUnfinishedReason } from "@/api/clean/environmentalManagement.js";
import { mapGetters, mapMutations } from "vuex";
import { IsPC } from "@/common/js/utils";
export default {
  name: "PollingTaskNoCompleteReason",
  components: {
    NavBar
  },
  data() {
    return {
        reasonValue: '',
        loadingText: '提交中...',
        loadingShow: false,
        overlayShow: false
    }
  },

  mounted() {
    // 控制设备物理返回按键
    if (!IsPC()) {
      pushHistory();
      this.gotoURL(() => {
        pushHistory();
        this.$router.push({
          path: "/pollingTaskDetails"
        })
      })
    };
    this.getUnfinishedReasonEvent()
  },

  watch: {},

  computed: {
    ...mapGetters(["userInfo","chooseHospitalArea","cleanTaskDetails"]),
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
    ...mapMutations(["changeIsLogin"]),

    //tab切换点击事件
    tabsClickEvent (item,index) {
        this.currentTabIndex = index
    },

    // 角落列表点击事件
    cornerClickEvent (item,index) {
        this.$router.push({path: '/taskList'})
    },

    // 提交原因事件
    submitEvent () {
      if (!this.reasonValue) {
        this.$toast({
            message: '请输入未完成原因',
            type: 'fail'
        });
        return
      };
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '提交中...';
      submitUnfinishedReason({
        id: this.cleanTaskDetails.id,
        unfinishedReason: this.reasonValue
      })
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        if (res && res.data.code == 200) {
            this.$Alert({message:"提交成功!",duration:3000,type:'success'});
            this.$router.push({
              path: "/pollingTaskDetails"
            })
          } else {
            this.$toast({
              message: `${res.data.msg}`,
              type: 'fail'
            })
          }
        })
        .catch((err) => {
          this.$toast({
              message: `${err}`,
              type: 'fail'
          });
          this.loadingShow = false;
          this.overlayShow = false
        })
    },

    // 查询提交原因事件
    getUnfinishedReasonEvent () {
      this.loadingShow = true;
      this.overlayShow = true;
      this.loadingText = '加载中...';
      getUnfinishedReason(this.cleanTaskDetails.id)
      .then((res) => {
        this.loadingShow = false;
        this.overlayShow = false;
        if (res && res.data.code == 200) {
          if (!res.data.data) { return };
          this.reasonValue = res.data.data
        } else {
          this.$toast({
            message: `${res.data.msg}`,
            type: 'fail'
          })
        }
      })
      .catch((err) => {
        this.$toast({
          message: `${err}`,
          type: 'fail'
        });
        this.loadingShow = false;
        this.overlayShow = false
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
  /deep/ .van-loading {
    z-index: 1000000
  };
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
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #F8F8F8;
    height: 0;
    .no-complete-reason-box-wrapper {
      flex: 1;
      .no-complete-reason-box {
          padding: 0 10px 10px 10px;
          box-sizing: border-box;
          background: #fff;
          margin-top: 12px;
          .title-reason {
              height: 40px;
              display: flex;
              align-items: center;
              >span {
                  &:first-child {
                    color: red;
                    margin-right: 2px
                  };
                  &:last-child {
                    color: #101010;
                    font-size: 14px
                  }
              }
          };
          /deep/ .van-cell {
            background: #F8F8F8;
            font-size: 12px;
            padding: 4px 6px !important
          }
      }  
    };
    .btn-box {
        height: 48px;
        width: 266px;
        font-size: 18px;
        margin: 0 auto;
        line-height: 48px;
        background: linear-gradient(to right, #6cd2f8, #2390fe);
        box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
        color: #fff;
        border-radius: 30px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 20px;
        text-align: center;
    }
  }
}
</style>