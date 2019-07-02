import $http from '../http'
import storage from '@/plugins/storage'
import { userDataFileName } from '@/constants'

const jsonHeaders = {
  headers: {
    'Content-Type': 'application/json'
  }
}

const actions = {
  auth(store, flag) {
    store.commit('setAuth', flag)
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
    store.commit('setJson', data)
  },
  aboutPopupShow(store, flag) {
    store.commit('setAboutPopupShow', flag)
  },
  async action(store, { type, data }) {
    switch (type) {
      case 'GET_JSON':
        const token = store.getters['getToken']
        jsonHeaders.headers.Authorization = token
        $http.get(type, jsonHeaders)
          .then(resp => {
            store.dispatch('json', resp.data.data)
          })
          .catch(() => {
            store.dispatch('auth', false)
            store.dispatch('token', null)
          })
        break
      case 'AUTH':
        const resp = await $http.post(type, {
          login: data.login,
          password: data.password
        }, jsonHeaders)
        if(resp instanceof Error) return Promise.reject(resp)
        return resp
    }
  }
}

export default actions
