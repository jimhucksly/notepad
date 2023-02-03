import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { toStr } from '~/application/fsm'
import { IMenu } from '~/domain/models'

export default class SidebarSwitcher extends Vue {
  @Prop() isAccount: boolean
  @Prop() isPreferences: boolean
  @Prop() isProjects: boolean
  @Prop() isLibrary: boolean
  @Prop() isEvents: boolean
  @Prop() isJsonViewer: boolean
  @Prop() isLinks: boolean
  @Prop() isTodo: boolean

  @Getter('getMenu') menu: Array<IMenu>
  @Getter('getFsmState') fsmState: symbol

  private isExpand = false

  get current() {
    const found = this.menu.find(item => toStr(item.fsmState) === toStr(this.fsmState))
    if (found) {
      return found.id
    }
    return 1
  }

  get legend() {
    if (this.isAccount) {
      return 'Account'
    }
    if (this.isPreferences) {
      return 'Preferences'
    }
    if (this.isProjects) {
      return 'Projects'
    }
    if (this.isLibrary) {
      return 'Library'
    }
    if (this.isEvents) {
      return 'Events'
    }
    if (this.isJsonViewer) {
      return 'Json Viewer'
    }
    if (this.isLinks) {
      return 'Links'
    }
    if (this.isTodo) {
      return 'Todo'
    }
    return ''
  }

  get isNotClickable() {
    return this.isPreferences || this.isAccount
  }

  toggle() {
    if (this.isPreferences) {
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
}
