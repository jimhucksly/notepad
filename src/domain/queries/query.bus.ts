import { Container, inject, injectable } from 'inversify'
import { Store } from 'vuex'
import { IQuery, IQueryBus } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'

@injectable()
class QueryBus implements IQueryBus {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  exec(query :any): Promise<any> {
    const actionName = Reflect.getMetadata(TYPES[query.constructor.name], QueryBus)
    if(actionName) {
      return this._store.dispatch(actionName, query)
    }
    const handler: IQuery = this._container.get(TYPES[query.constructor.name])
    if(handler) {
      return handler.exec(query)
    }
    return Promise.reject(`Не найден обрабтчик для запроса: ${query.constructor.name}`)
  }
}

/**
 * Декоратор метода (для store.actions)
 * нужен для связи IQuery и action
 */
export function Queryable(
  query: symbol
) {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(query, propertyKey, QueryBus)
  }
}

export default QueryBus
