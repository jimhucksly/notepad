import axios from 'axios'
import { API_URL } from '@/constants'

var Http = function http(options) {
  if(options === void 0) options = {}
}

function install(Vue) {
  const _http = {
    async get(action) {
      let query = `action=${action}`
      const resp = await axios.get(API_URL + '?' + query)
      if(resp instanceof Error) return Promise.reject(resp)
      return resp
    }
  }

  if(!Vue.prototype.hasOwnProperty('$http')) {
    Object.defineProperty(Vue.prototype, '$http', {
      get: function get() { return _http }
    })
  }
}

Http.install = install
export default Http
