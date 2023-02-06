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

const ReturnType = {
  None: 'none',
  Single: 'single',
  Multiple: 'multiple'
}

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
              const query = 'SELECT * FROM users WHERE id = $1'
              return await execQuery(query, [id], ReturnType.Single)
            } catch (e) {
              console.log(e)
              throw new Error(`user by id "${ id }" is not found`)
            }
          }
          if (login) {
            try {
              const query = 'SELECT * FROM users WHERE login = $1'
              return await execQuery(query, [login], ReturnType.Single)
            } catch (e) {
              console.log(e)
              throw new Error(`user by login "${ login }" is not found`)
            }
          }
        }
      }
    },
    verify({ userId }) {
      return {
        async get() {
          if (userId) {
            const query = 'SELECT * FROM verify_codes WHERE user_id = $1'
            const { rows } = await client.query(query, [userId])
            if (rows && rows[0]) {
              return true
            }
            return false
          }
          throw new Error('bad request')
        },
        async check(code) {
          if (userId && code) {
            const query = 'SELECT * FROM verify_codes WHERE user_id = $1 AND code = $2'
            const { rows } = await client.query(query, [userId, code])
            if (rows && rows[0]) {
              return true
            }
            return false
          }
        },
        async delete() {
          if (userId) {
            const query = 'DELETE FROM verify_codes WHERE user_id = $1'
            await client.query(query, [userId])
          }
        }
      }
    }
  }
}

function command() {
  return {
    /**
     * @params commandParams: { id, login, password, name, email, token }
     */
    user({ id, login, password, name, email, token }) {
      return {
        async signup() {
          try {
            if (login && password && name && email) {
              const query = 'SELECT * FROM reg_user($1, $2, $3, $4)'
              return await execQuery(query, [login, password, name, email])
            }
            throw new Error('bad request')
          } catch (e) {
            /* eslint-desable no-console */
            console.log(e)
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async signin() {
          try {
            if (login && password) {
              const query = 'SELECT * FROM auth_user($1, $2)'
              return await execQuery(query, [login, password], ReturnType.Single)
            }
            throw new Error('bad request')
          } catch (e) {
            /* eslint-desable no-console */
            console.log(e)
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setVerifyCode(code) {
          try {
            if (id && email && code) {
              const query = 'INSERT INTO verify_codes VALUES ($1, $2, $3)'
              return await execQuery(query, [id, email, code])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        }
      }
    }
  }
}

/**
 * @param {String} query
 * @param {Array} payload
 * @param {String} returnType single | multiple | none
 * @returns
 */
async function execQuery(query, payload, returnType = ReturnType.None) {
  const { rows } = await client.query(query, payload)
  switch(returnType) {
    case ReturnType.None:
      return
    case ReturnType.Single:
      if(!rows || !Array.isArray(rows) || !rows.length) {
        throw new Error('not found')
      }
      return rows[0]
    case ReturnType.Multiple:
      if(!rows || !Array.isArray(rows) || !rows.length) {
        throw new Error('not found')
      }
      return rows
  }
}

module.exports = {
  connect,
  command,
  query
}
