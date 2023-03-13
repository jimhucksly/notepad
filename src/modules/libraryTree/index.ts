import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import { ITreeItem } from '~/domain/models'
import { Hub } from '~/plugins/hub'

@Options({
  name: 'LibraryTree'
})
export default class LibraryTreeComponent extends Vue {
  @Prop() tree: Array<ITreeItem>
  @Prop({ default: 1 }) level: number

  selectNode(item: ITreeItem) {
    Hub.$emit('codemirror-link-click', item.name)
    const editor = document.querySelector('.editor_content')
    if (editor) {
      const elem: HTMLAnchorElement | null = editor.querySelector('#' + item.slug)
      const rect = elem.getBoundingClientRect()
      editor.scrollTo(0, editor.scrollTop + rect.top - 54 - 30)
      if (item.children && item.children.length) {
        const node = this.$el.querySelector(`[data-ref="${item.id}"]`)
        if (node) {
          const ul = node.nextElementSibling
          if (ul) {
            const isExpanded = node.classList.contains('expanded')
            node.classList[isExpanded ? 'remove' : 'add']('expanded')
            node.classList[isExpanded ? 'remove' : 'add']('tree_item_minus')
            node.classList[isExpanded ? 'add' : 'remove']('tree_item_plus')
            this[isExpanded ? '$slideUp' : '$slideDown'](ul, 200)
          }
        }
      }
    }
  }
}
