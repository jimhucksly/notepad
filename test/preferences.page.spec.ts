import 'reflect-metadata'
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Preferences from '../src/pages/preferences'
import BCheckbox from '../src/modules/bcheckbox'

const PreferencesTemplate = require('../src/pages/preferences.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(BCheckbox)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Preferences>

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
    wrapper = shallowMount(PreferencesTemplate, options)
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
    expect(wrapper.find('.preferences').exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'form' }).exists()).toBe(true)
  })

  it('fields validating is correct', () => {
    expect(wrapper.vm.validate()).toBe(false)
  })
})
