import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import vueElectron from 'vue-electron'

import '@/assets/scss/main.scss'

if(!process.env.IS_WEB) Vue.use(vueElectron)
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

const popup = {
  open(name) {
    console.log(name + 'PopupShow')
    store.dispatch(name + 'PopupShow', true)
  },
  close(name) { store.dispatch(name + 'PopupShow', false) }
}

Vue.popup = Vue.prototype.$popup = popup

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
