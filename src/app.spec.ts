import { mount, VueWrapper } from '@vue/test-utils'
import { Options, Vue } from 'vue-property-decorator'
import AnimePlugin from '~/plugins/anime'

let wrapper: VueWrapper<Vue> = null
let component: Vue = null

@Options({
  template: '<div id="app"></div>'
})
class App extends Vue {
  //
}

async function setupTest() {
  wrapper = mount(App, {
    global: {
      plugins: [AnimePlugin]
    }
  })
  component = wrapper.vm
  console.log(component.$el.outerHTML)
  await component.$nextTick()
}

describe('App', () => {
  beforeEach(async () => {
    await setupTest()
  });

  it('correctly used plugins', async () => {
    expect(wrapper).toBeTruthy()
  })
})
