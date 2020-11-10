import { Container, inject, injectable } from 'inversify'
import { ICommand, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'
import { Constructor } from 'vue/types/options'

@injectable()
class CommandBus implements ICommandBus {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  do(command: any) {
    console.log('call do CommandBus')
    const commandName = Object.getPrototypeOf(command).constructor.name
    console.log('commandName', commandName)
    console.log(Reflect.getMetadataKeys(CommandBus))
    const actionName = Reflect.getMetadata(commandName, CommandBus)
    console.log('actionName', actionName)
    if(actionName) {
      return this._store.dispatch(actionName, command)
    }
    console.log('TYPES[commandName]', TYPES[commandName])
    const handler: ICommand = this._container.get(TYPES[commandName])
    console.log('handler', handler)
    if(handler) {
      return handler.do(command)
    }
    return Promise.reject(`Не найден обработчик для команды: ${commandName}`)
  }
}

/**
 * Декоратор метода (для store.actions)
 * нужен для связи ICommand и action
 * @export
 * @param {Constructor} [command] тип, реализующий интерфейс команды ICommand
 * @returns
 */
export function Commandable(
  command: Constructor
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(command.name, propertyKey, CommandBus)
  }
}

export default CommandBus
