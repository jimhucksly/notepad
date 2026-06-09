import { createStore, ModuleTree } from 'vuex';
import { IRootState } from '~/domain/models';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';
import state from './state';

function buildStore(modules: ModuleTree<IRootState>) {
  return createStore<IRootState>({
    strict: process.env.NODE_ENV !== 'production',
    actions,
    getters,
    mutations,
    state,
    modules: {
      ...modules,
    },
  });
}

export { buildStore };
