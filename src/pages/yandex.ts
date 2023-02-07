import { Vue } from 'vue-property-decorator'
import { YandexDiskAppID } from '~/constants'

export default class Yandex extends Vue {
  createYandexDiskStepOne = true
  createYandexDiskStepTwo = false
  yandexDiskResponseCode = ''
  yandexCodeApplyProcessing = false

  createYandexDiskPath() {
    let href = 'https://oauth.yandex.ru/authorize?response_type=code&client_id='
    href = href + YandexDiskAppID
    this.$electron.shell.openExternal(href)
    setTimeout(() => {
      this.createYandexDiskStepOne = false
      this.createYandexDiskStepTwo = true
    }, 1000)
  }

  // async yandexCodeApply(event: MouseEvent) {
  //   event.preventDefault()
  //   this.yandexCodeApplyProcessing = true
  //   const query = new YandexTokenQuery(
  //     Number(this.yandexDiskResponseCode), Number(this.currentUser.id)
  //   )
  //   try {
  //     const resp: boolean = await this.$app.$queryBus.exec(query)
  //     const token: string = await storage.get(this.userDataPath, userDataFileName, 'token')
  //     if (resp && token) {
  //       // const data: IResponse<void> = await this.$app.$queryBus.exec(new SessionQuery(token))
  //       // if (data.token) {
  //       //   await this.$app.login(data.token)
  //       //   this.$app.user(data.user)
  //       //   await Promise.all([
  //       //     this.$app.$queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
  //       //     this.$app.$queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
  //       //   ])
  //       //   this.$app.goHome()
  //       // }
  //       // this.$toasted.success('Access token successfully saved')
  //     }
  //   } catch (e) {
  //     let message = 'Access token request failed'
  //     message = (e as { message: string }).message || (e as { response: { message: string } }).response?.message || message
  //     this.$toasted.error(message)
  //     /* eslint-disable no-console */
  //     console.error(e)
  //   } finally {
  //     this.yandexCodeApplyProcessing = false
  //   }
  // }
}
