import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { AddLibraryFileCommand, DeleteLibraryFileCommand } from '~/domain/commands'
import { ILibraryFile } from '~/domain/models'
import { LibraryFilesQuery } from '~/domain/queries'
import { ConfirmWindowQuery } from '~/domain/queries/confirmWindow.query'
import { CreateEditQuery } from '~/domain/queries/createEdit.query'

export default class LibraryFiles extends Vue {
  @Prop() expanded: boolean

  @Mutation('library/setLibraryFileId') setFileId: (id: string | number) => void

  @Getter('library/getLibraryFiles') libraryFiles: Array<ILibraryFile>
  @Getter('library/getLibraryFileId') currentId: string

  idForDelete = ''

  openFile(file: ILibraryFile) {
    this.setFileId(file.id)
    this.$app.goBack()
  }

  async add() {
    this.$app.goBack()
    const query = new CreateEditQuery<ILibraryFile>({
      component: 'create-edit-library-file',
      modal: {
        title: 'Add library file',
        width: '30%'
      }
    })
    const result = await this.$app.$queryBus.exec<CreateEditQuery<ILibraryFile>, ILibraryFile>(query)
    if (!result) {
      return
    }
    await this.$app.$commandBus.do(new AddLibraryFileCommand(result.name))
  }

  async removeFile(file: ILibraryFile) {
    const isConfirm = await this.$app.$queryBus.exec(new ConfirmWindowQuery(
      'Do you want to remove the library file?'
    ))
    if (!isConfirm) {
      return
    }
    try {
      await this.$app.$commandBus.do(new DeleteLibraryFileCommand(file.id))
      await this.$app.$queryBus.exec(new LibraryFilesQuery())
      this.setFileId(this.libraryFiles[0]?.id || 0)
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }
}
