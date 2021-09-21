import { ipcRenderer } from 'electron'
import { cloneDeep } from 'lodash'
import $http from '~/store/http'
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
  ILibraryFile
} from '~/domain/models'
import { TYPES } from '~/domain/types'
import { Queryable } from '~/domain/queries/query.bus'
import { Commandable } from '~/domain/commands/command.bus'
import {
  AuthQuery,
  LibraryFileQuery,
  RefreshYandexTokenQuery,
  SessionQuery,
  YandexDiskInfoQuery,
  YandexDiskResourceLinkQuery,
  YandexTokenQuery
} from '~/domain/queries'
import {
  AuthCommand,
  UploadFileCommand,
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
  DeleteLibraryFileCommand,
  CreateProjectCommand,
  EditProjectCommand,
  RevokeYandexTokenCommand
} from '~/domain/commands'
import { ActionTree, ActionContext } from 'vuex'
import { Hub } from '~/plugins/hub'

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

  @Commandable(TYPES.ReadCommand)
  read(store: TStore, command: ReadCommand): void {
    const json = cloneDeep(store.getters['getJson'])
    delete json[command.stamp]['unread']
    store.commit('setJson', json)
  }

  /**
   * Auth
   * @param store Store
   * @param {AuthQuery} data
   */
  @Queryable(TYPES.AuthQuery)
  async actionAuth(store: TStore, query: AuthQuery): Promise<IResponse<void>> {
    try {
      setProcess(store, 'authentication...')
      const resp = await $http.post<{ login: string, password: string }, void>('auth', {
        login: query.login,
        password: query.password
      })
      setProcess(store, null)
      if(resp.token) {
        return resp
      }
      return Promise.reject(resp)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Session
   * @param store Store
   * @param {SessionQuery} data
   */
  @Queryable(TYPES.SessionQuery)
  async actionSession(store: TStore, query: SessionQuery): Promise<IResponse<void>> {
    try {
      setProcess(store, 'get session...')
      const resp = await $http.post<SessionQuery, void>('session', query)
      if(resp.token) {
        return resp
      }
      setProcess(store, null)
      return Promise.reject(resp)
    } catch(e) {
      return Promise.reject(e)
    }
  }


  /**
   * Start
   */
  @Queryable(TYPES.StartQuery)
  async actionAuthentication(store: TStore): Promise<boolean> {
    try {
      setProcess(store, 'start...')
      await $http.get<IResponse<boolean>>('start')
      setProcess(store, null)
      return Promise.resolve(true)
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
      await $http.get<string>('ping')
      return 'pong'
    } catch(e) {
      return Promise.reject()
    }
  }

  /**
   * Check
   */
  @Commandable(TYPES.CheckCommand)
  async actionCheck(store: TStore): Promise<ICheckResponse> {
    try {
      const resp = await $http.get<ICheckResponse>('check')
      if(!resp || !resp.data) {
        return void 0
      }
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ************ Projects ********
   * ==============================
  */

  /**
   * Get Projects
   * @param {Store} store
   */
  @Queryable(TYPES.ProjectsQuery)
  async actionGetJson(store: TStore): Promise<IJson> {
    try {
      setProcess(store, 'get projects...')
      const resp = await $http.get<IJson>('projects')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      if(resp instanceof Error && resp.message === 'Network Error') {
        store.commit('setError', true)
        return Promise.reject(resp)
      }
      store.commit('setJson', resp.data)
      return resp.data
    } catch(e) {
      store.commit('setLoading', false)
      store.dispatch('auth', false)
      store.commit('setToken', null)
      return Promise.reject(e)
    }
  }

  /**
   * Create New Project
   * @param store Store
   * @param {CreateProjectCommand} command
   */
  @Commandable(TYPES.CreateProjectCommand)
  async actionCreateProject(store: TStore, command: CreateProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'creating project...')
      await $http.put<IJson, boolean>('project', command.data)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Project create failed')
      return Promise.reject(e)
    }
  }

  /**
   * Edit Project
   * @param store Store
   * @param data
   */
  @Commandable(TYPES.EditProjectCommand)
  async actionEditProject(store: TStore, command: EditProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'editing project...')
      await $http.post<IJson, boolean>('project', command.data)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Project edit failed')
      return Promise.reject(e)
    }
  }

  /**
   * Delete Project
   * @param store Store
   * @param {DeleteProjectCommand} command
   */
  @Commandable(TYPES.DeleteProjectCommand)
  async actionDeleteProject(store: TStore, command: DeleteProjectCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing project...')
      await $http.delete(`project/?key=${command.stamp}`)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Project delete failed')
      return Promise.reject(e)
    }
  }

  /**
   * Archiving
   * @param store Store
   * @param {ArchivingCommand} command
   */
  @Commandable(TYPES.ArchivingCommand)
  async actionArchiving(store: TStore, command: ArchivingCommand): Promise<boolean> {
    try {
      setProcess(store, 'move project to archive...')
      await $http.put<{ key: string | number }, void>('project/archive', {
        key: command.stamp
      })
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Project archive failed')
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
      setProcess(store, 'get archives...')
      const resp = await $http.get<Array<IArchive>>('projects/archives')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setArchives', resp.data)
      return resp.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Archive Restore
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(TYPES.ArchiveRestoreCommand)
  async actionArchiveRestore(store: TStore, command: ArchiveRestoreCommand): Promise<boolean> {
    try {
      setProcess(store, 'archive restore...')
      await $http.post('project/archive/restore', command)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Archive restore failed')
      return Promise.reject(e)
    }
  }

  /**
   * Archive Remove
   * @param store Store
   * @param {ArchiveRemoveCommand} command
   */
  @Commandable(TYPES.ArchiveRemoveCommand)
  async actionArchiveRemove(store: TStore, command: ArchiveRemoveCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing archive...')
      await $http.delete(`project/archive/?name=${command.name}`)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Archive remove failed')
      return Promise.reject(e)
    }
  }

  /**
   * Upload File
   * @param store Store
   * @param {UploadFileCommand} command
   */
  @Commandable(TYPES.UploadFileCommand)
  async actionUploadFile(store: TStore, command: UploadFileCommand): Promise<IFile> {
    try {
      setProcess(store, 'uploading file...')
      const resp = await $http.post<FormData, IFile>('upload', command.file)
      setProcess(store, null)
      return Promise.resolve(resp.data)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Upload file failed')
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ************ Library *********
   * ==============================
   */

  /**
   * Get Library Files
   * @param {Store} store
   */
  @Queryable(TYPES.LibraryFilesQuery)
  async actionGetLibraryFiles(store: TStore): Promise<Array<ILibraryFile>> {
    try {
      setProcess(store, 'get library files...')
      const resp = await $http.get<Array<ILibraryFile>>('library/list')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      const main = resp.data.find(file => file.name === 'main.md')
      const files = [main]
      resp.data.forEach(file => {
        if(file.name !== 'main.md') {
          files.push(file)
        }
      })
      store.commit('setLibraryFiles', files)
      const currentId = store.getters.getLibraryFileId
      if(!currentId) {
        const found = files.find(item => item.name === 'main.md')
        if(found) {
          store.commit('setLibraryFileId', found.id)
        }
      }
      return files
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library files fetch failed')
      return Promise.reject(e)
    }
  }

  /**
   * Library File
   * @param store Store
   * @param {LibraryFileQuery} query
   */
  @Queryable(TYPES.LibraryFileQuery)
  async actionFetchLibraryFile(store: TStore, query: LibraryFileQuery): Promise<string> {
    try {
      let url = 'library'
      if(query.id) {
        url = url + '?id=' + query.id
      }
      setProcess(store, 'get library file...')
      const resp = await $http.get<string>(url)
      setProcess(store, null)
      if(!resp || resp.data === undefined) {
        return Promise.reject(resp)
      }
      store.commit('setLibraryData', resp.data)
      return Promise.resolve(resp.data)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file fetch failed')
      return Promise.reject(e)
    }
  }

  /**
   * Add Library File
   * @param store Store
   * @param {AddLibraryFileCommand} command
   */
  @Commandable(TYPES.AddLibraryFileCommand)
  async actionAddLibraryFile(
    store: TStore, command: AddLibraryFileCommand
  ): Promise<boolean> {
    try {
      setProcess(store, 'creating library file...')
      const resp = await $http.put<ILibraryFile, { id: string }>('library', command.data)
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      const files = [...store.getters.getLibraryFiles]
      files.push({
        id: resp.data.id,
        name: command.data.name
      })
      store.commit('setLibraryFiles', files)
      store.commit('setLibraryFileId', resp.data.id)
      return true
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file create failed')
      return Promise.reject(e)
    }
  }

  /**
   * Update Library
   * @param store Store
   * @param {UpdateLibraryCommand} command
   */
  @Commandable(TYPES.UpdateLibraryCommand)
  async actionUpdateLibraryFile(store: TStore, command: UpdateLibraryCommand): Promise<boolean> {
    if(!command.id) {
      return void 0
    }
    try {
      setProcess(store, 'editing library file...')
      await $http.post('library', command)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file edit failed')
      return Promise.reject(e)
    }
  }

  /**
   * Delete Library File
   * @param store Store
   * @param {DeleteLibraryFileCommand} command
   */
  @Commandable(TYPES.DeleteLibraryFileCommand)
  async actionDeleteLibraryFile(
    store: TStore, command: DeleteLibraryFileCommand
  ): Promise<boolean> {
    try {
      setProcess(store, 'removing library file...')
      await $http.delete(`library/?name=${command.name}`)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file delete failed')
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ************ Todo *********
   * ==============================
   */

  /**
   * Get Todo
   * @param store Store
   */
  @Queryable(TYPES.TodoQuery)
  async actionGetTodo(store: TStore): Promise<Array<ITodo>> {
    try {
      setProcess(store, 'get todo list...')
      const resp = await $http.get<Array<ITodo>>('todo')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setTodo', resp.data)
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list fetch failed')
      return Promise.reject(e)
    }
  }

  /**
   * Update Todo
   * @param store Store
   * @param {UpdateTodoCommand} command
   */
  @Commandable(TYPES.UpdateTodoCommand)
  async actionUpdateTodo(store: TStore, command: UpdateTodoCommand): Promise<boolean> {
    try {
      setProcess(store, 'update todo list...')
      await $http.put('todo', command.item)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list item update failed')
      return Promise.reject(e)
    }
  }

  /**
   * Remove Todo
   * @param store Store
   * @param {DeleteTodoCommand} command
   */
  @Commandable(TYPES.DeleteTodoCommand)
  async actionRemoveTodo(store: TStore, command: DeleteTodoCommand): Promise<boolean> {
    try {
      setProcess(store, 'remove todo item...')
      await $http.delete(`todo/?id=${command.id}`)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list item remove failed')
      return Promise.reject(e)
    }
  }

  /**
   * Todo Order
   * @param store Store
   * @param {TodoOrderCommand} command
   */
  @Commandable(TYPES.TodoOrderCommand)
  async actionTodoOrder(store: TStore, command: TodoOrderCommand): Promise<boolean> {
    try {
      setProcess(store, 'set todo order...')
      await $http.post('todo/order', command.result)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list sorting failed')
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ************ Events *********
   * ==============================
   */

  /**
   * Get Events
   * @param store Store
   */
  @Queryable(TYPES.EventsQuery)
  async actionGetEvents(store: TStore): Promise<Array<IEvent>> {
    try {
      setProcess(store, 'get events...')
      const resp = await $http.get<Array<IEvent>>('events')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setEvents', resp.data)
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Events list fetch failed')
      return Promise.reject(e)
    }
  }

  /**
   * Update Event
   * @param store Store
   * @param {UpdateEventCommand} command
   */
  @Commandable(TYPES.UpdateEventCommand)
  async actionUpdateEvent(store: TStore, command: UpdateEventCommand): Promise<boolean> {
    try {
      setProcess(store, 'update events...')
      await $http.put('events', command.event)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Event update failed')
      return Promise.reject(e)
    }
  }

  /**
   * Remove Event
   * @param store Store
   * @param {DeleteEventCommand} command
   */
  @Commandable(TYPES.DeleteEventCommand)
  async actionRemoveEvent(store: TStore, command: DeleteEventCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing event...')
      await $http.delete(`events/?date=${command.date}`)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Event remove failed')
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ************ Links ***********
   * ==============================
   */

  /**
   * Get Links
   * @param store Store
   */
  @Queryable(TYPES.LinksQuery)
  async actionGetLinks(store: TStore): Promise<Array<ILink>> {
    try {
      setProcess(store, 'get links...')
      const resp = await $http.get<Array<ILink>>('links')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setLinks', resp.data)
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Links list fetch failed')
      return Promise.reject(e)
    }
  }

  /**
   * Update Links
   * @param store Store
   * @param {UpdateLinksCommand} command
   */
  @Commandable(TYPES.UpdateLinksCommand)
  async actionUpdateLinks(store: TStore, command: UpdateLinksCommand): Promise<boolean> {
    try {
      setProcess(store, 'updating link...')
      await $http.put('links', command.link)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Links list update failed')
      return Promise.reject(e)
    }
  }

  /**
   * Remove Link
   * @param store Store
   * @param {DeleteLinkCommand} command
   */
  @Commandable(TYPES.DeleteLinkCommand)
  async actionDeleteLink(store: TStore, command: DeleteLinkCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing link...')
      await $http.delete(`links/?id=${command.id}`)
      setProcess(store, null)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Links list item remove failed')
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ******* Yandex.Disk API ******
   * ==============================
   */

  /**
   * Create Access Token
   * @param store Store
   * @param {YandexTokenQuery} query
   */
  @Queryable(TYPES.YandexTokenQuery)
  async actionFetchYadexToken(store: TStore, query: YandexTokenQuery): Promise<string> {
    try {
      setProcess(store, 'creating yandex disk token...')
      const resp = await $http.post<YandexTokenQuery, string>('yandexapi/token', query)
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Access token not received')
      return Promise.reject(e)
    }
  }

  /**
   * Refresh Token
   * @param store Store
   * @param {RefreshYandexTokenQuery} query
   */
  @Queryable(TYPES.RefreshYandexTokenQuery)
  async actionRefreshYadexToken(store: TStore, query: RefreshYandexTokenQuery): Promise<boolean> {
    try {
      setProcess(store, 'updating yandex disk token...')
      const resp = await $http.post<RefreshYandexTokenQuery, boolean>('yandexapi/refreshToken', query)
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Access token refresh failed')
      return Promise.reject(e)
    }
  }

  /**
   * Revoke Token
   * @param store Store
   * @param {RevokeYandexTokenCommand} command
   */
  @Commandable(TYPES.RevokeYandexTokenCommand)
  async actionRevokeYandexToken(store: TStore, command: RevokeYandexTokenCommand): Promise<boolean> {
    try {
      setProcess(store, 'revoke yandex disk token...')
      const resp = await $http.post<RefreshYandexTokenQuery, boolean>('yandexapi/revokeToken', command)
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Access token revoke failed')
      return Promise.reject(e)
    }
  }

  /**
   * Yandex disk info
   * @param store Store
   * @param {YandexDiskInfoQuery} query
   */
  @Queryable(TYPES.YandexDiskInfoQuery)
  async actionFetchYandexDiskInfo(
    store: TStore, query: YandexDiskInfoQuery
  ): Promise<unknown> {
    try {
      setProcess(store, 'get yandex disk info...')
      const resp = await $http.get<unknown>('yandexapi/info')
      setProcess(store, null)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Fetch Yandex Disk info failed')
      return Promise.reject(e)
    }
  }

  /**
   * Yandex disk resource link
   * @param store Store
   * @param {YandexDiskResourceLinkQuery} query
   */
  @Queryable(TYPES.YandexDiskResourceLinkQuery)
  async fetchResourceLink(
    store: TStore, query: YandexDiskResourceLinkQuery
  ): Promise<string> {
    try {
      const resp = await $http.get<{ link: string }>(`yandexapi/resource?filename=${query.filename}`)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      return resp.data.link
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Fetch Yandex Disk info failed')
      return Promise.reject(e)
    }
  }
}

const actions = toActionTree(new Actions())

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null)
}

export default actions
