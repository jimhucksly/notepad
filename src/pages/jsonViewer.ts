import { Vue, Component } from 'vue-property-decorator'
import { debounce } from 'lodash'
import { CreateElement, VNode } from 'vue'
import { IEditor } from '~/domain/models'
import { Hub } from '~/plugins/hub'

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
  editor: IEditor = null
  content = ''

  onJsonHandler: (value: string) => void
  onJsonSaveHandler: (fileName: string) => void
  onJsonClearHandler: () => void

  editorInit(instance: IEditor) {
    const res: HTMLElement | null = document.querySelector('.json_viewer_res')

    const debounced = debounce(() => {
      const value = instance.getValue()
      if(!value.length) {
        if(res) {
          res.innerHTML = ''
        }
        return
      }
      let json: Record<string, unknown> = null
      try {
        json = JSON.parse(value)
        if(window.localStorage) {
          localStorage.setItem('json_viewer', JSON.stringify(json))
        }
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
      this.notice('Json parse successed!')
    }, 3000)

    instance.on('change', debounced)
    this.editor = instance
  }

  drag(event?: MouseEvent): void {
    const src: HTMLElement | null = document.querySelector('.json_viewer_src')
    const res: HTMLElement | null = document.querySelector('.json_viewer_res')
    const container = document.querySelector('.json_viewer_cont')

    if(event.button !== 0) {
      return
    }
    const startX = event.screenX
    const minW = 17

    if(container && src && res) {
      const srcW = src.clientWidth
      const resW = res.clientWidth
      const contW = container.clientWidth
      document.onmousemove = (e: MouseEvent) => {
        if(e.screenX < startX) {
          const w: number = srcW - (startX - e.screenX)
          const p: number = w * 100 / contW
          if(p > minW) {
            src.style.maxWidth = p + '%'
            src.style.minWidth = p + '%'
            res.style.maxWidth = 100 - p + '%'
            res.style.minWidth = 100 - p + '%'
          }
        }
        if(e.screenX > startX) {
          const w: number = resW - (e.screenX - startX)
          const p = w * 100 / contW
          if(p > minW) {
            res.style.maxWidth = p + '%'
            res.style.minWidth = p + '%'
            src.style.maxWidth = 100 - p + '%'
            src.style.minWidth = 100 - p + '%'
          }
        }

        src.classList.add('non-selectable')
        res.classList.add('non-selectable')
      }

      document.onmouseup = () => {
        document.onmousemove = null
        document.onmouseup = null
        src.classList.remove('non-selectable')
        res.classList.remove('non-selectable')
      }
    }
  }

  notice(text: string) {
    const notice: HTMLElement = document.querySelector('.json_viewer_notice')
    if(notice) {
      notice.innerText = text
      notice.style.display = 'flex'
      setTimeout(() => {
        notice.style.display = 'none'
      }, 3000)
    }
  }

  onJson(value: string) {
    let json: Record<string, unknown> = null
    try {
      json = JSON.parse(value)
      this.editor.setValue(JSON.stringify(json, null, 2))
    } catch(e) {
      this.$electron.ipcRenderer.send('open-error-dialog', 'json parse failed')
    }
  }

  onJsonSave(fileName: string) {
    fs.writeFileSync(fileName, this.editor.getValue(), 'utf-8')
    this.notice('Json saved succesfully!')
  }

  onJsonClear() {
    this.editor.setValue('')
    const res: HTMLElement = document.querySelector('.json_viewer_res')
    if(res) {
      res.innerHTML = ''
    }
    if(window.localStorage) {
      localStorage.removeItem('json_viewer')
    }
  }

  mounted() {
    this.onJsonHandler = this.onJson.bind(this)
    Hub.$on('json-viewer-set', this.onJsonHandler)
    this.onJsonSaveHandler = this.onJsonSave.bind(this)
    Hub.$on('json-viewer-save', this.onJsonSaveHandler)
    this.onJsonClearHandler = this.onJsonClear.bind(this)
    Hub.$on('json-viewer-clear', this.onJsonClearHandler)
    if(window.localStorage) {
      const value = localStorage.getItem('json_viewer')
      let json: Record<string, unknown> = null
      if(value) {
        try {
          json = JSON.parse(value)
          this.editor.setValue(JSON.stringify(json, null, 2))
        } catch(e) {
          console.log(e)
        }
      }
    }
  }

  beforeDestroy() {
    Hub.$off('json-viewer-src-set', this.onJsonHandler)
    Hub.$off('json-viewer-save', this.onJsonSaveHandler)
    Hub.$off('json-viewer-clear', this.onJsonClearHandler)
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'json_viewer json_viewer_cont'
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
                  init: (instance: IEditor) => {
                    this.editorInit(instance)
                  },
                  input: (value: string) => {
                    this.$emit('input', value)
                  }
                }
              }
            ),
            h(
              'div',
              {
                staticClass: 'json_viewer_separator',
                on: {
                  mousedown: (event: MouseEvent) => {
                    this.drag(event)
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
          }
        )
      ]
    )
  }
}
