import axios from 'axios'
import { API_URL } from '@/constants'
import { uploadingFile } from '@/helpers'

const $http = {
  async get(action, headers) {
    let query = `action=${action}`
    const resp = await axios.get(API_URL + '?' + query, headers)
    if(resp instanceof Error) return Promise.reject(resp)
    return resp
  },
  async post(action, data, headers) {
    let query = `action=${action}`
    let resp
    if(action === 'FILE') {
      const config = Object.assign({}, headers, {
        onUploadProgress: ({ loaded, total }) => {
          uploadingFile(loaded, total)
        }
      })
      resp = await axios.post(API_URL + '?' + query, data, config)
    } else {
      resp = await axios.post(API_URL + '?' + query, data, headers)
    }
    if(resp instanceof Error) return Promise.reject(resp)
    return resp.data ? resp.data : resp
  }
}

export default $http
