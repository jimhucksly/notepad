import { injectable } from 'inversify';
import { FsmStates } from '~/application/app';
import { Hub } from '~/plugins/hub';
import { IQueryHandler } from '../interfaces';
import { IPopupWindowQuery } from '../models';

export class InfoWindowQuery implements IPopupWindowQuery<void> {
  component;
  modal;
  fsmState = FsmStates.InfoWindow;
  constructor({ component, modal }: IPopupWindowQuery<void>) {
    this.component = component;
    this.modal = modal;
  }
}

@injectable()
export class InfoWindowQueryHandler implements IQueryHandler<InfoWindowQuery, void> {
  async exec(query: InfoWindowQuery): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        query.modal.resolveFunction = resolve as (value: unknown) => Promise<void>;
        Hub.$emit('open-dialog', query);
      }, 100);
    });
  }
}
