import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import { AddLibraryFileCommand, DeleteLibraryFileCommand } from '~/domain/commands'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { ILibraryFile } from '~/domain/models'
import { LibraryFilesQuery } from '~/domain/queries'
import { ConfirmQuery } from '~/domain/queries/confirm.query'
import { TYPES } from '~/domain/types'

@Component({
  name: 'LibraryFiles'
})
export default class LibraryFiles extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Prop() expanded: boolean

  @Mutation('setLibraryFileId') setFileId: (id: string | number) => void

  @Getter('getLibraryFiles') libraryFiles: Array<ILibraryFile>
  @Getter('getLibraryFileId') currentId: string

  idForDelete = ''

  openFile(file: ILibraryFile) {
    this.setFileId(file.id)
    this.$app.goBack()
  }

  async add() {
    this.$app.goBack()
    const command = new CreateEditCommand({
      component: 'create-edit-library-file',
      componentProps: {},
      modal: {
        title: 'Add library file',
        width: '30%'
      },
      fsmState: FsmStates.AddLibraryFilePopup
    })
    const file = await this.commandBus.do<CreateEditCommand<ILibraryFile>, ILibraryFile>(command)
    if(!file) {
      return
    }
    await this.commandBus.do(new AddLibraryFileCommand(file))
  }

  async removeFile(file: ILibraryFile) {
    const isConfirm = await this.queryBus.exec(new ConfirmQuery(
      'Do you want to remove the library file?'
    ))
    if(!isConfirm) {
      return
    }
    try {
      await this.commandBus.do(new DeleteLibraryFileCommand(file.name))
      await this.queryBus.exec(new LibraryFilesQuery())
      this.setFileId(this.libraryFiles[0]?.id || 0)
    } catch(e) {
      console.log(e)
    }
  }
}
