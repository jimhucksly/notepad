import { shallowMount } from '@vue/test-utils'
import App from '~/App.js'

escribe('App.js', () => {
  test('render App', () => {
    const wrapper = shallowMount(App)
    expect(wrapper.text()).toMatch(msg)
  })
})
