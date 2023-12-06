import debounce from 'lodash/debounce'
import { Options, Vue } from 'vue-class-component'
import { IEditor } from '~/domain/models'
import Editor from '~/lib/vue-ace-editor'
import { EditorView } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { json } from '@codemirror/lang-json'

require('brace/mode/javascript')
require('brace/theme/chrome')

@Options({
  components: {
    Editor
  }
})
export default class PostmanPage extends Vue {
  url = 'http://dsud-webdev-390/LanDocs.WebApi.NetCore/api/v1/instructions/folder/1999/instructions'
  method: 'GET' | 'POST' = 'POST'
  tab: 'HEADERS' | 'BODY' = 'HEADERS'

  headers: Array<{ key: string, value: string }> = [
    {
      key: 'Host',
      value: 'dsud-webdev-390'
    },
    {
      key: 'User-Agent',
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.2470 YaBrowser/23.11.0.2470 Yowser/2.5 Safari/537.36'
    },
    {
      key: 'Cookie',
      value: 'retrieveRoute=/; landocs_sessionid=9a62fba3-e994-a84c-aa04-01075e3f0275; landocs_claims=CfDJ8LVLFbzRkZNOmlQVoZlx-0-i8Mk-SXrd88pYoxX7Jb-GBg8XmpHLlFzjqELqvdvAdTjEkg2sgc1Wqyhm22BKdYmdZ7e37ogfxo8TD2Y07usq3UNUiEGnJht6F0hS9Ia2mJNgwI1WlnPEMtU6tdQ_RwVObBUomILkQsq-nR8Evx9pA9KgxaLIWmc9OWQGt1r2vT7RjOf4kokNees0lYyozgvkPjE2f0DomllQkd1mYSkvOAY0r488hADewiHfYECeEDUnY-zFWbjgiEfJhhTgnAJef8Zd-KCLeRZN92VQNUTphxbpxZUl1FNsL6zs65vrSnA7ON8NquS1g1_LORxLVBSa-ITTEggUMbd1iKbAQ_nQ4541mfdZ4hLRObrQTs0CA7q52S3Vk9mqLv0jLjizb7_V7VWj2HV5k6Fzan69OXu9MYgRpswBm3lwopWERR5-fnl6_3gBZAepbwcagRw2f--lOzmn4DM6CMCaf2yB3STjhrin9KFZU6b62Pac_iYIa7FvkveqWyXB7FMS4WRkzA0B7SA4Kwz41d5RJ8rLB8yV'
    }
  ]

  body = '{"top":100,"skip":0,"searchText":null,"members":null,"filterId":null,"filterValues":null,"createDateTimeStart":null,"createDateTimeFinish":null,"forceReload":true,"permissionCheckMode":"none"}'
  editor: IEditor = null
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

  onEditorInit(instance: IEditor) {
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
