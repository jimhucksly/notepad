import FsmStates from '~/application/fsm.states'

const StateMachine = require('javascript-state-machine')

const toStr = (s: symbol): string => Symbol.keyFor(s)

const fsm = new StateMachine({
  observeUnchangedState: true,
  init: toStr(FsmStates.None),
  transitions: [
    { name: 'none', from: '*', to: toStr(FsmStates.None) },
    { name: 'preferences', from: '*', to: toStr(FsmStates.Preferences) },
    { name: 'projects', from: '*', to: toStr(FsmStates.Projects) },
    { name: 'projectsarchives', from: '*', to: toStr(FsmStates.ProjectsArchives) },
    { name: 'projectseditor', from: '*', to: toStr(FsmStates.ProjectsEditor) },
    { name: 'library', from: '*', to: toStr(FsmStates.Library) },
    { name: 'todo', from: '*', to: toStr(FsmStates.Todo) },
    { name: 'events', from: '*', to: toStr(FsmStates.Events) },
    { name: 'links', from: '*', to: toStr(FsmStates.Links) },
    { name: 'jsonviewer', from: '*', to: toStr(FsmStates.JsonViewer) },
    { name: 'addlinkpopup', from: toStr(FsmStates.Links), to: toStr(FsmStates.AddLinkPopup) },
    { name: 'about', from: '*', to: toStr(FsmStates.About) },
    { name: 'uploading', from: '*', to: toStr(FsmStates.Uploading) }
  ]
})

export default fsm
export {
  toStr
}
