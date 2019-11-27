<template>
  <div class="corg-wrapper container-fluid">
    <Simulator />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Simulator from "@/components/Simulator.vue"; // @ is an alias to /src

export default Vue.extend({
  name: "home",
  components: {
    Simulator
  }
});
</script>
<style scoped lang="less">
@import url('https://fonts.googleapis.com/css?family=Lato:300,400,400i,700&display=swap');

body {
  font-family: Lato;
  font-weight: 400;
}
.corg-wrapper {
  background: #1C1C1B;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}
</style>

