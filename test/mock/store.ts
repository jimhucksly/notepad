import { ActionContext, Store, StoreOptions } from 'vuex'
import { IEvents, IFilters, IJson, ILink, ITreeItem } from '../../src/domain/models'

interface IMockState {
  isAuth: boolean
  loading: boolean
  json: IJson
  filter: IFilters
  libraryData: string
  libraryTree: Array<ITreeItem>
  events: IEvents
  links: Array<ILink>
  error: boolean
}

const projectMock = {
  "20180506144311": {
    key: "20180506144311",
    date: "06.05.2018, 14:43",
    name: "Winter",
    lock: false,
    message: "Winter is coming"
  }
}

const storeOptions: StoreOptions<IMockState> = {
  strict: true,
  state: {
    isAuth: false,
    loading: false,
    json: projectMock,
    filter: {},
    libraryData: '',
    libraryTree: [],
    events: null,
    links: null,
    error: false
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
    getJson(state: IMockState): IJson {
      return state.json
    },
    getFilter(state: IMockState): IFilters {
      return state.filter
    },
    getError(state: IMockState): boolean {
      return state.error
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
