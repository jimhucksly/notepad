import stateKeys from './stateKeys'
import { upperFirst } from '~/helpers'
import { IMenu, IRootState } from '~/domain/models'
import FsmStates from '~/application/fsm.states'

const menu: Array<IMenu> = [
  {
    name: 'projects',
    nameAlt: 'Projects',
    fsmState: FsmStates.Projects,
    id: 1
  },
  {
    name: 'library',
    nameAlt: 'Library',
    fsmState: FsmStates.Library,
    id: 2
  },
  {
    name: 'todo',
    nameAlt: 'Todo',
    fsmState: FsmStates.Todo,
    id: 3
  },
  {
    name: 'events',
    nameAlt: 'Events',
    fsmState: FsmStates.Events,
    id: 4
  },
  {
    name: 'links',
    nameAlt: 'Links',
    fsmState: FsmStates.Links,
    id: 5
  },
  {
    name: 'jsonViewer',
    nameAlt: 'Json Viewer',
    fsmState: FsmStates.JsonViewer,
    id: 6
  }
]

interface IGetters {
  [key: string]: (state: IRootState) => unknown
}

const getters: IGetters = {
  getMenu() {
    return menu
  }
}

stateKeys.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if(getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key]
    }
  }
})

export default getters
