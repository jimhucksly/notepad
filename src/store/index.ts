import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { IRootState } from '~/domain/models'

Vue.use(Vuex)

const storeOptions: StoreOptions<IRootState> = {
  actions,
  getters,
  mutations,
  state,
  strict: process.env.NODE_ENV !== 'production'
}

const store = new Store<IRootState>(storeOptions)

export default store
