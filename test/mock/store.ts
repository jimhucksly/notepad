import { ActionContext, Store, StoreOptions } from "vuex"
import { IEvents } from "~/domain/models"

const storeOptions: StoreOptions<{}> = {
  strict: true,
  state: {
    events: null
  },
  actions: {
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
    setEvents(state: any, data: IEvents) {
      state.events = data
    }
  },
  getters: {
    getEvents(state: any): IEvents {
      return state.events
    }
  }
}

const store = new Store<{}>(storeOptions)

export default store
