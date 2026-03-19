export class AuthQuery {
  constructor(
    public login: string,
    public password: string
  ) {}
}

export class SessionQuery {}

export class YandexTokenQuery {
  constructor(
    public code: number,
    public userId: number
  ) {}
}

export class RefreshYandexTokenQuery {}

export class YandexDiskResourceLinkQuery {
  constructor(public filename: string) {}
}
