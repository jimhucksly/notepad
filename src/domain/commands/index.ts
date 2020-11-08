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
import { TCommand } from '~/domain/interfaces'

export class AuthCommand implements TCommand {
  flag: boolean

  constructor(flag: boolean) {
    this.flag = flag
  }
}

export class LoadingCommand implements TCommand {
  flag: boolean

  constructor(flag: boolean) {
    this.flag = flag
  }
}

export interface IUpdateJsonCommand {
  data: IJson
}

export class UpdateJsonCommand implements IUpdateJsonCommand {
  data: IJson

  constructor(data: IJson) {
    this.data = data
  }
}

export class SetJsonCommand implements TCommand {
  json: IJson

  constructor(json: IJson) {
    this.json = json
  }
}

export class DeleteProjectCommand {
  stamp: string | number

  constructor(stamp: string | number) {
    this.stamp = stamp
  }
}

export class SetFilterCommand implements TCommand {
  filters: IFilters

  constructor(filters: IFilters) {
    this.filters = filters
  }
}

export class UploadFileCommand {
  file: FormData

  constructor(file: FormData) {
    this.file = file
  }
}

export class ArchivingCommand {
  stamp: string

  constructor(stamp: string) {
    this.stamp = stamp
  }
}

export class ArchiveRestoreCommand {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export class ArchiveRemoveCommand {
  name: string

  constructor(name: string) {
    this.name = name
  }
}

export class SetArchivesCommand {
  items: IArchive[]

  constructor(items: IArchive[]) {
    this.items = items
  }
}

export class UpdateEventCommand {
  event: IEvent

  constructor(event: IEvent) {
    this.event = event
  }
}

export class DeleteEventCommand {
  date: string

  constructor(date: string) {
    this.date = date
  }
}

export class SetTreeCommand {
  tree: ITreeItem[]

  constructor(tree: ITreeItem[]) {
    this.tree = tree
  }
}

export class UpdateLibraryCommand {
  value: string

  constructor(value: string) {
    this.value = value
  }
}

export class UpdateLinksCommand {
  link: ILink

  constructor(link: ILink) {
    this.link = link
  }
}

export class DeleteLinkCommand {
  key: string

  constructor(key: string) {
    this.key = key
  }
}

export class TodoOrderCommand {
  result: ITodoOrder

  constructor(result: ITodoOrder) {
    this.result = result
  }
}

export class UpdateTodoCommand {
  item: ITodo

  constructor(item: ITodo) {
    this.item = item
  }
}

export class DeleteTodoCommand {
  id: string

  constructor(id: string) {
    this.id = id
  }
}
