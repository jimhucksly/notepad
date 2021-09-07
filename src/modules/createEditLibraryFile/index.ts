import { Component, Prop, Vue } from 'vue-property-decorator'
import { ILibraryFile } from '~/domain/models'
import { uniqueid } from '~/helpers'

@Component
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
    if(!this.id) {
      this.file.id = uniqueid(6, '0-9') as number
    } else {
      this.file.id = this.id
    }
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

  beforeDestroy() {
    this.file.id = null
    this.file.name = ''
  }
}
