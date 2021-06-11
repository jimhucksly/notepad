import {
  IJson,
  IEvent,
  ILink,
  ITodoOrder,
  ITodoItem,
  ILibraryFile
} from '~/domain/models'

export class AuthCommand {
  constructor(public flag: boolean) {}
}

export class PingCommand {
  constructor(public param: boolean) {}
}

export class CheckCommand {
  /* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-useless-constructor */
  constructor() {}
}

export class UpdateJsonCommand {
  constructor(public data: IJson) {}
}

export class SetJsonCommand {
  constructor(public json: IJson) {}
}

export class DeleteProjectCommand {
  constructor(public stamp: string | number) {}
}

export class ReadCommand {
  constructor(public stamp: string | number) {}
}

export class UploadFileCommand {
  constructor(public file: FormData) {}
}

export class ArchivingCommand {
  constructor(public stamp: string) {}
}

export class ArchiveRestoreCommand {
  constructor(public name: string) {}
}

export class ArchiveRemoveCommand {
  constructor(public name: string) {}
}

export class UpdateEventCommand {
  constructor(public event: IEvent) {}
}

export class DeleteEventCommand {
  constructor(public date: string) {}
}

export class AddLibraryFileCommand {
  constructor(public data: ILibraryFile) {}
}

export class DeleteLibraryFileCommand {
  constructor(public id: string) {}
}

export class UpdateLibraryCommand {
  constructor(public id: string | number, public value: string) {}
}

export class UpdateLinksCommand {
  constructor(public link: ILink) {}
}

export class DeleteLinkCommand {
  constructor(public id: string) {}
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
