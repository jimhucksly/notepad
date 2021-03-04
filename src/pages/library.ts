import { Vue, Component, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit, uniqueid } from '~/helpers'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { UpdateLibraryCommand } from '~/domain/commands'
import { LibraryQuery } from '~/domain/queries'
import { CreateElement, VNode } from 'vue'
import { Mutation } from 'vuex-class'

interface ITree {
  children: ITree[]
  name: string
  slug: string
  id: string
}

interface ILinkedDoc {
  lines: Array<{ text: string }>
  children: Array<ILinkedDoc>
}

interface IToolbarItem {
  name: string
  action: () => void
}

interface SimpleMDEExt extends SimpleMDE {
  togglePreviewHandler?: (callback?: (isActive: boolean) => void) => void
  toolbar?: IToolbarItem[]
}

Object.defineProperty(SimpleMDE.prototype, 'togglePreviewHandler', {
  value(cb: (arg: boolean) => void) {
    this.togglePreview()
    setTimeout(() => {
      if(cb instanceof Function) {
        cb(this.isPreviewActive())
      }
    }, 2)
  }
})

// Object.defineProperty(SimpleMDE.prototype, 'saveContent', {
//   value() {
//     this.saveContentHandler()
//   }
// })

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
  highlight(str: string, lang: string) {
    return ''
  }
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

const config = {
  autofocus: true,
  toolbar: [
    'bold', 'italic', 'heading', '|',
    'heading-1', 'heading-2', 'heading-3', '|',
    'unordered-list', 'ordered-list', '|',
    'code', 'link', '|',
    'preview', '|',
    {
      action: () => false,
      className: 'fa fa-save no-disable',
      default: true,
      name: 'save',
      title: 'Save'
    }
  ],
  autosave: {
    enabled: false,
    uniqueId: 'MyUniqueID',
    delay: 1000
  },
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
    strikethrough: false,
    underscoresBreakWords: true
  },
  previewRender(plainText: string) {
    nodes = []
    return md.render(plainText)
  },
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: false
  },
  status: [
    {
      className: 'saved-status'
    },
    'autosave', 'lines', 'words', 'cursor'
  ],
  tabSize: 4
}

@Component({
  name: 'Library'
})
export default class Library extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setMdTree') setMdTree: (value: Array<ITree>) => void

  editor: SimpleMDEExt = null
  isRendered = false
  links: string[] = []

  get initialValue() {
    return this.$store.getters.getLibraryData
  }

  @Watch('initialValue')
  onInitialValueCahnged() {
    this.editor.togglePreviewHandler()
    this.buildTree()
  }

  buildTree() {
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
    this.setMdTree([...cloneDeep(tree)])
  }

  mounted() {
    const editor = document.getElementById('editor')
    if(editor) {
      const editorElement = document.getElementById('editor')
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      const conf: any = {
        ...config
      }
      if(editorElement) {
        conf.element = editorElement
      }
      this.editor = new SimpleMDE(conf)
      this.editor.value(this.initialValue)
      this.editor.togglePreviewHandler()
      const toolbarItemPreview = this.editor.toolbar.find(item => item.name === 'preview')
      if(toolbarItemPreview) {
        toolbarItemPreview.action = () => {
          this.editor.togglePreviewHandler((isActive: boolean) => {
            isActive && this.buildTree()
          })
        }
      }
      const toolbarItemSave = this.editor.toolbar.find(item => item.name === 'save')
      if(toolbarItemSave) {
        toolbarItemSave.action = () => {
          const sRequest = this.commandBus.do<UpdateLibraryCommand, void>(
            new UpdateLibraryCommand(this.editor.value())
          )
          Promise
            .all([sRequest])
            .then(() => {
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
            .catch(e => {
              console.log(e)
            })
        }
      }
      this.buildTree()
      this.isRendered = true
      const doc = this.editor.codemirror.getDoc()
      const count = doc.lineCount()
      const linkedDoc: ILinkedDoc = doc.linkedDoc({
        from: 0,
        to: count
      })

      const result: string[] = []

      const linked = (o: ILinkedDoc) => {
        if(o.children) {
          o.children.forEach(item => {
            if(item.lines) {
              item.lines.forEach(line => {
                result.push(line.text)
              })
            }
            if(item.children) {
              linked(item)
            }
          })
        }
      }
      linked(linkedDoc)
      this.links = result

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      this.$electron.ipcRenderer.on('codemirror-link-click', (event: any, text: string) => {
        let scrolling = false
        this.links.forEach((link: string, index: number): void | null => {
          if(scrolling) return null
          if(link.indexOf(text) > -1) {
            scrolling = true
            this.editor.codemirror.scrollIntoView({ line: index, char: 0 }, 200)
            if(index > 0) {
              const scrollInfo = this.editor.codemirror.getScrollInfo()
              this.editor.codemirror.scrollTo(0, scrollInfo.top + scrollInfo.clientHeight / 2)
            }
          }
        })
      })
    }
  }

  beforeDestroy() {
    this.setMdTree([])
    this.commandBus.do<UpdateLibraryCommand, void>(new UpdateLibraryCommand(this.editor.value()))
  }

  created() {
    this.queryBus.exec<LibraryQuery, string>(new LibraryQuery())
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'editor_wrapper',
        style: {
          display: this.isRendered ? 'flex' : 'none'
        }
      },
      [
        h(
          'textarea',
          {
            attrs: {
              name: 'editor',
              id: 'editor'
            }
          }
        )
      ]
    )
  }
}
