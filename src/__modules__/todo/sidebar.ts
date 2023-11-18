import { Vue } from 'vue-class-component'
import { Hub } from '~/plugins/hub'

export default class TodoSidebar extends Vue {
  addTodo() {
    Hub.$emit('todo-add')
  }
}
