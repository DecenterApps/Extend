const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { generateScopedName } = require('../buildTools');

const context = path.join(__dirname, 'src');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/popup/src/index.html',
  filename: 'popup.html',
  inject: 'body'
});


module.exports = {
  entry: [
    './app/popup/src/index.js'
  ],
  devtool: 'inline-source-map',
  output: {
    filename: 'popup.js',
    path: path.join(__dirname, '../../', 'build'),
    publicPath: './'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, '../', 'actions'),
          path.join(__dirname, '../', 'customRedux'),
          path.join(__dirname, '../background/src/', 'reducers'),
        ],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              babelrc: false,
              presets: ['es2015', 'react'],
              plugins: [
                'transform-object-rest-spread',
                'transform-react-jsx',
                [
                  'react-css-modules',
                  {
                    context,
                    filetypes: {
                      '.scss': {
                        syntax: 'postcss-scss'
                      }
                    },
                    generateScopedName
                  }
                ]
              ]
            }
          },
          { loader: 'eslint-loader' }
        ]
      },
      {
        include: path.join(__dirname, 'src'),
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              getLocalIdent: (contextParam, localIdentName, localName) => (
                generateScopedName(localName, contextParam.resourcePath)
              ),
              importLoaders: 2,
              modules: true,
              sourceMap: true
            }
          },
          { loader: 'resolve-url-loader' },
          {
            loader: 'sass-loader',
            options: {
              outputStyle: 'expanded',
              sourceMap: true
            }
          },
          {
            loader: 'autoprefixer-loader',
            options: {
              browsers: 'last 4 version'
            }
          },
        ],
        test: /\.scss?$/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'file-loader?name=[name].[ext]' },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new webpack.DefinePlugin({
      process: { env: '"development"' }
    })
  ]
};
