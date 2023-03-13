import { Options, Prop, Vue } from 'vue-property-decorator'
import { IEditor, IProject } from '~/domain/models'
import { checkLinks, htmlToText } from '~/helpers'
import Editor from '~/lib/vue-ace-editor'

@Options({
  components: {
    Editor
  }
})
export default class CreateEditProject extends Vue {
  @Prop() item: IProject

  text = ''
  editor: IEditor = null
  onKeydownHander: (e: KeyboardEvent) => void

  created() {
    this.$emit('popup-component-created', this)
  }

  mounted() {
    this.onKeydownHander = this.onKeydown.bind(this)
    document.addEventListener('keydown', this.onKeydownHander)
  }

  beforeUnmount() {
    this.editor.destroy()
    this.editor.container.remove()
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

  editorInit(instance: IEditor) {
    this.editor = instance
    this.editor.setValue(htmlToText(this.item.message))
    this.editor.setShowPrintMargin(false)
    this.editor.getSession().selection.clearSelection()
  }

  save() {
    const value = this.editor.getValue()
    this.$emit('set-result', value ? checkLinks(value) : ' ')
  }
}
