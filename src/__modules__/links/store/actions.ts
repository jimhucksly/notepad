import { ActionContext, ActionTree } from 'vuex'
import { DeleteLinkCommand, UpdateLinksCommand } from '~/domain/commands'
import { Commandable } from '~/domain/commands/command.bus'
import { ILink, ILinksState, IRootState } from '~/domain/models'
import { Queryable } from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
import $http from '~/http'
import { Hub } from '~/plugins/hub'
import { LinksQuery } from '../queries/queries'

type TStore = ActionContext<ILinksState, IRootState>

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true })
}

class Actions implements ActionTree<ILinksState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'Links'

  /**
   * Get Links
   * @param store Store
   */
  @Queryable(Symbol.for(LinksQuery.constructor.name), Actions.namespace)
  async actionGetLinks(store: TStore): Promise<Array<ILink>> {
    try {
      setProcess(store, 'get links...')
      const { data } = await $http.get<Array<ILink>>('/links')
      store.commit('setLinks', data)
      return data
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Links list fetch failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Update Links
   * @param store Store
   * @param {UpdateLinksCommand} command
   */
  @Commandable(TYPES.UpdateLinksCommand, Actions.namespace)
  async actionUpdateLinks(store: TStore, command: UpdateLinksCommand): Promise<boolean> {
    try {
      setProcess(store, 'updating link...')
      await $http.put('/links', command.link)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Links list update failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Remove Link
   * @param store Store
   * @param {DeleteLinkCommand} command
   */
  @Commandable(TYPES.DeleteLinkCommand, Actions.namespace)
  async actionDeleteLink(store: TStore, command: DeleteLinkCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing link...')
      await $http.delete(`/links/?id=${command.id}`)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Links list item remove failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
