import { Vue, Component } from 'vue-property-decorator'
import { debounce } from 'lodash'

const editor = require('vue2-ace-editor')
require('brace/mode/javascript')
require('brace/theme/twilight')

const JSONFormatter = require('json-formatter-js')
const fs = require('fs')

@Component({
  name: 'JsonViewer',
  components: {
    editor
  }
})
export default class JsonViewer extends Vue {
  editor: any = null
  content: string = ''

  protected editorInit(instance: any) {
    const res: HTMLElement | null = document.querySelector('.json_viewer_res')

    const debounced = debounce((): void | null => {
      const value = instance.getValue()
      if(!value.length) {
        if(res) {
          res.innerHTML = ''
        }
        return null
      }
      let json: any = {}
      try {
        json = JSON.parse(value)
      } catch(e) {
        this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed')
        if(res) {
          res.innerHTML = ''
        }
      }
      const formatter = new JSONFormatter(json)
      if(res) {
        res.innerHTML = ''
        res.appendChild(formatter.render())
      }
      formatter.openAtDepth(1)

      const notice: HTMLElement | null = document.querySelector('.json_viewer_notice')
      if(notice) {
        notice.style.display = 'flex'
        setTimeout(() => {
          notice.style.display = 'none'
        }, 3000)
      }
    }, 3000)

    instance.on('change', debounced)
    this.editor = instance
  }

  mounted() {
    this.$electron.ipcRenderer.on('json-viewer-src-set', (e: any, value: any) => {
      let json: any = {}
      try {
        json = JSON.parse(value)
        this.editor.setValue(JSON.stringify(json, null, 2))
      } catch(e) {
        this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed')
      }
    })
    this.$electron.ipcRenderer.on('json-viewer-save', (a: any, fileName: string) => {
      fs.writeFileSync(fileName, this.editor.getValue(), 'utf-8')
    })
  }

  render(h: any) {
    return h(
      'div',
      {
        staticClass: 'json_viewer'
      },
      [
        h(
          'div',
          {
            staticClass: 'json_viewer_src'
          },
          [
            h(
              'editor',
              {
                domProps: {
                  value: this.content
                },
                props: {
                  lang: 'javascript',
                  theme: 'twilight',
                  width: '100%',
                  height: '100%'
                },
                on: {
                  init: (event: any) => { this.editorInit(event) },
                  input: (event: any) => {
                    this.$emit('input', event.target.value)
                  }
                }
              }
            )
          ]
        ),
        h(
          'div',
          {
            staticClass: 'json_viewer_res'
          }
        ),
        h(
          'div',
          {
            staticClass: 'json_viewer_notice'
          },
          'Json parse successed!'
        )
      ]
    )
  }
}
