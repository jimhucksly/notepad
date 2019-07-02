import Vue from 'vue'
import vueElectron from 'vue-electron'

import App from './App'
import router from './router'
import store from './store'
import Popup from '@/plugins/popup'

import '@/assets/scss/main.scss'

Vue.config.productionTip = false
Vue.config.devtools = true
if(!process.env.IS_WEB) Vue.use(vueElectron)
Vue.use(Popup)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
