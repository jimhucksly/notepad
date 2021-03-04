import { ipcRenderer } from 'electron'
import { cloneDeep } from 'lodash'
import $http from '~/store/http'
import { isJSON } from '~/helpers'
import {
  IRootState,
  IJson,
  IJsonHeaders,
  IArchive,
  ICheckResponse,
  IResponse,
  ITodo,
  ILink,
  IEvent,
  IFile,
  ITodoOrder
} from '~/domain/models'
import storage from '~/plugins/storage'
import { userDataFileName } from '~/constants'
import { TYPES } from '~/domain/types'
import { Queryable } from '~/domain/queries/query.bus'
import { Commandable } from '~/domain/commands/command.bus'
import { AuthQuery } from '~/domain/queries'
import {
  AuthCommand,
  SetJsonCommand,
  UploadFileCommand,
  UpdateJsonCommand,
  DeleteProjectCommand,
  ArchiveRestoreCommand,
  ArchiveRemoveCommand,
  ArchivingCommand,
  UpdateEventCommand,
  DeleteEventCommand,
  UpdateLibraryCommand,
  UpdateLinksCommand,
  DeleteLinkCommand,
  TodoOrderCommand,
  UpdateTodoCommand,
  DeleteTodoCommand
} from '~/domain/commands'
import { ActionTree, ActionContext } from 'vuex'

type TStore = ActionContext<IRootState, IRootState>

const jsonHeaders: IJsonHeaders = {
  headers: {
    'X-Honeypot': 'App',
    'Content-Type': 'application/json'
  }
}

function toActionTree<S, R>(obj: ActionTree<S, R>): ActionTree<S, R> {
  const arr = Object.getOwnPropertyNames(Object.getPrototypeOf(obj))
  const result: ActionTree<S, R> = {}
  arr.forEach(key => {
    if(key !== 'constructor') {
      result[key] = obj[key]
    }
  })
  return result
}

class Actions implements ActionTree<IRootState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  @Commandable(TYPES.AuthCommand)
  auth(store: TStore, command: AuthCommand) {
    store.commit('setIsAuth', command.flag)
    ipcRenderer.send(command.flag ? 'authorized' : 'unauthorized')
  }

  @Commandable(TYPES.SetJsonCommand)
  json(store: TStore, command: SetJsonCommand): void {
    let json: IJson = {}
    if(typeof command.json === 'string' && isJSON(command.json)) {
      try {
        json = JSON.parse(command.json)
        const currentJson = store.getters['getJson']
        Object.keys(json).forEach(key => {
          if(currentJson && currentJson[key] === undefined) json[key]['unread'] = true
        })
        const haveUnread = Object.keys(json).find(key => json[key].unread) !== undefined
        if(haveUnread) ipcRenderer.send('set-icon-notification')
        else ipcRenderer.send('hide-icon-notification')
      } catch(err) {
        console.error(err)
        ipcRenderer.send('open-error-dialog', 'json parse is failed')
      }
    } else json = command.json
    store.commit('setJson', json)
  }

  eventsJson(store: TStore, data: Array<IEvent> | string): void {
    let json: Array<IEvent>
    if(typeof data === 'string' && isJSON(data)) {
      json = JSON.parse(data)
    } else json = data as Array<IEvent>
    store.commit('setEvents', json)
  }

  linksJson(store: TStore, data: Array<ILink> | string): void {
    let json: Array<ILink>
    if(typeof data === 'string' && isJSON(data)) {
      json = JSON.parse(data)
    } else json = data as Array<ILink>
    store.commit('setLinks', json)
  }

  todoJson(store: TStore, data: Array<ITodo> | string): void {
    let json: Array<ITodo>
    if(typeof data === 'string' && isJSON(data)) {
      json = JSON.parse(data)
    } else json = data as Array<ITodo>
    store.commit('setTodo', json)
  }

  read(store: TStore, key: string): void {
    const json = cloneDeep(store.getters['getJson'])
    delete json[key]['unread']
    const haveUnread = Object.keys(json).find(k => json[k].unread) !== undefined
    if(haveUnread) ipcRenderer.send('set-icon-notification')
    else ipcRenderer.send('hide-icon-notification')
    store.commit('setJson', json)
  }

  aboutPopupShow(store: TStore, flag: boolean): void {
    store.commit('setIsAboutPopupShow', flag)
  }

  uploadingPopupShow(store: TStore, flag: boolean): void {
    store.commit('setIsUploadingPopupShow', flag)
  }

  linkAddPopupShow(store: TStore, flag: boolean): void {
    store.commit('setIsLinkAddPopupShow', flag)
  }

  preferences(store: TStore, flag: boolean): void {
    store.commit('setIsPreferencesShow', flag)
    if(flag) {
      store.commit('setComponent', 'Preferences')
    }
  }

  projects(store: TStore, flag: boolean): void {
    store.commit('setIsProjectsShow', flag)
    if(flag) {
      store.commit('setComponent', 'Projects')
    }
  }

  library(store: TStore, flag: boolean): void {
    store.commit('setIsLibraryShow', flag)
    if(flag) {
      store.commit('setComponent', 'Library')
    }
  }

  todo(store: TStore, flag: boolean): void {
    store.commit('setIsTodoShow', flag)
    if(flag) {
      store.commit('setComponent', 'Todo')
    }
  }

  events(store: TStore, flag: boolean): void {
    store.commit('setIsEventsShow', flag)
    if(flag) {
      store.commit('setComponent', 'Events')
    }
  }

  links(store: TStore, flag: boolean): void {
    store.commit('setIsLinksShow', flag)
    if(flag) {
      store.commit('setComponent', 'Links')
    }
  }

  jsonViewer(store: TStore, flag: boolean): void {
    store.commit('setIsJsonViewerShow', flag)
    if(flag) {
      store.commit('setComponent', 'JsonViewer')
    }
  }

  previousPage(store: TStore, page: string): void {
    store.commit('setPreviousPage', page)
  }

  /**
   * Auth
   * @param store Store
   * @param data { login, password }
   */
  @Queryable(TYPES.AuthQuery)
  async actionAuth(store: TStore, query: AuthQuery): Promise<string> {
    try {
      const resp = await $http.post<{ login: string, password: string }, void>('AUTH', {
        login: query.login,
        password: query.password
      }, jsonHeaders)
      if(resp.token) {
        store.commit('token', resp.token)
        const userDataPath = store.getters.getUserDataPath
        await storage.set(userDataPath, userDataFileName, { token: resp.token })
        console.log('write to file is successfully completed')
        return resp.token
      }
      return Promise.reject(resp)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * OAuth
   */
  @Queryable(TYPES.OAuthQuery)
  async actionAuthentication(store: TStore): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      await $http.get<IResponse<void>>('OAUTH', jsonHeaders)
      return
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Ping
   */
  @Commandable(TYPES.PingCommand)
  async actionPing(_: TStore): Promise<string> {
    try {
      const resp = await $http.get<string>('PING', jsonHeaders)
      if(!resp || !resp.data || resp.data !== 'PONG') {
        return Promise.reject()
      }
      return resp.data
    } catch(e) {
      return Promise.reject()
    }
  }

  /**
   * Get Json
   * @param {Store} store
   */
  @Queryable(TYPES.JsonQuery)
  async actionGetJson(store: TStore): Promise<IJson> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<IJson>('GET_JSON', jsonHeaders)
      if(!resp || !resp.data || !resp.data) {
        return Promise.reject(resp)
      }
      if(resp instanceof Error && resp.message === 'Network Error') {
        store.commit('setError', true)
        return Promise.reject(resp)
      }
      store.dispatch('json', {
        json: resp.data
      })
      return resp.data
    } catch(e) {
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('token', null)
      return Promise.reject(e)
    }
  }

  /**
   * Get Library
   * @param store Store
   */
  @Queryable(TYPES.LibraryQuery)
  async actionGetLibrary(store: TStore): Promise<string> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<string>('GET_MD', jsonHeaders)
      if(!resp || !resp.data || !resp.data) {
        return Promise.reject(resp)
      }
      if(resp.message === 'Network Error') {
        store.commit('setError', true)
        return Promise.reject(resp)
      }
      store.commit('setLibraryData', resp.data)
      return resp.data
    } catch(e) {
      console.log(e)
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('token', null)
      return Promise.reject(e)
    }
  }

  /**
   * UpdateJson
   * @param store Store
   * @param data
   */
  @Commandable(TYPES.UpdateJsonCommand)
  async actionUpdateJson(store: TStore, json: UpdateJsonCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ json: IJson }, void>('UPDATE', {
        json: json.data
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'send message is failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Delete Project
   * @param store Store
   * @param data
   */
  @Commandable(TYPES.DeleteProjectCommand)
  async actionDelete(store: TStore, command: DeleteProjectCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ key: string | number }, void>('DELETE', {
        key: command.stamp
      }, jsonHeaders)
      if(!resp) {
        ipcRenderer.send('open-error-dialog', 'delete message is failed')
        throw new Error('error')
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Upload File
   * @param store Store
   * @param data
   */
  @Commandable(TYPES.UploadFileCommand)
  async actionUploadFile(store: TStore, command: UploadFileCommand): Promise<IFile> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    jsonHeaders.headers['Content-Type'] = 'multipart/form-data'
    store.dispatch('uploadingPopupShow', true)
    try {
      const resp = await $http.post<FormData, IFile>('FILE', command.file, jsonHeaders)
      if(!resp || !resp.data || !resp.data.name || !resp.data.link) {
        return Promise.reject(resp)
      }
      store.dispatch('uploadingPopupShow', false)
      return Promise.resolve(resp.data)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Archives
   * @param store Store
   * @param data
   */
  @Queryable(TYPES.ArchivesQuery)
  async actionGetArchives(store: TStore): Promise<Array<IArchive>> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<Array<IArchive>>('GET_ARCHIVES', jsonHeaders)
      if(!resp || !resp.data || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setArchives', resp.data)
      return resp.data
    } catch(e) {
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('token', null)
      return Promise.reject(e)
    }
  }

  /**
   * Archive Restore
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(TYPES.ArchiveRestoreCommand)
  async actionArchiveRestore(store: TStore, command: ArchiveRestoreCommand): Promise<string> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ name: string }, void>('ARCHIVE_RESTORE', {
        name: command.name
      }, jsonHeaders)
      if(!resp || !resp.message) {
        ipcRenderer.send('open-error-dialog', 'archive restore is failed')
        return Promise.reject(resp)
      }
      if(resp.status === 'success' && resp.message) {
        return resp.message
      }
      return Promise.reject(resp)
    } catch(e) {
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('token', null)
      return Promise.reject(e)
    }
  }

  /**
   * Archive Remove
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(TYPES.ArchiveRemoveCommand)
  async actionArchiveRemove(store: TStore, command: ArchiveRemoveCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ name: string }, void>('ARCHIVE_REMOVE', {
        name: command.name
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'archive remove is failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('setToken', null)
      return Promise.reject(e)
    }
  }

  /**
   * Archiving
   * @param store Store
   * @param command { stamp: string}
   */
  @Commandable(TYPES.ArchivingCommand)
  async actionArchiving(store: TStore, command: ArchivingCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ key: string | number }, void>('ARCHIVE', {
        key: command.stamp
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'archive project is failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Events
   * @param store Store
   */
  @Queryable(TYPES.EventsQuery)
  async actionGetEvents(store: TStore): Promise<Array<IEvent>> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<Array<IEvent>>('EVENTS', jsonHeaders)
      if(!resp || !resp.data || !resp.data) {
        return Promise.reject(resp)
      }
      store.dispatch('eventsJson', resp.data)
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Links
   * @param store Store
   */
  @Queryable(TYPES.LinksQuery)
  async actionGetLinks(store: TStore): Promise<Array<ILink>> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<Array<ILink>>('LINKS', jsonHeaders)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.dispatch('linksJson', resp.data)
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Update Event
   * @param store Store
   * @param command { event: IEvent }
   */
  @Commandable(TYPES.UpdateEventCommand)
  async actionUpdateEvent(store: TStore, command: UpdateEventCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: IEvent }, void>('EVENT', {
        body: command.event
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'save event failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Event
   * @param store Store
   * @param command { date: string }
   */
  @Commandable(TYPES.DeleteEventCommand)
  async actionRemoveEvent(store: TStore, command: DeleteEventCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: { remove: string } }, void>('EVENT', {
        body: {
          remove: command.date
        }
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'delete event failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Update Library
   * @param store Store
   * @param command { value: string }
   */
  @Commandable(TYPES.UpdateLibraryCommand)
  async actionUpdateLibrary(store: TStore, command: UpdateLibraryCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: string }, void>('SAVE', {
        body: command.value
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'save markdown failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Update Links
   * @param store Store
   * @param command { link: ILink }
   */
  @Commandable(TYPES.UpdateLinksCommand)
  async actionUpdateLinks(store: TStore, command: UpdateLinksCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: ILink }, void>('LINK', {
        body: command.link
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'save link failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Links
   * @param store Store
   * @param command { key: string }
   */
  @Commandable(TYPES.DeleteLinkCommand)
  async actionDeleteLink(store: TStore, command: DeleteLinkCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: { remove: string } }, void>('LINK', {
        body: {
          remove: command.key
        }
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'delete link failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Todo
   * @param store Store
   */
  @Queryable(TYPES.TodoQuery)
  async actionGetTodo(store: TStore): Promise<Array<ITodo>> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<Array<ITodo>>('GET_TODO', jsonHeaders)
      if(!resp || !resp.data || !resp.data) {
        return Promise.reject(resp)
      }
      store.dispatch('todoJson', resp.data)
      return resp.data
    } catch(e) {
      console.log(e)
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('token', null)
      return Promise.reject(e)
    }
  }

  /**
   * Update Todo
   * @param store Store
   * @param command { item: ITodo }
   */
  @Commandable(TYPES.UpdateTodoCommand)
  async actionUpdateTodo(store: TStore, command: UpdateTodoCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: ITodo }, void>('TODO', {
        body: command.item
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'todo item add failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Todo
   * @param store Store
   * @param command { id: string }
   */
  @Commandable(TYPES.DeleteTodoCommand)
  async actionRemoveTodo(store: TStore, command: DeleteTodoCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: { remove: string } }, void>('TODO', {
        body: {
          remove: command.id
        }
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'todo item add failed')
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Todo Order
   * @param store Store
   * @param command { result: ITodoOrder}
   */
  @Commandable(TYPES.TodoOrderCommand)
  async actionTodoOrder(store: TStore, command: TodoOrderCommand): Promise<void> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post<{ body: ITodoOrder }, void>('TODO_SET_ORDER', {
        body: command.result
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async actionCheck(store: TStore): Promise<ICheckResponse> {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get<ICheckResponse>('CHECK', jsonHeaders)
      if(!resp || !resp.data) {
        return void 0
      }
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
