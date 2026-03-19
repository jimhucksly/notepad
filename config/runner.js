const chalk = require('chalk')
const electron = require('electron')
const path = require('path')
const { spawn } = require('child_process')
const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const mainConfig = require('./webpack.main.config')
const rendererConfig = require('./webpack.renderer.config')

const { port } = require('./endpoint.json')

delete mainConfig.optimization
delete rendererConfig.optimization

let electronProcess = null
let manualRestart = false

function startMain () {
  return new Promise((resolve, reject) => {
    mainConfig.mode = 'development'

    const compiler = webpack(mainConfig)

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      if (electronProcess && electronProcess.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        }, 5000)
      }

      resolve()
    })
  })
}

function startRenderer () {
  return new Promise((resolve, reject) => {
    rendererConfig.mode = 'development'

    const compiler = webpack(rendererConfig)

    compiler.hooks.done.tap('done', stats => {
      //
    })

    const server = new WebpackDevServer(
      {
        port,
        host: 'localhost',
        historyApiFallback: true,
        devMiddleware: {
          writeToDisk: true,
        },
      },
      compiler
    )

    server.start()

    resolve()
  })
}

function startElectron () {
  let args = [
    path.join(__dirname, '../dist/main.js')
  ]

  if (process.env.npm_execpath.endsWith('yarn.js')) {
    args = args.concat(process.argv.slice(3))
  } else if (process.env.npm_execpath.endsWith('npm-cli.js')) {
    args = args.concat(process.argv.slice(2))
  }

  electronProcess = spawn(electron, args)

  electronProcess.stdout.on('data', data => {
    electronLog(data, 'blue')
  })
  electronProcess.stderr.on('data', data => {
    electronLog(data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) {
      process.exit()
    }
  })
}

function electronLog (data, color) {
  let log = ''
  data = data.toString().split(/\r?\n/)
  data.forEach(line => {
    log += `  ${line}\n`
  })
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('Electron -------------------') +
      '\n\n' +
      log +
      chalk[color].bold('----------------------------') +
      '\n'
    )
  }
}

function init () {
  Promise
    .all([startRenderer(), startMain()])
    .then(() => {
      // console.log(chalk.green('app is sucessfully running') + '\n')
      startElectron()
    })
    .catch(err => {
      console.error(err)
    })
}

init()
