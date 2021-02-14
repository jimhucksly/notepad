import { stateItems } from './index'
import { upperFirst } from '~/helpers'
import { IMenu, IRootState } from '~/domain/models'

const menu: IMenu[] = [
  {
    name: 'projects',
    nameAlt: 'Projects',
    id: 1
  },
  {
    name: 'library',
    nameAlt: 'Library',
    id: 2
  },
  {
    name: 'todo',
    nameAlt: 'Todo',
    id: 3
  },
  {
    name: 'events',
    nameAlt: 'Events',
    id: 4
  },
  {
    name: 'links',
    nameAlt: 'Links',
    id: 5
  },
  {
    name: 'jsonViewer',
    nameAlt: 'Json Viewer',
    id: 6
  }
]

const pages = [
  'preferences',
  ...menu.map(m => m.name)
]

interface IGetters {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string]: (state: IRootState) => any
}

const getters: IGetters = {
  getPages(): string[] {
    return pages
  },
  getMenu() {
    return menu
  }
}

stateItems.forEach(key => {
  const getterKey = 'get' + upperFirst(key)
  if(getters[getterKey] === undefined) {
    getters[getterKey] = state => {
      return state[key]
    }
  }
})

export default getters
