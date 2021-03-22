import 'reflect-metadata'
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import ProjectItem from '../src/components/projectItem'
import { IJson, IJsonItem } from '../src/domain/models'

const ProjectItemTemplate = require('../src/components/projectItem.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

const json: IJson = store.getters.getJson

let item: IJsonItem

Object.keys(json).forEach(key => {
  item = json[key]
})

item.unread = true

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<ProjectItem>

async function setupTest(props?: any) {
  try {
    let options = {
      sync: false,
      store,
      propsData: {
        item,
        isLast: true
      },
      localVue
    }
    if(props) {
      options = { ...options, ...props }
    }
    wrapper = shallowMount(ProjectItemTemplate, options)
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

describe('ProjectItem component', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered', () => {
    expect(wrapper.find('.notepad_item').exists()).toBe(true)
  })

  it('item is unread', async () => {
    expect(wrapper.find('.unread').exists()).toBe(true)
  })
})
