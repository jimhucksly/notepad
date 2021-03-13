import 'reflect-metadata'
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Projects from '../src/pages/projects'

const ProjectsTemplate = require('../src/pages/projects.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Projects>

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
    wrapper = shallowMount(ProjectsTemplate, options)
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

describe('Projects page', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered', () => {
    expect(wrapper.findComponent({ ref: 'notepad_cont' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'notepad_textarea' }).exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('correctly get json', () => {
    expect(wrapper.vm.count).toEqual(1)
    expect(wrapper.vm.lastStamp).toEqual('20180506144311')
    const key = Object.keys(wrapper.vm.json)[0]
    const item = wrapper.vm.json[key]
    expect(item.name).toEqual('Winter')
  })
})
