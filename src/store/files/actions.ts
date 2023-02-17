import { ActionContext, ActionTree } from 'vuex'
import { IFile, IFilesState, IRootState } from '~/domain/models'
import { Queryable } from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
import { Hub } from '~/plugins/hub'
import $http from '../http'

type TStore = ActionContext<IFilesState, IRootState>

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true })
}

class Actions implements ActionTree<IFilesState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'files'

  /**
   * Get Files
   * @param store Store
   */
  @Queryable(TYPES.FilesQuery, Actions.namespace)
  async actionGetLinks(store: TStore): Promise<Array<IFile>> {
    try {
      setProcess(store, 'get files...')
      const { data } = await $http.get<Array<IFile>>('/files')
      store.commit('setFiles', data)
      return data
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Files list fetch failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
