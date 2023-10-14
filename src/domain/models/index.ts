import { FsmStates } from '~/application/app'

export interface IMenu {
  name: string
  nameAlt: string
  fsmState: symbol
  id: number
}

export interface IEditor {
  container: {
    remove: () => void
  }
  getValue: () => string
  on: (event: string, callback: () => void) => void
  setValue: (value: string) => void
  destroy: () => void
  setShowPrintMargin: (value: boolean) => void
  setHighlightActiveLine: (value: boolean) => void
  getSession: () => {
    selection: {
      clearSelection: () => void
    }
  }
}

export interface ITreeItem {
  id: string
  name: string
  slug: string
  children?: ITreeItem[]
}

export interface IFile {
  id: string
  name: string
  extension: string
  createDateTime: string
  size: number
  href: string
}

export interface IProject {
  key: string
  date: string
  name: string
  lock: boolean
  message?: string
  unread?: boolean
}

export interface IProjects {
  [stamp: string]: IProject
}

export interface IFilters {
  [stamp: string]: boolean
}

export interface IArchive {
  id: string
  name: string
  date: string
}

export interface ILibraryFile {
  id: string
  name: string // имя физического файла на сервере
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
  date?: string
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
  id?: string
  url: string
  name: string
}

type TResponseStatus = 'success' | 'error'

export interface IUser {
  id: string
  login: string
  email: string
  displayName: string
  waitingVerify?: boolean
  yandexDiskAccessToken: string
  yandexDiskRefreshToken: string
}

export interface IResponse<TData> {
  status: TResponseStatus
  data?: TData
  message?: string
  user?: IUser
  token?: string
}

export interface IProjectsState {
  projects: IProjects
  archives: IArchive[]
  filter: IFilters
  selectedProjectKey: string
}

export interface ILibraryState {
  libraryData: string
  libraryFiles: Array<ILibraryFile>
  libraryFileId: string | number
  libraryTree: Array<ITreeItem>
}

export interface ITodoState {
  todo: ITodo
}

export interface IEventsState {
  events: IEvents
}

export interface ILinksState {
  links: ILink
}

export interface IFilesState {
  files: IFile
}

export interface IRootState {
  endpoint: string
  apiPath: string
  loading: boolean
  userDataPath: string
  downloadsTargetPath: string
  fsmState: symbol
  isAuth: boolean
  token: string
  isDevelopment: boolean
  timeout: NodeJS.Timeout | null
  notification: boolean
  error: boolean
  component: string
  section: Record<string, boolean>
  history: Array<keyof typeof FsmStates>
  yandexApiToken: string
  currentUser: IUser
  process: { name: string }
}

export interface IPopupWindowQuery<T> {
  component: string
  modal: {
    title: string
    width?: string
    height?: string
    resolveFunction?: (value: unknown) => Promise<T>
  }
  componentProps?: Record<string, unknown>
  fsmState?: symbol
}

export interface IPopupComponent<T> {
  save: () => T
}
