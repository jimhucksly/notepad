import { Vue } from 'vue-property-decorator'
import { ResetPasswordCommand } from '~/domain/commands'

export default class Reset extends Vue {
  email = ''
  isSubmitted = false

  async submit() {
    if (this.email.length) {
      try {
        const res = await this.$app.$commandBus.do<ResetPasswordCommand, { email: string }>(new ResetPasswordCommand(this.email))
        if (res.email) {
          this.isSubmitted = true
          this.email = res.email
        }
      } catch (e) {
        //
      }
    }
  }
}
