import { MutationTree } from 'vuex'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'
import { IEventsState, IEvents } from '../models'

const _mutations: MutationTree<IEventsState> = {
  setEvents(state: IEventsState, events: IEvents) {
    state.events = {}
    state.events = { ...events }
  }
}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof IEventsState] = payload
    }
  }
})

const mutations: MutationTree<IEventsState> = {
  ..._mutations
}

export default mutations
