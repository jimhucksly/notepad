import { ValidateMixin } from '@dn-web/ui';
import { mixins } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ILink } from '../models';

export default class CreateEditLinkComponent extends mixins(ValidateMixin) {
  @Prop({ type: Object, default: (): ILink => ({ id: null, url: '', name: '' }) }) item: ILink;

  internalModel: ILink = {
    id: null,
    url: '',
    name: '',
  };

  created() {
    if (this.item?.id) {
      this.internalModel = { ...this.item };
    }
    this.$emit('external-component-created', this);
  }

  save() {
    if (!this.validate()) {
      return;
    }
    this.$emit('set-result', this.internalModel);
  }
}
