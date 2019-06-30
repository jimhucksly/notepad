import Vue from 'vue'
import vueElectron from 'vue-electron'

import App from './App'
import router from './router'
import store from './store'
import Popup from '@/plugins/popup'

import '@/assets/scss/main.scss'

if(!process.env.IS_WEB) Vue.use(vueElectron)
Vue.use(Popup)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
