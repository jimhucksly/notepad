import { Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { _container } from '~/domain/container'
import { IQueryBus } from '~/domain/interfaces'
import { IFile } from '~/domain/models'
import { YandexDiskResourceLinkQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'

export default class File extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Prop() itemKey: string
  @Prop() itemFile: IFile

  @Getter('getDownloadsTargetPath') targetPath: string

  downloading = false

  get stamp() {
    return this.itemKey
  }

  get fileName() {
    return this.itemFile.name
  }

  get type() {
    return this.itemFile.type
  }

  async downloadFile() {
    try {
      this.downloading = true
      const link: string = await this.queryBus.exec(new YandexDiskResourceLinkQuery(this.fileName))
      this.downloading = false
      if(link) {
        const a = document.createElement('a')
        a.href = link
        a.download = 'C:\\' + this.fileName
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
          window.URL.revokeObjectURL(link)
        }, 0)
      }
    } catch(e) {
      //
    } finally {
      this.downloading = false
    }
  }
}
