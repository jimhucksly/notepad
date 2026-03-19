import { mount, VueWrapper } from '@vue/test-utils';
import { Options, Vue } from 'vue-property-decorator';
import { createRouter, createWebHistory } from 'vue-router';

import { defineComponent } from 'vue';

let wrapper: VueWrapper<Vue> = null;
let component: Vue = null;

@Options({
  template: '<div id="home">Hello World</div>',
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
      component: Index,
    },
  ],
});

const App = defineComponent({
  template: '<router-view></router-view>',
});

async function setupTest() {
  router.push('/');
  await router.isReady();
  wrapper = mount(App, {
    global: {
      plugins: [router],
    },
  });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  component = wrapper.vm as any;
  await component.$nextTick();
}

describe('App', () => {
  beforeEach(async () => {
    await setupTest();
  });

  it('router is ready', () => {
    expect(wrapper.html()).toContain('Hello World');
  });
});
