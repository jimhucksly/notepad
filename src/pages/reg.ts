import { Vue } from 'vue-class-component'
import { RegistrationCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus } from '~/domain/interfaces'
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

  validate(): boolean {
    this.v.touch()
    return this.v.valid()
  }

  async submit() {
    this.isSubmitted = true
    if (!this.validate()) {
      return
    }
    try {
      await this.commandBus.do(new RegistrationCommand({
        login: this.login,
        pass: this.pass,
        name: this.name,
        email: this.email
      }))
    } catch (e) {
      /* eslint-disable no-console */
      console.log(e)
    }
  }

  goBack() {
    this.$app.goto(this.$app.states.Auth)
  }
}
