import { strings } from '@dn-web/core';
import { MutationTree } from 'vuex';
import { IFilesState } from '../models';
import { stateKeys } from './state';

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
