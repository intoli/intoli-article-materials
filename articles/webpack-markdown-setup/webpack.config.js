const path = require('path');

const highlight = require('highlight.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');


const isProduction = process.env.NODE_ENV === 'production';

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
          {
            loader: 'style-loader',
            options: {
              sourceMap: !isProduction,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 0,
              sourceMap: !isProduction,
            },
          },
        ],
      },
      {
        test: /\.(md)$/,
        use: [
          'html-loader',
          {
            loader: 'markdown-loader',
            options: {
              highlight: (code, lang) => {
                if (!lang || ['text', 'literal', 'nohighlight'].includes(lang)) {
                  return `<pre class="hljs">${code}</pre>`;
                }
                const html = highlight.highlight(lang, code).value;
                return `<span class="hljs">${html}</span>`;
              },
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
  ],
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  watchOptions: {
    ignored: /build/,
  },
};


module.exports = config;
