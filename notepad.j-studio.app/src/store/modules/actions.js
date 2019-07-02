import $http from '../http'
import path from 'path'
import storage from 'electron-storage'

const headers = {
  'Content-Type': 'application/json'
}

const actions = {
  auth(store, flag) {
    store.commit('setAuth', flag)
  },
  token(store, value) {
    store.commit('setToken', value)
    const appPath = store.getters['getUserDataPath']
    const file = path.resolve(appPath, 'app')
    console.log(file)
    storage.isPathExists(appPath)
      .then(() => {
        storage.set(file, { token: value })
          .then(() => console.log('The file was successfully written to the storage'))
          .catch(() => console.error('save to localStorage is failed'))
      })
      .catch(() => console.error('save to localStorage is failed'))
  },
  loading(store, flag) {
    store.commit('setLoading', flag)
  },
  userDataPath(store, path) {
    store.commit('setUserDataPath', path)
  },
  aboutPopupShow(store, flag) {
    store.commit('setAboutPopupShow', flag)
  },
  async action(store, { type, data }) {
    switch (type) {
      case 'GET_JSON':
        $http.get(type)
          .then(resp => {
            store.dispatch('loading', false)
            console.log(resp)
          })
          .catch(() => {
            store.dispatch('loading', false)
            store.dispatch('auth', false)
          })
        break
      case 'AUTH':
        const resp = await $http.post(type, {
          login: data.login,
          password: data.password
        }, headers)
        if(resp instanceof Error) return Promise.reject(resp)
        return resp
    }
  }
}

export default actions
