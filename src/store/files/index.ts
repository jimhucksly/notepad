import { Module } from 'vuex'
import { IRootState, IFilesState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

export const files: Module<IFilesState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
