import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Controls from '~/components/controls'
import File from '~/components/file'
import { downloadFile } from '~/helpers'

interface IData {
  key: string
  name: string
  date: string
  lock: boolean
  message?: string
  file?: {
    name: string
    link: string
    type: string
  }
}

@Component({
  name: 'NotepadItem',
  components: {
    Controls,
    File
  }
})
export default class NotepadItem extends Vue {
  @Prop()
  item!: IData

  @Prop()
  isLast!: boolean

  message = ''
  isEdit = false

  @Watch('item')
  onItemChanged(o: IData) {
    this.message = this.item.message ?? ''
  }

  protected openFile(href: string) {
    this.$electron.shell.openExternal(href)
  }

  protected saveFile(o: { fileName: string, href: string }) {
    const fileCont: any = this.$refs.file
    const loader: any = fileCont.$refs.loader
    const finalPath = this.$store.getters.getDownloadsTargetPath + '\\' + o.fileName
    downloadFile(o.href, finalPath, loader)
  }

  protected openLink(e: MouseEvent): void | boolean {
    const target: any = e.target
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
