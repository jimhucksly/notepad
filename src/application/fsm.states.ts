export interface IFsmStates {
  Auth: symbol
  Reg: symbol
  Reset: symbol
  Verify: symbol
  Yandex: symbol
  Account: symbol
  Preferences: symbol
  Projects: symbol
  ProjectsArchives: symbol
  ProjectsEditor: symbol
  Library: symbol
  LibraryFiles: symbol
  Todo: symbol
  Events: symbol
  Links: symbol
  Files: symbol
  JsonViewer: symbol
  AddLinkPopup: symbol
  About: symbol
  AddLibraryFilePopup: symbol
  ConfirmPopup: symbol
}

const FsmStates: IFsmStates = {
  Auth: Symbol.for('Auth'),
  Reg: Symbol.for('Reg'),
  Reset: Symbol.for('Reset'),
  Verify: Symbol.for('Verify'),
  Yandex: Symbol.for('Yandex'),
  Account: Symbol.for('Account'),
  Preferences: Symbol.for('Preferences'),
  Projects: Symbol.for('Projects'),
  ProjectsArchives: Symbol.for('ProjectsArchives'),
  ProjectsEditor: Symbol.for('ProjectsEditor'),
  Library: Symbol.for('Library'),
  LibraryFiles: Symbol.for('LibraryFiles'),
  Todo: Symbol.for('Todo'),
  Events: Symbol.for('Events'),
  Links: Symbol.for('Links'),
  Files: Symbol.for('Files'),
  JsonViewer: Symbol.for('JsonViewer'),
  AddLinkPopup: Symbol.for('AddLinkPopup'),
  About: Symbol.for('About'),
  AddLibraryFilePopup: Symbol.for('AddLibraryFilePopup'),
  ConfirmPopup: Symbol.for('ConfirmPopup')
}

export default FsmStates
