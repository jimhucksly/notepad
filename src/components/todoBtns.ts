import { Hub } from '~/plugins/hub'
import { Options, Vue } from 'vue-class-component'

@Options({
  template: `
    <div class="todo">
      <button @click="add">
        <svg-icon icon="btnAdd" width="32" height="23" />
      </button>
    </div>
  `
})
export default class TodoBtns extends Vue {
  add() {
    Hub.$emit('todo-add')
  }
}
