import { Vue, Component, Watch } from 'vue-property-decorator'
import { JsonQuery, AuthQuery, LibraryQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { PingCommand } from '~/domain/commands/ping.command'
import { AuthCommand, LoadingCommand } from '~/domain/commands'
import _ from 'lodash'
import { IJson, IResponse } from '~/domain/models'
import { AxiosError } from 'axios'

interface IErrors {
  login: number
  pass: number
}

@Component({
  name: 'Auth'
})
export default class Auth extends Vue {
  login = ''
  pass = ''
  errors: IErrors = {
    login: 0,
    pass: 0
  }

  timeout: NodeJS.Timeout | null = null

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Watch('login')
  onLoginChanged(val: string) {
    this.errors.login = val.length > 0 ? 0 : 1
  }

  @Watch('pass')
  onPassChanged(val: string) {
    this.errors.pass = val.length > 0 ? 0 : 1
  }

  validate(): boolean {
    if(this.login.length === 0) {
      this.errors.login = 1
    }
    if(this.pass.length === 0) {
      this.errors.pass = 1
    }
    return Object.keys(this.errors).map((key: string) => this.errors[key]).reduce((a, b) => a + b) === 0
  }

  async submit() {
    if(this.validate()) {
      try {
        await this.queryBus.exec<AuthQuery, string>(new AuthQuery(this.login, this.pass))
        this.commandBus.do<LoadingCommand, void>(new LoadingCommand(true))
        await Promise.all([
          this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
          this.queryBus.exec<LibraryQuery, string>(new LibraryQuery())
        ])
        setTimeout(() => {
          this.commandBus.do<LoadingCommand, void>(new LoadingCommand(false))
          this.commandBus.do<AuthCommand, void>(new AuthCommand(true))
        }, 1500)
      } catch(e) {
        this.handleError(e)
      }
    }
  }

  handleError(e: AxiosError<IResponse<void>>) {
    const data = (e.response ? e.response.data : (e.response || e)) as IResponse<void>
    if(data.messages && !_.isEmpty(data.messages)) {
      this.errors.login = this.errors.login ? 1 : 0
      this.errors.pass = this.errors.pass ? 1 : 0
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
