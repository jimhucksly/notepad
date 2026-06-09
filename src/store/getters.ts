import { strings } from '@dn-web/core';
import { IRootState } from '~/domain/models';
import { stateKeys } from './state';

interface IGetters {
  [key: string]: (state: IRootState) => unknown;
}

const getters: IGetters = {
  getYandexToken(state: IRootState) {
    return state.currentUser?.yandexDiskAccessToken;
  },
  getSection(state: IRootState) {
    return {
      ...state.section,
      [state.component]: true,
    };
  },
};

stateKeys.forEach(key => {
  const getterKey = 'get' + strings.upperFirst(key);
  if (getters[getterKey] === undefined) {
    getters[getterKey] = state => state[key as keyof IRootState];
  }
});

export default getters;
