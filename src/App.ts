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
import { AuthCommand } from '~/domain/commands'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { CreateElement, VNode } from 'vue'
import { IJson } from './domain/models'
import { Mutation } from 'vuex-class'

@Component({
  name: 'App',
  components: {
    Popup
  }
})
export default class App extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setIsDevelopment') setIsDevelopment: (value: boolean) => void
  @Mutation('setToken') setToken: (value: string) => void
  @Mutation('setLoading') setLoading: (value: boolean) => void
  @Mutation('setIsAboutPopupShow') showAboutPopup: (value: boolean) => void

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
    this.setIsDevelopment(process.env.NODE_ENV === 'development')
    this.$electron.ipcRenderer.on('preferences-show', () => {
      this.commandBus.do<NavigateCommand, void>(new NavigateCommand('preferences'))
    })
    this.$electron.ipcRenderer.on('reload', async () => {
      this.setLoading(true)
      await Promise.all([
        this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
        this.queryBus.exec<LibraryQuery, string>(new LibraryQuery())
      ])
      this.setLoading(false)
    })
    this.$electron.ipcRenderer.on('sign-out', () => {
      this.commandBus.do<AuthCommand, void>(new AuthCommand(false))
      this.setToken(null)
      const userDataPath = this.$store.getters.getUserDataPath
      storage.set(userDataPath, userDataFileName, { token: '' })
    })
    this.$electron.ipcRenderer.on('about', () => {
      this.showAboutPopup(true)
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
