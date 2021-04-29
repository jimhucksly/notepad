import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { _container } from '~/domain/container'
import { IQueryBus } from '~/domain/interfaces'
import { ILibraryFiles } from '~/domain/models'
import { LibraryFileQuery } from '~/domain/queries'
import { TYPES } from '~/domain/types'

@Component({
  name: 'LibraryFiles'
})
export default class LibraryFiles extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)

  @Prop({ type: Boolean, default: false })
  init!: boolean

  @Mutation('setLibraryFile') setValue: (value: string) => void

  @Getter('getLibraryFiles') libraryFiles: ILibraryFiles

  async openFile(id: string) {
    const resp = await this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery(id))
    this.$emit('update:init', false)
    this.setValue(resp)
  }
}
