import { ICommandBus, IQueryHandler } from '../interfaces'
import { inject, injectable } from 'inversify'
import { CreateEditCommand } from '../commands/createEdit.command'
import FsmStates from '~/application/fsm.states'
import { TYPES } from '../types'

export class ConfirmQuery {
  constructor(public question: string) {}
}

@injectable()
export class ConfirmQueryHandler implements IQueryHandler<ConfirmQuery, boolean> {
  constructor(
    @inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus
  ) {}

  async exec(query: ConfirmQuery): Promise<boolean> {
    const command = new CreateEditCommand({
      component: 'confirm-popup',
      componentProps: {
        question: query.question
      },
      modal: {
        title: 'Confirmation!',
        width: '30%'
      },
      fsmState: FsmStates.ConfirmPopup
    })
    return this._commandBus.do<CreateEditCommand<boolean>, boolean>(command)
  }
}
