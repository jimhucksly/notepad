import { MutationTree } from 'vuex'
import { ILibraryFile, ILibraryState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const _mutations: MutationTree<ILibraryState> = {
  setLibraryFiles(state: ILibraryState, files: Array<ILibraryFile>) {
    state.libraryFiles = []
    state.libraryFiles = files
  }
}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof ILibraryState] = payload
    }
  }
})

const mutations: MutationTree<ILibraryState> = {
  ..._mutations
}

export default mutations
