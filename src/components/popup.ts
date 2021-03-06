import { Vue, Component, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { uniqueid } from '~/helpers'

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
  @Mutation('setIsAboutPopupShow') showAboutPopup: (value: boolean) => void
  @Mutation('setIsUploadingPopupShow') showUploadingPopup: (value: boolean) => void
  @Mutation('setIsLinkAddPopupShow') showAddLinkPopup: (value: boolean) => void

  @Getter('getIsAboutPopupShow') aboutPopupShow: boolean
  @Getter('getIsUploadingPopupShow') uploadingPopupShow: boolean
  @Getter('getIsLinkAddPopupShow') linkAddPopupShow: boolean

  appName = ''

  get showPopup() {
    const flags: string[] = ['aboutPopupShow', 'uploadingPopupShow', 'linkAddPopupShow']
    return flags.map((key: string) => this[key]).reduce((res, el) => res || Boolean(el))
  }

  @Watch('showPopup')
  onShowPopupChanged(v: boolean) {
    if(!v) {
      this.clear()
    }
  }

  linkUrl = ''
  linkName = ''
  linkId = ''

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
      this.showAddLinkPopup(true)
      this.clear()
    }
  }

  clear() {
    this.linkUrl = ''
    this.linkName = ''
    this.linkId = ''
  }

  mounted() {
    this.$electron.ipcRenderer.send('get-window-title')
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.$electron.ipcRenderer.on('set-window-title', (e: any, title: string) => {
      this.appName = title
    })
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.$electron.ipcRenderer.on('data-transfer', (e: any, data: any) => {
      if(data.target === 'popup-link-edit') {
        this.linkUrl = data.data.url
        this.linkName = data.data.name
        this.linkId = data.data.key
      }
    })
  }
}
