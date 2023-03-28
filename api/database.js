const { Client } = require('pg')
const config = require('./config.json')

const useProdDB = 1

const client = new Client({
  host: useProdDB ? config.prod_db_host : config.db_host,
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
              throw new Error(`user by login "${ login }" is not found`)
            }
          }
          if (token) {
            try {
              let query = 'SELECT * FROM tokens WHERE token = $1'
              const row = await execQuery(query, [token], ReturnType.Single)
              if (new Date().getTime() < new Date(row.token_expired).getTime()) {
                query = 'SELECT * FROM users WHERE id = $1'
                return await execQuery(query, [row.user_id], ReturnType.Single)
              }
              throw new Error('Token expired')
            } catch (e) {
              console.log(e)
              throw new Error(e?.message || 'user is not found')
            }
          }
        },
        async search() {
          const payload = []
          const queryFields = []
          let query = 'SELECT * FROM users WHERE'
          let index = 0
          if (id) {
            index++
            queryFields.push(`id = $${index}`)
            payload.push(id)
          }
          if (login) {
            index++
            queryFields.push(`login = $${index}`)
            payload.push(login)
          }
          if (email) {
            index++
            queryFields.push(`email = $${index}`)
            payload.push(email)
          }
          try {
            query = query + ' ' + queryFields.join(' OR ')
            return await execQuery(query, payload, ReturnType.Single)
          } catch (e) {
            throw new Error(`user is not found`)
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
        }
      }
    },
    tokens() {
      return {
        async get() {
          try {
            const query = 'SELECT * FROM tokens'
            return await execQuery(query, [], ReturnType.Multiple)
          } catch (e) {
            throw new Error('tokens is not found')
          }
        }
      }
    },
    yandexAppPassword() {
      return {
        async get() {
          try {
            const query = 'SELECT * FROM yandex_app_password'
            return await execQuery(query, [], ReturnType.Single)
          } catch (e) {
            throw new Error('yandex app password is not found')
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
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async signin() {
          try {
            if (login && password) {
              const query = 'SELECT * FROM auth_user($1, $2)'
              const { auth_user: isAuth } = await execQuery(query, [login, password], ReturnType.Single)
              if (!isAuth) {
                throw new Error('user not found')
              }
              return true
            }
            throw new Error('bad request')
          } catch (e) {
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
        },
        async resetVerifyCode(code) {
          try {
            if (id && code) {
              const query = 'UPDATE verify_codes SET code = $2 WHERE user_id = $1'
              return await execQuery(query, [id, code])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setTempPassword(password) {
          try {
            if (id && password) {
              const query = 'SELECT * FROM set_temp_pass($1, $2)'
              return await execQuery(query, [id, password])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async updatePassword(old, password) {
          try {
            if (id && old && password) {
              const query = 'SELECT * FROM reset_pass($1, $2, $3)'
              return await execQuery(query, [id, old, password])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setYandexAccessToken(token) {
          try {
            if (id && token) {
              const query = 'UPDATE users SET yandex_disk_access_token = $2 WHERE id = $1;'
              return await execQuery(query, [id, token])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setYandexRefreshToken(token) {
          try {
            if (id && token) {
              const query = 'UPDATE users SET yandex_disk_refresh_token = $2 WHERE id = $1;'
              return await execQuery(query, [id, token])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async revokeYandexAccessToken() {
          try {
            if (id) {
              const query = 'UPDATE users SET yandex_disk_access_token = NULL WHERE id = $1;'
              return await execQuery(query, [id])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async revokeYandexRefreshToken() {
          try {
            if (id) {
              const query = 'UPDATE users SET yandex_disk_refresh_token = NULL WHERE id = $1;'
              return await execQuery(query, [id])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        }
      }
    },
    verify({ userId }) {
      return {
        async delete() {
          if (userId) {
            const query = 'DELETE FROM verify_codes WHERE user_id = $1'
            await client.query(query, [userId])
          }
        }
      }
    },
    token(token) {
      return {
        async bindToUser({ id }) {
          try {
            if (id && token) {
              const query = 'SELECT * FROM set_token($1, $2)'
              return await execQuery(query, [id, token])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async delete() {
          try {
            if (token) {
              const query = 'DELETE from tokens WHERE token = $1'
              await client.query(query, [token])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        }
      }
    },
    session(session) {
      return {
        async bindToUser({ id }) {
          try {
            if (id && session) {
              const query = 'INSERT INTO sessions VALUES($1, $2) ON CONFLICT (session) DO UPDATE SET session = $2'
              return client.query(query, [id, session])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async revoke() {
          try {
            if (session) {
              const query = 'DELETE FROM sessions WHERE session = $1'
              await client.query(query, [session])
            }
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
        return Promise.reject(new Error('not found'))
      }
      return rows[0]
    case ReturnType.Multiple:
      if(!rows || !Array.isArray(rows) || !rows.length) {
        return Promise.reject(new Error('not found'))
      }
      return rows
  }
}

module.exports = {
  connect,
  command,
  query
}
