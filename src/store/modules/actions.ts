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
import { AuthQuery, LibraryFileQuery } from '~/domain/queries'
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
  EditProjectCommand
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
   * @param {AuthQuery} data
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
   * Start
   */
  @Queryable(TYPES.StartQuery)
  async actionAuthentication(store: TStore): Promise<boolean> {
    try {
      await $http.get<IResponse<boolean>>('start')
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
      const resp = await $http.get<IJson>('projects')
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
      await $http.put<IJson, boolean>('project', command.data)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.post<IJson, boolean>('project', command.data)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.delete(`project/?key=${command.stamp}`)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.put<{ key: string | number }, void>('project/archive', {
        key: command.stamp
      })
      return Promise.resolve(true)
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
  async actionArchiveRestore(store: TStore, command: ArchiveRestoreCommand): Promise<boolean> {
    try {
      await $http.post('project/archive/restore', command)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.delete(`project/archive/?name=${command.name}`)
      return Promise.resolve(true)
    } catch(e) {
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
      const resp = await $http.post<FormData, IFile>('upload', command.file)
      return Promise.resolve(resp.data)
    } catch(e) {
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
      const resp = await $http.get<Array<ILibraryFile>>('library/list')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      if(resp.message === 'Network Error') {
        store.commit('setError', true)
        return Promise.reject(resp)
      }
      store.commit('setLibraryFiles', resp.data)
      return resp.data
    } catch(e) {
      console.log(e)
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
   * @param {AddLibraryFileCommand} command
   */
  @Commandable(TYPES.AddLibraryFileCommand)
  async actionAddLibraryFile(store: TStore, command: AddLibraryFileCommand): Promise<Array<ILibraryFile>> {
    try {
      const resp = await $http.put<ILibraryFile, Array<ILibraryFile>>('library', command.data)
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setLibraryFiles', resp.data)
      store.commit('setLibraryFileId', command.data.id)
      return resp.data
    } catch(e) {
      console.log(e)
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
    try {
      await $http.post('library', command)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.delete(`library/?id=${command.id}`)
      return Promise.resolve(true)
    } catch(e) {
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
      const resp = await $http.get<Array<ITodo>>('todo')
      if(!resp || !resp.data) {
        return Promise.reject(resp)
      }
      store.commit('setTodo', resp.data)
      return resp.data
    } catch(e) {
      console.log(e)
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
      await $http.put('todo', command.item)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.delete(`todo/?id=${command.id}`)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.post('todo/order', command.result)
      return Promise.resolve(true)
    } catch(e) {
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
      const resp = await $http.get<Array<IEvent>>('events')
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
   * Update Event
   * @param store Store
   * @param {UpdateEventCommand} command
   */
  @Commandable(TYPES.UpdateEventCommand)
  async actionUpdateEvent(store: TStore, command: UpdateEventCommand): Promise<boolean> {
    try {
      await $http.put('events', command.event)
      return Promise.resolve(true)
    } catch(e) {
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
      await $http.delete(`events/?date=${command.date}`)
      return Promise.resolve(true)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * ==============================
   * ************ Links *********
   * ==============================
   */

  /**
   * Get Links
   * @param store Store
   */
  @Queryable(TYPES.LinksQuery)
  async actionGetLinks(store: TStore): Promise<Array<ILink>> {
    try {
      const resp = await $http.get<Array<ILink>>('links')
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
   * Update Links
   * @param store Store
   * @param {UpdateLinksCommand} command
   */
  @Commandable(TYPES.UpdateLinksCommand)
  async actionUpdateLinks(store: TStore, command: UpdateLinksCommand): Promise<boolean> {
    try {
      await $http.put('links', command.link)
      return Promise.resolve(true)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Links
   * @param store Store
   * @param {DeleteLinkCommand} command
   */
  @Commandable(TYPES.DeleteLinkCommand)
  async actionDeleteLink(store: TStore, command: DeleteLinkCommand): Promise<boolean> {
    try {
      await $http.delete(`links/?id=${command.id}`)
      return Promise.resolve(true)
    } catch(e) {
      return Promise.reject(e)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
