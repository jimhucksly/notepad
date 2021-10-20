import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Options({
  template: `
    <label
      class="b-checkbox"
      :class="{
        'b-checkbox--enabled': value
      }"
    >
      <input type="checkbox" v-model="value">
      <span class="b-checkbox_runner" @click="toggle"></span>
    </label>
  `
})
export default class BCheckboxComponent extends Vue {
  @Prop() value: boolean

  public toggle() {
    this.$emit('input', !this.value)
  }
}
