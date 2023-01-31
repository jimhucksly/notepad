import { ActionContext, ActionTree } from 'vuex'
import { AddLibraryFileCommand, DeleteLibraryFileCommand, UpdateLibraryCommand } from '~/domain/commands'
import { Commandable } from '~/domain/commands/command.bus'
import { ILibraryFile, ILibraryState, IRootState } from '~/domain/models'
import { LibraryFileQuery } from '~/domain/queries'
import { Queryable } from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
import { Hub } from '~/plugins/hub'
import $http from '../http'

type TStore = ActionContext<ILibraryState, IRootState>

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true })
}

class Actions implements ActionTree<ILibraryState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'library'

  /**
   * Get Library Files
   * @param {Store} store
   */
  @Queryable(TYPES.LibraryFilesQuery, Actions.namespace)
  async actionGetLibraryFiles(store: TStore): Promise<Array<ILibraryFile>> {
    try {
      setProcess(store, 'get library files...')
      const resp = await $http.get<Array<ILibraryFile>>('/library/list')
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
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Library File
   * @param store Store
   * @param {LibraryFileQuery} query
   */
  @Queryable(TYPES.LibraryFileQuery, Actions.namespace)
  async actionFetchLibraryFile(store: TStore, query: LibraryFileQuery): Promise<string> {
    try {
      let url = '/library'
      if(query.id) {
        url = url + '?id=' + query.id
      }
      setProcess(store, 'get library file...')
      const resp = await $http.get<string>(url)
      if(!resp || resp.data === undefined) {
        return Promise.reject(resp)
      }
      store.commit('setLibraryData', resp.data)
      return Promise.resolve(resp.data)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file fetch failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Add Library File
   * @param store Store
   * @param {AddLibraryFileCommand} command
   */
  @Commandable(TYPES.AddLibraryFileCommand, Actions.namespace)
  async actionAddLibraryFile(
    store: TStore, command: AddLibraryFileCommand
  ): Promise<boolean> {
    try {
      setProcess(store, 'creating library file...')
      const resp = await $http.put<ILibraryFile, { id: string }>('/library', command.data)
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
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Update Library
   * @param store Store
   * @param {UpdateLibraryCommand} command
   */
  @Commandable(TYPES.UpdateLibraryCommand, Actions.namespace)
  async actionUpdateLibraryFile(store: TStore, command: UpdateLibraryCommand): Promise<boolean> {
    if(!command.id) {
      return void 0
    }
    try {
      setProcess(store, 'editing library file...')
      await $http.post('/library', command)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file edit failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Delete Library File
   * @param store Store
   * @param {DeleteLibraryFileCommand} command
   */
  @Commandable(TYPES.DeleteLibraryFileCommand, Actions.namespace)
  async actionDeleteLibraryFile(
    store: TStore, command: DeleteLibraryFileCommand
  ): Promise<boolean> {
    try {
      setProcess(store, 'removing library file...')
      await $http.delete(`/library/?name=${command.name}`)
      return Promise.resolve(true)
    } catch(e) {
      Hub.$emit('on-toasted-error', 'Error: Library file delete failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
