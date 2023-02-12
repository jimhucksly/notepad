const axios = require('axios')

async function createYandexDiskApi(db) {

  const client_id = '2151dc1a8f3d49abbbdcc4178356dadb'

  let { client_secret } = await db.query().yandexAppPassword().get()
  client_secret = client_secret.trim()

  async function post(url, payload, token) {
    try {
      const headers = {
        'Content-type': 'application/x-www-form-urlencoded'
      }
      if (token) {
        headers['Authorization'] = 'OAuth ' + token
      }
      const { data } = await axios.post(url, payload, { headers })
      return data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function get(url, token) {
    const headers = {}
    if (token) {
      headers['Authorization'] = 'OAuth ' + token
    }
    try {
      const { data } = await axios.get(url, { headers })
      return data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function put(url, payload, token) {
    const headers = {}
    if (token) {
      headers['Authorization'] = 'OAuth ' + token
    }
    try {
      if (payload) {
        const response = await get(url, token)
        if (response.href) {
          url = response.href
          return await axios.put(url, payload)
        }
      }
      const { data } = await axios.put(url, null, { headers })
      return data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function getToken(code) {
    try {
      const form = new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id,
        client_secret,
      })
      return await post('https://oauth.yandex.ru/token', form)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function diskInfo(path, token) {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources?path=app:/' + path
      return await get(url, token)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function uploadFile(filename, content, token) {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources/upload?path=app:/' + filename + '&overwrite=true'
      return await put(url, content, token)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function createDir(dirname, token) {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources/?path=app:/' + dirname
      return await put(url, null, token)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async function downloadFile(filename, token) {
    try {
      const url = 'https://cloud-api.yandex.net/v1/disk/resources/download?path=app:/' + filename
      const response = await get(url, token)
      if (response.href) {
        return await get(response.href)
      }
      throw new Error('resource not found')
    } catch(e) {
      return Promise.reject(e)
    }
  }

  return {
    getToken,
    diskInfo,
    uploadFile,
    createDir,
    downloadFile
  }
}

module.exports = {
  createYandexDiskApi
}