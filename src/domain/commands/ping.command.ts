import { inject, injectable } from 'inversify'
import { ICommandHandler, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'
import { PingCommand } from '.'
import { delay } from '~/helpers'

@injectable()
export class PingCommandHandler implements ICommandHandler<PingCommand, void> {
  interval: NodeJS.Timeout

  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  get isDev(): boolean {
    return this._store.getters.getIsDevelopment
  }

  async do(command: PingCommand): Promise<void> {
    if(this.isDev) {
      return
    }
    if(command.param) {
      await delay(0)
      this.interval = setInterval(async (): Promise<void> => {
        try {
          await this._queryBus.exec<PingCommand, string>(command)
          this._store.commit('setError', false)
        } catch(e) {
          this._store.commit('setError', true)
        }
      }, 3000)
    } else {
      clearInterval(this.interval)
    }
  }
}
