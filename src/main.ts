/* eslint-disable-next-line */
/// <reference path="../typings/shims-vue.d.ts" />
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
import AboutPopup from '~/modules/aboutPopup/index.vue'
import UploadingPopup from '~/modules/uploadingPopup/index.vue'
import CreateEditLibraryFile from '~/modules/createEditLibraryFile/index.vue'
import ConfirmPopupComponent from '~/modules/confirmPopup/index.vue'

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

Vue.component('popup', Popup)
Vue.component('create-edit-link', CreateEditLink)
Vue.component('about-popup', AboutPopup)
Vue.component('uploading-popup', UploadingPopup)
Vue.component('create-edit-library-file', CreateEditLibraryFile)
Vue.component('confirm-popup', ConfirmPopupComponent)

if(!process.env.IS_WEB) {
  Vue.prototype.$electron = require('electron')
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
