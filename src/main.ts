import 'reflect-metadata'
import '~/assets/css/simplemde.css'
import '~/assets/scss/main.scss'
import BCheckbox from '~/modules/bcheckbox'
import Anime from '~/plugins/anime'
import App from './App'
import router from './router'
import store from './store'
import Vue from 'vue'

Vue.config.productionTip = false
Vue.config.devtools = true
if(!process.env.IS_WEB) {
  Vue.prototype.$electron = require('electron')
}
Vue.use(Anime)
Vue.use(BCheckbox)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
