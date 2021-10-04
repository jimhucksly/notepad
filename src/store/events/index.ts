import { Module } from 'vuex'
import { IRootState, IEventsState } from '~/domain/models'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const namespaced = true

export const events: Module<IEventsState, IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}
