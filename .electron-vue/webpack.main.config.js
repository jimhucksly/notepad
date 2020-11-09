'use strict'

process.env.BABEL_ENV = 'main'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'
process.env.CHUNKS_LOG = 'true'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')
const BabiliWebpackPlugin = require('babili-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
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
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}

module.exports = mainConfig
