import { Types } from '~/core';
import { stateKeys } from './state';
import { strings } from '@dn-web/core';
import { GetterTree } from 'vuex';
import { IProjectsState } from '../models';

const getters: GetterTree<IProjectsState, Types.IRootState> = {};

stateKeys.forEach(key => {
  const getterKey = 'get' + strings.upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof IProjectsState];
  }
});

export default getters;
