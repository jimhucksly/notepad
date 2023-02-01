const { Client } = require('pg')
const config = require('./config.json')

const client = new Client({
  host: config.db_host,
  port: config.db_port,
  user: config.db_user,
  password: config.db_password
})

let connected = false

client.connect().then(() => { connected = true })
client.on('end', () => { connected = false })

async function connect() {
  if (connected) {
    return true
  }
  try {
    await client.connect()
    connected = true
    return true
  } catch (e) {
    throw new Error('database is disconnected')
  }
}

function query() {
  //
}

function command() {
  //
}

module.exports = {
  connect,
  command,
  query
}
