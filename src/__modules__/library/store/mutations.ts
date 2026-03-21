import { MutationTree } from 'vuex';
import { strings } from '@dn-web/core';
import { stateKeys } from './state';
import { ILibraryFile, ILibraryState } from '../models';

const _mutations: MutationTree<ILibraryState> = {
  setLibraryFiles(state: ILibraryState, files: Array<ILibraryFile>) {
    state.libraryFiles = [];
    state.libraryFiles = files;
  },
};

stateKeys.forEach(key => {
  const commitKey = 'set' + strings.upperFirst(key);
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      state[key as keyof ILibraryState] = payload;
    };
  }
});

const mutations: MutationTree<ILibraryState> = {
  ..._mutations,
};

export default mutations;
