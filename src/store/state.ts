import { IRootState } from '~/domain/models'

export const stateKeys: string[] = [
  'endpoint',
  'loading',
  'isAuth',
  'token',
  'userDataPath',
  'isDevelopment',
  'fsmState',
  'timeout',
  'downloadsTargetPath',
  'notification',
  'error',
  'component',
  'history',
  'currentUser',
  'process'
]

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const _state: any = {
  loading: true,
  userDataPath: '',
  downloadsTargetPath: '',
  history: []
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
