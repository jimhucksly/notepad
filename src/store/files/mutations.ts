import { MutationTree } from 'vuex'
import { IFilesState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const _mutations: MutationTree<IFilesState> = {}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, peyload) => {
      state[key] = peyload
    }
  }
})

const mutations: MutationTree<IFilesState> = {
  ..._mutations
}

export default mutations
