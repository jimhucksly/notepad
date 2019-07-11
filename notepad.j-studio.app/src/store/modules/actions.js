import { ipcRenderer } from 'electron'
import { isEmpty } from 'lodash'
import $http from '../http'
import storage from '@/plugins/storage'
import { userDataFileName } from '@/constants'
import { isJSON } from '@/helpers'

const jsonHeaders = {
  headers: {
    'X-Honeypot': 'App',
    'Content-Type': 'application/json'
  }
}

const actions = {
  auth(store, flag) {
    store.commit('setAuth', flag)
    ipcRenderer.send(flag ? 'authorized' : 'unauthorized')
    store.dispatch('interval', null)
  },
  token(store, value) {
    store.commit('setToken', value)
    const userDataPath = store.getters['getUserDataPath']
    storage.isPathExists(userDataPath)
      .then(() => {
        storage.set(userDataPath, userDataFileName, { token: value })
          .then(() => console.log('write to file is successfully completed'))
          .catch(() => {
            ipcRenderer.send('open-error-dialog', 'write to the file is failed')
            console.error('write to the file is failed')
          })
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
        const currentJSON = store.getters['getJson']
        const unread = store.getters['getUnread']
        if(currentJSON) {
          Object.keys(json).forEach(key => {
            if(!currentJSON[key]) {
              store.dispatch('unread', Object.assign({}, unread, {
                [key]: true
              }))
            }
          })
        }
      } catch (err) {
        console.error(err)
        store.dispatch('interval', null)
        ipcRenderer.send('open-error-dialog', 'json parse is failed')
      }
    } else json = data
    store.commit('setJson', json)
  },
  filter(store, object) {
    store.commit('setFilter', object)
  },
  unread(store, object) {
    store.commit('setUnread', object)
    if(isEmpty(object)) ipcRenderer.send('hide-icon-notification')
  },
  interval(store, int) {
    if(int) {
      store.commit('setInterval', int)
    } else {
      let interval = store.getters['getInterval']
      if(interval) clearInterval(interval)
      store.commit('setInterval', null)
    }
  },
  aboutPopupShow(store, flag) {
    store.commit('setAboutPopupShow', flag)
  },
  uploadingPopupShow(store, flag) {
    store.commit('setUploadingPopupShow', flag)
  },
  preferences(store) {
    const flag = store.getters['isPreferencesShowed']
    store.commit('setPreferencesShow', !flag)
  },
  downloadsTargetPath(store, path) {
    store.commit('setDownloadsTargetPath', path)
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
            let interval = store.getters['getInterval']
            if(interval) store.commit('setInterval', null)
            interval = setInterval(() => {
              store.dispatch('action', {
                type: 'CHECK'
              })
                .then(resp => {
                  if(resp.status !== 204) {
                    store.dispatch('json', resp.data.data)
                    store.commit('setNotification', true)
                  }
                })
                .catch(err => {
                  ipcRenderer.send('open-error-dialog', 'dispatch CHECK is failed')
                  console.error(err)
                })
            }, 5000)
            store.commit('setInterval', interval)
          })
          .catch(() => {
            store.dispatch('loading', false)
            store.dispatch('auth', false)
            store.dispatch('token', null)
            store.dispatch('interval', null)
          })
        return null
      case 'SEND':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const postResp = await $http.post(type, {
          json: store.getters['getJson']
        }, jsonHeaders)
        if(postResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'send message is failed')
          return Promise.reject(postResp)
        }
        return postResp
      case 'CHECK':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        const checkResp = await $http.get(type, jsonHeaders)
        if(checkResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'dispacth CHECK is failed')
          return Promise.reject(checkResp)
        }
        return checkResp
      case 'FILE':
        jsonHeaders.headers.Authorization = store.getters['getToken']
        jsonHeaders.headers['Content-Type'] = 'multipart/form-data'
        store.dispatch('uploadingPopupShow', true)
        const uploadResp = await $http.post(type, data.file, jsonHeaders)
        if(uploadResp instanceof Error) {
          ipcRenderer.send('open-error-dialog', 'file upload is failed')
          return Promise.reject(uploadResp)
        }
        store.dispatch('uploadingPopupShow', false)
        return uploadResp
    }
  }
}

export default actions
