import { Component, Vue } from 'vue-property-decorator'
import FsmStates from '~/application/fsm.states'
import { UpdateLinksCommand } from '~/domain/commands'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { _container } from '~/domain/container'
import { ICommandBus, IQueryBus } from '~/domain/interfaces'
import { ILink } from '~/domain/models'
import { LinksQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'

@Component({
  name: 'LinksBtns'
})
export default class LinksBtns extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  async add() {
    const command = new CreateEditCommand({
      component: 'create-edit-link',
      componentProps: {
        url: '',
        name: ''
      },
      modal: {
        title: 'Add link',
        width: '30%'
      },
      fsmState: FsmStates.AddLinkPopup
    })
    const result = await this.commandBus.do<CreateEditCommand, ILink>(command)
    if(!result) {
      return
    }
    await this.commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(result))
    await this.queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
  }
}
