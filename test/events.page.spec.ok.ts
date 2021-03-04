import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import 'reflect-metadata'
import Vue from 'vue'
import Vuex from 'vuex'
import { delay } from '../src/helpers'
import { defaults } from '../src/modules/calendar'
import Events from '../src/pages/events'

const EventsTemplate = require('../src/pages/events.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Events>

async function setupTest(props?: any) {
  try {
    let options = {
      sync: false,
      store,
      localVue
    }
    if(props) {
      options = { ...options, ...props }
    }
    wrapper = mount(EventsTemplate, options)
    await Vue.nextTick()
  } catch (e) {
    console.error(e)
  }
}

const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout

function flushPromises() {
  return new Promise(function(resolve) {
    scheduler(resolve, 0)
  })
}

describe('Events page', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered', () => {
    expect(wrapper.attributes('id')).toBe('events_cont')
    expect(wrapper.findComponent({ ref: 'button-prev' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'header' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'button-next' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'button-today' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'search-form' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'calendar' }).exists()).toBe(true)
  })

  it('items received', () => {
    let title: string
    Object.keys(wrapper.vm.items).forEach(key => {
      title = wrapper.vm.items[key].title
    })
    expect(title).toEqual('Winter')

  })

  it('header contain correctly date', () => {
    const header = wrapper.findComponent({ ref: 'header' })
    const date = new Date()
    expect(header.text()).toEqual(`${defaults.month[date.getMonth()]} ${date.getFullYear()}`)
  })

  it('change date correctly', async () => {
    const header = wrapper.findComponent({ ref: 'header' })
    const prev = wrapper.findComponent({ ref: 'button-prev' })
    const next = wrapper.findComponent({ ref: 'button-next' })
    const date = new Date()
    const currMon = date.getMonth()
    const prevMon = currMon === 0 ? 11 : currMon === 11 ? 0 : currMon - 1
    const y = date.getFullYear()
    prev.trigger('click')
    await Vue.nextTick()
    expect(header.text()).toEqual(`${defaults.month[prevMon]} ${y}`)
    next.trigger('click')
    await Vue.nextTick()
    expect(header.text()).toEqual(`${defaults.month[currMon]} ${y}`)
  })

  it('correctly switch to current month', async () => {
    const header = wrapper.findComponent({ ref: 'header' })
    const next = wrapper.findComponent({ ref: 'button-next' })
    const today = wrapper.findComponent({ ref: 'button-today' })
    next.trigger('click')
    await Vue.nextTick()
    next.trigger('click')
    await Vue.nextTick()
    today.trigger('click')
    await Vue.nextTick()
    const date = new Date()
    const currMon = date.getMonth()
    const y = date.getFullYear()
    expect(header.text()).toEqual(`${defaults.month[currMon]} ${y}`)
  })

  it('correctly search', async () => {
    wrapper.vm.search = 'Winter'
    await delay(1000)
    let searchResults = wrapper.element.querySelector('.events__search-dropdown')
    expect(searchResults).not.toBe(null)
    expect(wrapper.vm.itemsFiltered.length).toEqual(1)
    const li = searchResults.querySelectorAll('ul > li') as NodeListOf<HTMLElement>
    expect(li.length).toEqual(1)
    li[0].click()
    await Vue.nextTick()
    searchResults = wrapper.element.querySelector('.events__search-dropdown')
    expect(searchResults).toBe(null)
  })
})



