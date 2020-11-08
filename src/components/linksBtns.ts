import { Vue, Component } from 'vue-property-decorator'
import BtnAdd from '~/components/btnAdd'

@Component({
  name: 'LinksBtns',
  components: {
    BtnAdd
  }
})
export default class LinksBtns extends Vue {
  protected add() {
    this.$popup.open('linkAdd')
  }
}
