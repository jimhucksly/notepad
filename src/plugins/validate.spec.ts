import { mount, VueWrapper } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { Vue } from 'vue-class-component';
import Validate from '~/plugins/validate';

let wrapper: VueWrapper<Vue> = null;
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
let component: any = null;

const App = defineComponent({
  data() {
    return {
      v: {},
      name: '',
      login: '',
      pass: '',
      email: '',
    };
  },
  mounted() {
    this.$validate(this);
  },
  methods: {
    async validate() {
      await this.v.touch();
      return this.v.valid();
    },
  },
  template: `
    <div>
      <input
        type="text"
        v-model="login"
        :class="{ error: v?.login?.isInvalid }"
        name="login"
        required
      >
      <input
        type="text"
        v-model="pass"
        :class="{ error: v?.pass?.isInvalid }"
        name="pass"
        required
      >
      <input
        type="text"
        v-model="name"
        :class="{ error: v?.name?.isInvalid }"
        name="name"
        required
      >
      <input
        type="text"
        v-model="email"
        :class="{ error: v?.email?.isInvalid }"
        name="email"
        required
      >
    </div>
  `,
});

async function setupTest() {
  wrapper = mount(App, {
    global: {
      plugins: [Validate],
    },
  });
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  component = wrapper.vm as any;
  await component.$nextTick();
}

describe('validate', () => {
  beforeEach(async () => {
    await setupTest();
  });

  it('the object model of the component field is built correctly', () => {
    expect(component.v.name).toBeDefined();
    expect(component.v.name.isValid).toBeDefined();
    expect(component.v.name.isInvalid).toBeDefined();
    expect(component.v.name.value).toBeDefined();
  });

  it('find the required inputs correctly', () => {
    expect(component.v.name).toBeDefined();
    expect(component.v.login).toBeDefined();
    expect(component.v.pass).toBeDefined();
    expect(component.v.email).toBeDefined();
  });

  it('touch to fields', async () => {
    await component.validate();
    expect(component.v.name.isValid).toBeFalsy();
    expect(component.v.name.isInvalid).toBeTruthy();
    expect(component.v.login.isValid).toBeFalsy();
    expect(component.v.login.isInvalid).toBeTruthy();
    expect(component.v.pass.isValid).toBeFalsy();
    expect(component.v.pass.isInvalid).toBeTruthy();
    expect(component.v.email.isValid).toBeFalsy();
    expect(component.v.email.isInvalid).toBeTruthy();
  });

  it('login is correctly handle', async () => {
    component.login = 'cska';
    await component.validate();
    expect(component.v.login.isValid).toBeTruthy();
    expect(component.v.login.isInvalid).toBeFalsy();
  });

  it('set error if login is contained cyrillic letters', async () => {
    component.login = 'цска';
    await component.validate();
    expect(component.v.login.isValid).toBeFalsy();
    expect(component.v.login.isInvalid).toBeTruthy();
  });

  it('set error if name is contained digits', async () => {
    component.name = 'cska1';
    await component.validate();
    expect(component.v.name.isValid).toBeFalsy();
    expect(component.v.name.isInvalid).toBeTruthy();
  });

  it('email is correctly handle', async () => {
    component.email = 'cska@cska.com';
    await component.validate();
    expect(component.v.email.isValid).toBeTruthy();
    expect(component.v.email.isInvalid).toBeFalsy();
  });

  it('set error if email is incorrect', async () => {
    component.email = 'cska@cska';
    await component.validate();
    expect(component.v.name.isValid).toBeFalsy();
    expect(component.v.name.isInvalid).toBeTruthy();
  });
});
