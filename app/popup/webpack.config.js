const path = require('path');

module.exports = {

  entry: [
    './app/popup/src/index.js'
  ],

  output: {
    filename: 'popup.js',
    path: path.join(__dirname, '../../', 'build'),
    publicPath: '/'
  },

  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.json'],
    modules: ['node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.(jsx|js)?$/,
        loaders: ['babel-loader', 'eslint-loader'],
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src')
      }
    ]
  }
};
