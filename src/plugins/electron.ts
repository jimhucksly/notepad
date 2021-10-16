import { App } from 'vue'

export default {
  install: (vue: App) => {
    const electron = require('electron')
    vue.config.globalProperties.$electron = electron
  }
}
