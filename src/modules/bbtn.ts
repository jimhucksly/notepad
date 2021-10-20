import { Options, Vue } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Options({
  template: `
    <button
      class="btn"
      :class="{
        'btn-primary': primary,
        'btn-processing': processing
      }"
      @click="$emit('click', e)"
    >
      <template v-if="processing">
        <span v-for="i in [1, 2, 3]" :key="i" :class="'processing-indicator-' + i"></span>
      </template>
      <template v-else>
        <span>{{ label }}</span>
      </template>
    </button>
  `
})
export default class BBtnComponent extends Vue {
  @Prop() primary: boolean
  @Prop() processing: boolean
  @Prop({ type: String, default: 'Submit' }) label: string
}
