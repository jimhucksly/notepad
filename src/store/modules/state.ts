import stateKeys from './stateKeys'
import { IRootState } from '~/domain/models'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
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

stateKeys.forEach(key => {
  if(_state[key] === undefined) {
    _state[key] = null
  }
})

const state: IRootState = {
  ..._state
}

export default state
