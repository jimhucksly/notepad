import { Module } from 'vuex';
import { Types } from '~/core';
import { ILinksState } from '../models';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const namespaced = true;

const links: Module<ILinksState, Types.IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export default links;
