var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'frontend-dist');
var APP_DIR = path.resolve(__dirname, 'frontend');

var config = {
  mode: 'development',
  entry: ['babel-polyfill', APP_DIR + '/index.js'],
  output: {
    path: BUILD_DIR,
    filename: 'app.js'
  },
  resolve: {
    alias: {
      '~': APP_DIR
    }
  },
  module : {
    rules : [
      {
        test : /\.js/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-1'],
          plugins: ['react-require'],
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[local]-[hash:base64:5]!postcss-loader',
        exclude: [/node_modules/],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: [/node_modules/],
      },
      {
        test: /\.(png|svg|eot|woff2?|ttf)/,
        loader: 'url-loader?limit=5000&publicPath=/static/',
      },
    ]
  }
}

module.exports = config
