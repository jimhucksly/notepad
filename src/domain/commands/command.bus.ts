import { Container, inject, injectable } from 'inversify'
import { ICommandBus, ICommandHandler } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'

@injectable()
class CommandBus implements ICommandBus {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  /**
   * T - Command
   * R - Result
   */
  do<T, R>(command: T) {
    const actionName = Reflect.getMetadata(Symbol.for(command.constructor.name), CommandBus)
    if (actionName) {
      return this._store.dispatch(actionName, command)
    }
    const handler: ICommandHandler<T, R> = this._container.get(Symbol.for(command.constructor.name))
    if (handler) {
      return handler.do(command)
    }
    return Promise.reject(`Command handler is not found: ${command.constructor.name}`)
  }
}

/**
 * Декоратор метода (для store.actions)
 * нужен для связи ICommand и action
 * @export
 * @param {Constructor} [command] symbol
 * @returns
 */
export function Commandable(
  command: symbol,
  namespace?: string
) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const value = namespace ? `${namespace}/${propertyKey}` : propertyKey
    Reflect.defineMetadata(command, value, CommandBus)
  }
}

export default CommandBus
