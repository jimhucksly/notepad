import { injectable } from 'inversify';
import { FsmStates } from '~/application/app';
import { IQueryHandler } from '~/domain/interfaces';
import { IPopupWindowQuery } from '~/domain/models';
import { Hub } from '~/plugins/hub';

export class CreateEditQuery<T> implements IPopupWindowQuery<T> {
  component: string = null;
  componentProps: IPopupWindowQuery<T>['componentProps'] = {};
  modal: IPopupWindowQuery<T>['modal'] = {
    title: '',
    width: '',
  };
  fsmState = FsmStates.CreateEdit;
  constructor(public params: IPopupWindowQuery<T>) {
    this.component = params.component;
    this.componentProps = params.componentProps;
    this.modal = params.modal;
  }
}

@injectable()
export class CreateEditQueryHandler<R> implements IQueryHandler<CreateEditQuery<R>, R> {
  async exec(query: CreateEditQuery<R>): Promise<R> {
    return new Promise(resolve => {
      setTimeout(() => {
        query.modal.resolveFunction = resolve as (value: unknown) => Promise<R>;
        Hub.$emit('open-dialog', query);
      }, 100);
    });
  }
}
