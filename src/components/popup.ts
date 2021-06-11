import { Vue, Component, Watch } from 'vue-property-decorator'
import { Action, Getter, Mutation } from 'vuex-class'
import { uniqueid } from '~/helpers'
import { AUTHOR } from '~/constants'
import { AddLibraryFileCommand } from '~/domain/commands'

Vue.component('CloseBtn', {
  template: '<div class="popup-close-btn" @click="$emit(\'click\')"></div>'
})

Vue.component('PopupTitle', {
  template: '<div class="popup-title-bar"><slot></slot></div>'
})

@Component({
  name: 'Popup'
})
export default class Popup extends Vue {
  @Action('actionAddLibraryFile') sendData: (command: AddLibraryFileCommand) => void

  @Mutation('setIsAboutPopupShow') showAboutPopup: (value: boolean) => void
  @Mutation('setIsUploadingPopupShow') showUploadingPopup: (value: boolean) => void
  @Mutation('setIsLinkAddPopupShow') showAddLinkPopup: (value: boolean) => void
  @Mutation('setIsLibraryFileAddPopupShow') showLibraryFileAddPopup: (value: boolean) => void

  @Getter('getIsAboutPopupShow') aboutPopupShow: boolean
  @Getter('getIsUploadingPopupShow') uploadingPopupShow: boolean
  @Getter('getIsLinkAddPopupShow') linkAddPopupShow: boolean
  @Getter('getIsLibraryFileAddPopupShow') libraryFileAddPopupShow: boolean

  appName = ''

  linkUrl = ''
  linkName = ''
  linkId = ''
  libraryFileTitle = ''
  libraryFileName = ''

  get showPopup() {
    const flags: string[] = [
      'aboutPopupShow',
      'uploadingPopupShow',
      'linkAddPopupShow',
      'libraryFileAddPopupShow'
    ]
    return flags.map((key: string) => this[key]).reduce((res, el) => res || Boolean(el))
  }

  @Watch('showPopup') onShowPopupChanged(v: boolean) {
    if(!v) {
      this.clear()
    }
  }

  addLink() {
    if(this.linkUrl && this.linkName) {
      this.$electron.ipcRenderer.send('data-transfer', {
        target: 'links',
        data: {
          id: this.linkId || uniqueid(8),
          url: this.linkUrl,
          name: this.linkName
        }
      })
      this.showAddLinkPopup(false)
      this.clear()
    }
  }

  clear() {
    this.linkUrl = ''
    this.linkName = ''
    this.linkId = ''
  }

  addLibraryFile() {
    if(!this.libraryFileTitle || !this.libraryFileName) {
      return
    }
    const command = new AddLibraryFileCommand({
      id: uniqueid(6, '0-9') as number,
      title: this.libraryFileTitle,
      name: this.libraryFileName
    })
    this.sendData(command)
    this.showLibraryFileAddPopup(false)
  }

  mounted() {
    this.$electron.ipcRenderer.send('get-window-title')
    this.$electron.ipcRenderer.on(
      'set-window-title',
      (e: Electron.IpcRendererEvent, title: string) => {
        this.appName = title
      }
    )
    this.$electron.ipcRenderer.on(
      'data-transfer',
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (e: Electron.IpcRendererEvent, data: any) => {
        if(data.target === 'popup-link-edit') {
          this.linkUrl = data.data.url
          this.linkName = data.data.name
          this.linkId = data.data.id
        }
      }
    )
  }

  get author() {
    return AUTHOR
  }
}
