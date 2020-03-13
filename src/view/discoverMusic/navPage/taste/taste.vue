<template>
  <cc-list>
    <div slot="leftList" class="leftList w-10">
      <div class="topImg w-10">
        <calendar class="calendar" />
      </div>
      <table-list
        style="width:100%;"
        :playlist="playlist"
        :songListInfo="songListInfo"
        paddingLeft="0"
      />
    </div>
    <div slot="rightList" class="rightList1 w-10"></div>
  </cc-list>
</template>

<script>
import tableList from "@/components/navCommon/tableList";
import { getRecommendSongs } from "@/api/recommend";
import { formatSE } from "@/utils/time/formatTime";
import { mapMutations } from "vuex";
import { getPlaylist, getSubcount } from "@/api/user";
import ccList from "@/components/navCommon/commonCenterList";
import calendar from "@/components/navCommon/calendar";
export default {
  name: "",
  components: {
    tableList,
    ccList,
    calendar
  },
  data() {
    return {
      playlist: [],
      songListInfo: {}
    };
  },
  watch: {},
  created() {
    this.initRecommondResource();
  },
  methods: {
    async initRecommondResource() {
      const res = await getRecommendSongs();
      let nowId;
      try {
        nowId = JSON.parse(localStorage.getItem("nowPlaying")).id;
      } catch (err) {
        nowId = 0;
      }
      let temptList = [];
      res.data.recommend.forEach((item, index) => {
        temptList[index] = {
          id: item.id,
          coverImgUrl: item.album.picUrl,
          title: item.name,
          length: formatSE(Number(item.duration) / 1000),
          album: item.album.name,
          author: "",
          active: false
        };
        var tempAuthors = [];
        item.artists.forEach((item1, index1) => {
          tempAuthors.push(item1.name);
        });
        temptList[index].author = tempAuthors.join("、");
        if (item.id == nowId) {
          temptList[index].active = true;
        }
      });
      this.songListInfo = {
        id: 0,
        count: res.data.recommend.length,
        playCount: 0
      };
      this.playlist = temptList;
    }
  }
};
</script>

<style lang="scss" scoped>
.leftList {
  padding: 47px 30px 40px 39px;
  box-sizing: border-box;
  .topImg {
    background-image: url("~assets/img/home/recmd_daily.jpg");
    background-repeat: no-repeat;
    background-size: 100% 180px;
    height: 180px;
    margin-bottom: 45px;
    .calendar {
      transform: scale(0.8) translate(54px, 20px);
    }
  }
}
.rightList {
}
</style>