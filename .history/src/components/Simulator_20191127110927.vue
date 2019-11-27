<template>
  <div class="mogul-corg">
    <header class="level">
      <div class="level-left logo">
        <div class="logo-wrapper">
          <Logo />
        </div>
      </div>
      <div class="level-left simulate"></div>
    </header>
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
              <CurveChart :chart-data="historyChartDataset" :options="historyChartOptions" />
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
            <div class="col-12">Reserve ratio: {{reserveRatio}}%</div>
            <div class="col-6">MGL in Circulation: {{HRTotalMGL.toLocaleString()}}</div>
            <div class="col-6">USD invested: {{HRTotalDAIInvested.toLocaleString()}}</div>
            <div class="col-6">Mogul Investment Fund: {{HRInvestmentFund.toLocaleString()}}</div>
            <div class="col-6">Buy-back reserve: {{HRReserveSupply.toLocaleString()}}</div>
            <div class="col-6">Commission Enabled: {{isCommissionEnabled}}</div>
            <div class="col-6">Commission Balance: {{HRCommissionBalance.toLocaleString()}}</div>
            <div class="col-6">Burnt Supply: {{HRBurntSupply.toLocaleString()}}</div>
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
            <div class="col-6 right-separator">
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
                <label for="initialDAIInvestment">Initial USD Investment</label>
                <input
                  type="text"
                  class="form-control col-6"
                  id="initialDAIInvestment"
                  v-model="initialDAIInvestment"
                />
                <small
                  id="initialDAIInvestmentHelp"
                  class="form-text text-muted"
                >How much USD you will invest in the beginning</small>
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

              <div class="form-group">
                  <label for="buySlopeMultiplier">Buy Slope Multiplier</label>
                  <input
                    type="number"
                    class="form-control col-3"
                    id="buySlopeMultiplier"
                    v-model="buySlopeMultiplier"
                  />
                  <small
                          id="buySlopeMultiplierHelp"
                          class="form-text text-muted"
                  >The higher the buy slope is, the more value unit tokens will have</small>
              </div>

              <div class="form-group">
                <label for="isCommissionEnabled">Enable 2% Commission</label>
                <input
                        type="checkbox"
                        class="form-control col-3"
                        id="isCommissionEnabled"
                        v-model="isCommissionEnabled"
                />
                <small
                        id="isCommissionEnabledHelp"
                        class="form-text text-muted"
                >Enable 2% more tokens going to commission balance</small>
              </div>
              <span style="margin-right: 50px">
                  <input type="button" class="btn btn-primary" value="Start" @click="start" />
              </span>
              <span>
                  <input type="button" class="btn btn-primary" value="Close" @click="close" />
              </span>

            </div>
            <div class="col-6 right-separator">
              <h4>Reset Simulation</h4>
              <input type="button" class="btn btn-warning" value="Reset" @click="reset" />
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="row">
            <div class="col-6 right-separator">
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
            <div class="col-6 right-separator">
              <h4>Sell</h4>
              <div class="form-group">
                <label for="mglSold">MGL</label>
                <input type="text" class="form-control col-6" id="mglSold" v-model="mglSold" />
                <small id="mglSoldHelp" class="form-text text-muted">How much MGL you want to sell</small>
              </div>

              <input type="button" class="btn btn-primary" value="Sell" @click="sell" />
            </div>
          </div>
        </div>
        <div class="col-12">
              <div class="row">
                  <div class="col-6 right-separator">
                      <h4>Burn</h4>
                      <div class="form-group">
                          <label for="burntSupply">MGL</label>
                          <input
                                  type="text"
                                  class="form-control col-6"
                                  id="burntSupply"
                                  v-model="mglToBurn"
                          />
                          <small
                                  id="burntSupplyHelp"
                                  class="form-text text-muted"
                          >How much MGL you want to burn</small>
                      </div>

                      <input type="button" class="btn btn-primary" value="Burn" @click="burn" />
                  </div>

                  <div class="col-6 right-separator">
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
import numeral from "numeral";
import { Logo } from '../assets/svg/logo.vue';

const DAI = 1000000000000000000; // 1 DAI
const MGL = 1000000000000000000; // 1 MGL

const buyCalc = (
  continuousTokenSupply: number,
  preMintedAmount: number,
  amount: number,
  buySlopeMultiplier: number
) => {
  const x1 = continuousTokenSupply ** 2;
  const x2 = 2 * amount * preMintedAmount * buySlopeMultiplier;
  const x3 = (x1 + x2) ** 0.5;
  return x3 - continuousTokenSupply;
};

const calcCloseTax = (
    continuousTokenSupply: number,
    reserveSupply: number,
    preMintedAmount: number,
    buySlopeMultiplier: number,
    burntSupply: number
) => {
    const normalizer = 100000000;
    const continuousTokenSupplyTruncated = continuousTokenSupply / normalizer;
    const burntSupplyTruncated = burntSupply / normalizer;
    const preMintedAmountTruncated = preMintedAmount / normalizer;
    const reserveSupplyTruncated = reserveSupply / normalizer;

    return ((continuousTokenSupplyTruncated + burntSupplyTruncated) * (continuousTokenSupplyTruncated + burntSupplyTruncated) / (preMintedAmountTruncated * buySlopeMultiplier) / 2 - reserveSupplyTruncated) * normalizer;
};

const sellClosedCalc = (
    continuousTokenSupply: number,
    reserveSupply: number,
    tokenAmount: number
) => {

    return reserveSupply * tokenAmount / continuousTokenSupply;
};

const sellCalc = (
  continuousTokenSupply: number,
  reserveSupply: number,
  tokenAmount: number,
  burntSupply: number
) => {
  const sellSlope = (2 * reserveSupply) / ((continuousTokenSupply + burntSupply) ** 2);

  const a = continuousTokenSupply * tokenAmount * sellSlope;
  const b = (tokenAmount ** 2 * sellSlope) / 2;
  const c = (sellSlope * tokenAmount * (burntSupply ** 2)) / (2 * (continuousTokenSupply - burntSupply));

  return a - b + c;

  // const a = 1 - tokenAmount / continuousTokenSupply;
  // const b = 1 - a * a;
  //
  // return reserveSupply * b;
};

export default Vue.extend({
  name: "Simulator",
  components: {
    CurveChart,
    Logo
  },
  data() {
    return {
      totalMGL: 0,
      totalDAI: 0,
      totalDaiInvested: 0,
      burntSupply: 0,
      mglToBurn: 0,
      reserveRatio: 20,
      reserveSupply: 0,
      buySlopeMultiplier: 10,
      investmentFund: 0,
      premintedMGL: 60000000,
      initialDAIInvestment: 3000000,
      daiInvestment: 0,
      mglSold: 0,
      dividendPaid: 0,
      dividendRatio: 20,
      historicalEvents: new Array<string>(),
      historicalSellPrices: new Array<string>(),
      historicalBuyPrices: new Array<string>(),
      commissionBalance: 0,
      isCommissionEnabled: false,
      isOrganisationClosed: false,
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
      },
      historyChartOptions: {
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
          ]
        }
      }
    };
  },
  methods: {
    start(): void {
      this.totalMGL = this.premintedMGL * MGL;
      this.totalDAI = this.initialDAIInvestment * DAI; // TODO Fixme
      this.totalDaiInvested = this.totalDAI;
      // modified by the need of mogul
      this.reserveSupply = this.totalDAI * this.reserveRatioDecimal;
      this.investmentFund = this.totalDAI * (1 - this.reserveRatioDecimal);
      this.commissionBalance = 0;

      this.historicalEvents = new Array<string>();
      this.historicalSellPrices = new Array<string>();
      this.historicalBuyPrices = new Array<string>();
      this.historicalEvents.push(`Before start`);
      this.historicalSellPrices.push(`0`);
      this.historicalBuyPrices.push(`0`);
      this.historicalEvents.push(`Start CORG`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toString());
    },
    close(): void {
      const tax = this.totalDaiInvested;
      const r = confirm(
        `You have to pay  ${(tax / MGL).toFixed(
          2
        )} USD to close the Organisation. Shall we proceed?`
      );
      if (!r) {
        return;
      }
      this.isOrganisationClosed = true;
      this.reserveSupply += tax;
      this.totalDAI += tax;
    },
    invest(): void {
      if (this.isOrganisationClosed) {
          alert("The organisation is closed");
          return;
      }
      const investment = this.daiInvestment * DAI;
      const mglMinted = buyCalc(
        this.totalMGL,
        this.premintedMGL * MGL,
        investment,
        this.buySlopeMultiplier
      );
      const r = confirm(
        `You are about to buy ${(mglMinted / MGL).toFixed(
          2
        )} MGL at the price of ${(investment / mglMinted).toFixed(
          5
        )}. Shall we proceed?`
      );
      if (!r) {
        return;
      }
      this.totalDAI += investment;
      this.totalDaiInvested += investment;
      this.reserveSupply += investment * this.reserveRatioDecimal;
      this.investmentFund += investment * (1 - this.reserveRatioDecimal);
      this.totalMGL += mglMinted;

      if (this.isCommissionEnabled) {
        const commissionMgl = mglMinted * 2 / 100;
        this.totalMGL += commissionMgl;
        this.commissionBalance += commissionMgl;
      }

      const investmentNumeral = numeral(this.daiInvestment).format("0.0a");
      this.historicalEvents.push(`Invested $${investmentNumeral}`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toString());
    },

    sell(): void {
      const sellAmount = this.mglSold * MGL;

      let daiReturned;
      if (!this.isOrganisationClosed) {
          daiReturned = sellCalc(
              this.totalMGL,
              this.reserveSupply,
              sellAmount,
              this.burntSupply
          );
      } else {
          daiReturned = sellClosedCalc(
              this.totalMGL,
              this.reserveSupply,
              sellAmount
          );
      }
      if (this.reserveSupply - daiReturned < 0 || this.totalMGL - sellAmount < 0) {
        alert("can't sell more than the tokens in circulation");
        return;
      }

      const r = confirm(
        `You are about to sell ${this.mglSold} MGL at price ${(
          daiReturned / sellAmount
        ).toFixed(5)} and receive back $${(daiReturned / DAI).toFixed(
          2
        )}. Shall we proceed?`
      );
      if (!r) {
        return;
      }
      this.totalMGL -= sellAmount;
      this.reserveSupply -= daiReturned;
      this.totalDAI -= daiReturned;

      const sellNumeral = numeral(this.mglSold).format("0.0a");
      this.historicalEvents.push(`Sold ${sellNumeral} MGL`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toString());
    },

    burn(): void {
      if (this.isOrganisationClosed) {
        alert("The organisation is closed");
        return;
      }
      const tokensToBurn = this.mglToBurn * MGL;
      if (this.totalMGL - tokensToBurn < 0) {
          alert("Can't burn more tokens than you have");
          return;
      }
      this.burntSupply += tokensToBurn;
      this.totalMGL -= tokensToBurn;

      const burnNumeral = numeral(this.mglToBurn).format("0.0a");
      this.historicalEvents.push(`Burned ${burnNumeral} MGL`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toString());
    },

    payDividend(): void {
      const dividend = this.dividendPaid * DAI;
      this.totalDAI += dividend;
      this.reserveSupply += dividend * this.dividendRatioDecimal;
      this.investmentFund += dividend * (1 - this.dividendRatioDecimal);

      const dividendNumeral = numeral(this.dividendPaid).format("0.0a");
      this.historicalEvents.push(`Dividend $${dividendNumeral}`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toString());
    },

    reset(): void {
      this.totalMGL = 0;
      this.totalDAI = 0;
      this.totalDaiInvested = 0;
      this.reserveSupply = 0;
      this.investmentFund = 0;
      this.premintedMGL = 60000000;
      this.initialDAIInvestment = 3000000;
      this.daiInvestment = 0;
      this.mglSold = 0;
      this.dividendPaid = 0;
      this.commissionBalance = 0;
      this.mglToBurn = 0;
      this.burntSupply = 0;
      this.dividendRatio = 20;
      this.historicalEvents = new Array<string>();
      this.historicalSellPrices = new Array<string>();
      this.historicalBuyPrices = new Array<string>();
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

    HRCommissionBalance(): number {
      return this.commissionBalance / MGL;
    },

    HRBurntSupply(): number {
      return this.burntSupply / DAI;
    },

    HRTotalDAI(): number {
      return this.totalDAI / DAI;
    },

    HRTotalDAIInvested(): number {
      return this.totalDaiInvested / DAI;
    },

    HRReserveSupply(): number {
      return this.reserveSupply / DAI;
    },

    HRInvestmentFund(): number {
      return this.investmentFund / DAI;
    },

    HRBuyMGLPerDAI(): number {
      if (this.totalMGL === 0) {
        return 0;
      }
      return buyCalc(this.totalMGL, this.premintedMGL * MGL, DAI, this.buySlopeMultiplier) / MGL;
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

      const DAIPerMGL = sellCalc(this.totalMGL, this.reserveSupply, MGL, this.burntSupply) / DAI;
      return DAIPerMGL;
    },

    HRSellMGLperDAI(): number {
      if (1 / this.HRSellDAIPerMGL < 0) {
          return 0;
      }
      return 1 / this.HRSellDAIPerMGL;
    },

    buyCurveData(): number[] {
      if (this.totalDAI === 0) {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      const data = [];
      data.push(this.initialDAIInvestment / this.premintedMGL);
      data.push(this.initialDAIInvestment / this.premintedMGL);
      for (let i = 0; i <= 20; i++) {
        const investAmount = 1 + i * 10000000;
        const mglReceived =
          buyCalc(this.totalMGL, this.premintedMGL * MGL, investAmount * DAI, this.buySlopeMultiplier) /
          MGL;
        data.push(investAmount / mglReceived);
      }
      return data;
    },

    sellCurveData(): number[] {
      if (this.reserveSupply === 0 || this.totalMGL === 0) {
        return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      const data = [];
      data.push(
        (this.initialDAIInvestment / this.premintedMGL) *
          this.reserveRatioDecimal
      );
      data.push(
        (this.initialDAIInvestment / this.premintedMGL) *
          this.reserveRatioDecimal
      );
      for (let i = 0; i <= 20; i++) {
        const sellAmount = 1 + i * 10000000;
        const mglReceived = buyCalc(
          this.totalMGL,
          this.premintedMGL * MGL,
          sellAmount * DAI,
          this.buySlopeMultiplier
        );
        const reserveAddition = sellAmount * DAI * this.reserveRatioDecimal;
        const receivedDai = sellCalc(
          this.totalMGL + mglReceived,
          this.reserveSupply + reserveAddition,
          mglReceived,
          this.burntSupply
        );
        const daiPerMGL = receivedDai / mglReceived;
        data.push(daiPerMGL);
      }
      return data;
    },

    chartLabels(): string[] {
      const data = [];
      data.push("0");
      data.push(this.premintedMGL.toString());
      for (let i = 0; i <= 10; i++) {
        const investAmount = 1 + i * 10000000;
        const mglReceived =
          buyCalc(this.totalMGL, this.premintedMGL * MGL, investAmount * DAI, this.buySlopeMultiplier) /
          MGL;
        data.push(Math.round(mglReceived + this.totalMGL / MGL).toString());
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
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          },
          {
            label: "Sell Curve",
            data: this.sellCurveData,
            fill: true,
            borderColor: "#f87979",
            backgroundColor: "rgba(248,121,121,0.05)",
            lineTension: 0.1
          }
        ]
      };
      return datasets;
    },

    historyChartDataset(): any {
      const datasets = {
        labels: this.historicalEvents,
        datasets: [
          {
            label: "Buy Curve",
            data: this.historicalBuyPrices,
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            lineTension: 0.1
          },
          {
            label: "Sell Curve",
            data: this.historicalSellPrices,
            fill: true,
            borderColor: "#f87979",
            backgroundColor: "rgba(248,121,121,0.05)",
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
header {
  height: 93px;
}
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
