import { eventBus } from '@dn-web/core';
import { Vue } from 'vue-class-component';

export default class TodoSidebar extends Vue {
  addTodo() {
    eventBus.$emit('todo-add');
  }
}
