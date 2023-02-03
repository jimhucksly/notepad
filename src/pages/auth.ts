import isEmpty from 'lodash-es/isEmpty'
import { Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
// import { _container } from '~/domain/container'
// import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { IResponse } from '~/domain/models'
// import { TYPES } from '~/domain/types'
import { IValidate } from '~/plugins/validate'

export default class Auth extends Vue {
  // private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  // private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

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

  validate(): boolean {
    this.v.touch()
    return this.v.valid()
  }

  submit() {
    this.isSubmitted = true
    if (this.validate()) {
      try {
        // const data = await this.queryBus.exec<AuthQuery, IResponse<void>>(new AuthQuery(this.login, this.pass))
        // this.$app.login(data.token)
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
        this.handleError(e as IResponse<void>)
      }
    }
  }

  handleError(e: IResponse<void>) {
    if (e.messages && !isEmpty(e.messages)) {
      this.validate()
    } else {
      /* eslint-disable no-console */
      console.error(e)
    }
  }
}
