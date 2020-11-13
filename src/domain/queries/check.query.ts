import { inject, injectable } from 'inversify'
import { Query, IQuery } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'

export class CheckQuery extends Query {
  constructor() {
    super()
    this.NAME = 'CheckQuery'
  }
}

@injectable()
export class CheckQueryHandler implements IQuery {
  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  timeout: any = null

  get isDevelopment() {
    return this._store.getters.getIsDevelopment
  }

  get isAuth() {
    return this._store.getters.getIsAuth
  }

  exec() {
    if(this.isDevelopment) {
      return
    }
    const duration = this.isDevelopment ? 6000 : 3000
    if(!this.isAuth) {
      this.timeout && clearTimeout(this.timeout)
      return
    }
    this.timeout = setTimeout(async (): Promise<any> => {
      try {
        const resp = await this._store.dispatch('actionCheck')
        if(!resp) {
          return Promise.reject()
        }
        this._store.dispatch('error', false)
        if(resp.status !== 204) {
          this._store.dispatch('json', {
            json: resp.data.data
          })
          this._store.dispatch('libraryData', resp.data.md)
          this._store.dispatch('eventsJson', resp.data.events)
          this._store.dispatch('linksJson', resp.data.links)
          this._store.dispatch('todoJson', resp.data.todo)
        }
        return null
      } catch(e) {
        console.log(e)
        this._store.dispatch('error', true)
      } finally {
        this.exec()
      }
    }, duration)
    return null
  }
}
