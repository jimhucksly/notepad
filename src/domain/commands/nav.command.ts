import { inject, injectable } from 'inversify'
import { ICommand } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'

export class NavigateCommand {
  constructor(public page: string) {}
}

@injectable()
export class NavigateCommandHandler implements ICommand<void> {
  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  do<NavigateCommand>(command: NavigateCommand): void {
    this._store.commit('setPreviousPage', this._store.getters.getFsmState)
    const _command = (command as unknown) as Record<string, unknown>
    this._store.commit('setFsmState', _command.page)
  }
}
