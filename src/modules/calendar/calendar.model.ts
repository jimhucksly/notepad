import { IEvent } from '~/domain/models'

export type TMode = 'd' | 'm' | 'y'

export interface IDay {
  date: string
  num: number
  isPrevMonth?: boolean
  isNextMonth?: boolean
  isDisabled?: boolean
  isHoliday?: boolean
  isToday?: boolean
}

export interface IOptions {
  month: string[]
  months: string[]
  monIndex: string[]
  daysCount: number[]
  daysShort: string[]
  weekDays: string[]
  range: boolean
  eventsMode: boolean
  items: IEvent | null
  mode: TMode
  setDate: string // 01.01.2020
  disableDaysBefore: Date | null
  disableDaysAfter: Date | null
  onlyDates: string[] // [31.10.2018, 01.11.2018, 02.11.2018, ...]
  labels: string[] // [15000, 16000]
  labelFormat: string // '... %DATA% ...'
}
