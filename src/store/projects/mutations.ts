import { MutationTree } from 'vuex'
import { IFilters, IProjects, IProjectsState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const _mutations: MutationTree<IProjectsState> = {
  setJson(state: IProjectsState, payload: IProjects) {
    state.projects = { ...payload }
  },
  setFilter(state: IProjectsState, filter: IFilters) {
    state.filter = Object.assign({}, filter)
  }
}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof IProjectsState] = payload
    }
  }
})

const mutations: MutationTree<IProjectsState> = {
  ..._mutations
}

export default mutations
