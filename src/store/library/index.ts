import { Module } from 'vuex'
import { ILibraryState, IRootState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

export const library: Module<ILibraryState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
