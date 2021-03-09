import 'reflect-metadata'
import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Library from '../src/pages/library'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'

const constructor = Library.prototype.constructor as any

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Library>
let buildTreeFake: jest.SpyInstance<any, unknown[]>

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
    wrapper = mount(Library, options)
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

describe('Library page', () => {
  beforeEach(async () => {
    buildTreeFake = jest.spyOn(constructor.options.methods, 'buildTree')
    await setupTest()
    await flushPromises()
  })

  afterEach(() => {
    buildTreeFake.mockReset()
    buildTreeFake.mockRestore()
  })

  it('correctly rendered', () => {
    expect(wrapper.findComponent({ ref: 'editor_wrapper' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'editor' }).exists()).toBe(true)
  })

  it('"buildTree" method has been called', () => {
    expect(buildTreeFake).toHaveBeenCalled()
  })

  it('correctly tree building', async () => {
    const tree = wrapper.vm.$store.getters.getLibraryTree
    expect(tree.length).toEqual(1)
    expect(tree[0].children.length).toEqual(1)
  })

  it('mount instance of SimpleMDE is correctly', () => {
    expect(wrapper.vm.editor instanceof SimpleMDE).toBe(true)
    expect(typeof wrapper.vm.editor.togglePreviewHandler).toEqual('function')
  })

  it('mount instance of MarkdownIt is correctly', () => {
    expect(Library.md instanceof MarkdownIt).toBe(true)
  })
})
