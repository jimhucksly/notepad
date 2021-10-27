import AutoLaunch from 'auto-launch'
import Electron from 'electron'
import { Vue } from 'vue-class-component'
import { Getter, Mutation } from 'vuex-class'
import { RevokeYandexTokenCommand } from '~/domain/commands'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IUser } from '~/domain/models'
import { YandexDiskInfoQuery } from '~/domain/queries'
import { ConfirmQuery } from '~/domain/queries/confirm.query'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'
import pkg from '../../package.json'

export default class Preferences extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setDownloadsTargetPath') setDownloadsTargetPath: (value: string) => void
  @Mutation('setYandexApiToken') setYandexApiToken: (value: string) => void

  @Getter('getUserDataPath') userDataPath: string
  @Getter('getDownloadsTargetPath') downloadsTargetPath: string
  @Getter('getYandexApiToken') yandexApiToken: string
  @Getter('getCurrentUser') currentUser: IUser

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
  yandexDiskResponseCode = ''
  createYandexDiskStepTwo = false

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
      this.$app.goBack()
    }
  }

  cancel() {
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

  async revoke() {
    if(!window) {
      await this.queryBus.exec(new YandexDiskInfoQuery())
    } else {
      const isConfirm = await this.queryBus.exec(
        new ConfirmQuery('Do you want to revoke the Yandex.Disk connection?')
      )
      if(!isConfirm) {
        return
      }
      try {
        await this.commandBus.do(new RevokeYandexTokenCommand(Number(this.currentUser.id)))
        location.reload()
      } catch(e) {
        //
      }
    }
  }

  get isYandexApiTokenExist() {
    return Boolean(this.currentUser.yandexDiskAccessToken)
  }
}
