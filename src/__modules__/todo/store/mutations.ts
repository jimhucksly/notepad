import { strings } from '@dn-web/core';
import { MutationTree } from 'vuex';
import { ITodoState } from '../models';
import { stateKeys } from './state';

const _mutations: MutationTree<ITodoState> = {};

stateKeys.forEach(key => {
  const commitKey = 'set' + strings.upperFirst(key);
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof ITodoState] = payload;
    };
  }
});

const mutations: MutationTree<ITodoState> = {
  ..._mutations,
};

export default mutations;
