import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Vue } from 'vue-class-component';
import AnimePlugin from '~/plugins/anime';

let wrapper: VueWrapper<Vue> = null;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let component: any = null;

const App = defineComponent({
  template: '<div></div>',
});

async function setupTest() {
  wrapper = mount(App, {
    global: {
      plugins: [AnimePlugin],
    },
  });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  component = wrapper.vm as any;
  await component.$nextTick();
}

describe('anime plugin', () => {
  beforeEach(async () => {
    await setupTest();
  });

  it('method $slideDown id defined', () => {
    expect(component.$slideDown).toBeDefined();
  });

  it('method $slideUp id defined', () => {
    expect(component.$slideUp).toBeDefined();
  });
});
