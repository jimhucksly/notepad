const TYPES = {
  Container: Symbol.for('Container'),
  Store: Symbol.for('Store'),
  QueryBus: Symbol.for('QueryBus'),
  CommandBus: Symbol.for('CommandBus'),
  /* --------- queries --------- */
  AuthQuery: Symbol.for('AuthQuery'),
  JsonQuery: Symbol.for('JsonQuery'),
  LibraryQuery: Symbol.for('LibraryQuery'),
  LibraryFilesQuery: Symbol.for('LibraryFilesQuery'),
  LibraryFileQuery: Symbol.for('LibraryFileQuery'),
  OAuthQuery: Symbol.for('OAuthQuery'),
  ArchivesQuery: Symbol.for('ArchivesQuery'),
  EventsQuery: Symbol.for('EventsQuery'),
  LinksQuery: Symbol.for('LinksQuery'),
  TodoQuery: Symbol.for('TodoQuery'),
  CheckQuery: Symbol.for('CheckQuery'),
  /* --------- commands --------- */
  PingCommand: Symbol.for('PingCommand'),
  CheckCommand: Symbol.for('CheckCommand'),
  NavigateCommand: Symbol.for('NavigateCommand'),
  AuthCommand: Symbol.for('AuthCommand'),
  SetJsonCommand: Symbol.for('SetJsonCommand'),
  UpdateJsonCommand: Symbol.for('UpdateJsonCommand'),
  DeleteProjectCommand: Symbol.for('DeleteProjectCommand'),
  ReadCommand: Symbol.for('ReadCommand'),
  UploadFileCommand: Symbol.for('UploadFileCommand'),
  ArchiveRestoreCommand: Symbol.for('ArchiveRestoreCommand'),
  ArchiveRemoveCommand: Symbol.for('ArchiveRemoveCommand'),
  ArchivingCommand: Symbol.for('ArchivingCommand'),
  UpdateEventCommand: Symbol.for('UpdateEventCommand'),
  DeleteEventCommand: Symbol.for('DeleteEventCommand'),
  UpdateLibraryCommand: Symbol.for('UpdateLibraryCommand'),
  UpdateLinksCommand: Symbol.for('UpdateLinksCommand'),
  DeleteLinkCommand: Symbol.for('DeleteLinkCommand'),
  UpdateTodoCommand: Symbol.for('UpdateTodoCommand'),
  DeleteTodoCommand: Symbol.for('DeleteTodoCommand'),
  TodoOrderCommand: Symbol.for('TodoOrderCommand')
}

export {
  TYPES
}
