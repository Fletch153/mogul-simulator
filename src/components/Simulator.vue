<template>
  <div class="mogul-corg">

    <!-- HEADER -->
    <header class="level">
      <div class="level-left logo">
        <div class="logo-box"><MogulLogo /></div>
        <div class="heading">
          <h1>Continuous organisation <HelpIcon class="help-header help-icon" /></h1>
          <p>Simulation</p>
        </div>
      </div>
      <div class="level-right simulate-wrapper">
        <LineWideGraphic class="line-graphic line-02" />
        <LineGraphic class="line-graphic line-01" />
        <span>Simulate</span>
        <PlayIcon class="play-icon" />
      </div>
    </header>

    <!-- CONTENT -->
    <main class="main-content">
      <section class="actions-wrapper">
        <div class="actions-list">
          <div class="overall-wrapper">
            <div class="data-item">
              <h2 class="buy">${{HRBuyDAIPerMGL.toFixed(3)}}</h2>
              <label><span>Buy</span> <HelpIcon class="help-icon" /></label>
            </div>
            <div class="data-item">
              <h2 class="sell">${{HRSellDAIPerMGL.toFixed(3)}}</h2>
              <label><span>Sell</span> <HelpIcon class="help-icon" /></label>
            </div>
          </div>
          <div class="actions">
            <div class="item">
              <h3><strong>Invest</strong></h3>
              <div class="wrapper">
                  <div class="form-wrapper">
                    <ul class="segmented-control">
                      <li v-for="option in investOptions" v-bind:key="option.value" v-bind:class="{ active: option.selected }">{{option.label}}</li>
                    </ul>
                    <button class="common">Invest</button>
                    <HelpIcon class="help-icon" />
                  </div>
                  <label>Millions</label>
                  <input class="invest-input" name="invest-input" />
              </div>
            </div>
            <div class="item">
              <h3><strong>Sell</strong></h3>
              <div class="wrapper">
                <div class="form-wrapper">
                  <ul class="segmented-control">
                    <li v-for="option in sellOptions" v-bind:key="option.value" v-bind:class="{ active: option.selected }">{{option.label}}</li>
                  </ul>
                  <button class="common">Sell</button>
                  <HelpIcon class="help-icon" />
                </div>
                  <label>Millions</label>
                  <input class="sell-input" name="sell-input" />
              </div>
            </div>
            <div class="item">
              <h3><strong>Pay dividend</strong></h3>
              <div class="wrapper">
                <div class="form-wrapper">
                  <ul class="segmented-control">
                    <li v-for="option in payOptions" v-bind:key="option.value" v-bind:class="{ active: option.selected }">{{option.label}}</li>
                  </ul>
                  <button class="common">Pay</button>
                  <HelpIcon class="help-icon" />
                </div>
                  <label>Millions</label>
                  <input class="pay-input" name="pay-input" />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="chart-wrapper">
      <div class="overlay" v-bind:class="{ hidden: !settingsExpanded }"></div>
      <section class="administration-wrapper" v-bind:class="{ visible: settingsExpanded }"></section>
      <SettingsIcon class="settings" v-bind:class="{ active: settingsExpanded }" @click="toggleSettings" />
      </section>
    </main>

    <!-- FOOTER -->
  <footer>
    <div class="asterisk">*All prices are in USD/MGL</div>
    <section class="general-details">
      <div class="column-wrapper">
        <div class="labels">
          <label>MGL in Circulation: </label>
          <label>Liquidity pool: </label>
        </div>
        <div class="data-fields">
          <p>{{HRTotalMGL.toLocaleString()}}</p>
          <p>${{HRReserveSupply.toLocaleString()}}</p>
        </div>
      </div>

      <div class="column-wrapper">
        <div class="labels">
          <label>Total invested: </label>
          <label>Investment fund: </label>
        </div>
        <div class="data-fields">
          <p>{{HRTotalDAIInvested.toFixed(0).toLocaleString()}}M</p>
          <p>{{HRInvestmentFund.toFixed(1).toLocaleString()}}M</p>
        </div>
      </div>
    </section>
  </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import numeral from "numeral";
import CurveChart from "./CurveChart.vue";
// svg graphics
import MogulLogo from "../assets/mogul-logo.svg?inline";
import HelpIcon from "../assets/question-mark.svg?inline";
import LineGraphic from "../assets/simulate/line.svg?inline";
import LineWideGraphic from "../assets/simulate/line-wide.svg?inline";
import PlayIcon from "../assets/simulate/play.svg?inline";
import SettingsIcon from "../assets/settings.svg?inline";

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
    MogulLogo,
    HelpIcon,
    LineGraphic,
    LineWideGraphic,
    PlayIcon,
    SettingsIcon
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
      },
      investOptions: [
        { label: 1, value: 1, selected: false },
        { label: 5, value: 5, selected: false },
        { label: 10, value: 10, selected: false },
        { label: 'Custom', value: 'invest', selected: true }
      ],
      sellOptions: [
        { label: 1, value: 1, selected: false },
        { label: 5, value: 5, selected: false },
        { label: 10, value: 10, selected: false },
        { label: 'Custom', value: 'sell', selected: true }
      ],
      payOptions: [
        { label: 1, value: 1, selected: false },
        { label: 5, value: 5, selected: false },
        { label: 10, value: 10, selected: false },
        { label: 'Custom', value: 'pay', selected: true }
      ],
      selectedCustomFields: [] as any,
      investValue: 0,
      sellValue: 0,
      payValue: 0,
      settingsExpanded: true
    };
  },
  methods: {
      toggleSettings(): void {
    if (this.settingsExpanded) {
        this.settingsExpanded = false;
      } else {
        this.settingsExpanded = true;
      }
    },
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
    },
    onSelect(optionsSelected: any) {
        if (optionsSelected.label === 'Custom' && this.selectedCustomFields.indexOf(optionsSelected.value) === -1) {
          this.selectedCustomFields.push(optionsSelected.value)
        }
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

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,700i&display=swap');

$accent: #DBA628;
$primary: #64B7F4;
$secondary: #71D69B;
$label: #696969;

body {
  font-family: Lato;
  background: #1E1E1E;
  color: white;
  margin: 0;
}
header, footer {
  background: #1c1c1b;
}
header {
  height: 93px;
  margin-bottom: 0 !important;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.2);
}
.logo {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.logo-box {
  width: 93px;
  height: 93px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  margin-right: 20px;
}

.heading {
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  h1 {
    font-size: 21px;
    line-height: 21px;
    font-weight: 700;
    margin-bottom: 5px;
  }
  p {
    color: #737373;
    font-size: 20px;
    line-height: 20px;
  }
  .help-header {
    margin-left: 11px;
  }
}

.simulate-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-left: 50px;
  margin-right: 32px;
  height: 93px;
  position: relative;
  cursor: pointer;
    .line-graphic {
    position: absolute;
    left: 0;
    top: 0;
    transition: all 0.3s ease-out;
  }
  &:hover {
    .line-01 {
      left: 120px;
    }
    .line-02 {
      left: 50px;
    }
  }
  span {
    margin-right: 20px;
    z-index: 2;
    text-transform: uppercase;
    color: $accent;
    font-size: 18px;
    font-weight: 700;
  }
  .play-icon {
    z-index: 2;
  }
}

.help-icon {
  cursor: pointer;
  &:hover path {
    transition: all 0.2s ease-out;
    fill: white;
  }
}

footer {
  height: 80px;
  box-shadow: 0 -2px 15px 0 rgba(0, 0, 0, 0.2);
  font-size: 14px;
  position: relative;
  display: flex;
  justify-content: center;
  .general-details {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .asterisk {
    position: absolute;
    left: 28px;
    top: 31px;
    color: $label;
  }
  .column-wrapper {
    display: flex;
    flex-direction: row;
    margin-right: 25px;
    .labels {
      display: flex;
      flex-direction: column;
      color: $label;
      margin-right: 5px;
      text-align: right;
    }
    .data-fields {
      display: flex;
      flex-direction: column;
    }
  }
}

.main-content {
  height: calc(100vh - 173px);
  overflow: hidden;
  display: flex;
  .actions-wrapper {
    max-width: 370px;
    height: 100%;
    padding: 20px;
    background: #191818;
    display: flex;
    overflow: auto;
    .actions-list {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
    }
    .overall-wrapper {
      margin: 15px 0 40px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      .data-item {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        &:not(:last-of-type) {
          margin-right: 15px;
        }
        h2 {
          font-size: 34px;
          line-height: 34px;
          font-weight: 700;
          margin-bottom: 2px; 
          &.buy {
            color: $primary;
          }
          &.sell {
            color: $secondary;
          }
        }
        label {
          text-transform: uppercase;
          color: #656565;
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .help-icon {
          margin-left: 5px;
        }
      }
    }
  }
  .actions {
    display: flex;
    flex-direction: column;
    .item {
      margin-bottom: 45px;
      h3 {
        display: block;
        border-bottom: 1px solid #2D2D2D;
        color: #565656;
        font-size: 14px;
        font-weight: 700;
        text-transform: uppercase;
        position: relative;
        strong {
          background: #191818;
          padding: 8px;
          position: relative;
          bottom: -5px;
          color: #565656;
        }
      }
      .wrapper {
        display: flex;
        flex-direction: column;
        margin-top: 20px;
        .form-wrapper {
          display: flex;
          flex-direction: row;
          align-items: center;
          .segmented-control {
            display: flex;
            flex-direction: row;
            padding: 0;
            list-style-type: none;
            overflow: hidden;
            font-size: 14px;
            font-weight: 700;
            color: white;
            border-radius: 13px;
            border: 1px solid #2B2B2B;
            margin-right: 12px;
            li {
              padding: 8px 16px;
              cursor: not-allowed;
              &:not(:last-of-type) {
                border-right: 1px solid #2b2b2b;
              }
              &.active {
                background: #2b2b2b;
                font-weight: 700;
                cursor: pointer;
              }
            }
          }
          button {
            font-family: Lato;
            background: $accent;
            padding: 7px 0;
            width: 76px;
            color: #1E1C15;
            font-size: 15px;
            font-weight: 700;
            border-radius: 12px;
            border: none;
            cursor: pointer;
            outline: none;
            margin-right: 12px;
            box-shadow: 0 4px 10px rgba(219, 166, 44, 0.3);
            transition: all 0.2s ease-out;
            &:hover {
              background: #EBBA47;
              box-shadow: 0 4px 15px rgba(219, 166, 44, 0.4);
            }
          }
        }
        label {
          font-size: 12px;
          font-weight: 400;
          color: #A4A4A4;
          margin: 7px 0 18px 80px;
        }
        input {
          background: transparent;
          border: 1px solid #2B2B2B;
          padding: 8px 13px;
          color: white;
          font-weight: 700;
          font-size: 15px;
          max-width: 214px;
          border-radius: 4px;
          outline: none;
          transition: all 0.3s ease-out;
          &:hover, &:focus {
            border: 1px solid rgba(219, 166, 44, 0.5);
            box-shadow: 0 0 6px 2px rgba(219, 166, 44, 0.2);
          }
        }
      }
    }
  }
}

.chart-wrapper {
  display: flex;
  flex-grow: 1;
  height: 100%;
  position: relative;
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background: #191818;
    opacity: 0.5;
    transition: all 0.4s ease-out;
    pointer-events: none;
    z-index: 3;
    &.hidden {
      opacity: 0;
    }
  }
  .administration-wrapper {
    position: absolute;
    right: -300px;
    top: 0;
    width: 300px;
    padding: 20px;
    height: 100%;
    background: #191818;
    transition: all 0.6s ease-out;
    z-index: 4;
    &.visible {
      right: 0;
    }
  }
  .settings {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 5;
    cursor: pointer;
    &.active path, &:hover path {
      fill: white;
    }
  }
}

</style>
