function logStats (proc, data) {
  let log = ''
  log += '\n'

  log += chalk.yellow.bold(`${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'

  let p = '\n'
  p += chalk.yellow.bold(`${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  p += '\n'

  if(data) {
    if (typeof data === 'object') {
      data.toString({
        colors: true,
        chunks: false
      }).split(/\r?\n/).forEach(line => {
        log += '  ' + line + '\n'
      })
    } else {
      log += `  ${data}\n`
    }
  }

  log += '\n' + chalk.yellow.bold(`${new Array(28 + 1).join('-')}`) + '\n'

  if(
    process.env.CHUNKS_LOG === 'true' ||
    process.env.NODE_ENV === 'production'
  ) {
    console.log(log)
  } else console.log(p)
}

module.exports = logStats;