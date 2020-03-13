<template>
  <div class="myMusic">
    <div class="myMusicInner">
      <div class="leftListArea">
        <div class="scrollLayout">
          <div v-for="(item,index) in category" :key="index">
            <div @click="handleCategory(index)" :class="{hover: item.count<=1}" class="cateP">
              <div class="leftArea">
                <i
                  :class="{hidden: item.count<=1||index==0,rotate: item.open}"
                  class="el-icon-caret-right"
                />
                {{item.title}}{{'('+item.count+')'}}
              </div>
              <a v-if="index==1" @click.stop>新建</a>
            </div>

            <div class="detail" v-if="item.open">
              <div
                class="item"
                :class="{active: item1.click}"
                v-for="(item1,index1) in item.detail"
                :key="index1"
                @click="handleClickItem(index,index1)"
              >
                <img :src="item1.coverImgUrl" alt />
                <div class="rightArea">
                  <div class="title">{{item1.title}}</div>
                  <div class="count">{{item1.count}}首</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 歌单 -->
      <div class="rightArea">
        <div class="radioStationPage" v-if="showRadio">
          <div class="topTitle">我订阅的电台（{{radioInfo.length}}）</div>
          <div class="radioItem" v-for="(item,index) in radioInfo" :key="index">
            <img :src="item.avatar" alt />
            <div class="col2">
              <div class="name">{{item.name}}</div>
              <div class="nickname">
                by&nbsp;&nbsp;
                <div>{{item.nickname}}</div>
              </div>
            </div>
            <div class="col3">
              <div class="number">{{item.second}}期</div>
            </div>
          </div>
        </div>
        <div class="musicListPage" v-if="!showRadio">
          <div class="musicHead">
            <div class="msk">
              <img :src="topAreaInfo.coverImgUrl" alt />
            </div>
            <div class="rightArea">
              <div class="column1">
                <span>
                  <div>&reg;</div>
                </span>
                <div class="title">{{topAreaInfo.title}}</div>
              </div>
              <div class="column2">
                <img :src="topAreaInfo.avatar" alt />
                <a href="javascript:void(0)" class="userAvatar">{{topAreaInfo.nickname}}</a>
                <div class="createTime">{{topAreaInfo.createTime}}&nbsp;创建</div>
              </div>
              <div class="column3">
                <a>
                  <div>
                    <div></div>播放
                  </div>
                </a>
                <a></a>
                <a
                  v-for="(item,index) in btnList"
                  :key="index"
                  :style="{backgroundPosition: item.out, color: item.color||'#333'}"
                  @mouseenter="handleMouseEnter(index)"
                  @mouseleave="handleMouseLeave(index)"
                  class="commonA"
                >
                  <div class="inner" :style="{backgroundPosition: item.in}">{{item.title}}</div>
                </a>
              </div>
            </div>
          </div>

          <table-list :playlist="playlist" :songListInfo="songListInfo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSublist } from "@/api/dj";
import { getPlaylist } from "@/api/user";
import { getPlaylistDetail } from "@/api/playlist.js";
import { formatSE } from "@/utils/time/formatTime.js";
import { getMusicUrlById } from "@/api/song.js";
import { mapGetters, mapMutations } from "vuex";
import tableList from "@/components/navCommon/tableList";
import { formatPlayListDetail } from "@/utils/dataFilter/playlist";
export default {
  name: "",
  components: {
    tableList
  },
  data() {
    return {
      loadTable: false,
      loadMusicList: false,
      radioCount: 1,
      createCount: 4,
      collectionCount: 2,
      canHover: true,
      category: [
        {
          title: "我的电台",
          open: false,
          count: 0
        },
        {
          title: "创建的歌单®",
          open: true,
          count: 0,
          detail: []
        },
        {
          title: "收藏的歌单®",
          open: false,
          count: 0,
          detail: []
        }
      ],
      btnList: [
        {
          out: "right -1192px",
          in: "0 -1149px",
          color: "#bebebe",
          outHover: "",
          inHover: "",
          hover: false,
          title: "收藏"
        },
        {
          out: "right -1020px",
          in: "0 -1225px",
          outHover: "right -1106px",
          inHover: "0 -1268px",
          hover: false,
          title: "分享"
        },
        {
          out: "right -1020px",
          in: "0 -2761px",
          outHover: "right -1106px",
          inHover: "0 -2805px",
          hover: false,
          title: "下载"
        },
        {
          out: "right -1020px",
          in: "0 -1465px",
          outHover: "right -1106px",
          inHover: "0 -1508px",
          hover: false,
          title: "评论"
        }
      ],
      topAreaInfo: {
        title: "",
        avatar: "",
        nickname: "",
        createTime: "",
        coverImgUrl: "",
        count: "",
        playCount: ""
      },
      showRadio: false,
      radioInfo: [],
      playlist: [],
      songListInfo: {}
    };
  },
  created() {
    //获取我的电台
    getSublist().then(res => {
      res.data.djRadios.forEach((item, index) => {
        this.radioInfo[index] = {
          avatar: item.picUrl,
          name: item.name,
          nickname: item.dj.nickname,
          second: item.programCount
        };
      });
      this.category[0].count = res.data.count || 0;
    });
    //获取歌单
    this.getPlaylist();
  },
  methods: {
    ...mapMutations(["changeNowMusicId"]),
    //获取歌单
    getPlaylist() {
      try {
        const uid = JSON.parse(localStorage.getItem("userDetail")).profile
          .userId;
        getPlaylist({ uid }).then(res => {
          res.data.playlist.forEach((item, index) => {
            if (item.creator.userId == uid) {
              this.category[1].count++;
              this.category[1].detail[index] = {
                id: item.id,
                coverImgUrl: item.coverImgUrl,
                title: item.name,
                click: false,
                avatar: item.creator.avatarUrl,
                nickname: item.creator.nickname,
                createTime: `${new Date(item.createTime).getFullYear()}-${(
                  new Date(item.createTime).getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${new Date(item.createTime)
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`,
                count: item.trackCount,
                playCount: item.playCount
              };
              if (index == 0) {
                //初始化歌单详情
                this.category[1].detail[index].click = true;
                this.topAreaInfo = this.category[1].detail[index];
                //初始化歌单信息传给tableList
                this.songListInfo = {
                  id: item.id,
                  count: item.trackCount,
                  playCount: item.playCount
                };
                //获取歌曲列表
                this.getPlaylistDetail(item.id);
              }
            } else {
              this.category[2].count++;
              this.category[2].detail[this.category[2].count - 1] = {
                id: item.id,
                coverImgUrl: item.coverImgUrl,
                title: item.name,
                click: false,
                avatar: item.creator.avatarUrl,
                nickname: item.creator.nickname,
                createTime: `${new Date(item.createTime).getFullYear()}-${(
                  new Date(item.createTime).getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${new Date(item.createTime)
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`,
                count: item.trackCount,
                playCount: item.playCount
              };
            }
          });
        });
      } catch (err) {}
    },
    //获取歌单详情
    getPlaylistDetail(id) {
      this.playlist = [];
      getPlaylistDetail({ id })
        .then(res => {
          this.playlist = formatPlayListDetail(res.data.playlist.tracks)
        })
        .catch(err => {
          return;
        });
    },
    handleMouseEnter(index) {
      if (this.btnList[index].outHover && this.btnList[index].inHover) {
        this.btnList[index].tempOut = this.btnList[index].out;
        this.btnList[index].tempin = this.btnList[index].in;
        this.btnList[index].out = this.btnList[index].outHover;
        this.btnList[index].in = this.btnList[index].inHover;
      }
    },
    handleMouseLeave(index) {
      if (this.btnList[index].outHover && this.btnList[index].inHover) {
        this.btnList[index].out = this.btnList[index].tempOut;
        this.btnList[index].in = this.btnList[index].tempin;
      }
    },
    handleCategory(index) {
      if (index == 0) {
        this.showRadio = true;
        this.category.forEach((item3, index3) => {
          if (item3.detail) {
            item3.detail.forEach((item4, index4) => {
              this.category[index3].detail[index4].click = false;
            });
          }
        });
      } else {
        this.category[index].open = !this.category[index].open;
      }
    },
    handleClickItem(index1, index2) {
      this.showRadio = false;
      this.topAreaInfo = this.category[index1].detail[index2];
      this.category.forEach((item3, index3) => {
        if (item3.detail) {
          item3.detail.forEach((item4, index4) => {
            this.category[index3].detail[index4].click = false;
          });
        }
      });
      this.category[index1].detail[index2].click = true;

      this.songListInfo = {
        id: this.category[index1].detail[index2].id,
        count: this.category[index1].detail[index2].count,
        playCount: this.category[index1].detail[index2].playCount
      };
      this.getPlaylistDetail(this.songListInfo.id);
      this.$forceUpdate();
    }
  }
};
</script>

<style lang="scss" scoped>
.myMusic {
  display: flex;
  justify-content: center;
  background-color: #f5f5f5;
  overflow: scroll;
  height: calc(100vh - 70px - 5px);
  .myMusicInner {
    width: $centerListWidth;
    border-left: #e8e8e8 1px solid;
    border-right: #e8e8e8 1px solid;
    display: flex;
    > .leftListArea {
      position: fixed;
      width: 240px;
      padding-top: 38px;
      padding-bottom: $controlHeight;
      box-sizing: border-box;
      border-right: #e8e8e8 1px solid;
      box-shadow: 0 0 3px #ccc;
      z-index: 2;
      background-color: #f8f8f8;
      overflow: scroll;
      top: $headHeight + $headLineHeight;
      bottom: 0;
      &::-webkit-scrollbar {
        display: none;
      }
      .cateP {
        width: 100%;
        height: 38px;
        display: flex;
        padding-left: 15px;
        box-sizing: border-box;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        font-size: 14px;
        font-family: "宋体";
        font-weight: bold;
        position: relative;
        > .leftArea {
          display: flex;
          justify-content: flex-start;
          > i {
            transform: scale(1.5);
            margin-right: 5px;
            color: #ccc;
          }
          .hidden {
            visibility: hidden;
          }
          .rotate {
            transform: rotate(90deg) scale(1.5);
          }
        }
        > a {
          width: 52px;
          height: 22px;
          background-position: 0 -96px !important;
          background: url("~assets/img/home/button.png");
          padding-left: 20px;
          font-size: 12px;
          line-height: 22px;
          box-sizing: border-box;
          margin-right: 10px;
          &:hover {
            background-position: -94px -39px !important;
          }
        }
      }
      .hover {
        &:hover {
          background-color: #eee;
        }
      }
      .detail {
        width: 100% !important;
        width: 54px;
        .active {
          background-color: #e6e6e6;
        }
        .item {
          padding: 6px 0 6px 35px;
          box-sizing: border-box;
          height: 100%;
          width: 100%;
          display: flex;
          cursor: pointer;
          &:hover {
            background-color: #f4f2f2;
          }
          > img {
            width: 40px;
            height: 40px;
          }
          > .rightArea {
            margin-left: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: flex-start;
            font-size: 12px;
            .title {
              color: #000000;
            }
            .count {
              color: #999999;
            }
          }
        }
      }
    }
    > .rightArea {
      background-color: #fff;
      flex: 1;
      // height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      // padding-bottom: $controlHeight;
      box-sizing: border-box;
      margin-left: 240px;
      &::-webkit-scrollbar {
        display: none;
      }
      .radioStationPage {
        width: 100%;
        padding: 40px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        .topTitle {
          width: 100%;
          height: 42px;
          border-bottom: 2px solid $primary;
          font-size: 24px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .radioItem {
          height: 70px;
          padding: 10px 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          position: relative;
          > img {
            width: 50px;
            height: 50px;
            float: left;
            cursor: pointer;
          }
          .col2 {
            margin-left: 10px;
            float: left;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            flex-shrink: 0;
            height: 100%;
            box-sizing: border-box;
            padding: 4px 0;
            .name {
              cursor: pointer;
              color: #333;
              font-size: 14px;
              &:hover {
                text-decoration: underline;
              }
            }
            .nickname {
              font-size: 12px;
              color: #999;
              cursor: pointer;
              display: flex;
              flex-shrink: 0;
              > div {
                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }
          .col3 {
            height: 100%;
            position: absolute;
            right: 0;
            .number {
              display: flex;
              align-items: center;
              flex-shrink: 0;
              height: 100%;
              margin-right: 20px;
              color: #999;
              font-size: 12px;
            }
          }
        }
      }
      .musicListPage {
        width: 100%;
        box-sizing: border-box;
        .musicHead {
          height: 280px;
          width: 100%;
          padding: 36px;
          box-sizing: border-box;
          display: flex;
          .msk {
            background: url("~assets/img/home/coverall.png");
            background-position: 0 -1285px;
            width: 208px;
            height: 208px;
            padding: 4px;
            box-sizing: border-box;
            img {
              width: 200px;
              height: 200px;
            }
          }
          > .rightArea {
            margin-left: 28px;
            flex: 1;
            display: flex;
            flex-shrink: 0;
            flex-direction: column;
            padding-top: 6px;
            > div {
              margin-bottom: 10px;
            }
            .column1 {
              display: flex;
              flex-shrink: 0;
              > span {
                width: 54px;
                height: 24px;
                background: url("~assets/img/home/icon.png");
                background-position: 0 -243px;
                margin-right: 6px;
                color: #fff;
                > div {
                  width: 8px;
                  height: 8px;
                  font-size: 8px;
                  line-height: 8px;
                  text-align: center;
                  margin-left: 34px;
                  color: rgb(230, 228, 228);
                  top: 0;
                }
              }
              .title {
                font-size: 20px;
                margin-top: -5px;
                font-family: "Gill Sans", "Gill Sans MT", Calibri,
                  "Trebuchet MS", sans-serif;
              }
            }
            .column2 {
              display: flex;
              align-items: center;
              flex-shrink: 0;
              font-size: 12px;
              > img {
                width: 35px;
                height: 35px;
              }
              > a {
                margin-left: 15px;
                text-decoration: none;
                color: $primary;
                &:hover {
                  text-decoration: underline;
                }
                &:active {
                  color: $primary !important;
                }
              }
              .createTime {
                margin-left: 15px;
                color: #999999;
              }
            }
            .column3 {
              margin-top: 12px;
              display: flex;
              font-size: 12px;
              > a {
                display: flex;
                align-items: center;
                flex-shrink: 0;
              }
              > a:first-child {
                width: 66px;
                height: 31px;
                > div {
                  padding: 0 7px 0 8px;
                  width: 66px;
                  height: 31px;
                  box-sizing: border-box;
                  background: url("~assets/img/home/button2.png");
                  background-position: 0 -387px;
                  display: flex;
                  align-items: center;
                  flex-shrink: 0;
                  color: #fff;
                  &:hover {
                    background-position: 0px -469px;
                    > div {
                      background-position: -28px -1621px;
                    }
                  }
                  > div {
                    width: 20px;
                    height: 20px;
                    background: url("~assets/img/home/button2.png");
                    background-position: 0 -1621px;
                    margin-right: 2px;
                  }
                }
              }
              > a:nth-child(2) {
                background: url("~assets/img/home/button2.png");
                background-position: 0 -1588px !important;
                width: 31px;
                height: 31px;
                margin-right: 5px;
                &:hover {
                  background-position: -40px -1588px !important;
                }
              }
              .commonA {
                background: url("~assets/img/home/button2.png");
                width: 59px;
                height: 31px;
                margin-right: 6px;
                .inner {
                  width: 54px;
                  height: 31px;
                  background: url("~assets/img/home/button2.png");
                  display: flex;
                  align-items: center;
                  flex-shrink: 0;
                  padding: 0 2px 0 28px;
                  box-sizing: border-box;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>