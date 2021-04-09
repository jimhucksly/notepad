import { CreateElement, VNode } from 'vue'
import { Component, Vue } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import SidebarTree from '~/components/sidebarTree'
import { ITreeItem } from '~/domain/models'

@Component({
  name: 'Library',
  components: {
    SidebarTree
  }
})
export default class Library extends Vue {
  @Getter('getLibraryTree') mdTree: Array<ITreeItem>

  isFilesInit = false

  toggleFiles() {
    this.isFilesInit = !this.isFilesInit
    this.$emit('on-files', this.isFilesInit)
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
}
