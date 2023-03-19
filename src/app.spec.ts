import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { Options, Vue } from 'vue-property-decorator'
import { createRouter, createWebHistory } from 'vue-router'
import AnimePlugin from '~/plugins/anime'

let wrapper: VueWrapper<Vue> = null
let component: Vue = null

@Options({
  template: '<div id="home">Hello World</div>'
})
class Index extends Vue {
  //
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index
    }
  ]
})

@Options({
  template: '<router-view></router-view>'
})
class App extends Vue {
  //
}

async function setupTest() {
  router.push('/')
  await router.isReady()
  wrapper = mount(App, {
    global: {
      plugins: [router, AnimePlugin]
    }
  })
  component = wrapper.vm
  await component.$nextTick()
  await flushPromises()
}

describe('App', () => {
  beforeEach(async () => {
    await setupTest()
  });

  it('router is ready', async () => {
    expect(wrapper.html()).toContain('Hello World')
  })

  it('anime plugin', async () => {
    expect((component as any).$slideDown).toBeDefined()
  })
})
