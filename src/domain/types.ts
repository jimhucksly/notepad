const TYPES = {
  Container: Symbol.for('Container'),
  Store: Symbol.for('Store'),
  QueryBus: Symbol.for('QueryBus'),
  CommandBus: Symbol.for('CommandBus'),
  /* --------- queries --------- */
  AuthQuery: Symbol.for('AuthQuery'),
  JsonQuery: Symbol.for('JsonQuery'),
  LibraryQuery: Symbol.for('LibraryQuery'),
  OAuthQuery: Symbol('OAuthQuery'),
  ArchivesQuery: Symbol('ArchivesQuery'),
  EventsQuery: Symbol('EventsQuery'),
  LinksQuery: Symbol('LinksQuery'),
  TodoQuery: Symbol('TodoQuery'),
  CheckQuery: Symbol('CheckQuery'),
  /* --------- commands --------- */
  PingCommand: Symbol.for('PingCommand'),
  NavigateCommand: Symbol.for('NavigateCommand'),
  AuthCommand: Symbol('AuthCommand'),
  LoadingCommand: Symbol('LoadingCommand'),
  SetJsonCommand: Symbol('SetJsonCommand'),
  SetArchivesCommand: Symbol('SetArchivesCommand'),
  SetTreeCommand: Symbol('SetTreeCommand'),
  SetFilterCommand: Symbol('SetFilterCommand'),
  UpdateJsonCommand: Symbol('UpdateJsonCommand'),
  DeleteProjectCommand: Symbol('DeleteProjectCommand'),
  UploadFileCommand: Symbol('UploadFileCommand'),
  ArchiveRestoreCommand: Symbol('ArchiveRestoreCommand'),
  ArchiveRemoveCommand: Symbol('ArchiveRemoveCommand'),
  ArchivingCommand: Symbol('ArchivingCommand'),
  UpdateEventCommand: Symbol('UpdateEventCommand'),
  DeleteEventCommand: Symbol('DeleteEventCommand'),
  UpdateLibraryCommand: Symbol('UpdateLibraryCommand'),
  UpdateLinksCommand: Symbol('UpdateLinksCommand'),
  DeleteLinkCommand: Symbol('DeleteLinkCommand'),
  UpdateTodoCommand: Symbol('UpdateTodoCommand'),
  DeleteTodoCommand: Symbol('DeleteTodoCommand'),
  TodoOrderCommand: Symbol('TodoOrderCommand')
}

export {
  TYPES
}
