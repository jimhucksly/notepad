import { Container, inject, injectable } from 'inversify'
import { Store } from 'vuex'
import _fsm, { StateMachine, toStr } from '~/application/fsm'
import Transitions from '~/application/transitions'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import States from './states'

@injectable()
export default class Application {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus,
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>,
    @inject(TYPES.Transitions) private readonly _transitions: Transitions
  ) {}

  _transition: symbol = States.None
  _transitionKey = ''

  init() {
    this._store.commit('setIsDevelopment', this.isDev)
  }

  loading(state: boolean) {
    this._store.commit('setLoading', state)
  }

  async goto(transition: symbol) {
    const func = this.getTransitionFunc(transition)
    const transitionResult: boolean = await func.call(this.fsm)
    console.log('transition complete:  ->', this.state)
    if(!transitionResult) {
      return
    }
    this._transitions[this._transitionKey]()
  }

  get fsm(): typeof StateMachine {
    return _fsm
  }

  get state() {
    return this.fsm.state
  }

  get isDev() {
    return (
      process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test'
    )
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
