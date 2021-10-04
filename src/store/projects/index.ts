import { Module } from 'vuex'
import { IProjectsState, IRootState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

export const projects: Module<IProjectsState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
