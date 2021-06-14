import { Container, inject, injectable } from 'inversify'
import { Store } from 'vuex'
import { IQueryBus, IQueryHandler } from '~/domain/interfaces'
import { IRootState } from '~/domain/models'
import { TYPES } from '~/domain/types'

@injectable()
class QueryBus implements IQueryBus {
  constructor(
    @inject(TYPES.Container) private readonly _container: Container,
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  /**
   * T - Query
   * R - Result
   */
  exec<T, R>(query: T): Promise<R> {
    const actionName = Reflect.getMetadata(TYPES[query.constructor.name], QueryBus)
    if(actionName) {
      return this._store.dispatch(actionName, query)
    }
    const handler: IQueryHandler<T, R> = this._container.get(TYPES[query.constructor.name])
    if(handler) {
      return handler.exec(query)
    }
    return Promise.reject(`Query handler is not found: ${query.constructor.name}`)
  }
}

/**
 * Декоратор метода (для store.actions)
 * нужен для связи IQuery и action
 */
export function Queryable(
  query: symbol
) {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata(query, propertyKey, QueryBus)
  }
}

export default QueryBus
