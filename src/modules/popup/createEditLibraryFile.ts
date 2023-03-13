import { Vue } from 'vue-class-component'
import { IValidate } from '~/plugins/validate'

export default class CreateEditLibraryFileComponent extends Vue {
  name = ''

  v: IValidate = {}

  isSubmitted = false

  created() {
    this.$emit('popup-component-created', this)
  }

  mounted() {
    this.$validate(this)
  }

  async validate(): Promise<boolean> {
    await this.v.touch()
    return this.v.valid()
  }

  async save() {
    this.isSubmitted = true
    if (!(await this.validate())) {
      return
    }
    this.$emit('set-result', {
      name: this.name
    })
  }
}
