import { IEventsState } from '~/domain/models'

export const stateKeys: string[] = [
  'events'
]

const state: IEventsState = {
  events: null
}

export default state
