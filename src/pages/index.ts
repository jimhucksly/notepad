import { Vue, Component, Watch } from 'vue-property-decorator'
import Titlebar from '~/components/titlebar'
import Loading from '~/components/loading'
import Error from '~/components/error'
import Auth from '~/pages/auth'
import Projects from '~/pages/projects'
import Todo from '~/pages/todo'
import Library from '~/pages/library'
import Preferences from '~/pages/preferences'
import Events from '~/pages/events'
import JsonViewer from '~/pages/jsonViewer'
import Links from '~/pages/links'
import Sidebar from '~/components/sidebar'
import storage from '~/plugins/storage'
import { userDataFileName, userPreferencesFileName, YandexDiskAppID } from '~/constants'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { LibraryFileQuery, ProjectsQuery, RefreshYandexTokenQuery, SessionQuery, YandexTokenQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { CheckQuery } from '~/domain/queries/check.query'
import { IJson, IResponse, IUser } from '~/domain/models'
import { Mutation, Getter } from 'vuex-class'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import FsmStates from '~/application/fsm.states'
import { uploadDownloadFile } from '~/helpers'

interface IUserPreferences {
  downloadsTargetPath: string
}

@Component({
  name: 'Index',
  components: {
    Titlebar,
    Loading,
    Auth,
    Error,
    Projects,
    Todo,
    Library,
    Preferences,
    Events,
    JsonViewer,
    Links,
    Sidebar
  }
})
export default class Index extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

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
  @Getter('getUserDataPath') userDataPath: string

  createYandexDiskStepTwo = false
  yandexDiskResponseCode = ''
  yandexCodeApplyProcessing = false

  mounted() {
    this.$electron.ipcRenderer.on(
      'download-start',
      (e: Electron.IpcRendererEvent) => {
        const command = new CreateEditCommand({
          component: 'downloading-popup',
          componentProps: {},
          modal: {
            title: 'Downloading'
          },
          fsmState: FsmStates.Downloading
        })
        this.$store.commit('setProcess', { name: 'dowloading file...' })
        this.commandBus.do<CreateEditCommand<void>, void>(command)
      }
    )
    this.$electron.ipcRenderer.on(
      'download-progress',
      (e: Electron.IpcRendererEvent, progress: { transferredBytes: number, totalBytes: number }) => {
        uploadDownloadFile(progress.transferredBytes, progress.totalBytes)
      }
    )
    this.$electron.ipcRenderer.on(
      'download-end',
      (e: Electron.IpcRendererEvent) => {
        setTimeout(() => {
          this.$store.commit('setProcess', null)
          this.$app.goBack()
        }, 2000)
      }
    )
  }

  @Watch('isAuth') onAuthChanged(v: boolean) {
    if(v) {
      try {
        this.queryBus.exec<CheckQuery, void>(new CheckQuery())
      } catch(e) {
        console.log(e)
      }
    }
    this.createYandexDiskStepTwo = false
    this.yandexDiskResponseCode = ''
  }

  async checkToken(appPath: string): Promise<boolean> {
    this.$app.loading(true)
    try {
      await storage.createFile(appPath, userDataFileName)
      const token: string = await storage.get(appPath, userDataFileName, 'token')
      if(token) {
        const data: IResponse<void> = await this.queryBus.exec(new SessionQuery(token))
        if(data.token) {
          await this.$app.login(data.token)
          this.$app.user(data.user)
        }
        this.$nextTick(async () => {
          if(this.yandexAccessToken) {
            await Promise.all([
              this.queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
              this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
            ])
            if(!this.isDev) {
              await this.queryBus.exec<RefreshYandexTokenQuery, boolean>(
                new RefreshYandexTokenQuery(Number(this.currentUser.id))
              )
            }
            setTimeout(() => {
              this.$app.loading(false)
            }, 1500)
          } else {
            this.$app.loading(false)
          }
        })
        return true
      } else {
        this.$app.loading(false)
        this.$app.logout()
        return false
      }
    } catch(e) {
      this.$app.loading(false)
      this.$app.logout()
      const userDataPath = this.$store.getters.getUserDataPath
      await storage.createFile(userDataPath, userDataFileName)
      storage.set(userDataPath, userDataFileName, { token: '' })
      return false
    }
  }

  async setPath(appPath: string) {
    try {
      this.setUserDataPath(appPath)
      await storage.createFile(appPath, userPreferencesFileName)
      const json: IUserPreferences = await storage.get(appPath, userPreferencesFileName)
      if(json.downloadsTargetPath !== undefined) {
        this.setDownloadsTargetPath(json.downloadsTargetPath)
      } else {
        json.downloadsTargetPath = appPath
        this.setDownloadsTargetPath(appPath)
      }
    } catch(e) {
      console.error(e)
      this.setDownloadsTargetPath(appPath)
    }
  }

  async created(): Promise<void> {
    const appPath = process.env.USER_DATA_PATH
    await this.setPath(appPath)
    await this.checkToken(appPath)
  }

  createYandexDiskPath() {
    let href = 'https://oauth.yandex.ru/authorize?response_type=code&client_id='
    href = href + YandexDiskAppID
    this.$electron.shell.openExternal(href)
    setTimeout(() => {
      this.createYandexDiskStepTwo = true
    }, 1000)
  }

  async yandexCodeApply(event: MouseEvent) {
    event.preventDefault()
    this.yandexCodeApplyProcessing = true
    const query = new YandexTokenQuery(
      Number(this.yandexDiskResponseCode), Number(this.currentUser.id)
    )
    try {
      const resp: boolean = await this.queryBus.exec(query)
      const token: string = await storage.get(this.userDataPath, userDataFileName, 'token')
      if(resp && token) {
        const data: IResponse<void> = await this.queryBus.exec(new SessionQuery(token))
        if(data.token) {
          await this.$app.login(data.token)
          this.$app.user(data.user)
          await Promise.all([
            this.queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
            this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
          ])
          this.$app.goHome()
        }
        this.$toasted.success('Access token successfully saved')
      }
    } catch(e) {
      let message = 'Access token request failed'
      message = (e as { message: string }).message || (e as { response: { message: string } }).response?.message || message
      this.$toasted.error(message)
      console.log(e)
    } finally {
      this.yandexCodeApplyProcessing = false
    }
  }

  get yandexDiskAccessToken() {
    return this.currentUser?.yandexDiskAccessToken
  }

  get isSidebar() {
    return this.isAuth && !this.loading && Boolean(this.yandexDiskAccessToken)
  }

  get isComponent() {
    return Boolean(this.component) && Boolean(this.yandexDiskAccessToken)
  }

  get isYandexDisk() {
    return !this.yandexDiskAccessToken
  }
}
