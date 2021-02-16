import { createLocalVue, mount } from '@vue/test-utils'
import 'reflect-metadata'
import Vue from 'vue'
import Vuex from 'vuex'
import App from '../src/App'
import store from '../src/store'

const localVue = createLocalVue()
localVue.use(Vuex)

Vue.prototype.$electron = require('electron')

describe('App', () => {
  it('App is correctly rendered', async () => {
    let options = { sync: false, store, localVue }
    const wrapper = mount(App, options);
    await Vue.nextTick()
    expect(wrapper.vm.$el.id)
      .toEqual('app')
  })
})
