import { Vue, Component } from 'vue-property-decorator'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import {
  EventsQuery,
  LinksQuery,
  LibraryFileQuery,
  ProjectsQuery
} from '~/domain/queries'
import { IEvent, IJson, ILink } from '~/domain/models'
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
    this.$electron.ipcRenderer.send('get-window-title')
    this.$electron.ipcRenderer.on(
      'set-window-title',
      (e: Electron.IpcRendererEvent, title: string) => {
        this.title = title
      }
    )
    this.$electron.ipcRenderer.send('get-is-maximized')
    this.$electron.ipcRenderer.on(
      'set-is-maximized',
      (e: Electron.IpcRendererEvent, isMaximized: boolean) => {
        this.isMaximized = isMaximized
      }
    )
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

  async reload() {
    this.$app.loading(true)
    await Promise.all([
      this.queryBus.exec<ProjectsQuery, IJson>(new ProjectsQuery()),
      this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery()),
      this.queryBus.exec<EventsQuery, Array<IEvent>>(new EventsQuery()),
      this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    ])
    setTimeout(() => {
      this.$app.loading(false)
    }, 1500)
  }

  logout() {
    this.$app.logout()
  }
}
