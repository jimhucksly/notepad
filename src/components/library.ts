import { CreateElement, VNode } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import FsmStates, { IFsmStates } from '~/application/fsm.states'
import { ITreeItem } from '~/domain/models'

@Component({
  name: 'Library'
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
              'library-tree',
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
