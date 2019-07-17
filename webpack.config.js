const webpack = require("webpack");
const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const publicPath = path.resolve(__dirname, "public");
const isDev = process.env.NODE_ENV !== "production";

module.exports = {
  output: {
    path: publicPath,
    publicPath: "/",
    filename: isDev ? "[name].js" : "[hash:5].[name].js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.ejs$/,
        loader: "ejs-loader"
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.s?css$/,
        use: [
          process.env.NODE_ENV !== "production"
            ? "style-loader"
            : MiniCssExtractPlugin.loader, // creates style nodes from JS strings
          {
            // translates CSS into CommonJS
            loader: "css-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production"
            }
          },
          {
            // compiles Sass to CSS, using Node Sass by default
            loader: "sass-loader",
            options: {
              sourceMap: process.env.NODE_ENV !== "production"
            }
          }
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.ejs",
      filename: "./index.html",
      title: "webpack-title"
    }),
    new MiniCssExtractPlugin({
      filename: isDev ? "[name].css" : "[hash:5].[name].css",
      chunkFilename: isDev ? "[id].css" : "[hash:5].[id].css"
    }),
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ]
};
