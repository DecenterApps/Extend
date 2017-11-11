const path = require('path');

module.exports = {
  entry: [
    './app/background/src/index.js'
  ],
  devtool: 'inline-source-map',
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
  }
};
