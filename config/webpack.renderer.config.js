'use strict'

process.env.BABEL_ENV = 'renderer'

const path = require('path')
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
  devtool: 'eval-cheap-module-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/main.ts')
  },
  externals: {
    vue: 'Vue',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: isProduction,
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
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: ['\\.vue$'],
          transpileOnly: isDevelopment,
          happyPackMode: isDevelopment
        }
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
      }
    ]
  },
  node: {
    __dirname: isDevelopment,
    __filename: isDevelopment
  },
  stats: {
    preset: 'normal'
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({filename: 'styles.css'}),
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
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets/images',
          to: './assets/images',
        },
        {
          from: 'src/assets/fonts',
          to: './assets/fonts',
        },
        {
          from: 'src/assets/images/icon.ico',
          to: './icon.ico',
        }
      ]
    })
  ],
  output: {
    filename: '[name].js',
    path: path.join(__dirname, '../dist')
  },
  resolve: {
    alias: {
      '~': path.join(__dirname, '../src'),
      'vue$': 'vue/dist/vue.esm-bundler.js'
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

if (isDevelopment) {
  rendererConfig.plugins.push(
    new webpack.ProgressPlugin({ modules: true, modulesCount: 3000 })
  )
}

module.exports = rendererConfig
