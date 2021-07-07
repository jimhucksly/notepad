export class AuthQuery {
  constructor(public login: string, public password: string) {}
}

export class OAuthQuery {}

export class ProjectsQuery {}

export class LibraryFilesQuery {}

export class LibraryFileQuery {
  constructor(public id?: string | number) {}
}

export class ArchivesQuery {}

export class EventsQuery {}

export class LinksQuery {}

export class TodoQuery {}
