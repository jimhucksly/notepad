import { Vue, Component, Watch } from 'vue-property-decorator'
import BCalendar from '~/modules/calendar'
import { debounce } from 'lodash'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { EventsQuery } from '~/domain/queries'
import { IEvent } from '~/domain/models'
import { UpdateEventCommand, DeleteEventCommand } from '~/domain/commands'

Vue.use(BCalendar)

interface IBCalendarOptions {
  eventsMode: boolean
  items: IEvent | null
  disableDaysBefore: boolean
  setDate?: string
}

interface ISelected {
  key: string
  title: string
}

@Component({
  name: 'Events'
})
export default class Events extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  protected bCalendarOptions: IBCalendarOptions = {
    eventsMode: true,
    items: null,
    disableDaysBefore: false
  }
  protected bCalendarFormShow = false

  protected header = ''
  protected search = ''
  protected itemsFiltered: any = []

  get items() {
    return this.$store.getters.getEvents
  }

  @Watch('items')
  onItemsReceived(o: IEvent) {
    this.bCalendarOptions = {
      ...this.bCalendarOptions,
      items: o
    }
    const elems = document.querySelectorAll('.processing[data-current]')
    if(elems && elems.length) {
      elems.forEach((el: any) => {
        el.classList.remove('processing')
      })
    }
  }

  private readonly debounced = debounce((v: string, context: any): void | null => {
    context.itemsFiltered = []
    if(!v) return null
    Object.keys(context.bCalendarOptions.items).forEach((key: string) => {
      const title = context.bCalendarOptions.items[key].title.toLowerCase()
      const content = context.bCalendarOptions.items[key].content.toLowerCase()
      if(title.indexOf(v) > -1 || content.indexOf(v) > -1) {
        context.itemsFiltered.push({
          key,
          title: context.bCalendarOptions.items[key].title
        })
      }
      if(context.itemsFiltered.length === 0) {
        context.itemsFiltered.push({
          key: 0,
          title: 'Nothing to show'
        })
      }
      document.onkeydown = (e) => {
        if(e.keyCode === 27 || e.code === 'Escape') {
          context.itemsFiltered = []
          context.search = ''
          document.onclick = null
          document.onkeydown = null
        }
      }
      document.onclick = (e) => {
        e.preventDefault()
        const el: any = e.target
        if(el.closest('.events__search') === null) {
          context.itemsFiltered = []
          context.search = ''
        }
      }
    })
  }, 600)

  @Watch('search')
  onSearchChanged(val: string) {
    this.debounced(val.toLowerCase(), this)
  }

  protected prev() {
    const elem: any = this.$refs.calendar
    elem.prevMonth()
  }
  protected next() {
    const elem: any = this.$refs.calendar
    elem.nextMonth()
  }
  protected today() {
    const elem: any = this.$refs.calendar
    elem.setToday()
  }

  protected async save(event: IEvent) {
    const elem = document.querySelector('[data-current="' + event.date + '"]')
    if(elem) {
      elem.classList.add('processing')
    }
    await this.commandBus.do(new UpdateEventCommand(event))
  }

  protected async remove(date: string) {
    const elem = document.querySelector('[data-current="' + date + '"]')
    if(elem) {
      elem.classList.add('processing')
    }
    await this.commandBus.do(new DeleteEventCommand(date))
  }

  protected itemSelected(item: ISelected): void | null {
    if(item.key === '0') return null
    else {
      this.bCalendarOptions = {
        ...this.bCalendarOptions,
        setDate: item.key
      }
      this.itemsFiltered = []
      this.search = ''
    }
  }

  async mounted() {
    await this.queryBus.exec(new EventsQuery())
  }
}
