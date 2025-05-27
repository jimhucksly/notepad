import { Vue } from 'vue-class-component'
import { Emit, Prop, Watch } from 'vue-property-decorator'
import { IFile } from './models'

export default class File extends Vue {
  @Prop() item: IFile
  @Prop() index: number
  @Prop() selected: boolean
  @Prop() checking: boolean
  @Prop() checked: boolean

  isChecked = false

  onResizeHandler: () => void

  @Emit('on-select') onSelect() {
    return this.checking ? null : this.item.id
  }

  @Emit('on-check') onCheck() {
    return this.item.id
  }

  @Watch('index') onIndexChanged() {
    this.setPosition()
  }

  @Watch('isChecked') onIsCheckedChanged() {
    this.onCheck()
  }

  mounted() {
    this.setPosition()
    this.onResizeHandler = this.setPosition.bind(this)
    window.addEventListener('resize', this.onResizeHandler)
  }

  setPosition() {
    const elemW = 65
    const gap = 8
    const count = Math.floor(this.parent.clientWidth / (elemW + gap * 2)) + 1
    const row = Math.floor(this.index / count)
    const index = this.index - row * count
    const x = gap + index * (gap + elemW)
    let h = elemW
    if (row > 0) {
      let topLevelElems: Array<Element> = []
      this.parent.querySelectorAll('.file').forEach(el => topLevelElems.push(el))
      topLevelElems = topLevelElems.slice((row - 1) * count, row * count)
      const hh = topLevelElems.map(el => el.clientHeight)
      h = Math.max(...hh)
    }
    const y = gap + row * (h + gap)
    this.$el.style.transform = `translate(${x}px, ${y}px)`
  }

  get type(): string {
    return this.getFileType(this.item.extension)
  }

  get parent(): HTMLElement {
    return this.$parent.$el
  }

  private getFileType(name: string): string {
    if (/jpe?g$/.test(name)) return 'jpg'
    if (/png$/.test(name)) return 'png'
    if (/gif$/.test(name)) return 'image'
    if (/html?$/.test(name)) return 'html'
    if (/js$/.test(name)) return 'js'
    if (/d.ts$/.test(name)) return 'dts'
    if (/ts$/.test(name)) return 'ts'
    if (/json$/.test(name)) return 'json'
    if (/vue$/.test(name)) return 'vue'
    if (/(sass|scss)$/.test(name)) return 'sass'
    if (/css$/.test(name)) return 'css'
    if (/svg$/.test(name)) return 'svg'
    if (/docx?$/.test(name)) return 'doc'
    if (/pdf$/.test(name)) return 'pdf'
    if (/txt$/.test(name)) return 'txt'
    if (/zip$/.test(name)) return 'zip'
    if (/rar$/.test(name)) return 'rar'
    if (/md$/.test(name)) return 'md'
    if (/7z$/.test(name)) return '7z'
    if (/xlsx?$/.test(name)) return 'xls'
    if (/exe?$/.test(name)) return 'exe'
    if (/msi?$/.test(name)) return 'msi'
    if (/(cer|crt)?$/.test(name)) return 'cer'
    if (/pfx?$/.test(name)) return 'pfx'
    return 'default'
  }
}
