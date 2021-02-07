import {
  IJson,
  IFilters,
  IArchive,
  IEvent,
  ITreeItem,
  ILink,
  ITodo,
  ITodoOrder
} from '~/domain/models'

export class AuthCommand {
  constructor(public flag: boolean) {}
}

export class LoadingCommand {
  constructor(public flag: boolean) {}
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

export class SetFilterCommand {
  constructor(public filters: IFilters) {}
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

export class SetArchivesCommand {
  constructor(public items: IArchive[]) {}
}

export class UpdateEventCommand {
  constructor(public event: IEvent) {}
}

export class DeleteEventCommand {
  constructor(public date: string) {}
}

export class SetTreeCommand {
  constructor(public tree: ITreeItem[]) {}
}

export class UpdateLibraryCommand {
  constructor(public value: string) {}
}

export class UpdateLinksCommand {
  constructor(public link: ILink) {}
}

export class DeleteLinkCommand {
  constructor(public key: string) {}
}

export class TodoOrderCommand {
  constructor(public result: ITodoOrder) {}
}

export class UpdateTodoCommand {
  constructor(public item: ITodo) {}
}

export class DeleteTodoCommand {
  constructor(public id: string) {}
}
