const path = require('path');
const webpack = require('webpack');

const config = {
  devtool: 'cheap-module-eval-source-map',

  entry: {
    index: './src/index.js'
  },

  output: {
    path:          path.resolve(__dirname, 'dist'),
    filename:      'index.js',
    library:       'deskpro-sdk-react',
    libraryTarget: 'umd'
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: require.resolve('babel-loader')
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  context: path.resolve(__dirname, './')
};

module.exports = config;
