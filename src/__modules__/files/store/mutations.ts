import { MutationTree } from 'vuex';
import { strings } from '@dn-web/core';
import { stateKeys } from './state';
import { IFilesState } from '../models';

const _mutations: MutationTree<IFilesState> = {};

stateKeys.forEach(key => {
  const commitKey = 'set' + strings.upperFirst(key);
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof IFilesState] = payload;
    };
  }
});

const mutations: MutationTree<IFilesState> = {
  ..._mutations,
};

export default mutations;
