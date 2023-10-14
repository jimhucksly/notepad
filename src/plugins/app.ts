import { App } from 'vue'
import Application from '~/application/app'

export default {
  install: (vue: App, { app }: {app: Application }) => {
    app.init()
    vue.config.globalProperties.$app = app
  }
}
