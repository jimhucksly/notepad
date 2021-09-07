export class AuthQuery {
  constructor(public login: string, public password: string) {}
}

export class SessionQuery {
  constructor(public token: string) {}
}

export class StartQuery {}

export class ProjectsQuery {}

export class LibraryFilesQuery {}

export class LibraryFileQuery {
  constructor(public id?: string | number) {}
}

export class ArchivesQuery {}

export class EventsQuery {}

export class LinksQuery {}

export class TodoQuery {}

export class YandexTokenQuery {
  constructor(public code: number, public userId: number) {}
}

export class RefreshYandexTokenQuery {
  constructor(public userId: number) {}
}

export class YandexDiskInfoQuery {}
