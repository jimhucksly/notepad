import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import Controls from '~/components/controls'
import File from '~/components/file'

interface IData {
  key: string
  name: string
  date: string
  lock: boolean
  message?: string
  file?: {
    name: string
    link: string
    type: string
  }
}

@Component({
  name: 'NotepadItem',
  components: {
    Controls,
    File
  }
})
export default class NotepadItem extends Vue {
  @Prop({ type: Object, default: () => {} })
  item!: IData

  @Prop({ type: Boolean, default: false })
  isLast!: boolean

  message: string = ""
  isEdit: boolean = false

  @Watch("item")
  onItemChanged(o: IData) {
    this.message = this.item.message || ""
  }

  mounted() {
    this.message = this.item.message || ""
    if(this.isLast) {
      this.$emit("onLastRendered")
    }
  }
}
