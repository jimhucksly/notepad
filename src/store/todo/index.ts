import { Module } from 'vuex'
import { IRootState, ITodoState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

export const todo: Module<ITodoState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
