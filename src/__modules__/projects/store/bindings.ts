const bindings = {
  ProjectsQuery: Symbol.for('ProjectsQuery'),
  ArchivesQuery: Symbol.for('ArchivesQuery'),
  CreateProjectCommand: Symbol.for('CreateProjectCommand'),
  EditProjectCommand: Symbol.for('EditProjectCommand'),
  DeleteProjectCommand: Symbol.for('DeleteProjectCommand'),
  ReadCommand: Symbol.for('ReadCommand'),
  ArchiveRestoreCommand: Symbol.for('ArchiveRestoreCommand'),
  ArchiveRemoveCommand: Symbol.for('ArchiveRemoveCommand'),
  ArchivingCommand: Symbol.for('ArchivingCommand'),
};

export { bindings };
