<template>
  <div id="app">
    <my-header />
    <router-view />
    <con-bar />
  </div>
</template>

<script>
import myHeader from "@/components/common/myHeader.vue";
import conBar from "@/components/common/controlBar.vue";
export default {
  name: "App",
  components: {
    myHeader,
    conBar
  }
};
</script>

<style lang="scss" scoped>
#app {
  height: 100%;
}
</style>
