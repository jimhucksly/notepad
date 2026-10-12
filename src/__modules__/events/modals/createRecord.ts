import { Prop, Vue } from 'vue-property-decorator';

export default class CreateRecordModal extends Vue {
  @Prop() model: unknown;

  created() {
    this.$emit('external-component-created', this);
  }

  save() {
    return this.model;
  }
}
