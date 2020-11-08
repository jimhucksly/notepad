import axios from 'axios'
import { API_URL } from '~/constants'
import { uploadingFile } from '~/helpers'
import store from '~/store'
import { IJsonHeaders } from '~/domain/models'

let interval: any = null

class Http {
  public async get(action: string, headers: IJsonHeaders): Promise<any> {
    const query = `action=${action}`
    const resp: any = await axios.get(API_URL + '?' + query, headers)
    if(resp instanceof Error) {
      return Promise.reject(resp)
    }
    return resp
  }

  public async post(action: string, data: any, headers: IJsonHeaders) {
    const query = `action=${action}`
    let resp: any
    if(action === 'FILE') {
      const config = {
        ...headers,
        onUploadProgress: ({ loaded, total }: { loaded: number, total: number }) => {
          uploadingFile(loaded, total)
        }
      }
      resp = await axios.post(API_URL + '?' + query, data, config)
    } else {
      try {
        resp = await axios.post(API_URL + '?' + query, data, headers)
      } catch(e) {
        if(e.response === undefined) {
          store.dispatch('error', true)
          if(interval === undefined) {
            interval = setInterval(() => {
              this.post(action, data, headers)
            }, 2000)
          }
          return null
        } else {
          interval && clearInterval(interval)
          return e.response.data
        }
      }
    }
    store.dispatch('error', false)
    interval && clearInterval(interval)
    return resp.data ? resp.data : resp
  }
}

const $http = new Http()
export default $http
