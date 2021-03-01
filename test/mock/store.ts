import { ActionContext, Store, StoreOptions } from 'vuex'
import { IEvents } from '../../src/domain/models'

const storeOptions: StoreOptions<Record<string, unknown>> = {
  strict: true,
  state: {
    events: null
  },
  actions: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    actionGetEvents(store: ActionContext<any, any>) {
      store.commit('setEvents', {
        '01.12.2020': {
          title: 'Winter',
          content: 'Winter is coming'
        }
      })
    }
  },
  mutations: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    setEvents(state: any, data: IEvents) {
      state.events = data
    }
  },
  getters: {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    getEvents(state: any): IEvents {
      return state.events
    }
  }
}

const store = new Store<Record<string, unknown>>(storeOptions)

export default store
