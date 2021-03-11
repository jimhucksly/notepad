import { Vue, Component } from 'vue-property-decorator'
import storage from '~/plugins/storage'
import pkg from '../../package.json'
import AutoLaunch from 'auto-launch'
import { ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { Getter, Mutation } from 'vuex-class'

@Component({
  name: 'Preferences'
})
export default class Preferences extends Vue {
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

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

  save() {
    if(this.validate()) {
      storage.append(this.userDataPath, 'UserPreferences', {
        downloadsTargetPath: this.preferences.downloadsTargetPath
      })
      this.setDownloadsTargetPath(this.preferences.downloadsTargetPath)

      if(this.isAutoLaunchEnabled) {
        this.appAutoLauncher.enable()
      } else {
        this.appAutoLauncher.disable()
      }

      this.$electron.ipcRenderer.send('preferences-hide')
      this.commandBus.do<NavigateCommand, void>(new NavigateCommand('goBack'))
    }
  }

  cancel() {
    this.$electron.ipcRenderer.send('preferences-hide')
    this.commandBus.do<NavigateCommand, void>(new NavigateCommand('goBack'))
  }

  openFolderDialog() {
    this.$electron.ipcRenderer.send('open-folder-dialog', {
      defaultPath: this.downloadsTargetPath
    })
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.$electron.ipcRenderer.on('open-dialog-paths-selected', (event: any, response: any) => {
      const path = response && response.filePaths && response.filePaths[0] ? response.filePaths[0] : null
      const currentPath = this.preferences.downloadsTargetPath || this.userDataPath
      this.preferences.downloadsTargetPath = path ?? currentPath
    })
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
