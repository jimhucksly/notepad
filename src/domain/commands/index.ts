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
import { TCommand, Command } from '~/domain/interfaces'

export class AuthCommand extends Command implements TCommand {
  flag: boolean

  constructor(flag: boolean) {
    super()
    this.flag = flag
    this.NAME = 'AuthCommand'
  }
}

export class LoadingCommand extends Command {
  flag: boolean

  constructor(flag: boolean) {
    super()
    this.flag = flag
    this.NAME = 'LoadingCommand'
  }
}

export class UpdateJsonCommand extends Command {
  data: IJson

  constructor(data: IJson) {
    super()
    this.data = data
    this.NAME = 'UpdateJsonCommand'
  }
}

export class SetJsonCommand extends Command {
  json: IJson

  constructor(json: IJson) {
    super()
    this.json = json
    this.NAME = 'SetJsonCommand'
  }
}

export class DeleteProjectCommand extends Command {
  stamp: string | number

  constructor(stamp: string | number) {
    super()
    this.stamp = stamp
    this.NAME = 'DeleteProjectCommand'
  }
}

export class SetFilterCommand extends Command {
  filters: IFilters

  constructor(filters: IFilters) {
    super()
    this.filters = filters
    this.NAME = 'SetFilterCommand'
  }
}

export class UploadFileCommand extends Command {
  file: FormData

  constructor(file: FormData) {
    super()
    this.file = file
    this.NAME = 'UploadFileCommand'
  }
}

export class ArchivingCommand extends Command {
  stamp: string

  constructor(stamp: string) {
    super()
    this.stamp = stamp
    this.NAME = 'ArchivingCommand'
  }
}

export class ArchiveRestoreCommand extends Command {
  name: string

  constructor(name: string) {
    super()
    this.name = name
    this.NAME = 'ArchiveRestoreCommand'
  }
}

export class ArchiveRemoveCommand extends Command {
  name: string

  constructor(name: string) {
    super()
    this.name = name
    this.NAME = 'ArchiveRemoveCommand'
  }
}

export class SetArchivesCommand extends Command {
  items: IArchive[]

  constructor(items: IArchive[]) {
    super()
    this.items = items
    this.NAME = 'SetArchivesCommand'
  }
}

export class UpdateEventCommand extends Command {
  event: IEvent

  constructor(event: IEvent) {
    super()
    this.event = event
    this.NAME = 'UpdateEventCommand'
  }
}

export class DeleteEventCommand extends Command {
  date: string

  constructor(date: string) {
    super()
    this.date = date
    this.NAME = 'DeleteEventCommand'
  }
}

export class SetTreeCommand extends Command {
  tree: ITreeItem[]

  constructor(tree: ITreeItem[]) {
    super()
    this.tree = tree
    this.NAME = 'SetTreeCommand'
  }
}

export class UpdateLibraryCommand extends Command {
  value: string

  constructor(value: string) {
    super()
    this.value = value
    this.NAME = 'UpdateLibraryCommand'
  }
}

export class UpdateLinksCommand extends Command {
  link: ILink

  constructor(link: ILink) {
    super()
    this.link = link
    this.NAME = 'UpdateLinksCommand'
  }
}

export class DeleteLinkCommand extends Command {
  key: string

  constructor(key: string) {
    super()
    this.key = key
    this.NAME = 'DeleteLinkCommand'
  }
}

export class TodoOrderCommand extends Command {
  result: ITodoOrder

  constructor(result: ITodoOrder) {
    super()
    this.result = result
    this.NAME = 'TodoOrderCommand'
  }
}

export class UpdateTodoCommand extends Command {
  item: ITodo

  constructor(item: ITodo) {
    super()
    this.item = item
    this.NAME = 'UpdateTodoCommand'
  }
}

export class DeleteTodoCommand extends Command {
  id: string

  constructor(id: string) {
    super()
    this.id = id
    this.NAME = 'DeleteTodoCommand'
  }
}
