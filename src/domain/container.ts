import { Container } from 'inversify'
import { Store } from 'vuex'
import Application from '~/application/app'
import CommandBus from '~/domain/commands/command.bus'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import QueryBus from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import store from '~/store'
import mockStore from '../../test/mock/store'
import { ConfirmWindowQueryHandler } from './queries/confirmWindow.query'
import { InfoWindowQueryHandler } from './queries/infoWindow.query'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let _store: Store<any> = null
if (process.env.NODE_ENV === 'test') {
  _store = mockStore
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
// type TAnyResult = any

const _container = new Container()
_container.bind<Container>(TYPES.Container).toConstantValue(_container)
/* ------------ appliation ------------ */
_container.bind<Application>(TYPES.Application).to(Application).inSingletonScope()
/* ------------ domain ------------ */
_container.bind<IQueryBus>(TYPES.QueryBus).to(QueryBus)
_container.bind<IQueryBus>(QueryBus).toSelf()
_container.bind<ICommandBus>(TYPES.CommandBus).to(CommandBus)
_container.bind<CommandBus>(CommandBus).toSelf()
/* ------------ store ------------ */
_container.bind<Store<IRootState>>(TYPES.Store).toConstantValue(_store || store)
/* ------------ queries ------------ */
_container.bind<InfoWindowQueryHandler>(TYPES.InfoWindowQuery).to(InfoWindowQueryHandler).inSingletonScope()
_container.bind<ConfirmWindowQueryHandler>(TYPES.ConfirmWindowQuery).to(ConfirmWindowQueryHandler).inSingletonScope()
/* ------------ commands ------------ */
/* ---------------------------------- */

export {
  _container
}
