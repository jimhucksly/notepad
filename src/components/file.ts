import { Vue } from 'vue-class-component'
import { Emit, Prop, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { IFile } from '~/domain/models'
import { getFileType } from '~/helpers'

export default class File extends Vue {
  @Prop() item: IFile
  @Prop() index: number
  @Prop() selected: boolean

  @Getter('getDownloadsTargetPath') targetPath: string

  onResizeHandler: () => void

  @Emit('on-select') onSelect() {
    return this.item.id
  }

  @Watch('index') onIndexChanged() {
    this.setPosition()
  }

  mounted() {
    this.setPosition()
    this.onResizeHandler = this.setPosition.bind(this)
    window.addEventListener('resize', this.onResizeHandler)
  }

  setPosition() {
    const w = this.parent.clientWidth
    const count = Math.floor(w / (65 + 16)) + 1
    const row = Math.floor(this.index / count)
    const index = this.index - row * count
    const x = 8 + 8 * index + 65 * index
    let h = 65
    if (row > 0) {
      let topLevelElems: Array<Element> = []
      this.parent.querySelectorAll('.file').forEach(el => topLevelElems.push(el))
      topLevelElems = topLevelElems.slice((row - 1) * count, count)
      const hh = topLevelElems.map(el => el.clientHeight)
      h = Math.max(...hh)
    }
    const y = 8 + row * h
    this.$el.style.transform = `translate(${x}px, ${y}px)`
  }

  get type(): string {
    return getFileType(this.item.extension)
  }

  get parent(): HTMLElement {
    return this.$parent.$el
  }

  // async downloadFile() {
  //   try {
  //     this.downloading = true
  //     const link: string = await this.$app.$queryBus.exec(new YandexDiskResourceLinkQuery(this.fileName))
  //     this.downloading = false
  //     if (link) {
  //       const a = document.createElement('a')
  //       a.href = link
  //       a.download = 'C:\\' + this.fileName
  //       document.body.appendChild(a)
  //       a.click()
  //       setTimeout(() => {
  //         document.body.removeChild(a)
  //         window.URL.revokeObjectURL(link)
  //       }, 0)
  //     }
  //   } catch (e) {
  //     //
  //   } finally {
  //     this.downloading = false
  //   }
  // }
}
