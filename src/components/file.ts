import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { _container } from '~/domain/container'
import { IQueryBus } from '~/domain/interfaces'
import { IFile } from '~/domain/models'
import { YandexDiskResourceLinkQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'

@Component({
  name: 'File'
})
export default class File extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)


  @Prop() readonly itemKey: string
  @Prop() readonly itemFile: IFile

  @Getter('getDownloadsTargetPath') targetPath: string

  get stamp() {
    return this.itemKey
  }
  get fileName() {
    return this.itemFile.name
  }
  get type() {
    return this.itemFile.type
  }

  async openFile() {
    //
  }

  async downloadFile() {
    try {
      const link = await this.queryBus.exec(new YandexDiskResourceLinkQuery(this.fileName))
      if(link) {
        // this.$electron.shell.openExternal(link)
        this.$electron.ipcRenderer.send('download-button', {
          url: link,
          targetPath: this.targetPath
        })
      }
    } catch(e) {
      //
    }
  }
}
