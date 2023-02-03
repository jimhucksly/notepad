import { MutationTree } from 'vuex'
import { IFilters, IJson, IProjectsState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const _mutations: MutationTree<IProjectsState> = {
  setJson(state: IProjectsState, json: IJson) {
    state.json = {}
    state.json = { ...json }
  },
  setFilter(state: IProjectsState, filter: IFilters) {
    state.filter = {}
    state.filter = Object.assign({}, filter)
  }
}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, peyload) => {
      state[key] = peyload
    }
  }
})

const mutations: MutationTree<IProjectsState> = {
  ..._mutations
}

export default mutations
