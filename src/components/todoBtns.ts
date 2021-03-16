import { Vue, Component } from 'vue-property-decorator'

@Component({
  name: 'TodoBtns'
})
export default class TodoBtns extends Vue {
  add() {
    this.$electron.ipcRenderer.send('todo-add')
  }
}
