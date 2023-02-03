import FsmStates, { IFsmStates } from '~/application/fsm.states'

interface LifeCycle {
  transition: string
  from: string
  to: string
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  prevResult?: any
}

const StateMachine = require('javascript-state-machine')

const toStr = (s: symbol): keyof IFsmStates => Symbol.keyFor(s) as keyof IFsmStates

const fsm = new StateMachine({
  observeUnchangedState: true,
  init: toStr(FsmStates.Auth),
  transitions: [
    { name: 'auth', from: '*', to: toStr(FsmStates.Auth) },
    { name: 'reg', from: '*', to: toStr(FsmStates.Reg) },
    { name: 'reset', from: '*', to: toStr(FsmStates.Reset) },
    { name: 'account', from: '*', to: toStr(FsmStates.Account) },
    { name: 'preferences', from: '*', to: toStr(FsmStates.Preferences) },
    { name: 'projects', from: '*', to: toStr(FsmStates.Projects) },
    {
      name: 'projectsarchives',
      from: '*',
      to: toStr(FsmStates.ProjectsArchives)
    },
    {
      name: 'projectseditor',
      from: '*',
      to: toStr(FsmStates.ProjectsEditor)
    },
    { name: 'library', from: '*', to: toStr(FsmStates.Library) },
    {
      name: 'libraryfiles',
      from: '*',
      to: toStr(FsmStates.LibraryFiles)
    },
    { name: 'todo', from: '*', to: toStr(FsmStates.Todo) },
    { name: 'events', from: '*', to: toStr(FsmStates.Events) },
    { name: 'links', from: '*', to: toStr(FsmStates.Links) },
    { name: 'jsonviewer', from: '*', to: toStr(FsmStates.JsonViewer) },
    {
      name: 'addlinkpopup',
      from: toStr(FsmStates.Links),
      to: toStr(FsmStates.AddLinkPopup)
    },
    { name: 'about', from: '*', to: toStr(FsmStates.About) },
    { name: 'uploading', from: '*', to: toStr(FsmStates.Uploading) },
    { name: 'downloading', from: '*', to: toStr(FsmStates.Downloading) },
    {
      name: 'addlibraryfilepopup',
      from: '*',
      to: toStr(FsmStates.AddLibraryFilePopup)
    },
    { name: 'confirmpopup', from: '*', to: toStr(FsmStates.ConfirmPopup) }
  ],
  methods: {
    onBeforeTransition: onBeforeTransition.bind(this)
  }
})

function onBeforeTransition(lifecycle: LifeCycle) {
  // console.log('onBeforeTransition', lifecycle)
}

export default fsm
export {
  toStr
}
