import { Vue } from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { IFile } from './models';

enum FileType {
  Unknown = 'default',
  JPEG = 'jpg',
  PNG = 'png',
  Image = 'image',
  HTML = 'html',
  JS = 'js',
  DTS = 'dts',
  TS = 'ts',
  JSON = 'json',
  VUE = 'vue',
  SASS = 'sass',
  CSS = 'css',
  SVG = 'svg',
  Document = 'doc',
  PDF = 'pdf',
  Text = 'txt',
  ZIP = 'zip',
  RAR = 'rar',
  MD = 'md',
  '7z' = '7z',
  Excel = 'xls',
  EXE = 'exe',
  MSI = 'msi',
  Certificate = 'cer',
  PFX = 'pfx',
}

export default class File extends Vue {
  @Prop() item: IFile;
  @Prop() index: number;
  @Prop() selected: boolean;
  @Prop() rows: Record<number, number>;

  static readonly DefaultSize = 65;
  static readonly DefaultGap = 8;

  row: number = null;
  wrapperWidth: number = null;
  position: { x: number; y: number } = { x: 0, y: 0 };

  mountedPromise: Promise<void> = null;
  mountedPromiseResolve: (value: unknown) => void = null;

  @Emit('on-select') onSelect() {
    return this.item.id;
  }

  @Emit('set-position') emitPosition(row: number, h: number) {
    //
  }

  @Watch('index') onIndexChanged() {
    this.setPosition();
  }

  mounted() {
    this.setPosition();
    window.addEventListener('resize', this.setPosition);
  }

  setPosition() {
    this.wrapperWidth = this.parent.clientWidth;
    this.row = Math.floor(this.index / this.count);
    this.emitPosition(this.row, this.height ? this.height : this.$el.clientHeight);
    const index = this.index - this.row * this.count;
    const topLevelHeight = this.getTopLevelHeight();
    this.position = {
      x: File.DefaultGap + index * (File.DefaultGap + File.DefaultSize),
      y: File.DefaultGap + this.row * (topLevelHeight + File.DefaultGap),
    };
  }

  get type(): string {
    return this.getFileType(this.item.extension);
  }

  get parent(): HTMLElement {
    return this.$parent.$el;
  }

  get count(): number {
    if (!this.wrapperWidth) {
      return 0;
    }
    return Math.floor(this.wrapperWidth / (File.DefaultSize + File.DefaultGap * 2)) + 1;
  }

  get height(): number {
    if (this.rows && this.$utils.isDefined(this.row) && this.rows[this.row]) {
      return this.rows[this.row];
    }
    return null;
  }

  get styles() {
    return {
      height: this.height ? this.height + 'px' : 'auto',
      transform: `translate(${this.position.x}px, ${this.position.y}px)`,
    };
  }

  private getTopLevelHeight(): number {
    if (this.row === 0) {
      return 0;
    }
    if (this.rows && this.$utils.isDefined(this.rows[this.row - 1])) {
      return this.rows[this.row - 1];
    }
    const elems = Array.from(this.parent.querySelectorAll('.file'));
    const topLevelElems = elems.slice((this.row - 1) * this.count, this.row * this.count);
    return Math.max(...topLevelElems.map(el => el.clientHeight));
  }

  private getFileType(ext: string): FileType {
    if (/jpe?g$/.test(ext)) return FileType.JPEG;
    if (/png$/.test(ext)) return FileType.PNG;
    if (/gif$/.test(ext)) return FileType.Image;
    if (/html?$/.test(ext)) return FileType.HTML;
    if (/js$/.test(ext)) return FileType.JS;
    if (/d.ts$/.test(ext)) return FileType.DTS;
    if (/ts$/.test(ext)) return FileType.TS;
    if (/json$/.test(ext)) return FileType.JSON;
    if (/vue$/.test(ext)) return FileType.VUE;
    if (/(sass|scss)$/.test(ext)) return FileType.SASS;
    if (/css$/.test(ext)) return FileType.CSS;
    if (/svg$/.test(ext)) return FileType.SVG;
    if (/docx?$/.test(ext)) return FileType.Document;
    if (/pdf$/.test(ext)) return FileType.PDF;
    if (/txt$/.test(ext)) return FileType.Text;
    if (/zip$/.test(ext)) return FileType.ZIP;
    if (/rar$/.test(ext)) return FileType.RAR;
    if (/md$/.test(ext)) return FileType.MD;
    if (/7z$/.test(ext)) return FileType['7z'];
    if (/xlsx?$/.test(ext)) return FileType.Excel;
    if (/exe?$/.test(ext)) return FileType.EXE;
    if (/msi?$/.test(ext)) return FileType.MSI;
    if (/(cer|crt)$/.test(ext)) return FileType.Certificate;
    if (/pfx?$/.test(ext)) return FileType.PFX;
    return FileType.Unknown;
  }
}
