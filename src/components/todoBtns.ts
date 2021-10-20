import { Hub } from '~/plugins/hub'
import { Vue } from 'vue-class-component'

export default class TodoBtns extends Vue {
  add() {
    Hub.$emit('todo-add')
  }
}
