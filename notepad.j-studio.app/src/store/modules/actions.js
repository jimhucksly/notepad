import $http from '../http'
import storage from '@/plugins/storage'
import { userDataFileName } from '@/constants'
import { isJSON } from '@/helpers'
import { ipcRenderer } from 'electron'

const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const actions = {
  auth(store, flag) {
    store.commit('setAuth', flag)
    ipcRenderer.send(flag ? 'authorized' : 'unauthorized')
  },
  token(store, value) {
    store.commit('setToken', value)
    const userDataPath = store.getters['getUserDataPath']
    storage.isPathExists(userDataPath)
      .then(() => {
        storage.set(userDataPath, userDataFileName, { token: value })
          .then(() => console.log('write to file is successfully completed'))
          .catch(() => console.error('write to the file is failed'))
      })
      .catch(() => console.error(`${userDataPath} is don't exists`))
  },
  loading(store, flag) {
    store.commit('setLoading', flag)
  },
  userDataPath(store, path) {
    store.commit('setUserDataPath', path)
  },
  json(store, data) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch (err) {
        console.error(err)
      }
    } else json = data
    store.commit('setJson', json)
  },
  filter(store, object) {
    store.commit('setFilter', object)
  },
  aboutPopupShow(store, flag) {
    store.commit('setAboutPopupShow', flag)
  },
  async action(store, { type, data }) {
    switch (type) {
      case 'AUTH':
        const authResp = await $http.post(type, {
          login: data.login,
          password: data.password
        }, jsonHeaders)
        if(authResp instanceof Error) return Promise.reject(authResp)
        return authResp
      case 'GET_JSON':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        $http.get(type, jsonHeaders)
          .then(resp => {
            setTimeout(() => {
              store.dispatch('loading', false)
            }, 2000)
            store.dispatch('json', resp.data.data)
          })
          .catch(() => {
            store.dispatch('loading', false)
            store.dispatch('auth', false)
            store.dispatch('token', null)
          })
        return null
      case 'SEND':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const postResp = await $http.post(type, {
          json: store.getters['getJson']
        }, jsonHeaders)
        if(postResp instanceof Error) return Promise.reject(postResp)
        return postResp
      case 'FILE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        jsonHeaders.headers['Content-Type'] = 'multipart/formdata'
        const uploadResp = await $http.post(type, data.file, jsonHeaders)
        if(uploadResp instanceof Error) return Promise.reject(uploadResp)
        return uploadResp
    }
  }
}

export default actions
