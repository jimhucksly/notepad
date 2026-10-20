import { Vue } from 'vue-class-component';
import { Emit, Prop, Watch } from 'vue-property-decorator';
import { IFile } from './models';
import { FileType, fileTypes } from './types';

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

  private getFileType(ext: string): string {
    for (const i of fileTypes.keys()) {
      const o = fileTypes.get(i);
      if (o.regexp.test(ext)) {
        return i;
      }
    }
    return FileType.Unknown;
  }
}
