export interface IStates {
  None: symbol
  Preferences: symbol
  Projects: symbol
  ProjectsArchives: symbol
  Library: symbol
  Todo: symbol
  Events: symbol
  Links: symbol
  JsonViewer: symbol
}

const FsmStates: IStates = {
  None: Symbol.for('None'),
  Preferences: Symbol.for('Preferences'),
  Projects: Symbol.for('Projects'),
  ProjectsArchives: Symbol.for('ProjectsArchives'),
  Library: Symbol.for('Library'),
  Todo: Symbol.for('Todo'),
  Events: Symbol.for('Events'),
  Links: Symbol.for('Links'),
  JsonViewer: Symbol.for('JsonViewer')
}

export default FsmStates
