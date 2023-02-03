import { MutationTree } from 'vuex'
import { ILinksState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const _mutations: MutationTree<ILinksState> = {}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, peyload) => {
      state[key] = peyload
    }
  }
})

const mutations: MutationTree<ILinksState> = {
  ..._mutations
}

export default mutations
