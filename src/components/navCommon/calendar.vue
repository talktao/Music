<template>
  <div class="innerImg" @click="$emit('click')">
    <div class="week text-white fs-lg">{{nowDay}}</div>
    <div class="day">{{nowDate}}</div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      nowDay: "星期五",
      nowDate: 1
    };
  },
  created() {
    this.getNowDate();
  },
  methods: {
    getNowDate() {
      var date = new Date();
      var nowDate = date.getDate();
      var nowDay = date.getDay();
      var weekday = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      this.nowDate = nowDate;
      this.nowDay = weekday[nowDay];
    }
  }
};
</script>

<style lang="scss" scoped>
.innerImg {
  width: 140px;
  height: 140px;
  background-color: #fff;
  background-size: contain;
  background: url("~assets/img/home/date.png");
  display: flex;
  flex-direction: column;
  > div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .week {
    height: 33px;
    text-shadow: 0 -1px #026167;
  }
  .day {
    flex: 1;
    background: url("~assets/img/home/date.png") 0 -150px;
    font-size: 94px;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: bold;
    color: #202020;
  }
}
</style>