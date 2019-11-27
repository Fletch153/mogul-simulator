"use strict";
const { VueLoaderPlugin } = require("vue-loader");
module.exports = {
  mode: "development",
  entry: ["./src/main.ts"],
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.less$/,
        use: ["vue-style-loader", "css-loader", "less-loader"]
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
};
