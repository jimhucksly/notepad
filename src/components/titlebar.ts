import { Vue } from 'vue-class-component'
import { IUser } from '~/domain/models'
import { InfoWindowQuery } from '~/domain/queries/infoWindow.query'

export default class Titlebar extends Vue {
  title = ''
  isMaximized = false

  mounted() {
    this.title = process.env.WINDOW_TITLE
    this.isMaximized = Boolean(Number(process.env.IS_MAXIMAZED))
  }

  toPreferences() {
    this.$app.goto(this.$app.states.Preferences)
  }

  toAbout() {
    const query = new InfoWindowQuery({
      component: 'about-popup',
      modal: {
        title: 'About',
        width: '25%'
      }
    })
    this.$app.$queryBus.exec(query)
  }

  toAccount() {
    this.$app.goto(this.$app.states.Account)
  }

  reload() {
    this.$app.reload()
  }

  get yandexDiskAccessToken() {
    return this.currentUser?.yandexDiskAccessToken
  }

  get isAuth(): boolean {
    if ('$store' in this) {
      return this.$store.getters.getIsAuth
    }
    return false
  }

  get currentUser(): IUser {
    if ('$store' in this) {
      return this.$store.getters.getCurrentUser
    }
    return null
  }

  get process(): { name: string } {
    if ('$store' in this) {
      return this.$store.getters.getProcess
    }
    return null
  }
}
