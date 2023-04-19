/* eslint-disable camelcase */

import { QueryResult } from 'pg'

/* eslint-disable @typescript-eslint/no-namespace */
export enum TemplateTypes {
  Verify = 'verify',
  ResetPassword = 'resetPassword'
}

export interface IUser {
  id: number
  login: string
  password: string
  name: string
  email: string
  token: string
  yandex_disk_access_token: string
  yandex_disk_refresh_token: string
  waitingVerify: boolean
}

export interface IToken {
  user_id: number
  token: string
  token_expired: string
}

export interface IYandexTokenResponse {
  access_token: string
  refresh_token: string
}

export interface IYandexDiskInfo {
  _embedded: {
    items: Array<
      {
        resource_id: string
        name: string
        type: 'dir' | 'file'
        created: string
        size: string
        file: string
      }
    >
  }
}

export interface IYandexAPI {
  getToken: (code: number) => Promise<IYandexTokenResponse>
  refreshToken: (token: string) => Promise<IYandexTokenResponse>
  diskInfo: (path: string, token: string) => Promise<IYandexDiskInfo>
  uploadFile: (filename: string, content: Buffer | string, token: string) => Promise<void>
  deleteFile: (filename: string, token: string) => Promise<void>
  createDir: (dirname: string, token: string) => Promise<boolean>
  downloadFile: (filename: string, token: string) => Promise<Record<string, unknown>>
}

export enum ReturnType {
  None = 'none',
  Single = 'single',
  Multiple = 'multiple'
}

export type TRequestFiles = Record<string, { data: string, name: string }>

export namespace Database {
  export namespace Query {
    export interface User {
      get: () => Promise<IUser>
      search: () => Promise<IUser | Array<IUser>>
    }
    export interface Verify {
      get: () => Promise<boolean>
      check: (code: number) => Promise<boolean>
    }
    export interface Tokens {
      get: () => Promise<Array<IToken>>
    }
    export interface YandexAppPassword {
      get: () => Promise<{ client_secret: string }>
    }
  }
  export namespace Command {
    export interface User {
      signup: () => Promise<void>
      signin: () => Promise<boolean>
      setVerifyCode: (code: number) => Promise<void>
      resetVerifyCode: (code: number) => Promise<void>
      setTempPassword: (pass: string) => Promise<void>
      updatePassword: (old: string, pass: string) => Promise<void>
      setYandexAccessToken: (_token: string) => Promise<void>
      setYandexRefreshToken: (_token: string) => Promise<void>
      revokeYandexAccessToken: () => Promise<void>
      revokeYandexRefreshToken: () => Promise<void>
    }
    export interface Verify {
      delete: () => Promise<void>
    }
    export interface Token {
      bindToUser: ({ id }: Partial<IUser>) => Promise<void>
      delete: () => Promise<void>
    }
    export interface Session {
      bindToUser: ({ id }: Partial<IUser>) => Promise<QueryResult<{ row: [] }>>
      revoke: () => Promise<void>
    }
  }
  export interface Query {
    user: ({ id, login, email, token }: Partial<IUser>) => Query.User
    verify: ({ userId }: { userId: number }) => Query.Verify
    tokens: () => Query.Tokens
    yandexAppPassword: () => Query.YandexAppPassword
  }
  export interface Command {
    user: ({ id, login, password, name, email, token }: Partial<IUser>) => Command.User
    verify: ({ userId }: { userId: number }) => Command.Verify
    token: (token: string) => Command.Token
    session: (session: string) => Command.Session
  }
  export interface IDatabase {
    connect: () => Promise<boolean>
    command: () => Command
    query: () => Query
  }
}

export interface IApp {
  db: Database.IDatabase
  sendmail: (email: string, templateType: TemplateTypes, data: Record<string, unknown>) => Promise<void>
  yandex: IYandexAPI
}
