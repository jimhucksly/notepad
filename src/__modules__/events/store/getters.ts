import { strings } from '@dn-web/core';
import { GetterTree } from 'vuex';
import { Types } from '~/core';
import { IEventsState } from '../models';
import { stateKeys } from './state';

const getters: GetterTree<IEventsState, Types.IRootState> = {};

stateKeys.forEach(key => {
  const getterKey = 'get' + strings.upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof IEventsState];
  }
});

export default getters;
