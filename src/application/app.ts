import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import { userDataFileName } from '~/constants'
import { AuthCommand } from '~/domain/commands'
import { ICommandBus, IManifest, IQueryBus } from '~/domain/interfaces'
import { IMenu, IRootState, IUser } from '~/domain/models'
import {
  RefreshYandexTokenQuery,
  SessionQuery
} from '~/domain/queries'
import { bindings } from '~/domain/types'
import storage from '~/plugins/storage'

interface LifeCycle {
  transition: string
  from: string
  to: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  prevResult?: any
}

interface IStates {
  [key: string]: symbol
}

const StateMachine = require('javascript-state-machine')

let _fsm: typeof StateMachine = null

let States: IStates = {
  Auth: Symbol.for('Auth'),
  Reg: Symbol.for('Reg'),
  Reset: Symbol.for('Reset'),
  Verify: Symbol.for('Verify'),
  Yandex: Symbol.for('Yandex'),
  Account: Symbol.for('Account'),
  Preferences: Symbol.for('Preferences'),
  CreateEdit: Symbol.for('CreateEdit'),
  InfoWindow: Symbol.for('InfoWindow'),
  ConfirmWindow: Symbol.for('ConfirmWindow')
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
  stateName: keyof typeof States
  lastState: keyof typeof States
  isDev: boolean
  isAuth: boolean
  userDataPath: string
}

export const toStr = (s: symbol): string => Symbol.keyFor(s)

const appComponents = {
  [toStr(States.Account)]: 'Account',
  [toStr(States.Preferences)]: 'Preferences'
}

function buildStates(manifest: IManifest) {
  const result: Record<string, symbol> = {}
  for (const item of manifest.main) {
    result[item.name] = Symbol.for(item.name)
  }
  return {
    ...result,
    ...States
  }
}

function buildMenu(manifest: IManifest) {
  const result: Array<IMenu> = []
  const len = result.length
  let index = 1
  for (const item of manifest.main) {
    result.push({
      name: item.name,
      nameAlt: item.nameAlt,
      fsmState: States[item.name as keyof typeof States],
      id: len + index
    })
    index++
  }
  return result
}

function buildSections(manifest: IManifest) {
  const result: Record<string, boolean> = {}
  Object.keys(appComponents).forEach(key => {
    result[key] = false
  })
  for (const item of manifest.main) {
    result[toStr(States[item.name as keyof typeof States])] = false
  }
  return result
}

function onBeforeTransition(lifecycle: LifeCycle) {
  // console.log('onBeforeTransition', lifecycle)
}

@injectable()
export default class Application implements IApplication {
  constructor(
    @inject(bindings.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(bindings.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(bindings.Store) private readonly _store: Store<IRootState>
  ) { }

  history: Array<keyof typeof States> = []
  currentUser: IUser = null

  get states() {
    States = buildStates(this.$manifest)
    return States
  }

  get homeState() {
    return States.Projects
  }

  get fsm() {
    return _fsm
  }

  init() {
    _fsm = new StateMachine({
      observeUnchangedState: true,
      init: toStr(States.Auth),
      transitions: Object.keys(this.states).map(key => ({
        name: key.toLowerCase(),
        from: '*',
        to: toStr(this.states[key as keyof typeof States])
      })),
      methods: {
        onBeforeTransition: onBeforeTransition.bind(this)
      }
    })

    this._store.commit('setMenu', buildMenu(this.$manifest))
    this._store.commit('setSections', buildSections(this.$manifest))
    this._store.commit('setIsDevelopment', this.isDev)
    this._store.commit('setEndpoint', $ENDPOINT)
    this._store.commit('setUserDataPath', this.userDataPath)
    this._store.commit('setFsmState', States.Auth)
  }

  loading(state: boolean) {
    this._store.commit('setLoading', state)
  }

  async login(token: string) {
    if (this.isAuth) {
      return
    }
    try {
      this.loading(true)
      this._store.commit('setToken', token)
      const userDataPath = this._store.getters.getUserDataPath
      await storage.set(userDataPath, userDataFileName, { token: token })
      await this._queryBus.exec(new SessionQuery())
      this._commandBus.do<AuthCommand, void>(new AuthCommand(true))
      this.user(this._store.getters.getCurrentUser)
      if (!this.currentUser.yandexDiskAccessToken) {
        this.goto(States.Yandex)
        return
      }
      await Promise.all([
        // this._queryBus.exec<ProjectsQuery, IProjects>(new ProjectsQuery())
        // this._queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
      ])
      this._queryBus.exec(new RefreshYandexTokenQuery())
      this.goHome()
    } catch (e) {
      if (e?.message) {
        throw new Error('Authentication is failed')
      }
      throw new Error(e)
    } finally {
      this.loading(false)
    }
  }

  async logout() {
    const userDataPath = this._store.getters.getUserDataPath
    await storage.set(userDataPath, userDataFileName, { token: '' })
    this.goto(States.Auth)
    this.loading(false)
  }

  user(data: IUser) {
    this.currentUser = data
    this._store.commit('setCurrentUser', data)
  }

  async goto(transition: symbol) {
    if (this.state === transition) {
      return
    }
    try {
      const func = this.getTransitionFunc(transition)
      const transitionResult: boolean = await func.call(this.fsm)
      if (!transitionResult) {
        return
      }
      this._store.commit('setFsmState', transition)
      if (transition === States.Auth) {
        if (this.isAuth) {
          this._commandBus.do<AuthCommand, void>(new AuthCommand(false))
          this._store.commit('setToken', null)
          const userDataPath = this._store.getters.getUserDataPath
          storage.set(userDataPath, userDataFileName, { token: '' })
          this.history = []
          this._store.commit('setHistory', [])
          this._store.commit('setComponent', null)
        }
        return
      }
      if (this.lastState !== this.stateName) {
        this.setHistory()
      }
      if (this.stateName in this.sections) {
        this._store.commit('setComponent', this.stateName)
        this.history = this.history.filter(item => item in this.sections)
      }
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  goBack() {
    if (this.history.length === 1) {
      if (this.state === States.Projects) {
        return
      }
      this.goto(States.Projects)
      return
    }
    this.history.splice(-1, 1)
    this._store.commit('setHistory', [...this.history])
    this.goto(States[this.lastState])
  }

  goHome() {
    const state = process.env.NODE_ENV === 'production' ? States.Projects : this.homeState
    this.history.push(toStr(state as unknown as symbol))
    this.goto(state)
  }

  setHistory() {
    this.history.push(this.stateName)
    this._store.commit('setHistory', [...this.history])
  }

  async reload() {
    try {
      this.loading(true)
      await Promise.all([
        // this._queryBus.exec<ProjectsQuery, IProjects>(new ProjectsQuery())
        // this._queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
      ])
      setTimeout(() => {
        this.loading(false)
      }, 1000)
    } catch (e) {
      this.loading(false)
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  get $queryBus(): IQueryBus {
    return this._queryBus
  }

  get $commandBus(): ICommandBus {
    return this._commandBus
  }

  get $manifest() {
    return this._store.getters.getManifest
  }

  get state(): symbol {
    return States[this.fsm.state as keyof typeof States]
  }

  get stateName(): keyof typeof States {
    return toStr(this.state)
  }

  get lastState(): keyof typeof States {
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

  get sections(): Record<string, string> {
    return this._store.getters.getSections
  }

  get userDataPath() {
    return process.env.USER_DATA_PATH
  }

  private getTransitionFunc(transition: symbol): () => Promise<boolean> {
    const func = this.fsm[toStr(transition).toLowerCase()]
    if (!func) {
      throw new Error(`The transition ${toStr(transition)} is not exist in FSM`)
    }
    return func
  }
}

export const FsmStates = States
