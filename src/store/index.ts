import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import modules from './modules'
import { IRootState } from '~/domain/models'

Vue.use(Vuex)

const storeOptions: StoreOptions<IRootState> = {
  ...modules,
  strict: process.env.NODE_ENV !== 'production'
}

const store = new Store<IRootState>(storeOptions)

export default store
