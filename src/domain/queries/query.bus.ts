import { inject, injectable } from 'inversify'
import { IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'

@injectable()
class QueryBus implements IQueryBus {
  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  exec(query: any): Promise<any> {
    const actionName = Reflect.getMetadata(TYPES[query.NAME], QueryBus)
    if(actionName) {
      return this._store.dispatch(actionName, query)
    }
    return Promise.reject(`Не найден action для запроса: ${query.NAME}`)
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
