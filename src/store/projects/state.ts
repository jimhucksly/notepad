import { IProjectsState } from '~/domain/models'

export const stateKeys: string[] = [
  'projects',
  'archives',
  'filter',
  'selectedProjectKey'
]

const state: IProjectsState = {
  projects: null,
  archives: [],
  filter: {},
  selectedProjectKey: ''
}

export default state
