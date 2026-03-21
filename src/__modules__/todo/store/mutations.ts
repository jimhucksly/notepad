import { MutationTree } from 'vuex';
import { strings } from '@dn-web/core';
import { stateKeys } from './state';
import { ITodoState } from '../models';

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
