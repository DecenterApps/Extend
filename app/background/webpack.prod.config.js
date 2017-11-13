const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: [
    './app/background/src/index.js'
  ],

  output: {
    filename: 'background.js',
    path: path.join(__dirname, '../../', 'build')
  },

  resolve: {
    extensions: ['.js', '.json'],
    modules: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.(js)?$/,
        loaders: ['babel-loader', 'eslint-loader'],
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src')
      }
    ]
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new UglifyJSPlugin({ parallel: true }),
    new webpack.DefinePlugin({
      'process.env': {
        env: '"production"',
        NODE_ENV: '"production"',
      }
    })
  ]
};
