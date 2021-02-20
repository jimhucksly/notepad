import { Container } from 'inversify'
import { TYPES } from '~/domain/types'
import QueryBus from '~/domain/queries/query.bus'
import CommandBus from '~/domain/commands/command.bus'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import store from '~/store'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'
import { CheckQueryHandler } from '~/domain/queries/check.query'
import { PingCommandHandler } from '~/domain/commands/ping.command'
import { NavigateCommandHandler } from '~/domain/commands/nav.command'
import mockStore from '../../test/mock/store'

let _store: Store<any> = null
if(process.env.NODE_ENV === 'test') {
  _store = mockStore
}

const _container = new Container()
_container.bind<Container>(TYPES.Container).toConstantValue(_container)
_container.bind<IQueryBus>(TYPES.QueryBus).to(QueryBus)
_container.bind<IQueryBus>(QueryBus).toSelf()
_container.bind<ICommandBus>(TYPES.CommandBus).to(CommandBus)
_container.bind<CommandBus>(CommandBus).toSelf()
_container.bind<Store<IRootState>>(TYPES.Store).toConstantValue(_store || store)
/* ------------ queries ------------ */
_container.bind<CheckQueryHandler>(TYPES.CheckQuery)
  .to(CheckQueryHandler).inSingletonScope()
/* ------------ commands ------------ */
_container.bind<PingCommandHandler>(TYPES.PingCommand)
  .to(PingCommandHandler).inSingletonScope()
_container.bind<NavigateCommandHandler>(TYPES.NavigateCommand)
  .to(NavigateCommandHandler).inSingletonScope()

export {
  _container
}
