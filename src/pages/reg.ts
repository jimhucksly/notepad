import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { RegistrationCommand } from '~/domain/commands'
import { IUser } from '~/domain/models'
import { IValidate } from '~/plugins/validate'

export default class Reg extends Vue {
  login = ''
  pass = ''
  passRepeat = ''
  name = ''
  email = ''

  v: IValidate = {}

  isSubmitted = false

  @Getter('getCurrentUser') currentUser: IUser

  mounted() {
    if (this.currentUser) {
      this.login = this.currentUser.login
      this.name = this.currentUser.displayName
      this.email = this.currentUser.email
    }
    this.$validate(this)
  }

  async validate(): Promise<boolean> {
    await this.v.touch()
    return this.v.valid()
  }

  async submit() {
    this.isSubmitted = true
    if (!(await this.validate())) {
      return
    }
    try {
      const user = await this.$app.$commandBus.do<RegistrationCommand, IUser>(new RegistrationCommand({
        login: this.login,
        password: this.pass,
        name: this.name,
        email: this.email
      }))
      this.$app.user(user)
      this.$app.goto(this.$app.states.Verify)
    } catch (e) {
      this.$toasted.error(e?.message || 'submit error')
    }
  }

  goBack() {
    this.$app.goto(this.$app.states.Auth)
  }
}
