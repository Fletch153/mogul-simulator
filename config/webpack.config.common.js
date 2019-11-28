'use strict';

const VueLoaderPlugin      = require('vue-loader/lib/plugin');
const HtmlPlugin           = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const helpers              = require('./helpers');
const isDev                = process.env.NODE_ENV === 'development';

const webpackConfig = {
  entry: {
    polyfill: "@babel/polyfill",
    main: helpers.root("src", "main.ts")
  },
  resolve: {
    extensions: [".js", ".vue", ".ts", ".tsx"],
    alias: {
      vue$: isDev ? "vue/dist/vue.runtime.js" : "vue/dist/vue.runtime.min.js",
      "@": helpers.root("src")
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        include: [helpers.root("src")],
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: "vue-loader",
        include: [helpers.root("src"), /node_modules/],
        options: {
          appendTsSuffixTo: [/\.ts$/]
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
        include: [helpers.root("src")]
      },
      {
        test: /\.css$/,
        use: [
          isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: isDev } }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: isDev } },
          { loader: "sass-loader", options: { sourceMap: isDev } }
        ]
      },
      {
        test: /\.sass$/,
        use: [
          isDev ? "vue-style-loader" : MiniCSSExtractPlugin.loader,
          { loader: "css-loader", options: { sourceMap: isDev } },
          { loader: "sass-loader", options: { sourceMap: isDev } }
        ]
      },
      {
        test: /\.svg$/,
        oneOf: [
          {
            resourceQuery: /inline/,
            use: ["babel-loader", "vue-svg-loader"]
          },
          {
            loader: "file-loader",
            query: {
              name: "assets/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlPlugin({ template: "index.html", chunksSortMode: "dependency" })
  ]
};

module.exports = webpackConfig;
