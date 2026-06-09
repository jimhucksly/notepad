import { Module } from 'vuex';
import { Types } from '~/core';
import { ITodoState } from '../models';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

const namespaced = true;

const todo: Module<ITodoState, Types.IRootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations,
};

export default todo;
