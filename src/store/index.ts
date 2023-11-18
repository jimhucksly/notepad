import { ModuleTree, createStore } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { IRootState } from '~/domain/models'

import { projects } from './projects'
import { library } from './library'

function buildStore(modules: ModuleTree<IRootState>) {
  const store = createStore<IRootState>({
    strict: process.env.NODE_ENV !== 'production',
    actions,
    getters,
    mutations,
    state,
    modules: {
      ...modules,
      projects,
      library
    }
  })
  return store
}

export {
  buildStore
}
