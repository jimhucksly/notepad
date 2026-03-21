import { GetterTree } from 'vuex';
import { Types } from '~/core';
import { strings } from '@dn-web/core';
import { stateKeys } from './state';
import { IFilesState } from '../models';

const getters: GetterTree<IFilesState, Types.IRootState> = {};

stateKeys.forEach(key => {
  const getterKey = 'get' + strings.upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof IFilesState];
  }
});

export default getters;
