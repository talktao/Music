<template>
  <div class="centerList d-flex">
    <div class="leftList">
      <div class="rHead d-flex ai-center">
        <div class="headTop d-flex ai-center">
          <div class="circle mx-1"></div>
          <div class="title">个性化推荐</div>
        </div>
      </div>
      <div class="imgList d-flex jc-between f-wrap pt-4">
        <div class="imgItem everyDay mb-7">
          <calendar @click="handleRecommendResource(-1)" />
          <div class="itemDsc1 fs-lg mt-2 mb-1"
               @click="handleRecommendResource(-1)">每日歌曲推荐</div>
          <div class="itemDsc2 mt-1 text-grey">根据你的口味生成，每天6:00更新</div>
        </div>
        <div class="imgItem mb-7"
             v-for="(item,index) in list_individuation"
             :key="index">
          <div class="innerImg"
               @click="handleRecommendResource(index,item.id)"
               :style="{backgroundImage: 'url('+item.picUrl+')'}"></div>
          <div class="itemDsc1 fs-lg mt-2 mb-1"
               @click="handleRecommendResource(index,item.id)">{{item.name}}</div>
          <div class="itemDsc2 mt-1 text-grey">{{item.copywriter}}</div>
        </div>
      </div>
    </div>
    <div class="rightList">
      <div class="info_mine w-10 bs-b d-flex flex-col">
        <div class="topInfo w-10 d-flex ai-center">
          <div class="avatar">
            <img :src="userInfo.avatar"
                 alt />
          </div>
          <div class="userInfo flex-1 ml-4 h-10 d-flex flex-col jc-between">
            <div class="nickname text-ellipsis fw-b fs-lg">{{userInfo.nickname}}</div>
            <div class="level d-flex text-grey ai-center">
              8
              <i class="leval_i"></i>
            </div>

            <div v-if="!userInfo.signInStatus"
                 class="signIn d-flex"
                 @click="handleSignIn">
              <div class="signInI d-flex jc-center ai-center text-white fs-lg">签到</div>
            </div>
            <div v-if="userInfo.signInStatus"
                 class="signIn haveSignIn d-flex">
              <div class="signInI haveSignInI d-flex jc-center ai-center text-white fs-sm">已签到</div>
            </div>
          </div>
        </div>
        <div class="bottomInfo w-10 flex-1 d-flex ai-center w-10 mt-4">
          <div v-for="(item,index) in bottomInfoList"
               :key="index"
               class="numDetail h-10 d-flex flex-col jc-center text-grey-1">
            <div class="count fs-xxl">{{item.count}}</div>
            <div class="coutCitle">{{item.title}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecommendResource } from "@/api/recommend";
import { getUserDetail } from "@/api/user";
import { dailySignin } from "@/api/common";
import { saveUserDetail } from "@/utils/store/saveUser";
import calendar from "@/components/navCommon/calendar";
export default {
  name: "",
  components: {
    calendar
  },
  created () {
    this.getRecommendResource();
    this.getUserDetail();
  },
  data () {
    return {
      list_individuation: [],
      userInfo: {},
      bottomInfoList: []
    };
  },
  methods: {
    handleRecommendResource (index, itemId) {
      if (index == -1) {
        this.$router.push("/taste");
      } else {
        // console.log(itemId)
        this.$router.push('/csonglist/' + itemId)
      }
    },
    async getUserDetail () {
      try {
        const userDetail = await saveUserDetail();
        this.signInStatus = userDetail.pcSign;
        this.userInfo = {
          avatar: userDetail.profile.avatarUrl,
          nickname: userDetail.profile.nickname,
          level: userDetail.level,
          signInStatus: userDetail.pcSign
        };
        this.bottomInfoList = [
          { title: "动态", count: userDetail.profile.eventCount },
          { title: "关注", count: userDetail.profile.follows },
          { title: "粉丝", count: userDetail.profile.followeds }
        ];
        this.$forceUpdate();
      } catch (err) { }
    },
    async handleSignIn () {
      dailySignin({ type: 1 }).then(async res => {
        await this.$alert("签到成功，获取2点经验", {
          type: "success",
          closeOnClickModal: true,
          closeOnPressEscape: true
        }).catch(() => {
          return;
        });
        this.userInfo.signInStatus = true;
        this.$forceUpdate();
      });
    },
    async getRecommendResource () {
      try {
        const res = (await getRecommendResource()).data.recommend.slice(0, 3);
        this.list_individuation = res;
      } catch (err) { }
    }
  }
};
</script>

<style lang="scss" scoped>
.centerList {
  width: $centerListWidth;
  min-height: 700px;
  background-color: #fff;
  margin: 0 auto;
  > div {
    min-height: 700px;
  }
  .leftList {
    width: 730px;
    @include listRightBorder;
    padding: 20px 20px 40px;
    box-sizing: border-box;
    .rHead {
      height: 35px;
      width: 100%;
      border-bottom: 2px solid $primary;
      .headTop {
        .circle {
          @include circleRadius(17px, $primary);
          position: relative;
          &:after {
            position: absolute;
            content: "";
            display: inline-block;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            @include circleRadius(7px, #fff);
          }
        }
        .title {
          font-size: 20px;
        }
      }
    }
    .imgList {
      .imgItem {
        width: 140px;
        cursor: pointer;
        .innerImg {
          width: 140px;
          height: 140px;
          background-color: #fff;
          background-size: contain;
        }
      }
      .everyDay {
        .innerImg {
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
      }
    }
  }
  .rightList {
    width: 250px;
    .info_mine {
      div {
        cursor: pointer;
      }
      height: 185px;
      background: url("~assets/img/home/index.png") 0 -270px;
      padding: 20px;
      padding-bottom: 8px;
      .topInfo {
        height: 90px;
        .avatar {
          width: 80px;
          height: 80px;
          border: 1px solid #dadada;
          > img {
            width: 80px;
            height: 80px;
          }
        }
        .userInfo {
          .nickname {
            &:hover {
              text-decoration: underline;
            }
          }
          .level {
            width: 40px;
            padding-left: 25px;
            box-sizing: border-box;
            height: 17px;
            background: url("~assets/img/home/icon2.png") -130px -64px;
            font-family: Arial, Helvetica, sans-serif;
            font-weight: bold;
            font-style: italic;
            transform: translateY(-42%);
            &:hover {
              background-position: -130px -84px;
              .leval_i {
                background-position: -192px -84px;
              }
            }
            .leval_i {
              width: 8px;
              height: 17px;
              background: url("~assets/img/home/icon2.png") -192px -64px;
              float: right;
              transform: translateX(5px);
            }
          }
          .signIn {
            width: 100px;
            height: 31px;
            background: url("~assets/img/home/button2.png") right -428px;
            &:hover {
              background-position: right -510px;
              .signInI {
                background-position: 0 -469px;
              }
            }
            .signInI {
              width: 95px;
              height: 100%;
              background: url("~assets/img/home/button2.png") 0 -387px;
              letter-spacing: 5px;
              padding-left: 3px;
            }
          }
          .haveSignIn {
            background-position: right -346px;
            &:hover {
              cursor: default;
              background-position: right -346px;
              .haveSignInI {
                cursor: default;
                background-position: 0 -305px;
              }
            }
            .haveSignInI {
              color: #bebebe;
              background-position: 0 -305px;
              letter-spacing: inherit;
            }
          }
        }
      }
      .bottomInfo {
        .numDetail:nth-child(1) {
          padding-right: 20px;
        }
        .numDetail:nth-child(2) {
          padding-left: 20px;
          padding-right: 20px;
          border-left: solid 1px #e9e9e9;
          border-right: solid 1px #e9e9e9;
        }
        .numDetail:nth-child(3) {
          padding-left: 20px;
        }
      }
    }
  }
}
</style>