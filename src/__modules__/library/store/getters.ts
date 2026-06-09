import { strings } from '@dn-web/core';
import { GetterTree } from 'vuex';
import { Types } from '~/core';
import { ILibraryState } from '../models';
import { stateKeys } from './state';

const getters: GetterTree<ILibraryState, Types.IRootState> = {};

stateKeys.forEach(key => {
  const getterKey = 'get' + strings.upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof ILibraryState];
  }
});

export default getters;
