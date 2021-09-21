import { Vue, Component } from 'vue-property-decorator'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { LinksQuery } from '~/domain/queries'
import { DeleteLinkCommand, UpdateLinksCommand } from '~/domain/commands'
import { ILink } from '~/domain/models'
import { Getter } from 'vuex-class'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import FsmStates from '~/application/fsm.states'

@Component({
  name: 'Links'
})
export default class Links extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Getter('getLinks') links: Array<ILink>

  isEmpty = false

  open(url: string) {
    this.$electron.shell.openExternal(url)
  }

  async edit(id: string) {
    const found = this.links.find(link => link.id === id)
    if(found) {
      const command = new CreateEditCommand({
        component: 'create-edit-link',
        componentProps: {
          id,
          url: found.url,
          name: found.name
        },
        modal: {
          title: 'Edit link',
          width: '30%'
        },
        fsmState: FsmStates.AddLinkPopup
      })
      const result = await this.commandBus.do<CreateEditCommand<ILink>, ILink>(command)
      if(!result) {
        return
      }
      await this.commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(result))
      await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    }
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
    if(!this.links?.length) {
      this.isEmpty = true
    }
  }
}
