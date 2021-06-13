import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { toStr } from '~/application/fsm'
import FsmStates from '~/application/fsm.states'
import { IMenu } from '~/domain/models'

@Component({
  name: 'SidebarSwitcher'
})
export default class SidebarSwitcher extends Vue {
  @Prop({ type: String, default: '' }) readonly legend!: string

  @Getter('getMenu') menu: Array<IMenu>
  @Getter('getFsmState') fsmState: symbol

  private isExpand = false

  get current() {
    const found = this.menu.find(item => toStr(item.fsmState) === toStr(this.fsmState))
    if(found) {
      return found.id
    }
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

  select(transition: symbol) {
    this.$app.goto(transition)
    this.toggle()
  }

  get isProjects(): boolean {
    return this.fsmState === FsmStates.Projects
  }

  get isTodo(): boolean {
    return this.fsmState === FsmStates.Todo
  }

  get isLibrary(): boolean {
    return this.fsmState === FsmStates.Library
  }

  get isEvents(): boolean {
    return this.fsmState === FsmStates.Events
  }

  get isJsonViewer(): boolean {
    return this.fsmState === FsmStates.JsonViewer
  }

  get isLinks(): boolean {
    return this.fsmState === FsmStates.Links
  }
}
