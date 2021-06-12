import { Container, inject, injectable } from 'inversify'
import { Store } from 'vuex'
import _fsm, { StateMachine, toStr } from '~/application/fsm'
import States from '~/application/states'
import { AuthCommand } from '~/domain/commands'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'
import { userDataFileName } from '~/constants'

@injectable()
export default class Application {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  _transition: symbol = States.None
  _transitionKey = ''

  init() {
    this._store.commit('setIsDevelopment', this.isDev)
  }

  loading(state: boolean) {
    this._store.commit('setLoading', state)
  }

  login() {
    if(this.isAuth) {
      return
    }
    this._commandBus.do<AuthCommand, void>(new AuthCommand(true))
    this.goHome()
  }

  logout() {
    this._commandBus.do<AuthCommand, void>(new AuthCommand(false))
    this._store.commit('setToken', null)
    const userDataPath = this._store.getters.getUserDataPath
    storage.set(userDataPath, userDataFileName, { token: '' })
  }

  async goto(transition: symbol) {
    const func = this.getTransitionFunc(transition)
    const transitionResult: boolean = await func.call(this.fsm)
    console.log('transition complete:  ->', this.state)
    if(!transitionResult) {
      return
    }
    if(transition === States.None) {
      this.logout()
    } else {
      this.go()
    }
  }

  go() {
    this._commandBus.do<NavigateCommand, void>(new NavigateCommand(this.state))
  }

  goBack() {
    const prevPage = this._store.getters.getPreviousPage
    const transition = States[prevPage]
    if(transition) {
      this.goto(transition)
    }
  }

  goHome() {
    this.goto(States.Projects)
  }

  get fsm(): typeof StateMachine {
    return _fsm
  }

  get state() {
    return this.fsm.state
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

  private getTransitionFunc(transition: symbol): () => Promise<boolean> {
    this._transition = transition
    this._transitionKey = toStr(transition).toLowerCase()
    const func = this.fsm[this._transitionKey]
    if(!func) {
      this._transition = States.None
      this._transitionKey = ''
      throw new Error(`The transition ${toStr(transition)} is not exist in FSM`)
    }
    return func
  }
}
