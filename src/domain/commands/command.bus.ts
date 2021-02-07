import { Container, inject, injectable } from 'inversify'
import { ICommand, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'

@injectable()
class CommandBus implements ICommandBus {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  do(command: any) {
    const actionName = Reflect.getMetadata(TYPES[command.constructor.name], CommandBus)
    if(actionName) {
      return this._store.dispatch(actionName, command)
    }
    const handler: ICommand = this._container.get(TYPES[command.constructor.name])
    if(handler) {
      return handler.do(command)
    }
    return Promise.reject(`Не найден обработчик для команды: ${command.constructor.name}`)
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
  command: symbol
) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(command, propertyKey, CommandBus)
  }
}

export default CommandBus
