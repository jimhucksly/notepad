import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import { Component } from 'vue-property-decorator'
import Vue, { CreateElement, VNode } from 'vue'
import BCalendar from './'

const localVue = createLocalVue()
localVue.use(BCalendar)

const bCalendarOptions = {
  eventsMode: true
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
    console.log(wrapper.vm)
    expect(wrapper.find('.b-calendar-card').exists()).toBe(true)
    // expect(wrapper.find('.b-calendar-wrap').exists()).toBe(true)
    // expect(wrapper.findAll('.calendar-instance').length).toBe(1)
  })
})





