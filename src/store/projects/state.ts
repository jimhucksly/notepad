import { IProjectsState } from '~/domain/models'

export const stateKeys: string[] = [
  'json',
  'archives',
  'filter',
  'selectedProjectKey'
]

const state: IProjectsState = {
  json: null,
  archives: [],
  filter: {},
  selectedProjectKey: ''
}

export default state
