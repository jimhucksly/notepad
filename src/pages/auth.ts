import { Watch } from 'vue-property-decorator'
import { Vue } from 'vue-class-component'
import { AuthQuery, LibraryFileQuery, ProjectsQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import isEmpty from 'lodash-es/isEmpty'
import { IJson, IResponse } from '~/domain/models'
import { Getter, Mutation } from 'vuex-class'

interface IErrors {
  login: boolean
  pass: boolean
}

export default class Auth extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setLoading') setLoading: (value: boolean) => void

  @Getter('getEndpoint') endpoint: string
  @Getter('getYandexToken') yandexAccessToken: string

  login = ''
  pass = ''
  errors: IErrors = {
    login: false,
    pass: false
  }

  timeout: NodeJS.Timeout | null = null

  @Watch('login') onLoginChanged(val: string) {
    this.errors.login = !(val.length > 0)
  }

  @Watch('pass') onPassChanged(val: string) {
    this.errors.pass = !(val.length > 0)
  }

  validate(): boolean {
    if (this.login.length === 0) {
      this.errors.login = true
    }
    if (this.pass.length === 0) {
      this.errors.pass = true
    }
    return Object.keys(this.errors).map((key: string) => this.errors[key]).reduce((a, b) => a + b) === 0
  }

  async submit() {
    if (this.validate()) {
      try {
        const data = await this.queryBus.exec<AuthQuery, IResponse<void>>(new AuthQuery(this.login, this.pass))
        this.$app.login(data.token)
        this.$app.user(data.user)
        if (this.yandexAccessToken) {
          this.$app.loading(true)
          await Promise.all([
            this.queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
            this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
          ])
          setTimeout(() => {
            this.$app.loading(false)
          }, 1500)
        }
      } catch (e) {
        this.$app.loading(false)
        this.handleError(e as IResponse<void>)
      }
    }
  }

  handleError(e: IResponse<void>) {
    if (e.messages && !isEmpty(e.messages)) {
      this.errors.login = 'login' in e.messages
      this.errors.pass = 'pass' in e.messages
      this.validate()
    } else {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  resetPass() {
    // const href = this.endpoint + '/reset'
    // this.$electron.shell.openExternal(href)
  }
}
