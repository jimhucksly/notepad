import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_URL } from '~/constants'
import { uploadingFile } from '~/helpers'
import store from '~/store'
import { IJsonHeaders, IResponse } from '~/domain/models'

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config = config || {}
    config.headers['X-Honeypot'] = 'App'
    config.headers['Content-Type'] = 'application/json'
    config.headers.Authorization = store.getters.getToken
    return config
  },
  error => {
    console.log(error.request)
    return Promise.reject(error)
  }
)

let interval: NodeJS.Timeout | null = null

class Http {
  public async get<TResponse>(
    action: string
  ): Promise<IResponse<TResponse>> {
    const query = `action=${action}`
    const resp: AxiosResponse<IResponse<TResponse>> = await axios.get(API_URL + '?' + query)
    if(resp.status === 204) {
      return Promise.resolve(void 0)
    }
    if(!resp || !resp.data || resp instanceof Error) {
      return Promise.reject(resp)
    }
    return resp.data
  }

  public async post<TPayload, TResponse>(
    action: string, data: TPayload, headers?: IJsonHeaders
  ): Promise<IResponse<TResponse>> {
    const query = `action=${action}`
    let resp: AxiosResponse<IResponse<TResponse>>
    if(action === 'FILE') {
      const config = {
        'X-Honeypot': 'App',
        Authorization: store.getters.getToken,
        'Content-Type': 'multipart/form-data',
        onUploadProgress: ({ loaded, total }: { loaded: number, total: number }) => {
          uploadingFile(loaded, total)
        }
      }
      resp = await axios.post(API_URL + '?' + query, data, config)
    } else {
      try {
        resp = await axios.post(API_URL + '?' + query, data)
      } catch(e) {
        if(e.response === undefined) {
          store.commit('setError', true)
          if(interval === undefined) {
            interval = setInterval(() => {
              this.post(action, data)
            }, 2000)
          }
          return Promise.reject()
        } else {
          interval && clearInterval(interval)
          return e.response.data
        }
      }
    }
    store.commit('setError', false)
    interval && clearInterval(interval)
    return resp.data
  }

  public async delete(
    action: string, data: { id: string | number }
  ): Promise<IResponse<string>> {
    const query = `action=${action}&id=${data.id}`
    let resp: AxiosResponse<IResponse<string>>
    try {
      resp = await axios.delete(API_URL + '?' + query)
    } catch(e) {
      if(e.response === undefined) {
        store.commit('setError', true)
        if(interval === undefined) {
          interval = setInterval(() => {
            this.post(action, data)
          }, 2000)
        }
        return Promise.reject()
      } else {
        interval && clearInterval(interval)
        return e.response.data
      }
    }
    store.commit('setError', false)
    interval && clearInterval(interval)
    return resp.data
  }
}

const $http = new Http()
export default $http
