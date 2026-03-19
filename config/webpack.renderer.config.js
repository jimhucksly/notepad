process.env.BABEL_ENV = 'renderer'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const ESLintPlugin = require('eslint-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { minimizer } = require('./minimizer.js');
const { endpoint, port } = require('./endpoint.json')

const isProduction = process.env.NODE_ENV === 'production'
const isDevelopment = !isProduction

let rendererConfig = {
  devtool: 'eval-cheap-module-source-map',
  entry: {
    renderer: path.join(__dirname, '../src/main.ts')
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
          happyPackMode: isDevelopment,
          compilerOptions: {
            noImplicitAny: isDevelopment,
          }
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
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
            }
          }
        ]
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
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 4096,
        vue: true,
        diagnosticOptions: {
          syntactic: true,
          semantic: true,
          declaration: false,
          global: false
        }
      },
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
        },
        {
          from: 'src/manifest.json',
          to: './manifest.json'
        }
      ]
    }),
    new webpack.DefinePlugin(
      {
        '__VUE_OPTIONS_API__': true,
        '__VUE_PROD_DEVTOOLS__': false,
        "$DEV": isDevelopment,
        '$ENDPOINT': `"${endpoint}"`,
        "$PORT": `"${port}"`
      }
    ),
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
      minimizer
    ],
  },
  target: 'electron-renderer'
}

if (isDevelopment) {
  rendererConfig.plugins.push(
    new webpack.ProgressPlugin({ modules: true, modulesCount: 3000 })
  )
}

module.exports = rendererConfig
