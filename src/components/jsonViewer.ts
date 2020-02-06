import { Vue, Component } from 'vue-property-decorator'

const editor = require('vue2-ace-editor')
require('brace/mode/javascript')
require('brace/theme/twilight')

@Component({
  name: 'JsonViewer',
  components: {
    editor
  }
})
export default class JsonViewer extends Vue {
  content: string = ''

  options: any = {
    autoScrollEditorIntoView: true,
    copyWithEmptySelection: true
  }

  protected editorInit() {

  }
}
