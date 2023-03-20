import { App } from 'vue'
import Application from '~/application/app'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'

export default {
  install: (vue: App) => {
    const app: { init: () => void } = _container.get(TYPES.Application)
    app.init()
    vue.config.globalProperties.$app = app as Application
  }
}
