import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Vue } from 'vue-class-component';
import { Hub } from '~/plugins/hub';

let wrapper: VueWrapper<Vue> = null;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let component: any = null;

const App = defineComponent({
  data() {
    return {
      eventCalled: false,
      eventPayload: 0,
    };
  },
  created() {
    Hub.$on('event', this.onEvent);
  },
  beforeUnmount() {
    Hub.$flush();
  },
  methods: {
    onEvent(payload?: { param: 1 }) {
      this.eventCalled = true;
      this.eventPayload = payload ? payload.param : 0;
    },
  },
  template: '<div></div>',
});

async function setupTest() {
  wrapper = mount(App);
  component = wrapper.vm;
  await component.$nextTick();
}

describe('hub plugin', () => {
  beforeEach(async () => {
    await setupTest();
  });

  it('hub emit is handled correctly', () => {
    Hub.$emit('event');
    expect(component.eventCalled).toBeTruthy();
  });

  it('hub emit is successfuly transfer a parameters', () => {
    Hub.$emit('event', { param: 1 });
    expect(component.eventPayload).toEqual(1);
  });

  it('hub emit is successfuly unsubscribed', () => {
    Hub.$emit('event');
    expect(component.eventCalled).toBeTruthy();
    component.eventCalled = false;
    Hub.$off('event', component.onEvent);
    Hub.$emit('event');
    expect(component.eventCalled).toBeFalsy();
  });
});
