export interface IQueryBus {
  exec<TQuery, TResult>(query: TQuery): Promise<TResult>
}

export interface ICommandBus {
  do<TCommand, TResult>(command: TCommand): Promise<TResult>
}

export interface ICommandHandler<TCommand, TResult> {
  do(command: TCommand): Promise<TResult>
}

export interface IQueryHandler<TQuery, TResult> {
  exec(query: TQuery): Promise<TResult>
}

export interface IModule {
  name: string
  path: string
}

export interface IManifest {
  main: Array<IModule>
}

export interface IModuleMaifest {
  components: {
    main: string
    aside: string
    modals: Array<string>
  }
  store: string
}
