const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');


const config = {
  devServer: {
    clientLogLevel: 'info',
    contentBase: './frontend',
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
  ],
  watchOptions: {
    ignored: /build/,
  },
};


module.exports = config;
