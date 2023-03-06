import { injectable } from 'inversify'
import { ICommandHandler } from '~/domain/interfaces'
import { IModalInfo, IResolveFunc } from '~/domain/models'
import { Hub } from '~/plugins/hub'

export class CreateEditCommand<R> {
  public component: string
  public componentProps: Record<string, unknown>
  public modal: IModalInfo<R>
  public fsmState: symbol
  constructor({
    component,
    componentProps,
    modal
  }: {
    component: string
    componentProps: Record<string, unknown>
    modal: IModalInfo<R>
  }) {
    this.component = component
    this.componentProps = componentProps
    this.modal = modal
  }
}

@injectable()
export class CreateEditCommandHandler<R> implements ICommandHandler<CreateEditCommand<R>, R> {
  async do(command: CreateEditCommand<R>): Promise<R> {
    return new Promise((resolve: IResolveFunc<R>) => {
      setTimeout(() => {
        command.modal.resolveFunction = resolve
        Hub.$emit('open-dialog', command)
      }, 100)
    })
  }
}

