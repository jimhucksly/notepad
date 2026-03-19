import { Vue } from 'vue-property-decorator';
import { ResendCodeCommand, VerifyCommand } from '~/domain/commands';

export default class Verify extends Vue {
  code = '';
  isError = false;

  async submit() {
    if (this.code.length === 6 && /^[\d]{6}$/.test(this.code)) {
      try {
        const res = await this.$app.$commandBus.do<VerifyCommand, { status: 'sucess' | 'error' }>(
          new VerifyCommand(this.code)
        );
        this.isError = res.status === 'error';
        if (this.isError) {
          return;
        }
        this.$app.goto(this.$app.states.Auth);
      } catch (e) {
        this.$toasted.error(e?.message || 'submit error');
      }
    }
  }

  async resend() {
    try {
      await this.$app.$commandBus.do<ResendCodeCommand, void>(new ResendCodeCommand());
    } catch (e) {
      this.$toasted.error(e?.message || 'resend error');
    }
  }
}
