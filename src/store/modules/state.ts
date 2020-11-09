import { stateItems } from './index'
import { IRootState } from '~/domain/models'

const _state: any = {
  loading: true,
  isProjectsShow: true,
  component: 'Projects',
  userDataPath: '',
  downloadsTargetPath: '',
  library: '',
  mdTree: [],
  filter: {}
}

stateItems.forEach(key => {
  if(_state[key] === undefined) {
    _state[key] = null
  }
})

const state: IRootState = {
  ..._state
}

export default state
