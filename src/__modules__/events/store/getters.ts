import { GetterTree } from 'vuex';
import { Types } from '~/core';
import { upperFirst } from '~/helpers';
import { stateKeys } from './state';
import { IEventsState } from '../models';

const getters: GetterTree<IEventsState, Types.IRootState> = {};

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof IEventsState];
  }
});

export default getters;
