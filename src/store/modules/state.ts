import stateKeys from './stateKeys'
import { IRootState } from '~/domain/models'

enum CurrentPage {
  Projects = 'Projects',
  Library = 'Library',
  Todo = 'Todo',
  Events = 'Events',
  Links = 'Links',
  JsonViewer = 'JsonViewer'
}

let currentPage = ''

currentPage = CurrentPage.Projects as string

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const _state: any = {
  loading: true,
  isProjectsShow: currentPage === CurrentPage.Projects,
  isLibraryShow: currentPage === CurrentPage.Library,
  isTodoShow: currentPage === CurrentPage.Todo,
  isEventsShow: currentPage === CurrentPage.Events,
  isLinksShow: currentPage === CurrentPage.Links,
  isJsonViewerShow: currentPage === CurrentPage.JsonViewer,
  component: currentPage,
  userDataPath: '',
  downloadsTargetPath: '',
  library: '',
  libraryTree: [],
  filter: {}
}

stateKeys.forEach(key => {
  if(_state[key] === undefined) {
    _state[key] = null
  }
})

const state: IRootState = {
  ..._state
}

export default state
