import { mount, VueWrapper } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { Vue } from 'vue-class-component'
import AnimePlugin from '~/plugins/anime'
import path from 'path'

let wrapper: VueWrapper<Vue> = null
let component: Vue = null

const App = defineComponent({
  template: '<div></div>'
})

async function setupTest() {
  wrapper = mount(App, {
    global: {
      plugins: [AnimePlugin]
    }
  })
  component = wrapper.vm as any
  await component.$nextTick()
}

describe('anime plugin', () => {
  beforeEach(async () => {
    await setupTest()
  })

  it('method $slideDown id defined', () => {
    expect(component.$slideDown).toBeDefined()
  })

  it('method $slideUp id defined', () => {
    expect(component.$slideUp).toBeDefined()
  })
})