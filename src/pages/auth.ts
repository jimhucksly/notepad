import { Vue, Component, Watch } from 'vue-property-decorator'
import { JsonQuery, AuthQuery, LibraryFileQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { PingCommand } from '~/domain/commands'
import _ from 'lodash'
import { IJson, IResponse } from '~/domain/models'
import { AxiosError } from 'axios'
import { Mutation } from 'vuex-class'

interface IErrors {
  login: boolean
  pass: boolean
}

@Component({
  name: 'Auth'
})
export default class Auth extends Vue {
  login = ''
  pass = ''
  errors: IErrors = {
    login: false,
    pass: false
  }

  timeout: NodeJS.Timeout | null = null

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)
  @Mutation('setLoading') setLoading: (value: boolean) => void

  @Watch('login') onLoginChanged(val: string) {
    this.errors.login = !(val.length > 0)
  }

  @Watch('pass') onPassChanged(val: string) {
    this.errors.pass = !(val.length > 0)
  }

  validate(): boolean {
    if(this.login.length === 0) {
      this.errors.login = true
    }
    if(this.pass.length === 0) {
      this.errors.pass = true
    }
    return Object.keys(this.errors).map((key: string) => this.errors[key]).reduce((a, b) => a + b) === 0
  }

  async submit() {
    if(this.validate()) {
      this.$app.loading(true)
      try {
        const token = await this.queryBus.exec<AuthQuery, string>(new AuthQuery(this.login, this.pass))
        this.$app.login(token)
        await Promise.all([
          this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
          this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
        ])
        setTimeout(() => {
          this.$app.loading(false)
        }, 1500)
      } catch(e) {
        this.$app.loading(false)
        this.handleError(e)
      }
    }
  }

  handleError(e: AxiosError<IResponse<void>>) {
    const data = (e.response ? e.response.data : (e.response || e)) as IResponse<void>
    if(data.messages && !_.isEmpty(data.messages)) {
      this.errors.login = 'login' in data.messages
      this.errors.pass = 'pass' in data.messages
      this.validate()
    } else {
      console.error(e)
    }
  }

  mounted() {
    this.commandBus.do<PingCommand, void>(new PingCommand(true))
  }

  beforeDestroy() {
    this.commandBus.do<PingCommand, void>(new PingCommand(false))
  }
}
