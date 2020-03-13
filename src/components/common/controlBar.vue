<template>
  <div
    class="controlsOuter"
    :class="{out: controlsShow,in: !controlsShow,imp: bgp=='-100px -380px'}"
    @mouseenter="handleEnterCon"
    @mouseleave="handleLeaveCon"
  >
    <audio
      ref="audio"
      @timeupdate="handleTimeUpdate"
      @play="handleStartPlay"
      @pause="handlePausePlay"
      @ended="handleEndedPlay"
      class="player"
      :src="nowPlaying.mSrc"
      :loop="playLoop"
    ></audio>
    <div class="controlsInner">
      <div class="leftControl">
        <div class="prv" @click="handleToPrevious"></div>
        <div v-if="!playStatus" @click="handlePlay" class="playFlag"></div>
        <div v-if="playStatus" @click="handlePause" class="pauseFlag"></div>
        <div class="nxt" @click="handleToNext"></div>
      </div>
      <div
        class="leftImg"
        :style="{background: nowPlaying.coverImgUrl?'url('+nowPlaying.coverImgUrl+'?param=34y34'+')':'url('+'~assets/img/home/logo.png'+')'}"
      ></div>
      <div class="controlLine">
        <div class="centerArea" :style="{width: lineWidth+'px'}">
          <div class="topInfo">
            <div class="name">{{nowPlaying.title}}</div>
            <div class="author">{{nowPlaying.author}}</div>
          </div>
          <div class="bottomLine" ref="bottomLine">
            <el-progress
              class="progress"
              :percentage="playProgress"
              status="exception"
              color="#07a0aa"
              :show-text="false"
              ref="progress"
              @click.native="handleProgressClick"
            ></el-progress>
            <div
              @mousedown="handleRadiusDown"
              :style="{left: (playProgress/100)*lineWidth+'px'}"
              class="radiusOuter"
            >
              <div class="radius">
                <div class="innerRadius"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="rightTime">
          <span>{{currentTime}}</span>
          <span>&nbsp;/&nbsp;{{duration}}</span>
        </div>
      </div>
      <div class="oper">
        <div class="add"></div>
        <div class="share"></div>
      </div>
      <div class="ctrl">
        <div class="columnLine"></div>
        <div @click.stop="handleClickVol" class="vol">
          <div @click.stop v-if="showVolume" class="volume">
            <div class="sliderContainer">
              <el-slider
                @input="handleSliderInput"
                v-model="volume"
                vertical
                height="92px"
                :show-tooltip="false"
              ></el-slider>
            </div>
          </div>
        </div>
        <div
          @click="handleClickPlayWays"
          @mouseenter="handleEnterPlayWays"
          @mouseleave="handleLeavePlayWays"
          :style="{backgroundPosition: playWaysBgp}"
          class="loop"
        ></div>
        <div class="list">99</div>
      </div>
      <div class="lock">
        <div
          class="lockInner"
          :style="{backgroundPosition: bgp}"
          @mouseover="handleOverLock"
          @mouseout="handleOutLock"
          @click="handleClickLock"
        ></div>
      </div>
      <div class="lockRight"></div>
    </div>
  </div>
</template>

<script>
import { formatSE, getSconds } from "@/utils/time/formatTime.js";
import { getMusicUrlById } from "@/api/song.js";
import { getUserDetail } from "@/api/user";
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "App",
  data() {
    return {
      //黑锁
      bgp: "-100px -380px",
      //黑开
      // bgp: "-81px -380px",
      controlsShow: true,
      enterLeaveTimer: {},
      playStatus: false,
      lineWidth: 493,
      playProgress: 0,
      duration: "00:00",
      currentTime: "00:00",
      dragStart: 0,
      dragEnd: 0,
      initStart: 0,
      routerIndex: 0,
      screenWidth: 0,
      screenHeight: 0,
      volume: 100,
      showVolume: false,
      nowPlaying: {
        mSrc: "",
        coverImgUrl: "",
        title: "未知",
        author: "未知"
      },
      playWaysBgp: "-66px -344px",
      playLoop: "loop"
    };
  },
  watch: {
    nowMusicId(id) {
      this.handlePlay();
    }
  },
  created() {
    if (localStorage.getItem("playWays")) {
      switch (localStorage.getItem("playWays")) {
        case "single":
          this.playWaysBgp = "-66px -344px";
          this.playLoop = "loop";
          break;
        case "list":
          this.playWaysBgp = "-3px -344px";
          this.playLoop = false;
          break;
        case "random":
          this.playWaysBgp = "-66px -248px";
          this.playLoop = false;
          break;
      }
    } else {
      this.playLoop = false;
    }
    window.addEventListener("keydown", e => {
      switch (e.keyCode) {
        //上一首
        case 177:
          // console.log(177);
          this.handleToPrevious();
          break;
        //下一首
        case 176:
          // console.log(176);
          this.handleToNext();
          break;
      }
    });
    if (localStorage.getItem("nowPlaying")) {
      this.nowPlaying = JSON.parse(localStorage.getItem("nowPlaying"));
    }
  },
  computed: {
    ...mapGetters(["nowMusicId"])
  },
  mounted() {
    window.addEventListener("mouseup", () => {
      if (this.dragStart != 0) {
        this.$refs.audio.play();
        this.dragStart = 0;
        this.dragEnd = 0;
      }
    });
    window.addEventListener("mousemove", e => {
      this.dragEnd = e.clientX;
      if (this.dragStart != 0) {
        this.playProgress =
          this.initStart +
          ((this.dragEnd - this.dragStart) / this.lineWidth) * 100;
        if (this.playProgress < 0) {
          this.playProgress = 0;
        } else if (this.playProgress > 100) {
          this.playProgress = 100;
        }
        this.$refs.audio.currentTime =
          (this.playProgress / 100) * this.$refs.audio.duration;
        this.currentTime = formatSE(
          (this.playProgress / 100) * this.$refs.audio.duration
        );
      }
    });
    window.addEventListener("click", () => {
      this.showVolume = false;
    });
  },
  methods: {
    ...mapMutations(["changeNowMusicId"]),
    handleClickVol() {
      this.showVolume = !this.showVolume;
      this.$forceUpdate();
    },
    handleSliderInput(e) {
      this.$refs.audio.volume = e / 100;
    },
    handleClickPlayWays() {
      if (this.playWaysBgp == "-93px -344px") {
        this.playWaysBgp = "-33px -344px";
        localStorage.setItem("playWays", "list");
        this.playLoop = false;
      } else if (this.playWaysBgp == "-33px -344px") {
        this.playWaysBgp = "-93px -248px";
        localStorage.setItem("playWays", "random");
        this.playLoop = false;
      } else if (this.playWaysBgp == "-93px -248px") {
        this.playWaysBgp = "-93px -344px";
        localStorage.setItem("playWays", "single");
        this.playLoop = "loop";
      }
    },
    handleEnterPlayWays() {
      if (this.playWaysBgp == "-66px -344px") {
        this.playWaysBgp = "-93px -344px";
      } else if (this.playWaysBgp == "-3px -344px") {
        this.playWaysBgp = "-33px -344px";
      } else if (this.playWaysBgp == "-66px -248px") {
        this.playWaysBgp = "-93px -248px";
      }
    },
    handleLeavePlayWays() {
      if (this.playWaysBgp == "-93px -344px") {
        this.playWaysBgp = "-66px -344px";
      } else if (this.playWaysBgp == "-33px -344px") {
        this.playWaysBgp = "-3px -344px";
      } else if (this.playWaysBgp == "-93px -248px") {
        this.playWaysBgp = "-66px -248px";
      }
    },
    handleToPrevious() {
      this.commonCutSong(false).then(res => {
        this.$refs.audio.play();
      });
    },
    handleToNext() {
      this.commonCutSong(true).then(res => {
        this.$refs.audio.play();
      });
    },
    commonCutSong(boo) {
      return new Promise((resolve, reject) => {
        const playList = JSON.parse(localStorage.getItem("playList"));
        const playWays = localStorage.getItem("playWays");
        if (playWays == "random") {
          const myRandomIndex =
            Math.floor(Math.random() * (playList.length - 1 - 0 - 1)) + 0;
          const tempObj = playList[myRandomIndex];
          this.getMusicUrlById(tempObj)
            .then(res => {
              this.$refs.audio.play();
              resolve(res);
            })
            .catch(err => {
              this.nowPlaying = tempObj;
              this.commonCutSong(true);
            });
        } else {
          playList.forEach((item, index) => {
            if (this.nowPlaying.id == item.id) {
              let tempObj = {};
              if (boo) {
                if (index == playList.length - 1) {
                  tempObj = playList[0];
                } else {
                  tempObj = playList[index + 1];
                }
              } else {
                if (index == 0) {
                  tempObj = playList[playList.length - 1];
                } else {
                  tempObj = playList[index - 1];
                }
              }
              this.getMusicUrlById(tempObj)
                .then(res => {
                  this.$refs.audio.play();
                  resolve(res);
                })
                .catch(err => {
                  this.nowPlaying = tempObj;
                  this.commonCutSong(boo);
                });
            }
          });
        }
      });
    },
    handleEndedPlay() {
      this.commonCutSong(true);
    },
    handleProgressClick(e) {
      if (e.clientX < this.$refs.bottomLine.offsetLeft) {
        this.playProgress = 0;
        this.$refs.audio.currentTime = 0;
        this.currentTime = "00:00";
      } else {
        this.playProgress =
          ((e.clientX - this.$refs.bottomLine.offsetLeft) / this.lineWidth) *
          100;
        this.$refs.audio.currentTime =
          ((e.clientX - this.$refs.bottomLine.offsetLeft) / this.lineWidth) *
          this.$refs.audio.duration;
        this.currentTime = formatSE(
          ((e.clientX - this.$refs.bottomLine.offsetLeft) / this.lineWidth) *
            this.$refs.audio.duration
        );
      }
      this.$refs.audio.play();
    },
    handleRadiusDown(e) {
      this.dragStart = e.clientX;
      this.initStart = this.playProgress;
      this.$refs.audio.pause();
    },
    handleTimeUpdate(e) {
      if (e.target.duration) {
        this.duration = formatSE(this.$refs.audio.duration);
        this.currentTime = formatSE(e.target.currentTime);
        this.playProgress = 100 * (e.target.currentTime / e.target.duration);
      }
    },
    handleStartPlay() {
      this.playStatus = true;
    },
    handlePausePlay() {
      this.playStatus = false;
    },
    handlePlay() {
      this.getMusicUrlById(JSON.parse(localStorage.getItem("nowPlaying")))
        .then(res => {
          this.$refs.audio.play();
        })
        .catch(err => {
          const falseId = JSON.parse(localStorage.nowPlaying).id;
          const playList = JSON.parse(localStorage.playList);
          playList.some((item, index) => {
            if (item.id == falseId) {
              if (index != playList.length - 1) {
                localStorage.nowPlaying = JSON.stringify(playList[index + 1]);
              } else {
                localStorage.nowPlaying = JSON.stringify(playList[0]);
              }
              this.handlePlay();
              return true;
            }
          });
        });
    },
    getMusicUrlById(nowPlaying) {
      return new Promise((resolve, reject) => {
        if (nowPlaying) {
          getMusicUrlById({ id: nowPlaying.id }).then(res => {
            this.playStatus = true;
            if (res.data.data[0].url) {
              this.changeNowMusicId(nowPlaying.id);
              this.nowPlaying = nowPlaying;
              this.nowPlaying.mSrc = res.data.data[0].url;
              localStorage.setItem(
                "nowPlaying",
                JSON.stringify(this.nowPlaying)
              );
              resolve(res);
            } else {
              this.playStatus = false;
              reject("《" + nowPlaying.title + "》" + "需要VIP或无版权");
              this.$alert("《" + nowPlaying.title + "》" + "需要VIP或无版权，具体详情可到<a href='https://music.163.com' target='_blank'>网易云音乐官方</a>进行了解",'歌曲无权限', {
                confirmButtonText: "确定",
                dangerouslyUseHTMLString: true,
                type: 'warning',
                center: true,
                closeOnClickModal: true,
                closeOnPressEscape: true
              });
            }
          });
        } else {
          this.playStatus = false;
          reject("未找到歌曲信息");
          this.$message({
            message: "未找到歌曲信息",
            type: "warning"
          });
        }
      });
    },
    handleDownload(){
      window.open('https://music.163.com/#/download','_blank')
    },
    handlePause() {
      this.playStatus = false;
      this.$refs.audio.pause();
    },
    //点击
    handleClickLock() {
      //如果为白锁，则让它为白开
      if (this.bgp == "-100px -400px") {
        this.bgp = "-81px -400px";
        //如果为白开，则让它为白锁
      } else if (this.bgp == "-81px -400px") {
        this.bgp = "-100px -400px";
      }
    },
    //鼠标移入
    handleOverLock() {
      //如果为黑锁，则让他为白锁
      if (this.bgp == "-100px -380px") {
        this.bgp = "-100px -400px";
        //如果为黑开，则让他为白开
      } else if (this.bgp == "-81px -380px") {
        this.bgp = "-81px -400px";
      }
    },
    //鼠标移出
    handleOutLock() {
      //如果为白锁，则让它为黑锁
      if (this.bgp == "-100px -400px") {
        this.bgp = "-100px -380px";
        //如果为白开，则让它为黑开
      } else if (this.bgp == "-81px -400px") {
        this.bgp = "-81px -380px";
      }
    },
    handleEnterCon() {
      clearTimeout(this.enterLeaveTimer);
      this.controlsShow = true;
    },
    handleLeaveCon() {
      this.enterLeaveTimer = setTimeout(() => {
        this.controlsShow = false;
      }, 1500);
    }
  }
};
</script>

<style lang="scss" scoped>
.controlsOuter {
  position: fixed;
  z-index: 9;
  bottom: -38px;
  width: 100%;
  .controlsInner {
    width: calc(100% - 67px);
    background: url("~assets/img/home/playbar.png");
    height: 53px;
    font-size: 12px;
    color: #333;
    padding-top: 6px;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    .leftControl {
      width: 137px;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding-right: 20px;
      box-sizing: border-box;
      .prv {
        width: 28px;
        height: 28px;
        background: url("~assets/img/home/playbar.png");
        background-position: 0 -130px;
        &:hover {
          background-position: -30px -130px !important;
        }
      }
      .playFlag {
        width: 36px;
        height: 36px;
        background: url("~assets/img/home/playbar.png");
        background-position: 0 -204px;
        &:hover {
          background-position: -40px -204px;
        }
      }
      .pauseFlag {
        width: 36px;
        height: 36px;
        background: url("~assets/img/home/playbar.png");
        background-position: 0px -165px;
        &:hover {
          background-position: -40px -165px;
        }
      }
      .nxt {
        width: 28px;
        height: 28px;
        background: url("~assets/img/home/playbar.png");
        background-position: -80px -130px;
        &:hover {
          background-position: -110px -130px;
        }
      }
    }
    .leftImg {
      background: url("~assets/img/home/logo.png");
      background-size: cover !important;
      border-radius: 6px;
      width: 33px;
      height: 33px;
      display: flex;
      flex-shrink: 0;
    }
    .controlLine {
      width: 608px;
      height: 100%;
      font-size: 12px;
      margin-left: 20px;
      display: flex;
      > .centerArea {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-top: 4px;
        // padding-bottom: 16px;
        // padding-bottom: 6px;
        .topInfo {
          display: flex;
          .name {
            color: #e8e8e8;
            margin-right: 20px;
          }
          .author {
            color: #9b9b9b;
          }
        }
        > .bottomLine {
          position: relative;
          .progress {
            padding: 3px 0;
            margin-bottom: 10px;
            cursor: pointer;
          }
          .radiusOuter {
            top: 0;
            left: 0;
            transform: translate(-50%, -27%);
            position: absolute;
            width: 24px;
            height: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            // padding: 4.2px;
            // box-sizing: border-box;
            .radius {
              width: 16px;
              height: 16px;
              background-color: #fff;
              border-radius: 50%;
              display: flex;
              justify-content: center;
              align-items: center;
              .innerRadius {
                width: 40%;
                height: 40%;
                border-radius: 50%;
                background-color: #07a0aa;
              }
            }
          }
        }
      }
      .rightTime {
        display: flex;
        align-items: flex-end;
        margin-left: 10px;
        padding-bottom: 8px;
        > span:first-child {
          color: #a1a1a1;
        }
        > span:last-child {
          color: #797979;
        }
      }
    }
    .oper {
      width: 60px;
      height: 100%;
      display: flex;
      align-items: center;
      > div {
        width: 25px;
        height: 25px;
        background: url("~assets/img/home/playbar.png");
      }
      .add {
        background-position: -88px -163px;
        margin-right: 2px;
        &:hover {
          background-position: -88px -189px;
        }
      }
      .share {
        background-position: -114px -163px;
        &:hover {
          background-position: -114px -189px;
        }
      }
    }
    .ctrl {
      width: 126px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      > div {
        width: 25px;
        height: 25px;
        background: url("~assets/img/home/playbar.png");
        margin-right: 2px;
      }
      .columnLine {
        background-position: -144px -248px;
        width: 13px;
      }
      .vol {
        background-position: -2px -248px;
        position: relative;
        &:hover {
          background-position: -31px -248px;
        }
        .volume {
          width: 32px;
          height: 113px;
          position: absolute;
          top: -123px;
          left: -6px;
          background: url("~assets/img/home/playbar.png");
          background-position: 0 -503px;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          .sliderContainer {
            >>> .el-slider__runway {
              background-color: rgb(3, 3, 3);
              width: 4px;
            }
            >>> .el-slider__button-wrapper {
              left: -4px;
              width: 14px;
              height: 14px;
            }
            >>> .el-slider__button {
              box-sizing: border-box;
              width: 14px;
              height: 14px;
              box-sizing: border-box;
              border: 3px solid #ffffff;
              background-color: $primary;
            }
            >>> .el-slider__bar {
              background-color: $primary;
            }
          }
        }
      }
      .list {
        width: 59px;
        padding-left: 21px;
        box-sizing: border-box;
        background-position: -42px -68px;
        margin-right: 0;
        color: #666666;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 21px;
        &:hover {
          background-position: -42px -98px;
        }
      }
    }
    .lock {
      position: absolute;
      top: -14px;
      right: 15px;
      width: 52px;
      height: 67px;
      background: url("~assets/img/home/playbar.png");
      background-position: 0 -380px;
      .lockInner {
        background: url("~assets/img/home/playbar.png");
        // background-position: -100px -380px;
        // background-position: -81px -380px;
        width: 18px;
        height: 18px;
        margin: 6px 0 0 17px;
        // &:hover{
        // background-position: -100px -400px;
        // background-position: -81px -400px;
        // }
      }
    }
    .lockRight {
      background: url("~assets/img/home/playbar.png");
      width: 15px;
      height: 100%;
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
}
.out {
  transition: 0.2s ease all;
  bottom: 0px;
}
.in {
  transition: 0.6s ease all;
  bottom: -43px;
}
.imp {
  bottom: 0px;
  // bottom: -43px;
}
> .bottomLine {
  width: 100%;
  height: 5px;
  background-color: #07a0aa;
}
</style>