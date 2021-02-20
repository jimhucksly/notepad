import { createLocalVue, shallowMount } from '@vue/test-utils'
import 'reflect-metadata'
import Vue from 'vue'
import Vuex from 'vuex'
import router from '../src/router'
import App from '../src/App'
import store from '../src/store'

const localVue = createLocalVue()
localVue.use(Vuex)

Vue.prototype.$electron = require('electron')

let options = { sync: false, store, router, localVue }
const wrapper = shallowMount(App, options)

describe('App', () => {
  it('correctly rendered', async () => {
    expect(wrapper.attributes('id')).toEqual('app')
  })
})
