import { Vue } from 'vue-class-component'
import { IFile } from './models'
import { Hub } from '~/plugins/hub'

export default class FilesSidebar extends Vue {
  fileSelected: IFile = null
  filesCheck = false

  onFileSelectHandler: (file: IFile) => void

  created() {
    this.onFileSelectHandler = this.onFileSelect.bind(this)
    Hub.$on('on-file-select', this.onFileSelectHandler)
  }

  beforeUnmount() {
    Hub.$off('on-file-select', this.onFileSelectHandler)
  }

  onFileSelect(file: IFile) {
    this.fileSelected = file
  }

  onFileChange(e: InputEvent) {
    Hub.$emit('on-file-change', e)
  }

  onFileRemove() {
    Hub.$emit('on-file-remove')
  }

  onFileCheck() {
    this.filesCheck = !this.filesCheck
    Hub.$emit('on-file-check', this.filesCheck)
  }

  onFileDownload() {
    Hub.$emit('on-file-download')
  }
}
