/* eslint-disable-next-line */
/// <reference path="../vue-shim.d.ts" />
import { Vue, Component, Watch } from 'vue-property-decorator'
import Popup from './components/popup'
import storage from '~/plugins/storage'
import { userDataFileName } from '~/constants'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { JsonQuery, LibraryQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { AuthCommand, LoadingCommand } from '~/domain/commands'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { CreateElement, VNode } from 'vue'
import { IJson } from './domain/models'

@Component({
  name: 'App',
  components: {
    Popup
  }
})
export default class App extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  get notification() {
    return this.$store.getters.getNotification
  }

  @Watch('notification')
  onNotificationChanged(flag: boolean) {
    if(flag) {
      this.$electron.ipcRenderer.send('set-icon-notification')
    }
  }

  mounted() {
    this.$store.dispatch('isDevelopment', process.env.NODE_ENV === 'development')
    this.$electron.ipcRenderer.on('preferences-show', () => {
      this.commandBus.do<NavigateCommand, void>(new NavigateCommand('preferences'))
    })
    this.$electron.ipcRenderer.on('reload', async () => {
      this.commandBus.do<LoadingCommand, void>(new LoadingCommand(true))
      await Promise.all([
        this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
        this.queryBus.exec<LibraryQuery, string>(new LibraryQuery())
      ])
      this.commandBus.do<LoadingCommand, void>(new LoadingCommand(false))
    })
    this.$electron.ipcRenderer.on('sign-out', () => {
      this.commandBus.do<AuthCommand, void>(new AuthCommand(false))
      this.$store.dispatch('token', null)
      const userDataPath = this.$store.getters.getUserDataPath
      storage.set(userDataPath, userDataFileName, { token: '' })
    })
    this.$electron.ipcRenderer.on('about', () => {
      this.$popup.open('about')
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

  beforeDestroy() {
    this.$store.dispatch('timeout', null)
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
