import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { Types } from '~/core';
import { ILink } from '../models';

export default class CreateEditLinkComponent extends Vue {
  @Prop() item: ILink;

  url = '';
  linkName = '';

  v: Types.IValidate = {};

  isSubmitted = false;

  created() {
    if (this.item) {
      this.url = this.item.url;
      this.linkName = this.item.name;
    }
    this.$emit('popup-component-created', this);
  }

  mounted() {
    this.$validate(this);
  }

  async validate(): Promise<boolean> {
    await this.v.touch();
    return this.v.valid();
  }

  async save() {
    this.isSubmitted = true;
    if (!(await this.validate())) {
      return;
    }
    const o: ILink = {
      url: this.url,
      name: this.linkName,
    };
    if (this.item?.id) {
      o.id = this.item.id;
    }
    this.$emit('set-result', o);
  }
}
