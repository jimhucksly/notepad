import { Options, Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

@Options({
  template: `
    <label
      class="b-checkbox"
      :class="{
        'b-checkbox--enabled': internalValue
      }"
    >
      <input type="checkbox" :value="internalValue">
      <span class="b-checkbox_runner" @click="toggle"></span>
    </label>
  `
})
export default class BCheckboxComponent extends Vue {
  @Prop() modelValue: boolean

  internalValue = false

  mounted() {
    this.internalValue = this.modelValue
  }

  @Watch('modelValue') onModelValueChanged() {
    this.internalValue = this.modelValue
  }

  @Watch('internalValue') onInternalValueChanged() {
    this.$emit('update:modelValue', this.internalValue)
  }

  toggle() {
    this.internalValue = !this.internalValue
    this.$emit('change', this.internalValue)
  }
}
