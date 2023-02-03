import { Prop, Watch } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import CalendarInstance from './instance'
import { IEvent } from '~/domain/models'
import { IOptions } from './calendar.model'
import './calendar.scss'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getFullYear())
}

/**
 * @param {string} d 15.01.2001
 * @return {Date}
 */
export function getNativeDate(d: string): Date | null {
  if (/^(\d+).(\d+).(\d+)$/.test(d)) {
    return new Date(d.replace(/^(\d+)\.(\d+)\.(\d+)$/, '$2/$1/$3'))
  }
  try {
    const date = new Date(d)
    return date
  } catch (e) {
    /* eslint-disable no-console */
    console.error(e)
  }
  return null
}

export const defaults: IOptions = {
  month: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'Devember'
  ],
  months: [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря'
  ],
  monIndex: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
  daysCount: [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  daysShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
  weekDays: [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ],

  /* options */

  range: false,
  eventsMode: false,
  items: null,
  mode: 'd',
  setDate: '', // 01.01.2001
  disableDaysBefore: null, // new Date(),
  disableDaysAfter: null, // new Date()
  onlyDates: [], // [31.10.2018, 01.11.2018, 02.11.2018, ...]
  labels: [], // [15000, 16000]
  labelFormat: '' // '... %DATA% ...'
}

export interface IBCalendar extends Vue {
  prevMonth: () => void
  nextMonth: () => void
  setToday: () => void
}

@Options({
  components: {
    CalendarInstance
  }
})
export default class BCalendarComponent extends Vue {
  @Prop() options: IOptions

  op: IOptions = { ...defaults }
  range: string[] = []
  active = ''
  formShow = false
  event: IEvent = {
    date: '',
    title: '',
    content: ''
  }

  created() {
    this.op = { ...defaults, ...this.options }
  }

  getOptions(index: number) {
    return {
      ...this.op,
      setDate: index === 0 ? this.date1 : this.date2
    }
  }

  get baseDate(): Date {
    return new Date()
  }

  get date1(): Date {
    if (this.op.setDate) {
      const date = getNativeDate(this.op.setDate)
      if (date && isDate(date)) {
        return date
      }
    }
    return new Date()
  }

  get date2(): Date {
    const date = new Date(this.date1.getTime())
    date.setDate(1)
    return new Date(date.setMonth(date.getMonth() + 1))
  }

  @Watch('options') onOptionsChanged(o: IOptions) {
    this.op = { ...defaults, ...o }
  }

  private emit() {
    const r1 = getNativeDate(this.range[0])
    const r2 = getNativeDate(this.range[1])
    if (r1 && r2) {
      this.$emit('range-selected', [
        r1.toString(),
        r2.toString()
      ])
    }
  }

  apply() {
    if (this.range.length === 2) {
      this.emit()
    }
  }

  reset() {
    this.range = []
  }

  daySelected(date: string) {
    if (this.op.range) {
      if (!this.range.length) {
        this.range.push(date)
        return
      }
      if (this.range.length === 1) {
        const date1 = getNativeDate(this.range[0])
        let r1: number
        if (date1) {
          r1 = date1.getTime()
        }
        const date2 = getNativeDate(date)
        let d: number
        if (date2) {
          d = date2.getTime()
        }
        if (d && r1) {
          if (d < r1) this.range.unshift(date)
          else this.range.push(date)
        }
        return
      }
      if (this.range.length === 2) {
        const date1 = getNativeDate(this.range[0])
        let r1: number
        if (date1) {
          r1 = date1.getTime()
        }
        const date2 = getNativeDate(this.range[1])
        let r2: number
        if (date2) {
          r2 = date2.getTime()
        }
        const date3 = getNativeDate(date)
        let d: number
        if (date3) {
          d = date3.getTime()
        }
        if (d && r1 && r2) {
          if (d < r1) {
            this.range = this.range.slice(1)
            this.range.unshift(date)
            return
          }
          if (d > r2) {
            this.range = this.range.slice(0, 1)
            this.range.push(date)
            return
          }
          if (d === r1 || d === r2 || (d > r1 && d < r2)) {
            this.range = []
            this.range.push(date)
          }
        }
        return
      }
    } else if (this.op.eventsMode) {
      this.formShow = true
      this.event.date = date
      this.$emit('form-toggle', this.formShow)
      if (this.op.items && this.op.items[date]) {
        this.event.title = this.op.items[date].title
        this.event.content = this.op.items[date].content
      }
    } else {
      this.$emit('day-selected', getNativeDate(date))
    }
  }

  prevMonth() {
    const date = getNativeDate(this.date1.toString())
    if (date) {
      this.op.setDate = new Date(date.setMonth(date.getMonth() - 1)).toString()
    }
  }

  nextMonth() {
    const date = getNativeDate(this.date1.toString())
    if (date) {
      date.setDate(1)
      this.op.setDate = new Date(date.setMonth(date.getMonth() + 1)).toString()
    }
  }

  nextRangeMonth() {
    const date = getNativeDate(this.date1.toString())
    if (date) {
      date.setDate(1)
      this.op.setDate = new Date(date.setMonth(date.getMonth() + 1)).toString()
    }
  }

  prevRangeMonth() {
    const date = getNativeDate(this.date1.toString())
    if (date) {
      this.op.setDate = new Date(date.setMonth(date.getMonth() - 1)).toString()
    }
  }

  setActiveDate(date: string) {
    if (this.op.range && this.range.length === 1) {
      const d = getNativeDate(date)
      if (d) {
        this.active = d.toString()
        return
      }
    }
    this.active = ''
  }

  setMonth(instanceId: number, index: number) {
    if (instanceId === 1) {
      const date: Date = getNativeDate(this.date1.toString())
      if (date) {
        this.op.setDate = new Date(date.setMonth(index)).toString()
      }
    }
    if (instanceId === 2) {
      const date: Date = getNativeDate(this.date1.toString())
      if (date) {
        if (index === 0) {
          date.setFullYear(date.getFullYear() - 1)
          date.setMonth(11)
          this.op.setDate = new Date(date).toString()
        } else this.op.setDate = new Date(date.setMonth(index)).toString()
      }
    }
  }

  setYear(year: number) {
    const date: Date = getNativeDate(this.date1.toString())
    if (date) {
      this.op.setDate = new Date(date.setFullYear(year)).toString()
    }
  }

  setToday() {
    const date = getNativeDate(this.baseDate.toString())
    if (date) {
      this.op.setDate = new Date(date).toString()
    }
  }

  formClear() {
    this.event = { date: '', title: '', content: '' }
    this.formShow = false
    this.$emit('form-toggle', this.formShow)
  }

  formSave() {
    if (this.event.title && this.event.content) {
      this.$emit('save', this.event)
      this.formClear()
    }
  }

  formRemove() {
    this.$emit('remove', this.event.date)
    this.formClear()
  }
}

