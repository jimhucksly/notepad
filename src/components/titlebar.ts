import { Vue, Component } from 'vue-property-decorator'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'

@Component({
  name: 'Titlebar'
})
export default class Titlebar extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Getter('getIsAuth') isAuth: boolean

  title = ''
  isMaximized = false

  mounted() {
    this.title = process.env.WINDOW_TITLE
    this.isMaximized = Boolean(Number(process.env.IS_MAXIMAZED))
  }

  toPreferences() {
    this.$app.goto(FsmStates.Preferences)
  }

  toAbout() {
    const command = new CreateEditCommand({
      component: 'about-popup',
      componentProps: {},
      modal: {
        title: 'About',
        width: '25%'
      },
      fsmState: FsmStates.About
    })
    this.commandBus.do<CreateEditCommand<void>, void>(command)
  }

  reload() {
    this.$app.reload()
  }

  logout() {
    this.$app.logout()
  }
}
