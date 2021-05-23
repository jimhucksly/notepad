import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Mutation } from 'vuex-class'
import { ILibraryFiles } from '~/domain/models'

@Component({
  name: 'LibraryFiles'
})
export default class LibraryFiles extends Vue {
  @Prop({ type: Boolean, default: false }) init: boolean

  @Mutation('setLibraryFileId') setFileId: (id: string | number) => void
  @Mutation('setIsLibraryFileAddPopupShow') popupShow: (state: boolean) => void

  @Getter('getLibraryFiles') libraryFiles: ILibraryFiles

  openFile(id: string) {
    this.setFileId(id)
    this.$emit('on-open-file')
  }

  add() {
    this.popupShow(true)
    this.$emit('on-add-file')
  }
}
