const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { createUniqueIdGenerator } = require('../modules/buildTools');

const context = path.join(__dirname, '../');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './app/popup/src/index.html',
  filename: 'popup.html',
  inject: 'body'
});

const uniqueIdGenerator = createUniqueIdGenerator();

const generateScopedName = (localName, resourcePath) => {
  const componentName = resourcePath.split('/').slice(-2, -1);

  return `${uniqueIdGenerator(componentName)}_${uniqueIdGenerator(localName)}`;
};

module.exports = {
  entry: './app/popup/src/index.js',
  output: {
    path: path.join(__dirname, '../../', 'build'),
    filename: 'popup.js',
    chunkFilename: '[chunkhash]-[chunkhash].js',
    publicPath: './'
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, '../', 'actions'),
          path.join(__dirname, '../', 'commonComponents'),
          path.join(__dirname, '../', 'customRedux'),
          path.join(__dirname, '../background/src/', 'reducers'),
        ],
        use: [
          {
            loader: 'babel-loader',
            query: {
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
        ],
        exclude: /node_modules/
      },
      {
        include: [path.join(__dirname, '../')],
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              getLocalIdent: (contextParam, localIdentName, localName) => (
                generateScopedName(localName, contextParam.resourcePath)
              ),
              importLoaders: 1,
              minimize: true,
              modules: true
            }
          },
          { loader: 'resolve-url-loader' },
          { loader: 'sass-loader' },
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
        use: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
              },
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 4,
              },
              pngquant: {
                quality: '75-90',
                speed: 3,
              }
            }
          }
        ]
      },
      { test: /\.(eot|ttf|woff|woff2)$/, loader: 'file-loader?name=[name].[ext]' },
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    HtmlWebpackPluginConfig,
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
