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
  return {
    /**
     * @params queryParams: { id, login, email, token }
     */
    user({ id, login, email, token }) {
      return {
        async get() {
          if (id) {
            try {
              const query = 'SELECT * from users WHERE id = $1'
              return await execQuery(query, [id])
            } catch (e) {
              console.log(e)
              throw new Error(`user by id "${ id }" is not found`)
            }
          }
        }
      }
    }
  }
}

function command() {
  return {
    /**
     * @params commandParams: { id, login, pass, name, email, token }
     */
    user({ id, login, pass, name, email, token }) {
      return {
        async signup() {
          if (login && pass && name && email) {
            const query = 'SELECT * FROM reg_user($1, $2, $3, $4)'
            return await execQuery(query, [login, pass, name, email])
          }
          throw new Error(`bad request`)
        }
      }
    }
  }
}

async function execQuery(query, payload) {
  const { rows } = await client.query(query, payload)
  if (!rows || !Array.isArray(rows) || !rows.length) {
    throw new Error('not found')
  }
  return rows
}

module.exports = {
  connect,
  command,
  query
}
