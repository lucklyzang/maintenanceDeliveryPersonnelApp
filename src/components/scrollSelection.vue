<template>
  <div>
    <div
      v-show="show"
      class="picker"
    >
      <section class="picker-main" :class="{'picker-box-activate': show,'picker-box-inertia': !show}">
        <h3 v-show="buttonLocation == 'bottom'">
          {{ title }}
          <van-icon name="cross" size="25" @click="close" />
        </h3>
        <div class="button-box-top" v-show="buttonLocation == 'top'">
          <span class="cancel-text" @click="cancel">取消</span>
          <span class="title-text"> {{ title }}</span>
          <span class="sure-text" @click="sure">确定</span>
				</div>
        <div class="search-box" v-show="isShowSearch">
            <van-search
                v-model="searchValue"
                show-action
                placeholder="请输入关键词进行搜索"
            >
            <template #action>
                <div @click="onSearch">搜索</div>
            </template>
            </van-search>
        </div>
        <div class="picker-box">
          <van-picker
            :columns="list"
            :default-index="pickerValues"
            @change=pickerChangeEvent
          />
        </div>
        <div class="button-box" v-show="list.length > 0 && buttonLocation == 'bottom'">
            <span @click="resetEvent" v-show="isShowReset">重置</span>
            <span @click="cancel" v-show="!isShowReset">取消</span>
            <span @click="sure">确认</span>
        </div>
        <van-empty description="暂无数据" v-show="list.length == 0" />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScrollSelection',
  props:{
    // 顶部标题
    title: {
      type: String,
      default: '请选择'
    },
    // 滚动展示的数据 格式[{id: '',text:'',value: ''}]
    columns: {
      type: Array,
      default: []
    },
    // 按钮位置
    buttonLocation: {
      type: String,
      default: 'bottom'
    },
    // 默认显示列索引
    pickerValues: {
      type: Number | String,
      default: 0
    },
    // 是否显示搜索框
    isShowSearch: {
      type: Boolean,
      default: false
    },
    // 是否显示重置按钮
    isShowReset: {
      type: Boolean,
      default: false
    }
  }, 
  data() {
    return {
      isClickSearch: false,
      searchValue: '',
      cacheList: '',
      list: [],
      currentValue: '',
      currentId: '',
      show: false,
      currentText: "",
      triggerChanged: false
    }
  },

   watch: {
      columns: {
        handler: function(newVal, oldVal) {
          // 点击搜索时不进行监听
          if (!this.isClickSearch) {
            this.list = this.columns;
            this.cacheList = this.list;  
            this.showPicker()
          }
        },
        deep: true
    },
  },

  mounted () {
    this.list = this.columns;
    this.cacheList = this.list;
    this.showPicker()
  },

  methods: {

    // 搜索事件
    onSearch(val) {
      this.isClickSearch = true;
      this.list = this.cacheList.filter((item) => { return item.text.indexOf(this.searchValue) != -1});
      this.showPicker()
    },

    // 重置事件
    resetEvent () {
      this.searchValue = '';
      this.list = this.cacheList;
      this.showPicker()
    },

    // 初始化事件
    showPicker() {
      this.show = true
    },

    // picker值改变事件
    pickerChangeEvent (picker, value, index) {
      this.triggerChanged = true;
      this.currentId = value['id'];
      this.currentText = value['text'];
      this.currentValue = value['value']
    },

    // 确认事件
    sure() {
      if (this.list.length == 1) {
        this.currentId = this.list[0]['id'];
        this.currentText = this.list[0]['text'];
        this.currentValue = this.list[0]['value'];
      } else {
        if (!this.triggerChanged) {
          this.currentId = this.list[Number(this.pickerValues)]['id'];
          this.currentText = this.list[Number(this.pickerValues)]['text'];
          this.currentValue = this.list[Number(this.pickerValues)]['value'];
        }
      };
      this.triggerChanged = false;
      this.$emit('sure',this.currentText,this.currentValue,this.currentId);
      // 没有搜索结果时点确认
      if (this.list.length == 0) {
        this.$emit('sure',null)
      };
      this.show = false
    },

    // 关闭事件
    close () {
      this.$emit('close',this.currentText);
      this.show = false
    },

    // 取消事件
    cancel() {
      this.$emit('cancel',this.currentText);
      this.show = false
    }
  }
};
</script>
<style lang="less" scoped>
.picker {
  background-color: rgba(0,0,0,.7);
  max-height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  display: flex;
  .picker-main {
   display: flex;
   flex-direction: column;
    width: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    padding: 0px 0px 20px 0px;
    box-sizing: border-box;
    position: absolute;
    bottom: 0;
    background-color: #fff;
    /deep/ .van-empty {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .van-empty__description {
            padding: 0 
        }
    };
    h3 {
      display: flex;
      justify-content: space-around;
      font-size: 18px;
      line-height: 40px;
      color: #101010;
      height: 40px;
      position: relative;
      /deep/ .van-icon {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 0
      }
    };
    .button-box-top {
				height: 44px;
				background: #F7F7F9;
				font-size: 16px;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 0 10px;
				box-sizing: border-box;
				.cancel-text {
					color: #8F8F91;
				};
				.title-text {
					color: #101010;
				};
				.sure-text {
					color: #3370FF;
				}
		};
    .search-box {
        /deep/ .van-search  {
            .van-search__content  {
                border-radius: 20px
            };
            .van-search__action {
              color: #3B9DF9;
              font-size: 14px
            }
        }
    };
    .picker-box {
      /deep/ .van-picker {
        .van-picker__columns {
          .van-picker-column__wrapper {
            .van-picker-column__item {
              font-size: 18px !important;
            };
            .van-picker-column__item--selected {
              color: #101010 !important
            }
          }
        }
      }
    };
    .button-box {
        height: 60px;
        display: flex;
        width: 100%;
        margin: 0 auto;
        align-items: center;
        justify-content: center;
        >span {
            width: 40%;
            display: inline-block;
            height: 45px;
            font-size: 18px;
            line-height: 45px;
            background: #fff;
            text-align: center;
            border-radius: 30px;
            &:nth-child(1) {
                color: #1864FF;
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                margin-right: 40px
            };
            &:nth-child(2) {
                color: #1864FF;
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
                margin-right: 40px
            };
            &:last-child {
                color: #fff;
                background: linear-gradient(to right, #6cd2f8, #2390fe);
                box-shadow: 0px 2px 6px 0 rgba(36, 149, 213, 1);
            }
        }
    }
  };
  // 渐出动画
  .picker-box-activate {
    transition: 0.6s all;
    transform: translateY(0%);
    opacity: 1;
    visibility: visible
  };
  // 渐入动画
  .picker-box-inertia {
    transition: 0.6s all;
    transform: translateY(100%);
    opacity: 0;
    visibility: hidden
  }
};  
.active {
  background-color: #f3f3f3 !important;
  color: #3B9DF9 !important
}
</style>