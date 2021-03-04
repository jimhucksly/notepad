import { ActionContext, Store, StoreOptions } from 'vuex'
import { IEvents } from '../../src/domain/models'

interface IMockState {
  isAuth: boolean
  loading: boolean
  events: IEvents
}

const storeOptions: StoreOptions<IMockState> = {
  strict: true,
  state: {
    isAuth: false,
    loading: false,
    events: null
  },
  actions: {
    actionCheck() {
      return false
    },
    error() {
      return false
    },
    actionGetEvents(store: ActionContext<IMockState, IMockState>) {
      store.commit('setEvents', {
        '01.12.2020': {
          title: 'Winter',
          content: 'Winter is coming'
        }
      })
    }
  },
  mutations: {
    setIsAuth(state: IMockState, flag: boolean) {
      state.isAuth = flag
    },
    setLoading(state: IMockState, flag: boolean) {
      state.loading = flag
    },
    setEvents(state: IMockState, data: IEvents) {
      state.events = data
    }
  },
  getters: {
    getIsAuth(state: IMockState): boolean {
      return state.isAuth
    },
    getLoading(state: IMockState): boolean {
      return state.loading
    },
    getEvents(state: IMockState): IEvents {
      return state.events
    }
  }
}

const store = new Store<IMockState>(storeOptions)

export default store
