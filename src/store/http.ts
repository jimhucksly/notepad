import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { IResponse } from '~/domain/models'
import { uploadDownloadFile } from '~/helpers'
import store from '~/store'

axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    config = config || {}
    config.headers['X-Honeypot'] = 'App'
    if(config.url.indexOf('upload') > -1) {
      config.headers['Content-Type'] = 'multipart/form-data'
      config.onUploadProgress = ({ loaded, total }: { loaded: number, total: number }) => {
        uploadDownloadFile(loaded, total)
      }
    } else {
      config.headers['Content-Type'] = 'application/json'
    }
    config.headers.Authorization = store.getters.getToken
    config.url = store.getters.getApiPath + config.url
    const isDevelopment = store.getters.getIsDevelopment
    if(!isDevelopment) {
      config.url = store.getters.getEndpoint + config.url
      let path = config.url
      let query = ''
      if(config.url.indexOf('?') > -1) {
        path = config.url.split('?')[0]
        query = config.url.split('?')[1]
      }
      if(path && !path.endsWith('/')) {
        path = path + '/'
      }
      config.url = path + (query ? '?' + query : '')
    }
    return config
  },
  error => {
    console.log(error.request)
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  response => {
    return response
  },
  error => {
    throw new Error(error)
  }
)

let interval: NodeJS.Timeout | null = null

class Http {
  public async get<TResponse>(url: string): Promise<IResponse<TResponse>> {
    const resp: AxiosResponse<IResponse<TResponse>> = await axios.get(url)
    if(resp.status === 204) {
      return Promise.resolve(void 0)
    }
    if(!resp || !resp.data || resp instanceof Error) {
      return Promise.reject(resp)
    }
    return resp.data
  }

  public async post<TPayload, TResponse>(url: string, data: TPayload): Promise<IResponse<TResponse>> {
    let resp: AxiosResponse<IResponse<TResponse>>
    try {
      resp = await axios.post(url, data)
    } catch(e) {
      if((e as { response: unknown }).response === undefined) {
        store.commit('setError', true)
        if(interval === undefined) {
          interval = setInterval(() => {
            this.post(url, data)
          }, 2000)
        }
        return Promise.reject()
      } else {
        interval && clearInterval(interval)
        return (e as { response: { data: IResponse<TResponse> } }).response.data
      }
    }
    store.commit('setError', false)
    interval && clearInterval(interval)
    return resp.data
  }

  public async put<TPayload, TResponse>(
    url: string, data: TPayload
  ): Promise<IResponse<TResponse>> {
    let resp: AxiosResponse<IResponse<TResponse>>
    try {
      resp = await axios.put(url, data)
    } catch(e) {
      if((e as { response: unknown }).response === undefined) {
        store.commit('setError', true)
        if(interval === undefined) {
          interval = setInterval(() => {
            this.put(url, data)
          }, 2000)
        }
        return Promise.reject()
      } else {
        interval && clearInterval(interval)
        return (e as { response: { data: IResponse<TResponse> } }).response.data
      }
    }
    store.commit('setError', false)
    interval && clearInterval(interval)
    return resp.data
  }

  public async delete(url: string): Promise<IResponse<string>> {
    let resp: AxiosResponse<IResponse<string>>
    try {
      resp = await axios.delete(url)
    } catch(e) {
      if((e as { response: unknown }).response === undefined) {
        store.commit('setError', true)
        if(interval === undefined) {
          interval = setInterval(() => {
            this.delete(url)
          }, 2000)
        }
        return Promise.reject()
      } else {
        interval && clearInterval(interval)
        return (e as { response: { data: IResponse<string> } }).response.data
      }
    }
    store.commit('setError', false)
    interval && clearInterval(interval)
    return resp.data
  }
}

const $http = new Http()
export default $http
