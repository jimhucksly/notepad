import { Vue, Component, Watch } from 'vue-property-decorator'
import { JsonQuery, AuthQuery, LibraryQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { PingCommand } from '~/domain/commands/ping.command'
import { AuthCommand, LoadingCommand } from '~/domain/commands'
import _ from 'lodash'

interface IErrors {
  login: number
  pass: number
}

@Component({
  name: 'Auth'
})
export default class Auth extends Vue {
  protected login = ''
  protected pass = ''
  protected errors: IErrors = {
    login: 0,
    pass: 0
  }

  protected timeout: any = null

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

  protected validate(): boolean {
    if(this.login.length === 0) {
      this.errors.login = 1
    }
    if(this.pass.length === 0) {
      this.errors.pass = 1
    }
    return Object.keys(this.errors).map((key: string) => this.errors[key]).reduce((a, b) => a + b) === 0
  }

  protected async submit() {
    if(this.validate()) {
      try {
        const query = new AuthQuery(this.login, this.pass)
        await this.queryBus.exec(query)
        this.commandBus.do(new LoadingCommand(true))
        await Promise.all([
          this.queryBus.exec(new JsonQuery()),
          this.queryBus.exec(new LibraryQuery())
        ])
        setTimeout(() => {
          this.commandBus.do(new LoadingCommand(false))
          this.commandBus.do(new AuthCommand(true))
        }, 1500)
      } catch(e) {
        const data = e.response && e.response.data ? e.response.data : (e.response || e)
        if(data.messages && !_.isEmpty(data.messages)) {
          this.errors = { ...data.messages }
          this.errors.login = this.errors.login ? 1 : 0
          this.errors.pass = this.errors.pass ? 1 : 0
          this.validate()
        } else {
          console.error(e)
        }
      }
    }
  }

  mounted() {
    this.commandBus.do(new PingCommand(true))
  }

  destroyed() {
    this.commandBus.do(new PingCommand(false))
  }
}
