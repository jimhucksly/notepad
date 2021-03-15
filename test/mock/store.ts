import { ActionContext, Store, StoreOptions } from 'vuex'
import { SetJsonCommand } from '~/domain/commands'
import { IEvents, IFilters, IJson, ILink, ITodo, ITreeItem } from '../../src/domain/models'

interface IMockState {
  isDevelopment: boolean
  isAuth: boolean
  loading: boolean
  json: IJson
  filter: IFilters
  libraryData: string
  libraryTree: Array<ITreeItem>
  events: IEvents
  links: Array<ILink>
  todo: ITodo
  error: boolean
}

const projectMock = {
  '20180506144311': {
    key: '20180506144311',
    date: '06.05.2018, 14:43',
    name: 'Winter',
    lock: false,
    message: 'Winter is coming'
  }
}

const storeOptions: StoreOptions<IMockState> = {
  strict: true,
  state: {
    isDevelopment: true,
    isAuth: false,
    loading: false,
    json: projectMock,
    filter: {},
    libraryData: '',
    libraryTree: [],
    events: null,
    links: null,
    todo: null,
    error: false
  },
  actions: {
    actionCheck() {
      return false
    },
    error() {
      return false
    },
    actionUpdateJson() {
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
      store.commit('setLinks', {
        'CevUxZnx': {
          url: 'http://google.ru',
          name: 'Google'
        }
      })
    },
    actionGetTodo(store: ActionContext<IMockState, IMockState>) {
      store.commit('setTodo', {
        '20200803135045': {
          text: 'Winter is coming',
          'date': '03.08.2020, 13:50',
          'order': 1
        }
      })
    },
    actionUpdateTodo() {
      return false
    },
    actionRemoveTodo() {
      return false
    },
    json(store: ActionContext<IMockState, IMockState>, command: SetJsonCommand): void {
      store.commit('setJson', command.json)
    }
  },
  mutations: {
    setIsAuth(state: IMockState, flag: boolean) {
      state.isAuth = flag
    },
    setLoading(state: IMockState, flag: boolean) {
      state.loading = flag
    },
    setJson(state: IMockState, json: IJson) {
      state.json = json
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
    },
    setTodo(state: IMockState, data: ITodo) {
      state.todo = data
    }
  },
  getters: {
    getIsDevelopment(state: IMockState): boolean {
      return state.isDevelopment
    },
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
    getTodo(state: IMockState): ITodo {
      return state.todo
    },
    getDownloadsTargetPath(state: IMockState): string {
      return ''
    }
  }
}

const store = new Store<IMockState>(storeOptions)

export default store
