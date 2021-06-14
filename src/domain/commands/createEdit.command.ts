import { injectable } from 'inversify'
import { ICommandHandler } from '~/domain/interfaces'
import { IModalInfo, IResolveFunc } from '~/domain/models'
import { Hub } from '~/plugins/hub'

export class CreateEditCommand {
  public component: string
  public componentProps: Record<string, unknown>
  public modal: IModalInfo
  public fsmState: symbol
  constructor({
    component,
    componentProps,
    modal,
    fsmState
  }: {
    component: string
    componentProps: Record<string, unknown>
    modal: IModalInfo
    fsmState: symbol
  }) {
    this.component = component
    this.componentProps = componentProps
    this.modal = modal
    this.fsmState = fsmState
  }
}

@injectable()
export class CreateEditCommandHandler<R> implements ICommandHandler<CreateEditCommand, R> {
  async do(command: CreateEditCommand): Promise<R> {
    return new Promise((resolve: IResolveFunc<R>) => {
      Hub.$nextTick(() => {
        command.modal.resolveFunction = resolve
        Hub.$emit('open-dialog', command)
      })
    })
  }
}

