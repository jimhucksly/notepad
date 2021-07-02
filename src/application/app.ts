import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import _fsm, { toStr } from '~/application/fsm'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
import { userDataFileName } from '~/constants'
import { AuthCommand } from '~/domain/commands'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { OAuthQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'

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
  [toStr(FsmStates.Projects)]: 'Projects',
  [toStr(FsmStates.Preferences)]: 'Preferences',
  [toStr(FsmStates.Library)]: 'Library',
  [toStr(FsmStates.Events)]: 'Events',
  [toStr(FsmStates.JsonViewer)]: 'JsonViewer',
  [toStr(FsmStates.Links)]: 'Links',
  [toStr(FsmStates.Todo)]: 'Todo'
}

@injectable()
export default class Application {
  constructor(
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  homeState = FsmStates.Projects

  history: Array<keyof IFsmStates> = []

  init() {
    this._store.commit('setIsDevelopment', this.isDev)
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
      await this._queryBus.exec<OAuthQuery, void>(new OAuthQuery())
      this._commandBus.do<AuthCommand, void>(new AuthCommand(true))
      this.goHome()
    } catch(e) {
      throw new Error('Authentication is failed')
    }
  }

  logout() {
    this.goto(FsmStates.None)
  }

  async goto(transition: symbol) {
    if(this.state === transition) {
      return
    }
    try {
      const func = this.getTransitionFunc(transition)
      const transitionResult: boolean = await func.call(this.fsm)
      console.log('transition complete:  ->', this.state)
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
      }
    } catch(e) {
      console.log(e)
    }
  }

  goBack() {
    if(this.history.length === 1) {
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

  private getTransitionFunc(transition: symbol): () => Promise<boolean> {
    const func = this.fsm[toStr(transition).toLowerCase()]
    if(!func) {
      throw new Error(`The transition ${toStr(transition)} is not exist in FSM`)
    }
    return func
  }
}
