import { ValidateMixin } from '@dn-web/ui';
import { mixins } from 'vue-class-component';
import { Types } from '~/core';

export default class CreateEditLibraryFileComponent extends mixins(ValidateMixin) {
  name = '';

  v: Types.IValidate = {};

  isSubmitted = false;

  created() {
    this.$emit('popup-component-created', this);
  }

  async save() {
    this.isSubmitted = true;
    if (!(await this.validate())) {
      return;
    }
    this.$emit('set-result', {
      name: this.name,
    });
  }
}
