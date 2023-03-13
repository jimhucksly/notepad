import { IRootState } from '~/domain/models'
import { AppComponents } from '~/application/app'

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
  'section',
  'history',
  'currentUser',
  'process',
  'session'
]

const section = {}
Object.keys(AppComponents).forEach(key => {
  section[AppComponents[key]] = false
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const _state: any = {
  loading: true,
  userDataPath: '',
  downloadsTargetPath: '',
  history: [],
  section
}

stateKeys.forEach(key => {
  if (_state[key] === undefined) {
    _state[key] = null
  }
})

const state: IRootState = {
  ..._state
}

export default state
