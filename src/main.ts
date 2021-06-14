import 'reflect-metadata'
import '~/assets/css/simplemde.css'
import '~/assets/scss/main.scss'

import Vue, { VueConstructor } from 'vue'
import Application from '~/application/app'
import { _container } from '~/domain/container'
import BCheckbox from '~/modules/bcheckbox'
import SvgIcon from '~/modules/svgIcon'
import Anime from '~/plugins/anime'
import App from './app'
import Popup from './components/popup'
import { TYPES } from './domain/types'
import router from './router'
import store from './store'
import CreateEditLink from '~/modules/createEditLink/index.vue'

Vue.config.productionTip = false
Vue.config.devtools = true

const app: Application = _container.get(TYPES.Application)
app.init()
const AppPlugin = {
  install(vue: VueConstructor, applicationInstance: Application) {
    vue.prototype.$app = applicationInstance
  }
}
Vue.use(AppPlugin, app)
Vue.use(Anime)
Vue.use(BCheckbox)
Vue.use(SvgIcon)

Vue.component('create-edit-link', CreateEditLink)

if(!process.env.IS_WEB) {
  Vue.prototype.$electron = require('electron')
}

Vue.component('popup', Popup)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
