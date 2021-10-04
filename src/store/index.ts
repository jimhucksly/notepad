import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { IRootState } from '~/domain/models'

import { projects } from './projects'
import { library } from './library'

Vue.use(Vuex)

const storeOptions: StoreOptions<IRootState> = {
  strict: process.env.NODE_ENV !== 'production',
  actions,
  getters,
  mutations,
  state,
  modules: {
    projects,
    library
  }
}

const store = new Store<IRootState>(storeOptions)

export default store
