export interface IFsmStates {
  None: symbol
  Preferences: symbol
  Projects: symbol
  ProjectsArchives: symbol
  ProjectsEditor: symbol
  Library: symbol
  Todo: symbol
  Events: symbol
  Links: symbol
  JsonViewer: symbol
  AddLinkPopup: symbol
  About: symbol
  Uploading: symbol
  AddLibraryFilePopup: symbol
}

const FsmStates: IFsmStates = {
  None: Symbol.for('None'),
  Preferences: Symbol.for('Preferences'),
  Projects: Symbol.for('Projects'),
  ProjectsArchives: Symbol.for('ProjectsArchives'),
  ProjectsEditor: Symbol.for('ProjectsEditor'),
  Library: Symbol.for('Library'),
  Todo: Symbol.for('Todo'),
  Events: Symbol.for('Events'),
  Links: Symbol.for('Links'),
  JsonViewer: Symbol.for('JsonViewer'),
  AddLinkPopup: Symbol.for('AddLinkPopup'),
  About: Symbol.for('About'),
  Uploading: Symbol.for('Uploading'),
  AddLibraryFilePopup: Symbol.for('AddLibraryFilePopup')
}

export default FsmStates
