import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Options({
  template: `
    <svg
      style="fill: transparent; stroke: transparent"
      :width="width"
      :height="height"
    >
      <use :href="href"></use>
    </svg>
  `
})
export default class SvgIconComponent extends Vue {
  @Prop() icon: string
  @Prop({ type: String, default: '100%' }) width: string
  @Prop({ type: String, default: '100%' }) height: string

  get href(): string {
    return `assets/images/${this.icon}.svg#${this.icon}`
  }
}
