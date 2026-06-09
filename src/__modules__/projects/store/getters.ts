import { strings } from '@dn-web/core';
import { GetterTree } from 'vuex';
import { Types } from '~/core';
import { IProjectsState } from '../models';
import { stateKeys } from './state';

const getters: GetterTree<IProjectsState, Types.IRootState> = {};

stateKeys.forEach(key => {
  const getterKey = 'get' + strings.upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof IProjectsState];
  }
});

export default getters;
