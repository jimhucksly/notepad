import { Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { IModalInfo, IPopupWindowQuery } from '~/domain/models'
import { Hub } from '~/plugins/hub'

export default class Popup extends Vue {
  @Getter('getFsmState') fsmState: symbol

  component = ''
  props: Record<string, unknown> = null
  modal: IModalInfo<unknown> = null
  dialogType: symbol = null

  openDialogHandler: (command: CreateEditCommand<unknown>) => void

  @Watch('showPopup') onShowPopupChanged(state: boolean) {
    if (!state) {
      this.component = null
      this.props = null
      this.modal = null
    }
  }

  mounted() {
    this.openDialogHandler = this.openDialog.bind(this)
    Hub.$on('open-dialog', this.openDialogHandler)
  }

  openDialog<T>(query: IPopupWindowQuery<T>) {
    this.component = query.component
    this.props = query.componentProps || {}
    this.modal = query.modal
    this.dialogType = query.fsmState
    this.$app.goto(this.dialogType)
  }

  close() {
    this.modal.resolveFunction(null)
    this.modal = null
    this.$app.goBack()
  }

  onSetResult(data: unknown) {
    this.modal.resolveFunction(data)
    this.modal = null
    this.$app.goBack()
  }

  get width() {
    return this.modal?.width || '30%'
  }

  get title() {
    return this.modal?.title
  }

  get isInfoWindowDialog(): boolean {
    return this.modal && this.dialogType === this.$app.states.InfoWindow
  }

  get isConfirmWindowDialog(): boolean {
    return this.modal && this.dialogType === this.$app.states.ConfirmWindow
  }

  get showPopup() {
    return (
      this.isInfoWindowDialog || this.isConfirmWindowDialog
    )
  }
}
