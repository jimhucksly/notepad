import { ModuleTree, createStore } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { IRootState } from '~/domain/models'

function buildStore(modules: ModuleTree<IRootState>) {
  const store = createStore<IRootState>({
    strict: process.env.NODE_ENV !== 'production',
    actions,
    getters,
    mutations,
    state,
    modules: {
      ...modules
    }
  })
  return store
}

export {
  buildStore
}
