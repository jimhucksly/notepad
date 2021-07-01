import { Component, Prop, Vue } from 'vue-property-decorator'
import { ILink } from '~/domain/models'

@Component
export default class CreateEditLinkComponent extends Vue {
  @Prop() id: string
  @Prop() url: string
  @Prop() name: string

  link: ILink = {
    id: '',
    url: '',
    name: ''
  }

  errors = {
    url: false,
    name: false
  }

  created() {
    this.link.id = this.id
    this.link.url = this.url
    this.link.name = this.name
  }

  validate() {
    if(!this.link.url) {
      this.errors.url = true
    }
    if(!this.link.name) {
      this.errors.name = true
    }
    return !Object.values(this.errors).includes(true)
  }

  save() {
    if(this.validate()) {
      this.$emit('set-result', { ...this.link })
    }
  }

  mounted() {
    ['url', 'name'].forEach(key => {
      const ref = this.$refs[key]
      if(ref) {
        (ref as HTMLInputElement).addEventListener('focus', () => {
          this.errors[key] = false
        })
      }
    })
  }

  beforeDestroy() {
    this.link.id = ''
    this.link.url = ''
    this.link.name = ''
  }
}
