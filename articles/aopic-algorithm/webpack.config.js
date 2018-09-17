const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');


const config = {
  devServer: {
    clientLogLevel: 'info',
    contentBase: './public',
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
  entry: path.resolve(__dirname, 'src', 'index.jsx'),
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
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              camelCase: true,
              modules: true,
            },
          },
        ],
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
    ...(process.env.NODE_ENV === 'production' ? [new UglifyJSWebpackPlugin()] : []),
  ],
  resolve: {
    modules: ['./src', './node_modules'],
    extensions: [
      '.js',
      '.jsx',
      '.react.js',
    ],
  },
  watchOptions: {
    ignored: /build/,
  },
};


module.exports = config;
