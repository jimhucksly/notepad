import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter } from 'vuex-class';
import { FsmStates } from '~/application/app';
import Files from './files';
import { ITreeItem } from './models';
import Tree from './tree';

@Options({
  components: {
    Tree,
    Files,
  },
})
export default class Library extends Vue {
  @Getter('getHistory') history: Array<keyof typeof FsmStates>;
  @Getter('Library/getLibraryTree') items: Array<ITreeItem>;

  tree: Array<ITreeItem> = [];

  isFilesExpanded = false;

  @Watch('items') onItemsChanged() {
    if (this.items && this.items.length) {
      this.tree = this.items;
    } else {
      this.tree = [];
    }
  }

  toggleFiles() {
    this.isFilesExpanded = !this.isFilesExpanded;
  }
}
