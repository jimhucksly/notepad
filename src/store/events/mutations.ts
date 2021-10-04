import { MutationTree } from 'vuex'
import { IEvents, IEventsState } from '~/domain/models'
import { upperFirst } from '~/helpers'
import { stateKeys } from './state'

const _mutations: MutationTree<IEventsState> = {
  setEvents(state: IEventsState, events: IEvents) {
    state.events = {}
    state.events = { ...events }
  }
}

stateKeys.forEach(key => {
  const commitKey = 'set' + upperFirst(key)
  if(_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, peyload) => {
      state[key] = peyload
    }
  }
})

const mutations: MutationTree<IEventsState> = {
  ..._mutations
}

export default mutations
