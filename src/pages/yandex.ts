import { Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { YandexDiskAppID } from '~/constants'
import { IUser } from '~/domain/models'
import { SessionQuery, YandexTokenQuery } from '~/domain/queries'

export default class Yandex extends Vue {
  createYandexDiskStepOne = true
  createYandexDiskStepTwo = false
  yandexDiskResponseCode = ''
  yandexCodeApplyProcessing = false

  isError = false

  @Getter('getCurrentUser') currentUser: IUser
  @Getter('getUserDataPath') userDataPath: string

  createYandexDiskPath() {
    let href = 'https://oauth.yandex.ru/authorize?response_type=code&client_id='
    href = href + YandexDiskAppID
    this.$electron.shell.openExternal(href)
    setTimeout(() => {
      this.createYandexDiskStepOne = false
      this.createYandexDiskStepTwo = true
    }, 1000)
  }

  async yandexCodeApply() {
    try {
      this.yandexCodeApplyProcessing = true
      const query = new YandexTokenQuery(
        Number(this.yandexDiskResponseCode), Number(this.currentUser.id)
      )
      await this.$app.$queryBus.exec(query)
      await this.$app.$queryBus.exec(new SessionQuery())
      this.$app.user(this.currentUser)
      this.$app.goHome()
    } catch (e) {
      let message = 'Access token request failed'
      message = (e as { message: string }).message || (e as { response: { message: string } }).response?.message || message
      this.$toasted.error(message)
    } finally {
      this.yandexCodeApplyProcessing = false
    }
  }
}
