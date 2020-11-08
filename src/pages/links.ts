import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { LinksQuery } from '~/domain/queries'
import { UpdateLinksCommand, DeleteLinkCommand } from '~/domain/commands'
import { ILink } from '~/domain/models'

interface IItems {
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

  items: IItems[] = []

  getItems() {
    const o: ILink = this.$store.getters.getLinks
    this.items = Object.keys(o).map((key: string, index: number, arr: any) => {
      return {
        key,
        url: o[key].url,
        name: o[key].name
      }
    })
  }

  protected open(url: string) {
    this.$electron.shell.openExternal(url)
  }

  protected edit(key: string) {
    this.$popup.open('linkAdd')
    this.$electron.ipcRenderer.send('data-transfer', {
      target: 'popup-link-edit',
      data: this.items.find((el: any) => el.key === key)
    })
  }

  protected async remove(key: string) {
    try {
      await this.commandBus.do(new DeleteLinkCommand(key))
      this.items = this.items.filter(el => el.key !== key)
    } catch(e) {
      console.log(e)
    }
  }

  async mounted() {
    await this.queryBus.exec(new LinksQuery())
    this.getItems()
    this.$electron.ipcRenderer.on('data-transfer', (event: any, data: any) => {
      if(data.target === 'links') {
        this.commandBus.do(new UpdateLinksCommand(data.data))
        this.items.push(data.data)
      }
    })
  }
}
