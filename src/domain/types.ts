const bindings = {
  Application: Symbol.for('Application'),
  Container: Symbol.for('Container'),
  Store: Symbol.for('Store'),
  QueryBus: Symbol.for('QueryBus'),
  CommandBus: Symbol.for('CommandBus'),
  /* --------- queries --------- */
  AuthQuery: Symbol.for('AuthQuery'),
  SessionQuery: Symbol.for('SessionQuery'),
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
  RevokeYandexTokenCommand: Symbol.for('RevokeYandexTokenCommand'),
  /* --------- interactive --------- */
  InfoWindowQuery: Symbol.for('InfoWindowQuery'),
  ConfirmWindowQuery: Symbol.for('ConfirmWindowQuery'),
  CreateEditQuery: Symbol.for('CreateEditQuery'),
};

export { bindings };
