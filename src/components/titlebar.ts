/* eslint-disable-next-line spaced-comment */
/// <reference path="../../window.d.ts" />
import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { LoadingCommand } from '~/domain/commands'
import {
  JsonQuery,
  LibraryQuery,
  EventsQuery,
  LinksQuery
} from '~/domain/queries'

@Component({
  name: 'Titlebar'
})
export default class Titlebar extends Vue {
  title = ''

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  get isAuth() {
    return this.$store.getters.getIsAuth
  }
  get preferencesShow() {
    return this.$store.getters.isPreferencesShowed
  }

  protected async reload() {
    this.commandBus.do(new LoadingCommand(true))
    await Promise.all([
      this.queryBus.exec(new JsonQuery()),
      this.queryBus.exec(new LibraryQuery()),
      this.queryBus.exec(new EventsQuery()),
      this.queryBus.exec(new LinksQuery())
    ])
    setTimeout(() => {
      this.commandBus.do(new LoadingCommand(false))
    }, 1500)
  }

  mounted() {
    this.$electron.ipcRenderer.send('get-window-title')
    this.$electron.ipcRenderer.on('set-window-title', (e: any, title: string) => {
      this.title = title
    })
    if(document && document.getElementById) {
      const menuBtn = document.getElementById('menu-button')
      menuBtn && menuBtn.addEventListener('click', (event) => {
        this.$electron.ipcRenderer.send('menu-popup')
      })

      const minimizeBtn = document.getElementById('minimize-button')
      minimizeBtn && minimizeBtn.addEventListener('click', (e) => {
        this.$electron.ipcRenderer.send('minimize')
      })

      const minMaxBtn = document.getElementById('min-max-button')
      minMaxBtn && minMaxBtn.addEventListener('click', () => {
        this.$electron.ipcRenderer.send('min-max')
      })

      const closebtn = document.getElementById('close-button')
      closebtn && closebtn.addEventListener('click', (e) => {
        this.$electron.ipcRenderer.send('hide')
      })
    }
  }
}
