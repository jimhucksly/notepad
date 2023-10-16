import { GetterTree } from 'vuex'
import { IRootState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'
import { IFilesState } from '../models'

const getters: GetterTree<IFilesState, IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key as keyof IFilesState]
    }
  }
})

export default getters
