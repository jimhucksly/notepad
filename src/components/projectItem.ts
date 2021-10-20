import { Options, Vue } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import Controls from '~/components/controls'
import File from '~/components/file'
import { IJsonItem } from '~/domain/models'

@Options({
  components: {
    Controls,
    File
  }
})
export default class NotepadItem extends Vue {
  @Prop() item: IJsonItem
  @Prop() isLast: boolean

  message = ''
  isEdit = false

  @Watch('item') onItemChanged(o: IJsonItem) {
    this.message = this.item.message ?? ''
  }

  openLink(e: MouseEvent): void | boolean {
    const target = e.target as HTMLAnchorElement
    const isLink = target.tagName === 'A'
    const hasHref = target.href && target.href.length
    if(isLink && hasHref) {
      this.$electron.shell.openExternal(target.href)
      return false
    }
  }

  mounted() {
    this.message = this.item.message ?? ''
    if(this.isLast) {
      this.$emit('on-last-rendered')
    }
  }
}
