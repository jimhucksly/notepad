import { GetterTree } from 'vuex'
import { IFilesState, IRootState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const getters: GetterTree<IFilesState, IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key]
    }
  }
})

export default getters
