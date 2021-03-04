import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import 'reflect-metadata'
import Vue from 'vue'
import Vuex from 'vuex'
import Index from '../src/pages/index'
import Auth from '../src/pages/auth'
import Titlebar from '../src/components/titlebar'

const IndexTemplate = require('../src/pages/index.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Index>

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
    wrapper = shallowMount(IndexTemplate, options)
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

describe('Index page', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered: unauthorized', () => {
    const html = wrapper.element
    expect(html.querySelector('#titlebar')).not.toBe(null)
    expect(html.querySelector('#auth')).not.toBe(null)
  })

  it('correctly rendered: authorized', async () => {
    wrapper.vm.$store.commit('setIsAuth', true)
    await Vue.nextTick()
    const html = wrapper.element
    expect(html.querySelector('#auth')).toBe(null)
    expect(html.querySelector('#sidebar')).not.toBe(null)
  })
})
