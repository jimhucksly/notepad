import { Options, Vue } from 'vue-class-component'
import { IEditor } from '~/domain/models'
import { isJSON } from '~/helpers'
import Editor from '~/lib/vue-ace-editor'

@Options({
  components: {
    Editor
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
  editor: IEditor = null

  response = ''

  static readonly URL = ['http://localhost', Number($PORT) + 1].join(':') + '/postman'

  send() {
    const xhr = new XMLHttpRequest()
    xhr.open(this.method, PostmanPage.URL, true)
    for (const item of this.headers) {
      if (item.key?.trim() && item.value?.trim()) {
        xhr.setRequestHeader(item.key, item.value)
      }
    }
    if (this.method === 'GET') {
      xhr.send()
    }
    if (this.method === 'POST') {
      const value = this.editor.getValue()
      if (isJSON(value)) {
        xhr.send(value)
      }
    }
    const responseHandler = (value: string) => {
      this.response = value
    }
    xhr.onreadystatechange = function() {
      if (xhr.readyState !== 4) return
      if (xhr.status !== 200) {
        // alert(xhr.status + ': ' + xhr.statusText)
      } else {
        responseHandler(xhr.responseText)
      }
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

  onEditorInit(instance: IEditor) {
    this.editor = instance
  }

  get headerTab() {
    return 'HEADERS'
  }

  get bodyTab() {
    return 'BODY'
  }
}
