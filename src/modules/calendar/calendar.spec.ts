import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import BCalendar, { getNativeDate, isDate } from './index'
import { Options, Vue } from 'vue-class-component'
import SvgIcon from '~/modules/svgIcon'

@Options({
  template: `
    <div>
      <b-calendar
        ref="calendar"
        :options="bCalendarOptions"
        @form-toggle="$event => bCalendarFormShow = $event"
      />
    </div>
  `,
  components: {
    BCalendar
  }
})
class WrapperComponent extends Vue {
  bCalendarFormShow = false
  bCalendarOptions = {
    eventsMode: true,
    setDate: '15.01.2001'
  }
}

let wrapper: VueWrapper<Vue> = null
let component: Vue = null

async function setupTest() {
  try {
    wrapper = mount(WrapperComponent, {
      global: {
        components: {
          SvgIcon
        }
      }
    })
    component = wrapper.vm
    await component.$nextTick()
    await flushPromises()
  } catch (e) {
    console.error(e)
  }
}

describe('Calendar', () => {
  beforeEach(async () => {
    await setupTest()
  })

  it('rendered correctly: eventMode', () => {
    expect(wrapper.find('.b-calendar-card').exists()).toBe(true)
    expect(wrapper.find('.b-calendar-wrap').exists()).toBe(true)
    expect(wrapper.find('.b-calendar--events').exists()).toBe(true)
  })

  it('getNativeDate', () => {
    const d = '15.01.2001'
    expect(getNativeDate(d) instanceof Date).toBe(true)
    expect(getNativeDate(d).toLocaleString()).toEqual('15.01.2001, 00:00:00')
  })

  it('isDate', () => {
    const d = '15.01.2001'
    expect(isDate(getNativeDate(d))).toBe(true)
  })

  it('show form when day is selected', async () => {
    const d = '15.01.2001'
    const calendar: any = component.$refs.calendar
    calendar.daySelected(d)
    await calendar.$nextTick()
    expect(wrapper.find('.b-calendar-form').exists()).toBe(true)
  })

  it('prev month', async () => {
    const calendar: any = component.$refs.calendar
    calendar.prevMonth()
    await component.$nextTick()
    expect(getNativeDate(calendar.op.setDate).toLocaleDateString()).toEqual('15.12.2000')
  })

  it('next month', async () => {
    const calendar: any = component.$refs.calendar
    calendar.nextMonth()
    await component.$nextTick()
    expect(getNativeDate(calendar.op.setDate).toLocaleDateString()).toEqual('01.02.2001')
  })

  it('set today', async () => {
    const today = new Date().toLocaleDateString();
    const calendar: any = component.$refs.calendar
    calendar.setToday()
    await component.$nextTick()
    expect(getNativeDate(calendar.op.setDate).toLocaleDateString()).toEqual(today)
  })
})

export default {}
