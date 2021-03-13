import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { LinksQuery } from '~/domain/queries'
import { UpdateLinksCommand, DeleteLinkCommand } from '~/domain/commands'
import { ILink } from '~/domain/models'
import { Getter, Mutation } from 'vuex-class'

interface IItem {
  key: string
  name: string
  url: string
}

@Component({
  name: 'Links'
})
export default class Links extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setIsLinkAddPopupShow') showAddLinkPopup: (value: boolean) => void

  @Getter('getLinks') links: Array<ILink>

  get items(): IItem[] {
    if(!this.links) {
      return []
    }
    return this.links.map(link => {
      const key = Object.keys(link)[0]
      const values = Object.values(link)
      return {
        key,
        url: values[0].url,
        name: values[0].name
      }
    })
  }

  open(url: string) {
    this.$electron.shell.openExternal(url)
  }

  edit(key: string) {
    this.showAddLinkPopup(true)
    this.$electron.ipcRenderer.send('data-transfer', {
      target: 'popup-link-edit',
      data: this.items.find((el: IItem) => el.key === key)
    })
  }

  async remove(key: string) {
    try {
      await this.commandBus.do<DeleteLinkCommand, void>(new DeleteLinkCommand(key))
      await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    } catch(e) {
      console.log(e)
    }
  }

  async mounted() {
    await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.$electron.ipcRenderer.on('data-transfer', (event: any, data: any) => {
      if(data.target === 'links') {
        this.commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(data.data))
        this.items.push(data.data)
      }
    })
  }
}
