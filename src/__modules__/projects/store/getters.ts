import { Types } from '~/core'
import { stateKeys } from './state'
import { upperFirst } from '~/helpers'
import { GetterTree } from 'vuex'
import { IProjectsState } from '../models'

const getters: GetterTree<IProjectsState, Types.IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key as keyof IProjectsState]
    }
  }
})

export default getters

