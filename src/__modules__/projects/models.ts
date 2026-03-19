export interface IProject {
  key: string;
  date: string;
  name: string;
  lock: boolean;
  message?: string;
  unread?: boolean;
}

export interface IProjects {
  [stamp: string]: IProject;
}

export interface IFilters {
  [stamp: string]: boolean;
}

export interface IArchive {
  id: string;
  name: string;
  date: string;
}

export interface IProjectsState {
  projects: IProjects;
  archives: IArchive[];
  filter: IFilters;
  selectedProjectKey: string;
}
