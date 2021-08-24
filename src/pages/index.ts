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
import { userDataFileName, userPreferencesFileName, YandexApiTokenFileName } from '~/constants'
import { IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { LibraryFileQuery, ProjectsQuery, RefreshYandexTokenQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { CheckQuery } from '~/domain/queries/check.query'
import { IJson, IYandexTokenResponse } from '~/domain/models'
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

  @Mutation('setDownloadsTargetPath') setDownloadsTargetPath: (value: string) => void
  @Mutation('setUserDataPath') setUserDataPath: (value: string) => void

  @Getter('getIsDevelopment') isDev: boolean
  @Getter('getIsAuth') isAuth: boolean
  @Getter('getLoading') loading: boolean
  @Getter('getError') isError: boolean
  @Getter('getFsmState') fsmState: symbol
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
    this.$app.loading(true)
    try {
      await storage.createFile(appPath, userDataFileName)
      const token: string = await storage.get(appPath, userDataFileName, 'token')
      if(token) {
        await this.$app.login(token)
        await Promise.all([
          this.queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
          this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
        ])
        if(!this.isDev) {
          const yandexRefreshToken = await storage.get<string>(
            this.$app.userDataPath, YandexApiTokenFileName, 'refresh_token'
          )
          if(yandexRefreshToken) {
            const resp = await this.queryBus.exec<RefreshYandexTokenQuery, IYandexTokenResponse>(
              new RefreshYandexTokenQuery(yandexRefreshToken)
            )
            if(resp.access_token && resp.refresh_token) {
              this.$app.setYandexApiToken(resp)
            }
          }
        }
        setTimeout(() => {
          this.$app.loading(false)
        }, 1500)
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
}
