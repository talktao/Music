<template>
  <div class="myHeaderOuter">
    <div class="myHeader">
      <div class="logo" @click="handleClickCategory(0)"></div>
      <span
        @click="handleClickCategory(index)"
        :class="{active: item.click}"
        class="leftTxt"
        v-for="(item,index) in leftTxt"
        :key="index"
      >
        {{item.title}}
        <div v-if="item.click==true" class="triangle"></div>
        <div v-if="index==5" class="hot"></div>
      </span>
      <span class="search">
        <div class="searchIcon"></div>
        <input
          v-model="searchInner"
          ref="searchInput"
          @focus="handleSearchFocus"
          @blur="handleSearchBlur"
        />
        <span v-if="showPlaceH" @click="handlePlaceH" class="placeH">音乐/视频/电台/用户</span>
      </span>
      <div class="createCenterOuter">
        <span class="createCenter">创作者中心</span>
      </div>

      <div class="loginArea" @mouseenter="enterAvatar" @mouseleave="leaveAvatart">
        <div v-if="loginStatus" class="myPhotoOuter">
          <div class="myPhoto" :style="{background: 'url('+myAvatar+')'}">
            <div class="rightTop" :class="{hiddenCount: showDropList}">{{droplist|calculation}}</div>
          </div>
        </div>
        <div @click="$refs.login.openLogin()" v-if="!loginStatus" class="login">登录</div>
        <div class="drop" v-if="showDropList">
          <div
            class="dropItem"
            @click="handleClickDropItem(index)"
            v-for="(item,index) in droplist"
            :key="index"
          >
            <div class="leftIcon" :style="{backgroundPosition: item.bgp}"></div>
            <div class="rightTxt">{{item.title}}</div>
            <div class="msg" v-if="item.msgCount">{{item.msgCount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottomLine"></div>
    <login ref="login" @loginByPhoneNumberSuccess="getLoginStatus" />
  </div>
</template>

<script>
import login from "@/components/common/login.vue";
import { logout, getLoginStatus } from "@/api/login";
import { formatSE } from "@/utils/time/formatTime.js";
import { saveUserDetail } from "@/utils/store/saveUser";
export default {
  name: "",
  data() {
    return {
      loginStatus: false,
      leftTxt: [
        { title: "发现音乐", click: false, path: "/recommend" },
        { title: "我的音乐", click: false, path: "/myMusic" },
        { title: "朋友", click: false },
        { title: "商城", click: false },
        { title: "音乐人", click: false },
        { title: "下载客户端", click: false }
      ],
      showPlaceH: true,
      searchInner: "",
      droplist: [
        {
          bgp: "0 -80px",
          title: "我的主页"
        },
        {
          bgp: "-20px -120px",
          title: "我的消息",
          msgCount: 99
        },
        {
          bgp: "0 -100px",
          title: "我的等级"
        },
        {
          bgp: "0 -221px",
          title: "VIP会员"
        },
        {
          bgp: "0 -140",
          title: "个人设置"
        },
        {
          bgp: "-20px -142px",
          title: "实名认证"
        },
        {
          bgp: "0 -200px",
          title: "退出",
          meta: "exits"
        }
      ],
      showDropList: false,
      myAvatar: "~assets/img/home/myPhoto.jpg"
    };
  },
  created() {
    this.leftTxt.forEach((item, index) => {
      // if (item.path == window.location.href.split("/#")[1]) {
      //   this.leftTxt[index].click = true;
      // } else if (window.location.href.split("/#")[1] == "/") {
      //   this.leftTxt[0].click = true;
      // }
      const activeNav = sessionStorage.activeNav
      if(activeNav){
        if(index == activeNav){
          this.leftTxt[index].click = true
        }
      }else{
        this.leftTxt[0].click = true
      }
    });
    this.getLoginStatus();
  },
  filters: {
    calculation(data) {
      let count = 0;
      data.forEach((item, index) => {
        if (item.msgCount) {
          count += item.msgCount;
        }
      });
      return count;
    }
  },
  components: {
    login
  },
  methods: {
    handleClickDropItem(index) {
      if (this.droplist[index].meta == "exits") {
        logout()
          .then(res => {
            if (res.data.code == 200) {
              this.showDropList = false;
              this.loginStatus = false;
              this.$router.go(0);
              localStorage.removeItem("userDetail");
              localStorage.removeItem("loginSuccessInfo");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    async getLoginStatus() {
      getLoginStatus()
        .then(res => {
          if (res.data.code == 200) {
            this.myAvatar = res.data.profile.avatarUrl;
            this.handleClickCategory(0);
            this.loginStatus = true;
            localStorage.setItem("loginStatus", true);
          } else {
            this.loginStatus = false;
            localStorage.setItem("loginStatus", false);
          }
        })
        .catch(err => {
          this.loginStatus = false;
          localStorage.setItem("loginStatus", false);
        });
      saveUserDetail();
    },
    enterAvatar() {
      if (this.loginStatus == true) {
        this.showDropList = true;
      }
    },
    leaveAvatart() {
      if (this.loginStatus == true) {
        this.showDropList = false;
      }
    },
    handleClickCategory(index) {
      if (this.leftTxt[index].path) {
        this.$router.push({ path: this.leftTxt[index].path });
      }
      if (index != 3 && index != 4) {
        sessionStorage.setItem("activeNav", index);
        this.leftTxt.forEach((item1, index1) => {
          this.leftTxt[index1].click = false;
        });
        this.leftTxt[index].click = true;
      }
    },
    handlePlaceH() {
      this.$refs.searchInput.focus();
      this.showPlaceH = false;
    },
    handleSearchFocus() {
      this.showPlaceH = false;
    },
    handleSearchBlur() {
      if (!this.searchInner) {
        this.showPlaceH = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.myHeaderOuter {
  width: 100%;
  // position: fixed;
  z-index: 9;
  .myHeader {
    width: 100%;
    height: 70px;
    background-color: #242424;
    display: flex;
    justify-content: center;
    font-size: 14px;
    > span {
      height: 100%;
      cursor: pointer;
      flex-shrink: 0;
    }
    .logo {
      display: flex;
      flex-shrink: 0;
      width: 176px;
      background: url("~assets/img/home/topbar.png") no-repeat 0 0;
      cursor: pointer;
    }
    .active {
      background-color: #000;
    }
    .leftTxt {
      display: flex;
      align-items: center;
      padding: 0 19px;
      color: #cccccc;
      position: relative;
      &:hover {
        background-color: #000000;
        color: #ffffff;
      }
      .triangle {
        box-sizing: border-box;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-bottom: 6px solid #07a0aa;
        position: absolute;
        bottom: 0.5px;
        left: 50%;
        transform: translateX(-50%);
      }
      .hot {
        position: absolute;
        top: 21px;
        left: 100px;
        width: 28px;
        height: 19px;
        background: url("~assets/img/home/topbar.png") no-repeat -190px 0;
      }
    }
    .search {
      height: 100%;
      display: flex;
      align-items: center;
      margin-left: 80px;
      position: relative;
      border-radius: 16px;
      .searchIcon {
        position: absolute;
        left: 8px;
        width: 16px;
        height: 16px;
        background: url("~assets/img/home/topbar.png") no-repeat -7px -107px;
      }
      > input {
        border: none;
        height: 32px;
        border-radius: 16px;
        padding-left: 30px;
        outline: none;
      }
      .placeH {
        position: absolute;
        left: 30px;
        color: #9b9b9b;
        font-size: 12px;
      }
    }
    .createCenterOuter {
      margin-left: 12px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-shrink: 0;
      .createCenter {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #4f4f4f;
        color: #cccccc;
        border-radius: 16px;
        height: 32px;
        padding: 0 16px;
        font-size: 12px;
        &:hover {
          color: #ffffff;
          border: 1px #ccc solid;
        }
      }
    }
    .loginArea {
      position: relative;
      .login {
        color: #787878;
        font-size: 12px;
        &:hover {
          color: #666;
          text-decoration: underline;
        }
      }
      .myPhotoOuter,
      .login {
        width: 52px;
        height: 45px;
        height: 100%;
        margin-left: 20px;
        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        .myPhoto {
          width: 30px;
          height: 30px;
          // background: url("~assets/img/home/myPhoto.jpg");
          border-radius: 50%;
          position: relative;
          background-size: cover !important;
          .rightTop {
            position: absolute;
            right: 0;
            top: 0;
            transform: translate(60%, -30%);
            border-radius: 18px;
            height: 17px;
            padding: 0 4px;
            box-sizing: border-box;
            background: #c20c0c;
            color: #ffffff;
            font-size: 12px;
          }
          .hiddenCount {
            display: none;
          }
        }
      }
      .drop {
        width: 160px;
        min-height: 242px;
        background-color: #2b2b2b;
        position: absolute;
        left: 20px;
        z-index: 99;
        transform: translate(-30%, -12px);
        border-radius: 3px;
        .dropItem {
          width: 100%;
          height: 34px;
          box-sizing: border-box;
          padding-left: 24px;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          cursor: pointer;
          &:hover {
            background: #353535;
            .rightTxt {
              color: #fff;
            }
          }
          .leftIcon {
            width: 18px;
            height: 18px;
            margin-right: 10px;
            background: url("~assets/img/home/toplist.png");
            background-position: 0 -80px;
          }
          .rightTxt {
            color: #cccccc;
            font-size: 12px;
          }
          .msg {
            font-size: 12px;
            background: #c20c0c;
            color: #fff;
            width: 23px;
            height: 17px;
            border-radius: 18px;
            line-height: 16px;
            text-align: center;
            padding: 0 4px;
            box-sizing: border-box;
            margin-left: 10px;
          }
        }
      }
    }
  }
  .bottomLine {
    width: 100%;
    height: 5px;
    background-color: #07a0aa;
  }
  .dragBox {
    z-index: 99;
    width: 528px;
    height: 39px;
    position: fixed;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    .head {
      background-color: #2d2d2d;
    }
    .bottomArea {
      background-color: #fff;
      width: 100%;
      height: 332px;
      padding: 40px 0;
      box-sizing: border-box;
    }
  }
}
</style>