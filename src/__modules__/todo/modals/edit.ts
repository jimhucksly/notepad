import { Vue } from 'vue-class-component';
import { Prop } from 'vue-property-decorator';
import { ITodoItem } from '../models';

export default class EditTodoItem extends Vue {
  @Prop() model: ITodoItem;

  internalModel: ITodoItem = {
    id: null,
    date: null,
    text: null,
    order: null,
  };

  created() {
    if (this.model) {
      this.internalModel = {
        ...this.model,
      };
    }
    this.$emit('external-component-created', this);
  }

  save() {
    return this.internalModel;
  }
}
