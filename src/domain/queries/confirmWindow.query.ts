import { IQueryHandler } from '../interfaces'
import { injectable } from 'inversify'
import FsmStates from '~/application/fsm.states'
import { IPopupWindowQuery } from '../models'
import { Hub } from '~/plugins/hub'

export class ConfirmWindowQuery implements IPopupWindowQuery<boolean> {
  component: string = null
  componentProps: IPopupWindowQuery<boolean>['componentProps'] = {}
  modal: IPopupWindowQuery<boolean>['modal'] = {
    title: 'Confirmation!',
    width: '45%'
  }
  fsmState: symbol
  constructor(question: string) {
    this.componentProps.question = question
  }
}

@injectable()
export class ConfirmWindowQueryHandler implements IQueryHandler<ConfirmWindowQuery, boolean> {
  async exec(query: ConfirmWindowQuery): Promise<boolean> {
    return new Promise(resolve => {
      setTimeout(() => {
        query.fsmState = FsmStates.ConfirmWindow
        query.modal.resolveFunction = resolve as (value: unknown) => Promise<boolean>
        Hub.$emit('open-dialog', query)
      }, 100)
    })
  }
}
