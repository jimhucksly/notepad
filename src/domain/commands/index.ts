export class AuthCommand {
  constructor(public flag: boolean) {}
}

export class RegistrationCommand {
  login = ''
  password = ''
  name = ''
  email = ''

  constructor({
    login,
    password,
    name,
    email
  }: {
    login: string
    password: string
    name: string
    email: string
  }) {
    this.login = login
    this.password = password
    this.name = name
    this.email = email
  }
}

export class VerifyCommand {
  constructor(public code: string) {}
}

export class ResendCodeCommand {}

export class ResetPasswordCommand {
  constructor(public email: string) {}
}

export class UpdatePasswordCommand {
  constructor(public old: string, public pass: string) {}
}

export class RevokeYandexTokenCommand {}
