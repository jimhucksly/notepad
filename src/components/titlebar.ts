/* eslint-disable-next-line spaced-comment */
/// <reference path="../../window.d.ts" />
import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import {
  JsonQuery,
  EventsQuery,
  LinksQuery,
  LibraryFileQuery
} from '~/domain/queries'
import { IEvent, IJson, ILink } from '~/domain/models'
import { Getter } from 'vuex-class'
import FsmStates from '~/application/fsm.states'

@Component({
  name: 'Titlebar'
})
export default class Titlebar extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Getter('getIsAuth') isAuth: boolean
  @Getter('getFsmState') fsmState: symbol

  title = ''
  isMaximized = false

  async reload() {
    this.$app.loading(true)
    await Promise.all([
      this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
      this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery()),
      this.queryBus.exec<EventsQuery, Array<IEvent>>(new EventsQuery()),
      this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    ])
    setTimeout(() => {
      this.$app.loading(false)
    }, 1500)
  }

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

  get isPreferences(): boolean {
    return this.fsmState === FsmStates.Preferences
  }
}
