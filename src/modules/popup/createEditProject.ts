import { Options, Prop, Vue } from 'vue-property-decorator'
import { IProject } from '~/domain/models'
import Editor from '~/lib/vue-ace-editor'
import CodeMirror, { EditorFromTextArea } from 'codemirror'
import { checkLinks, htmlToText } from '~/helpers'

@Options({
  components: {
    Editor
  }
})
export default class CreateEditProject extends Vue {
  @Prop() item: IProject

  text = ''
  editor: EditorFromTextArea = null
  onKeydownHander: (e: KeyboardEvent) => void

  created() {
    this.$emit('popup-component-created', this)
  }

  mounted() {
    this.onKeydownHander = this.onKeydown.bind(this)
    document.addEventListener('keydown', this.onKeydownHander)
    const textarea: HTMLTextAreaElement = document.querySelector('#editor')
    const editor = CodeMirror.fromTextArea(textarea, {
      mode: 'text/plain'
    })
    const doc = editor.getDoc()
    doc.setValue(htmlToText(this.item.message))
    setTimeout(() => {
      editor.refresh()
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
    const doc = this.editor.getDoc()
    const value = doc.getValue()
    if (value === this.item.message) {
      this.$emit('cancel')
      return
    }
    this.$emit('set-result', value ? checkLinks(value) : ' ')
  }
}
