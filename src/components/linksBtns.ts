import { Options, Vue } from 'vue-class-component'
import { UpdateLinksCommand } from '~/domain/commands'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'
import { ILink } from '~/domain/models'
import { LinksQuery } from '~/domain/queries'
import { uniqueid } from '~/helpers'

@Options({
  template: `
    <div class="links">
      <button @click="add">
        <svg-icon icon="btnAdd" width="32" height="23" />
      </button>
    </div>
  `
})
export default class LinksBtns extends Vue {
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
      fsmState: this.$app.states.AddLinkPopup
    })
    const result = await this.$app.$commandBus.do<CreateEditCommand<ILink>, ILink>(command)
    if (!result) {
      return
    }
    if (!result.id) {
      result.id = uniqueid(6) as string
    }
    await this.$app.$commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(result))
    await this.$app.$queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
  }
}
