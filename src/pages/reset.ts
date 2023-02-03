import { Vue } from 'vue-property-decorator'
import { IValidate } from '~/plugins/validate'

export default class Reset extends Vue {
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
    if (this.validate()) {
      //
    }
  }
}
