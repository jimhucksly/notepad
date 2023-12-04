import { Prop } from 'vue-property-decorator'
import { Options, Vue } from 'vue-class-component'

@Options({
  template: `
    <div class="loader" :class="{ small, full }">
      <svg-icon
        :icon="small ? 'loader-sm' : 'loader'"
        :width="small ? '18px' : '30px'"
        :height="small ? '18px' : '30px'"
      />
    </div>
  `
})
export default class LoaderComponent extends Vue {
  @Prop({ type: Boolean, default: false }) small: boolean
  @Prop({ type: Boolean, default: true }) full: boolean
}
