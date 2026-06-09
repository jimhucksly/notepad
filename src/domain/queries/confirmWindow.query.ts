import { injectable } from 'inversify';
import { FsmStates } from '~/application/app';
import { Hub } from '~/plugins/hub';
import { IQueryHandler } from '../interfaces';
import { IPopupWindowQuery } from '../models';

export class ConfirmWindowQuery implements IPopupWindowQuery<boolean> {
  component: string = null;
  componentProps: IPopupWindowQuery<boolean>['componentProps'] = {};
  modal: IPopupWindowQuery<boolean>['modal'] = {
    title: 'Confirmation!',
    width: '35%',
  };
  fsmState = FsmStates.ConfirmWindow;
  constructor(question: string) {
    this.componentProps.question = question;
  }
}

@injectable()
export class ConfirmWindowQueryHandler implements IQueryHandler<ConfirmWindowQuery, boolean> {
  async exec(query: ConfirmWindowQuery): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        query.modal.resolveFunction = resolve as (value: unknown) => Promise<boolean>;
        Hub.$emit('open-dialog', query);
      }, 100);
    });
  }
}
