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
  const container = new Container();
  container.bind<Container>(bindings.Container).toConstantValue(container);
  /* ------------ appliation ------------ */
  container.bind<Application>(bindings.Application).to(Application).inSingletonScope();
  /* ------------ domain ------------ */
  container.bind<IQueryBus>(bindings.QueryBus).to(QueryBus);
  container.bind<IQueryBus>(QueryBus).toSelf();
  container.bind<ICommandBus>(bindings.CommandBus).to(CommandBus);
  container.bind<CommandBus>(CommandBus).toSelf();
  /* ------------ queries ------------ */
  container
    .bind<ConfirmWindowQueryHandler>(bindings.ConfirmWindowQuery)
    .to(ConfirmWindowQueryHandler)
    .inSingletonScope();
  container.bind<InfoWindowQueryHandler>(bindings.InfoWindowQuery).to(InfoWindowQueryHandler).inSingletonScope();
  container
    .bind<CreateEditQueryHandler<unknown>>(bindings.CreateEditQuery)
    .to(CreateEditQueryHandler)
    .inSingletonScope();
  /* ------------ commands ------------ */

  return container;
}

export { buildContainer };
