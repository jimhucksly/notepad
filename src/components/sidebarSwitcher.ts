import { Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { toStr } from '~/application/fsm'
import FsmStates from '~/application/fsm.states'
import { IMenu } from '~/domain/models'

export default class SidebarSwitcher extends Vue {
  @Getter('getMenu') menu: Array<IMenu>
  @Getter('getFsmState') fsmState: symbol

  private isExpand = false

  toggle() {
    if (this.$app.state === FsmStates.Preferences) {
      return
    }
    this.isExpand = !this.isExpand
    if (this.isExpand) {
      this.$emit('on-expand')
      document.onclick = (e: MouseEvent) => {
        if (!(e.target as HTMLElement).closest('.switcher')) {
          this.isExpand = !this.isExpand
          this.$emit('on-hide')
          document.onclick = null
        }
      }
      document.onkeydown = (e: KeyboardEvent) => {
        if (e.code === 'Escape') {
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

  get current() {
    return this.menu.find(item => toStr(item.fsmState) === toStr(this.fsmState))
  }

  get isNotClickable() {
    return [FsmStates.Preferences, FsmStates.Account].includes(this.$app.state)
  }
}
