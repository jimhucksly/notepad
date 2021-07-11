import { Vue, Component, Prop } from 'vue-property-decorator'
import { IFile } from '~/domain/models'

@Component({
  name: 'File'
})
export default class File extends Vue {
  @Prop() readonly itemKey: string
  @Prop() readonly itemFile: IFile

  get stamp() {
    return this.itemKey
  }
  get href() {
    return this.itemFile.link
  }
  get fileName() {
    return this.itemFile.name
  }
  get type() {
    return this.itemFile.type
  }

  openFile() {
    this.$emit('on-open-file', this.href)
  }

  saveFile() {
    this.$emit('on-save-file', {
      fileName: this.fileName,
      href: this.href
    })
  }
}
