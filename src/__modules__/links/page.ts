import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { CreateEditQuery } from '~/domain/queries/createEdit.query'
import { ConfirmWindowQuery } from '~/domain/queries/confirmWindow.query'
import { LinksQuery } from './queries/queries'
import { ILink } from './models'
import { DeleteLinkCommand, UpdateLinksCommand } from './commands/commands'

export default class LinksPage extends Vue {
  @Getter('Links/getLinks') links: Array<ILink>

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
      const query = new CreateEditQuery<ILink>({
        component: 'Links-Modal-createEdit',
        componentProps: {
          item: {
            id,
            url: found.url,
            name: found.name
          }
        },
        modal: {
          title: 'Edit link',
          width: '30%'
        }
      })
      const result = await this.$app.$queryBus.exec<CreateEditQuery<ILink>, ILink>(query)
      if (!result) {
        return
      }
      await this.$app.$commandBus.do<UpdateLinksCommand, void>(new UpdateLinksCommand(result))
      await this.$app.$queryBus.exec<LinksQuery, Array<ILink>>(new LinksQuery())
    }
  }

  async remove(id: string) {
    const isConfirm = await this.$app.$queryBus.exec(new ConfirmWindowQuery(
      'Do you want to remove link?'
    ))
    if (!isConfirm) {
      return
    }
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

