import { ipcRenderer } from 'electron'
import { cloneDeep } from 'lodash'
import $http from '~/store/http'
import { isJSON } from '~/helpers'
import {
  IRootState,
  IJson,
  IArchive,
  ICheckResponse,
  IResponse,
  ITodo,
  ILink,
  IEvent,
  IFile,
  ITodoOrder,
  ITodoItem,
  ILibraryFile
} from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Queryable } from '~/domain/queries/query.bus'
import { Commandable } from '~/domain/commands/command.bus'
import { AuthQuery, LibraryFileQuery } from '~/domain/queries'
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
  DeleteTodoCommand,
  ReadCommand,
  AddLibraryFileCommand,
  DeleteLibraryFileCommand
} from '~/domain/commands'
import { ActionTree, ActionContext } from 'vuex'

type TStore = ActionContext<IRootState, IRootState>

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
          if(currentJson && currentJson[key] === undefined) {
            json[key]['unread'] = true
          }
        })
        const haveUnread = Object.keys(json).find(key => json[key].unread) !== undefined
        if(haveUnread) {
          ipcRenderer.send('set-icon-notification')
        } else {
          ipcRenderer.send('hide-icon-notification')
        }
      } catch(err) {
        console.error(err)
        ipcRenderer.send('open-error-dialog', 'json parse is failed')
      }
    } else {
      json = command.json
    }
    store.commit('setJson', json)
  }

  @Commandable(TYPES.ReadCommand)
  read(store: TStore, command: ReadCommand): void {
    const json = cloneDeep(store.getters['getJson'])
    delete json[command.stamp]['unread']
    const haveUnread = Object.keys(json).find(k => json[k].unread) !== undefined
    if(haveUnread) {
      ipcRenderer.send('set-icon-notification')
    } else {
      ipcRenderer.send('hide-icon-notification')
    }
    store.commit('setJson', json)
  }

  /**
   * Auth
   * @param store Store
   * @param data { login, password }
   */
  @Queryable(TYPES.AuthQuery)
  async actionAuth(store: TStore, query: AuthQuery): Promise<string> {
    try {
      const resp = await $http.post<{ login: string, password: string }, void>('auth', {
        login: query.login,
        password: query.password
      })
      if(resp.token) {
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
    try {
      await $http.get<IResponse<void>>('oauth')
      return
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Ping
   */
  @Queryable(TYPES.PingCommand)
  async actionPing(_: TStore): Promise<string> {
    try {
      await $http.get<string>('PING')
      return 'PONG'
    } catch(e) {
      return Promise.reject()
    }
  }

  /**
   * Get Projects
   * @param {Store} store
   */
  @Queryable(TYPES.JsonQuery)
  async actionGetJson(store: TStore): Promise<IJson> {
    try {
      const resp = await $http.get<IJson>('projects')
      if(!resp || !resp.data) {
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
      store.commit('setToken', null)
      return Promise.reject(e)
    }
  }

  /**
   * Get Library Files
   * @param {Store} store
   */
  @Queryable(TYPES.LibraryFilesQuery)
  async actionGetLibraryFiles(store: TStore): Promise<string> {
    try {
      const resp = await $http.get<string>('library')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      if(resp.message === 'Network Error') {
        store.commit('setError', true)
        return Promise.reject(resp)
      }
      if(isJSON(resp.data)) {
        store.commit('setLibraryFiles', JSON.parse(resp.data))
        return resp.data
      } else {
        return Promise.reject(resp)
      }
    } catch(e) {
      console.log(e)
      return Promise.reject(e)
    }
  }

  /**
   * Library File
   * @param store Store
   * @param query
   */
  @Queryable(TYPES.LibraryFileQuery)
  async actionFetchLibraryFile(store: TStore, query: LibraryFileQuery): Promise<string> {
    try {
      let url = 'library'
      if(query.id) {
        url = url + '?id=' + query.id
      }
      const resp = await $http.get<string>(url)
      if(!resp || resp.data === undefined) {
        return Promise.reject(resp)
      }
      store.commit('setLibraryData', resp.data)
      return Promise.resolve(resp.data)
    } catch(e) {
      console.log(e)
      return Promise.reject(e)
    }
  }

  /**
   * Add Library File
   * @param store Store
   * @param command
   */
  @Commandable(TYPES.AddLibraryFileCommand)
  async actionAddLibraryFile(store: TStore, command: AddLibraryFileCommand): Promise<string> {
    try {
      const resp = await $http.post<{ body: ILibraryFile }, string>('ADD_LIBRARY_FILE', {
        body: command.data
      })
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      if(isJSON(resp.data)) {
        store.commit('setLibraryFiles', JSON.parse(resp.data))
        store.commit('setLibraryFileId', command.data.id)
        return resp.data
      } else {
        return Promise.reject(resp)
      }
    } catch(e) {
      console.log(e)
      return Promise.reject(e)
    }
  }

  /**
   * Update Library
   * @param store Store
   * @param command
   */
  @Commandable(TYPES.UpdateLibraryCommand)
  async actionUpdateLibraryFile(store: TStore, command: UpdateLibraryCommand): Promise<void> {
    try {
      const resp = await $http.post<{ id: string | number, body: string }, void>('SAVE_LIBRARY_FILE', {
        id: command.id || 0,
        body: command.value
      })
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
   * Delete Library File
   * @param store Store
   * @param command
   */
  @Commandable(TYPES.DeleteLibraryFileCommand)
  async actionDeleteLibraryFile(store: TStore, command: DeleteLibraryFileCommand): Promise<void> {
    try {
      const resp = await $http.delete(
        'DELETE_LIBRARY_FILE',
        command
      )
      if(!resp || resp.status !== 'success') {
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
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
    try {
      const resp = await $http.post<{ json: IJson }, void>('UPDATE', {
        json: json.data
      })
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
    try {
      const resp = await $http.post<{ key: string | number }, void>('DELETE', {
        key: command.stamp
      })
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
    try {
      const resp = await $http.post<FormData, IFile>('FILE', command.file)
      if(!resp || !resp.data || !resp.data.name || !resp.data.link) {
        return Promise.reject(resp)
      }
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
    try {
      const resp = await $http.get<Array<IArchive>>('projects/archives')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setArchives', resp.data)
      return resp.data
    } catch(e) {
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('setToken', null)
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
    try {
      const resp = await $http.post<{ name: string }, void>('ARCHIVE_RESTORE', {
        name: command.name
      })
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
      store.commit('setToken', null)
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
    try {
      const resp = await $http.post<{ name: string }, void>('ARCHIVE_REMOVE', {
        name: command.name
      })
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
    try {
      const resp = await $http.post<{ key: string | number }, void>('ARCHIVE', {
        key: command.stamp
      })
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
    try {
      const resp = await $http.get<Array<IEvent>>('EVENTS')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setEvents', resp.data)
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
    try {
      const resp = await $http.get<Array<ILink>>('LINKS')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setLinks', resp.data)
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
    try {
      const resp = await $http.post<{ body: IEvent }, void>('EVENT', {
        body: command.event
      })
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
    try {
      const resp = await $http.post<{ body: { remove: string } }, void>('EVENT', {
        body: {
          remove: command.date
        }
      })
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
   * Update Links
   * @param store Store
   * @param command { link: ILink }
   */
  @Commandable(TYPES.UpdateLinksCommand)
  async actionUpdateLinks(store: TStore, command: UpdateLinksCommand): Promise<void> {
    try {
      const resp = await $http.post<{ body: ILink }, void>('LINK', {
        body: command.link
      })
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
    try {
      const resp = await $http.post<{ body: typeof command }, void>('DELETE_LINK', {
        body: {
          id: command.id
        }
      })
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
    try {
      const resp = await $http.get<Array<ITodo>>('GET_TODO')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setTodo', resp.data)
      return resp.data
    } catch(e) {
      console.log(e)
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('setToken', null)
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
    try {
      const resp = await $http.post<{ body: ITodoItem }, void>('TODO', {
        body: command.item
      })
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
    try {
      const resp = await $http.post<{ body: { remove: string } }, void>('TODO', {
        body: {
          remove: command.id
        }
      })
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
    try {
      const resp = await $http.post<{ body: ITodoOrder }, void>('TODO_SET_ORDER', {
        body: command.result
      })
      if(!resp || resp.status !== 'success') {
        return Promise.reject(resp)
      }
      return Promise.resolve()
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Check
   */
  @Commandable(TYPES.CheckCommand)
  async actionCheck(store: TStore): Promise<ICheckResponse> {
    try {
      const resp = await $http.get<ICheckResponse>('CHECK')
      if(!resp || !resp.data) {
        return void 0
      }
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async actionTest() {
    try {
      const resp = await $http.get('')
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
