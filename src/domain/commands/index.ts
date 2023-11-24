import { IProjects } from '~/domain/models'

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

export class CreateProjectCommand {
  constructor(public data: IProjects) {}
}

export class EditProjectCommand {
  constructor(public data: IProjects) {}
}

export class DeleteProjectCommand {
  constructor(public stamp: string | number) {}
}

export class ReadCommand {
  constructor(public stamp: string | number) {}
}

export class ArchivingCommand {
  constructor(public stamp: string) {}
}

export class ArchiveRestoreCommand {
  constructor(public id: string) {}
}

export class ArchiveRemoveCommand {
  constructor(public id: string) {}
}

export class RevokeYandexTokenCommand {}
