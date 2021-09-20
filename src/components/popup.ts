import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { IModalInfo } from '~/domain/models'
import { Hub } from '~/plugins/hub'

@Component({
  name: 'Popup'
})
export default class Popup extends Vue {
  @Getter('getFsmState') fsmState: symbol

  component = ''
  props: Record<string, unknown> = null
  modal: IModalInfo<unknown> = null
  openDialogHandler: (command: CreateEditCommand<unknown>) => void

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

  openDialog(command: CreateEditCommand<unknown>) {
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
      FsmStates.Uploading,
      FsmStates.Downloading,
      FsmStates.AddLibraryFilePopup,
      FsmStates.ConfirmPopup
    ].includes(this.fsmState)
  }
}
