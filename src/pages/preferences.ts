import AutoLaunch from 'auto-launch'
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { YandexDiskAppID, YandexApiTokenFileName } from '~/constants'
import { _container } from '~/domain/container'
import { IQueryBus } from '~/domain/interfaces'
import { IYandexTokenResponse } from '~/domain/models'
import { YandexTokenQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import storage from '~/plugins/storage'
import pkg from '../../package.json'

@Component({
  name: 'Preferences'
})
export default class Preferences extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Mutation('setDownloadsTargetPath') setDownloadsTargetPath: (value: string) => void
  @Mutation('setYandexApiToken') setYandexApiToken: (value: string) => void

  @Getter('getUserDataPath') userDataPath: string
  @Getter('getDownloadsTargetPath') downloadsTargetPath: string
  @Getter('getYandexApiToken') yandexApiToken: string

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

  @Watch('yandexApiToken', { immediate: true }) async onYandexApiTokenChanged() {
    const yandexToken = await storage.get<string>(
      this.userDataPath, YandexApiTokenFileName, 'access_token'
    )
    if(yandexToken) {
      this.setYandexApiToken(yandexToken)
    } else {
      if(this.yandexApiToken) {
        this.setYandexApiToken(null)
      }
    }
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

  createYandexDiskPath() {
    let href = 'https://oauth.yandex.ru/authorize?response_type=code&client_id='
    href = href + YandexDiskAppID
    this.$electron.shell.openExternal(href)
    setTimeout(() => {
      this.createYandexDiskStepTwo = true
    }, 1000)
  }

  async yandexCodeApply() {
    const query = new YandexTokenQuery(Number(this.yandexDiskResponseCode))
    try {
      const resp: IYandexTokenResponse = await this.queryBus.exec(query)
      if(resp.access_token && resp.refresh_token) {
        await this.$app.setYandexApiToken(resp)
        this.$toasted.success('Access token successfully saved')
      }
    } catch(e) {
      let message = 'Access token request failed'
      message = e.message || e.response?.message || message
      this.$toasted.error(message)
      console.log(e)
    }
  }

  revoke() {
    this.$app.revokeYandexApiToken()
  }

  get isYandexApiTokenExist() {
    return Boolean(this.yandexApiToken)
  }
}
