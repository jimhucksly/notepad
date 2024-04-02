import { Prop, Vue } from 'vue-property-decorator'
import { EditorView } from '@codemirror/view'
import { checkLinks, htmlToText } from '~/helpers'
import { IProject } from '../models'

export default class CreateEditProject extends Vue {
  @Prop() item: IProject

  text = ''
  editor: EditorView = null
  onKeydownHander: (e: KeyboardEvent) => void

  created() {
    this.$emit('popup-component-created', this)
  }

  mounted() {
    this.onKeydownHander = this.onKeydown.bind(this)
    document.addEventListener('keydown', this.onKeydownHander)
    const textarea: HTMLTextAreaElement = document.querySelector('#editor')
    const editor = new EditorView({ doc: textarea.value })
    textarea.parentNode.insertBefore(editor.dom, textarea)
    textarea.style.display = 'none'
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: htmlToText(this.item.message) }
    })
    setTimeout(() => {
      // editor.refresh()
      this.editor = editor
    }, 100)
  }

  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeydownHander)
  }

  onKeydown(e: KeyboardEvent) {
    if (
      (e.code === 'Enter' ||
      e.key === 'Enter' ||
      e.code === 'KeyS' ||
      e.key === 's' ||
      e.key === 'ы') &&
      e.ctrlKey
    ) {
      e.preventDefault()
      this.save()
    }
  }

  save() {
    const value = this.editor.state.doc.toString()
    if (value === this.item.message) {
      this.$emit('cancel')
      return
    }
    this.$emit('set-result', value ? checkLinks(value) : ' ')
  }
}
