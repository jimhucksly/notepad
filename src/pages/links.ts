import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { LinksQuery } from '~/domain/queries'
import { UpdateLinksCommand, DeleteLinkCommand } from '~/domain/commands'
import { ILink } from '~/domain/models'
import { Getter, Mutation } from 'vuex-class'

@Component({
  name: 'Links'
})
export default class Links extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setIsLinkAddPopupShow') showAddLinkPopup: (value: boolean) => void

  @Getter('getLinks') links: Array<ILink>

  open(url: string) {
    this.$electron.shell.openExternal(url)
  }

  edit(id: string) {
    this.showAddLinkPopup(true)
    this.$electron.ipcRenderer.send('data-transfer', {
      target: 'popup-link-edit',
      data: this.links.find((el: ILink) => el.id === id)
    })
  }

  async remove(id: string) {
    try {
      await this.commandBus.do<DeleteLinkCommand, void>(new DeleteLinkCommand(id))
      await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    } catch(e) {
      console.log(e)
    }
  }

  async mounted() {
    await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    this.$electron.ipcRenderer.on(
      'data-transfer',
      async (
        event: Electron.IpcRendererEvent,
        data: { target: string, data: { id: string, url: string, name: string } }
      ) => {
        if(data.target === 'links') {
          await this.commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(data.data))
          await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
        }
      }
    )
  }
}
