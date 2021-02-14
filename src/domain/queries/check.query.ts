import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import { IQuery } from '~/domain/interfaces'
import { ICheckResponse, IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'

export class CheckQuery {}

@injectable()
export class CheckQueryHandler implements IQuery<void> {
  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  timeout: NodeJS.Timeout | null = null

  get isDevelopment(): boolean {
    return this._store.getters.getIsDevelopment
  }

  get isAuth(): boolean {
    return this._store.getters.getIsAuth
  }

  exec<CheckQuery>(query: CheckQuery): Promise<void> {
    if(this.isDevelopment) {
      return void 0
    }
    const duration = this.isDevelopment ? 6000 : 3000
    if(!this.isAuth) {
      this.timeout && clearTimeout(this.timeout)
      return Promise.reject()
    }
    this.timeout = setTimeout(async (): Promise<void> => {
      try {
        const resp: ICheckResponse = await this._store.dispatch('actionCheck')
        if(!resp) {
          return void 0
        }
        this._store.dispatch('error', false)
        this._store.dispatch('json', {
          json: resp.json
        })
        this._store.dispatch('libraryData', resp.md)
        this._store.dispatch('eventsJson', resp.events)
        this._store.dispatch('linksJson', resp.links)
        this._store.dispatch('todoJson', resp.todo)
      } catch(e) {
        console.log(e)
        this._store.dispatch('error', true)
      } finally {
        this.exec(query)
      }
    }, duration)
    return void 0
  }
}
