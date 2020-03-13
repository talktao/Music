<template>
  <div class="tableList">
    <div class="headFoot" :style="{paddingLeft:paddingLeft}" v-if="songListInfo">
      <div class="left">
        <div class="title">歌曲列表</div>
        <div class="count">{{songListInfo.count}}首歌</div>
      </div>
      <div class="right" v-if="songListInfo.playCount">
        <div class="title">播放：</div>
        <div class="count">{{songListInfo.playCount}}</div>
        <div class="second">次</div>
      </div>
    </div>
    <div
      v-if="loadMusicList"
      style="width:100%;height:100px;"
      v-loading="loadMusicList"
      element-loading-text="加载中..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)"
    ></div>
    <div class="musicList">
      <table v-if="!loadMusicList">
        <thead>
          <tr>
            <th v-for="(item,index) in headTitles" :key="index">
              <div>{{item}}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            :style="{backgroundColor: index%2==0?'#fff':'#f7f7f7'}"
            v-for="(item,index) in playlist"
            :key="index"
          >
            <td>
              <div>
                <span>{{index+1}}</span>
                <span @click="handleToPlay(index)" :class="{active: item.active}" class="playIcon"></span>
              </div>
            </td>
            <td>
              <div :title="item.title">
                {{item.title.substr(0,28)}}
                <div v-if="item.title.length>28">...</div>
              </div>
            </td>
            <td>
              <div :title="item.length">{{item.length}}</div>
            </td>
            <td>
              <div :title="item.author">
                {{item.author.substr(0,12)}}
                <div v-if="item.author.length>12">...</div>
              </div>
            </td>
            <td>
              <div :title="item.album">
                {{item.album.substr(0,9)}}
                <div v-if="item.album.length>9">...</div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { Loading } from "element-ui";
import { getPlaylistDetail } from "@/api/playlist.js";
import { formatSE } from "@/utils/time/formatTime.js";
export default {
  props: {
    songListInfo: { type: Object },
    playlist: { type: Array },
    paddingLeft: { type: String, default: '32px' }
  },
  name: "",
  data() {
    return {
      loadMusicList: true,
      headTitles: ["", "歌曲标题", "时长", "歌手", "专辑"]
    };
  },
  computed: {
    ...mapGetters(["nowMusicId"])
  },
  watch: {
    playlist(newV) {
      if (newV.length) {
        this.loadMusicList = false;
      } else {
        this.loadMusicList = true;
      }
    },
    nowMusicId(id) {
      this.playlist.forEach((item, index, arr) => {
        if (item.active) {
          arr[index].active = false;
        }
        if (item.id == id) {
          arr[index].active = true;
        }
      });
      this.$forceUpdate();
    }
  },
  created() {},
  beforeDestroy() {},
  methods: {
    ...mapMutations(["changeNowMusicId", "changeSongListInfo"]),
    //歌单列表播放
    handleToPlay(index) {
      this.playlist.forEach((item1, index1) => {
        this.playlist[index1].active = false;
      });
      this.playlist[index].active = true;
      this.$forceUpdate();
      localStorage.nowPlaying = JSON.stringify(this.playlist[index]);
      localStorage.playList = JSON.stringify(this.playlist);
      this.changeNowMusicId(this.playlist[index].id || 0);
    }
  }
};
</script>

<style lang="scss" scoped>
.tableList {
  width: 100%;
  padding-bottom: $controlHeight;
  .headFoot {
    height: 35px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    padding-left: 32px;
    padding-right: 10px;
    box-sizing: border-box;
    border-bottom: 2px solid $primary;
    > .left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      > .title {
        color: #333;
        font-size: 20px;
      }
      > .count {
        margin-left: 20px;
        font-size: 12px;
        color: #666666;
      }
    }
    > .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      font-size: 12px;
      color: #666666;
      > .count {
        color: $primary;
        font-weight: bold;
      }
    }
  }
  >>> .el-icon-loading {
    font-size: 25px;
    color: #8c8c8c;
  }
  >>> .el-loading-text {
    color: #8c8c8c;
  }
  .musicList {
    width: 100%;
    // padding-bottom: $controlHeight;
    position: relative;
    > table {
      width: 100%;
      border: 1px solid #d9d9d9;
      border-collapse: collapse;
      border-spacing: 0;
      font-size: 12px;
      table-layout: fixed;
      > thead {
        width: 100%;
        background: url("~assets/img/home/table.png");
        background-position: 0 0;
        background-repeat: repeat-x;
        > tr {
          width: 100%;
          height: 38.55px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          > th {
            height: 100%;
            box-sizing: border-box;
            text-align: left;
            font-weight: normal;
            color: #666;

            vertical-align: top;
            > div {
              height: 100%;
              width: 100%;
              background: url("~assets/img/home/table.png") no-repeat;
              background-position: 0 -59px;
              padding: 8px 10px;
              box-sizing: border-box;
            }
          }
          > th:first-child {
            > div {
              background: none;
            }
            width: 73px;
          }
          > th:nth-child(2) {
            flex: 1;
          }
          > th:nth-child(3) {
            width: 110px;
          }
          > th:nth-child(4) {
            width: 120px;
          }
          > th:last-child {
            width: 147px;
          }
        }
      }
      > tbody {
        width: 100%;
        > tr {
          width: 100%;
          height: 30px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          &:hover {
            height: 48px;
            > td {
              height: 100%;
              > div {
                height: 100%;
              }
            }
          }
          > td {
            height: 100%;
            box-sizing: border-box;
            text-align: left;
            display: flex;
            flex-shrink: 0;
            align-items: center;
            padding: 0;
            > div {
              width: 100%;
              padding: 6px 10px;
              box-sizing: border-box;
              display: flex;
              flex-shrink: 0;
              align-items: center;
              font-size: 12px;
              color: #333;
              white-space: nowrap;
              &:hover {
                text-decoration: underline;
              }
            }
          }
          > td:first-child {
            width: 73px;
            > div {
              justify-content: space-between;
              &:hover {
                text-decoration: none;
              }
              > span:first-child {
                margin-left: 6px;
              }
              > span:last-child {
                width: 17px;
                height: 17px;
                background: url("~assets/img/home/table.png") no-repeat;
                background-position: 0 -103px;
                &:hover {
                  background-position: 0 -128px;
                }
              }
              .active {
                background-position: -20px -128px !important;
                &:hover {
                  background-position: -20px -128px !important;
                }
              }
            }
          }
          > td:nth-child(2) {
            flex: 1;
          }
          > td:nth-child(3) {
            width: 110px;
          }
          > td:nth-child(4) {
            width: 120px;
          }
          > td:last-child {
            width: 147px;
          }
        }
      }
    }
  }
}
</style>