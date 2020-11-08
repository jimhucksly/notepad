const TYPES = {
  Container: Symbol.for('Container'),
  Store: Symbol.for('Store'),
  QueryBus: Symbol.for('QueryBus'),
  CommandBus: Symbol.for('CommandBus'),
  /* --------- queries --------- */
  AuthQuery: Symbol.for('AuthQuery'),
  JsonQuery: Symbol.for('JsonQuery'),
  LibraryQuery: Symbol.for('LibraryQuery'),
  /* --------- commands --------- */
  PingCommand: Symbol.for('PingCommand'),
  NavigateCommand: Symbol.for('NavigateCommand')
}

export {
  TYPES
}
