export interface IMenu {
  name: string
  nameAlt: string
  fsmState: symbol
  id: number
}

export interface IEditor {
  getValue: () => string
  on: (event: string, callback: () => void) => void
  setValue: (value: string) => void
}

export interface ITreeItem {
  id: string
  name: string
  slug: string
  children?: ITreeItem[]
}

export interface IFile {
  name: string
  link: string
  type: string
}

export interface IJsonItem {
  key: string
  date: string
  name: string
  lock: boolean
  message?: string
  unread?: boolean
  file?: IFile
}

export interface IJson {
  [stamp: string]: IJsonItem
}

export interface IFilters {
  [stamp: string]: boolean
}

export interface IArchive {
  name: string
  date: string
}

export interface ILibraryFile {
  id: number
  name: string // имя физического файла на сервере
  title: string // имя файла в интерфейсе приложения
}

export interface IEvents {
  [date: string]: {
    title: string
    content: string
  }
}

export interface IEvent {
  /*
   * 01.03.2020
   */
  date: string
  title: string
  content: string
}

export interface ITodo {
  [key: string]: {
    date: string
    text: string
    order: number
  }
}

export interface ITodoItem {
  id: string
  date: string
  text: string
  order: number
}

export interface ITodoOrder {
  [id: string]: number
}

export interface ILink {
  id: string
  url: string
  name: string
}

export interface IJsonHeaders {
  headers: {
    'X-Honeypot': string
    'Content-Type': string
    'Authorization'?: string
  }
}

type TResponseStatus = 'success' | 'error'

export interface IResponse<TData> {
  status: TResponseStatus
  token?: string
  data?: TData
  message?: string
  messages?: Array<string>
}

export interface ICheckResponse {
  json: string
  md: string
  events: string
  links: string
  todo: string
}

export type IResolveFunc<T> = (value: T) => void

export interface IModalInfo {
  title: string
  width?: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  resolveFunction?: IResolveFunc<any>
}

export interface IRootState {
  loading: boolean
  userDataPath: string
  downloadsTargetPath: string
  fsmState: symbol
  libraryData: string
  libraryFiles: Array<ILibraryFile>
  libraryFileId: string | number
  libraryTree: ITreeItem[]
  filter: IFilters
  isAuth: boolean
  token: string
  isDevelopment: boolean
  json: IJson
  archives: IArchive[]
  todo: ITodo
  events: IEvents
  links: ILink
  isAboutPopupShow: boolean
  isUploadingPopupShow: boolean
  isLinkAddPopupShow: boolean
  isLibraryFileAddPopupShow: boolean
  timeout: NodeJS.Timeout | null
  notification: boolean
  error: boolean
  component: string
}
