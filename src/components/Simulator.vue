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
                      <li v-for="option in segmentedControlOptions" v-bind:key="option.value" :style="option.value === investSelected ? activeStyle : ''" @click="selectInvest(option.value)">{{option.label}}</li>
                    </ul>
                    <button class="common" @click="invest">Invest</button>
                    <HelpIcon class="help-icon" />
                  </div>
                  <label>Millions</label>
                  <div class="input-wrapper" v-if="this.investSelected === 'Custom'">
                    <vue-numeric separator="," class="usd-label" v-model="daiInvestment"></vue-numeric>
                    <span>USD</span>
                  </div>
              </div>
            </div>
            <div class="item">
              <h3><strong>Sell</strong></h3>
              <div class="wrapper">
                <div class="form-wrapper">
                  <ul class="segmented-control">
                    <li v-for="option in segmentedControlOptions" v-bind:key="option.value" :style="option.value === sellSelected ? activeStyle : ''" v-bind:class="{ active: option.selected }" @click="selectSell(option.value)">{{option.label}}</li>
                  </ul>
                  <button class="common" @click="sell" v-if={}>Sell</button>
                  <HelpIcon class="help-icon" />
                </div>
                  <label>Millions</label>
                  <div class="input-wrapper" v-if="this.sellSelected === 'Custom'">
                    <vue-numeric separator="," class="mgl-label" v-model="mglSold"></vue-numeric>
                    <span>MGL</span>
                  </div>
              </div>
            </div>
            <div class="item">
              <h3><strong>Pay dividend</strong></h3>
              <div class="wrapper">
                <div class="form-wrapper">
                  <ul class="segmented-control">
                    <li v-for="option in segmentedControlOptions" v-bind:key="option.value" :style="option.value === paySelected ? activeStyle : ''" @click="selectPay(option.value)">{{option.label}}</li>
                  </ul>
                  <button class="common" @click="payDividend">Pay</button>
                  <HelpIcon class="help-icon" />
                </div>
                  <label>Millions</label>
                  <div class="input-wrapper" v-if="this.paySelected === 'Custom'">
                    <vue-numeric separator="," class="usd-label" v-model="dividendPaid"></vue-numeric>
                    <span>USD</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="chart-wrapper">
        <apexchart width=100% height=100% type="area" :series="historyChartDataset" :options="historyChartOptions" />
        <div class="overlay" v-bind:class="{ hidden: !settingsExpanded }"></div>
        <section class="administration-wrapper" v-bind:class="{ visible: settingsExpanded }">
          <h2>Parameter settings</h2>
          <ul class="parameters-wrapper">
            <li class="level">
              <label class="level-left">MGL</label>
              <div class="level-right inputs">
                <vue-numeric size="10" separator="," v-model="premintedMGL"></vue-numeric>
                <span class="premintedMGL">%</span>
              </div>
            </li>
            <li class="level">
              <label class="level-left">Initial USD Investment</label>
              <div class="level-right inputs">
                <vue-numeric size="10" separator="," v-model="initialDAIInvestment"></vue-numeric>
                <span class="initialDAIInvestment">%</span>
              </div>
            </li>
            <li class="level">
              <label class="level-left">Reserve ratio</label>
              <div class="level-right inputs">
                <vue-numeric size="10" separator="," v-model="reserveRatio"></vue-numeric>
                <span class="reserveRatio">%</span>
              </div>
            </li>
            <li class="level">
              <label class="level-left">Buy slope multiplier</label>
              <div class="level-right inputs">
                <vue-numeric size="10" separator="," v-model="buySlopeMultiplier"></vue-numeric>
                <span class="buySlopeMultiplier">%</span>
              </div>
            </li>
            <li class="level">
              <label class="level-left">Commission</label>
              <div class="level-right inputs">
                <vue-numeric size="10" separator="," v-model="commission"></vue-numeric>
                <span class="commission">%</span>
              </div>
            </li>
          </ul>
          <div class="param-actions-wrapper">
            <button class="primary" @click="start">Start</button>
            <button class="secondary" @click="close">Close</button>
            <button class="secondary" @click="reset">Reset</button>
          </div>
        </section>
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
          <p>${{HRTotalDAIInvested.toFixed(0).toLocaleString()}}M</p>
          <p>${{HRInvestmentFund.toFixed(1).toLocaleString()}}M</p>
        </div>
      </div>
    </section>
  </footer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import numeral from "numeral";
import VueNumeric from 'vue-numeric';
import VueApexCharts from 'vue-apexcharts';
// svg graphics
import MogulLogo from "../assets/svg/mogul-logo.svg?inline";
import HelpIcon from "../assets/svg/question-mark.svg?inline";
import LineGraphic from "../assets/svg/simulate/line.svg?inline";
import LineWideGraphic from "../assets/svg/simulate/line-wide.svg?inline";
import PlayIcon from "../assets/svg/simulate/play.svg?inline";
import SettingsIcon from "../assets/svg/settings.svg?inline";
import MogulLogoSmall from "../assets/svg/mogul-logo-small.svg?inline";

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

Vue.component('apexchart', VueApexCharts)

export default Vue.extend({
  name: "Simulator",
  components: {
    VueApexCharts,
    MogulLogo,
    HelpIcon,
    LineGraphic,
    LineWideGraphic,
    PlayIcon,
    SettingsIcon,
    VueNumeric,
    MogulLogoSmall
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
      buySlopeMultiplier: 4,
      investmentFund: 0,
      premintedMGL: 36000000,
      initialDAIInvestment: 3000000,
      daiInvestment: 1000000,
      mglSold: 1000000,
      dividendPaid: 1000000,
      dividendRatio: 20,
      historicalEvents: new Array<string>(),
      tooltipData: new Array<string>(),
      investmentFundEvents: new Array<string>(),
      totalDAIInvestedEvents: new Array<string>(),
      totalMGLEvents: new Array<string>(),
      reserveSupplyEvents: new Array<string>(),
      historicalSellPrices: new Array<string>(),
      historicalBuyPrices: new Array<string>(),
      commissionBalance: 0,
      commission: 2,
      isOrganisationClosed: false,
      settingsExpanded: true,
      investSelected: 1,
      sellSelected: 1,
      paySelected: 1
    };
  },
  methods: {
    customTooltip({series, dataPointIndex, xaxis, w}): any {
      return (
        `<div class='tooltip-wrapper'>
          <div class='tooltip-header'>
            <img src="../assets/svg/mogul-logo-small.svg" />
            ${this.tooltipData[dataPointIndex]}
          </div>
          <ul class="tooltip-content">
            <li>
              <div>Buy: <strong class="buy">$${series[0][dataPointIndex]}</strong></div>
              <div>Sell: <strong class="sell">$${series[1][dataPointIndex]}</strong></div>
            </li>
            <li>
              <div>MOGL Outstanding: <strong>${this.InvestmentFundEvents[dataPointIndex]}</strong></div>
              <div>Total Invested: <strong>${this.totalDAIInvestedEvents[dataPointIndex]}</strong></div>
            </li>
            <li>
              <div>MGL in Circulation: <strong>${this.totalMGLEvents[dataPointIndex]}</strong></div>
              <div>Liquidity Pool: <strong>${this.reserveSupplyEvents[dataPointIndex]}</strong></div>
            </li>
          </ul>
        </div>`
      )
    },
    toggleSettings(): void {
      this.settingsExpanded = !this.settingsExpanded;
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
      this.tooltipData = new Array<string>();
      this.InvestmentFundEvents = new Array<string>();
      this.totalDAIInvestedEvents = new Array<string>();
      this.totalMGLEvents = new Array<string>();
      this.reserveSupplyEvents = new Array<string>();
      this.historicalSellPrices = new Array<string>();
      this.historicalBuyPrices = new Array<string>();
      this.historicalSellPrices.push(`0`);
      this.historicalBuyPrices.push(`0`);
      this.InvestmentFundEvents.push('$0');
      this.totalDAIInvestedEvents.push('$0');
      this.totalMGLEvents.push('0');
      this.reserveSupplyEvents.push('$0');
      this.historicalEvents.push('Series A');
      this.tooltipData.push('Series A');
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toFixed(3).toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toFixed(3).toString());
      this.historicalEvents.push(`Invested $${(this.initialDAIInvestment / 1000000).toFixed(1)}M`);
      this.tooltipData.push(`Invested <strong>$${(this.initialDAIInvestment / 1000000).toFixed(1)}M</strong>`);
      this.InvestmentFundEvents.push(`$${this.HRInvestmentFund.toFixed(1).toLocaleString()}M`);
      this.totalDAIInvestedEvents.push(`$${this.HRTotalDAIInvested.toFixed(1).toLocaleString()}M`);
      this.totalMGLEvents.push(`${this.HRTotalMGL.toLocaleString()}`);
      this.reserveSupplyEvents.push(`$${this.HRReserveSupply.toLocaleString()}`);
      this.settingsExpanded = false;
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
      const commissionMgl = mglMinted * this.commission / 100;
      this.totalMGL += commissionMgl;
      this.commissionBalance += commissionMgl;

      const investmentNumeral = numeral(this.daiInvestment).format("0.0A");
      this.historicalEvents.push(`Invested $${(this.daiInvestment / 1000000).toFixed(1)}M`);
      this.tooltipData.push(`Invested <strong>$${(this.daiInvestment / 1000000).toFixed(1)}M</strong>`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toFixed(3).toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toFixed(3).toString());
      this.InvestmentFundEvents.push(`$${this.HRInvestmentFund.toFixed(1).toLocaleString()}M`);
      this.totalDAIInvestedEvents.push(`$${this.HRTotalDAIInvested.toFixed(1).toLocaleString()}M`);
      this.totalMGLEvents.push(`${this.HRTotalMGL.toLocaleString()}`);
      this.reserveSupplyEvents.push(`$${this.HRReserveSupply.toLocaleString()}`);
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

      this.historicalEvents.push(`Sold ${(this.mglSold / 1000000).toFixed(1)}M MGL`);
      this.tooltipData.push(`Sold <strong>${(this.mglSold / 1000000).toFixed(1)}M MGL</strong>`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toFixed(3).toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toFixed(3).toString());
      this.InvestmentFundEvents.push(`$${this.HRInvestmentFund.toFixed(1).toLocaleString()}M`);
      this.totalDAIInvestedEvents.push(`$${this.HRTotalDAIInvested.toFixed(1).toLocaleString()}M`);
      this.totalMGLEvents.push(`${this.HRTotalMGL.toLocaleString()}`);
      this.reserveSupplyEvents.push(`$${this.HRReserveSupply.toLocaleString()}`);
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

      this.historicalEvents.push(`Paid dividend of $${(this.dividendPaid / 1000000).toFixed(1)}M`);
      this.tooltipData.push(`Paid dividend of <strong>$${(this.dividendPaid / 1000000).toFixed(1)}M</strong>`);
      this.historicalSellPrices.push(this.HRSellDAIPerMGL.toFixed(3).toString());
      this.historicalBuyPrices.push(this.HRBuyDAIPerMGL.toFixed(3).toString());
      this.InvestmentFundEvents.push(`$${this.HRInvestmentFund.toFixed(1).toLocaleString()}M`);
      this.totalDAIInvestedEvents.push(`$${this.HRTotalDAIInvested.toFixed(1).toLocaleString()}M`);
      this.totalMGLEvents.push(`${this.HRTotalMGL.toLocaleString()}`);
      this.reserveSupplyEvents.push(`$${this.HRReserveSupply.toLocaleString()}`);
    },

    reset(): void {
      this.totalMGL = 0;
      this.totalDAI = 0;
      this.totalDaiInvested = 0;
      this.reserveSupply = 0;
      this.investmentFund = 0;
      this.premintedMGL = 60000000;
      this.initialDAIInvestment = 3000000;
      this.daiInvestment = 1000000;
      this.mglSold = 1000000;
      this.dividendPaid = 1000000;
      this.commissionBalance = 0;
      this.mglToBurn = 0;
      this.burntSupply = 0;
      this.dividendRatio = 20;
      this.tooltipData = new Array<string>();
      this.historicalEvents = new Array<string>();
      this.InvestmentFundEvents = new Array<string>();
      this.totalDAIInvestedEvents = new Array<string>();
      this.totalMGLEvents = new Array<string>();
      this.reserveSupplyEvents = new Array<string>();
      this.historicalSellPrices = new Array<string>();
      this.historicalBuyPrices = new Array<string>();
    },
    selectInvest(value: any): void {
      if (value !== 'Custom') {
        this.daiInvestment = value*1000000;
      }
      this.investSelected = value;
    },
    selectSell(value: any): void {
      if (value !== 'Custom') {
        this.mglSold = value*1000000;
      }
      this.sellSelected = value;
    },
    selectPay(value: any): void {
      if (value !== 'Custom') {
        this.dividendPaid = value*1000000;
      }
      this.paySelected = value;
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
      return this.totalDaiInvested / DAI / 1000000;
    },

    HRReserveSupply(): number {
      return this.reserveSupply / DAI;
    },

    HRInvestmentFund(): number {
      return this.investmentFund / DAI / 1000000;
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
    historyChartDataset(): any {
      const datasets = [
        {
          name: 'Buy',
          type: 'area',
          data: this.historicalBuyPrices
        },
        {
          name: 'Sell',
          type: 'line',
          data: this.historicalSellPrices
        }
      ];
      return datasets;
    },
    historyChartOptions(): any {
      return {
            dataLabels: {
            enabled: true,
            enabledOnSeries: undefined,
            formatter: function (value:any) {
                return `$${value}`
            },
            textAnchor: 'middle',
            style: {
                fontSize: '13px',
                fontFamily: 'Lato',
                colors: undefined
            },
            dropShadow: {
                enabled: true,
                top: 1,
                left: 1,
                blur: 1,
                opacity: 0.05
            }
        },
        colors: ['#64B7F4','#71D69B'],
        theme: {
          mode: 'dark'
        },
        fill: {
          type: 'gradient',
            gradient: {
              shadeIntensity: 0,
              opacityFrom: 0.6,
              opacityTo: 0,
              gradientToColors: ['#71D69B'],
              stops: [0, 90, 100]
            }
        },
        tooltip: {
          followCursor: true,
          custom: this.customTooltip
        },
        chart: {
          id: 'curve-chart',
          background: '#1E1E1E',
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
          },
          fontFamily: 'Lato',
          foreColor: '#8B8B8B',
          toolbar: {
            show: false
          }
        },
        grid: {
          show: true,
          borderColor: '#31312F',
          strokeDashArray: 1,
          yaxis: {
            lines: {
              show: true
            }
          },
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        xaxis: {
          categories: this.historicalEvents,
          hideOverlappingLabels: true,
          axisBorder: {
            show: false
          },
          labels: {
            style: {
              color: '#8B8B8B',
              fontSize: '14px',
              fontFamily: 'Lato'
            }
          },
          tooltip: {
            enabled: false
          },
          crosshairs: {
            show: true,
            width: 1,
            position: 'back',
            opacity: 0.2,        
            stroke: {
              color: '#7B7B7B',
              width: 1,
              dashArray: 4
            }
          },
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          labels: {
            formatter: (value:any) => ( `$${value.toFixed(2)}` ),
            style: {
              color: '#8B8B8B',
              fontSize: '14px',
              fontFamily: 'Lato'
            }
          }
        },
        markers: {
          size: 6,
          colors: undefined,
          fillOpacity: 1,
          strokeWidth: 0,
          discrete: [],
          shape: "circle",
          radius: 11,
          offsetX: 0,
          offsetY: 0,
          onClick: undefined,
          onDblClick: undefined,
          hover: {
            sizeOffset: 1
          }
        },
        stroke: {
          show: true,
          curve: 'straight',
          lineCap: 'butt',
          width: 5
        },
        legend: {
          show: false
        }
      }
    },
    activeStyle() {
      return 'background: #2b2b2b;font-weight: 700;';
    },
    segmentedControlOptions(): any {
      return {
        1: { label: 1, value: 1 },
        5: { label: 5, value: 5 },
        10: { label: 10, value: 10 },
        'Custom': { label: 'Custom', value: 'Custom' }
      }
    }
  }
});
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato:300,400,700,700i&display=swap');

$accent: #DBA628;
$accent-lighten-10: #EBBA47;
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
  background: #171716;
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
    background: #171716;
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
      margin-bottom: 35px;
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
              cursor: pointer;
              &:not(:last-of-type) {
                border-right: 1px solid #2b2b2b;
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
            box-shadow: 0 4px 10px rgba(219, 166, 44, 0.2);
            transition: all 0.2s ease-out;
            &:hover {
              background: $accent-lighten-10;
              box-shadow: 0 4px 15px rgba(219, 166, 44, 0.2);
            }
          }
        }
        label {
          font-size: 12px;
          font-weight: 400;
          color: #A4A4A4;
          margin: 7px 0 18px 80px;
        }
        .input-wrapper {
          position: relative;
          span {
            position: absolute;
            top: 6px;
            left: 10px;
            color: #565656;
            font-size: 16px;
          }
        }
        input {
          font-family: Lato;
          background: transparent;
          border: 1px solid #2B2B2B;
          padding: 8px 13px 8px 50px;
          text-align: right;  
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
  overflow: hidden;
  padding: 100px;
  > div {
    display: flex;
    flex: 1 0 80%;
    align-self: center;
  }
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
    transition: all 0.7s cubic-bezier(.85,.01,.38,1);
    z-index: 20;
    &.visible {
      right: 0;
    }
    h2 {
      font-size: 16px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 50px;
    }
    ul {
      display: flex;
      flex-direction: column;
      flex-basis: 100%;
      li {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: flex-end;
        margin-bottom: 50px;
        label {
          font-size: 16px;
        }
        .inputs {
          justify-content: flex-end;
          display: flex;
          align-items: flex-end;
        }
        input {
          width: auto;
          font-family: Lato;
          font-weight: 700;
          padding: 7px 7px 3px;
          color: $accent;
          text-align: right;
          background: #191818;
          display: flex;
          flex: 0 1 auto;
          font-size: 16px;
          border: none;
          outline: none;
          transition: color 0.3s ease-out;
          align-self: flex-end;
          &:focus, &:hover {
            color: $accent-lighten-10;
          }
        }
        span {
          font-size: 16px;
          margin-left: -4px;
          color: $accent;
          font-weight: 700;
          display: flex;
          flex: 0 0 auto;
        }
        span.premintedMGL, span.initialDAIInvestment, span.buySlopeMultiplier {
          display: none;
        }
      }
    }
    .param-actions-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
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
        box-shadow: 0 4px 10px rgba(219, 166, 44, 0.2);
        transition: all 0.2s ease-out;
        &:hover {
          background: $accent-lighten-10;
          box-shadow: 0 4px 15px rgba(219, 166, 44, 0.2);
        }
      }
      button.secondary {
        background: #191818;
        border: 2px solid $accent;
        color: $accent;
        &:hover {
          background: #191818;
          border-color: $accent-lighten-10;
        }
      }
      button:last-of-type {
        margin-right: 0;
      }
    }
  }
  .settings {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 21;
    cursor: pointer;
    &.active path, &:hover path {
      fill: white;
    }
  }
}

.apexcharts-marker {
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, .33));
}

.apexcharts-series path {
  filter: drop-shadow(0 0 21px rgba(40, 114, 219, .53));
}

.apexcharts-series path {
  filter: drop-shadow(0 0 21px rgba(113, 214, 155, .53));
}

.apexcharts-tooltip.dark {
  box-shadow: 0 2px 14px 0 rgba(0, 0, 0, .12);
  background: none;
  min-width: 260px;
  .tooltip-wrapper {
    border-radius: 7px;
    overflow: hidden;
    .tooltip-header {
      background: rgba(0, 0, 0, .80);
      padding: 15px 20px;
      line-height: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        margin-right: 7px;
      }
      strong {
        color: $accent;
        margin-left: 4px;
      }
    }
    .tooltip-content {
      padding: 12px 20px;
      background: rgba(20, 20, 20, .93);
      color: #A6A6A6;
      li:not(:last-of-type) {
        padding-bottom: 9px;
        position: relative;
        margin-bottom: 9px;
        &:after {
          content: '';
          height: 1px;
          width: 12px;
          background: #2F2F2F;
          position: absolute;
          left: 0;
          bottom: 0;
        }
      }
      strong {
        color: white;
        font-weight: 700;
      }
      .buy {
        color: $primary;
      }
      .sell {
        color: $secondary;
      }
    }
  }
}
</style>
