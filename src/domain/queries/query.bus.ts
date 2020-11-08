import { inject, injectable } from 'inversify'
import { IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { Constructor } from 'vue/types/options'
import { Store } from 'vuex'
import { IRootState } from '~/domain/models'

@injectable()
class QueryBus implements IQueryBus {
  constructor(
    @inject(TYPES.Store) private readonly _store: Store<IRootState>
  ) {}

  exec<TQuery, TResult>(query: TQuery): Promise<TResult> {
    const queryName = Object.getPrototypeOf(query).constructor.name
    const actionName = Reflect.getMetadata(queryName, QueryBus)
    if(actionName) {
      return this._store.dispatch(actionName, query)
    }
    return Promise.reject(`Не найден action для запроса: ${queryName}`)
  }
}

/**
 * Декоратор метода (для store.actions)
 * нужен для связи IQuery и action
 */
export function Queryable(
  query: Constructor
) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata(query.name, propertyKey, QueryBus)
  }
}

export default QueryBus
