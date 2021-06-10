import stateKeys from './stateKeys'
import { upperFirst } from '~/helpers'
import { IRootState, IJson, IFilters, IEvents } from '~/domain/models'

interface IMutations {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (state: IRootState, data: any) => void
}

const _mutations: IMutations = {
  setJson(state: IRootState, json: IJson) {
    state.json = {}
    state.json = { ...json }
  },
  setEvents(state: IRootState, events: IEvents) {
    state.events = {}
    state.events = { ...events }
  },
  setFilter(state: IRootState, filter: IFilters) {
    state.filter = {}
    state.filter = Object.assign({}, filter)
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

const mutations: IMutations = {
  ..._mutations
}

export default mutations
