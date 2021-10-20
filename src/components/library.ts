import { Options, Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
import { ITreeItem } from '~/domain/models'
import LibraryFiles from '~/components/libraryFiles'

@Options({
  components: {
    LibraryFiles
  },
  template: `
    <div class="markdown">
      <div class="library_inner">
        <library-tree />
      </div>
      <div
        class="library_files_btn"
        :class="{
          active: isFilesInit
        }"
        @click="toggleFiles"
      >
        <library-files />
      </div>
    </div>
  `
})
export default class Library extends Vue {
  @Getter('getHistory') history: Array<keyof IFsmStates>
  @Getter('library/getLibraryTree') mdTree: Array<ITreeItem>

  toggleFiles() {
    if(this.isFilesInit) {
      this.$app.goBack()
    } else {
      this.$app.goto(FsmStates.LibraryFiles)
    }
  }

  get isFilesInit() {
    return this.history.includes('LibraryFiles')
  }
}
