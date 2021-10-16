import { App } from 'vue'
import { IApplication } from '~/application/app'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'

export default {
  install: (vue: App) => {
    const app: IApplication = _container.get(TYPES.Application)
    app.init()
    vue.config.globalProperties.$app = app
  }
}
