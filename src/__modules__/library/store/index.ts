import { Module } from 'vuex'
import { IRootState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { ILibraryState } from '../models'

const namespaced = true

const library: Module<ILibraryState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

export default library
