import { Vue, Component, Prop } from 'vue-property-decorator'
import { NavigateCommand } from '~/domain/commands/nav.command'
import { IMenu } from '~/domain/models'
import { ICommandBus } from '~/domain/interfaces'
import { _container } from '~/domain/container'
import { TYPES } from '~/domain/types'

@Component({
  name: 'SidebarSwitcher'
})
export default class SidebarSwitcher extends Vue {
  @Prop({ type: String, default: '' }) readonly legend!: string

  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  private isExpand = false

  get menu(): IMenu[] {
    return this.$store.getters.getMenu
  }

  get isProjects() {
    return this.$store.getters.getIsProjectsShow
  }
  get isTodo() {
    return this.$store.getters.getIsTodoShow
  }
  get isLibrary() {
    return this.$store.getters.getIsLibraryShow
  }
  get isEvents() {
    return this.$store.getters.getIsEventsShow
  }
  get isJsonViewer() {
    return this.$store.getters.getIsJsonViewerShow
  }
  get isLinks() {
    return this.$store.getters.getIsLinksShow
  }
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

  protected toggle(): any {
    if(this.legend) return null
    this.isExpand = !this.isExpand
    if(this.isExpand) {
      this.$emit('on-expand')
      document.onclick = (e: any) => {
        if(!e.target.closest('.switcher')) {
          this.isExpand = !this.isExpand
          this.$emit('on-hide')
          document.onclick = null
        }
      }
      document.onkeydown = (e) => {
        if(e.keyCode === 27 || e.code === 'Escape') {
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

  protected select(item: IMenu) {
    this.commandBus.do<NavigateCommand>(new NavigateCommand(item.name))
    this.toggle()
  }
}
