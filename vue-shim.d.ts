declare module "*.vue" {
  import Vue from 'vue';
  import Vuex from "vuex";
  import vueElectron from 'vue-electron';
  Vue.extend('electron', vueElectron)
  export default Vue;
}
