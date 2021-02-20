import { createLocalVue, mount, Wrapper } from '@vue/test-utils'
import 'reflect-metadata'
import Vue from 'vue'
import Vuex from 'vuex'
import Auth from '../src/pages/auth'
import store from '../src/store'

const AuthTemplate  = require('../src/pages/auth.vue').default

const localVue = createLocalVue()
localVue.use(Vuex)

Vue.prototype.$electron = require('electron')

let wrapper: Wrapper<Auth>

async function setupTest(props?: any) {
  try {
    let options = { sync: false, store, localVue }
    if(props) {
      options = { ...options, ...props };
    }
    wrapper = mount(AuthTemplate, options);
    await Vue.nextTick();
  } catch (e) {
    console.error(e);
  }
}

var scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout

function flushPromises() {
  return new Promise(function(resolve) {
    scheduler(resolve, 0)
  })
}

describe('Auth Page', () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises()
  })

  it('correctly rendered', () => {
    expect(wrapper.attributes('id')).toBe('auth_cont')
  })

  it('contain Login input', () => {
    expect(wrapper.findComponent({ ref: 'login' }).exists()).toBe(true)
  })

  it('contain Pasword input', () => {
    expect(wrapper.findComponent({ ref: 'password' }).exists()).toBe(true)
  })

  it('contain button', () => {
    expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(true)
  })

  it('errors is showing correctly when login or password is empty', () => {
    const button = wrapper.findComponent({ ref: 'button' })
    button.trigger('click')
    const errors = wrapper.findAll('.form-label-error')
    const result1 = errors.at(0).text() === 'Login is incorrect'
    const result2 = errors.at(1).text() === 'Password is incorrect'
    expect(result1 && result2).toBe(true)
  })
})