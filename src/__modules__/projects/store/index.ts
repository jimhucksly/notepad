import { Module } from 'vuex'
import { IRootState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { IProjectsState } from '../models'

const namespaced = true

const projects: Module<IProjectsState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

export default projects
