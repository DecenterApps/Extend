const path = require('path');

module.exports = {

  entry: [
    './app/page/src/index.js'
  ],

  output: {
    filename: 'page.js',
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
