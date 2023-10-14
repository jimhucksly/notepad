import { Container } from 'inversify'
import Application from '~/application/app'
import CommandBus from '~/domain/commands/command.bus'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import QueryBus from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { ConfirmWindowQueryHandler } from './queries/confirmWindow.query'
import { CreateEditQueryHandler } from './queries/createEdit.query'
import { InfoWindowQueryHandler } from './queries/infoWindow.query'

function buildContainer() {
  const _container = new Container()
  _container.bind<Container>(TYPES.Container).toConstantValue(_container)
  /* ------------ appliation ------------ */
  _container.bind<Application>(TYPES.Application).to(Application).inSingletonScope()
  /* ------------ domain ------------ */
  _container.bind<IQueryBus>(TYPES.QueryBus).to(QueryBus)
  _container.bind<IQueryBus>(QueryBus).toSelf()
  _container.bind<ICommandBus>(TYPES.CommandBus).to(CommandBus)
  _container.bind<CommandBus>(CommandBus).toSelf()
  /* ------------ queries ------------ */
  _container.bind<InfoWindowQueryHandler>(TYPES.InfoWindowQuery).to(InfoWindowQueryHandler).inSingletonScope()
  _container.bind<ConfirmWindowQueryHandler>(TYPES.ConfirmWindowQuery).to(ConfirmWindowQueryHandler).inSingletonScope()
  _container.bind<CreateEditQueryHandler<unknown>>(TYPES.CreateEditQuery).to(CreateEditQueryHandler).inSingletonScope()
  /* ------------ commands ------------ */
  /* ---------------------------------- */

  return _container
}

export {
  buildContainer
}
