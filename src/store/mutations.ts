import { strings } from '@dn-web/core';
import { FsmStates } from '~/application/app';
import { IRootState } from '~/domain/models';
import { stateKeys } from './state';

interface IMutations {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (state: IRootState, data: any) => void;
}

const _mutations: IMutations = {
  setHistory(state: IRootState, history: Array<keyof typeof FsmStates>) {
    state.history = [];
    state.history = history;
  },
};

stateKeys.forEach(key => {
  const commitKey = 'set' + strings.upperFirst(key);
  if (_mutations[commitKey] === undefined) {
    _mutations[commitKey] = (state, payload) => {
      (state as unknown as Record<string, unknown>)[key] = payload;
    };
  }
});

const mutations: IMutations = {
  ..._mutations,
};

export default mutations;
