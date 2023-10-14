import { ActionContext, ActionTree } from 'vuex'
import { DeleteTodoCommand, TodoOrderCommand, UpdateTodoCommand } from '~/domain/commands'
import { Commandable } from '~/domain/commands/command.bus'
import { IRootState, ITodo, ITodoState } from '~/domain/models'
import { Queryable } from '~/domain/queries/query.bus'
import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
import $http from '~/http'
import { Hub } from '~/plugins/hub'

type TStore = ActionContext<ITodoState, IRootState>

function setProcess(store: TStore, process: string | null) {
  store.commit('setProcess', process ? { name: process } : null, { root: true })
}

class Actions implements ActionTree<ITodoState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'todo'

  /**
   * Get Todo
   * @param store Store
   */
  @Queryable(TYPES.TodoQuery, Actions.namespace)
  async actionGetTodo(store: TStore): Promise<Array<ITodo>> {
    try {
      setProcess(store, 'get todo list...')
      const { data } = await $http.get<Array<ITodo>>('/todo')
      store.commit('setTodo', data)
      return data
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list fetch failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Update Todo
   * @param store Store
   * @param {UpdateTodoCommand} command
   */
  @Commandable(TYPES.UpdateTodoCommand, Actions.namespace)
  async actionUpdateTodo(store: TStore, command: UpdateTodoCommand): Promise<boolean> {
    try {
      setProcess(store, 'update todo list...')
      await $http.put('/todo', command.item)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list item update failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Remove Todo
   * @param store Store
   * @param {DeleteTodoCommand} command
   */
  @Commandable(TYPES.DeleteTodoCommand, Actions.namespace)
  async actionRemoveTodo(store: TStore, command: DeleteTodoCommand): Promise<boolean> {
    try {
      setProcess(store, 'remove todo item...')
      await $http.delete(`/todo/?id=${command.id}`)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list item remove failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }

  /**
   * Todo Order
   * @param store Store
   * @param {TodoOrderCommand} command
   */
  @Commandable(TYPES.TodoOrderCommand, Actions.namespace)
  async actionTodoOrder(store: TStore, command: TodoOrderCommand): Promise<boolean> {
    try {
      setProcess(store, 'set todo order...')
      await $http.post('/todo/order', command.result)
      return Promise.resolve(true)
    } catch (e) {
      Hub.$emit('on-toasted-error', 'Error: Todo list sorting failed')
      return Promise.reject(e)
    } finally {
      setProcess(store, null)
    }
  }
}

const actions = toActionTree(new Actions())

export default actions
