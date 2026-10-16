import { Vue } from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { IFile } from './models';

export default class File extends Vue {
  @Prop() item: IFile;
  @Prop() index: number;
  @Prop() selected: boolean;
  @Prop() checking: boolean;
  @Prop() checked: boolean;

  isChecked = false;

  @Emit('on-select') onSelect() {
    return this.checking ? null : this.item.id;
  }

  @Emit('on-check') onCheck() {
    return this.item.id;
  }

  @Watch('isChecked') onIsCheckedChanged() {
    this.onCheck();
  }

  get type(): string {
    return this.getFileType(this.item.extension);
  }

  get parent(): HTMLElement {
    return this.$parent.$el;
  }

  private getFileType(name: string): string {
    if (/jpe?g$/.test(name)) {
      return 'jpg';
    }
    if (/png$/.test(name)) {
      return 'png';
    }
    if (/gif$/.test(name)) {
      return 'image';
    }
    if (/html?$/.test(name)) {
      return 'html';
    }
    if (/js$/.test(name)) {
      return 'js';
    }
    if (/d.ts$/.test(name)) {
      return 'dts';
    }
    if (/ts$/.test(name)) {
      return 'ts';
    }
    if (/json$/.test(name)) {
      return 'json';
    }
    if (/vue$/.test(name)) {
      return 'vue';
    }
    if (/(sass|scss)$/.test(name)) {
      return 'sass';
    }
    if (/css$/.test(name)) {
      return 'css';
    }
    if (/svg$/.test(name)) {
      return 'svg';
    }
    if (/docx?$/.test(name)) {
      return 'doc';
    }
    if (/pdf$/.test(name)) {
      return 'pdf';
    }
    if (/txt$/.test(name)) {
      return 'txt';
    }
    if (/zip$/.test(name)) {
      return 'zip';
    }
    if (/rar$/.test(name)) {
      return 'rar';
    }
    if (/md$/.test(name)) {
      return 'md';
    }
    if (/7z$/.test(name)) {
      return '7z';
    }
    if (/xlsx?$/.test(name)) {
      return 'xls';
    }
    if (/exe?$/.test(name)) {
      return 'exe';
    }
    if (/msi?$/.test(name)) {
      return 'msi';
    }
    if (/(cer|crt)?$/.test(name)) {
      return 'cer';
    }
    if (/pfx?$/.test(name)) {
      return 'pfx';
    }
    return 'default';
  }
}
