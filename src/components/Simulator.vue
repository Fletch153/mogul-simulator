<template>
  <div class="row justify-content-center">
    <div class="col-7 simulator">
      <div class="row">
        <div class="col-12">
          <div class="row">
            <div class="col-12">
              <h1>Simulation</h1>
              <hr />
              <h4>Prices</h4>
            </div>
            <!-- <div class="col-3">
              Buy Price (MGL/USD): {{HRBuyMGLPerDAI}} MGL
              <small
                class="form-text text-muted"
              >How much MGL you are getting per 1 USD invested</small>
            </div>
            <div class="col-3">
              Sell Price (MGL/USD): {{ HRSellMGLperDAI }} MGL
              <small
                class="form-text text-muted"
              >How much MGL you should send to receive 1 USD</small>
            </div>-->
            <div class="col-3">
              Buy Price (USD/MGL): {{HRBuyDAIPerMGL}} USD
              <small
                class="form-text text-muted"
              >How much USD you need to send to receive 1 MGL</small>
            </div>
            <div class="col-3">
              Sell Price (USD/MGL): {{ HRSellDAIPerMGL }} USD
              <small
                class="form-text text-muted"
              >How much USD you are going to receive for the next 1 MGL sold</small>
            </div>
            <div class="col-12">
              <hr />
            </div>
            <div class="col-12">
              <h4>Prices Charts</h4>
            </div>
            <div class="col-12 chart-div">
              <CurveChart :chart-data="chartsDataset" :options="chartOptions" />
            </div>
            <div class="col-12">
              <hr />
            </div>
            <div class="col-12">
              <h4>Simulation details</h4>
            </div>
            <div class="col-2">Reserve ratio: {{reserveRatio}}%</div>
            <div class="col-3">MGL in Circulation: {{HRTotalMGL.toLocaleString()}}</div>
            <div class="col-3">USD invested: {{HRTotalDAI.toLocaleString()}}</div>
            <div class="col-3">Buy-back reserve: {{HRReserveSupply.toLocaleString()}}</div>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
    <div class="col-5 simulator">
      <div class="row">
        <div class="col-12">
          <h1>Actions</h1>
          <div class="row">
            <div class="col-4 right-separator">
              <h4>Initial investment</h4>
              <div class="form-group">
                <label for="premintedMGL">Preminted MGL</label>
                <input
                  type="text"
                  class="form-control col-6"
                  id="premintedMGL"
                  v-model="premintedMGL"
                />
                <small
                  id="premintedMGLHelp"
                  class="form-text text-muted"
                >How much MGL you want to premint</small>
              </div>
              <div class="form-group">
                <label for="initialDAIInvestment">Initial DAI Investment</label>
                <input
                  type="text"
                  class="form-control col-6"
                  id="initialDAIInvestment"
                  v-model="initialDAIInvestment"
                />
                <small
                  id="initialDAIInvestmentHelp"
                  class="form-text text-muted"
                >How much DAI you will invest in the beginning</small>
              </div>
              <div class="form-group">
                <label for="reserveRatio">Reserve Ratio (%)</label>
                <input
                  type="text"
                  class="form-control col-3"
                  id="reserveRatio"
                  v-model="reserveRatio"
                />
                <small
                  id="reserveRatioHelp"
                  class="form-text text-muted"
                >What % of each investment goes to the reserve</small>
              </div>

              <input type="button" class="btn btn-primary" value="Start" @click="start" />
            </div>
            <div class="col-4 right-separator"></div>
            <div class="col-4 right-separator">
              <h4>Reset Simulation</h4>
              <input type="button" class="btn btn-warning" value="Reset" @click="reset" />
            </div>
          </div>
        </div>
        <div class="col-12">
          <hr />
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-4 right-separator">
              <h4>Invest</h4>
              <div class="form-group">
                <label for="daiInvestment">USD</label>
                <input
                  type="text"
                  class="form-control col-6"
                  id="daiInvestment"
                  v-model="daiInvestment"
                />
                <small
                  id="daiInvestmentHelp"
                  class="form-text text-muted"
                >How much USD you want to invest</small>
              </div>

              <input type="button" class="btn btn-primary" value="Invest" @click="invest" />
            </div>
            <div class="col-4 right-separator">
              <h4>Sell</h4>
              <div class="form-group">
                <label for="mglSold">MGL</label>
                <input type="text" class="form-control col-6" id="mglSold" v-model="mglSold" />
                <small id="mglSoldHelp" class="form-text text-muted">How much MGL you want to sell</small>
              </div>

              <input type="button" class="btn btn-primary" value="Sell" @click="sell" />
            </div>
            <div class="col-4 right-separator">
              <h4>Pay Dividend</h4>
              <div class="form-group">
                <label for="dividendPaid">USD</label>
                <input
                  type="text"
                  class="form-control col-6"
                  id="dividendPaid"
                  v-model="dividendPaid"
                />
                <small
                  id="dividendPaidHelp"
                  class="form-text text-muted"
                >How much USD you want to pay as dividend</small>
              </div>
              <div class="form-group">
                <label for="dividendRatio">Percent to Reserve (%)</label>
                <input
                  type="text"
                  class="form-control col-3"
                  id="dividendRatio"
                  v-model="dividendRatio"
                />
                <small
                  id="dividendRatioHelp"
                  class="form-text text-muted"
                >What percent do you want to go to the reserve</small>
              </div>

              <input type="button" class="btn btn-primary" value="Pay" @click="payDividend" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CurveChart from "@/components/CurveChart.vue";

const DAI = 1000000000000000000; // 1 DAI
const MGL = 1000000000000000000; // 1 MGL

const buyCalc = (
  continuousTokenSupply: number,
  preMintedAmount: number,
  amount: number
) => {
  const x1 = continuousTokenSupply ** 2;
  const x2 = 2 * amount * preMintedAmount;
  const x3 = (x1 + x2) ** 0.5;
  return x3 - continuousTokenSupply;
};

const sellCalc = (
  continuousTokenSupply: number,
  reserveSupply: number,
  tokenAmount: number
) => {
  const a = 1 - tokenAmount / continuousTokenSupply;
  const b = 1 - a * a;

  return reserveSupply * b;
};

export default Vue.extend({
  name: "Simulator",
  components: {
    CurveChart
  },
  data() {
    return {
      totalMGL: 0,
      totalDAI: 0,
      reserveRatio: 20,
      reserveSupply: 0,
      investmentFund: 0,
      premintedMGL: 5000000,
      initialDAIInvestment: 2500000,
      daiInvestment: 0,
      mglSold: 0,
      dividendPaid: 0,
      dividendRatio: 20,
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: (value: string, index: any, values: any) => {
                  return `$${value}`;
                }
              }
            }
          ],
          xAxes: [
            {
              ticks: {
                // Include a dollar sign in the ticks
                callback: (value: string, index: any, values: any) => {
                  return `${value} MGL`;
                }
              }
            }
          ]
        }
      }
    };
  },
  methods: {
    start(): void {
      this.totalMGL = this.premintedMGL * MGL;
      this.totalDAI = this.initialDAIInvestment * DAI;
      this.reserveSupply = this.totalDAI * this.reserveRatioDecimal;
      this.investmentFund = this.totalDAI * (1 - this.reserveRatioDecimal);
    },

    invest(): void {
      const investment = this.daiInvestment * DAI;
      const mglMinted = buyCalc(
        this.totalMGL,
        this.premintedMGL * MGL,
        investment
      );
      this.totalDAI += investment;
      this.reserveSupply += investment * this.reserveRatioDecimal;
      this.investmentFund += investment * (1 - this.reserveRatioDecimal);
      this.totalMGL += mglMinted;
    },

    sell(): void {
      const sellAmount = this.mglSold * MGL;
      const daiReturned = sellCalc(
        this.totalMGL,
        this.reserveSupply,
        sellAmount
      );
      this.totalMGL -= sellAmount;
      this.reserveSupply -= daiReturned;
      this.totalDAI -= daiReturned;
    },

    payDividend(): void {
      const dividend = this.dividendPaid * DAI;
      this.totalDAI += dividend;
      this.reserveSupply += dividend * this.dividendRatioDecimal;
      this.investmentFund += dividend * (1 - this.dividendRatioDecimal);
    },

    reset(): void {
      this.totalMGL = 0;
      this.totalDAI = 0;
      this.reserveSupply = 0;
      this.investmentFund = 0;
      this.premintedMGL = 0;
      this.initialDAIInvestment = 0;
      this.daiInvestment = 0;
      this.mglSold = 0;
      this.dividendPaid = 0;
      this.dividendRatio = 20;
    }
  },
  computed: {
    reserveRatioDecimal(): number {
      return this.reserveRatio / 100;
    },

    dividendRatioDecimal(): number {
      return this.dividendRatio / 100;
    },

    HRTotalMGL(): number {
      return this.totalMGL / MGL;
    },

    HRTotalDAI(): number {
      return this.totalDAI / DAI;
    },

    HRReserveSupply(): number {
      return this.reserveSupply / DAI;
    },

    HRBuyMGLPerDAI(): number {
      if (this.totalMGL === 0) {
        return 0;
      }
      return buyCalc(this.totalMGL, this.premintedMGL * MGL, DAI) / MGL;
    },

    HRBuyDAIPerMGL(): number {
      if (this.totalDAI === 0) {
        return 0;
      }
      return 1 / this.HRBuyMGLPerDAI;
    },

    HRSellDAIPerMGL(): number {
      if (this.reserveSupply === 0 || this.totalMGL === 0) {
        return 0;
      }

      const DAIPerMGL = sellCalc(this.totalMGL, this.reserveSupply, MGL) / DAI;
      return DAIPerMGL;
    },

    HRSellMGLperDAI(): number {
      return 1 / this.HRSellDAIPerMGL;
    },

    buyCurveData(): number[] {
      if (this.totalDAI === 0) {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      const data = [];
      for (let i = 0; i <= 10; i++) {
        const investAmount = 1 + i * 20000000;
        const mglReceived =
          buyCalc(this.totalMGL, this.premintedMGL * MGL, investAmount * DAI) /
          MGL;
        data.push(investAmount / mglReceived);
      }
      return data;
    },

    sellCurveData(): number[] {
      if (this.reserveSupply === 0 || this.totalMGL === 0) {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      const data = [];
      for (let i = 0; i <= 10; i++) {
        const sellAmount = 1 + i * 20000000;
        const mglReceived = buyCalc(
          this.totalMGL,
          this.premintedMGL * MGL,
          sellAmount * DAI
        );
        const reserveAddition = sellAmount * DAI * this.reserveRatioDecimal;
        const receivedDai = sellCalc(
          this.totalMGL + mglReceived,
          this.reserveSupply + reserveAddition,
          mglReceived
        );
        const daiPerMGL = receivedDai / mglReceived;
        data.push(daiPerMGL);
      }
      return data;
    },

    chartLabels(): string[] {
      const data = [];
      for (let i = 0; i <= 10; i++) {
        const investAmount = 1 + i * 20000000;
        const mglReceived =
          buyCalc(this.totalMGL, this.premintedMGL * MGL, investAmount * DAI) /
          MGL;
        data.push(Math.round(mglReceived).toString());
      }
      return data;
    },

    chartsDataset(): any {
      const datasets = {
        labels: this.chartLabels,
        datasets: [
          {
            label: "Buy Curve",
            data: this.buyCurveData,
            fill: false,
            backgroundColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          },
          {
            label: "Sell Curve",
            data: this.sellCurveData,
            fill: false,
            backgroundColor: "#f87979",
            lineTension: 0.1
          }
        ]
      };
      return datasets;
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.box-shadow(...) {
  -webkit-box-shadow: @arguments;
  -moz-box-shadow: @arguments;
  box-shadow: @arguments;
}

.simulator {
  border: 1px solid black;
  background-color: white;
  margin-bottom: 20px;
  .box-shadow(0 0 5px 2px rgba(0, 0, 0, 0.2));
}
.right-separator {
  border: 1px solid lightgray;
  padding: 10px;
}
</style>
