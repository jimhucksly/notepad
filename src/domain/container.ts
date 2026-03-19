import { Container } from 'inversify';
import Application from '~/application/app';
import CommandBus from '~/domain/commands/command.bus';
import { ICommandBus, IQueryBus } from '~/domain/interfaces';
import QueryBus from '~/domain/queries/query.bus';
import { bindings } from '~/domain/types';
import { ConfirmWindowQueryHandler } from './queries/confirmWindow.query';
import { CreateEditQueryHandler } from './queries/createEdit.query';
import { InfoWindowQueryHandler } from './queries/infoWindow.query';

function buildContainer() {
  const _container = new Container();
  _container.bind<Container>(bindings.Container).toConstantValue(_container);
  /* ------------ appliation ------------ */
  _container.bind<Application>(bindings.Application).to(Application).inSingletonScope();
  /* ------------ domain ------------ */
  _container.bind<IQueryBus>(bindings.QueryBus).to(QueryBus);
  _container.bind<IQueryBus>(QueryBus).toSelf();
  _container.bind<ICommandBus>(bindings.CommandBus).to(CommandBus);
  _container.bind<CommandBus>(CommandBus).toSelf();
  /* ------------ queries ------------ */
  _container.bind<InfoWindowQueryHandler>(bindings.InfoWindowQuery).to(InfoWindowQueryHandler).inSingletonScope();
  _container
    .bind<ConfirmWindowQueryHandler>(bindings.ConfirmWindowQuery)
    .to(ConfirmWindowQueryHandler)
    .inSingletonScope();
  _container
    .bind<CreateEditQueryHandler<unknown>>(bindings.CreateEditQuery)
    .to(CreateEditQueryHandler)
    .inSingletonScope();
  /* ------------ commands ------------ */
  /* ---------------------------------- */

  return _container;
}

export { buildContainer };
