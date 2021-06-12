import { Vue, Component, Prop } from 'vue-property-decorator'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { IMenu } from '~/domain/models'
import { ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'
import { Getter } from 'vuex-class'

@Component({
  name: 'SidebarSwitcher'
})
export default class SidebarSwitcher extends Vue {
  @Prop({ type: String, default: '' }) readonly legend!: string

  @Getter('getMenu') menu: Array<IMenu>

  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  private isExpand = false

  get current() {
    if(this.isProjects) return 1
    if(this.isLibrary) return 2
    if(this.isTodo) return 3
    if(this.isEvents) return 4
    if(this.isLinks) return 5
    if(this.isJsonViewer) return 6
    return 1
  }
  get legendInternal() {
    let result = ''
    if(this.legend) return this.legend
    else {
      this.menu.forEach((item: IMenu) => {
        item.id === this.current && (result = item.nameAlt)
      })
      return result
    }
  }

  toggle() {
    if(this.legend) {
      return
    }
    this.isExpand = !this.isExpand
    if(this.isExpand) {
      this.$emit('on-expand')
      document.onclick = (e: MouseEvent) => {
        if(!(e.target as HTMLElement).closest('.switcher')) {
          this.isExpand = !this.isExpand
          this.$emit('on-hide')
          document.onclick = null
        }
      }
      document.onkeydown = (e: KeyboardEvent) => {
        if(e.code === 'Escape') {
          this.isExpand = !this.isExpand
          this.$emit('on-hide')
          document.onclick = null
          document.onkeydown = null
        }
      }
    } else {
      document.onclick = null
      document.onkeydown = null
      this.$emit('on-hide')
    }
  }

  select(item: IMenu) {
    this.commandBus.do<NavigateCommand, void>(new NavigateCommand(item.name))
    this.toggle()
  }

  get isProjects(): boolean {
    return this.$app.state === 'Projects'
  }

  get isTodo(): boolean {
    return this.$app.state === 'Todo'
  }

  get isLibrary(): boolean {
    return this.$app.state === 'Library'
  }

  get isEvents(): boolean {
    return this.$app.state === 'Events'
  }

  get isJsonViewer(): boolean {
    return this.$app.state === 'JsonViewer'
  }

  get isLinks(): boolean {
    return this.$app.state === 'Links'
  }
}
