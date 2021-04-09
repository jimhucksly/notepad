import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'LibraryFiles'
})
export default class LibraryFiles extends Vue {
  @Prop({ type: Boolean, default: false })
  init!: boolean
}
