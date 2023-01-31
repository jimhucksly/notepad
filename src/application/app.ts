import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import _fsm, { toStr } from '~/application/fsm'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
import { userDataFileName } from '~/constants'
import { AuthCommand } from '~/domain/commands'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IJson, IRootState, IUser } from '~/domain/models'
import {
  LibraryFileQuery,
  ProjectsQuery,
  SessionQuery,
  StartQuery
} from '~/domain/queries'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'
import { endpoint } from '../../config/endpoint.json'

interface IAppComponents {
  Projects: string
  Preferences: string
  Library: string
  Events: string
  JsonViewer: string
  Links: string
  Todo: string
}

export const AppComponents = {
  [toStr(FsmStates.Account)]: 'Account',
  [toStr(FsmStates.Projects)]: 'Projects',
  [toStr(FsmStates.Preferences)]: 'Preferences',
  [toStr(FsmStates.Library)]: 'Library',
  [toStr(FsmStates.Events)]: 'Events',
  [toStr(FsmStates.JsonViewer)]: 'JsonViewer',
  [toStr(FsmStates.Links)]: 'Links',
  [toStr(FsmStates.Todo)]: 'Todo'
}

export interface IApplication {
  init: () => void
  loading: (state: boolean) => void
  login: (token: string) => Promise<void>
  logout: () => void
  user: (data: IUser) => void
  goto: (transition: symbol) => Promise<void>
  goBack: () => void
  goHome: () => void
  setHistory: () => void
  reload: () => Promise<void>
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  fsm: any
  state: symbol
  stateName: keyof IFsmStates
  lastState: keyof IFsmStates
  isDev: boolean
  isAuth: boolean
  component: keyof IAppComponents
  userDataPath: string
}

@injectable()
export default class Application implements IApplication {
  constructor(
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  homeState = FsmStates.Projects
  history: Array<keyof IFsmStates> = []
  currentUser: IUser = null

  init() {
    this._store.commit('setIsDevelopment', this.isDev)
    if(this.isDev) {
      this._store.commit('setEndpoint', '127.0.0.1:8000')
    } else {
      this._store.commit('setEndpoint', endpoint)
    }
    this._store.commit('setUserDataPath', this.userDataPath)
  }

  loading(state: boolean) {
    this._store.commit('setLoading', state)
  }

  async login(token: string) {
    if(this.isAuth) {
      return
    }
    try {
      this._store.commit('setToken', token)
      const userDataPath = this._store.getters.getUserDataPath
      await storage.set(userDataPath, userDataFileName, { token: token })
      await this._queryBus.exec<StartQuery, void>(new StartQuery())
      this._commandBus.do<AuthCommand, void>(new AuthCommand(true))
      this.goHome()
    } catch(e) {
      throw new Error('Authentication is failed')
    }
  }

  logout() {
    this.goto(FsmStates.None)
  }

  user(data: IUser) {
    this.currentUser = data
    this._store.commit('setCurrentUser', data)
  }

  async goto(transition: symbol) {
    if(this.state === transition) {
      return
    }
    try {
      const func = this.getTransitionFunc(transition)
      const transitionResult: boolean = await func.call(this.fsm)
      if(!transitionResult) {
        return
      }
      if(transition === FsmStates.None) {
        this._commandBus.do<AuthCommand, void>(new AuthCommand(false))
        this._store.commit('setToken', null)
        const userDataPath = this._store.getters.getUserDataPath
        storage.set(userDataPath, userDataFileName, { token: '' })
        this.history = []
        this._store.commit('setHistory', [])
        return
      }
      this._store.commit('setFsmState', this.state)
      if(this.lastState !== this.stateName) {
        this.setHistory()
      }
      if(AppComponents[this.stateName]) {
        this._store.commit('setComponent', AppComponents[this.stateName])
        this.history = this.history.filter(item => item in AppComponents)
      }
    } catch(e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  goBack() {
    if(this.history.length === 1) {
      if(this.state === FsmStates.Projects) {
        return
      }
      this.goto(FsmStates.Projects)
      return
    }
    this.history.splice(-1, 1)
    this._store.commit('setHistory', [...this.history])
    this.goto(FsmStates[this.lastState])
  }

  goHome() {
    const state = process.env.NODE_ENV === 'production' ? FsmStates.Projects : this.homeState
    this.history.push(toStr(state))
    this.goto(state)
  }

  setHistory() {
    this.history.push(this.stateName)
    this._store.commit('setHistory', [...this.history])
  }

  async reload() {
    try {
      this.loading(true)
      const token = this._store.getters.getToken
      await this._queryBus.exec(new SessionQuery(token))
      // await this._queryBus.exec<RefreshYandexTokenQuery, boolean>(
      //   new RefreshYandexTokenQuery(Number(this.currentUser.id))
      // )
      // await this._queryBus.exec(new YandexTokenQuery(111, Number(this.currentUser.id)))
      await Promise.all([
        this._queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
        this._queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
        // this._queryBus.exec<EventsQuery, Array<IEvent>>(new EventsQuery())
        // this._queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
      ])
      setTimeout(() => {
        this.loading(false)
      }, 1500)
    } catch(e) {
      this.loading(false)
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  get fsm() {
    return _fsm
  }

  get state(): symbol {
    return FsmStates[this.fsm.state]
  }

  get stateName(): keyof IFsmStates {
    return toStr(this.state)
  }

  get lastState(): keyof IFsmStates {
    return this.history[this.history.length - 1]
  }

  get isDev(): boolean {
    return (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    )
  }

  get isAuth(): boolean {
    return this._store.getters.getIsAuth
  }

  get component(): keyof IAppComponents {
    return AppComponents[this.stateName] as keyof IAppComponents
  }

  get userDataPath() {
    return process.env.USER_DATA_PATH
  }

  private getTransitionFunc(transition: symbol): () => Promise<boolean> {
    const func = this.fsm[toStr(transition).toLowerCase()]
    if(!func) {
      throw new Error(`The transition ${toStr(transition)} is not exist in FSM`)
    }
    return func
  }
}
