import { Component, Vue } from 'vue-property-decorator'

@Component
export default class CreateEditLinkComponent extends Vue {
  url = ''
  name = ''

  errors = {
    url: false,
    name: false
  }

  validate() {
    if(!this.url) {
      this.errors.url = true
    }
    if(!this.name) {
      this.errors.name = true
    }
    return !Object.values(this.errors).includes(true)
  }

  save() {
    if(this.validate()) {
      this.$emit('set-result', {
        url: this.url,
        name: this.name
      })
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
    this.url = ''
    this.name = ''
  }
}
