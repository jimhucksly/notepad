import { EditorView } from '@codemirror/view';
import { delay, uniqueID } from '@dn-web/core';
import cloneDeep from 'lodash/cloneDeep';
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import { config, MdEditor, StaticTextDefaultValue } from 'md-editor-v3';
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { Getter, Mutation } from 'vuex-class';
import { Plugins } from '~/core';
import { translit } from '~/helpers';
import { UpdateLibraryCommand } from './commands/commands';
import { ILibraryFile, ITreeItem } from './models';
import { LibraryFileQuery, LibraryFilesQuery } from './queries/queries';

@Options({
  components: {
    'md-editor': MdEditor,
  },
})
export default class LibraryPage extends Vue {
  @Mutation('Library/setLibraryTree') setLibraryTree: (value: Array<ITreeItem>) => void;
  @Mutation('Library/setLibraryData') setLibraryData: (body: string) => void;
  @Mutation('Library/setLibraryFileId') setFileId: (id: string | number) => void;

  @Getter('Library/getLibraryData') initialValue: string;
  @Getter('Library/getLibraryFileId') currentId: string;

  isNewFile = false;
  isPreview = true;
  ready = false;
  template = '';
  value = '';

  /* eslint-disable-next-line sonarjs/public-static-readonly */
  static nodes: ITreeItem[] = [];
  /* eslint-disable-next-line sonarjs/public-static-readonly */
  static md: MarkdownIt = null;

  linkClickHandler: (name: string) => void;

  @Watch('currentId') async onCurrentIdChanged(id: string | number) {
    try {
      await this.$app.$queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery(id));
      this.value = this.initialValue;
      if (this.isPreview) {
        this.previewRender();
      } else {
        this.toggle(true);
      }
    } catch (e) {
      /* eslint-disable no-console */
      console.error(e);
    }
  }

  created() {
    this.$app.$queryBus.exec<LibraryFilesQuery, Array<ILibraryFile>>(new LibraryFilesQuery());
  }

  async mounted() {
    this.linkClickHandler = this.linkClick.bind(this);
    Plugins.Hub.$on('codemirror-link-click', this.linkClickHandler);
    await this.$app.$queryBus.exec<LibraryFileQuery, string>(new LibraryFileQuery());
    this.buildEditor();

    LibraryPage.md = new MarkdownIt();

    LibraryPage.md.use(MarkdownItAnchor, {
      slugify: (s: string) => {
        const slug = '_' + translit(s);
        LibraryPage.nodes.push({
          name: s || '',
          slug: slug || '',
          id: uniqueID(8) as string,
          children: [],
        });
        return slug;
      },
      level: [1, 2, 3],
      permalink: true,
      permalinkClass: 'md-anchor',
      permalinkBefore: false,
    });
    this.value = this.initialValue;
    this.previewRender();
  }

  beforeUnmount() {
    this.setFileId(0);
    Plugins.Hub.$off('codemirror-link-click', this.linkClickHandler);
  }

  buildEditor() {
    config({
      editorConfig: {
        languageUserDefined: {
          'ru-RU': this.ru_RU,
        },
      },
    });

    this.ready = true;
    this.$nextTick(() => {
      const content = document.querySelector('.cm-content');
      if (content) {
        const editor = (content as unknown as { cmView: { view: EditorView } })?.cmView?.view;
        if (editor) {
          // const lines: Array<string> = [];
          // const children = editor.state.doc.children;
          // for (const el of children) {
          //   lines.push(...(el as unknown as { text: Array<string> }).text);
          // }
        }
      }
    });
  }

  buildTree(nodes?: ITreeItem[]) {
    const tree: Array<ITreeItem> = [];
    let index = -1;
    const items = nodes || LibraryPage.nodes;
    items.forEach(item => {
      const node = document.querySelector('#' + item.slug);
      if (node) {
        const level = Number(node.tagName.slice(-1));
        switch (level) {
          case 1:
            tree.push(item);
            index++;
            break;
          case 2:
            if (tree[index] && tree[index].children) {
              tree[index].children.push(item);
            }
            break;
          case 3:
            const lastIndex = tree[index].children.length - 1;
            if (tree[index] && tree[index].children) {
              tree[index].children[lastIndex].children.push(item);
            }
        }
      }
    });
    this.setLibraryTree([...cloneDeep(tree)]);
  }

  save() {
    const id = this.currentId;
    const body = this.value;
    const promise = this.$app.$commandBus.do<UpdateLibraryCommand, void>(new UpdateLibraryCommand(id, body));
    Promise.all([promise])
      .then(() => {
        this.setFileId(id);
      })
      .catch(e => {
        /* eslint-disable no-console */
        console.error(e);
      });
  }

  toggle(state: boolean) {
    if (state === this.isPreview) {
      return;
    }
    this.isPreview = state;
    if (this.isPreview) {
      this.previewRender();
    }
  }

  previewRender() {
    LibraryPage.nodes = [];
    this.template = LibraryPage.md.render(this.value);
    this.$nextTick(() => {
      this.buildTree();
    });
  }

  async linkClick(item: ITreeItem) {
    if (this.isPreview) {
      return;
    }
    const contains = (selector: string, text: string): Array<HTMLElement> => {
      const editor = this.$el.querySelector('.cm-editor');
      const elements = editor.querySelectorAll(selector);
      return Array.prototype.filter.call(elements, (element: HTMLElement) => element.textContent.indexOf(text) > -1);
    };
    const scroller = this.$el.querySelector('.cm-scroller') as HTMLElement;
    if (scroller) {
      scroller.scrollTo(0, 0);
      await delay(10);
      let needSearch = true;
      let scrollY = 0;
      const scrollH = scroller.scrollHeight;
      while (needSearch) {
        const span = contains('span', item.name);
        if (span.length > 0 || scrollY > scrollH) {
          needSearch = false;
          scroller.scrollTo(0, scrollY + 300);
        }
        if (needSearch) {
          scrollY += 300;
          scroller.scrollTo(0, scrollY);
          await delay(10);
        }
      }
    }
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
      'code',
    ];
  }

  /* eslint-disable-next-line @typescript-eslint/naming-convention */
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
        github: 'source code',
      },
      titleItem: {
        h1: 'Lv1 Heading',
        h2: 'Lv2 Heading',
        h3: 'Lv3 Heading',
        h4: 'Lv4 Heading',
        h5: 'Lv5 Heading',
        h6: 'Lv6 Heading',
      },
    };
  }
}
