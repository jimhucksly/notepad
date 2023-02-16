import { Vue } from 'vue-property-decorator'
import { dragAndDropLoader, getFileType } from '~/helpers'

export default class Files extends Vue {
  mounted() {
    dragAndDropLoader('drop-area', 'hightlight', this.onFileChange.bind(this))
    window.ondragstart = () => false
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
    formData.append('file', files[0])
    formData.set('file', files[0])
    this.upload(formData, getFileType(files[0].name))
  }

  upload(file: FormData, fileType: string) {
    try {
      // const command = new CreateEditCommand({
      //   component: 'uploading-popup',
      //   componentProps: {},
      //   modal: {
      //     title: 'Uploading'
      //   },
      //   fsmState: FsmStates.Uploading
      // })
      // this.$app.$commandBus.do<CreateEditCommand<void>, void>(command)
      // const newFile = await this.$app.$commandBus.do<UploadFileCommand, IFile>(new UploadFileCommand(file))
      // this.$app.goBack()
      // this.addFile(newFile.name, fileType)
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }
}
