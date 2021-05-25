import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { DeleteLibraryFileCommand } from '~/domain/commands'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { ILibraryFile } from '~/domain/models'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { LibraryFilesQuery } from '~/domain/queries'

@Component({
  name: 'LibraryFiles'
})
export default class LibraryFiles extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Prop({ type: Boolean, default: false }) init: boolean

  @Mutation('setLibraryFileId') setFileId: (id: string | number) => void
  @Mutation('setIsLibraryFileAddPopupShow') popupShow: (state: boolean) => void

  @Getter('getLibraryFiles') libraryFiles: Array<ILibraryFile>
  @Getter('getLibraryFileId') currentId: string

  idForDelete = ''

  openFile(id: string) {
    this.setFileId(id)
    this.$emit('on-toggle')
  }

  add() {
    this.popupShow(true)
    this.$emit('on-toggle')
  }

  removeFile(id: string) {
    this.idForDelete = id
    this.$electron.ipcRenderer.send('remove-library-file-confirm')
  }

  mounted() {
    this.$electron.ipcRenderer.on('remove-library-file-confirmed', async () => {
      this.$emit('on-toggle')
      const command = new DeleteLibraryFileCommand(this.idForDelete)
      try {
        await this.commandBus.do(command)
        await this.queryBus.exec(new LibraryFilesQuery())
        this.setFileId(this.libraryFiles[0]?.id || 0)
      } catch(e) {
        console.log(e)
      }
    })
  }
}
