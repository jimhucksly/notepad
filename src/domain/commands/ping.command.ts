import { inject, injectable } from 'inversify'
import { ICommand, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'

export class PingCommand {
  constructor(public param: boolean) {}
}

@injectable()
export class PingCommandHandler implements ICommand<void> {
  interval: NodeJS.Timeout

  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  get isDev(): boolean {
    return this._store.getters.getIsDevelopment
  }

  do<PingCommand>(command: PingCommand): void {
    const _command = (command as unknown) as Record<string, unknown>
    if(!this.isDev) {
      if(_command.param) {
        this.interval = setInterval(async (): Promise<void> => {
          const resp = await this._queryBus.exec<PingCommand, string>(command)
          if(resp) {
            this._store.dispatch('error', false)
          } else {
            this._store.dispatch('error', true)
          }
        }, 3000)
      } else {
        clearInterval(this.interval)
      }
    }
  }
}
