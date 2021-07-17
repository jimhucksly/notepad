import { Vue, Component } from 'vue-property-decorator'
import { Hub } from '~/plugins/hub'

@Component({
  name: 'TodoBtns'
})
export default class TodoBtns extends Vue {
  add() {
    Hub.$emit('todo-add')
  }
}
