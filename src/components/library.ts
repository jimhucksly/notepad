import { CreateElement, VNode } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
import SidebarTree from '~/components/sidebarTree'
import { ITreeItem } from '~/domain/models'

@Component({
  name: 'Library',
  components: {
    SidebarTree
  }
})
export default class Library extends Vue {
  @Getter('getHistory') history: Array<keyof IFsmStates>
  @Getter('getLibraryTree') mdTree: Array<ITreeItem>

  toggleFiles() {
    if(this.isFilesInit) {
      this.$app.goBack()
    } else {
      this.$app.goto(FsmStates.LibraryFiles)
    }
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'markdown'
      },
      [
        h(
          'div',
          {
            staticClass: 'library_inner'
          },
          [
            h(
              'sidebar-tree',
              {
                props: {
                  tree: this.mdTree
                }
              },
              []
            )
          ]
        ),
        h(
          'div',
          {
            staticClass: 'library_files_btn',
            class: {
              active: this.isFilesInit
            },
            on: {
              click: () => {
                this.toggleFiles()
              }
            }
          },
          'Files'
        )
      ]
    )
  }

  get isFilesInit() {
    return this.history.includes('LibraryFiles')
  }
}
