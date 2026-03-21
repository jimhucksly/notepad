import { MutationTree } from 'vuex';
import { strings } from '@dn-web/core';
import { stateKeys } from './state';
import { ILinksState } from '../models';

const _mutations: MutationTree<ILinksState> = {};

stateKeys.forEach(key => {
  const commitKey = 'set' + strings.upperFirst(key);
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof ILinksState] = payload;
    };
  }
});

const mutations: MutationTree<ILinksState> = {
  ..._mutations,
};

export default mutations;
