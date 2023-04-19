/* eslint-disable camelcase */

import { Client, QueryResult } from 'pg'
import config from './config.json'
import { IToken, IUser, ReturnType, Database } from './model'

const client = new Client({
  host: config.db_host,
  port: config.db_port,
  user: config.db_user,
  password: config.db_password
})

let connected = false

client
  .connect()
  .then(() => {
    connected = true
  })
  .catch(e => {
    /* eslint-disable no-console */
    console.log(e)
  })

client.on('end', () => {
  connected = false
})

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

function query(): Database.Query {
  return {
    user({ id, login, email, token }: Partial<IUser>): Database.Query.User {
      return {
        async get() {
          if (id) {
            try {
              const _query = 'SELECT * FROM users WHERE id = $1'
              return await execQuery<IUser>(_query, [id], ReturnType.Single)
            } catch (e) {
              console.log(e)
              throw new Error(`user by id "${id}" is not found`)
            }
          }
          if (login) {
            try {
              const _query = 'SELECT * FROM users WHERE login = $1'
              return await execQuery<IUser>(_query, [login], ReturnType.Single)
            } catch (e) {
              throw new Error(`user by login "${login}" is not found`)
            }
          }
          if (token) {
            try {
              let _query = 'SELECT * FROM tokens WHERE token = $1'
              const row = await execQuery<IToken>(_query, [token], ReturnType.Single)
              if (new Date().getTime() < new Date(row.token_expired).getTime()) {
                _query = 'SELECT * FROM users WHERE id = $1'
                return await execQuery<IUser>(_query, [row.user_id], ReturnType.Single)
              }
              throw new Error('Token expired')
            } catch (e) {
              console.log(e)
              throw new Error(e?.message || 'user is not found')
            }
          }
          return null
        },
        async search() {
          const payload = []
          const queryFields = []
          let _query = 'SELECT * FROM users WHERE'
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
            _query = _query + ' ' + queryFields.join(' OR ')
            return await execQuery(_query, payload, ReturnType.Single)
          } catch (e) {
            throw new Error('user is not found')
          }
        }
      }
    },
    verify({ userId }: { userId: number }): Database.Query.Verify {
      return {
        async get(): Promise<boolean> {
          if (userId) {
            const _query = 'SELECT * FROM verify_codes WHERE user_id = $1'
            const { rows } = await client.query(_query, [userId])
            if (rows && rows[0]) {
              return true
            }
            return false
          }
          throw new Error('bad request')
        },
        async check(code: number): Promise<boolean> {
          if (userId && code) {
            const _query = 'SELECT * FROM verify_codes WHERE user_id = $1 AND code = $2'
            const { rows } = await client.query(_query, [userId, code])
            if (rows && rows[0]) {
              return true
            }
            return false
          }
          return null
        }
      }
    },
    tokens(): Database.Query.Tokens {
      return {
        async get(): Promise<Array<IToken>> {
          try {
            const _query = 'SELECT * FROM tokens'
            return await execQuery<Array<IToken>>(_query, [], ReturnType.Multiple)
          } catch (e) {
            throw new Error('tokens is not found')
          }
        }
      }
    },
    yandexAppPassword(): Database.Query.YandexAppPassword {
      return {
        async get(): Promise<{ client_secret: string }> {
          try {
            const _query = 'SELECT * FROM yandex_app_password'
            return await execQuery<{ client_secret: string }>(_query, [], ReturnType.Single)
          } catch (e) {
            throw new Error('yandex app password is not found')
          }
        }
      }
    }
  }
}

function command(): Database.Command {
  return {
    user({ id, login, password, name, email, token }: IUser): Database.Command.User {
      return {
        async signup(): Promise<void> {
          try {
            if (login && password && name && email) {
              const _query = 'SELECT * FROM reg_user($1, $2, $3, $4)'
              return await execQuery<void>(_query, [login, password, name, email])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async signin(): Promise<boolean> {
          try {
            if (login && password) {
              const _query = 'SELECT * FROM auth_user($1, $2)'
              const { auth_user: isAuth } = await execQuery<{ auth_user: boolean }>(_query, [login, password], ReturnType.Single)
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
        async setVerifyCode(code: number): Promise<void> {
          try {
            if (id && email && code) {
              const _query = 'INSERT INTO verify_codes VALUES ($1, $2, $3)'
              return await execQuery<void>(_query, [id, email, code])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async resetVerifyCode(code: number): Promise<void> {
          try {
            if (id && code) {
              const _query = 'UPDATE verify_codes SET code = $2 WHERE user_id = $1'
              return await execQuery<void>(_query, [id, code])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setTempPassword(pass: string): Promise<void> {
          try {
            if (id && password) {
              const _query = 'SELECT * FROM set_temp_pass($1, $2)'
              return await execQuery<void>(_query, [id, pass])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async updatePassword(old: string, pass: string): Promise<void> {
          try {
            if (id && old && pass) {
              const _query = 'SELECT * FROM reset_pass($1, $2, $3)'
              return await execQuery<void>(_query, [id, old, pass])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setYandexAccessToken(_token: string): Promise<void> {
          try {
            if (id && _token) {
              const _query = 'UPDATE users SET yandex_disk_access_token = $2 WHERE id = $1;'
              return await execQuery<void>(_query, [id, _token])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async setYandexRefreshToken(_token: string): Promise<void> {
          try {
            if (id && _token) {
              const _query = 'UPDATE users SET yandex_disk_refresh_token = $2 WHERE id = $1;'
              return await execQuery<void>(_query, [id, _token])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async revokeYandexAccessToken(): Promise<void> {
          try {
            if (id) {
              const _query = 'UPDATE users SET yandex_disk_access_token = NULL WHERE id = $1;'
              return await execQuery<void>(_query, [id])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async revokeYandexRefreshToken(): Promise<void> {
          try {
            if (id) {
              const _query = 'UPDATE users SET yandex_disk_refresh_token = NULL WHERE id = $1;'
              return await execQuery<void>(_query, [id])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        }
      }
    },
    verify({ userId }: { userId: number }): Database.Command.Verify {
      return {
        async delete(): Promise<void> {
          if (userId) {
            const _query = 'DELETE FROM verify_codes WHERE user_id = $1'
            await client.query(_query, [userId])
          }
        }
      }
    },
    token(token: string): Database.Command.Token {
      return {
        async bindToUser({ id }: Partial<IUser>): Promise<void> {
          try {
            if (id && token) {
              const _query = 'SELECT * FROM set_token($1, $2)'
              return await execQuery<void>(_query, [id, token])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async delete(): Promise<void> {
          try {
            if (token) {
              const _query = 'DELETE from tokens WHERE token = $1'
              await client.query(_query, [token])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        }
      }
    },
    session(session: string): Database.Command.Session {
      return {
        async bindToUser({ id }: Partial<IUser>): Promise<QueryResult<{ row: [] }>> {
          try {
            if (id && session) {
              const _query = 'INSERT INTO sessions VALUES($1, $2) ON CONFLICT (session) DO UPDATE SET session = $2'
              return client.query(_query, [id, session])
            }
            throw new Error('bad request')
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        },
        async revoke() {
          try {
            if (session) {
              const _query = 'DELETE FROM sessions WHERE session = $1'
              await client.query(_query, [session])
            }
          } catch (e) {
            throw new Error(e?.hint || e?.message || 'bad request')
          }
        }
      }
    }
  }
}

async function execQuery<T>(_query: string, payload: Array<unknown>, returnType: ReturnType = ReturnType.None): Promise<T> {
  const { rows } = await client.query(_query, payload)
  switch (returnType) {
    case ReturnType.None:
      return null
    case ReturnType.Single:
      if (!rows || !Array.isArray(rows) || !rows.length) {
        return Promise.reject(new Error('not found'))
      }
      return rows[0] as T
    case ReturnType.Multiple:
      if (!rows || !Array.isArray(rows) || !rows.length) {
        return Promise.reject(new Error('not found'))
      }
      return rows as unknown as T
    default:
      return null
  }
}
const db: Database.IDatabase = {
  connect,
  command,
  query
}

export default db
