export interface IQueryBus {
  exec<TQuery, TResult>(query: TQuery): Promise<TResult>
}

export interface ICommandBus {
  do<ICommand>(command: ICommand): any
}

export interface ICommand {
  do<TCommand>(command: TCommand): any
}

export type TCommand = {
  [param: string]: any
}
