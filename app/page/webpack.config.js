const path = require('path');
const webpack = require('webpack');
const { generateScopedName } = require('../modules/buildTools');

const context = path.join(__dirname, '../');

module.exports = {
  entry: [
    './app/page/src/index.js'
  ],
  devtool: 'inline-source-map',
  output: {
    filename: 'page.js',
    path: path.join(__dirname, '../../', 'build'),
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, '../', 'actions'),
          path.join(__dirname, '../', 'commonComponents'),
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
        include: path.join(__dirname, '../'),
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
  plugins: [
    new webpack.DefinePlugin({
      process: { env: '"development"' }
    })
  ]
};

