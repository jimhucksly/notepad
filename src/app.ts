/* eslint-disable-next-line */
/// <reference path="../vue-shim.d.ts" />
import { Vue, Component, Watch } from 'vue-property-decorator'
import { IQueryBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { JsonQuery, LibraryFileQuery } from '~/domain/queries'
import { _container } from '~/domain/container'
import { CreateElement, VNode } from 'vue'
import { IJson } from './domain/models'
import { Getter, Mutation } from 'vuex-class'
import States from './application/states'

@Component({
  name: 'App'
})
export default class App extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Mutation('setIsAboutPopupShow') showAboutPopup: (value: boolean) => void

  @Getter('getNotification') notification: boolean

  @Watch('notification') onNotificationChanged(flag: boolean) {
    if(flag) {
      this.$electron.ipcRenderer.send('set-icon-notification')
    }
  }

  mounted() {
    this.$electron.ipcRenderer.on('gotoPreferences', () => {
      this.$app.goto(States.Preferences)
    })
    this.$electron.ipcRenderer.on('reload', async () => {
      this.$app.loading(true)
      await Promise.all([
        this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
        this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
      ])
      this.$app.loading(false)
    })
    this.$electron.ipcRenderer.on('sign-out', () => {
      this.$app.goto(States.None)
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
