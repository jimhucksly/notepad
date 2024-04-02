import { Options, Vue } from 'vue-class-component'
import { Inject, Prop, Provide } from 'vue-property-decorator'

@Options({
  template: `
    <div class="tab" :class="{ '--active': isActive }" @click="onClick">
      <slot></slot>
    </div>
  `
})
class BTabComponent extends Vue {
  @Prop() value: unknown
  @Prop() state: unknown

  @Inject() tabs: {
    toggle: (value: unknown) => void
  }

  onClick() {
    if (this.tabs) {
      this.tabs.toggle(this.value)
    }
  }

  get isActive() {
    return this.state === this.value
  }
}

@Options({
  template: `
    <div class="tabs">
      <slot v-bind="{ state: modelValue }"></slot>
    </div>
  `
})
class BTabsComponent extends Vue {
  @Prop() modelValue: unknown

  @Provide() tabs = {
    toggle: this.toggle.bind(this)
  }

  toggle(value: unknown) {
    this.$emit('update:model-value', value)
  }
}

const BTabs = BTabsComponent
const BTab = BTabComponent
export {
  BTab
}
export default BTabs
