<template>
  <div class="editor_wrapper" v-show="isRendered">
    <textarea name="editor" id="editor"></textarea>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { cloneDeep } from 'lodash'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit } from '@/helpers'

let autosaveTimeout = null

const nodes = []

const md = new MarkdownIt({
  html: false,
  xhtmlOut: false,
  breaks: false,
  langPrefix: 'language-',
  linkify: false,
  typographer: false,
  quotes: '“”‘’',
  highlight(str, lang) { return '' }
})

md.use(MarkdownItAnchor, {
  slugify: s => {
    const slug = translit(s)
    nodes.push({
      name: s || '',
      slug: slug || ''
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
    'guide'
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
  previewRender(plainText) {
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
    codeSyntaxHighlighting: true
  },
  // shortcuts: {
  //   drawTable: 'Cmd-Alt-T'
  // },
  // showIcons: ['code', 'table'],
  // spellChecker: false,
  // status: false,
  // status: ['autosave', 'lines', 'words', 'cursor'],
  // status: ['autosave', 'lines', 'words', 'cursor', {
  //   className: 'keystrokes',
  //   defaultValue: function(el) {
  //     this.keystrokes = 0;
  //     el.innerHTML = '0 Keystrokes'
  //   },
  //   onUpdate: function(el) {
  //     el.innerHTML = ++this.keystrokes + ' Keystrokes'
  //   }
  // }],
  // styleSelectedText: false,
  tabSize: 2
  // toolbar: true,
  // toolbarTips: true
}

export default {
  name: 'Markdown',
  data() {
    return {
      editor: null,
      isRendered: false
    }
  },
  computed: {
    ...mapGetters({
      initialValue: 'getMd'
    })
  },
  methods: {
    buildTree() {
      const tree = []
      let index = -1
      nodes.forEach(item => {
        const node = document.getElementById(item.slug)
        if(node) {
          const level = +node.tagName.slice(-1)
          switch(level) {
            case 1:
              item.children = []
              tree.push(item)
              index++
              break
            case 2:
              item.children = []
              tree[index].children.push(item)
              break
            case 3:
              const lastIndex = tree[index].children.length - 1
              tree[index].children[lastIndex].children.push(item)
          }
        }
      })
      this.$store.dispatch('mdTree', cloneDeep(nodes))
    }
  },
  mounted() {
    const editor = document.getElementById('editor')
    if(editor) {
      this.editor = new SimpleMDE({
        element: document.getElementById('editor'),
        ...config
      })
      this.editor.value(this.initialValue)
      this.editor.togglePreview()
      this.isRendered = true
      this.buildTree()
      autosaveTimeout = null
      this.editor.codemirror.on('change', () => {
        clearTimeout(autosaveTimeout)
        autosaveTimeout = setTimeout(() => {
          this.$store.dispatch('md', this.editor.value())
          console.log('save it!!!!!!!!!!!!')
        }, 2000)
      })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('mdTree', [])
  }
}
</script>
<style lang="scss">
.editor_wrapper {
  display: flex;
  flex-direction: column;
  flex-basis: 100;

  .editor-toolbar {
    flex-basis: 50px;
    flex-shrink: 0
  }

  .CodeMirror {
    height: auto;
    min-height: auto;
    flex-basis: 100%;
    flex-grow: 1;
  }

  .CodeMirror-scroll {
    min-height: 100%;
  }
}
</style>
