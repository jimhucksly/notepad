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
import { userDataFileName, userPreferencesFileName } from '~/constants'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { OAuthQuery, JsonQuery, LibraryFileQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { AuthCommand } from '~/domain/commands'
import { CheckQuery } from '~/domain/queries/check.query'
import { IJson } from '~/domain/models'
import { Mutation, Getter } from 'vuex-class'

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
  @Mutation('setToken') setToken: (value: string) => void
  @Mutation('setLoading') setLoading: (value: boolean) => void

  @Getter('getLoading') loading: boolean
  @Getter('getIsAuth') isAuth: boolean
  @Getter('getToken') token: string
  @Getter('getError') isError: boolean
  @Getter('getComponent') component: string

  @Watch('isAuth') onAuthChanged(v: boolean) {
    if(v) {
      try {
        this.queryBus.exec<CheckQuery, void>(new CheckQuery())
      } catch(e) {
        console.log(e)
      }
    }
  }

  async checkToken(appPath: string): Promise<boolean> {
    this.setLoading(true)
    try {
      await storage.createFile(appPath, userDataFileName)
      const token: string = await storage.get(appPath, userDataFileName, 'token')
      if(token) {
        this.setToken(token)
        await this.queryBus.exec<OAuthQuery, void>(new OAuthQuery())
        await Promise.all([
          this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
          this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
        ])
        setTimeout(() => {
          this.setLoading(false)
          this.commandBus.do<AuthCommand, void>(new AuthCommand(true))
        }, 1500)
        return true
      } else {
        this.setLoading(false)
        this.commandBus.do<AuthCommand, void>(new AuthCommand(false))
        return false
      }
    } catch(e) {
      this.setLoading(false)
      this.commandBus.do<AuthCommand, void>(new AuthCommand(false))
      this.setToken(null)
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
    this.$electron.ipcRenderer.send('get-app-path')
    await this.$electron.ipcRenderer.on(
      'set-app-path',
      async (e: Electron.IpcRendererEvent, appPath: string) => {
        await this.setPath(appPath)
        await this.checkToken(appPath)
      }
    )
  }
}
