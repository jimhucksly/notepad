import { Vue, Component } from 'vue-property-decorator'
import storage from '~/plugins/storage'
import pkg from '../../package.json'
import AutoLaunch from 'auto-launch'
import { Getter, Mutation } from 'vuex-class'

@Component({
  name: 'Preferences'
})
export default class Preferences extends Vue {
  @Mutation('setDownloadsTargetPath') setDownloadsTargetPath: (value: string) => void

  @Getter('getUserDataPath') userDataPath: string
  @Getter('getDownloadsTargetPath') downloadsTargetPath: string

  preferences = {
    downloadsTargetPath: ''
  }
  defaults = {
    downloadsTargetPath: ''
  }
  errors = {
    downloadsTargetPath: 0
  }

  appAutoLauncher: AutoLaunch = null
  isAutoLaunchEnabled = false

  validate(): boolean {
    const form = this.$refs.form as HTMLFormElement
    const requireds: NodeListOf<HTMLInputElement> = form.querySelectorAll('[required]')
    if(requireds.length > 0) {
      requireds.forEach(el => {
        const name = el.name
        if(this[name] === '') {
          this.errors[name] = 1
          el.onclick = () => {
            this.errors[name] = 0
            el.onclick = null
          }
        }
      })
    }

    return Object
      .keys(this.errors)
      .map((key: string) => this.errors[key])
      .reduce((a, b) => a + b) === 0
  }

  async save() {
    if(this.validate()) {
      storage.append(this.userDataPath, 'UserPreferences', {
        downloadsTargetPath: this.preferences.downloadsTargetPath
      })
      this.setDownloadsTargetPath(this.preferences.downloadsTargetPath)

      const isAutoLauncherEnabled = await this.appAutoLauncher.isEnabled()

      if(this.isAutoLaunchEnabled) {
        if(!isAutoLauncherEnabled) {
          this.appAutoLauncher.enable()
        }
      } else {
        if(isAutoLauncherEnabled) {
          this.appAutoLauncher.disable()
        }
      }

      this.$electron.ipcRenderer.send('preferences-hide')
      this.$app.goBack()
    }
  }

  cancel() {
    this.$electron.ipcRenderer.send('preferences-hide')
    this.$app.goBack()
  }

  openFolderDialog() {
    this.$electron.ipcRenderer.send('open-folder-dialog', {
      defaultPath: this.downloadsTargetPath
    })
    this.$electron.ipcRenderer.on(
      'open-dialog-paths-selected',
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (event: Electron.IpcRendererEvent, response: any) => {
        const path = response && response.filePaths && response.filePaths[0]
          ? response.filePaths[0]
          : null
        const currentPath = this.preferences.downloadsTargetPath || this.userDataPath
        this.preferences.downloadsTargetPath = path ?? currentPath
      }
    )
  }

  mounted() {
    this.preferences.downloadsTargetPath = this.$store.getters.getDownloadsTargetPath
    this.defaults.downloadsTargetPath = this.$store.getters.getDownloadsTargetPath

    const appAutoLauncher = new AutoLaunch({
      name: pkg.build.productName.replace(/ /g, '')
    })

    this.appAutoLauncher = appAutoLauncher

    appAutoLauncher.isEnabled()
      .then((isEnabled: boolean) => {
        this.isAutoLaunchEnabled = isEnabled
      }).catch(e => {
        console.log(e)
      })
  }
}
