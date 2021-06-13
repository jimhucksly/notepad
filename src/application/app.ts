import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import _fsm, { toStr } from '~/application/fsm'
import FsmStates from '~/application/fsm.states'
import { userDataFileName } from '~/constants'
import { AuthCommand } from '~/domain/commands'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { OAuthQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'

const AppComponents = {
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
      return
    }
    if(AppComponents[this.stateName]) {
      this.go()
    }
  }

  go() {
    this._store.commit('setPrevTransition', this._store.getters.getFsmState)
    this._store.commit('setFsmState', this.state)
  }

  goBack() {
    const prevTransition = this._store.getters.getPrevTransition
    if(prevTransition) {
      this.goto(prevTransition)
    }
  }

  goHome() {
    this.goto(FsmStates.Projects)
  }

  get fsm() {
    return _fsm
  }

  get state() {
    return FsmStates[this.fsm.state]
  }

  get stateName() {
    return toStr(this.state)
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

  get component() {
    return AppComponents[this.stateName] || ''
  }

  private getTransitionFunc(transition: symbol): () => Promise<boolean> {
    const func = this.fsm[toStr(transition).toLowerCase()]
    if(!func) {
      throw new Error(`The transition ${toStr(transition)} is not exist in FSM`)
    }
    return func
  }
}
