import { Watch } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'
import cloneDeep from 'lodash/cloneDeep'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit, uniqueid } from '~/helpers'
// import { UpdateLibraryCommand } from '~/domain/commands'
import { Getter, Mutation } from 'vuex-class'
import { ILibraryFile, ITreeItem } from '~/domain/models'
import { Hub } from '~/plugins/hub'
import { LibraryFileQuery, LibraryFilesQuery } from '~/domain/queries'
import { config, MdEditor, StaticTextDefaultValue } from 'md-editor-v3'
import { EditorView } from '@codemirror/view'

@Options({
  components: {
    'md-editor': MdEditor
  }
})
export default class LibraryPage extends Vue {
  @Mutation('library/setLibraryTree') setLibraryTree: (value: Array<ITreeItem>) => void
  @Mutation('library/setLibraryData') setLibraryData: (body: string) => void
  @Mutation('library/setLibraryFileId') setFileId: (id: string | number) => void

  @Getter('library/getLibraryData') initialValue: string
  @Getter('library/getLibraryFileId') currentId: string

  isNewFile = false
  isPreview = true
  ready = false
  template = ''
  value = ''

  static nodes: ITreeItem[] = []
  static md: MarkdownIt = null

  linkClickHandler: (name: string) => void

  @Watch('currentId') async onCurrentIdChanged(id: string | number) {
    try {
      await this.$app.$queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery(id))
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e)
    }
  }

  // @Watch('initialValue') onInitialValueChanged() {
  //   if (this.isPreview) {
  //     this.previewRender(this.initialValue)
  //     this.updating = true
  //     this.$nextTick(() => {
  //       this.updating = false
  //       this.buildTree()
  //     })
  //     const container = this.$refs.editor_text as HTMLElement
  //     if (container) {
  //       container.innerHTML = ''
  //       LibraryPage.editor = null
  //     }
  //   } else {
  //     LibraryPage.editor.value(this.initialValue)
  //   }
  // }

  async created() {
    await this.$app.$queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery())
    await this.$app.$queryBus.exec<LibraryFilesQuery, Array<ILibraryFile>>(new LibraryFilesQuery())
  }

  mounted() {
    this.buildEditor()

    LibraryPage.md = new MarkdownIt()

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
    this.value = this.initialValue
    this.previewRender()
    this.buildTree()
  }

  beforeUnmount() {
    this.setFileId(0)
    Hub.$off('codemirror-link-click', this.linkClickHandler)
  }

  buildEditor() {
    config({
      editorConfig: {
        languageUserDefined: {
          /* eslint-disable-next-line @typescript-eslint/naming-convention */
          'ru-RU': this.ru_RU
        }
      }
    })

    this.ready = true
    this.$nextTick(() => {
      const editor = (document.querySelector('.cm-content') as unknown as { cmView: { view: EditorView } }).cmView.view
      const scroll = editor.scrollDOM
      const lines: Array<string> = []
      const children = editor.state.doc.children
      for (const el of children) {
        lines.push(...(el as unknown as { text: Array<string> }).text)
      }
      const linkClickHandler = (name: string) => {
        const scrolling = false
        lines.forEach((el: string, index: number): void | null => {
          if (scrolling) {
            return null
          }
          if (el.indexOf(name) > -1) {
            const line = editor.state.doc.line(index + 1)
            editor.scrollDOM.scrollTo(0, line.number * 20 - scroll.clientHeight / 2 + 20)
          }
        })
      }
      Hub.$on('codemirror-link-click', linkClickHandler)
    })
  }

  async buildTree(nodes?: ITreeItem[]) {
    const tree: Array<ITreeItem> = []
    let index = -1
    const items = nodes || LibraryPage.nodes
    await this.$nextTick()
    items.forEach(item => {
      const node = document.querySelector('#' + item.slug)
      if (node) {
        const level = +node.tagName.slice(-1)
        switch (level) {
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
    // const id = this.currentId
    // const body = LibraryPage.editor.value()
    // const promise = this.$app.$commandBus.do<UpdateLibraryCommand, void>(
    //   new UpdateLibraryCommand(id, body)
    // )
    // Promise
    //   .all([promise])
    //   .then(() => {
    //     const statusBar = this.$el.querySelector('.editor-statusbar')
    //     if (statusBar) {
    //       const savedSatus = statusBar.querySelector('.saved-status')
    //       const message = 'Markdown is successfully saved!'
    //       savedSatus && (savedSatus.innerHTML = message)
    //       setTimeout(() => {
    //         savedSatus && (savedSatus.innerHTML = '')
    //       }, 3000)
    //     }
    //     this.setFileId(id)
    //     this.toggle(true)
    //   })
    //   .catch(e => {
    //     /* eslint-disable no-console */
    //     console.error(e)
    //   })
  }

  toggle(state: boolean) {
    if (state === this.isPreview) {
      return
    }
    this.isPreview = state
    if (this.isPreview) {
      this.previewRender()
      this.buildTree()
    }
  }

  previewRender() {
    LibraryPage.nodes = []
    this.template = LibraryPage.md.render(this.value)
  }

  get toolbars() {
    return [
      'bold',
      'underline',
      'italic',
      '-',
      'title',
      'strikeThrough',
      'sub',
      'sup',
      'quote',
      'unorderedList',
      'orderedList',
      '-',
      'codeRow',
      'code'
    ]
  }

  /* eslint-disable-next-line camelcase */
  get ru_RU(): StaticTextDefaultValue {
    return {
      toolbarTips: {
        bold: 'Полужирный',
        underline: 'Подчеркнутый',
        italic: 'Курсив',
        strikeThrough: 'strikeThrough',
        title: 'Заголовок',
        sub: 'subscript',
        sup: 'superscript',
        quote: 'quote',
        unorderedList: 'Список',
        orderedList: 'Нумерованный список',
        task: 'task list',
        codeRow: 'Программый код',
        code: 'block-level code',
        link: 'Создать ссылку',
        image: 'image',
        table: 'Добавить таблицу',
        mermaid: 'mermaid',
        katex: 'formula',
        revoke: 'revoke',
        next: 'undo revoke',
        save: 'save',
        prettier: 'prettier',
        pageFullscreen: 'fullscreen in page',
        fullscreen: 'fullscreen',
        preview: 'Превью',
        htmlPreview: 'html preview',
        catalog: 'catalog',
        github: 'source code'
      },
      titleItem: {
        h1: 'Lv1 Heading',
        h2: 'Lv2 Heading',
        h3: 'Lv3 Heading',
        h4: 'Lv4 Heading',
        h5: 'Lv5 Heading',
        h6: 'Lv6 Heading'
      }
    }
  }
}
