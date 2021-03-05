import 'reflect-metadata'
import Vue from 'vue'
import vueElectron from 'vue-electron'

import App from './App'
import router from './router/index.ts'
import store from './store'
import Anime from '~/plugins/anime'
import BCheckbox from '~/modules/bcheckbox'

import '~/assets/scss/main.scss'
import '~/assets/css/simplemde.css'

Vue.config.productionTip = false
Vue.config.devtools = true
if(!process.env.IS_WEB) {
  Vue.use(vueElectron)
}
Vue.use(Anime)
Vue.use(BCheckbox)

window.Vue = Vue

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  render: h => h(App)
})
