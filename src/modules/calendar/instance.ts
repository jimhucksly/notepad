import { CreateElement } from 'vue'
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { VNode } from 'vue/types/vnode'
import { IDay, IOptions } from './calendar.model'
import {
  defaults,
  isDate,
  getNativeDate
} from './index'

interface IWeek {
  days: IDay[]
}

@Component
class CalendarComponent extends Vue {
  @Prop() index: number
  @Prop() range: string[]
  @Prop() active: string
  @Prop() options: IOptions

  weeks: IWeek[]
  op: IOptions = { ...defaults }
  header: string

  get baseDate() {
    return new Date()
  }

  get currentDate() {
    if(this.op.setDate && isDate(this.op.setDate)) {
      if(getNativeDate(this.op.setDate) instanceof Date) {
        return new Date(getNativeDate(this.op.setDate))
      }
    }
    return new Date()
  }

  get baseDay() {
    return this.baseDate.getDate()
  }

  get baseMonth() {
    return this.baseDate.getMonth()
  }

  get baseYear() {
    return this.baseDate.getFullYear()
  }

  @Watch('options') onOptionsSetDateChanged() {
    this.op = { ...this.options }
  }

  @Watch('op') onOpSetDateChanged() {
    if(this.op.mode === 'd') {
      this.renderCalendar(this.currentDate)
    } else this.fillHeader()
  }

  private checkDisabled(date: string): boolean {
    let result = false
    const d = getNativeDate(date)
    if(d) {
      if(this.op.disableDaysBefore instanceof Date) {
        result = this.op.disableDaysBefore.getTime() > d.getTime()
      }
      if(this.op.disableDaysAfter instanceof Date) {
        result = this.op.disableDaysAfter.getTime() < d.getTime()
      }
    }

    if(this.op.onlyDates && this.op.onlyDates.length) {
      result = !this.op.onlyDates.includes(date)
    }
    return result
  }

  private fillHeader() {
    const currMon = this.currentDate.getMonth()
    const currYear = this.currentDate.getFullYear()
    this.header = this.op.month[currMon] + ' ' + currYear

    if(this.op.eventsMode) {
      this.$emit('set-header', this.header)
    }
  }

  private renderFirstWeek(e: Date): number {
    const currMon = e.getMonth()
    const currYear = e.getFullYear()
    const loastDayOfPrevMon = this.op.daysCount[currMon === 0 ? 11 : currMon - 1]
    const g = new Date()

    g.setDate(1)
    g.setMonth(currMon)
    g.setFullYear(currYear)

    const weekday = g.getDay() === 0 ? 6 : g.getDay() - 1

    const week: IWeek = {
      days: []
    }

    for(let i = 0; i < weekday; i++) {
      const num = loastDayOfPrevMon - weekday + i + 1
      const mon = currMon === 0 ? '12' : this.op.monIndex[currMon - 1]
      const year = currMon === 0 ? currYear - 1 : currYear
      const date = `${num}.${mon}.${year}`

      const isDisabled = this.checkDisabled(date)
      const isHoliday = i >= 5

      week.days.push({
        date,
        num,
        isPrevMonth: true,
        isDisabled,
        isHoliday
      })
    }

    let k = 0
    let result = 0
    for(let i = weekday; i <= 6; i++) {
      const num = ++k
      const date = '0' + k + '.' + this.op.monIndex[currMon] + '.' + currYear

      const isDisabled = this.checkDisabled(date)
      const isHoliday = i >= 5
      const isToday = num === +this.baseDay && +currMon === +this.baseMonth && +currYear === +this.baseYear

      if(i === 6) result = num

      week.days.push({
        date,
        num,
        isDisabled,
        isHoliday,
        isToday
      })
    }

    this.weeks.push(week)
    return result
  }

  private renderCalendar(e: Date): Date {
    this.weeks = []
    const currMon = e.getMonth()
    const currYear = e.getFullYear()
    const g = new Date()

    g.setDate(e.getDate())
    g.setMonth(currMon)
    g.setFullYear(currYear)

    this.op.daysCount[1] = e.getFullYear() % 4 === 0 ? 29 : 28

    this.fillHeader()

    let num = this.renderFirstWeek(g) + 1
    let number: number
    let date: string
    let n: number
    const count = +this.op.daysCount[currMon]
    const weeksCount = 5
    const mon = this.op.monIndex[currMon]
    const nextMon = +mon === 12 ? '01' : this.op.monIndex[currMon + 1]
    const yearOfNextMon = +mon === 12 ? currYear + 1 : currYear

    this.op.mode = 'd'

    for(let j = 1; j <= weeksCount; j++) {
      const week: IWeek = {
        days: []
      }
      for(let i = 0; i <= 6; i++) {
        let isNextMonth = false
        if(num <= count) {
          number = num
          date = ('0' + num).slice(-2) + '.' + mon + '.' + currYear
        } else {
          n = num - count
          number = n
          date = ('0' + n).slice(-2) + '.' + nextMon + '.' + yearOfNextMon
          isNextMonth = true
        }

        const isHoliday = i >= 5
        const isDisabled = this.checkDisabled(date)
        const isToday = +number === +this.baseDay && +currMon === +this.baseMonth && +currYear === +this.baseYear && !isNextMonth

        week.days.push({
          date,
          num: number,
          isNextMonth,
          isDisabled,
          isHoliday,
          isToday
        })
        num++
      }
      this.weeks.push(week)
    }
    return g
  }

  public nextMonth() {
    const date = new Date(this.currentDate)
    date.setDate(1)
    date.setMonth(date.getMonth() + 1)
    this.gotoDate(date)
  }

  public prevMonth() {
    const date = new Date(this.currentDate)
    date.setDate(1)
    date.setMonth(date.getMonth() - 1)
    this.gotoDate(date)
  }

  public gotoDate(date: Date) {
    this.dateChange(date)
  }

  public dateChange(date: Date) {
    this.op.setDate = new Date(date).toString()
    this.renderCalendar(this.currentDate)
  }

  public btnPrevHandler(e: MouseEvent) {
    e.preventDefault()
    const date = new Date(this.currentDate)
    switch(this.op.mode) {
      case 'd':
        if(this.op.range) {
          this.$emit('prev-month')
        } else this.prevMonth()
        break
      case 'm':
        if(this.op.range) {
          return
        } else {
          date.setFullYear(date.getFullYear() - 1)
          this.op.setDate = date.toString()
          this.fillHeader()
        }
        break
      case 'y':
        if(this.op.range) {
          return
        } else {
          date.setFullYear(date.getFullYear() - 4)
          this.op.setDate = date.toString()
        }
    }
  }

  public btnNextHandler(e: MouseEvent) {
    e.preventDefault()
    const date = new Date(this.currentDate)
    switch(this.op.mode) {
      case 'd':
        if(this.op.range) {
          this.$emit('next-month')
        } else this.nextMonth()
        break
      case 'm':
        if(this.op.range) {
          return
        } else {
          date.setFullYear(date.getFullYear() + 1)
          this.op.setDate = date.toString()
          this.fillHeader()
        }
        break
      case 'y':
        if(this.op.range) {
          return
        } else {
          date.setFullYear(date.getFullYear() + 8)
          this.op.setDate = date.toString()
        }
    }
  }

  public btnTodayHandler(e: MouseEvent) {
    e.preventDefault()
    this.$emit('set-today')
  }

  public btnMonthHandler(e: MouseEvent) {
    e.preventDefault()
    if(this.op.mode !== 'm') {
      this.op.mode = 'm'
    }
  }

  public btnYearHandler(e: MouseEvent) {
    e.preventDefault()
    if(this.op.mode !== 'y') {
      this.op.mode = 'y'
    }
  }

  public daySelection(date: string) {
    this.$emit('day-selected', date)
  }

  public monthSelection(index: number) {
    this.$emit('set-month', index)
  }

  public yearSelection(year: number) {
    this.$emit('set-year', year)
  }

  public inRange(date: string): boolean {
    if(this.op.range && this.range.length === 2) {
      const date1 = getNativeDate(this.range[0])
      let r1: number
      if(date1) {
        r1 = date1.getTime()
      }
      const date2 = getNativeDate(this.range[1])
      let r2: number
      if(date2) {
        r2 = date2.getTime()
      }
      const date3 = getNativeDate(date)
      let d: number
      if(date3) {
        d = date3.getTime()
      }
      return d > r1 && d < r2
    }
    return false
  }

  public inRangeHover(date: string): boolean {
    const date1 = getNativeDate(this.range[0])
    let r1: number
    if(date1) {
      r1 = date1.getTime()
    }
    const date2 = getNativeDate(date)
    let d: number
    if(date2) {
      d = date2.getTime()
    }
    const date3 = getNativeDate(this.active)
    let a: number
    if(date3) {
      a = date3.getTime()
    }
    if(a > r1) {
      return d < a && d > r1
    }
    if(a < r1) {
      return d > a && d < r1
    }
    return false
  }

  created() {
    this.op = { ...this.options }
    Object.keys(this.options).forEach(key => {
      this.$set(this.op, key, this.options[key])
    })

    if(this.op.disableDaysBefore && this.op.disableDaysAfter) {
      this.op.disableDaysBefore = null
    }

    if(this.op.mode === 'd') {
      this.renderCalendar(this.currentDate)
    } else {
      this.fillHeader()
    }
  }

  render(h: CreateElement): VNode {
    const back: VNode = h(
      'button',
      {
        staticClass: 'b-calendar__back',
        on: {
          click: (e: MouseEvent) => {
            this.btnPrevHandler(e)
          }
        }
      },
      []
    )

    const header: VNode = h(
      'div',
      {
        staticClass: 'b-calendar__header'
      },
      this.header
    )

    const forward: VNode = h(
      'button',
      {
        staticClass: 'b-calendar__forward',
        on: {
          click: (e: MouseEvent) => this.btnNextHandler(e)
        }
      },
      []
    )

    const nav: VNode = h(
      'div',
      {
        staticClass: 'b-calendar__nav'
      },
      [back, header, forward]
    )

    const head: VNode = h(
      'div',
      {
        staticClass: 'b-calendar__head'
      },
      [
        [0, 1, 2, 3, 4, 5, 6].map((el, i) => {
          return h(
            'div',
            {},
            this.op.daysShort[i]
          )
        })
      ]
    )

    const weeks: VNode[] = this.weeks.map((el, i) => {
      return h(
        'div',
        {
          staticClass: 'b-calendar__week',
          class: {
            'b-calendar__first-week': i === 0
          },
          key: i
        },
        [
          el.days.map((d, j) => {
            return h(
              'div',
              {
                key: d.date,
                attrs: {
                  'data-current': d.date,
                  'disabled': d.isDisabled
                },
                class: {
                  'b-calendar__prev-month': d.isPrevMonth,
                  'b-calendar__next-month': d.isNextMonth,
                  'b-calendar__holiday': d.isHoliday,
                  'b-calendar__today': d.isToday,
                  'b-calendar__range-start': this.op.range && d.date === this.range[0],
                  'b-calendar__range-end': this.op.range && d.date === this.range[1],
                  'b-calendar__in-range': this.inRange(d.date),
                  'b-calendar__range-hover': this.inRangeHover(d.date)
                },
                on: {
                  click: () => {
                    if(!d.isDisabled) {
                      this.daySelection(d.date)
                    }
                  },
                  mouseover: () => {
                    this.$emit('active-date', d.date)
                  }
                }
              },
              this.op.eventsMode
                ? [
                  h(
                    'span',
                    {},
                    `${i === 0 ? this.op.weekDays[j] + ', ' : ''}${d.num}`
                  ),
                  h('div', {},
                    this.op.items
                      ? [
                        h('strong', {}, this.op.items[d.date] ? this.op.items[d.date].title : ''),
                        h('p', {}, this.op.items[d.date] ? this.op.items[d.date].content : '')
                      ]
                      : []
                  ),
                  h(
                    'svg-icon',
                    {
                      props: {
                        icon: 'loader',
                        width: '30px',
                        height: '30px'
                      }
                    }
                  )
                ]
                : [h('span', {}, `${d.num}`)]
            )
          })
        ]
      )
    })

    const month: VNode[] = []
    for(let i = 0; i < 12; i++) {
      const y = this.currentDate.getFullYear()
      month.push(h(
        'div',
        {
          staticClass: 'b-calendar__month',
          class: {
            'b-calendar__today': i === this.baseMonth && y === this.baseYear
          },
          on: {
            click: (e: MouseEvent) => this.monthSelection(i)
          }
        },
        this.op.month[i]
      ))
    }

    const year: VNode[] = []
    for(let i = 0; i <= 8; i++) {
      const y = this.currentDate.getFullYear() - 4 + i
      year.push(h(
        'div',
        {
          staticClass: 'b-calendar__year',
          class: {
            'b-calendar__today': y === this.baseYear
          },
          on: {
            click: (e: MouseEvent) => this.yearSelection(y)
          }
        },
        `${y}`
      ))
    }

    const body: VNode = h(
      'div',
      {
        ref: 'body',
        staticClass: 'b-calendar__body'
      },
      this.op.eventsMode
        ? [weeks]
        : (this.op.mode === 'd' ? [head, weeks] : (this.op.mode === 'm' ? [month] : [year]))
    )

    const monthBtn: VNode = h(
      'button',
      {
        staticClass: 'b-calendar__month-btn',
        on: {
          click: (e: MouseEvent) => this.btnMonthHandler(e)
        }
      },
      'Месяц'
    )

    const todayBtn: VNode = h(
      'button',
      {
        staticClass: 'b-calendar__today-btn',
        on: {
          click: (e: MouseEvent) => this.btnTodayHandler(e)
        }
      },
      'Сегодня'
    )

    const yearBtn: VNode = h(
      'button',
      {
        staticClass: 'b-calendar__year-btn',
        on: {
          click: (e: MouseEvent) => this.btnYearHandler(e)
        }
      },
      'Год'
    )

    const footer: VNode = h(
      'div',
      {
        staticClass: 'b-calendar__footer'
      },
      [monthBtn, todayBtn, yearBtn]
    )

    return h(
      'div',
      {
        staticClass: 'b-calendar',
        class: {
          'b-calendar--events': this.op.eventsMode
        }
      },
      this.op.eventsMode
        ? [body]
        : [nav, body, footer]
    )
  }
}

const CalendarInstance = Vue.component('CalendarInstance', CalendarComponent)

export default CalendarInstance
