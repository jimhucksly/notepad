import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { LinksQuery } from '~/domain/queries'
import { UpdateLinksCommand, DeleteLinkCommand } from '~/domain/commands'
import { ILink } from '~/domain/models'
import { Mutation } from 'vuex-class'

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

  items: IItem[] = []

  getItems() {
    const o: ILink = this.$store.getters.getLinks
    this.items = Object.keys(o).map((key: string) => {
      return {
        key,
        url: o[key].url,
        name: o[key].name
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
      this.items = this.items.filter(el => el.key !== key)
    } catch(e) {
      console.log(e)
    }
  }

  async mounted() {
    await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    this.getItems()
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    this.$electron.ipcRenderer.on('data-transfer', (event: any, data: any) => {
      if(data.target === 'links') {
        this.commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(data.data))
        this.items.push(data.data)
      }
    })
  }
}
