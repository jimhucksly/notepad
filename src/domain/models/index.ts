export interface IMenu {
  name: string
  nameAlt: string
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

export interface ILibraryFiles {
  [key: string]: ILibraryFile
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
  key: {
    url: string
    name: string
  }
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

type TComponent = 'Preferences' | 'Projects' | 'Library' | 'Todo' | 'Events' | 'Links' | 'JsonViewer'

export interface IRootState {
  loading: boolean
  isProjectsShow: boolean
  userDataPath: string
  downloadsTargetPath: string
  component: TComponent
  libraryData: string
  libraryFiles: ILibraryFiles
  libraryFileId: string | number
  newLibraryFile: ILibraryFile
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
  isPreferencesShow: boolean
  isTodoShow: boolean
  isLibraryShow: boolean
  isEventsShow: boolean
  isJsonViewerShow: boolean
  isLinksShow: boolean
  timeout: NodeJS.Timeout | null
  notification: boolean
  error: boolean
}
