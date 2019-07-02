import axios from 'axios'
import { API_URL } from '@/constants'

const $http = {
  async get(action) {
    let query = `action=${action}`
    const resp = await axios.get(API_URL + '?' + query)
    if(resp instanceof Error) return Promise.reject(resp)
    return resp
  },
  async post(action, data, headers) {
    let query = `action=${action}`
    let jsonHeaders = {
      headers: headers
    }
    const resp = await axios.post(API_URL + '?' + query, data, jsonHeaders)
    if(resp instanceof Error) return Promise.reject(resp)
    return resp.data ? resp.data : resp
  }
}

export default $http
