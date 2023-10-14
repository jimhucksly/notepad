import { Options, Vue } from 'vue-class-component'
import { Getter } from 'vuex-class'
import { FsmStates } from '~/application/app'
import { ITreeItem } from '~/domain/models'
import LibraryFiles from '~/components/libraryFiles'
import { Watch } from 'vue-property-decorator'

@Options({
  components: {
    LibraryFiles
  },
  template: `
    <div class="markdown">
      <div class="library_inner">
        <library-tree v-if="tree" :tree="tree" :level="1" />
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
  @Getter('getHistory') history: Array<keyof typeof FsmStates>
  @Getter('library/getLibraryTree') items: Array<ITreeItem>

  tree: Array<ITreeItem> = []

  @Watch('items') onItemsChanged() {
    if (this.items && this.items.length) {
      this.tree = this.items
    } else {
      this.tree = []
    }
  }

  toggleFiles() {
    if (this.isFilesInit) {
      this.$app.goBack()
    } else {
      this.$app.goto(this.$app.states.LibraryFiles)
    }
  }

  get isFilesInit() {
    return this.history.includes('LibraryFiles')
  }
}
