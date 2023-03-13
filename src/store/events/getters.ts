import { GetterTree } from 'vuex'
import { IRootState, IEventsState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const getters: GetterTree<IEventsState, IRootState> = {}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key]
    }
  }
})

export default getters
