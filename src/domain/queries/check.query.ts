import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import { ICommandBus, IQueryHandler } from '~/domain/interfaces'
import { ICheckResponse, IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { CheckCommand } from '~/domain/commands'

export class CheckQuery {}

@injectable()
export class CheckQueryHandler implements IQueryHandler<CheckQuery, void> {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  timeout: NodeJS.Timeout | null = null

  get isDevelopment(): boolean {
    return this._store.getters.getIsDevelopment
  }

  get isAuth(): boolean {
    return this._store.getters.getIsAuth
  }

  exec(query: CheckQuery): Promise<void> {
    if(this.isDevelopment || !this.isDevelopment) {
      return void 0
    }
    const duration = this.isDevelopment ? 6000 : 3000
    if(!this.isAuth) {
      this.timeout && clearTimeout(this.timeout)
      return Promise.reject()
    }
    this.timeout = setTimeout(async (): Promise<void> => {
      try {
        const resp: ICheckResponse = await this._commandBus.do(new CheckCommand())
        this._store.commit('setError', false)
        if(!resp) {
          return void 0
        }
        this._store.commit('projects/setJson', resp.json)
        this._store.commit('events/setEvents', resp.events)
        this._store.commit('links/setLinks', resp.links)
        this._store.commit('todo/setTodo', resp.todo)
      } catch(e) {
        this._store.commit('setError', true)
        /* eslint-disable no-console */
        console.error(e)
      } finally {
        this.exec(query)
      }
    }, duration)
    return void 0
  }
}
