'use strict'

process.env.BABEL_ENV = 'main'
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true'

const path = require('path')
const webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

let mainConfig = {
  entry: {
    main: path.join(__dirname, './process.js')
  },
  node: {
    __dirname: isDevelopment,
    __filename: isDevelopment
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, '../src')
    },
    extensions: ['.vue', '.ts', '.js', ]
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist')
  },
  plugins: [],
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

if (isDevelopment) {
  mainConfig.plugins.push(
    new ESLintPlugin({
      extensions: ['vue', 'js', 'ts'],
      formatter: require('eslint-formatter-friendly')
    })
  )
}

module.exports = mainConfig
