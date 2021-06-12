import States from '~/application/states'

const StateMachine = require('javascript-state-machine')

const toStr = (s: symbol): string => Symbol.keyFor(s)

const fsm = new StateMachine({
  observeUnchangedState: true,
  init: toStr(States.None),
  transitions: [
    { name: 'none', from: '*', to: toStr(States.None) },
    { name: 'auth', from: '*', to: toStr(States.Auth) },
    { name: 'preferences', from: '*', to: toStr(States.Preferences) },
    { name: 'projects', from: '*', to: toStr(States.Projects) }
  ]
})

export default fsm
export {
  StateMachine,
  toStr
}
