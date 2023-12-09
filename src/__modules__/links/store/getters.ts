import { GetterTree } from 'vuex'
import { Types } from '~/core'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'
import { ILinksState } from '../models'

const getters: GetterTree<ILinksState, Types.IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key as keyof ILinksState]
    }
  }
})

export default getters
