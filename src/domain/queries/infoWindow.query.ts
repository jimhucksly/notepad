import { DialogManager, InfoDialog } from '@dn-web/ui';
import { injectable } from 'inversify';
import { IQueryHandler } from '../interfaces';

export class InfoWindowQuery {
  title: string = null;
  component: string = null;
  componentProps: Record<string, unknown> = {};

  constructor(data: { title: string; component: string; componentProps?: Record<string, unknown> }) {
    this.title = data.title;
    this.component = data.component;
    this.componentProps = data.componentProps ? data.componentProps : {};
  }
}

@injectable()
export class InfoWindowQueryHandler implements IQueryHandler<InfoWindowQuery, void> {
  exec(query: InfoWindowQuery): Promise<void> {
    return DialogManager.exec(
      new InfoDialog({
        title: query.title,
        component: query.component,
        componentProps: query.componentProps,
      })
    );
  }
}
