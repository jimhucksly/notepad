import { ActionContext, ActionTree } from 'vuex'
import { DeleteEventCommand, UpdateEventCommand } from '~/domain/commands'
import { Commandable } from '~/domain/commands/command.bus'
import { IEvent, IEventsState, IRootState } from '~/domain/models'
import { Queryable } from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
import { Hub } from '~/plugins/hub'
import $http from '../http'

type TStore = ActionContext<IEventsState, IRootState>

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true })
}

class Actions implements ActionTree<IEventsState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'events'

  /**
   * Get Events
   * @param store Store
   */
  @Queryable(TYPES.EventsQuery, Actions.namespace)
  async actionGetEvents(store: TStore): Promise<Array<IEvent>> {
    try {
      setProcess(store, 'get events...')
      const { data } = await $http.get<Array<IEvent>>('/events')
      store.commit('setEvents', data)
      return data
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Events list fetch failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Update Event
   * @param store Store
  * @param {UpdateEventCommand} command
   */
  @Commandable(TYPES.UpdateEventCommand, Actions.namespace)
  async actionUpdateEvent(store: TStore, command: UpdateEventCommand): Promise<boolean> {
    try {
      setProcess(store, 'update events...')
      await $http.put('/events', command.event)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Event update failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Remove Event
   * @param store Store
   * @param {DeleteEventCommand} command
   */
  @Commandable(TYPES.DeleteEventCommand, Actions.namespace)
  async actionRemoveEvent(store: TStore, command: DeleteEventCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing event...')
      await $http.delete(`/events/?date=${command.date}`)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Event remove failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
