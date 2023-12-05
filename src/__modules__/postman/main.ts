import debounce from 'lodash/debounce'
import { Options, Vue } from 'vue-class-component'
import { IEditor } from '~/domain/models'
import Editor from '~/lib/vue-ace-editor'

@Options({
  components: {
    Editor
  }
})
export default class PostmanPage extends Vue {
  url = 'http://dsud-webdev-390/LanDocs.WebApi.NetCore/api/v1/client/options'
  method: 'GET' | 'POST' = 'GET'
  tab: 'HEADERS' | 'BODY' = 'HEADERS'

  headers: Array<{ key: string, value: string }> = [
    {
      key: 'Host',
      value: 'dsud-webdev-390'
    },
    {
      key: 'User-Agent',
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.2470 YaBrowser/23.11.0.2470 Yowser/2.5 Safari/537.36'
    }
  ]

  body = ''
  editor: IEditor = null

  response: unknown = ''

  debounced: () => void = null

  static readonly URL = ['http://127.0.0.1', Number($PORT) + 1].join(':') + '/postman'

  send() {
    const payload = {
      url: this.url,
      method: this.method,
      headers: this.headers,
      body: this.body
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', PostmanPage.URL, true)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.send(JSON.stringify(payload))
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
    this.debounced = debounce(() => {
      const value = instance.getValue()
      let json: Record<string, unknown> = null
      try {
        json = JSON.parse(value)
        const text = JSON.stringify(json, null, 2)
        instance.setValue(text)
      } catch (e) {
        //
      }
    }, 1000)
    instance.on('change', this.debounced)
    this.editor = instance
  }

  get headerTab() {
    return 'HEADERS'
  }

  get bodyTab() {
    return 'BODY'
  }
}
