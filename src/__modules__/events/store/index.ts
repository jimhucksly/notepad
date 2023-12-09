import { Module } from 'vuex'
import { Types } from '~/core'
import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { IEventsState } from '../models'

const namespaced = true

const events: Module<IEventsState, Types.IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
}

export default events
