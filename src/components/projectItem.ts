import { Options, Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import Controls from '~/components/controls'
import { IProject } from '~/domain/models'

@Options({
  components: {
    Controls
  }
})
export default class NotepadItem extends Vue {
  @Prop() item: IProject
  @Prop() isLast: boolean

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
