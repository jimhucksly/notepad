/* eslint-disable-next-line spaced-comment */
/// <reference path="../../window.d.ts" />
import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import {
  JsonQuery,
  LibraryQuery,
  EventsQuery,
  LinksQuery
} from '~/domain/queries'
import { IEvent, IJson, ILink } from '~/domain/models'
import { Mutation } from 'vuex-class'

@Component({
  name: 'Titlebar'
})
export default class Titlebar extends Vue {
  title = ''

  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setLoading') setLoading: (value: boolean) => void

  get isAuth() {
    return this.$store.getters.getIsAuth
  }
  get preferencesShow() {
    return this.$store.getters.isPreferencesShowed
  }

  async reload() {
    this.setLoading(true)
    await Promise.all([
      this.queryBus.exec<JsonQuery, IJson>(new JsonQuery()),
      this.queryBus.exec<LibraryQuery, string>(new LibraryQuery()),
      this.queryBus.exec<EventsQuery, Array<IEvent>>(new EventsQuery()),
      this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    ])
    setTimeout(() => {
      this.setLoading(false)
    }, 1500)
  }

  mounted() {
    this.$electron.ipcRenderer.send('get-window-title')
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.$electron.ipcRenderer.on('set-window-title', (e: any, title: string) => {
      this.title = title
    })
    if(document && document.getElementById) {
      const menuBtn = document.getElementById('menu-button')
      menuBtn && menuBtn.addEventListener('click', () => {
        this.$electron.ipcRenderer.send('menu-popup')
      })

      const minimizeBtn = document.getElementById('minimize-button')
      minimizeBtn && minimizeBtn.addEventListener('click', () => {
        this.$electron.ipcRenderer.send('minimize')
      })

      const minMaxBtn = document.getElementById('min-max-button')
      minMaxBtn && minMaxBtn.addEventListener('click', () => {
        this.$electron.ipcRenderer.send('min-max')
      })

      const closebtn = document.getElementById('close-button')
      closebtn && closebtn.addEventListener('click', () => {
        this.$electron.ipcRenderer.send('hide')
      })
    }
  }
}
