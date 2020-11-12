import { Query } from '~/domain/interfaces'

export class AuthQuery extends Query {
  login: string
  password: string

  constructor(login: string, password: string) {
    super()
    this.login = login
    this.password = password
    this.NAME = 'AuthQuery'
  }
}

export class OAuthQuery extends Query {
  constructor() {
    super()
    this.NAME = 'OAuthQuery'
  }
}

export class JsonQuery extends Query {
  constructor() {
    super()
    this.NAME = 'JsonQuery'
  }
}

export class LibraryQuery extends Query {
  constructor() {
    super()
    this.NAME = 'LibraryQuery'
  }
}

export class ArchivesQuery extends Query {
  constructor() {
    super()
    this.NAME = 'ArchivesQuery'
  }
}

export class EventsQuery extends Query {
  constructor() {
    super()
    this.NAME = 'EventsQuery'
  }
}

export class LinksQuery extends Query {
  constructor() {
    super()
    this.NAME = 'LinksQuery'
  }
}

export class TodoQuery extends Query {
  constructor() {
    super()
    this.NAME = 'TodoQuery'
  }
}
