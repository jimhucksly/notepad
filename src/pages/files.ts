import { Options, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import File from '~/components/file'
import { DeleteFileCommand, UploadFileCommand } from '~/domain/commands'
import { IFile } from '~/domain/models'
import { FilesQuery } from '~/domain/queries'
import { ConfirmQuery } from '~/domain/queries/confirm.query'
import { dragAndDropLoader } from '~/helpers'
import { Hub } from '~/plugins/hub'

@Options({
  components: {
    File
  }
})
export default class Files extends Vue {
  @Getter('files/getFiles') files: Array<IFile>
  @Getter('getDownloadsTargetPath') downloadTargetPath: string

  selected: string = null
  uploading = false

  onFileChangeHandler: (e: InputEvent) => void
  onFileRemoveHandler: () => void
  onFileDownloadHandler: () => void

  created() {
    this.fetchFiles()
    this.onFileChangeHandler = this.onFileChange.bind(this)
    Hub.$on('on-file-change', this.onFileChangeHandler)
    this.onFileRemoveHandler = this.onFileRemove.bind(this)
    Hub.$on('on-file-remove', this.onFileRemoveHandler)
    this.onFileDownloadHandler = this.onFileDownload.bind(this)
    Hub.$on('on-file-download', this.onFileDownloadHandler)
  }

  mounted() {
    dragAndDropLoader('drop-area', 'hightlight', this.onFileChange.bind(this))
    window.ondragstart = () => false
  }

  beforeUnmount() {
    Hub.$off('on-file-change', this.onFileChangeHandler)
    Hub.$off('on-file-remove', this.onFileRemoveHandler)
    Hub.$off('on-file-download', this.onFileDownloadHandler)
  }

  fetchFiles() {
    this.$app.$queryBus.exec(new FilesQuery())
  }

  onFileChange(e: InputEvent | DragEvent) {
    const target = e.target as HTMLInputElement
    let files = target.files
    if (!files?.length) {
      files = (e as DragEvent).dataTransfer.files
    }
    if (files?.length === 0) {
      return
    }
    const formData = new FormData()
    let i = 0
    for (const f of files) {
      formData.append(`file${++i}`, f)
    }
    this.upload(formData)
  }

  async onFileRemove() {
    if (!this.selected) {
      return
    }
    const isConfirm = await this.$app.$queryBus.exec(new ConfirmQuery(
      'Do you realy want to remove this file?'
    ))
    if (!isConfirm) {
      return
    }
    await this.$app.$commandBus.do(new DeleteFileCommand(this.selected))
    this.fetchFiles()
  }

  async upload(formData: FormData) {
    try {
      this.uploading = true
      await this.$app.$commandBus.do(new UploadFileCommand(formData))
      this.fetchFiles()
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    } finally {
      this.uploading = false
    }
  }

  onFileDownload() {
    if (!this.selected) {
      return
    }
    const found = this.files.find(f => f.id === this.selected)
    if (found) {
      const a = document.createElement('a')
      a.href = found.href
      a.download = this.downloadTargetPath + '\\' + found.name
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        window.URL.revokeObjectURL(found.href)
      }, 0)
    }
  }

  onSelect(id: string) {
    this.selected = id
    Hub.$emit('on-file-select', this.files.find(f => f.id === id))
  }
}
