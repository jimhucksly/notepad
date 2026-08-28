import { eventBus } from '@dn-web/core';
import { ActionContext, ActionTree } from 'vuex';
import { Commandable, Queryable, Types } from '~/core';
import { toActionTree } from '~/helpers';
import $http from '~/http';
import { DeleteTodoCommand, TodoOrderCommand, UpdateTodoCommand } from '../commands/commands';
import { ITodo, ITodoState } from '../models';
import { bindings } from './bindings';

type TStore = ActionContext<ITodoState, Types.IRootState>;

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true });
}

class Actions implements ActionTree<ITodoState, Types.IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any;

  static readonly namespace = 'Todo';

  /**
   * Get
   * @param store Store
   */
  @Queryable(bindings.TodoQuery, Actions.namespace)
  async actionGetTodo(store: TStore): Promise<Array<ITodo>> {
    try {
      setProcess(store, 'get todo list...');
      const { data } = await $http.get<Array<ITodo>>('/todo');
      store.commit('setTodo', data);
      return data;
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Todo list fetch failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Update
   * @param store Store
   * @param {UpdateTodoCommand} command
   */
  @Commandable(bindings.UpdateTodoCommand, Actions.namespace)
  async actionUpdateTodo(store: TStore, command: UpdateTodoCommand): Promise<boolean> {
    try {
      setProcess(store, 'update todo list...');
      await $http.put('/todo', command.item);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Todo list item update failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Remove
   * @param store Store
   * @param {DeleteTodoCommand} command
   */
  @Commandable(bindings.DeleteTodoCommand, Actions.namespace)
  async actionRemoveTodo(store: TStore, command: DeleteTodoCommand): Promise<boolean> {
    try {
      setProcess(store, 'remove todo item...');
      await $http.delete(`/todo/?id=${command.id}`);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Todo list item remove failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }

  /**
   * Order
   * @param store Store
   * @param {TodoOrderCommand} command
   */
  @Commandable(bindings.TodoOrderCommand, Actions.namespace)
  async actionTodoOrder(store: TStore, command: TodoOrderCommand): Promise<boolean> {
    try {
      setProcess(store, 'set todo order...');
      await $http.post('/todo/order', command.result);
      return Promise.resolve(true);
    } catch (e) {
      eventBus.$emit('on-toasted-error', 'Error: Todo list sorting failed');
      return Promise.reject(e);
    } finally {
      setProcess(store, null);
    }
  }
}

const actions = toActionTree(new Actions());

export default actions;
