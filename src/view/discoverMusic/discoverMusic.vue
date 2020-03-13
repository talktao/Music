<template>
  <div class="myMusic">
    <div class="topNav">
      <div class="centerArea">
        <div
          :class="{active: item.click}"
          @click="handleClickCategory(index)"
          v-for="(item,index) in navList"
          :key="index"
          class="navItem"
        >{{item.title}}</div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      navList: [
        { title: "推荐", click: true },
        { title: "排行榜", click: false },
        { title: "歌单", click: false },
        { title: "主播电台", click: false },
        { title: "歌手", click: false },
        { title: "新碟上架", click: false }
      ]
    };
  },
  methods: {
    handleClickCategory(index) {
      this.navList.forEach((item1, index1) => {
        this.navList[index1].click = false;
      });
      this.navList[index].click = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.myMusic {
  .topNav {
    height: 35px;
    background-color: $primary;
    display: flex;
    justify-content: center;
    flex-shrink: 0;
    .centerArea {
      height: 100%;
      display: flex;
      transform: translateX(-21%);
      align-items: center;
      flex-shrink: 0;
      .navItem {
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        height: 20px;
        border-radius: 12px;
        padding: 0 13px;
        margin: 0 13px;
        color: #ffffff;
        flex-shrink: 0;
        &:hover {
          background-color: #158482;
        }
      }
      .active {
        background-color: #158482;
      }
    }
  }
}
</style>