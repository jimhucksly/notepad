import { inject, injectable } from 'inversify'
import { Store } from 'vuex'
import { userDataFileName } from '~/constants'
import { AuthCommand } from '~/domain/commands'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { ICommandBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'

@injectable()
export default class Transitions {
  constructor(
    @inject(TYPES.Store) private readonly store: Store<IRootState>,
    @inject(TYPES.CommandBus) private readonly commandBus: ICommandBus
  ) {}

  preferences = this.toPreferences.bind(this)
  none = this.logout.bind(this)

  logout() {
    this.commandBus.do<AuthCommand, void>(new AuthCommand(false))
    this.store.commit('setToken', null)
    const userDataPath = this.store.getters.getUserDataPath
    storage.set(userDataPath, userDataFileName, { token: '' })
  }

  toPreferences() {
    this.commandBus.do<NavigateCommand, void>(new NavigateCommand('preferences'))
  }
}
