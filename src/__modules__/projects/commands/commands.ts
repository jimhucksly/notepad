import { IProjects } from '../models'

export class CreateProjectCommand {
  constructor(public data: IProjects) {}
}

export class EditProjectCommand {
  constructor(public data: IProjects) {}
}

export class DeleteProjectCommand {
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

export class ReadCommand {
  constructor(public stamp: string | number) {}
}

