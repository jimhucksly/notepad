'use strict'

process.env.BABEL_ENV = 'main'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
process.env.CHUNKS_LOG = 'true'

const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/index.js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 2,
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
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, '../src')
    },
    extensions: ['.vue', '.ts', '.js', ]
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist')
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  if(!mainConfig.plugins) {
    mainConfig.plugins = []
  }
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
  mainConfig.plugins.push(
    new ESLintPlugin({
      extensions: ['vue', 'js', 'ts'],
      formatter: require('eslint-formatter-friendly')
    })
  )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  if(!mainConfig.plugins) {
    mainConfig.plugins = []
  }
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig
