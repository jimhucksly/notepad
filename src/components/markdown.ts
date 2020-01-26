import { Vue, Component, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit, uniqueid } from '~/helpers'

interface ITree {
  children: ITree[]
  name: string
  slug: string
  id: string
}

Object.defineProperty(SimpleMDE.prototype, 'togglePreviewHandler', {
  value: function(cb: Function) {
    this.togglePreview()
    setTimeout(() => {
      if(cb instanceof Function) {
        cb(this.isPreviewActive())
      }
    }, 2)
  }
})

Object.defineProperty(SimpleMDE.prototype, 'saveContent', {
  value: function() {
    this.saveContentHandler()
  }
})

// let autosaveTimeout = null

let nodes: ITree[] = []

const md = new MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight(str: string, lang: string) { return '' }
})

md.use(MarkdownItAnchor, {
  slugify: (s: string) => {
    const slug = translit(s)
    nodes.push({
      name: s || '',
      slug: slug || '',
      id: uniqueid(8),
      children: []
    })
    return slug
  },
  level: [1, 2, 3],
  permalink: true,
  permalinkClass: 'md-anchor',
  permalinkBefore: false
})

const config: any = {
  autofocus: true,
  toolbar: [
    'bold', 'italic', 'heading', '|',
    'heading-1', 'heading-2', 'heading-3', '|',
    'unordered-list', 'ordered-list', '|',
    'code', 'link', '|',
    'preview', '|',
    {
      action: function() {},
      className: 'fa fa-save no-disable',
      default: true,
      name: 'save',
      title: 'Save'
    }
  ],
  autosave: {
    enabled: true,
    uniqueId: 'MyUniqueID',
    delay: 1000
  },
  // blockStyles: {
  //   bold: '__',
  //   italic: '_'
  // },
  // forceSync: true,
  // hideIcons: ['guide', 'heading'],
  // indentWithTabs: false,
  // initialValue: '',
  // insertTexts: {
  //   horizontalRule: ['', '\n\n-----\n\n'],
  //   image: ['![](http://', ')'],
  //   link: ['[', '](http://)'],
  //   table: [
  //     '',
  //     '\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text      | Text     |\n\n'
  //   ]
  // },
  // lineWrapping: false,
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
    strikethrough: false,
    underscoresBreakWords: true
  },
  // placeholder: 'Type here...',
  previewRender(plainText: string) {
    nodes = []
    return md.render(plainText)
  },
  // previewRender: function(plainText, preview) {
  //   setTimeout(function(){
  //     preview.innerHTML = customMarkdownParser(plainText)
  //   }, 250)

  //   return 'Loading...'
  // },
  // promptURLs: true,
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: false
  },
  // shortcuts: {
  //   drawTable: 'Cmd-Alt-T'
  // },
  // showIcons: ['code', 'table'],
  // spellChecker: false,
  // status: false,
  // status: ['autosave', 'lines', 'words', 'cursor'],
  status: [
    {
      className: 'saved-status'
    },
    'autosave', 'lines', 'words', 'cursor'
  ],
  // styleSelectedText: false,
  tabSize: 4
  // toolbar: true,
  // toolbarTips: true
}

@Component({
  name: 'Markdown',
})

export default class Markdown extends Vue {
  [x: string]: any
  editor: any = null
  isRendered: boolean = false

  get initialValue() {
    return this.$store.getters['getMd']
  }

  @Watch('initialValue')
  onInitialValueCahnged() {
    this.editor.value()
    this.editor.togglePreviewHandler()
    this.editor.togglePreviewHandler()
    this.buildTree()
  }

  protected buildTree() {
    const tree: ITree[] = []
    let index = -1
    nodes.forEach(item => {
      const node = document.getElementById(item.slug)
      if(node) {
        const level = +node.tagName.slice(-1)
        switch(level) {
          case 1:
            tree.push(item)
            index++
            break
          case 2:
            tree[index].children.push(item)
            break
          case 3:
            const lastIndex = tree[index].children.length - 1
            tree[index].children[lastIndex].children.push(item)
        }
      }
    })
    this.$store.dispatch('mdTree', Object.assign([], cloneDeep(tree)))
  }

  mounted() {
    const editor = document.getElementById('editor')
    if(editor) {
      const editorElement = document.getElementById('editor')
      const conf: any = {
        ...config
      }
      if(editorElement) conf.element = editorElement
      this.editor = new SimpleMDE(conf)
      this.editor.value(this.initialValue)
      this.editor.togglePreviewHandler()
      const toolbarItemPreview = this.editor.toolbar.find((item: any) => item.name === 'preview')
      if(toolbarItemPreview) {
        toolbarItemPreview.action = () => {
          this.editor.togglePreviewHandler((isActive: boolean) => { isActive && this.buildTree() })
        }
      }
      const toolbarItemSave = this.editor.toolbar.find((item: any) => item.name === 'save')
      if(toolbarItemSave) {
        toolbarItemSave.action = () => {
          const sRequest = this.$store.dispatch('action', {
            type: 'SAVE',
            data: this.editor.value()
          })
          Promise
            .all([sRequest])
            .then(data => {
              const statusBar = document.querySelector('.editor-statusbar')
              if(statusBar) {
                const savedSatus = statusBar.querySelector('.saved-status')
                const message = 'Markdown is successfully saved!'
                savedSatus && (savedSatus.innerHTML = message)

                setTimeout(() => {
                  savedSatus && (savedSatus.innerHTML = '')
                }, 3000)
              }
            })
        }
      }
      this.isRendered = true
      this.buildTree()
      // autosaveTimeout = null
      // this.editor.codemirror.on('change', () => {
      //   clearTimeout(autosaveTimeout)
      //   autosaveTimeout = setTimeout(() => {
      //     this.$store.dispatch('md', this.editor.value())
      //   }, 1000)
      // })
    }
  }
  beforeDestroy() {
    this.$store.dispatch('mdTree', [])
    this.$store.dispatch('action', {
      type: 'SAVE',
      data: this.editor.value()
    })
  }
  created() {
    this.$store.dispatch('action', {
      type: 'GET_MD'
    })
  }
}