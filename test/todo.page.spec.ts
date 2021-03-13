import 'reflect-metadata'
import { createLocalVue, shallowMount, Wrapper } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Todo from '../src/pages/todo'

const TodoTemplate = require('../src/pages/todo.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

const store = require('./mock/store').default

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Todo>

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
    wrapper = shallowMount(TodoTemplate, options)
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

describe('Todo page', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered', async () => {
    expect(wrapper.find('.todo_cont').exists()).toBe(true)
    expect(wrapper.vm.items.length).toEqual(1)
  })

  it('show popup is correctly', async () => {
    wrapper.vm.itemSelected = wrapper.vm.items[0]
    wrapper.vm.isPopupShow = true
    await Vue.nextTick()
    expect(wrapper.findComponent({ ref: 'overlay' }).exists()).toBe(true)
    expect(wrapper.findComponent({ ref: 'popup' }).exists()).toBe(true)
  })

  it('correctly add new todo item', async () => {
    wrapper.vm.addTodo()
    await Vue.nextTick()
    expect(wrapper.vm.items.length).toEqual(2)
    expect(wrapper.vm.items[1].text).toEqual('')
  })

  it('correctly save todo item', async () => {
    wrapper.vm.itemSelected = wrapper.vm.items[0]
    wrapper.vm.isPopupShow = true
    await Vue.nextTick()
    const btnSave = wrapper.findComponent({ ref: 'btn-save' })
    expect(btnSave.exists()).toBe(true)
    wrapper.vm.itemSelected.text = 'Summer is over'
    btnSave.trigger('click')
    await Vue.nextTick()
    expect(wrapper.vm.isPopupShow).toEqual(false)
    expect(wrapper.vm.items[0].text).toEqual('Summer is over')
  })

  it('correctly remove todo item', async () => {
    wrapper.vm.addTodo()
    await Vue.nextTick()
    wrapper.vm.itemSelected = wrapper.vm.items[0]
    wrapper.vm.isPopupShow = true
    await Vue.nextTick()
    const btnRemove = wrapper.findComponent({ ref: 'btn-remove' })
    expect(btnRemove.exists()).toBe(true)
    btnRemove.trigger('click')
    await Vue.nextTick()
    expect(wrapper.vm.isPopupShow).toEqual(false)
    expect(wrapper.vm.items.length).toEqual(1)
  })
})
