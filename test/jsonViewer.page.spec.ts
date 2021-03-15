import 'reflect-metadata'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import JsonViewer from '../src/pages/jsonViewer'

const constructor = JsonViewer.prototype.constructor as any

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<JsonViewer>
let editorInitFake: jest.SpyInstance<any, unknown[]>

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
    wrapper = mount(JsonViewer, options)
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

describe('JsonViewer page', () => {
  beforeEach(async () => {
    editorInitFake = jest.spyOn(constructor.options.methods, 'editorInit')
    await setupTest()
    await flushPromises()
  })

  afterEach(() => {
    editorInitFake.mockReset()
    editorInitFake.mockRestore()
  })

  it('correctly rendered', async () => {
    expect(wrapper.element.querySelector('.json_viewer_src')).not.toBe(null)
    expect(wrapper.element.querySelector('.json_viewer_res')).not.toBe(null)
    expect(wrapper.element.querySelector('.json_viewer_notice')).not.toBe(null)
    expect(editorInitFake).toHaveBeenCalled()
  })
})
