<template>

  <cc-list>

    <div slot="leftList"
         class="leftList w-10">

      <div class="ghander">
        <div class="tupian">
          <img :src="play.coverImgUrl"
               alt="">
        </div>

        <div class="content">
          <div class="title">
            <i class="titleimg"></i>
            <span>{{play.name}}</span></div>

          <div class="tuxiang">
            <span><img style="display:inline;"
                   :src="`${playll.avatarUrl}`"></span>
            <span>{{playll.nickname}}</span>
            <i class="tuxiangimg"></i>

            <span>{{play.createTime}}创建</span>
          </div>
          <div class="butt">
            <span class="butto bofang">
              <div>播放</div>
            </span>
            <span class="butto shou">({{play.subscribedCount}})<i class="butto ttt"></i></span>
            <span class="butto zhuan">{{play.trackCount}}</span>
            <span class="butto xia">下载</span>
            <span class="butto ping">{{play.commentCount}}</span>
          </div>
          <div class="biaoqian">
            标签:
            <span class="tag butto"
                  v-for="(item,index) in play.tags"
                  :key="index">{{item}}
              <i class="butto t"></i>
            </span>
          </div>
          <div>
            介绍：
            <span class="text"
                  v-html="r">{{r}}</span>
          </div>

        </div>
      </div>

      <table-list :playlist="playlist" />
    </div>
    <div slot="rightList"
         class="rightList1 w-10"></div>
  </cc-list>

</template>
<script>
import tableList from "@/components/navCommon/tableList";
import ccList from "@/components/navCommon/commonCenterList";
import { getPlaylistDetail } from "@/api/playlist"
import { formatPlayListDetail } from "@/utils/dataFilter/playlist"
export default {

  props: {
    id: { type: [String, Number] }
  },
  created () {
    this.getPlaylistDetail()
  },
  data () {
    return {
      playlist: [],
      play: [],
      playll: [],
      r: ''
    }
  },
  components: {
    tableList,
    ccList
  },
  methods: {
    async getPlaylistDetail () {
      const res = await getPlaylistDetail({ id: this.id })
      console.log(res)
      this.play = res.data.playlist
      console.log(this.play)
      this.playll = this.play.creator
      this.playlist = formatPlayListDetail(res.data.playlist.tracks)
      this.r = this.play.description.replace(/[,， ]/g, ",<br>");
    },
  }
}
</script>
<style scoped>
.butto {
  background: url(../../../../assets/img/home/button2.png) no-repeat 0 9999px;
}
.zhuan {
  display: inline-block;
  background-position: 0 -1225px;
  width: 35px;
  height: 31px;
  padding-top: 7px;
  padding-left: 28px;
  margin-right: 8px;
}
.xia {
  display: inline-block;
  background-position: 0 -2761px;
  width: 35px;
  height: 31px;
  padding-top: 7px;
  padding-left: 28px;
  margin-right: 8px;
}
.ping {
  display: inline-block;
  background-position: 0 -1465px;
  width: 35px;
  height: 31px;
  padding-top: 7px;
  padding-left: 28px;
  margin-right: 8px;
}
.shou {
  display: inline-block;
  background-position: 0 -977px;
  width: 68.4px;
  height: 31px;
  padding-top: 7px;
  padding-left: 28px;
  margin-right: 8px;
}
.tag {
  display: inline-block;
  color: #777777;
  width: 30px;
  height: 20px;
  padding-left: 8px;
  background-position: 0 -2055px;
  margin-right: 8px;
}
.t {
  background-position: -240px -2088px;
  position: absolute;
  width: 10px;
  height: 20px;
}
.bofang {
  display: inline-block;
  background-position: 0 -633px;
  width: 66px;
  height: 31px;
  color: aliceblue;
  text-align: center;
  padding-top: 7px;
  padding-left: 15px;
  margin-right: 8px;
}

.tuxiangimg {
  display: inline-block;
  background: url(../../../../assets/img/home/icon2.png) no-repeat -70px 0;
  width: 14px;
  height: 14px;
  margin-right: 20px;
}
.titleimg {
  display: inline-block;
  background: url(../../../../assets/img/home/icon2.png) no-repeat 0 -75px;
  width: 73px;
  height: 24px;
}

.ghander {
  height: 100%;
  margin-top: 35px;
  display: flex;
  justify-content: space-between;
}
.tupian {
  margin-right: 35px;
}
.content {
  display: flex;
  flex-grow: 1;
  flex-flow: column;
  justify-content: center;
}
.content .title {
  line-height: 24px;
  font-size: 20px;
  font-weight: normal;
  display: flex;
}
.tuxiang {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.tuxiang img {
  width: 46px;
  height: 46px;
  border: none;
  line-height: 35px;
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.title {
  margin-bottom: 20px;
}
.text {
  margin-top: 4px;
  line-height: 18px;
  color: #666;
}
.biaoqian {
  margin: 10px 0 5px;
  line-height: 22px;
}
.tupian img {
  width: 180px;
  height: 180px;
  padding: 3px;
  border: 1px solid #d1d0d0;
}
</style>