import { Module } from 'vuex'
import { IRootState, ILinksState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

const links: Module<ILinksState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

export default links
