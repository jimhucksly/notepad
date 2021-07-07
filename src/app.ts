/* eslint-disable-next-line */
/// <reference path="../typings/vue.d.ts" />
import { Vue, Component, Watch } from 'vue-property-decorator'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { EventsQuery, LibraryFileQuery, LinksQuery, ProjectsQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { CreateElement, VNode } from 'vue'
import { IEvent, IJson, ILink } from './domain/models'
import { Getter } from 'vuex-class'
import FsmStates from './application/fsm.states'
import { CreateEditCommand } from './domain/commands/createEdit.command'

@Component({
  name: 'App'
})
export default class App extends Vue {
  private readonly queryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Getter('getNotification') notification: boolean

  @Watch('notification') onNotificationChanged(flag: boolean) {
    if(flag) {
      this.$electron.ipcRenderer.send('set-icon-notification')
    }
  }

  mounted() {
    this.$electron.ipcRenderer.on('gotoPreferences', () => {
      this.$app.goto(FsmStates.Preferences)
    })
    this.$electron.ipcRenderer.on('reload', async () => {
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
    })
    this.$electron.ipcRenderer.on('sign-out', () => {
      this.$app.logout()
    })
    this.$electron.ipcRenderer.on('about', () => {
      const command = new CreateEditCommand({
        component: 'about-popup',
        componentProps: {},
        modal: {
          title: 'About',
          width: '25%'
        },
        fsmState: FsmStates.About
      })
      this.commandBus.do<CreateEditCommand, void>(command)
    })
    window.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      let selection = null
      let hasSelection = false
      if(window.getSelection) {
        const s = window.getSelection()
        selection = s ? s.toString() : ''
        hasSelection = selection ? !!selection.length : false
      }
      if(hasSelection) {
        this.$electron.ipcRenderer.send('context-menu-popup')
      }
    })
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        attrs: {
          id: 'app'
        }
      },
      [
        h(
          'router-view',
          {
            attrs: {
              id: 'content'
            }
          }
        ),
        h(
          'popup'
        )
      ]
    )
  }
}
