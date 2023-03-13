import { Vue } from 'vue-class-component'
import { Emit, Prop, Watch } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { IFile } from '~/domain/models'
import { getFileType } from '~/helpers'

export default class File extends Vue {
  @Prop() item: IFile
  @Prop() index: number
  @Prop() selected: boolean
  @Prop() checking: boolean
  @Prop() checked: boolean

  isChecked = false

  @Getter('getDownloadsTargetPath') targetPath: string

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
    return getFileType(this.item.extension)
  }

  get parent(): HTMLElement {
    return this.$parent.$el
  }
}
