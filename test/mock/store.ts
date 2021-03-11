import { ActionContext, Store, StoreOptions } from 'vuex'
import { IEvents, ILink, ITreeItem } from '../../src/domain/models'

interface IMockState {
  isAuth: boolean
  loading: boolean
  libraryData: string
  libraryTree: Array<ITreeItem>
  events: IEvents
  links: Array<ILink>
}

const storeOptions: StoreOptions<IMockState> = {
  strict: true,
  state: {
    isAuth: false,
    loading: false,
    libraryData: '',
    libraryTree: [],
    events: null,
    links: null
  },
  actions: {
    actionCheck() {
      return false
    },
    error() {
      return false
    },
    actionGetLibrary(store: ActionContext<IMockState, IMockState>) {
      store.commit('setLibraryData', '# Winter is comming\n## When the snows fall, and the white winds blow, the lone wolf dies, but the pack survives.')
    },
    actionGetEvents(store: ActionContext<IMockState, IMockState>) {
      store.commit('setEvents', {
        '01.12.2020': {
          title: 'Winter',
          content: 'Winter is coming'
        }
      })
    },
    actionGetLinks(store: ActionContext<IMockState, IMockState>) {
      store.commit('setLinks', [
        {
          'CevUxZnx': {
            url: 'http://google.ru',
            name: 'Google'
          }
        }
      ])
    }
  },
  mutations: {
    setIsAuth(state: IMockState, flag: boolean) {
      state.isAuth = flag
    },
    setLoading(state: IMockState, flag: boolean) {
      state.loading = flag
    },
    setLibraryData(state: IMockState, data: string) {
      state.libraryData = data
    },
    setLibraryTree(state: IMockState, tree: Array<ITreeItem>) {
      state.libraryTree = tree
    },
    setEvents(state: IMockState, data: IEvents) {
      state.events = data
    },
    setLinks(state: IMockState, data: Array<ILink>) {
      state.links = data
    }
  },
  getters: {
    getIsAuth(state: IMockState): boolean {
      return state.isAuth
    },
    getLoading(state: IMockState): boolean {
      return state.loading
    },
    getLibraryData(state: IMockState): string {
      return state.libraryData
    },
    getLibraryTree(state: IMockState): Array<ITreeItem> {
      return state.libraryTree
    },
    getEvents(state: IMockState): IEvents {
      return state.events
    },
    getLinks(state: IMockState): Array<ILink> {
      return state.links
    },
    getDownloadsTargetPath(state: IMockState): string {
      return ''
    }
  }
}

const store = new Store<IMockState>(storeOptions)

export default store
