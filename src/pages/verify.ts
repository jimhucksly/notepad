import { Vue } from 'vue-property-decorator'
import { IValidate } from '~/plugins/validate'

export default class Verify extends Vue {
  code = ''

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
    //
  }
}
