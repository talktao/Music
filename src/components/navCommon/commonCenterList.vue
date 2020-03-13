<template>
  <div class="centerList d-flex">
    <div class="leftList">
      <slot name="leftList"></slot>
    </div>
    <div class="rightList">
      <slot name="rightList"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {};
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
    box-sizing: border-box;
  }
  .rightList {
    width: 250px;
  }
}
</style>