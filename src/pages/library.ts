import { Watch } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import cloneDeep from 'lodash/cloneDeep'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit, uniqueid } from '~/helpers'
import { IQueryBus, ICommandBus } from '~/domain/interfaces'
import { TYPES } from '~/domain/types'
import { _container } from '~/domain/container'
import { UpdateLibraryCommand } from '~/domain/commands'
import { Getter, Mutation } from 'vuex-class'
import { ILibraryFile, ITreeItem } from '~/domain/models'
import { Hub } from '~/plugins/hub'
import { LibraryFileQuery, LibraryFilesQuery } from '~/domain/queries'

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

const linked = (value: ILinkedDoc): Array<string> => {
  const result: Array<string> = []
  function _linked(o: ILinkedDoc) {
    if(o.children) {
      o.children.forEach(item => {
        if(item.lines) {
          item.lines.forEach(line => {
            result.push(line.text)
          })
        }
        if(item.children) {
          _linked(item)
        }
      })
    }
  }
  _linked(value)
  return result
}

@Options({
  beforeUnmount() {
    const value = LibraryPage.editor.value()
    this.commandBus.do(new UpdateLibraryCommand(this.currentId, value))
    this.setLibraryTree([])
    this.setFileId(0)
    Hub.$off('codemirror-link-click', this.linkClickHandler)
  },
  template: `
    <div
      class="editor_wrapper"
      ref="editor_wrapper"
      :style="{
        display: isRendered || 1 ? 'flex' : 'none'
      }"
    >
      <textarea name="editor" id="editor"></textarea>
    </div>
  `
})
export default class LibraryPage extends Vue {
  private readonly queryBus: IQueryBus = _container.get<IQueryBus>(TYPES.QueryBus)
  private readonly commandBus: ICommandBus = _container.get<ICommandBus>(TYPES.CommandBus)

  static editor: SimpleMDEExt = null
  static editorValue = ''

  @Mutation('library/setLibraryTree') setLibraryTree: (value: Array<ITreeItem>) => void
  @Mutation('library/setLibraryData') setLibraryData: (body: string) => void
  @Mutation('library/setLibraryFileId') setFileId: (id: string | number) => void

  @Getter('library/getLibraryData') initialValue: string
  @Getter('library/getLibraryFileId') currentId: string

  isRendered = false
  links: string[] = []
  isNewFile = false

  static nodes: ITreeItem[] = []
  static md: MarkdownIt = null

  linkClickHandler: (name: string) => void

  @Watch('currentId') async onCurrentIdChanged(id: string | number) {
    try {
      await this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery(id))
    } catch(e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  @Watch('initialValue') onInitialValueCahnged() {
    let editorElement = document.getElementById('editor')
    if(!editorElement) {
      return
    }
    LibraryPage.editor = null
    LibraryPage.editorValue = this.initialValue
    Hub.$off('codemirror-link-click', this.linkClickHandler)
    const parent = editorElement.parentElement
    parent.innerHTML = ''
    const textarea = document.createElement('textarea')
    textarea.name = 'editor'
    textarea.id = 'editor'
    parent.appendChild(textarea)
    editorElement = document.getElementById('editor')
    setTimeout(() => {
      this.buildEditor(editorElement)
    }, 100)
  }

  async buildEditor(element: HTMLElement) {
    LibraryPage.editorValue = this.initialValue
    const config: SimpleMDE.Options = {
      autofocus: true,
      toolbar: [
        'bold',
        'italic',
        'strikethrough',
        '|',
        'heading-1',
        'heading-2',
        'heading-3',
        '|',
        'unordered-list',
        'ordered-list',
        '|',
        'code',
        'link',
        '|',
        'preview',
        '|',
        {
          action: () => false,
          className: 'fa fa-save no-disable',
          name: 'save',
          title: 'Save'
        }
      ],
      autosave: {
        enabled: false,
        uniqueId: 'MyUniqueID',
        delay: 1000
      },
      previewRender() {
        LibraryPage.nodes = []
        let html = LibraryPage.md.render(LibraryPage.editorValue)
        html = html.replace(/<\/p>/g, '</p><br>')
        return html
      },
      status: [
        {
          className: 'saved-status',
          defaultValue: () => null,
          onUpdate: () => null
        },
        'autosave', 'lines', 'words', 'cursor'
      ],
      tabSize: 4
    }
    if(element) {
      config.element = element
    }

    LibraryPage.editor = new SimpleMDE(config)
    await this.$nextTick()
    LibraryPage.editor.value(LibraryPage.editorValue)
    LibraryPage.editor.togglePreviewHandler()

    const toolbarItemPreview = LibraryPage.editor.toolbar.find(item => item.name === 'preview')
    if(toolbarItemPreview) {
      toolbarItemPreview.action = () => {
        LibraryPage.editor.togglePreviewHandler((isActive: boolean) => {
          isActive && this.buildTree()
        })
      }
    }

    const toolbarItemSave = LibraryPage.editor.toolbar.find(item => item.name === 'save')
    if(toolbarItemSave) {
      toolbarItemSave.action = this.save.bind(this)
    }
    this.buildTree()
    this.isRendered = true
    const doc = LibraryPage.editor.codemirror.getDoc()
    const count = doc.lineCount()
    const linkedDoc = doc.linkedDoc({
      from: 0,
      to: count,
      mode: 'html'
    })
    this.links = linked(linkedDoc)
    this.linkClickHandler = (name: string) => {
      let scrolling = false
      this.links.forEach((link: string, index: number): void | null => {
        if(scrolling) {
          return null
        }
        if(link.indexOf(name) > -1) {
          scrolling = true
          LibraryPage.editor.codemirror.scrollIntoView({ line: index, char: 0 }, 200)
          if(index > 0) {
            const scrollInfo = LibraryPage.editor.codemirror.getScrollInfo()
            LibraryPage.editor.codemirror.scrollTo(0, scrollInfo.top + scrollInfo.clientHeight / 2)
          }
        }
      })
    }
    Hub.$on('codemirror-link-click', this.linkClickHandler)
  }

  buildTree(nodes?: ITreeItem[]) {
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
            tree[index] && tree[index].children && tree[index].children.push(item)
            break
          case 3:
            const lastIndex = tree[index].children.length - 1
            tree[index] && tree[index].children && tree[index].children[lastIndex].children.push(item)
        }
      }
    })
    this.setLibraryTree([...cloneDeep(tree)])
  }

  save() {
    const id = this.currentId
    const body = LibraryPage.editor.value()
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
        /* eslint-disable no-console */
        console.error(e)
      })
  }

  mounted() {
    LibraryPage.md = new MarkdownIt({
      html: true,
      xhtmlOut: false,
      breaks: true,
      langPrefix: 'language-',
      linkify: false,
      typographer: false,
      quotes: '«»'
    })

    LibraryPage.md.use(MarkdownItAnchor, {
      slugify: (s: string) => {
        const slug = '_' + translit(s)
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

    const editorElement = this.$el.querySelector('#editor')
    if(!editorElement) {
      return
    }
    this.buildEditor(editorElement)
  }

  async created() {
    await this.queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
    await this.queryBus.exec<LibraryFilesQuery, Array<ILibraryFile>>(new LibraryFilesQuery())
  }
}
