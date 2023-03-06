import { injectable } from 'inversify'
import FsmStates from '~/application/fsm.states'
import { Hub } from '~/plugins/hub'
import { IQueryHandler } from '../interfaces'
import { IPopupWindowQuery } from '../models'

export class InfoWindowQuery implements IPopupWindowQuery<void> {
  component
  modal
  fsmState: symbol
  constructor(
    {
      component,
      modal
    }: IPopupWindowQuery<void>
  ) {
    this.component = component
    this.modal = modal
  }
}

@injectable()
export class InfoWindowQueryHandler implements IQueryHandler<InfoWindowQuery, void> {
  async exec(query: InfoWindowQuery): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        query.fsmState = FsmStates.InfoWindow
        query.modal.resolveFunction = resolve as (value: unknown) => Promise<void>
        Hub.$emit('open-dialog', query)
      }, 100)
    })
  }
}
