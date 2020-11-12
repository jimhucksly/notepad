import { inject, injectable } from 'inversify'
import { ICommand, IQueryBus, Command } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'

export class PingCommand extends Command {
  param = false

  constructor(param: boolean) {
    super()
    this.param = param
    this.NAME = 'PingCommand'
  }
}

@injectable()
export class PingCommandHandler implements ICommand {
  interval: any

  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>,
    @inject(TYPES.QueryBus) private readonly _queryBus: IQueryBus
  ) {}

  get isDev() {
    return this._store.getters.getIsDevelopment
  }

  do<TCommand>(command: TCommand) {
    const _command: any = {
      ...command
    }

    if(!this.isDev) {
      if(_command.param) {
        this.interval = setInterval(async () => {
          const resp = await this._queryBus.exec(command)
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
