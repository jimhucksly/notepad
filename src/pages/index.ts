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
import { OAuthQuery, JsonQuery, LibraryQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { AuthCommand, LoadingCommand } from '~/domain/commands'
import { CheckQuery } from '~/domain/queries/check.query'

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

  get loading(): boolean {
    return this.$store.getters.getLoading
  }
  get isAuth(): boolean {
    return this.$store.getters.getIsAuth
  }
  get token(): string {
    return this.$store.getters.getToken
  }
  get isError(): boolean {
    return this.$store.getters.getError
  }
  get component(): string {
    return this.$store.getters.getComponent
  }

  @Watch('isAuth') onAuthChanged(v: boolean) {
    if(v) {
      this.queryBus.exec(new CheckQuery())
    }
  }

  protected async checkToken(p: string): Promise<boolean> {
    this.commandBus.do<LoadingCommand>(new LoadingCommand(true))
    try {
      await storage.createFile(p, userDataFileName)
      const token = await storage.get(p, userDataFileName, 'token')
      if(token) {
        this.$store.dispatch('token', token)
        await this.queryBus.exec(new OAuthQuery())
        await Promise.all([
          this.queryBus.exec(new JsonQuery()),
          this.queryBus.exec(new LibraryQuery())
        ])
        setTimeout(() => {
          this.commandBus.do(new LoadingCommand(false))
          this.commandBus.do(new AuthCommand(true))
        }, 1500)
        return true
      } else {
        this.commandBus.do(new LoadingCommand(false))
        this.commandBus.do(new AuthCommand(false))
        return false
      }
    } catch(e) {
      this.commandBus.do(new AuthCommand(false))
      this.commandBus.do(new LoadingCommand(false))
      this.$store.dispatch('token', null)
      const userDataPath = this.$store.getters.getUserDataPath
      await storage.createFile(userDataPath, userDataFileName)
      storage.set(userDataPath, userDataFileName, { token: '' })
      return false
    }
  }

  protected async setPath(appPath: string) {
    try {
      this.$store.dispatch('userDataPath', appPath)
      await storage.createFile(appPath, userPreferencesFileName)
      const json: any = await storage.get(appPath, userPreferencesFileName)
      if(json.downloadsTargetPath !== undefined) {
        this.$store.dispatch('downloadsTargetPath', json.downloadsTargetPath)
      } else {
        json.downloadsTargetPath = appPath
        this.$store.dispatch('downloadsTargetPath', appPath)
      }
    } catch(e) {
      console.error(e)
      this.$store.dispatch('downloadsTargetPath', appPath)
    }
  }

  async created(): Promise<void> {
    this.$electron.ipcRenderer.send('get-app-path')
    await this.$electron.ipcRenderer.on('set-app-path', async (e: any, appPath: any) => {
      await this.setPath(appPath)
      await this.checkToken(appPath)
    })
  }
}
