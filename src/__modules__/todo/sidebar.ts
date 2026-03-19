import { Vue } from 'vue-class-component';
import { Plugins } from '~/core';

export default class TodoSidebar extends Vue {
  addTodo() {
    Plugins.Hub.$emit('todo-add');
  }
}
