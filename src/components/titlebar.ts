import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { _container } from '~/domain/container'
import { ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'

export default class Titlebar extends Vue {
  private readonly commandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Getter('getIsAuth') isAuth: boolean
  @Getter('getProcess') process: { name: string }

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
