import { CreateEditDialog, DialogManager } from '@dn-web/ui';
import { injectable } from 'inversify';
import { IQueryHandler } from '~/domain/interfaces';

export class CreateEditQuery {
  title: string = null;
  component: string = null;
  componentProps?: Record<string, unknown> & { model: unknown } = {
    model: null,
  };
  width?: string = null;

  constructor(data: {
    title: string;
    component: string;
    componentProps: Record<string, unknown> & { model: unknown };
    width: string;
  }) {
    this.title = data.title;
    this.component = data.component;
    this.componentProps = data.componentProps
      ? {
          model: data.componentProps.model ? data.componentProps.model : null,
          ...data.componentProps,
        }
      : {
          model: null,
        };
    this.width = data.width;
  }
}

@injectable()
export class CreateEditQueryHandler<T> implements IQueryHandler<CreateEditQuery, T> {
  exec(query: CreateEditQuery): Promise<T> {
    return DialogManager.exec(
      new CreateEditDialog({
        title: query.title,
        component: query.component,
        componentProps: query.componentProps,
        width: query.width,
      })
    );
  }
}
