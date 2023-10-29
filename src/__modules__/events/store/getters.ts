import { GetterTree } from 'vuex'
import { IRootState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'
import { IEventsState } from '../models'

const getters: GetterTree<IEventsState, IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key as keyof IEventsState]
    }
  }
})

export default getters
