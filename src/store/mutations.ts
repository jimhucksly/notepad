import { stateKeys } from './state'
import { upperFirst } from '~/helpers'
import { IRootState } from '~/domain/models'
import { IFsmStates } from '~/application/fsm.states'

interface IMutations {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (state: IRootState, data: any) => void
}

const _mutations: IMutations = {
  setHistory(state: IRootState, history: Array<keyof IFsmStates>) {
    state.history = []
    state.history = history
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
