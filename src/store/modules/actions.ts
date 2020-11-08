import { ipcRenderer } from 'electron'
import { cloneDeep } from 'lodash'
import $http from '~/store/http'
import { isJSON } from '~/helpers'
import { IRootState, IJson, IJsonHeaders } from '~/domain/models'
import storage from '~/plugins/storage'
import { userDataFileName } from '~/constants'
import { Queryable } from '~/domain/queries/query.bus'
import { Commandable } from '~/domain/commands/command.bus'
import {
  AuthQuery,
  JsonQuery,
  LibraryQuery,
  ArchivesQuery,
  EventsQuery,
  LinksQuery,
  TodoQuery
} from '~/domain/queries'
import {
  AuthCommand,
  LoadingCommand,
  SetJsonCommand,
  SetFilterCommand,
  UploadFileCommand,
  UpdateJsonCommand,
  DeleteProjectCommand,
  ArchiveRestoreCommand,
  ArchiveRemoveCommand,
  ArchivingCommand,
  SetArchivesCommand,
  UpdateEventCommand,
  DeleteEventCommand,
  SetTreeCommand,
  UpdateLibraryCommand,
  UpdateLinksCommand,
  DeleteLinkCommand,
  TodoOrderCommand,
  UpdateTodoCommand,
  DeleteTodoCommand
} from '~/domain/commands'
import { PingCommand } from '~/domain/commands/ping.command'
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
  [key: string]: (injectee: TStore, payload: any) => any

  @Commandable(AuthCommand)
  auth(store: TStore, command: AuthCommand) {
    store.commit('setIsAuth', command.flag)
    ipcRenderer.send(command.flag ? 'authorized' : 'unauthorized')
    store.dispatch('timeout', null)
  }

  token(store: TStore, value: any) {
    store.commit('setToken', value)
  }

  @Commandable(LoadingCommand)
  loading(store: TStore, command: LoadingCommand) {
    store.commit('setLoading', command.flag)
  }

  userDataPath(store: TStore, path: any) {
    store.commit('setUserDataPath', path)
  }

  error(store: TStore, flag: any) {
    store.commit('setError', flag)
  }

  isDevelopment(store: TStore, flag: any) {
    store.commit('setIsDevelopment', flag)
    store.commit('setTimeout', null)
  }

  @Commandable(SetJsonCommand)
  json(store: TStore, command: SetJsonCommand) {
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
        store.dispatch('timeout', null)
        ipcRenderer.send('open-error-dialog', 'json parse is failed')
      }
    } else json = command.json
    store.commit('setJson', json)
  }

  @Commandable(SetArchivesCommand)
  archives(store: TStore, command: SetArchivesCommand) {
    store.commit('setArchives', command.items)
  }

  md(store: TStore, data: any) {
    store.commit('setMd', data)
  }

  eventsJson(store: TStore, data: any) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch(e) {
        console.log(e)
      }
    } else json = data
    store.commit('setEvents', json)
  }

  linksJson(store: TStore, data: any) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch(e) {
        console.log(e)
      }
    } else json = data
    store.commit('setLinks', json)
  }

  todoJson(store: TStore, data: any) {
    let json
    if(isJSON(data)) {
      try {
        json = JSON.parse(data)
      } catch(e) {
        console.log(e)
      }
    } else json = data
    store.commit('setTodo', json)
  }

  @Commandable(SetTreeCommand)
  mdTree(store: TStore, command: SetTreeCommand) {
    store.commit('setMdTree', command.tree)
  }

  read(store: TStore, key: any) {
    const json = cloneDeep(store.getters['getJson'])
    delete json[key]['unread']
    const haveUnread = Object.keys(json).find(k => json[k].unread) !== undefined
    if(haveUnread) ipcRenderer.send('set-icon-notification')
    else ipcRenderer.send('hide-icon-notification')
    store.commit('setJson', json)
  }

  @Commandable(SetFilterCommand)
  filter(store: TStore, command: SetFilterCommand) {
    store.commit('setFilter', command.filters)
  }

  timeout(store: TStore, int: any) {
    if(int) {
      store.commit('setTimeout', int)
    } else {
      const timeout = store.getters.getTimeout
      if(timeout) clearTimeout(timeout)
    }
  }

  aboutPopupShow(store: TStore, flag: any) {
    store.commit('setIsAboutPopupShow', flag)
  }

  uploadingPopupShow(store: TStore, flag: any) {
    store.commit('setIsUploadingPopupShow', flag)
  }

  linkAddPopupShow(store: TStore, flag: any) {
    store.commit('setIsLinkAddPopupShow', flag)
  }

  preferences(store: TStore, flag: any) {
    store.commit('setIsPreferencesShow', flag)
    if(flag) {
      store.commit('setComponent', 'Preferences')
    }
  }

  projects(store: TStore, flag: any) {
    store.commit('setIsProjectsShow', flag)
    if(flag) {
      store.commit('setComponent', 'Projects')
    }
  }

  library(store: TStore, flag: any) {
    store.commit('setIsLibraryShow', flag)
    if(flag) {
      store.commit('setComponent', 'Library')
    }
  }

  todo(store: TStore, flag: any) {
    store.commit('setIsTodoShow', flag)
    if(flag) {
      store.commit('setComponent', 'Todo')
    }
  }

  events(store: TStore, flag: any) {
    store.commit('setIsEventsShow', flag)
    if(flag) {
      store.commit('setComponent', 'Events')
    }
  }

  links(store: TStore, flag: any) {
    store.commit('setIsLinksShow', flag)
    if(flag) {
      store.commit('setComponent', 'Links')
    }
  }

  jsonViewer(store: TStore, flag: any) {
    store.commit('setIsJsonViewerShow', flag)
    if(flag) {
      store.commit('setComponent', 'JsonViewer')
    }
  }

  previousPage(store: TStore, page: string) {
    store.commit('setPreviousPage', page)
  }

  downloadsTargetPath(store: TStore, path: any) {
    store.commit('setDownloadsTargetPath', path)
  }

  setTimeout(store: TStore) {
    let timeout = store.getters.getTimeout
    if(timeout) store.dispatch('timeout', null)
    clearTimeout(timeout)
    const isDevelopment = store.getters.getIsDevelopment
    if(isDevelopment) {
      store.dispatch('timeout', null)
      clearTimeout(timeout)
      return null
    }
    timeout = setTimeout(() => {
      store.dispatch('actionCheck')
        .then(resp => {
          store.dispatch('error', false)
          store.dispatch('setTimeout')
          if(resp.status !== 204) {
            store.dispatch('json', resp.data.data)
            store.dispatch('md', resp.data.md)
            store.dispatch('eventsJson', resp.data.events)
            store.dispatch('linksJson', resp.data.links)
            store.dispatch('todoJson', resp.data.todo)
          }
          return null
        })
        .catch(() => {
          store.dispatch('error', true)
          store.dispatch('setTimeout')
        })
    }, isDevelopment ? 6000 : 3000)
    store.dispatch('timeout', timeout)
    return null
  }

  /**
   * Auth
   * @param store Store
   * @param data { login, password }
   */
  @Queryable(AuthQuery)
  async actionAuth(store: TStore, data: any) {
    try {
      const resp = await $http.post('AUTH', {
        login: data.login,
        password: data.password
      }, jsonHeaders)
      if(resp.token) {
        store.dispatch('token', resp.token)
        const userDataPath = store.getters.getUserDataPath
        await storage.set(userDataPath, userDataFileName, { token: resp.token })
        console.log('write to file is successfully completed')
        return resp
      }
      return Promise.reject(resp)
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Ping
   */
  @Commandable(PingCommand)
  async actionPing(_: TStore) {
    try {
      const resp = await $http.get('PING', jsonHeaders)
      if(!resp || !resp.data || resp.data !== 'PONG') return null
      return resp.data
    } catch(e) {
      return null
    }
  }

  /**
   * Get Json
   * @param store Store
   */
  @Queryable(JsonQuery)
  async actionGetJson(store: TStore) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get('GET_JSON', jsonHeaders)
      if(!resp || !resp.data || !resp.data.data) {
        return Promise.reject(resp)
      }
      if(resp.message === 'Network Error') {
        store.dispatch('error', true)
        return Promise.reject(resp)
      }
      store.dispatch('json', {
        json: resp.data.data
      })
      store.dispatch('setTimeout')
      return resp
    } catch(e) {
      store.dispatch('loading', false)
      store.dispatch('auth', false)
      store.dispatch('token', null)
      store.dispatch('timeout', null)
      return Promise.reject(e)
    }
  }

  /**
   * Get Library
   * @param store Store
   */
  @Queryable(LibraryQuery)
  async actionGetLibrary(store: TStore) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get('GET_MD', jsonHeaders)
      if(!resp || !resp.data || !resp.data.data) {
        return Promise.reject(resp)
      }
      if(resp.message === 'Network Error') {
        store.dispatch('error', true)
        return Promise.reject(resp)
      }
      store.dispatch('md', resp.data.data)
      return resp
    } catch(e) {
      console.log(e)
      store.dispatch('loading', false)
      store.dispatch('auth', false)
      store.dispatch('token', null)
      store.dispatch('timeout', null)
      return Promise.reject(e)
    }
  }

  /**
   * UpdateJson
   * @param store Store
   * @param data
   */
  @Commandable(UpdateJsonCommand)
  async actionUpdateJson(store: TStore, json: any) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('UPDATE', {
        json: json.data
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'send message is failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Delete Project
   * @param store Store
   * @param data
   */
  @Commandable(DeleteProjectCommand)
  async actionDelete(store: TStore, command: DeleteProjectCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('DELETE', {
        key: command.stamp
      }, jsonHeaders)
      if(!resp) {
        ipcRenderer.send('open-error-dialog', 'delete message is failed')
        throw new Error('error')
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Upload File
   * @param store Store
   * @param data
   */
  @Commandable(UploadFileCommand)
  async actionUploadFile(store: TStore, command: UploadFileCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    jsonHeaders.headers['Content-Type'] = 'multipart/form-data'
    store.dispatch('uploadingPopupShow', true)
    try {
      const resp = await $http.post('FILE', command.file, jsonHeaders)
      if(!resp && !resp.filename && !resp.link) {
        return Promise.reject(resp)
      }
      store.dispatch('uploadingPopupShow', false)
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Archives
   * @param store Store
   * @param data
   */
  @Queryable(ArchivesQuery)
  async actionGetArchives(store: TStore) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get('GET_ARCHIVES', jsonHeaders)
      if(!resp || !resp.data || !resp.data.data) {
        return Promise.reject(resp)
      }
      store.dispatch('archives', {
        items: resp.data.data
      })
      return resp.data.data
    } catch(e) {
      store.dispatch('loading', false)
      store.dispatch('auth', false)
      store.dispatch('token', null)
      store.dispatch('timeout', null)
      return Promise.reject(e)
    }
  }

  /**
   * Archive Restore
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(ArchiveRestoreCommand)
  async actionArchiveRestore(store: TStore, command: ArchiveRestoreCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('ARCHIVE_RESTORE', {
        name: command.name
      }, jsonHeaders)
      if(!resp || !resp.message) {
        ipcRenderer.send('open-error-dialog', 'archive restore is failed')
        return Promise.reject(resp)
      }
      if(resp.status === 'success' && resp.message) {
        return resp.message
      } else return Promise.reject(resp)
    } catch(e) {
      store.dispatch('loading', false)
      store.dispatch('auth', false)
      store.dispatch('token', null)
      store.dispatch('timeout', null)
      return Promise.reject(e)
    }
  }

  /**
   * Archive Remove
   * @param store Store
   * @param command { name: string}
   */
  @Commandable(ArchiveRemoveCommand)
  async actionArchiveRemove(store: TStore, command: ArchiveRemoveCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('ARCHIVE_REMOVE', {
        name: command.name
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'archive remove is failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      store.dispatch('loading', false)
      store.dispatch('auth', false)
      store.dispatch('token', null)
      store.dispatch('timeout', null)
      return Promise.reject(e)
    }
  }

  /**
   * Archiving
   * @param store Store
   * @param command { stamp: string}
   */
  @Commandable(ArchivingCommand)
  async actionArchiving(store: TStore, command: ArchivingCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('ARCHIVE', {
        key: command.stamp
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'archive project is failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Events
   * @param store Store
   */
  @Queryable(EventsQuery)
  async actionGetEvents(store: TStore) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get('EVENTS', jsonHeaders)
      if(!resp || !resp.data || !resp.data.data) {
        return Promise.reject(resp)
      }
      store.dispatch('eventsJson', resp.data.data)
      return resp.data.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Links
   * @param store Store
   */
  @Queryable(LinksQuery)
  async actionGetLinks(store: TStore) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get('LINKS', jsonHeaders)
      if(!resp || !resp.data || !resp.data.data) {
        return Promise.reject(resp)
      }
      store.dispatch('linksJson', resp.data.data)
      return resp.data.data
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Update Event
   * @param store Store
   * @param command { event: IEvent }
   */
  @Commandable(UpdateEventCommand)
  async actionUpdateEvent(store: TStore, command: UpdateEventCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('EVENT', {
        body: command.event
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'save event failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Event
   * @param store Store
   * @param command { date: string }
   */
  @Commandable(DeleteEventCommand)
  async actionRemoveEvent(store: TStore, command: DeleteEventCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('EVENT', {
        body: {
          remove: command.date
        }
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'delete event failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Update Library
   * @param store Store
   * @param command { value: string }
   */
  @Commandable(UpdateLibraryCommand)
  async actionUpdateLibrary(store: TStore, command: UpdateLibraryCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('SAVE', {
        body: command.value
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'save markdown failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Update Links
   * @param store Store
   * @param command { link: ILink }
   */
  @Commandable(UpdateLinksCommand)
  async actionUpdateLinks(store: TStore, command: UpdateLinksCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('LINK', {
        body: command.link
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'save link failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Links
   * @param store Store
   * @param command { key: string }
   */
  @Commandable(DeleteLinkCommand)
  async actionDeleteLink(store: TStore, command: DeleteLinkCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('LINK', {
        body: {
          remove: command.key
        }
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'delete link failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Get Todo
   * @param store Store
   */
  @Queryable(TodoQuery)
  async actionGetTodo(store: TStore) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.get('GET_TODO', jsonHeaders)
      if(!resp || !resp.data || !resp.data.data) {
        return Promise.reject(resp)
      }
      store.dispatch('todoJson', resp.data.data)
      return resp.data.data
    } catch(e) {
      console.log(e)
      store.dispatch('loading', false)
      store.dispatch('auth', false)
      store.dispatch('token', null)
      store.dispatch('timeout', null)
      return Promise.reject(e)
    }
  }

  /**
   * Update Todo
   * @param store Store
   * @param command { item: ITodo }
   */
  @Commandable(UpdateTodoCommand)
  async actionUpdateTodo(store: TStore, command: UpdateTodoCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('TODO', {
        body: command.item
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'todo item add failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Remove Todo
   * @param store Store
   * @param command { id: string }
   */
  @Commandable(DeleteTodoCommand)
  async actionRemoveTodo(store: TStore, command: DeleteTodoCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('TODO', {
        body: {
          remove: command.id
        }
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        ipcRenderer.send('open-error-dialog', 'todo item add failed')
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  /**
   * Todo Order
   * @param store Store
   * @param command { result: ITodoOrder}
   */
  @Commandable(TodoOrderCommand)
  async actionTodoOrder(store: TStore, command: TodoOrderCommand) {
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      const resp = await $http.post('TODO_SET_ORDER', {
        body: command.result
      }, jsonHeaders)
      if(!resp || resp.status !== 'success') {
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }

  async actionCheck(store: TStore) {
    let resp
    jsonHeaders.headers.Authorization = store.getters.getToken
    try {
      resp = await $http.get('CHECK', jsonHeaders)
      if(!resp) {
        return Promise.reject(resp)
      }
      return resp
    } catch(e) {
      return Promise.reject(e)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
