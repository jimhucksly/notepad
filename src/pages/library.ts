import { Vue, Component, Watch } from 'vue-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit, uniqueid } from '~/helpers'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { UpdateLibraryCommand } from '~/domain/commands'
import { LibraryFileQuery, LibraryFilesQuery } from '~/domain/queries'
import { CreateElement, VNode } from 'vue'
import { Getter, Mutation } from 'vuex-class'
import { ILibraryFile, ITreeItem } from '~/domain/models'
import { Hub } from '~/plugins/hub'

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
    LibraryPage.nodes = []
    return LibraryPage.md.render(plainText)
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
export default class LibraryPage extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  @Mutation('setLibraryTree') setLibraryTree: (value: Array<ITreeItem>) => void
  @Mutation('setLibraryData') setLibraryData: (body: string) => void
  @Mutation('setLibraryFileId') setFileId: (id: string | number) => void

  @Getter('getLibraryData') initialValue: string
  @Getter('getLibraryFileId') currentId: string
  @Getter('getNewLibraryFile') newLibraryFile: ILibraryFile

  editor: SimpleMDEExt = null
  isRendered = false
  links: string[] = []
  isNewFile = false

  static nodes: ITreeItem[] = []
  static md: MarkdownIt = null

  linkClickHandler: (event: Electron.IpcRendererEvent, name: string) => void

  @Watch('currentId') async onCurrentIdChanged(id: string | number) {
    try {
      await this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery(id))
    } catch(e) {
      console.log(e)
    }
  }

  @Watch('initialValue') onInitialValueCahnged(value: string) {
    let editorElement = document.getElementById('editor')
    if(!editorElement) {
      return
    }
    const parent = editorElement.parentElement
    parent.innerHTML = ''
    const textarea = document.createElement('textarea')
    textarea.name = 'editor'
    textarea.id = 'editor'
    parent.appendChild(textarea)
    editorElement = document.getElementById('editor')
    this.buildEditor(editorElement, value)
  }

  buildEditor(element: HTMLElement, value: string) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    const conf: any = {
      ...config
    }
    if(element) {
      conf.element = element
    }

    this.editor = new SimpleMDE(conf)
    this.editor.value(value)
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
      toolbarItemSave.action = this.save.bind(this)
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
    this.linkClickHandler = (event: Electron.IpcRendererEvent, name: string) => {
      let scrolling = false
      this.links.forEach((link: string, index: number): void | null => {
        if(scrolling) return null
        if(link.indexOf(name) > -1) {
          scrolling = true
          this.editor.codemirror.scrollIntoView({ line: index, char: 0 }, 200)
          if(index > 0) {
            const scrollInfo = this.editor.codemirror.getScrollInfo()
            this.editor.codemirror.scrollTo(0, scrollInfo.top + scrollInfo.clientHeight / 2)
          }
        }
      })
    }
    Hub.$on('codemirror-link-click', this.linkClickHandler)
  }

  buildTree(nodes?: ITreeItem[]): Array<ITreeItem> {
    const tree: Array<ITreeItem> = []
    let index = -1
    const items = nodes || LibraryPage.nodes
    items.forEach(item => {
      const node = this.$el.querySelector('#' + item.slug)
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
    this.setLibraryTree([...cloneDeep(tree)])
    return tree
  }

  save() {
    const id = this.currentId
    const body = this.editor.value()
    const promise = this.commandBus.do<UpdateLibraryCommand, void>(
      new UpdateLibraryCommand(id, body)
    )
    Promise
      .all([promise])
      .then(() => {
        const statusBar = this.$el.querySelector('.editor-statusbar')
        if(statusBar) {
          const savedSatus = statusBar.querySelector('.saved-status')
          const message = 'Markdown is successfully saved!'
          savedSatus && (savedSatus.innerHTML = message)
          setTimeout(() => {
            savedSatus && (savedSatus.innerHTML = '')
          }, 3000)
        }
        this.setFileId(id)
      })
      .catch(e => {
        console.log(e)
      })
  }

  mounted() {
    LibraryPage.md = new MarkdownIt({
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

    LibraryPage.md.use(MarkdownItAnchor, {
      slugify: (s: string) => {
        const slug = translit(s)
        LibraryPage.nodes.push({
          name: s || '',
          slug: slug || '',
          id: uniqueid(8) as string,
          children: []
        })
        return slug
      },
      level: [1, 2, 3],
      permalink: true,
      permalinkClass: 'md-anchor',
      permalinkBefore: false
    })

    const editorElement = document.getElementById('editor')
    if(!editorElement) {
      return
    }
    this.buildEditor(editorElement, this.initialValue)
  }

  beforeDestroy() {
    this.setLibraryTree([])
    const id = this.currentId
    const value = this.editor.value()
    this.commandBus.do<UpdateLibraryCommand, void>(new UpdateLibraryCommand(id, value))
    this.setFileId(0)
    Hub.$off('codemirror-link-click', this.linkClickHandler)
  }

  created() {
    this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
    this.queryBus.exec<LibraryFilesQuery, Array<ILibraryFile>>(new LibraryFilesQuery())
  }

  render(h: CreateElement): VNode {
    return h(
      'div',
      {
        staticClass: 'editor_wrapper',
        ref: 'editor_wrapper',
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
