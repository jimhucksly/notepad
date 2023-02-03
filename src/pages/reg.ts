import { Vue } from 'vue-class-component'
import { IValidate } from '~/plugins/validate'


export default class Reg extends Vue {
  login = ''
  pass = ''
  passRepeat = ''
  name = ''
  email = ''

  v: IValidate = {}

  isSubmitted = false

  mounted() {
    this.$validate(this)
  }

  validate(): boolean {
    this.v.touch()
    return this.v.valid()
  }

  submit() {
    this.isSubmitted = true
    if (!this.validate()) {
      return
    }
    //
  }

  goBack() {
    this.$app.goto(this.$app.states.Auth)
  }
}
