import { Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { IPopupComponent, IPopupWindowQuery } from '~/domain/models'
import { Hub } from '~/plugins/hub'

export default class Popup extends Vue {
  @Getter('getFsmState') fsmState: symbol

  component = ''
  props: IPopupWindowQuery<unknown>['componentProps'] = {}
  modal: IPopupWindowQuery<unknown>['modal'] = null
  dialogType: symbol = null
  instance: IPopupComponent<unknown> = null

  openDialogHandler: (query: IPopupWindowQuery<unknown>) => Promise<unknown>

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

  save() {
    if (this.instance.save instanceof Function) {
      this.instance.save()
    }
  }

  get width() {
    return this.modal?.width || '30%'
  }

  get height() {
    return this.modal?.height || 'auto'
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

  get isCreateEditDialog(): boolean {
    return this.modal && this.dialogType === this.$app.states.CreateEdit
  }

  get showPopup() {
    return (
      this.isInfoWindowDialog || this.isConfirmWindowDialog || this.isCreateEditDialog
    )
  }
}
