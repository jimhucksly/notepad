import { IProjectsState, IRootState } from '~/domain/models'
import { stateKeys } from './state'
import { upperFirst } from '~/helpers'
import { GetterTree } from 'vuex'

const getters: GetterTree<IProjectsState, IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key as keyof IProjectsState]
    }
  }
})

export default getters
