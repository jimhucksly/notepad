import { Options, Vue } from 'vue-class-component';
import { Prop, Watch } from 'vue-property-decorator';

/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const ace = require('brace');

@Options({
  beforeUnmount() {
    this.editor.destroy();
    this.editor.container.remove();
  },
  template: `
    <div :style="{ height: height ? px(height) : '100%', width: width ? px(width) : '100%' }"></div>
  `,
})
export default class VueAceEditor extends Vue {
  @Prop() modelValue: string;
  @Prop() lang: string;
  @Prop() theme: string;
  @Prop() height: string;
  @Prop() width: string;
  @Prop() options: Record<string, unknown>;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  editor: any = null;
  contentBackup = '';

  mounted() {
    const lang = this.lang || 'text';
    const theme = this.theme || 'chrome';

    require('brace/ext/emmet');

    const editor = (this.editor = ace.edit(this.$el));
    editor.$blockScrolling = Infinity;

    this.$emit('init', editor);

    editor.getSession().setMode(typeof lang === 'string' ? 'ace/mode/' + lang : lang);
    editor.setTheme('ace/theme/' + theme);
    if (this.modelValue) {
      editor.setValue(this.modelValue, 1);
    }
    this.contentBackup = this.modelValue;

    editor.on('change', () => {
      const content = editor.getValue();
      this.$emit('update:modelValue', content);
      this.contentBackup = content;
    });

    if (this.options) {
      editor.setOptions(this.options);
    }
  }

  @Watch('value') onValueChanged(val: string) {
    if (this.contentBackup !== val) {
      this.editor.session.setValue(val, 1);
      this.contentBackup = val;
    }
  }

  @Watch('theme') onThemeChanged(newTheme: string) {
    this.editor.setTheme('ace/theme/' + newTheme);
  }

  @Watch('lang') onLangChanged(newLang: string) {
    this.editor.getSession().setMode(typeof newLang === 'string' ? 'ace/mode/' + newLang : newLang);
  }

  @Watch('options') onOptionsChanged(newOption: Record<string, unknown>) {
    this.editor.setOptions(newOption);
  }

  @Watch('height') onHeightChanged() {
    this.$nextTick(() => {
      this.editor.resize();
    });
  }

  @Watch('width') onWidthChanged() {
    this.$nextTick(() => {
      this.editor.resize();
    });
  }

  px(n: string) {
    if (/^\d*$/.test(n)) {
      return n + 'px';
    }
    return n;
  }
}
