import { Module } from 'vuex'
import { Types } from '~/core'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { IProjectsState } from '../models'

const namespaced = true

const projects: Module<IProjectsState, Types.IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

export default projects
