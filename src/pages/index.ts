import { Options, Vue } from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { FsmStates } from '~/application/app'
import Error from '~/components/error'
import Loading from '~/components/loading'
import Sidebar from '~/components/sidebar'
import { userDataFileName, userPreferencesFileName } from '~/constants'
import { IUser } from '~/domain/models'
import Account from '~/pages/account'
import Auth from '~/pages/auth'
import Events from '~/pages/events'
import Library from '~/pages/library'
import Preferences from '~/pages/preferences'
import Projects from '~/pages/projects'
import Reg from '~/pages/reg'
import Reset from '~/pages/reset'
import Todo from '~/pages/todo'
import Verify from '~/pages/verify'
import Yandex from '~/pages/yandex'
import Postman from '~/pages/postman'
import storage from '~/plugins/storage'

interface IUserPreferences {
  downloadsTargetPath: string
}

@Options({
  components: {
    Loading,
    Auth,
    Reg,
    Reset,
    Verify,
    Yandex,
    Error,
    Account,
    Projects,
    Todo,
    Library,
    Preferences,
    Events,
    Sidebar,
    Postman
  }
})
export default class Index extends Vue {
  @Mutation('setDownloadsTargetPath') setDownloadsTargetPath: (value: string) => void
  @Mutation('setUserDataPath') setUserDataPath: (value: string) => void

  @Getter('getIsDevelopment') isDev: boolean
  @Getter('getIsAuth') isAuth: boolean
  @Getter('getLoading') loading: boolean
  @Getter('getError') isError: boolean
  @Getter('getFsmState') fsmState: symbol
  @Getter('getComponent') component: string
  @Getter('getCurrentUser') currentUser: IUser
  @Getter('getYandexToken') yandexAccessToken: string
  @Getter('getSession') session: string
  @Getter('getUserDataPath') userDataPath: string

  async created() {
    const getUserPath = (): Promise<string> => {
      return new Promise((resolve) => {
        this.$electron.ipcRenderer.on(
          'user-path-response',
          (e: Electron.IpcRendererEvent, value: string) => {
            resolve(value)
          })
        this.$electron.ipcRenderer.send('user-path-request')
      })
    }
    const appPath = await getUserPath()
    await this.setPath(appPath)
  }

  mounted() {
    this.$electron.ipcRenderer.on(
      'download-start',
      (e: Electron.IpcRendererEvent) => {
        this.$store.commit('setProcess', { name: 'dowloading file...' })
      }
    )
    this.$electron.ipcRenderer.on(
      'download-end',
      (e: Electron.IpcRendererEvent) => {
        setTimeout(() => {
          this.$store.commit('setProcess', null)
        }, 2000)
      }
    )
  }

  @Watch('appIsReadyToLaunch') onReady() {
    this.checkToken()
  }

  async checkToken() {
    try {
      this.$app.loading(true)
      await storage.createFile(this.userDataPath, userDataFileName)
      const token: string = await storage.get(this.userDataPath, userDataFileName, 'token')
      if (token) {
        await this.$app.login(token)
      } else {
        this.$app.loading(false)
        this.$app.logout()
      }
    } catch (e) {
      if (e?.message === 'Forbidden') {
        this.$app.logout()
      }
      this.$app.loading(false)
    }
  }

  async setPath(appPath: string) {
    try {
      this.setUserDataPath(appPath)
      await storage.createFile(appPath, userPreferencesFileName)
      let downloadsTargetPath = appPath
      const json: IUserPreferences = await storage.get(appPath, userPreferencesFileName)
      if (json.downloadsTargetPath !== undefined) {
        downloadsTargetPath = json.downloadsTargetPath
        this.setDownloadsTargetPath(downloadsTargetPath)
      }
      this.$electron.ipcRenderer.send('set-download-path', downloadsTargetPath)
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
      this.setDownloadsTargetPath(appPath)
    }
  }

  get isAuthWindow(): boolean {
    return this.fsmState === FsmStates.Auth
  }

  get isRegWindow(): boolean {
    return this.fsmState === FsmStates.Reg
  }

  get isResetWindow(): boolean {
    return this.fsmState === FsmStates.Reset
  }

  get isVerifyWindow(): boolean {
    return this.fsmState === FsmStates.Verify
  }

  get isYandexWindow(): boolean {
    return this.fsmState === FsmStates.Yandex
  }

  get yandexDiskAccessToken() {
    return this.currentUser?.yandexDiskAccessToken
  }

  get isSidebar() {
    return this.isAuth && this.isComponent
  }

  get isComponent() {
    return Boolean(this.component)
  }

  get isSessionReceived(): boolean {
    return Boolean(this.session)
  }

  get isUserDataPathDefined(): boolean {
    return Boolean(this.userDataPath)
  }

  get appIsReadyToLaunch(): boolean {
    return this.isSessionReceived && this.isUserDataPathDefined
  }
}
