<template>
  <div class="home container">
    <div class="row justify-content-center">
      <div class="col-2">
        <img id="center-logo" alt="Vue logo" src="../assets/mogul-logo.svg" />
      </div>
    </div>
    <hr />
    <div class="row justify-content-center">
      <div class="col">
        <Simulator />
      </div>
    </div>
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
#center-logo {
  margin-left: 65px;
}
</style>

