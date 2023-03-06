import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { _container } from '~/domain/container'
import { IQueryBus } from '~/domain/interfaces'
import { IUser } from '~/domain/models'
import { InfoWindowQuery } from '~/domain/queries/infoWindow.query'
import { TYPES } from '~/domain/types'

export default class Titlebar extends Vue {
  private readonly queryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Getter('getIsAuth') isAuth: boolean
  @Getter('getCurrentUser') currentUser: IUser
  @Getter('getProcess') process: { name: string }

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
    this.queryBus.exec(query)
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
}
