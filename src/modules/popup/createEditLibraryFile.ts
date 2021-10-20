import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import { ILibraryFile } from '~/domain/models'

@Options({
  beforeUnmount() {
    this.file.id = null
    this.file.name = ''
  }
})
export default class CreateEditLibraryFileComponent extends Vue {
  @Prop() id: number
  @Prop() title: string
  @Prop() name: string

  file: ILibraryFile = {
    id: null,
    name: ''
  }

  errors = {
    name: false,
    title: false
  }

  created() {
    this.file.name = this.name
  }

  validate() {
    if(!this.file.name) {
      this.errors.name = true
    }
    return !Object.values(this.errors).includes(true)
  }

  save() {
    if(this.validate()) {
      this.$emit('set-result', { ...this.file })
    }
  }

  mounted() {
    ['title', 'name'].forEach(key => {
      const ref = this.$refs[key]
      if(ref) {
        (ref as HTMLInputElement).addEventListener('focus', () => {
          this.errors[key] = false
        })
      }
    })
  }
}
