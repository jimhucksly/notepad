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
    if (props) {
      options = { ...options, ...props };
    }
    wrapper = mount(AuthTemplate, options);
    await Vue.nextTick();
  } catch (e) {
    console.error(e);
  }
}

function flushPromises() {
  return new Promise(resolve => {
    setTimeout(resolve, 0)
  });
}

describe('Auth Page', async () => {
  beforeEach(async () => {
    await setupTest()
    await flushPromises();
  });

  it('correctly rendered', async () => {
    expect(wrapper.attributes('id')).toBe('auth_cont')
  })

  it('contain Login input', async () => {
    expect(wrapper.findComponent({ ref: 'login' }).exists()).toBe(true)
  })

  it('contain Pasword input', async () => {
    expect(wrapper.findComponent({ ref: 'password' }).exists()).toBe(true)
  })

  it('contain button', async () => {
    expect(wrapper.findComponent({ ref: 'button' }).exists()).toBe(true)
  })

  it('errors is showing correctly when login or paswword is empty', () => {
    const button = wrapper.findComponent({ ref: 'button' })
    button.trigger('click')
    const errors = wrapper.findAll('.form-label-error')
    const result1 = errors.at(0).text() === 'Login is incorrect'
    const result2 = errors.at(1).text() === 'Password is incorrect'
    expect(result1 && result2).toBe(true)
  })

  it('display message if login or password is incorrect', async () => {
    const login = wrapper.findComponent({ ref: 'login' })
    const password = wrapper.findComponent({ ref: 'password' })
    login.setValue('1')
    password.setValue('1')
    await wrapper.vm.submit()
    const errors = wrapper.findAll('.form-label-error')
    const result1 = errors.at(0).text() === 'Login is incorrect'
    const result2 = errors.at(1).text() === 'Password is incorrect'
    expect(result1 && result2).toBe(true)
  })
})