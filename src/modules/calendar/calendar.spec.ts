import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import { Component } from 'vue-property-decorator'
import Vue, { CreateElement, VNode } from 'vue'
import BCalendar, { getNativeDate, isDate } from './'

const localVue = createLocalVue()
localVue.use(BCalendar)

const bCalendarOptions = {
  eventsMode: true,
  setDate: '15.01.2001'
}

@Component
class WrapperComponent extends Vue {
  bCalendarFormShow = false
  render(h: CreateElement): VNode {
    return h(
      'div',
      {},
      [
        h(
          'b-calendar',
          {
            ref: 'calendar',
            props: {
              options: bCalendarOptions
            },
            on: {
              formToggle(v: boolean) {
                this.bCalendarFormShow = v
              }
            }
          },
          []
        )
      ]
    )
  }
}

let wrapper: Wrapper<WrapperComponent>

async function setupTest(props?: any) {
  try {
    let options = { sync: false, localVue }
    if(props) {
      options = { ...options, ...props };
    }
    wrapper = mount(WrapperComponent, options);
    await Vue.nextTick();
  } catch (e) {
    console.error(e);
  }
}

var scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout

function flushPromises() {
  return new Promise(function(resolve) {
    scheduler(resolve, 0)
  })
}

describe('Calendar', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
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
    const calendar: any = wrapper.vm.$refs.calendar
    calendar.daySelected(d)
    await Vue.nextTick()
    expect(wrapper.find('.b-calendar-form').exists()).toBe(true)
  })

  it('prev month', async () => {
    const calendar: any = wrapper.vm.$refs.calendar
    calendar.prevMonth()
    await Vue.nextTick()
    expect(getNativeDate(calendar.op.setDate).toLocaleDateString()).toEqual('15.12.2000')
  })

  it('next month', async () => {
    const calendar: any = wrapper.vm.$refs.calendar
    calendar.nextMonth()
    await Vue.nextTick()
    expect(getNativeDate(calendar.op.setDate).toLocaleDateString()).toEqual('01.02.2001')
  })

  it('set today', async () => {
    const today = new Date().toLocaleDateString();
    const calendar: any = wrapper.vm.$refs.calendar
    calendar.setToday()
    await Vue.nextTick()
    expect(getNativeDate(calendar.op.setDate).toLocaleDateString()).toEqual(today)
  })
})
