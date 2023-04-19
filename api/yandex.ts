/* eslint-disable camelcase */

import axios from 'axios'
import { IYandexAPI, IYandexDiskInfo, IYandexTokenResponse, Database } from './model'

type TPayload = URLSearchParams | Buffer

async function createYandexDiskApi(db: Database.IDatabase): Promise<IYandexAPI> {
  const client_id = '2151dc1a8f3d49abbbdcc4178356dadb'

  let { client_secret } = await db.query().yandexAppPassword().get()
  client_secret = client_secret.trim()

  async function post<T>(url: string, payload: TPayload, token?: string): Promise<T> {
    try {
      const headers = {
        'Content-type': 'application/x-www-form-urlencoded'
      }
      if (token) {
        headers['Authorization'] = 'OAuth ' + token
      }
      const { data } = await axios.post(url, payload, { headers })
      return data as T
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function get<T>(url: string, token?: string): Promise<T> {
    const headers = {}
    if (token) {
      headers['Authorization'] = 'OAuth ' + token
    }
    try {
      const { data } = await axios.get(url, { headers })
      return data as T
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function put<T>(url: string, payload: TPayload, token: string): Promise<T> {
    const headers = {}
    if (token) {
      headers['Authorization'] = 'OAuth ' + token
    }
    try {
      if (payload) {
        const response = await get<{ href: string }>(url, token)
        if (response.href) {
          url = response.href
          return await axios({
            method: 'put',
            url,
            data: payload,
            maxContentLength: Infinity,
            maxBodyLength: Infinity
          }) as unknown as T
        }
      }
      const { data } = await axios.put(url, null, { headers })
      return data as T
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function _delete(url: string, token: string): Promise<void> {
    const headers = {}
    if (token) {
      headers['Authorization'] = 'OAuth ' + token
    }
    try {
      await axios.delete(url, { headers })
      return Promise.resolve()
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function getToken(code: number): Promise<{ access_token: string, refresh_token: string }> {
    try {
      const form = new URLSearchParams({
        grant_type: 'authorization_code',
        code: String(code),
        client_id,
        client_secret
      })
      return await post<IYandexTokenResponse>('https://oauth.yandex.ru/token', form)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function refreshToken(token: string): Promise<IYandexTokenResponse> {
    try {
      const form = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token,
        client_id,
        client_secret
      })
      return await post('https://oauth.yandex.ru/token', form)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function diskInfo(path: string, token: string): Promise<IYandexDiskInfo> {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources?path=app:/' + path + '&limit=1000'
      return await get(url, token)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function uploadFile(filename: string, content: Buffer, token: string): Promise<void> {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources/upload?path=app:/' + filename + '&overwrite=true'
      return await put<void>(url, content, token)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function deleteFile(filename: string, token: string): Promise<void> {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources?path=app:/' + filename + '&permanently=true'
      return await _delete(url, token)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function createDir(dirname: string, token: string): Promise<boolean> {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources/?path=app:/' + dirname
      return await put<boolean>(url, null, token)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async function downloadFile(filename: string, token: string): Promise<Record<string, unknown>> {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources/download?path=app:/' + filename
      const response = await get<{ href: string }>(url, token)
      if (response.href) {
        return await get<Record<string, unknown>>(response.href)
      }
      throw new Error('resource not found')
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return {
    getToken,
    refreshToken,
    diskInfo,
    uploadFile,
    deleteFile,
    createDir,
    downloadFile
  }
}

export {
  createYandexDiskApi
}
