import { Vue, Component } from 'vue-property-decorator'
// import Titlebar from './titlebar'
// import Loading from './loading'
// import Error from './error'
import Auth from '~/components/auth'
// import Notepad from './notepad'
// import Markdown from './markdown'
// import Preferences from './preferences'
// import Sidebar from './sidebar'
import storage from '~/plugins/storage'
import { userDataFileName } from '~/constants.ts'

@Component({
  name: 'Index',
  components: {
    // Titlebar,
    // Loading,
    Auth
    // Error,
    // Notepad,
    // Markdown,
    // Preferences,
    // Sidebar
  }
})
export default class Index extends Vue {
  get loading() {
    return this.$store.getters['loading']
  }
  get isAuth() {
    return this.$store.getters['getAuth']
  }
  get isPreferences() {
    return this.$store.getters['isPreferencesShowed']
  }
  get isProjects() {
    return this.$store.getters['isProjectsShowed']
  }
  get isMarkdown() {
    return this.$store.getters['isMarkdownShowed']
  }
  get token() {
    return this.$store.getters['getToken']
  }
  get isError() {
    return this.$store.getters['getError']
  }

  protected checkToken(p: string) {
    this.$store.dispatch('loading', true)
    storage.isPathExists(p)
      .then(() => {
        return storage.isFileExists(p, userDataFileName)
      })
      .then(() => {
        return storage.get(p, userDataFileName, 'token')
      })
      .then((token) => {
        if(token) {
          this.$store.dispatch('auth', true)
          this.$store.dispatch('token', token)
          this.getJson()
          this.getMd()
        } else throw new Error()
      })
      .catch(() => {
        this.$store.dispatch('loading', false)
        this.$store.dispatch('auth', false)
      })
  }

  protected getJson() {
    this.$store.dispatch('action', {
      type: 'GET_JSON'
    })
  }

  protected getMd() {
    this.$store.dispatch('action', {
      type: 'GET_MD'
    })
  }

  created() {
    const appPath = this.$electron.remote.app.getPath('userData')
    this.$store.dispatch('userDataPath', appPath)
    this.checkToken(appPath)
    storage.get(appPath, 'UserPreferences')
      .then((json: any) => {
        if(json['downloadsTargetPath'] !== undefined) {
          this.$store.dispatch('downloadsTargetPath', json['downloadsTargetPath'])
        } else return Promise.reject(new Error('preferences key in no exists'))
        return null
      })
      .catch(() => {
        this.$store.dispatch('downloadsTargetPath', appPath)
      })
  }
}