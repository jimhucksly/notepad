<template>
  <div class="editor_wrapper" v-show="isRendered">
    <textarea name="editor" id="editor"></textarea>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SimpleMDE from 'simplemde'
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import { translit } from '@/helpers'

const tree = []

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
    tree.push({
      name: s || '',
      slug: slug || ''
    })
    return slug
  },
  level: 1,
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
  // parsingConfig: {
  //   allowAtxHeaderWithoutSpace: true,
  //   strikethrough: false,
  //   underscoresBreakWords: true
  // }
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
  // renderingConfig: {
  //   singleLineBreaks: false,
  //   codeSyntaxHighlighting: true
  // },
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
  mounted() {
    this.editor = new SimpleMDE({
      element: document.getElementById('editor'),
      ...config
    })
    this.editor.value(this.initialValue)
    this.editor.togglePreview()
    this.isRendered = true
    this.$store.dispatch('mdTree', tree)
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
