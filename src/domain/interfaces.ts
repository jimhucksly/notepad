export interface IQueryBus {
  exec<TQuery, TResult>(query: TQuery): Promise<TResult>
}

export interface ICommandBus {
  do<TCommand, TResult>(command: TCommand): Promise<TResult>
}

export interface ICommand<TResult> {
  do<TCommand>(command: TCommand): TResult
}

export interface IQuery<TResult> {
  exec<TQuery>(query: TQuery): Promise<TResult>
}
