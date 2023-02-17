import { Options, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import File from '~/components/file'
import { UploadFileCommand } from '~/domain/commands'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { IFile } from '~/domain/models'
import { FilesQuery } from '~/domain/queries'
import { dragAndDropLoader } from '~/helpers'

@Options({
  components: {
    File
  }
})
export default class Files extends Vue {
  @Getter('files/getFiles') files: Array<IFile>

  created() {
    this.$app.$queryBus.exec(new FilesQuery())
  }

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
    let i = 0
    for (const f of files) {
      formData.append(`file${++i}`, f)
    }
    this.upload(formData)
  }

  async upload(formData: FormData) {
    try {
      this.$app.$commandBus.do(
        new CreateEditCommand({
          component: 'uploading-popup',
          componentProps: {},
          modal: {
            title: 'Uploading'
          },
          fsmState: FsmStates.Uploading
        })
      )
      await this.$app.$commandBus.do(new UploadFileCommand(formData))
      this.$app.goBack()
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }
}
