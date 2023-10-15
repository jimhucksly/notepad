const TYPES = {
  Application: Symbol.for('Application'),
  Container: Symbol.for('Container'),
  Store: Symbol.for('Store'),
  QueryBus: Symbol.for('QueryBus'),
  CommandBus: Symbol.for('CommandBus'),
  /* --------- queries --------- */
  AuthQuery: Symbol.for('AuthQuery'),
  SessionQuery: Symbol.for('SessionQuery'),
  ProjectsQuery: Symbol.for('ProjectsQuery'),
  LibraryQuery: Symbol.for('LibraryQuery'),
  LibraryFilesQuery: Symbol.for('LibraryFilesQuery'),
  LibraryFileQuery: Symbol.for('LibraryFileQuery'),
  ArchivesQuery: Symbol.for('ArchivesQuery'),
  EventsQuery: Symbol.for('EventsQuery'),
  TodoQuery: Symbol.for('TodoQuery'),
  FilesQuery: Symbol.for('FilesQuery'),
  YandexTokenQuery: Symbol.for('YandexTokenQuery'),
  RefreshYandexTokenQuery: Symbol.for('RefreshYandexTokenQuery'),
  YandexDiskResourceLinkQuery: Symbol.for('YandexDiskResourceLinkQuery'),
  /* --------- commands --------- */
  RegistrationCommand: Symbol.for('RegistrationCommand'),
  VerifyCommand: Symbol.for('VerifyCommand'),
  ResendCodeCommand: Symbol.for('ResendCodeCommand'),
  ResetPasswordCommand: Symbol.for('ResetPasswordCommand'),
  UpdatePasswordCommand: Symbol.for('UpdatePasswordCommand'),
  AuthCommand: Symbol.for('AuthCommand'),
  CreateProjectCommand: Symbol.for('CreateProjectCommand'),
  EditProjectCommand: Symbol.for('EditProjectCommand'),
  DeleteProjectCommand: Symbol.for('DeleteProjectCommand'),
  ReadCommand: Symbol.for('ReadCommand'),
  UploadFileCommand: Symbol.for('UploadFileCommand'),
  ArchiveRestoreCommand: Symbol.for('ArchiveRestoreCommand'),
  ArchiveRemoveCommand: Symbol.for('ArchiveRemoveCommand'),
  ArchivingCommand: Symbol.for('ArchivingCommand'),
  UpdateEventCommand: Symbol.for('UpdateEventCommand'),
  DeleteEventCommand: Symbol.for('DeleteEventCommand'),
  AddLibraryFileCommand: Symbol.for('AddLibraryFileCommand'),
  UpdateLibraryCommand: Symbol.for('UpdateLibraryCommand'),
  DeleteLibraryFileCommand: Symbol.for('DeleteLibraryFileCommand'),
  UpdateTodoCommand: Symbol.for('UpdateTodoCommand'),
  DeleteTodoCommand: Symbol.for('DeleteTodoCommand'),
  TodoOrderCommand: Symbol.for('TodoOrderCommand'),
  DeleteFileCommand: Symbol.for('DeleteFileCommand'),
  RevokeYandexTokenCommand: Symbol.for('RevokeYandexTokenCommand'),
  /* --------- interactive --------- */
  InfoWindowQuery: Symbol.for('InfoWindowQuery'),
  ConfirmWindowQuery: Symbol.for('ConfirmWindowQuery'),
  CreateEditQuery: Symbol.for('CreateEditQuery')
}

export {
  TYPES
}
