import { ActionContext, ActionTree } from 'vuex'
import { IFilesState, IRootState } from '~/domain/models'
// import { TYPES } from '~/domain/types'
import { toActionTree } from '~/helpers'
// import $http from '../http'

type TStore = ActionContext<IFilesState, IRootState>

// function setProcess(store: TStore, process: string | null) {
//   store.commit('setProcess', process ? { name: process } : null, { root: true })
// }

class Actions implements ActionTree<IFilesState, IRootState> {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (injectee: TStore, payload: any) => any

  static readonly namespace = 'files'
}

const actions = toActionTree(new Actions())

export default actions
