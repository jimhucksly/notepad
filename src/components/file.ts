import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { IFile } from '~/domain/models'
import { getFileType } from '~/helpers'

export default class File extends Vue {
  @Prop() item: IFile
  @Prop() index: number

  @Getter('getDownloadsTargetPath') targetPath: string

  mounted() {
    const w = this.parent.clientWidth
    const k = Math.floor(w / (65 + 16))
    const x = 8 + 8 * this.index + 65 * this.index
    const y = Math.floor(this.index / k) + 8
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
