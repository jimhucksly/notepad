import debounce from 'lodash/debounce'
import { Options, Vue } from 'vue-class-component'
import { Types, Libs } from '~/core'
import { EditorView } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { json } from '@codemirror/lang-json'

require('brace/mode/javascript')
require('brace/theme/chrome')

@Options({
  components: {
    'editor': Libs.Editor
  }
})
export default class PostmanPage extends Vue {
  url = ''
  method: 'GET' | 'POST' = 'GET'
  tab: 'HEADERS' | 'BODY' = 'HEADERS'

  headers: Array<{ key: string, value: string }> = [
    {
      key: '',
      value: ''
    }
  ]

  body = ''
  editor: Types.IEditor = null
  response: EditorView = null

  fetching = false

  debounced: () => void = null

  static readonly URL = ['http://127.0.0.1', Number($PORT) + 1].join(':') + '/postman'

  send() {
    if (this.response) {
      this.response.destroy()
    }
    const payload = {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body
    }
    try {
      this.fetching = true
      const xhr = new XMLHttpRequest()
      xhr.open('POST', PostmanPage.URL, true)
      xhr.setRequestHeader('Content-Type', 'application/json')
      xhr.send(JSON.stringify(payload))
      const responseHandler = (value: string | Error) => {
        if (value instanceof Error) {
          this.$toasted.error(value.message)
          this.fetching = false
          return
        }
        const textarea: HTMLTextAreaElement = document.querySelector('#response')
        const language = new Compartment()
        const state = EditorState.create({
          extensions: [
            language.of(json()),
            EditorState.readOnly.of(true)
          ]
        })
        const editor = new EditorView({ state, doc: textarea.value })
        textarea.parentNode.insertBefore(editor.dom, textarea)
        textarea.style.display = 'none'
        editor.dispatch({
          changes: { from: 0, to: editor.state.doc.length, insert: JSON.stringify(JSON.parse(value), null, 2) }
        })
        this.response = editor
        this.fetching = false
      }
      xhr.onreadystatechange = function() {
        try {
          if (xhr.readyState !== 4) return
          if (xhr.status === 200) {
            responseHandler(xhr.responseText)
            return
          }
          responseHandler(new Error(xhr.statusText))
        } catch (err) {
          //
        }
      }
    } catch (e) {
      this.fetching = false
    }
  }

  onAddHeader() {
    this.headers.push({
      key: '',
      value: ''
    })
  }

  onRemoveHeader(index: number) {
    this.headers.splice(index, 1)
  }

  onEditorInit(instance: Types.IEditor) {
    let isEditorReady = false
    this.debounced = debounce(() => {
      if (isEditorReady) {
        return
      }
      const value = instance.getValue()
      try {
        this.body = JSON.stringify(JSON.parse(value), null, 2)
        instance.setValue(this.body)
        isEditorReady = true
      } catch (e) {
        //
      }
    }, 100)
    instance.on('change', this.debounced)
    this.editor = instance
    if (this.body) {
      this.editor.setValue(this.body)
    }
  }

  get headerTab() {
    return 'HEADERS'
  }

  get bodyTab() {
    return 'BODY'
  }
}
