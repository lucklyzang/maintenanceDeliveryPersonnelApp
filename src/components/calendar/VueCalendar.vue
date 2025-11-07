<style scoped>
@media screen and (min-width: 460px) {
  .wh_item_date:hover {
    background: #71c7a5;
    cursor: pointer;
  }
}
* {
  margin: 0;
  padding: 0;
}

.wh_container {
  max-width: 410px;
  margin: auto;
}

li {
  list-style-type: none;
}
.wh_top_changge {
  display: flex;
  border-bottom: 1px solid #d5d5d5;
  height: 50px
}


.wh_top_changge .wh_content_li {
  cursor: auto;
  flex: 2.5;
  display: flex;
  justify-content: flex-start;
  padding: 0 20px;
  box-sizing: border-box;
  font-size: 16px;
  align-items: center;
  color: #0052D9 !important
}

.wh_top_changge .wh_content_li span {
    font-weight: bolder;
}

.wh_top_changge .wh_content_li span:first-child {
    margin-right: 20px
}

.wh_content_li_right {
    display: flex;
    flex: 1;
    align-items: center
}

.wh_content_li_right span {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #101010
}

.wh_content_li_right span:nth-child(2) {
    margin-left: 4px
}

.wh_content_li_right .van-icon-arrow-left {
    position: relative !important;
    height: 16px !important;
    line-height: 16px !important
}

.wh_content_all {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
    "Helvetica Neue", STHeiti, "Microsoft Yahei", Tahoma, Simsun, sans-serif;
  background-color: #fff;
  width: 100%;
  overflow: hidden;
  padding-bottom: 8px;
}

.wh_content {
  display: flex;
  flex-wrap: wrap;
  padding: 0 3% 0 3%;
  width: 100%;
}

.wh_content:first-child .wh_content_item {
  color: #ddd;
  font-size: 16px;
}

.wh_content_item {
  font-size: 15px;
  width: 13.4%;
  text-align: center;
  color: #101010;
  position: relative;
}
.wh_content_item {
  height: 40px;
  position: relative;
}

.wh_content_item .mark-icon {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #0052D9;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
    z-index: 10;
}

.wh_top_tag {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_item_date {
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.wh_content_item > .wh_isMark {
  margin: auto;
  border-radius: 100px;
  color: #0052D9;
  font-weight: bold;
  z-index: 2;
  position: relative;
}
.wh_content_item .wh_other_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_want_dayhide {
  color: #bfbfbf;
}
.wh_content_item .wh_isToday {
  background: #83b1fc !important;
  color: #fff;
  border-radius: 100px;
}
.wh_content_item .wh_chose_day {
  background: #0052D9 !important;
  color: #fff;
  border-radius: 100px;
}
</style>
<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <div class="wh_content_li">
            <span>{{dateTopYear}}</span>
            <span>{{dateTopMonth}}</span>
        </div>
        <div class="wh_content_li_right">
            <span @click="PreMonth(myDate,false)">
                <van-icon name="arrow-left" color="#101010" size="18px" />
            </span>
            <span>
                <van-icon name="circle" size="14px" color="#101010" />
            </span>
            <span @click="NextMonth(myDate,false)">
                <van-icon name="arrow" color="#101010" size="18px" />
            </span>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="tag in textTop" :key="tag">
          <div class="wh_top_tag">{{tag}}</div>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item,index) in list" @click="clickDay(item,index)" :key="index">
          <div
            class="wh_item_date"
            v-bind:class="[{ wh_isMark: item.isMark},{wh_other_dayhide:item.otherMonth!=='nowMonth' || (disableClickDateList.indexOf(item.date) == -1 && isDisabledSomeDayClick)},{wh_want_dayhide:item.dayHide},{wh_isToday:item.isToday},{wh_chose_day:item.chooseDay},setClass(item)]"
          >{{item.id}}</div>
          <div class="mark-icon" v-show="item.isMark"></div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import timeUtil from "./calendar";
export default {
  data() {
    return {
      myDate: [],
      list: [],
      historyChose: [],
      dateTopYear: "",
      dateTopMonth: "",
      disableClickDateList: []
    };
  },
  props: {
    markDate: {
      type: Array,
      default: () => []
    },
    disableClickDate: {
      type: Array,
      default: () => []
    },
    markDateMore: {
      type: Array,
      default: () => []
    },
    textTop: {
      type: Array,
      default: () => ["一", "二", "三", "四", "五", "六", "日"]
    },
    sundayStart: {
      type: Boolean,
      default: () => false
    },
    isDisabledSomeDayClick: {
      type: Boolean,
      default: () => false
    },
    showDate: {
      default: String
    },
    agoDayHide: {
      type: String,
      default: `0`
    },
    futureDayHide: {
      type: String,
      default: `2554387200`
    }
  },
  created() {
    this.intStart();
    this.myDate = new Date(this.showDate)
  },
  methods: {
    intStart() {
      timeUtil.sundayStart = this.sundayStart;
      this.disableClickDateList = this.disableClickDate
    },
    setClass(data) {
      let obj = {};
      obj[data.markClassName] = data.markClassName;
      return obj;
    },
    clickDay: function(item, index) {
      if ((this.disableClickDateList.indexOf(item.date) == -1) && this.isDisabledSomeDayClick ) { return };
      if (item.otherMonth === "nowMonth" && !item.dayHide) {
        this.getList(this.myDate, item.date);
      }
      if (item.otherMonth !== "nowMonth") {
        // item.otherMonth === "preMonth"
        //   ? this.PreMonth(item.date)
        //   : this.NextMonth(item.date);
      }
    },
    ChoseMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = new Date(date);
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    PreMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, "preMonth");
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    NextMonth: function(date, isChosedDay = true) {
      date = timeUtil.dateFormat(date);
      this.myDate = timeUtil.getOtherMonth(this.myDate, "nextMonth");
      this.$emit("changeMonth", timeUtil.dateFormat(this.myDate));
      if (isChosedDay) {
        this.getList(this.myDate, date, isChosedDay);
      } else {
        this.getList(this.myDate);
      }
    },
    forMatArgs: function() {
      let markDate = this.markDate;
      let markDateMore = this.markDateMore;
      markDate = markDate.map(k => {
        return timeUtil.dateFormat(k);
      });
      markDateMore = markDateMore.map(k => {
        k.date = timeUtil.dateFormat(k.date);
        return k;
      });
      return [markDate, markDateMore];
    },
    getList: function(date, chooseDay, isChosedDay = true) {
      const [markDate, markDateMore] = this.forMatArgs();
      this.dateTopYear = `${date.getFullYear()}年`;
      this.dateTopMonth = `${date.getMonth() + 1}月`;
      let arr = timeUtil.getMonthList(this.myDate);
      for (let i = 0; i < arr.length; i++) {
        let markClassName = "";
        let k = arr[i];
        k.chooseDay = false;
        const nowTime = k.date;
        const t = new Date(nowTime).getTime() / 1000;
        //看每一天的class
        for (const c of markDateMore) {
          if (c.date === nowTime) {
            markClassName = c.className || "";
          }
        }
        //标记选中某些天 设置class
        k.markClassName = markClassName;
        k.isMark = markDate.indexOf(nowTime) > -1;
        //无法选中某天
        k.dayHide = t < this.agoDayHide || t > this.futureDayHide;
        if (k.isToday) {
          this.$emit("isToday", nowTime);
        }
        let flag = !k.dayHide && k.otherMonth === "nowMonth";
        if (chooseDay && chooseDay === nowTime && flag) {
          this.$emit("choseDay", nowTime);
          this.historyChose.push(nowTime);
          k.chooseDay = true;
        } else if (
          this.historyChose[this.historyChose.length - 1] === nowTime &&
          !chooseDay &&
          flag
        ) {
          k.chooseDay = true;
        }
      }
      this.list = arr;
    }
  },
  mounted() {
    this.getList(this.myDate);
  },
  watch: {
    markDate: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    disableClickDate: {
      handler(val, oldVal) {
        this.disableClickDateList = val;
        console.log('非里面日期可点击',this.disableClickDateList);
      },
      deep: true
    },
    markDateMore: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    agoDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    futureDayHide: {
      handler(val, oldVal) {
        this.getList(this.myDate);
      },
      deep: true
    },
    sundayStart: {
      handler(val, oldVal) {
        this.intStart();
        this.getList(this.myDate);
      },
      deep: true
    },
    showDate: {
      handler(val, oldVal) {
        this.myDate = new Date(val);
        this.getList(this.myDate)
      },
      deep: true
    }
  }
};
</script>