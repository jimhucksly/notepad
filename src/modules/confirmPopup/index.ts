import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ConfirmPopupComponent extends Vue {
  @Prop() question: string

  ok() {
    this.$emit('set-result', true)
  }

  no() {
    this.$emit('set-result', false)
  }
}
