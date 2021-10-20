import { Prop } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'

export default class ConfirmPopupComponent extends Vue {
  @Prop() question: string

  ok() {
    this.$emit('set-result', true)
  }

  no() {
    this.$emit('set-result', false)
  }
}
