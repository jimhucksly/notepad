import { Vue } from 'vue-class-component'
import { LinksQuery } from '~/domain/queries'
import { DeleteLinkCommand, UpdateLinksCommand } from '~/domain/commands'
import { ILink } from '~/domain/models'
import { Getter } from 'vuex-class'
import { CreateEditCommand } from '~/domain/commands/createEdit.command'

export default class Links extends Vue {
  @Getter('links/getLinks') links: Array<ILink>

  isEmpty = false

  async mounted() {
    await this.$app.$queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    if (!this.links?.length) {
      this.isEmpty = true
    }
  }

  open(url: string) {
    this.$electron.shell.openExternal(url)
  }

  async edit(id: string) {
    const found = this.links.find(link => link.id === id)
    if (found) {
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
        }
      })
      const result = await this.$app.$commandBus.do<CreateEditCommand<ILink>, ILink>(command)
      if (!result) {
        return
      }
      await this.$app.$commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(result))
      await this.$app.$queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    }
  }

  async remove(id: string) {
    try {
      await this.$app.$commandBus.do<DeleteLinkCommand, void>(new DeleteLinkCommand(id))
      await this.$app.$queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  getName(item: ILink, index: number) {
    return `${index + 1}. ${item.name}`
  }
}
