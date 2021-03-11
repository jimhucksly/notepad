import 'reflect-metadata'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Links from '../src/pages/links'

const LinksTemplate = require('../src/pages/links.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Links>

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
    wrapper = mount(LinksTemplate, options)
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

describe('Links page', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered', () => {
    expect(wrapper.find('.links_cont').exists()).toBe(true)
  })

  it('correctly received links', () => {
    expect(wrapper.vm.links.length).toEqual(1)
    expect(wrapper.vm.items.length).toEqual(1)
    expect(wrapper.vm.items[0].name).toEqual('Google')
  })
})
