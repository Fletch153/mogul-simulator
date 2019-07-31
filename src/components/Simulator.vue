<template>
  <div class="row justify-content-center">
    <div class="col-12 text-center">
      <h1>{{ title }}</h1>
    </div>
    <div class="col-12">
      <h4>Current Prices</h4>
    </div>
    <div class="col-6">
      Buy Price (MGL/1 DAI): {{HRBuyMGLPerDAI}} MGL
      <small
        class="form-text text-muted"
      >How much MGL you are getting per 1 DAI invested</small>
    </div>
    <div class="col-6">
      Sell Price (DAI/ 1 MGL): {{ HRDAIPerMGL }} DAI
      <small
        class="form-text text-muted"
      >How much DAI you are receiving per 1 MGL Sold</small>
    </div>
    <div class="col-12">
      <hr />
    </div>
    <div class="col-12">
      <h4>Simulation totals</h4>
    </div>
    <div class="col-6">MGL in Circulation: {{HRTotalMGL.toLocaleString()}}</div>
    <div class="col-6">DAI invested: {{HRTotalDAI.toLocaleString()}}</div>
    <div class="col-12">
      <hr />
    </div>
    <div class="col-12">
      <div class="form-group">
        <label for="premintedMGL">Preminted MGL</label>
        <input type="text" class="form-control col-3" id="premintedMGL" v-model="premintedMGL" />
        <small id="premintedMGLHelp" class="form-text text-muted">How much MGL you want to premint</small>
      </div>
      <div class="form-group">
        <label for="initialDAIInvestment">Initial DAI Investment</label>
        <input
          type="text"
          class="form-control col-3"
          id="initialDAIInvestment"
          v-model="initialDAIInvestment"
        />
        <small
          id="initialDAIInvestmentHelp"
          class="form-text text-muted"
        >How much DAI you will invest in the beginning</small>
      </div>

      <input type="button" class="btn btn-primary" value="Start" @click="start" />

      <hr />
    </div>
    <div class="col-12">
      <h4>Reset Simulation</h4>
      <input type="button" class="btn btn-warning" value="Reset" @click="reset" />
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

let DAI = 1000000000000000000; // 1 DAI
let MGL = 1000000000000000000; // 1 MGL

let buyCalc = function buyCalc(
  continuousTokenSupply: number,
  totalInvestedDAI: number,
  amount: number
) {
  return continuousTokenSupply * ((1 + amount / totalInvestedDAI) ** 0.5 - 1);
};

let sellCalc = function sellCalc(
  continuousTokenSupply: number,
  reserveSupply: number,
  tokenAmount: number
) {
  return reserveSupply * (1 - (1 - tokenAmount / continuousTokenSupply) ** 2);
};

export default Vue.extend({
  name: "Simulator",
  data() {
    return {
      title: "Simulator",
      totalMGL: 0,
      totalDAI: 0,
      reserveSupply: 0,
      investmentFund: 0,
      premintedMGL: 5000000,
      initialDAIInvestment: 2500000
    };
  },
  methods: {
    // need annotation due to `this` in return type
    start() {
      this.totalMGL = this.premintedMGL * MGL;
      this.totalDAI = this.initialDAIInvestment * DAI;
      this.reserveSupply = this.totalDAI * 0.2;
      this.investmentFund = this.totalDAI * 0.8;
    },

    reset() {
      this.totalMGL = 0;
      this.totalDAI = 0;
      this.reserveSupply = 0;
      this.investmentFund = 0;
      this.premintedMGL = 0;
      this.initialDAIInvestment = 0;
    }
  },
  computed: {
    HRTotalMGL(): number {
      return this.totalMGL / MGL;
    },

    HRTotalDAI(): number {
      return this.totalDAI / DAI;
    },

    HRBuyMGLPerDAI(): number {
      if (this.totalDAI == 0) {
        return 0;
      }
      return (
        (this.totalMGL * ((1 + (1 * DAI) / this.totalDAI) ** 0.5 - 1)) / MGL
      );
    },

    HRDAIPerMGL(): number {
      if (this.reserveSupply == 0 || this.totalMGL == 0) {
        return 0;
      }

      let DAIPerMGL =
        (this.reserveSupply * (1 - (1 - (1 * MGL) / this.totalMGL) ** 2)) / DAI;
      return DAIPerMGL;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
