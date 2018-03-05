const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');


const config = {
  devServer: {
    clientLogLevel: 'info',
    contentBase: path.join(__dirname, 'build'),
    historyApiFallback: true,
    overlay: {
      errors: true,
      warnings: false,
    },
    port: 3000,
    publicPath: '/',
    stats: {
      modules: false,
      chunks: false,
    },
  },
  devtool: 'cheap-module-source-map',
  entry: path.join(__dirname, 'src', 'index.js'),
  externals: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './src/index.html',
    }),
    new CopyWebpackPlugin([
      {
        from: '../neural-net/model.bin',
        to: path.join(__dirname, 'build'),
      },
    ]),
  ],
  watchOptions: {
    ignored: /build/,
  },
};


module.exports = config;
