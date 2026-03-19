import { ActionContext, ActionTree } from 'vuex';
import { Commandable, Plugins, Queryable, Types } from '~/core';
import { toActionTree } from '~/helpers';
import $http from '~/http';
import { DeleteEventCommand, UpdateEventCommand } from '../commands/commands';
import { IEvent, IEvents, IEventsState } from '../models';
import { bindings } from './bindings';

type TStore = ActionContext<IEventsState, Types.IRootState>;

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true });
}

class Actions implements ActionTree<IEventsState, Types.IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any;

  static readonly namespace = 'Events';

  /**
   * Get Events
   * @param store Store
   */
  @Queryable(bindings.EventsQuery, Actions.namespace)
  async actionGetEvents(store: TStore): Promise<Array<IEvent>> {
    try {
      setProcess(store, 'get events...');
      const { data } = await $http.get<Array<IEvent>>('/events');
      store.commit('setEvents', data);
      return data;
    } catch (e) {
      Plugins.Hub.$emit('on-toasted-error', 'Error: Events list fetch failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Update Event
   * @param store Store
   * @param {UpdateEventCommand} command
   */
  @Commandable(bindings.UpdateEventCommand, Actions.namespace)
  async actionUpdateEvent(store: TStore, command: UpdateEventCommand): Promise<IEvent> {
    try {
      setProcess(store, 'update events...');
      const { data } = await $http.put<IEvent, IEvents>('/events', command.event);
      if (data[command.event.date]) {
        const buff = { ...store.getters.getEvents };
        buff[command.event.date] = data[command.event.date];
        store.commit('setEvents', buff);
        return data[command.event.date];
      }
      return null;
    } catch (e) {
      Plugins.Hub.$emit('on-toasted-error', 'Error: Event update failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Remove Event
   * @param store Store
   * @param {DeleteEventCommand} command
   */
  @Commandable(bindings.DeleteEventCommand, Actions.namespace)
  async actionRemoveEvent(store: TStore, command: DeleteEventCommand): Promise<boolean> {
    try {
      setProcess(store, 'removing event...');
      await $http.delete(`/events/?date=${command.date}`);
      const buff = { ...store.getters.getEvents };
      delete buff[command.date];
      store.commit('setEvents', buff);
      return true;
    } catch (e) {
      Plugins.Hub.$emit('on-toasted-error', 'Error: Event remove failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }
}

const actions = toActionTree(new Actions());

export default actions;
