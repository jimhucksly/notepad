'use strict'

process.env.BABEL_ENV = 'renderer'
process.env.CHUNKS_LOG = 'false'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

let rendererConfig = {
  devtool: '#cheap-module-eval-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/main.ts')
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: process.env.NODE_ENV === 'production',
          loaders: {
            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax=1',
            scss: 'vue-style-loader!css-loader!sass-loader',
            less: 'vue-style-loader!css-loader!less-loader'
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        include: [
          path.resolve(__dirname, '../src'),
          path.resolve(__dirname, '../test')
        ],
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length - 1,
              poolTimeout: Infinity
            }
          },
          {
            loader: 'ts-loader',
            options: {
              appendTsSuffixTo: [/\.vue$/],
              transpileOnly: true,
              happyPackMode: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'styles.css'}),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      isBrowser: false,
      isDevelopment,
      nodeModules: isDevelopment
        ? path.resolve(__dirname, '../node_modules')
        : false
    }),
    new ESLintPlugin({
      extensions: ['vue', 'js', 'ts'],
      formatter: require('eslint-formatter-friendly')
    }),
    new ProgressPlugin({
      modules: true, modulesCount: 3000
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          syntactic: false,
          semantic: true,
          declaration: false,
          global: false
        }
      },
      eslint: {
        files: './src/**/*.{ts,tsx,js}'
      }
    })
  ],
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, '../src'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.vue', '.ts', '.js', ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          warnings: false,
          mangle: true,
          output: {
            comments: false,
            beautify: false,
          },
          toplevel: true,
          nameCache: null,
          ie8: false,
          keep_classnames: true,
          keep_fnames: true,
          safari10: false,
          unsafe: true,
          inline: true,
          passes: 2,
          keep_fargs: false,
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true
          }
        }
      })
    ]
  },
  target: 'electron-renderer'
}

/**
 * Adjust rendererConfig for development settings
 */
if (isDevelopment) {
  rendererConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`,
    })
  )
  rendererConfig.plugins.push(
    new webpack.ProgressPlugin({ modules: true, modulesCount: 3000 })
  )
}

/**
 * Adjust rendererConfig for production settings
 */
if (isProduction) {
  rendererConfig.devtool = ''
  rendererConfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(__dirname, '../static'),
          to: path.join(__dirname, '../dist/static'),
          globOptions: {
            ignore: ['.*']
          }
        }
      ]
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = rendererConfig
