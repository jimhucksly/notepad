import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { IModalInfo } from '~/domain/models'
import { Hub } from '~/plugins/hub'
// import { Action, Getter, Mutation } from 'vuex-class'
// import { uniqueid } from '~/helpers'
// import { AUTHOR } from '~/constants'
// import { AddLibraryFileCommand } from '~/domain/commands'

@Component({
  name: 'Popup'
})
export default class Popup extends Vue {
  @Getter('getFsmState') fsmState: symbol

  component = ''
  props: Record<string, unknown> = null
  modal: IModalInfo = null
  openDialogHandler: (command: CreateEditCommand) => void

  @Watch('showPopup') onShowPopupChanged(state: boolean) {
    if(!state) {
      this.component = null
      this.props = null
      this.modal = null
    }
  }

  mounted() {
    this.openDialogHandler = this.openDialog.bind(this)
    Hub.$on('open-dialog', this.openDialogHandler)
  }

  openDialog(command: CreateEditCommand) {
    this.component = command.component
    this.props = command.componentProps
    this.modal = command.modal
    this.$app.goto(command.fsmState)
  }

  close() {
    this.modal.resolveFunction(null)
    this.$app.goBack()
  }

  onSetResult(data: Record<string, unknown>) {
    this.modal.resolveFunction(data)
    this.$app.goBack()
  }

  get width() {
    return this.modal?.width || '30%'
  }

  get title() {
    return this.modal?.title
  }

  get showPopup() {
    return [
      FsmStates.AddLinkPopup,
      FsmStates.About,
      FsmStates.Uploading
    ].includes(this.fsmState)
  }

  // libraryFileTitle = ''
  // libraryFileName = ''


  // addLibraryFile() {
  //   if(!this.libraryFileTitle || !this.libraryFileName) {
  //     return
  //   }
  //   const command = new AddLibraryFileCommand({
  //     id: uniqueid(6, '0-9') as number,
  //     title: this.libraryFileTitle,
  //     name: this.libraryFileName
  //   })
  //   this.sendData(command)
  //   this.showLibraryFileAddPopup(false)
  // }
}
