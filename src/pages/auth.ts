import { Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { IResponse } from '~/domain/models'
import { AuthQuery } from '~/domain/queries'
import { IValidate } from '~/plugins/validate'

export default class Auth extends Vue {
  @Mutation('setLoading') setLoading: (value: boolean) => void

  @Getter('getEndpoint') endpoint: string
  @Getter('getYandexToken') yandexAccessToken: string

  login = ''
  pass = ''

  v: IValidate = {}

  timeout: NodeJS.Timeout | null = null

  isSubmitted = false

  mounted() {
    this.$validate(this)
  }

  async validate(): Promise<boolean> {
    await this.v.touch()
    return this.v.valid()
  }

  async submit() {
    this.isSubmitted = true
    if (!(await this.validate())) {
      return
    }
    try {
      const data = await this.$app.$queryBus.exec<AuthQuery, IResponse<void>>(new AuthQuery(this.login, this.pass))
      this.$app.user(data.user)
      if (data.user.waitingVerify) {
        this.$app.goto(this.$app.states.Verify)
        return
      }
      if (data.token) {
        this.$app.login(data.token)
      }
      //
      // this.$app.user(data.user)
      // if (this.yandexAccessToken) {
      //   this.$app.loading(true)
      //   await Promise.all([
      //     this.queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
      //     this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
      //   ])
      //   setTimeout(() => {
      //     this.$app.loading(false)
      //   }, 1500)
      // }
    } catch (e) {
      this.$app.loading(false)
      this.handleError(e)
    }
  }

  handleError(e: IResponse<{ message: string }>) {
    if (e?.data?.message === 'Login is incorrect') {
      (this.v as { login: { isInvalid: boolean } }).login.isInvalid = true
    }
    if (e?.data?.message === 'Password is incorrect') {
      (this.v as { pass: { isInvalid: boolean } }).pass.isInvalid = true
    }
  }
}
