import { createStore } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { IRootState } from '~/domain/models'

import { projects } from './projects'
import { library } from './library'
import { todo } from './todo'
import { events } from './events'
import { links } from './links'
import { files } from './files'

export default createStore<IRootState>({
  strict: process.env.NODE_ENV !== 'production',
  actions,
  getters,
  mutations,
  state,
  modules: {
    projects,
    library,
    todo,
    events,
    links,
    files
  }
})
