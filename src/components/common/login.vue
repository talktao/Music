<template>
  <!-- 登录框 -->
  <div
    class="dragMask"
    :style="{width: screenWidth+'px',height: screenHeight+'px'}"
    v-if="showLogin"
    @click.stop
  >
    <div :style="{left: screenWidth/2+'px',top: screenHeight/2+'px'}" class="dragBox">
      <div class="head">
        <span>{{operationTitle}}</span>
        <span @click="showLogin=false" title="关闭窗体">×</span>
      </div>
      <div class="content" v-if="operationTitle=='登录'">
        <div class="centerArea">
          <div class="leftArea">
            <div class="platform"></div>
            <a @click="handleToLoginByPhone">
              <a>手机号登录</a>
            </a>
            <a>
              <a>注册</a>
            </a>
          </div>
          <div class="rightArea">
            <div class="item" v-for="(item,index) in loginWays" :key="index">
              <div class="ways_img" :style="{backgroundPosition: item.bgp}"></div>
              <div class="title">{{item.title}}</div>
            </div>
          </div>
        </div>
        <div class="bottomArea">
          <input type="checkbox" :checked="true" />
          <span class="static">同意</span>
          <span>《服务条款》</span>
          <span>《隐私政策》</span>
          <span>《儿童隐私政策》</span>
        </div>
      </div>
      <!-- 手机号登录 -->
      <div class="loginByPhone" v-if="operationTitle=='手机号登录'">
        <div class="centerArea">
          <div class="phone">
            <div class="drop">
              +{{phoneNumberLogin.countrycode}}
              <i class="el-icon-caret-bottom"></i>
            </div>
            <input type="text" placeholder="请输入手机号" class="phoneNum" v-model="phoneNumberLogin.phone" />
          </div>
          <input placeholder="请输入密码" type="password" class="password" v-model="phoneNumberLogin.password" />
          <div class="column3">
            <div class="leftArea" @click="autoLogin_loginByPhone=!autoLogin_loginByPhone">
              <div class="checkBox">
                <input type="checkbox" :checked="autoLogin_loginByPhone" />
              </div>
              <span>自动登录</span>
            </div>
            <span>忘记密码？</span>
          </div>
          <a @click="handleLoginByPhone">
            <a>登录</a>
          </a>
        </div>
        <div class="bottomArea">
          <div class="leftArea" @click="handleToOtherWaysLogin">&lt;&nbsp;&nbsp;其他登录方式</div>
          <div class="rightArea">没有帐号？免费注册&nbsp;&nbsp;&gt;</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { loginByPhoneNumber,getLoginStatus,refreshLogin } from '@/api/login'
export default {
  name: "",
  data() {
    return {
      loginWays: [
        {
          title: "微信登录",
          bgp: "-150px -670px"
        },
        {
          title: "QQ登录",
          bgp: "-190px -670px"
        },
        {
          title: "微博登录",
          bgp: "-231px -670px"
        },
        {
          title: "网易邮箱账号登录",
          bgp: "-271px -670px"
        }
      ],
      operationTitle: "登录",
      autoLogin_loginByPhone: true,
      showLogin: false,
      phoneNumberLogin:{
        phone: '',
        password: '',
        countrycode: '86'
      }
    };
  },
  methods: {
    handleLoginByPhone() {
      loginByPhoneNumber({
        phone: this.phoneNumberLogin.phone,
        password: this.phoneNumberLogin.password,
        countrycode: this.phoneNumberLogin.countrycode
      }).then(async res=>{
        if(res.data.code == 200){
          this.$router.go(0)
          this.showLogin = false;
          this.operationTitle = "登录";
          this.$emit("loginByPhoneNumberSuccess")
          localStorage.loginSuccessInfo = JSON.stringify(res.data)
          // getLoginStatus().then(res=>{
          //   console.log(res)
          // })
          // refreshLogin().then(res=>{
          //   console.log(res)
          // })
        }else{
          this.$message.error(res.data.msg)
        }
      }).catch(err=>{
        // console.log(err)
      })
    },
    openLogin() {
      this.showLogin = true;
    },
    handleToOtherWaysLogin() {
      this.operationTitle = "登录";
    },
    handleToLoginByPhone() {
      this.operationTitle = "手机号登录";
    },
  },
  created() {
    this.screenWidth = document.documentElement.clientWidth;
    this.screenHeight = document.documentElement.clientHeight;
    window.addEventListener("resize", () => {
      this.screenWidth = document.documentElement.clientWidth;
      this.screenHeight = document.documentElement.clientHeight;
      this.$forceUpdate()
    });
  }
};
</script>

<style lang="scss" scoped>
.dragMask {
  position: fixed;
  background-color: transparent;
  z-index: 99;
  top: 0;
  left: 0;
  .dragBox {
    z-index: 99;
    width: 528px;
    position: fixed;
    transform: translate(-50%, -50%);
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.8);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    .head {
      height: 39px;
      background-color: #2d2d2d;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      padding-left: 18px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-shrink: 0;
      justify-content: space-between;
      cursor: move;
      > span:first-child {
        font-size: 14px;
        font-weight: bold;
        color: #fff;
      }
      > span:last-child {
        height: 100%;
        width: 39px;
        text-align: center;
        line-height: 39px;
        font-size: 20px;
        color: #696969;
        cursor: pointer;
        margin-right: 5px;
      }
    }
    .content {
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: #fff;
      width: 100%;
      height: 332px;
      padding: 40px 0;
      box-sizing: border-box;
      .centerArea {
        width: 100%;
        height: 205px;
        box-sizing: border-box;
        display: flex;
        .leftArea {
          width: 300px;
          height: 100%;
          padding: 0 35px 3px 40px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          flex-shrink: 0;
          align-items: center;
          border-right: dotted 1px #ccc;
          .platform {
            width: 100%;
            height: 120px;
            background-size: 100% !important;
            background: url("~assets/img/home/platform.png") no-repeat;
          }
          > a {
            width: 224px;
            height: 31px;
            padding-right: 5px;
            box-sizing: border-box;
            background: url("~assets/img/home/button2.png");
            margin-top: 10px;
            > a {
              width: 219px;
              height: 31px;
              background: url("~assets/img/home/button2.png");
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 12px;
            }
          }
          > a:first-of-type {
            background-position: right -428px !important;
            > a {
              background-position: 0 -387px !important;
              color: #fff;
            }
            &:hover {
              background-position: right -510px !important;
              > a {
                background-position: 0 -469px !important;
              }
            }
            &:active {
              background-position: right -592px !important;
              > a {
                background-position: 0 -551px !important;
              }
            }
          }
          > a:last-of-type {
            background-position: right -100px !important;
            > a {
              background-position: 0 -59px !important;
              color: #333;
            }
            &:hover {
              background-position: right -182px !important;
              > a {
                background-position: 0 -141px !important;
              }
            }
          }
        }
        .rightArea {
          flex: 1;
          height: 100%;
          padding: 3px 0 3px 39px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          .item {
            height: 39px;
            display: flex;
            flex-shrink: 0;
            cursor: pointer;
            &:hover {
              .title {
                text-decoration: underline;
              }
            }
            .ways_img {
              background: url("~assets/img/home/logo1.png");
              width: 38px;
              height: 38px;
              margin-right: 14px;
            }
            > .title {
              color: #333;
              font-size: 12px;
              line-height: 39px;
            }
          }
        }
      }
      .bottomArea {
        margin: 30px 0 0 40px;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        > span {
          font-size: 10px;
          color: #507daf;
          margin-right: 3px;
          &:hover {
            text-decoration: underline;
          }
        }
        .static {
          margin-left: 2px;
          color: rgba($color: #000000, $alpha: 0.4);
          &:hover {
            text-decoration: none;
          }
        }
      }
    }
    .loginByPhone {
      width: 100%;
      // height: 500px;
      color: #333;
      font-size: 12px;
      background-color: #fff;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      > .centerArea {
        width: 220px;
        height: 224px;
        margin: 0 154px;
        padding: 30px 0 43px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
        > div,
        > input {
          width: 220px;
          height: 32px;
          margin-bottom: 10px;
          box-sizing: border-box;
          font-size: 12px;
          outline: none;
        }
        .phone {
          height: 32px;
          border: 1px solid #cdcdcd;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          .drop {
            width: 45px;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-shrink: 0;
            border-right: 1px #cdcdcd solid;
            cursor: pointer;
          }
          .phoneNum {
            flex: 1;
            height: 100%;
            box-sizing: border-box;
            border: none;
            padding: 5px 8px;
            font-size: 12px;
            outline: none;
          }
        }
        .password {
          padding: 5px 6px 6px;
          border: 1px solid #cdcdcd;
          height: 32px;
          width: 220px;
          margin-bottom: 0;
        }
        .column3 {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          > .leftArea {
            height: 100%;
            display: flex;
            align-items: center;
            flex-shrink: 0;
            .checkBox {
              height: 100%;
              width: 28px;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              flex-shrink: 0;
              > input {
                transform: translateY(8%);
                margin: 0;
              }
            }
          }
          > span {
            cursor: pointer;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        > a {
          width: 220px;
          height: 31px;
          padding-right: 5px;
          box-sizing: border-box;
          background: url("~assets/img/home/button2.png");
          > a {
            width: 215px;
            height: 31px;
            background: url("~assets/img/home/button2.png");
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
          }
        }
        > a:first-of-type {
          background-position: right -428px !important;
          > a {
            background-position: 0 -387px !important;
            color: #fff;
          }
          &:hover {
            background-position: right -510px !important;
            > a {
              background-position: 0 -469px !important;
            }
          }
          &:active {
            background-position: right -592px !important;
            > a {
              background-position: 0 -551px !important;
            }
          }
        }
      }
      > .bottomArea {
        padding: 0 19px;
        width: 100%;
        height: 48px;
        box-sizing: border-box;
        border-top: 1px solid #c6c6c6;
        line-height: 48px;
        background-color: #f7f7f7;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        > div {
          cursor: pointer;
        }
        > .leftArea {
          color: #0c72c3;
        }
      }
    }
  }
}
</style>