<template>
  <div class="swiper">
    <el-carousel arrow="always" height="285px">
      <el-carousel-item v-for="(item,index) in swiperList" :key="index">
        <div class="outImg" :style="{background: 'url('+item.outImg+') center center'}">
          <img class="inImg" :src="item.inImg" alt />
        </div>
      </el-carousel-item>
    </el-carousel>
    <div class="download">
      <div class="btnImg" @click="handleDownload"></div>
      <div class="bottomTxt">PC 安卓 iPhone WP iPad Mac 六大客户端</div>
    </div>
  </div>
</template>

<script>
import { getBanner } from "@/api/other.js";
export default {
  name: "",
  created() {
    getBanner({
      type: 2
    }).then(res => {
      res.data.banners.forEach((item, index) => {
        this.swiperList.push({
          inImg: item.imageUrl,
          outImg: item.imageUrl + "?imageView&blur=40x20"
        });
      });
    });
  },
  data() {
    return {
      swiperList: []
    };
  },
  methods: {
    handleDownload() {
      window.open("https://music.163.com/#/download", "_blank");
    }
  }
};
</script>

<style lang="scss" scoped>
.recommend {
  .swiper {
    height: 285px;
    background-color: #fff;
    position: relative;
    >>> .el-carousel__arrow {
      border-radius: 0;
      width: 37px;
      height: 62px;
      background-color: transparent;
      z-index: 100;

      &:hover {
        background-color: rgba($color: #000000, $alpha: 0.2);
      }
      .el-icon-arrow-left,
      .el-icon-arrow-right {
        transform: scale(3.5);
      }
    }
    >>> .el-carousel__arrow--left {
      left: 8.5%;
    }
    >>> .el-carousel__arrow--right {
      right: 8.5%;
    }
    >>> .el-carousel__indicators--horizontal {
      transform: translateX(calc(-50% - 127px));
    }
    .outImg {
      height: 285px;
      width: 100%;
      display: flex;
      justify-content: center;
      background-size: 2000px !important;
      .inImg {
        height: 285px;
        width: 730px;
        transform: translateX(-127px);
      }
    }
    .download {
      z-index: 8;
      height: 285px;
      width: 254px;
      background: url("~assets/img/home/download.png");
      position: absolute;
      top: 0;
      transform: translateX(-50%);
      left: calc(50% + 365px);
      .btnImg {
        background: url("~assets/img/home/download.png");
        background-position: -19px 10052px;
        width: 215px;
        height: 56px;
        margin: 186px 0 0 19px;
        &:hover {
          // box-shadow: #000000 0 0 18px;
          background: linear-gradient(rgba(0, 0, 0, 0.06));
          // transform: translateY(2%);
        }
      }
      .bottomTxt {
        position: absolute;
        bottom: 18px;
        left: 50%;
        transform: translateX(-50%);
        color: #8d8d8d;
        font-size: 12px;
        width: 100%;
        display: flex;
        justify-content: center;
        flex-shrink: 0;
      }
    }
  }
}
</style>