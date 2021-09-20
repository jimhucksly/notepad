/* eslint-disable-next-line */
/// <reference path="../typings/shims-vue.d.ts" />
import 'reflect-metadata'
import Vue, { VueConstructor } from 'vue'
import Application from '~/application/app'
import '~/assets/css/simplemde.css'
import '~/assets/scss/main.scss'
import { _container } from '~/domain/container'
import AboutPopup from '~/modules/aboutPopup/index.vue'
import BBtn from '~/modules/bbtn'
import BCheckbox from '~/modules/bcheckbox'
import ConfirmPopupComponent from '~/modules/confirmPopup/index.vue'
import CreateEditLibraryFile from '~/modules/createEditLibraryFile/index.vue'
import CreateEditLink from '~/modules/createEditLink/index.vue'
import Loader from '~/modules/loader'
import SvgIcon from '~/modules/svgIcon'
import UploadingPopup from '~/modules/uploadingPopup/index.vue'
import Anime from '~/plugins/anime'
import ToastedPlugin from '~/plugins/toasted'
import App from './app'
import Popup from './components/popup'
import Toasted from './components/toasted'
import { TYPES } from './domain/types'
import DownloadingPopup from './modules/downloadingPopup'
import router from './router'
import store from './store'


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
Vue.use(BBtn)
Vue.use(Loader)
Vue.use(SvgIcon)
Vue.use(ToastedPlugin)

Vue.component('popup', Popup)
Vue.component('toasted', Toasted)
Vue.component('create-edit-link', CreateEditLink)
Vue.component('about-popup', AboutPopup)
Vue.component('uploading-popup', UploadingPopup)
Vue.component('downloading-popup', DownloadingPopup)
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
