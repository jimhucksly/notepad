import { Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ConfirmWindowQuery } from '~/domain/queries/confirmWindow.query'
import { CreateEditQuery } from '~/domain/queries/createEdit.query'
import { IFilters, IProject, IProjects } from '../models'
import { EditProjectCommand } from '../commands/commands'

export default class NotepadItem extends Vue {
  @Prop() item: IProject
  @Prop() isLast: boolean

  @Getter('Projects/getProjects') json: IProjects
  @Getter('Projects/getFilter') filter: IFilters

  @Mutation('Projects/setFilter') setFilter: (value: IFilters) => void
  @Mutation('Projects/setJson') setJson: (value: IProjects) => void

  message = ''
  isEdit = false

  @Watch('item') onItemChanged() {
    this.message = this.item.message ?? ''
  }

  mounted() {
    this.message = this.item.message ?? ''
    if (this.isLast) {
      this.$emit('on-last-rendered')
    }
  }

  async edit() {
    const query = new CreateEditQuery<IProject>({
      component: 'Projects-Modal-createEdit',
      componentProps: {
        item: this.item
      },
      modal: {
        title: 'Edit project | ' + (this.item.name || this.item.key),
        width: '65%',
        height: '95%'
      }
    })
    const message = await this.$app.$queryBus.exec<CreateEditQuery<IProject>, string>(query)
    if (!message) {
      return
    }
    const o: IProjects = {
      [this.item.key]: {
        key: this.item.key,
        date: this.item.date,
        name: this.item.name,
        lock: this.item.lock,
        message: message.trim()
      }
    }
    this.setJson({ ...this.json, ...o })
    this.$nextTick(() => {
      this.$app.$commandBus.do(new EditProjectCommand(o))
    })
  }

  async remove() {
    let isConfirm = await this.$app.$queryBus.exec(new ConfirmWindowQuery(
      'Do you realy want to remove this project?'
    ))
    if (!isConfirm) {
      return
    }
    if (this.item.lock) {
      isConfirm = await this.$app.$queryBus.exec(new ConfirmWindowQuery(
        'Project is locked. Do you realy want to remove this project?'
      ))
    }
    if (!isConfirm) {
      return
    }
    this.$emit('on-remove', this.item.key)
  }

  openLink(e: MouseEvent): void | boolean {
    const target = e.target as HTMLAnchorElement
    const isLink = target.tagName === 'A'
    const hasHref = target.href && target.href.length
    if (isLink && hasHref) {
      this.$electron.shell.openExternal(target.href)
      return false
    }
  }
}
