import { Vue, Component } from 'vue-property-decorator'
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
  // @Action('actionAddLibraryFile') sendData: (command: AddLibraryFileCommand) => void

  // @Mutation('setIsAboutPopupShow') showAboutPopup: (value: boolean) => void
  // @Mutation('setIsUploadingPopupShow') showUploadingPopup: (value: boolean) => void
  // @Mutation('setIsLibraryFileAddPopupShow') showLibraryFileAddPopup: (value: boolean) => void

  // @Getter('getIsAboutPopupShow') aboutPopupShow: boolean
  // @Getter('getIsUploadingPopupShow') uploadingPopupShow: boolean
  // @Getter('getIsLinkAddPopupShow') linkAddPopupShow: boolean
  // @Getter('getIsLibraryFileAddPopupShow') libraryFileAddPopupShow: boolean

  @Getter('getFsmState') fsmState: symbol

  component = ''
  props: Record<string, unknown> = null
  modal: IModalInfo = null
  openDialogHandler: (command: CreateEditCommand) => void

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
      FsmStates.About
    ].includes(this.fsmState)
  }

  // appName = ''

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

  // mounted() {
  //   this.$electron.ipcRenderer.send('get-window-title')
  //   this.$electron.ipcRenderer.on(
  //     'set-window-title',
  //     (e: Electron.IpcRendererEvent, title: string) => {
  //       this.appName = title
  //     }
  //   )
  //   this.$electron.ipcRenderer.on(
  //     'data-transfer',
  //     /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  //     (e: Electron.IpcRendererEvent, data: any) => {
  //       if(data.target === 'popup-link-edit') {
  //         this.linkUrl = data.data.url
  //         this.linkName = data.data.name
  //         this.linkId = data.data.id
  //       }
  //     }
  //   )
  // }
}
