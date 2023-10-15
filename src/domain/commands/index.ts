import {
  IProjects,
  IEvent,
  ITodoOrder,
  ITodoItem
} from '~/domain/models'

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

export class UploadFileCommand {
  constructor(public form: FormData) {}
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

export class UpdateEventCommand {
  constructor(public event: IEvent) {}
}

export class DeleteEventCommand {
  constructor(public date: string) {}
}

export class AddLibraryFileCommand {
  constructor(public name: string) {}
}

export class DeleteLibraryFileCommand {
  constructor(public id: string) {}
}

export class UpdateLibraryCommand {
  constructor(public id: string | number, public value: string) {}
}

export class TodoOrderCommand {
  constructor(public result: ITodoOrder) {}
}

export class UpdateTodoCommand {
  constructor(public item: ITodoItem) {}
}

export class DeleteTodoCommand {
  constructor(public id: string) {}
}

export class DeleteFileCommand {
  constructor(public id: string) {}
}

export class RevokeYandexTokenCommand {}
