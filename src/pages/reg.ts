import { Vue } from 'vue-class-component'
import { RegistrationCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus } from '~/domain/interfaces'
import { IUser } from '~/domain/models'
import { TYPES } from '~/domain/types'
import { IValidate } from '~/plugins/validate'

export default class Reg extends Vue {
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  login = 'root'
  pass = 'root'
  passRepeat = 'root'
  name = 'root'
  email = 'jimhucksly@mail.ru'

  v: IValidate = {}

  isSubmitted = false

  mounted() {
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
      const user = await this.commandBus.do<RegistrationCommand, IUser>(new RegistrationCommand({
        login: this.login,
        password: this.pass,
        name: this.name,
        email: this.email
      }))
      this.$app.user(user)
      this.$app.goto(this.$app.states.Verify)
    } catch (e) {
      /* eslint-disable no-console */
      console.log(e)
    }
  }

  goBack() {
    this.$app.goto(this.$app.states.Auth)
  }
}
